#!/usr/bin/env node
// Behavioral scenario runner for the portable `tina-cms` skill.
//
// This layer is BEHAVIORAL and LLM-JUDGED: it is reproducible, but NOT
// deterministic. The recorded results of the first full green run are the
// "baseline" (tests/scenarios.baseline.json) - a recorded outcome, not a
// determinism guarantee. Later edits that change recorded results must be
// investigated before the baseline is updated.
//
// Usage:
//   node tests/run-scenarios.mjs [--matrix <file>] [--baseline <file>]
//
// Provider configuration (any OpenAI-compatible /chat/completions endpoint):
//   SCENARIO_BASE_URL   e.g. https://api.openai.com/v1
//   SCENARIO_MODEL      e.g. gpt-4o-mini
//   SCENARIO_API_KEY    bearer token (also read from OPENAI_API_KEY)
//
// Exit codes (tri-state contract):
//   0  clean       - all scenarios passed (and baseline written if absent)
//   1  findings    - one or more scenarios failed, or a baseline regression
//   2  could-not-run - no model provider is configured, or the run could not
//                      start; the scenario list and baseline schema are printed
//                      and the process exits cleanly (no traceback)

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, "..");
const MATRIX_FILE = join(SCRIPT_DIR, "scenarios.matrix.json");
const BASELINE_FILE = join(SCRIPT_DIR, "scenarios.baseline.json");
const PAYLOAD_DIR = join(ROOT, "skills", "tina-cms");

const BASELINE_SCHEMA = {
  schema_version: 1,
  suite: "tina-cms behavioral scenarios",
  deterministic: false,
  description:
    "Recorded results of the first full green run. The runner is LLM-judged and reproducible but NOT deterministic; this file is the recorded baseline, not a determinism guarantee.",
  model: "<model id used for the recorded run>",
  recorded_at: "<ISO-8601 timestamp>",
  scenarios: {
    "<scenario id>": {
      prompt: "<the exact prompt sent>",
      result: "<the model's raw answer>",
      judge: { pass: true, reason: "<why the judge decided>", violated: [] },
      pass: true,
    },
  },
};

function parseArgs(argv) {
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--matrix") opts.matrix = argv[++i];
    else if (argv[i] === "--baseline") opts.baseline = argv[++i];
  }
  return opts;
}

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

/** Assemble the runtime payload the loaded skill is allowed to see. */
function loadRuntimePayload() {
  const parts = [];
  const files = [];
  const skillMd = join(PAYLOAD_DIR, "SKILL.md");
  if (!existsSync(skillMd)) throw new Error(`missing ${skillMd}`);
  parts.push(readFileSync(skillMd, "utf8"));
  files.push("SKILL.md");
  const refDir = join(PAYLOAD_DIR, "references");
  if (existsSync(refDir)) {
    for (const name of readdirSync(refDir).sort()) {
      parts.push(readFileSync(join(refDir, name), "utf8"));
      files.push(`references/${name}`);
    }
  }
  return { text: parts.join("\n\n"), files };
}

/**
 * A loadable path into docs/research is a boundary violation; a bare
 * backticked mention of the directory name as prose is a boundary statement.
 */
