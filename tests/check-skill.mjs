#!/usr/bin/env node
// Deterministic structural checker for the portable `tina-cms` skill.
//
// Usage:
//   node tests/check-skill.mjs [--root <repo-root>]
//
// Exit codes (tri-state contract):
//   0  clean      - every check passed
//   1  findings   - one or more real defects were found and are listed
//   2  could-not-run - the checker could not execute (missing payload,
//                      unparsable registry, or an internal fault); no traceback
//
// Node built-ins only. The checker reports reality: it never edits the runtime
// payload, and a failure is a finding about the repository, not something the
// checker papers over.

import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));

/** The checker could not run, as opposed to finding a problem. */
class CheckError extends Error {}

const RESEARCH_TOPIC_FILES = [
  "installation.md",
  "tina-cli.md",
  "schema-and-collections.md",
  "content-api-and-graphql.md",
  "deployment.md",
  "tinacloud.md",
  "self-hosted.md",
  "tinadocs-openapi.md",
  "styling.md",
];

const ID_RE = /\b(?:INST|CLI|SCHEMA|API|DEPLOY|CLOUD|SELF|TDOCS|STYLE)-\d{2,}\b/g;

/** Resolve the repository root from --root, else from the script location. */
function resolveRoot(argv) {
  const i = argv.indexOf("--root");
  if (i !== -1) {
    if (!argv[i + 1]) throw new CheckError("--root requires a directory argument");
    return resolve(argv[i + 1]);
  }
  const fromScript = resolve(SCRIPT_DIR, "..");
  if (existsSync(join(fromScript, "skills", "tina-cms", "SKILL.md"))) return fromScript;
  if (existsSync(join(process.cwd(), "skills", "tina-cms", "SKILL.md"))) return process.cwd();
  throw new CheckError("could not locate skills/tina-cms/SKILL.md from the script or cwd");
}

function readText(file) {
  return readFileSync(file, "utf8");
}

/** Recursively list every regular file under a directory (relative paths). */
function listFiles(root) {
  const out = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else out.push(full);
    }
  };
  walk(root);
  return out;
}

/** Minimal top-level YAML scalar parser for the SKILL.md frontmatter block. */
function parseFrontmatter(content) {
  if (!content.startsWith("---")) throw new CheckError("SKILL.md has no YAML frontmatter");
  const end = content.indexOf("\n---", 3);
  if (end === -1) throw new CheckError("SKILL.md frontmatter is not terminated by ---");
  const body = content.slice(3, end).replace(/^\r?\n/, "");
  const fields = {};
  for (const raw of body.split("\n")) {
    const line = raw.replace(/\r$/, "");
    const m = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!m) continue;
    let value = m[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      try {
        value = JSON.parse(value);
      } catch {
        value = value.slice(1, -1);
      }
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }
    fields[m[1]] = value;
  }
  return fields;
}

/** Split a markdown table row into trimmed cells (without the outer pipes). */
function tableCells(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|")) return null;
  const inner = trimmed.replace(/^\|/, "").replace(/\|$/, "");
  return inner.split("|").map((c) => c.trim());
}

function isSeparatorRow(cells) {
  return cells.every((c) => /^:?-{2,}:?$/.test(c));
}

/** Collect data rows of the table that follows a `## ` heading. */
function rowsUnderHeading(lines, headingText) {
  let i = 0;
  while (i < lines.length && !lines[i].startsWith(headingText)) i++;
  const rows = [];
  for (i += 1; i < lines.length && !lines[i].startsWith("## "); i++) {
    const cells = tableCells(lines[i]);
    if (cells) rows.push({ line: i + 1, cells });
  }
  return rows;
}

// ---- path / URL scanning rules ------------------------------------------

