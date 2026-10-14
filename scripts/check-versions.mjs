#!/usr/bin/env node
// Deterministic, dependency-free version checker for a Tina-based project.
//
// WHAT IT DOES
//   Reads the authoritative version data from
//   `skills/tina-cms/references/version-registry.md` (the security floors, the
//   known-bad windows, and any blocked-versions deny list) and compares it with
//   the versions actually installed or pinned in a target project. It never
//   keeps a second copy of the registry data: everything it compares against is
//   parsed out of that file at run time.
//
// INPUT CONTRACT
//   node scripts/check-versions.mjs [TARGET] [--json] [--registry <file>]
//                                   [--accept-below-floor <pkg>] [--help]
//
//   TARGET is optional and defaults to the current working directory:
//     * a directory   -> read `package.json` (dependencies + devDependencies and
//                        engines.node), then the lockfile when present
//                        (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`),
//                        then Tina artifacts (`tina/tina-lock.json`,
//                        `tina/__generated__/`). A resolved lockfile version
//                        wins over the declared range.
//     * a *.json file -> read its `versions` object directly. This is the shape
//                        used by tests/fixtures/versions/*.json, so a fixture is
//                        checked with `node scripts/check-versions.mjs <file>`.
//
// EXIT-CODE CONTRACT (tri-state)
//   0  clean         - every resolvable version is at/above its floor and not in
//                      a known-bad window or blocked-versions list. A version the
//                      checker cannot determine is reported as "unknown" and is
//                      NOT a failure: staleness is tri-state (stale fails,
//                      unknown never fails).
//   1  findings      - at least one below-floor, known-bad-window, or blocked
//                      version, or a refused floor downgrade.
//   2  could-not-run - environmental: the target directory/file is missing or
//                      unreadable, package.json exists but is unparseable, or the
//                      registry is missing or unparseable. Never a raw traceback,
//                      and never 1 for an environmental problem.
//
// VERSION POLICY (mirrors references/version-registry.md)
//   * Floors are monotonic. `--accept-below-floor <pkg>` is REFUSED: when a
//     target asks to treat a below-floor version as acceptable, the checker stops
//     and reports it (exit 1) instead of complying.
//   * A user-provided version is a target to verify, not evidence.
//   * Never invent a CVE, a vulnerable range, or a "patched" version. Only the
//     registry is consulted.
//   * @latest caution: do not suggest a release younger than about a week unless
//     it is a CVE fix. The registry records no release dates, so this stays a
//     static note (see LATEST_CAUTION) rather than a computed check.
//
// Node built-ins only; no external dependencies.

import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_REGISTRY = resolve(
  SCRIPT_DIR,
  "..",
  "skills",
  "tina-cms",
  "references",
  "version-registry.md",
);

// Static @latest caution (see the VERSION POLICY header). Kept as a constant
// because the registry records no release dates to compute age from.
const LATEST_CAUTION =
  "do not recommend a release younger than about a week unless it is a CVE fix; the registry does not record release dates, so verify freshness from the source before advising";

/** The checker could not run, as opposed to finding a problem. */
class EnvError extends Error {}

// ---- package identity ----------------------------------------------------

// Tracked packages. `react-dom` shares the `react` floor/window key.
const TRACKED = [
  { re: /^@tinacms\/cli$/i, canon: "@tinacms/cli" },
  { re: /^tinacms$/i, canon: "tinacms" },
  { re: /^next$/i, canon: "next" },
  { re: /^react-dom$/i, canon: "react" },
  { re: /^react$/i, canon: "react" },
  { re: /^node(\.js)?$/i, canon: "node" },
];

/** Display names of the packages the registry tracks (react-dom shares react). */
const TRACKED_NAMES = ["tinacms", "@tinacms/cli", "next", "react", "react-dom"];