function hasLoadableResearchPath(text) {
  return /docs\/research\/[^\s`)\]]/.test(text) || /\]\([^)]*docs\/research[^)]*\)/.test(text);
}

function providerFromEnv() {
  const base = process.env.SCENARIO_BASE_URL;
  const model = process.env.SCENARIO_MODEL;
  const key = process.env.SCENARIO_API_KEY || process.env.OPENAI_API_KEY;
  if (!base || !model || !key) return null;
  return { base: base.replace(/\/$/, ""), model, key };
}

async function chat(provider, messages, signal) {
  const res = await fetch(`${provider.base}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${provider.key}` },
    body: JSON.stringify({ model: provider.model, messages, temperature: 0 }),
    signal,
  });
  if (!res.ok) throw new Error(`provider returned HTTP ${res.status}`);
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") throw new Error("provider response had no message content");
  return content;
}

function scenarioPrompt(scenario) {
  const evidence = scenario.repo_evidence ? `\n\nRepository evidence:\n${scenario.repo_evidence}` : "";
  return `${scenario.prompt}${evidence}`;
}

function triggerSystemPrompt(description) {
  return `You are deciding whether a skill activates for a request.\n\nSkill description:\n${description}\n\nAnswer strictly "YES" or "NO" to whether this skill should activate for the user's request.`;
}

function judgeSystemPrompt() {
  return [
    "You are a strict grader. You are given an assistant answer plus a list of expected observable decisions and prohibited stale advice.",
    "Return ONLY a JSON object: {\"pass\": boolean, \"reason\": string, \"violated\": string[]}.",
    "pass is true only if the answer satisfies every expected decision and contains none of the prohibited advice.",
  ].join(" ");
}

function extractJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

async function runScenario(provider, scenario, payload, description, signal) {
  const prompt = scenarioPrompt(scenario);
  let result = "";
  let judge = { pass: false, reason: "not evaluated", violated: [] };

  if (scenario.kind === "trigger-positive" || scenario.kind === "trigger-negative") {
    result = await chat(provider, [
      { role: "system", content: triggerSystemPrompt(description) },
      { role: "user", content: prompt },
    ], signal);
    const yes = /\bYES\b/i.test(result);
    const expected = scenario.expect_activation === true;
    judge = {
      pass: yes === expected,
      reason: `activation=${yes ? "YES" : "NO"}, expected=${expected ? "YES" : "NO"}`,
      violated: yes === expected ? [] : [result.trim().slice(0, 200)],
    };
    return { prompt, result, judge };
  }

  result = await chat(provider, [
    { role: "system", content: `You are the tina-cms skill. Loaded runtime files:\n\n${payload.text}` },
    { role: "user", content: prompt },
  ], signal);

  if (scenario.kind === "research-blind") {
    const cited = /docs\/research/.test(result);
    judge = {
      pass: !cited,
      reason: cited ? "answer cited docs/research/ at runtime" : "no runtime read of docs/research/",
      violated: cited ? ["cited docs/research/"] : [],
    };
    return { prompt, result, judge };
  }

  const graded = await chat(provider, [
    { role: "system", content: judgeSystemPrompt() },
    {
      role: "user",
      content: `Expected decisions:\n- ${scenario.expect.join("\n- ")}\n\nProhibited advice:\n- ${scenario.prohibit.join("\n- ")}\n\nAssistant answer:\n${result}`,
    },
  ], signal);
  const parsed = extractJson(graded);
  judge = parsed && typeof parsed.pass === "boolean"
    ? { pass: parsed.pass, reason: String(parsed.reason ?? ""), violated: Array.isArray(parsed.violated) ? parsed.violated : [] }
    : { pass: false, reason: `judge did not return valid JSON: ${graded.slice(0, 200)}`, violated: [] };
  return { prompt, result, judge };
}

function printScenarioList(matrix) {
  console.log(`scenarios (${matrix.scenarios.length}):`);
  for (const s of matrix.scenarios) console.log(`  [${s.kind}] ${s.id} - ${s.name}`);
}

function printBaselineSchema() {
  console.log("baseline schema (tests/scenarios.baseline.json):");
  console.log(JSON.stringify(BASELINE_SCHEMA, null, 2));
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const matrixFile = opts.matrix ? resolve(opts.matrix) : MATRIX_FILE;
  const baselineFile = opts.baseline ? resolve(opts.baseline) : BASELINE_FILE;

  if (!existsSync(matrixFile)) {
    console.error(`run-scenarios: could not run: matrix not found at ${matrixFile}`);
    process.exit(2);
  }
  const matrix = readJson(matrixFile);
  if (!Array.isArray(matrix.scenarios) || matrix.scenarios.length === 0) {
    console.error("run-scenarios: could not run: scenario matrix is empty");
    process.exit(2);
  }

  const provider = providerFromEnv();
  if (!provider) {
    console.log("run-scenarios: no model provider configured; behavioral scenarios cannot run (degrade to exit 2).");
    console.log("");
    console.log("to run the suite, configure an OpenAI-compatible endpoint:");
    console.log("  export SCENARIO_BASE_URL=https://api.openai.com/v1");
    console.log("  export SCENARIO_MODEL=<model-id>");
    console.log("  export SCENARIO_API_KEY=<token>   # or OPENAI_API_KEY");
    console.log("  node tests/run-scenarios.mjs");
    console.log("");
    printScenarioList(matrix);
    console.log("");
    printBaselineSchema();
    process.exit(2);
  }

  let payload;
  try {
    payload = loadRuntimePayload();
  } catch (err) {
    console.error(`run-scenarios: could not run: ${err.message}`);
    process.exit(2);
  }
  if (hasLoadableResearchPath(payload.text)) {
    console.error("run-scenarios: could not run: runtime payload contains a loadable docs/research/ path");
    process.exit(2);
  }

  const description = readFileSync(join(PAYLOAD_DIR, "SKILL.md"), "utf8");
  const results = {};
  const failures = [];
  const scenarioTimeoutMs = Number(process.env.SCENARIO_TIMEOUT_MS ?? 180000);

  for (const scenario of matrix.scenarios) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), scenarioTimeoutMs);
    try {
      const { prompt, result, judge } = await runScenario(provider, scenario, payload, description, controller.signal);
      results[scenario.id] = { prompt, result, judge, pass: judge.pass };
      console.log(`${judge.pass ? "PASS" : "FAIL"} ${scenario.id} - ${judge.reason}`);
      if (!judge.pass) failures.push(scenario.id);
    } catch (err) {
      results[scenario.id] = { prompt: scenarioPrompt(scenario), result: "", judge: { pass: false, reason: `error: ${err.message}`, violated: [] }, pass: false };
      console.log(`FAIL ${scenario.id} - error: ${err.message}`);
      failures.push(scenario.id);
    } finally {
      clearTimeout(timer);
    }
  }

  if (existsSync(baselineFile)) {
    const baseline = readJson(baselineFile);
    for (const [id, recorded] of Object.entries(baseline.scenarios ?? {})) {
      if (recorded.pass === true && results[id] && results[id].pass === false)
        console.log(`REGRESSION ${id}: baseline passed but the current run failed`);
    }
  } else if (failures.length === 0) {
    const baseline = {
      schema_version: 1,
      suite: "tina-cms behavioral scenarios",
      deterministic: false,
      note: "Recorded results of the first full green run. Reproducible but not deterministic; investigate changes before updating.",
      model: provider.model,
      recorded_at: new Date().toISOString(),
      scenarios: results,
    };
    mkdirSync(dirname(baselineFile), { recursive: true });
    writeFileSync(baselineFile, `${JSON.stringify(baseline, null, 2)}\n`);
    console.log(`baseline written to ${baselineFile}`);
  }

  if (failures.length > 0) {
    console.log(`\nrun-scenarios: ${failures.length} scenario(s) failed: ${failures.join(", ")}`);
    process.exit(1);
  }
  console.log(`\nrun-scenarios: all ${matrix.scenarios.length} scenarios passed`);
  process.exit(0);
}

main().catch((err) => {
  console.error(`run-scenarios: could not run: ${err.message}`);
  process.exit(2);
});