const ABS_PATH_RE = /(?:^|[\s("'`])\/(?:home|Users|root|opt|srv|var|etc|mnt|tmp)\//;
// A bare `docs/research/` inside backticks as prose is a boundary statement, not
// a loadable path. A loadable path continues with a filename segment, or is a
// markdown link target, or climbs out with ../ or ./ .
const RESEARCH_PATH_RE = /docs\/research\/[^\s`)\]]/;
const RESEARCH_LINK_RE = /\]\([^)]*docs\/research[^)]*\)/;
const RESEARCH_CLIMB_RE = /\.\.?\/docs\/research/;
const PARENT_ESCAPE_RE = /(?:^|[\s("'`])\.\.\//;

/**
 * Return the list of rule violations for one runtime file's text.
 * `allowUrls` is true only for the source registry, the one file allowed to
 * carry external URLs.
 */
function scanRuntimeText(text, allowUrls) {
  const hits = [];
  if (!allowUrls && /https?:\/\//.test(text)) hits.push("external URL outside source-registry.md");
  if (RESEARCH_PATH_RE.test(text)) hits.push("loadable docs/research/ path");
  if (RESEARCH_LINK_RE.test(text)) hits.push("markdown link into docs/research/");
  if (RESEARCH_CLIMB_RE.test(text)) hits.push("relative climb into docs/research/");
  if (ABS_PATH_RE.test(text)) hits.push("repo-external absolute path");
  return hits;
}

// ---- version registry parsing and detection -----------------------------

/** Parse `>= 3.3.x`, `>= 2.1.8`, `>= 19.0.x` into numeric floor parts. */
function parseFloor(spec) {
  const m = /([<>]=?)?\s*v?(\d+)(?:\.(\d+|[xX*]))?(?:\.(\d+|[xX*]))?/.exec(spec);
  if (!m) return null;
  const num = (v) => (v === undefined || /[xX*]/.test(v) ? null : Number(v));
  return { major: Number(m[2]), minor: num(m[3]), patch: num(m[4]) };
}

function parseVersion(version) {
  const m = /^v?(\d+)(?:\.(\d+|[xX*]))?(?:\.(\d+|[xX*]))?/.exec(String(version).trim());
  if (!m) return null;
  const num = (v) => (v === undefined || /[xX*]/.test(v) ? 0 : Number(v));
  return { major: Number(m[1]), minor: num(m[2]), patch: num(m[3]) };
}

function belowFloor(version, floor) {
  const v = parseVersion(version);
  if (!v) return false;
  if (v.major !== floor.major) return v.major < floor.major;
  if (floor.minor === null) return false;
  if (v.minor !== floor.minor) return v.minor < floor.minor;
  if (floor.patch === null) return false;
  return v.patch < floor.patch;
}

function inWindow(version, win) {
  const v = parseVersion(version);
  if (!v) return false;
  if (v.major < win.fromMajor || v.major > win.toMajor) return false;
  if (v.major === win.fromMajor && v.minor < win.fromMinor) return false;
  if (v.major === win.toMajor && v.minor > win.toMinor) return false;
  return true;
}

const PACKAGE_ALIASES = [
  [/^@tinacms\/cli$/i, "@tinacms/cli"],
  [/^tinacms$/i, "tinacms"],
  [/^next$/i, "next"],
  [/^react(\s*\/\s*react-dom)?$/i, "react"],
  [/^node(\.js)?$/i, "node"],
];

function canonicalPackage(label) {
  const clean = label.replace(/`/g, "").trim();
  for (const [re, name] of PACKAGE_ALIASES) if (re.test(clean)) return name;
  return null;
}

/** Parse floors and known-bad windows out of the version registry. */
function parseVersionRegistry(text) {
  const lines = text.split("\n");
  const floors = {};
  for (const { cells } of rowsUnderHeading(lines, "## B.")) {
    const pkg = canonicalPackage(cells[0] ?? "");
    const floor = cells[1] ? parseFloor(cells[1]) : null;
    if (pkg && floor) floors[pkg] = floor;
  }
  const windows = [];
  for (const { cells } of rowsUnderHeading(lines, "## C.")) {
    const blob = cells.join(" ");
    const m = /(\d+)\.(\d+)\.[xX*]?\s+through\s+(\d+)\.(\d+)\.[xX*]?/.exec(blob);
    if (!m) continue;
    const pkg = /@tinacms\/cli/.test(blob) ? "@tinacms/cli" : "tinacms";
    windows.push({
      pkg,
      fromMajor: Number(m[1]),
      fromMinor: Number(m[2]),
      toMajor: Number(m[3]),
      toMinor: Number(m[4]),
    });
  }
  return { floors, windows };
}

/** Detect below-floor and known-bad-window findings for a version map. */
function detectVersionFindings(registry, versions) {
  const below = [];
  const bad = [];
  for (const [pkg, version] of Object.entries(versions)) {
    const canon = canonicalPackage(pkg) ?? pkg;
    if (registry.floors[canon] && belowFloor(version, registry.floors[canon])) below.push(canon);
    if (registry.windows.some((w) => w.pkg === canon && inWindow(version, w))) bad.push(canon);
  }
  return { below: below.sort(), bad: bad.sort() };
}

// ---- the checks ----------------------------------------------------------

function checkFrontmatter(findings, skillMd) {
  const fields = parseFrontmatter(skillMd);
  if (!fields.name) findings.push({ code: "a.name-missing", message: "SKILL.md frontmatter has no `name`" });
  else if (fields.name !== "tina-cms")
    findings.push({ code: "a.name-value", message: `SKILL.md name is "${fields.name}", expected "tina-cms"` });
  if (!fields.description) {
    findings.push({ code: "a.description-missing", message: "SKILL.md frontmatter has no `description`" });
    return;
  }
  const d = fields.description;
  if (d.length > 1024)
    findings.push({ code: "a.description-long", message: `description is ${d.length} chars, max 1024` });
  if (!/\btina\b/i.test(d))
    findings.push({ code: "a.description-nontina", message: "description does not name Tina (not discriminating)" });
  if (!/(not for|not-for|do not use|outside|no tina)/i.test(d))
    findings.push({ code: "a.description-nodiscriminator", message: "description has no exclusion cue (not discriminating)" });
  if (d.trim().length < 80)
    findings.push({ code: "a.description-thin", message: "description is too thin to discriminate Tina work" });
}

function checkReferenceRouting(findings, root, skillMd) {
  const refDir = join(root, "skills", "tina-cms", "references");
  const files = readdirSync(refDir).filter((f) => f.endsWith(".md")).sort();
  for (const file of files) {
    if (!skillMd.includes(file))
      findings.push({ code: "b.unrouted", message: `reference ${file} is not routed from SKILL.md` });
  }
  for (const m of skillMd.matchAll(/references\/([A-Za-z0-9_.-]+\.md)/g)) {
    if (!existsSync(join(refDir, m[1])))
      findings.push({ code: "b.dangling", message: `SKILL.md references missing file references/${m[1]}` });
  }
}

function checkRuntimeText(findings, root) {
  const payload = join(root, "skills", "tina-cms");
  for (const file of listFiles(payload)) {
    const rel = relative(payload, file);
    const allowUrls = rel === join("references", "source-registry.md");
    const hits = scanRuntimeText(readText(file), allowUrls);
    for (const hit of hits)
      findings.push({ code: "c.runtime-path", message: `skills/tina-cms/${rel}: ${hit}` });
  }
}

function checkSourceRegistry(findings, root) {
  const file = join(root, "skills", "tina-cms", "references", "source-registry.md");
  if (!existsSync(file)) {
    findings.push({ code: "d.missing", message: "references/source-registry.md is missing" });
    return;
  }
  const lines = readText(file).split("\n");
  const rows = [];
  for (let i = 0; i < lines.length; i++) {
    const cells = tableCells(lines[i]);
    if (!cells || isSeparatorRow(cells)) continue;
    if (cells[0] === "topic") continue; // header
    rows.push({ line: i + 1, cells });
  }
  for (const row of rows) {
    if (row.cells.length !== 6) {
      findings.push({ code: "d.columns", message: `source-registry.md:${row.line} has ${row.cells.length} cells, expected 6` });
      continue;
    }
    row.cells.forEach((cell, idx) => {
      if (!cell) findings.push({ code: "d.empty", message: `source-registry.md:${row.line} column ${idx + 1} is empty` });
    });
    if (!/https?:\/\//.test(row.cells[1] ?? ""))
      findings.push({ code: "d.url", message: `source-registry.md:${row.line} URL cell has no URL` });
  }
  if (rows.length < 60)
    findings.push({ code: "d.count", message: `source-registry.md has ${rows.length} rows, need >= 60` });
}

function checkVersionRegistry(findings, root) {
  const file = join(root, "skills", "tina-cms", "references", "version-registry.md");
  if (!existsSync(file)) {
    findings.push({ code: "e.missing", message: "references/version-registry.md is missing" });
    return null;
  }
  const registry = parseVersionRegistry(readText(file));
  if (Object.keys(registry.floors).length === 0)
    findings.push({ code: "e.floors", message: "version-registry.md has no parseable security floors" });
  if (registry.windows.length === 0)
    findings.push({ code: "e.windows", message: "version-registry.md has no parseable known-bad window" });

  // Self-check the detector against fixtures; a mismatch is a real defect.
  const fixtureDir = join(root, "tests", "fixtures", "versions");
  if (!existsSync(fixtureDir)) {
    findings.push({ code: "e.fixtures", message: "tests/fixtures/versions is missing (version detection untested)" });
    return registry;
  }
  for (const name of readdirSync(fixtureDir).filter((f) => f.endsWith(".json")).sort()) {
    let fixture;
    try {
      fixture = JSON.parse(readText(join(fixtureDir, name)));
    } catch (err) {
      throw new CheckError(`fixture ${name} is not valid JSON: ${err.message}`);
    }
    const detected = detectVersionFindings(registry, fixture.versions ?? {});
    const expect = fixture.expect ?? {};
    const eq = (a, b) => JSON.stringify([...(a ?? [])].sort()) === JSON.stringify([...(b ?? [])].sort());
    if (!eq(detected.below, expect.below_floor))
      findings.push({
        code: "e.below-mismatch",
        message: `${name}: below-floor detected ${JSON.stringify(detected.below)} !== expected ${JSON.stringify(expect.below_floor)}`,
      });
    if (!eq(detected.bad, expect.bad_window))
      findings.push({
        code: "e.window-mismatch",
        message: `${name}: bad-window detected ${JSON.stringify(detected.bad)} !== expected ${JSON.stringify(expect.bad_window)}`,
      });
  }
  return registry;
}

function checkResearchTopicFiles(findings, root) {
  const dir = join(root, "docs", "research");
  for (const name of RESEARCH_TOPIC_FILES) {
    const file = join(dir, name);
    if (!existsSync(file)) {
      findings.push({ code: "f.missing", message: `docs/research/${name} is missing` });
      continue;
    }
    const text = readText(file);
    if (!/Provenance:/.test(text))
      findings.push({ code: "f.provenance", message: `docs/research/${name} has no provenance header` });
    if (!/checked\s+\d{4}-\d{2}-\d{2}/.test(text))
      findings.push({ code: "f.date", message: `docs/research/${name} provenance header has no checked date` });
    if (!/recheck trigger/i.test(text))
      findings.push({ code: "f.recheck", message: `docs/research/${name} has no recheck trigger` });
  }
}

function checkFindingIds(findings, root) {
  const dir = join(root, "docs", "research");
  const indexFile = join(dir, "index.md");
  if (!existsSync(indexFile)) {
    findings.push({ code: "g.index", message: "docs/research/index.md is missing" });
    return;
  }
  const lines = readText(indexFile).split("\n");
  const rows = rowsUnderHeading(lines, "## Finding-ID registry");
  const registered = new Map(); // id -> filename
  for (const row of rows) {
    const id = (row.cells[0] ?? "").replace(/`/g, "").trim();
    if (!/^(?:INST|CLI|SCHEMA|API|DEPLOY|CLOUD|SELF|TDOCS|STYLE)-\d{2,}$/.test(id)) continue;
    if (registered.has(id))
      findings.push({ code: "g.duplicate", message: `finding ${id} is registered more than once in index.md` });
    else registered.set(id, (row.cells[row.cells.length - 1] ?? "").trim());
  }
  const seenInTopics = new Set();
  const orphanReported = new Set();
  for (const name of RESEARCH_TOPIC_FILES) {
    const file = join(dir, name);
    if (!existsSync(file)) continue;
    const text = readText(file);
    for (const m of text.matchAll(ID_RE)) {
      seenInTopics.add(m[0]);
      if (registered.has(m[0]) || orphanReported.has(m[0])) continue;
      orphanReported.add(m[0]);
      findings.push({ code: "g.orphan", message: `${m[0]} appears in docs/research/${name} but is not registered in index.md` });
    }
  }
  for (const [id, owner] of registered) {
    if (!seenInTopics.has(id)) {
      findings.push({ code: "g.unbacked", message: `registered ${id} does not appear in any topic file` });
      continue;
    }
    const ownerFile = join(dir, owner);
    if (!owner || !existsSync(ownerFile)) {
      findings.push({ code: "g.owner", message: `registered ${id} names owning file "${owner}" which does not exist` });
      continue;
    }
    if (!new RegExp(`\\b${id}\\b`).test(readText(ownerFile)))
      findings.push({ code: "g.owner-id", message: `registered ${id} is absent from its owning file ${owner}` });
  }
}

function checkPortableCopy(findings, root) {
  const source = join(root, "skills", "tina-cms");
  const dest = mkdtempSync(join(tmpdir(), "tina-skill-copy-"));
  try {
    cpSync(source, dest, { recursive: true });
    for (const file of listFiles(dest)) {
      const rel = relative(dest, file);
      const text = readText(file);
      if (PARENT_ESCAPE_RE.test(text) || ABS_PATH_RE.test(text) || RESEARCH_PATH_RE.test(text))
        findings.push({ code: "h.escape", message: `copied skills/tina-cms/${rel} contains a path escaping the skill dir` });
    }
  } finally {
    rmSync(dest, { recursive: true, force: true });
  }
}

// ---- entry point ---------------------------------------------------------

function main() {
  const findings = [];
  let root;
  try {
    root = resolveRoot(process.argv.slice(2));
    const skillMdPath = join(root, "skills", "tina-cms", "SKILL.md");
    if (!existsSync(skillMdPath)) throw new CheckError(`no SKILL.md under ${root}/skills/tina-cms`);
    if (!existsSync(join(root, "skills", "tina-cms", "references")))
      throw new CheckError("skills/tina-cms/references directory is missing");
    const skillMd = readText(skillMdPath);

    checkFrontmatter(findings, skillMd);
    checkReferenceRouting(findings, root, skillMd);
    checkRuntimeText(findings, root);
    checkSourceRegistry(findings, root);
    checkVersionRegistry(findings, root);
    checkResearchTopicFiles(findings, root);
    checkFindingIds(findings, root);
    checkPortableCopy(findings, root);
  } catch (err) {
    const message = err instanceof CheckError ? err.message : `unexpected failure: ${err.message}`;
    process.stderr.write(`check-skill: could not run: ${message}\n`);
    process.exit(2);
  }

  findings.sort((a, b) => a.code.localeCompare(b.code) || a.message.localeCompare(b.message));
  if (findings.length === 0) {
    process.stdout.write("check-skill: clean (8 checks passed)\n");
    process.exit(0);
  }
  process.stdout.write(`check-skill: ${findings.length} finding(s)\n`);
  for (const f of findings) process.stdout.write(`  [${f.code}] ${f.message}\n`);
  process.exit(1);
}

main();