/** Map a package label to its registry key, or null when untracked. */
function canonicalPackage(label) {
  const clean = String(label ?? "").replace(/`/g, "").trim();
  for (const { re, canon } of TRACKED) if (re.test(clean)) return canon;
  return null;
}

// ---- version parsing (mirrors tests/check-skill.mjs) ---------------------

/** Parse `>= 3.3.x`, `>= 2.1.8`, `>= 19.0.x` into floor parts (x -> null). */
function parseFloor(spec) {
  const m = /([<>]=?)?\s*v?(\d+)(?:\.(\d+|[xX*]))?(?:\.(\d+|[xX*]))?/.exec(String(spec));
  if (!m) return null;
  const num = (v) => (v === undefined || /[xX*]/.test(v) ? null : Number(v));
  return { major: Number(m[2]), minor: num(m[3]), patch: num(m[4]) };
}

/** Parse a concrete version (x/undefined count as 0). */
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

function sameVersion(a, b) {
  const x = parseVersion(a);
  const y = parseVersion(b);
  return !!x && !!y && x.major === y.major && x.minor === y.minor && x.patch === y.patch;
}

function isVersionLike(value) {
  return typeof value === "string" && /^\d+\.\d+(\.\d+)?([-+][\w.]+)?$/.test(value.trim());
}

/**
 * Extract a concrete version from a declared range (`^3.14.4`, `~19.0.16`,
 * `>=20.9.0`, `20.9.0`). Returns null for non-concrete specs (`latest`,
 * `workspace:*`, `npm:...`, `*`).
 */
function extractVersion(range) {
  const stripped = String(range ?? "").trim().replace(/^[\^~<>=\sv]+/, "");
  const m = /^(\d+(?:\.\d+){0,2}(?:[-+][\w.]+)?)/.exec(stripped);
  return m ? m[1] : null;
}

// ---- markdown table parsing ----------------------------------------------

function tableCells(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|")) return null;
  return trimmed.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
}

function isSeparatorRow(cells) {
  return cells.every((c) => /^:?-{2,}:?$/.test(c));
}

/** Data rows of the table that follows a heading line starting with `heading`. */
function rowsUnderHeading(lines, heading) {
  let i = 0;
  while (i < lines.length && !lines[i].startsWith(heading)) i++;
  const rows = [];
  for (i += 1; i < lines.length && !lines[i].startsWith("## "); i++) {
    const cells = tableCells(lines[i]);
    if (cells) rows.push({ line: i + 1, cells });
  }
  return rows;
}

/** Data rows of the first section whose heading matches `re`. */
function rowsUnderMatchingHeading(lines, re) {
  for (let i = 0; i < lines.length; i++) {
    if (/^##\s/.test(lines[i]) && re.test(lines[i])) {
      const rows = [];
      for (i += 1; i < lines.length && !lines[i].startsWith("## "); i++) {
        const cells = tableCells(lines[i]);
        if (cells) rows.push({ line: i + 1, cells });
      }
      return rows;
    }
  }
  return [];
}

// ---- version registry parsing --------------------------------------------

/**
 * Parse the security floors (section B), known-bad windows (section C), and any
 * blocked-versions deny list out of the version registry. The deny list is read
 * from a section whose heading mentions "blocked" or "deny"; when the registry
 * carries none, `blocked` is empty (that absence is a registry-authoring gap,
 * reported in the evidence, not worked around by hard-coding data here).
 */
function parseVersionRegistry(text) {
  const lines = text.split("\n");
  const floors = {};
  for (const { cells } of rowsUnderHeading(lines, "## B.")) {
    const key = canonicalPackage(cells[0] ?? "");
    const floor = cells[1] ? parseFloor(cells[1]) : null;
    if (key && floor) floors[key] = { floor, text: cells[1].trim() };
  }

  const windows = [];
  for (const { cells } of rowsUnderHeading(lines, "## C.")) {
    const blob = cells.join(" ");
    const m = /(\d+)\.(\d+)\.[xX*]?\s+through\s+(\d+)\.(\d+)\.[xX*]?/.exec(blob);
    if (!m) continue;
    const key = /@tinacms\/cli/.test(blob) ? "@tinacms/cli" : "tinacms";
    windows.push({
      canon: key,
      fromMajor: Number(m[1]),
      fromMinor: Number(m[2]),
      toMajor: Number(m[3]),
      toMinor: Number(m[4]),
      text: `${m[1]}.${m[2]}.x-${m[3]}.${m[4]}.x`,
    });
  }

  const blocked = {};
  for (const { cells } of rowsUnderMatchingHeading(lines, /block|deny/i)) {
    const key = canonicalPackage(cells[0] ?? "");
    if (!key || !cells[1]) continue;
    const versions = String(cells[1])
      .split(/[,;\s]+/)
      .map((v) => v.trim())
      .filter((v) => isVersionLike(v));
    if (versions.length) blocked[key] = [...new Set([...(blocked[key] ?? []), ...versions])];
  }

  return { floors, windows, blocked };
}

// ---- target version collection -------------------------------------------

function readLockfileText(dir) {
  for (const name of ["package-lock.json", "pnpm-lock.yaml", "yarn.lock"]) {
    const p = join(dir, name);
    if (existsSync(p)) {
      try {
        return { name, text: readFileSync(p, "utf8") };
      } catch (err) {
        throw new EnvError(`lockfile ${name} is unreadable: ${err.message}`);
      }
    }
  }
  return null;
}

/** Resolved versions from an npm `package-lock.json`, keyed by display name. */
function parseNpmPackageLock(text, source) {
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    return {}; // a malformed lockfile leaves versions unknown, not environmental
  }
  const out = {};
  const add = (name, version) => {
    if (name in out || !isVersionLike(version)) return;
    if (canonicalPackage(name)) out[name] = { version, source };
  };
  const packages = json.packages;
  if (packages && typeof packages === "object") {
    for (const [path, meta] of Object.entries(packages)) {
      const idx = path.lastIndexOf("node_modules/");
      if (idx === -1) continue;
      add(path.slice(idx + "node_modules/".length), meta?.version);
    }
  }
  const deps = json.dependencies;
  if (deps && typeof deps === "object") {
    for (const [name, meta] of Object.entries(deps)) add(name, meta?.version);
  }
  return out;
}

/** Find the resolved version of `name` in a lockfile's text. */
function findLockedVersion(text, name) {
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    // yarn v1 / berry: pkg@range:  ... version "x" | version: x
    new RegExp(`"?${esc}@[^\\n:]*"?:\\s*\\n\\s*version:?\\s*"?([\\w.+-]+)"?`, "m"),
    // pnpm: name@x:  or  /name/x:
    new RegExp(`${esc}@(\\d+\\.\\d+\\.\\d+[-\\w.+]*)[:,]`, "m"),
    new RegExp(`${esc}\\/(\\d+\\.\\d+\\.\\d+[-\\w.+]*):`, "m"),
  ];
  for (const re of patterns) {
    const m = re.exec(text);
    if (m) return m[1];
  }
  return null;
}

function walkJsonForVersions(node, out, trail) {
  if (Array.isArray(node)) {
    for (const v of node) walkJsonForVersions(v, out, trail);
    return;
  }
  if (!node || typeof node !== "object") return;
  for (const [k, v] of Object.entries(node)) {
    if (typeof v === "string" && isVersionLike(v)) {
      const canon = canonicalPackage(k);
      if (canon && !(canon in out)) out[canon] = v;
      else if (/^version$/i.test(k)) {
        for (let i = trail.length - 1; i >= 0; i--) {
          const tc = canonicalPackage(trail[i]);
          if (tc && !(tc in out)) {
            out[tc] = v;
            break;
          }
        }
      }
    }
    walkJsonForVersions(v, out, [...trail, k]);
  }
}

/** Best-effort versions from Tina artifacts; also reports which dirs exist. */
function readTinaArtifacts(dir) {
  const found = {};
  const present = [];
  const lock = join(dir, "tina", "tina-lock.json");
  if (existsSync(lock)) {
    present.push("tina/tina-lock.json");
    try {
      walkJsonForVersions(JSON.parse(readFileSync(lock, "utf8")), found, []);
    } catch {
      // A malformed artifact is not environmental: ignore it and stay unknown.
    }
  }
  for (const rel of ["tina/__generated__", ".tina/__generated__"]) {
    if (existsSync(join(dir, rel))) present.push(rel);
  }
  return { found, present };
}

function readNodeVersion(dir, pkgJson) {
  for (const [file, source] of [
    [".nvmrc", ".nvmrc"],
    [".node-version", ".node-version"],
  ]) {
    const p = join(dir, file);
    if (existsSync(p)) {
      try {
        const v = extractVersion(readFileSync(p, "utf8").trim());
        if (v) return { version: v, source };
      } catch {
        // fall through to the next source
      }
    }
  }
  const engines = pkgJson?.engines?.node;
  if (typeof engines === "string") {
    const v = extractVersion(engines);
    if (v) return { version: v, source: "package.json#engines.node" };
  }
  return null;
}

/** Resolve the tracked packages of a project directory. */
function collectFromDirectory(dir) {
  let pkgJson = null;
  const pkgPath = join(dir, "package.json");
  if (existsSync(pkgPath)) {
    try {
      pkgJson = JSON.parse(readFileSync(pkgPath, "utf8"));
    } catch (err) {
      throw new EnvError(`package.json is unreadable: ${err.message}`);
    }
  }

  // Declared ranges, keyed by tracked display name.
  const declared = new Map();
  for (const field of ["dependencies", "devDependencies"]) {
    const deps = pkgJson?.[field];
    if (deps && typeof deps === "object") {
      for (const [name, range] of Object.entries(deps)) {
        if (canonicalPackage(name) && !declared.has(name)) declared.set(name, String(range));
      }
    }
  }

  // Resolved lockfile versions (keyed by display name), when a lockfile exists.
  const locked = {};
  const lock = readLockfileText(dir);
  if (lock) {
    if (lock.name === "package-lock.json") {
      Object.assign(locked, parseNpmPackageLock(lock.text, lock.name));
    } else {
      for (const name of TRACKED_NAMES) {
        if (name in locked) continue;
        const v = findLockedVersion(lock.text, name);
        if (v) locked[name] = { version: v, source: lock.name };
      }
    }
  }

  const tina = readTinaArtifacts(dir);
  const nodeVersion = readNodeVersion(dir, pkgJson);

  // A resolved lockfile version wins over the declared range.
  const packages = [];
  for (const name of TRACKED_NAMES) {
    const canon = canonicalPackage(name);
    if (name in locked) packages.push({ name, version: locked[name].version, source: locked[name].source });
    else if (declared.has(name)) packages.push({ name, version: extractVersion(declared.get(name)), source: "package.json" });
    else if (tina.found[canon]) packages.push({ name, version: tina.found[canon], source: "tina artifact" });
  }
  if (nodeVersion) packages.push({ name: "node", version: nodeVersion.version, source: nodeVersion.source });

  return { packages, notes: tina.present.length ? [`tina artifacts present: ${tina.present.join(", ")}`] : [] };
}

/** Read a fixture-style JSON `{ "versions": { ... } }` input. */
function collectFromFixtureFile(file) {
  let json;
  try {
    json = JSON.parse(readFileSync(file, "utf8"));
  } catch (err) {
    throw new EnvError(`input JSON is unreadable: ${err.message}`);
  }
  const versions = json && typeof json === "object" ? json.versions : null;
  if (!versions || typeof versions !== "object") {
    throw new EnvError("input JSON has no `versions` object");
  }
  const packages = Object.entries(versions).map(([name, version]) => ({
    name,
    version: version === null || version === undefined ? null : String(version),
    source: "input",
  }));
  return { packages, notes: [] };
}

function collectTarget(target) {
  let stat;
  try {
    stat = statSync(target);
  } catch {
    throw new EnvError(`target does not exist or is unreadable: ${target}`);
  }
  if (stat.isFile()) return collectFromFixtureFile(target);
  if (stat.isDirectory()) return collectFromDirectory(target);
  throw new EnvError(`target is neither a file nor a directory: ${target}`);
}

// ---- detection -----------------------------------------------------------

function detect(packages, registry) {
  const findings = [];
  const unknown = [];
  const checked = [];
  for (const p of packages) {
    if (!p.version) {
      unknown.push(p.name);
      continue;
    }
    checked.push({ name: p.name, version: p.version, source: p.source });
    const key = canonicalPackage(p.name) ?? p.name;

    const floor = registry.floors[key];
    if (floor && belowFloor(p.version, floor.floor)) {
      findings.push({
        code: "version.below-floor",
        package: p.name,
        version: p.version,
        source: p.source,
        message: `${p.name} ${p.version} is below the security floor ${floor.text}`,
      });
    }
    for (const w of registry.windows) {
      if (w.canon === key && inWindow(p.version, w)) {
        findings.push({
          code: "version.bad-window",
          package: p.name,
          version: p.version,
          source: p.source,
          message: `${p.name} ${p.version} is inside the known-bad window ${w.text}`,
        });
      }
    }
    if (registry.blocked[key]?.some((v) => sameVersion(v, p.version))) {
      findings.push({
        code: "version.blocked",
        package: p.name,
        version: p.version,
        source: p.source,
        message: `${p.name} ${p.version} is on the blocked-versions deny list`,
      });
    }
  }
  return { findings, unknown, checked };
}

// ---- argument parsing and output -----------------------------------------

function parseArgs(argv) {
  const opts = { json: false, target: null, registry: DEFAULT_REGISTRY, acceptBelowFloor: [], help: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--json") opts.json = true;
    else if (arg === "--help" || arg === "-h") opts.help = true;
    else if (arg === "--registry") {
      if (!argv[i + 1]) throw new EnvError("--registry requires a file argument");
      opts.registry = resolve(argv[++i]);
    } else if (arg.startsWith("--registry=")) opts.registry = resolve(arg.slice("--registry=".length));
    else if (arg === "--accept-below-floor") {
      if (!argv[i + 1]) throw new EnvError("--accept-below-floor requires a package argument");
      opts.acceptBelowFloor.push(argv[++i]);
    } else if (arg.startsWith("--accept-below-floor=")) opts.acceptBelowFloor.push(arg.slice("--accept-below-floor=".length));
    else if (arg.startsWith("-")) throw new EnvError(`unknown option: ${arg}`);
    else if (opts.target === null) opts.target = arg;
    else throw new EnvError(`unexpected extra argument: ${arg}`);
  }
  return opts;
}

const USAGE = [
  "Usage: node scripts/check-versions.mjs [TARGET] [--json] [--registry <file>]",
  "                                         [--accept-below-floor <pkg>] [--help]",
  "",
  "TARGET defaults to the current directory. A directory reads package.json,",
  "the lockfile, and Tina artifacts; a *.json file reads its `versions` map.",
  "Exit codes: 0 clean, 1 findings, 2 could-not-run.",
].join("\n");

function buildResult(exitCode, status, extra) {
  return {
    status,
    exitCode,
    target: extra.target ?? null,
    registry: extra.registry ?? null,
    checked: extra.checked ?? [],
    unknown: extra.unknown ?? [],
    findings: extra.findings ?? [],
    notes: extra.notes ?? [],
    error: extra.error ?? null,
  };
}

function emit(result, json) {
  if (json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }
  if (result.status === "could-not-run") {
    process.stderr.write(`check-versions: could not run: ${result.error}\n`);
    return;
  }
  if (result.status === "clean") {
    process.stdout.write(
      `check-versions: clean (checked ${result.checked.length} package(s), ${result.unknown.length} unknown)\n`,
    );
  } else {
    process.stdout.write(`check-versions: ${result.findings.length} finding(s)\n`);
  }
  for (const f of result.findings.sort((a, b) => a.code.localeCompare(b.code) || a.message.localeCompare(b.message))) {
    process.stdout.write(`  [${f.code}] ${f.message}\n`);
  }
  for (const u of result.unknown.sort()) {
    process.stdout.write(`  [version.unknown] ${u} could not be determined\n`);
  }
  for (const note of result.notes) process.stdout.write(`  note: ${note}\n`);
}

function fail(message, json, extra = {}) {
  const result = buildResult(2, "could-not-run", { ...extra, error: message });
  emit(result, json);
  process.exitCode = 2;
}

function main() {
  let opts;
  try {
    opts = parseArgs(process.argv.slice(2));
  } catch (err) {
    fail(err instanceof EnvError ? err.message : `unexpected failure: ${err.message}`, false);
    return;
  }

  if (opts.help) {
    process.stdout.write(`${USAGE}\n`);
    process.exitCode = 0;
    return;
  }

  const target = resolve(opts.target ?? process.cwd());

  let registryText;
  try {
    registryText = readFileSync(opts.registry, "utf8");
  } catch (err) {
    fail(`version registry is missing or unreadable at ${opts.registry}: ${err.message}`, opts.json, {
      target,
      registry: opts.registry,
    });
    return;
  }
  const registry = parseVersionRegistry(registryText);
  if (Object.keys(registry.floors).length === 0) {
    fail(`version registry has no parseable security floors: ${opts.registry}`, opts.json, {
      target,
      registry: opts.registry,
    });
    return;
  }

  let collected;
  try {
    collected = collectTarget(target);
  } catch (err) {
    fail(err instanceof EnvError ? err.message : `unexpected failure: ${err.message}`, opts.json, {
      target,
      registry: opts.registry,
    });
    return;
  }

  const { findings, unknown, checked } = detect(collected.packages, registry);
  const notes = [
    `@latest caution: ${LATEST_CAUTION}`,
    ...collected.notes,
  ];

  // Monotonic floors: refuse any request to treat a below-floor version as OK.
  for (const pkg of opts.acceptBelowFloor) {
    const key = canonicalPackage(pkg) ?? pkg;
    const entry = collected.packages.find((p) => (canonicalPackage(p.name) ?? p.name) === key);
    const floor = registry.floors[key];
    if (floor && entry?.version && belowFloor(entry.version, floor.floor)) {
      findings.push({
        code: "policy.floor-downgrade-refused",
        package: entry.name,
        version: entry.version,
        source: entry.source,
        message: `refused to treat ${entry.name} ${entry.version} as acceptable: it is below the security floor ${floor.text}; floors are monotonic`,
      });
    } else {
      notes.push(`--accept-below-floor ${pkg}: no below-floor version to accept (no change made)`);
    }
  }

  const status = findings.length > 0 ? "findings" : "clean";
  const result = buildResult(status === "clean" ? 0 : 1, status, {
    target,
    registry: opts.registry,
    checked,
    unknown,
    findings,
    notes,
  });
  emit(result, opts.json);
  process.exitCode = result.exitCode;
}

main();
