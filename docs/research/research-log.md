# Research log

Authoring-only record. This directory is input to the skill's references; the
runtime skill loads only files under `skills/tina-cms/` and never reads or links
anything here. Findings flow one way: references are distilled from this record.

## Session 2026-10-13: TinaCMS 3.x documentation, CLI, and version landscape

### Packages researched

- `tinacms` (current stable line 3.14.4 at the time of the session)
- `@tinacms/cli` (current stable line 2.1.8 and newer on the 2.1.x line)

### Sources

- Official TinaCMS documentation at `https://tina.io/docs` and the topic pages
  recorded in `index.md` and mirrored into `skills/tina-cms/references/source-registry.md`.
- Official project issue tracker and advisory material for the security floor and
  the known-bad windows (CVE-2026-28792 / GHSA-8pw3-9m7f-q734, issues #4363,
  #5838, #6308, #6325, #6345, #6346, #6361, #6364, #6365).
- Two verified-safe community skills, cross-checked against the official
  material: `genericservice/claude-skills` `nextjs-tinacms` and `tina-schema-sync`.
- One verified-safe community skill, `yigitkonur/skills-by-yigitkonur`
  `build-tinacms-nextjs`, used for the detect-first-hop and probe-script models.
- One excluded entry, `jezweb/claude-skills/tinacms`, retained only as a record
  of unsafe and stale practice. It is not a source for any runtime reference.
- The read-only inspection clones of the verified-safe community skills were
  moved out of this repository after authoring and now live at
  `~/projects/third-party-skills-for-review/`. No third-party code is tracked,
  published, or routed at runtime; `source-registry.md` cites the skills by name
  and tier only. The `external-tina-skills-for-inspection/` ignore entry is kept
  as a guard against accidentally re-adding a clone.

### Method

- Every documentation URL was opened and confirmed reachable on 2026-10-13; the
  canonical route was recorded and stale routes were corrected (for example,
  `/docs/reference/schema` instead of `/docs/schema`, `/docs/graphql/queries`
  plus `/docs/graphql/cli` instead of `/docs/graphql/overview`,
  `/docs/reference/content-api/data-layer` instead of a content-delivery path).
- Version floors and windows were corroborated across the official material and
  the two verified-safe community skills before being recorded, and each was
  given a tier and a recheck trigger.
- Findings are namespaced per concern (`INST-*`, `CLI-*`, `SCHEMA-*`, `API-*`,
  `DEPLOY-*`, `CLOUD-*`, `SELF-*`, `TDOCS-*`, `STYLE-*`). Each finding ID is
  registered exactly once in `index.md` and owns one topic file.
- The `jezweb/claude-skills/tinacms` entry was audited and excluded for unsafe
  repair commands (recursive deletion of lockfiles and `node_modules`), `@latest`
  repair defaults, destructive text rewrites, and a pinned CLI below the
  CVE-2026-28792 floor. It is listed in `index.md` only as an excluded entry.

### What was not verified

- OAS version, YAML, `$ref` behavior, and manual-page preservation for TinaDocs
  OpenAPI generation were not independently confirmed; they are recorded as
  re-verification triggers, not facts.
- Details attributed to the excluded jezweb entry and to community sources are
  recorded at their tier and are not cited as authority.

### Next-research trigger

Re-run this session when any of the following happens: a new `tinacms` or
`@tinacms/cli` minor or patch lands; a new advisory raises a version floor; a
source-registry or version-registry row passes its freshness window; a
deployment-options page is added or removed; or a TinaDocs OpenAPI compatibility
area is exercised against a real target.

## Session 2026-10-14: version policy and the check-versions contract

### Packages researched

- No new package releases were researched in this session. It records the
  version-policy mechanisms and the checker contract, not new release data.

### Sources

- `skills/tina-cms/references/version-registry.md`: the in-repo authoritative
  floors (section B) and known-bad windows/constraints (section C), plus its
  version-policy rules. Consumed by `scripts/check-versions.mjs`; not copied.
- The existing tiered findings in `index.md` (`CLI-01`, `INST-01`, `INST-02`,
  `SCHEMA-01`, and the rest), which the new findings restate or operationalize
  rather than replace.
- `tests/fixtures/versions/*.json`: the version fixtures (current, below-floor,
  bad-window) used by both `tests/check-skill.mjs` and `scripts/check-versions.mjs`.

### Method

- `scripts/check-versions.mjs` re-parses the floors and windows from
  `references/version-registry.md` at run time; no second copy of the data was
  created. It resolves a target project's installed versions from `package.json`,
  the lockfile (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`), and Tina
  artifacts (`tina/tina-lock.json`, `tina/__generated__/`), preferring the
  resolved lockfile version over the declared range.
- The checker's exit contract is tri-state (0 clean, 1 findings, 2
  could-not-run) and its staleness handling is tri-state (stale fails, unknown
  never fails). Both mirror the established skill convention.
- The version-policy facts were recorded as findings INST-09 through INST-14 and
  registered once each in `index.md`. The fourteen jezweb-derived findings were
  already registered (see the mapping in `index.md`) and were not duplicated.

### What was not verified / gaps found

- GAP: `references/version-registry.md` does not carry an explicit exact-version
  blocked-versions deny list, only floors and range-based known-bad windows. The
  checker parses a deny list when the registry provides one; with the current
  registry it is empty. Recorded as INST-10 and as a recheck trigger. The
  registry is owned by an earlier todo and was not edited.
- No new CVE, vulnerable range, or "patched" version was inferred or invented;
  only data already recorded in the registry was used.

### Next-research trigger

- As in the 2026-10-13 session; additionally, re-run when the registry gains an
  explicit blocked-versions deny list, or when a real release-date field is
  added (which would let the `@latest` caution become a computed check instead of
  a static note).

## Session 2026-10-14: verification remediation (F2 blocking + minors)

This session records the remediation of the final-verification findings raised
against the built skill. It is a maintenance and quality record; the runtime
references were updated to match it.

### Sources

- Live npm registry: `npm view tinacms version` and `npm view @tinacms/cli version` (2026-10-14).
- The final verification reports: plan-compliance (F1, approved), quality (F2, rejected on two blocking findings), ideal-state fidelity (F4, request changes), manual QA (F3).

### Method

- Re-verified the current stable line against npm rather than memory: `tinacms` 3.14.4 (unchanged) and `@tinacms/cli` 4.0.2. The recorded "2.1.x line" was wrong: `2.1.8` is the security floor, not the current line.
- Updated `CLI-02`, added `CLI-12`, and reconciled `CLI-09`: there is no `tinacms` v4, and `tinacms` and `@tinacms/cli` sit on separate release lines.
- Added provenance headers (finding IDs + tier + checked date + recheck trigger) to the runtime references that lacked them: `conventions.md`, `project-inspection.md`, `version-registry.md`, and the `source-registry.md` provenance line.
- Tightened the `tinacms` floor from `>= 3.3.x` to `>= 3.3.1` to match the recorded fix release.
- Corrected the runtime `SKILL.md` load-set statement to match the actual payload (no phantom `scripts/` directory).

### Findings

- The `@tinacms/cli` current-stable line was recorded two majors behind reality; this is the drift the freshness workflow exists to catch. It was found by review, not by the automated job, because the job had not yet run against a remote.
- Runtime references were not covered by the provenance check that already applied to `docs/research/` topic files, so four references had shipped without a provenance header.

### Decision / policy

- Reaffirmed: the `@tinacms/cli` security floor stays `>= 2.1.8` (CVE-2026-28792); only the "current stable line" value changed.
- The version registry remains the single source of floors, windows, and current-stable values; nothing is presented as timeless.

### Next-research trigger

- On the next `@tinacms/cli` or `tinacms` release, and when a remote exists so the weekly freshness job can run against it.

## Session 2026-10-14: cross-repo capability-governance comparison

### Question

Whether this repository's capability-lifecycle rule (`AGENTS.md`, "Roadmap And
Capabilities") should be propagated to the sibling skill repositories
`zensical-skill` and `zola-skill`.

### Sources

- The governance documents of `zensical-skill` and `zola-skill` (`AGENTS.md`,
  `docs/roadmap.md`, `docs/future-capabilities.md`, `docs/README.md`), reviewed
  2026-10-14.
- The public study note recording the comparison: `agent-concepts-study`,
  `2026-10-14-SYNTHESIS-capability-lifecycle-across-skill-repos.md`
  (https://github.com/CodeSigils/agent-concepts-study).

### Method

- Compared how each of the three repositories governs how a new capability
  enters: this repository states an explicit ordered lifecycle; `zensical-skill`
  owns a capability-admission rule (five conditions) plus a roadmap after-action
  gate and a canonical-owner rule; `zola-skill` owns a native Zola/Tera
  capability gate plus a documentation reading matrix and a phase-close gate.
- Checked whether either sibling lacked the ordering stated here.

### Outcome

- Neither sibling lacked an equivalent gate; each already owns an admission gate
  and a phase-close or after-action gate. Propagating this repository's rule
  would restate a rule those repositories already own, and in `zensical-skill`
  would conflict with its canonical-owner rule and governance freeze.
- Decision: no change to `zensical-skill` or `zola-skill`.

### Next-research trigger

- Re-open only if a sibling repository removes its admission or phase-close gate,
  or if a capability is proposed here that the existing lifecycle does not cover.

## Session 2026-10-14: governance hardening - provenance enforcement and git hooks

### Question

- Two weaknesses were named for a governance-heavy, agent-writing repository: a
  producing agent can silently violate a stated rule, and the delegation pool
  used to author changes can abort or vanish. Should new process be added, or
  should the existing rules be enforced more completely?

### Sources

- Anthropic, "Demystifying evals for AI agents" (2026-01) and "Effective
  harnesses for long-running agents" plus its repository
  (https://github.com/anthropics/cwc-long-running-agents): outcomes are judged by
  on-disk evidence, not the agent's self-report, and "done" is made structural.
- Anthropic, "Skill authoring best practices": prefer scripts for deterministic
  operations; Agent Skills Specification (https://agentskills.io/specification)
  for normative structure and a `metadata:` provenance map.
- "Why Do Multi-Agent LLM Systems Fail?" (MAST, arXiv 2503.13657): verification is
  a named failure category; adding objective verification measurably helps.
- Anthropic, "Harness design for long-running application development" (2026-03):
  find the simplest solution and only add complexity when needed - do not add
  process without a demonstrated failure.

### Method

- Chose enforcement of existing rules over new process: the repository already
  states the rules; the checker under-enforced some of them.
- Extended `tests/check-skill.mjs` check j so a runtime reference provenance
  header must name a tier, a checked date, and a recheck trigger - the same
  fields the topic-file check already required.
- Corrected `source-registry.md`, the one reference whose provenance line lacked a
  checked date.
- Made the commit-message policy enforceable on the pending message via a
  `--message-file <path>` mode, and split the hooks: `.githooks/pre-commit` runs
  the structural check, a new `.githooks/commit-msg` runs the message policy
  against the pending message.
- Fault-injection in disposable copies proved each new finding fires and the
  baseline stays clean.

### Findings

- Machine-enforced checks make a producing agent's output verifiable regardless
  of which model produced it; this is proportionality-preserving, because it
  enforces rules the repository already states rather than adding new ones.
- The `pre-commit` hook checked the commit-message policy against `HEAD`, which
  is the parent commit at hook time, so the pending message was never validated;
  a `commit-msg` hook is the correct channel.

### Outcome

- `check-skill.mjs` check j now enforces the full provenance rule; the clean
  message stays "10 checks passed" (the new codes are sub-findings of check j).
- The commit-message policy runs against the pending message; both hooks are
  enabled with the single `git config core.hooksPath .githooks`.

### Next-research trigger

- If the deterministic checker gains a check that a reviewer would otherwise
  perform, or if the hook set changes.

## Session 2026-10-14: payload tightening and ownership audit

### Question

Does the runtime payload (`skills/tina-cms/`) carry duplicated guidance that
should be consolidated, measured against the skill-creator authoring rubric
(progressive disclosure, one owner per fact, no generic filler)?

### Sources

- skill-creator authoring rubric (`.codex` and opencode copies), read 2026-10-14.
- The runtime payload itself: `SKILL.md` and all nine references, read 2026-10-14.
- The backing findings already recorded: `SCHEMA-01` through `SCHEMA-07` and the
  `version-registry.md` `CLI-*` / `INST-*` findings.

### Method

- Mapped every fact to a single owning file across the ten payload files.
- Classified each apparent duplication as either a drift defect (a fact restated
  outside its owner) or intentional progressive disclosure (a routing summary in
  `SKILL.md`, a per-file boundary note, or a self-contained checklist gate).

### Findings

- The payload is well-factored: the ten files divide cleanly into router,
  detection table, and one owner per domain (schema, CLI, backend/deployment,
  UI, TinaDocs, inspection).
- Most repetition is deliberate: the boundary note in every reference exists
  because each reference may be loaded alone, and `conventions.md` restates
  headline rules at checklist depth so the pre-change gate is self-contained.
  Neither is a drift defect.
- The one rule-level defect was `schema-and-content.md` restating version
  windows, which the repository rule keeps only in `version-registry.md`.

### Outcome

- Replaced the version-window restatement in `schema-and-content.md` with a
  pointer to `version-registry.md`; no other file changed. The provenance header
  and boundary note are unchanged.
- Considered a deterministic check that would flag a version floor or window
  restated outside `version-registry.md`; deferred (false-positive risk, and the
  single-owner rule is already stated).

### Next-research trigger

- Reopen if a future payload change restates a fact outside its owning file, or
  if the skill-creator rubric changes.

## Session 2026-10-19: scheduled freshness run

### Packages researched

- `tinacms` (npm current stable: 3.15.0)
- `@tinacms/cli` (npm current stable: 4.0.3)

### Sources

- npm registry (`npm view tinacms version`, `npm view @tinacms/cli version`).
- Repo registries `skills/tina-cms/references/source-registry.md` and `.../version-registry.md`, and the `docs/research/` topic-file provenance headers.

### Method

- TTL 120 days. Compared each registry row's checked date and every topic-file provenance date against the TTL, and compared the npm current stable line with the registry's recorded current stable line.

### Result

- drift: true
- staleness findings: 0; version-drift findings: 2
- issue action: per the workflow summary (issue upsert on drift, or skipped without a remote/auth).

### Next-research trigger

- Re-run when a new `tinacms` or `@tinacms/cli` minor/patch lands, a new advisory raises a floor, a row passes its TTL, a deployment-options page changes, or a TinaDocs OpenAPI area is exercised.

## Session 2026-10-20: scheduled-freshness drift resolution

### Packages researched

- `tinacms` (npm current stable: 3.15.0)
- `@tinacms/cli` (npm current stable: 4.0.3)

### Sources

- npm registry (`npm view tinacms version`, `npm view @tinacms/cli version`),
  re-verified 2026-10-20, matching the 2026-10-19 scheduled freshness run that
  opened issue #1.

### Method

- Resolved the 2026-10-19 `skill-staleness` issue (#1) registry version drift:
  re-verified both packages against npm, then updated only the two stable-line
  rows in `skills/tina-cms/references/version-registry.md` (values and checked
  dates). Security floors (`tinacms` >= 3.3.1, `@tinacms/cli` floor `2.1.8`)
  were checked against the same rows and are unaffected by a `tinacms` minor
  and an `@tinacms/cli` patch.

### Result

- `tinacms` stable line 3.14.4 -> 3.15.0; `@tinacms/cli` stable line 4.0.2 ->
  4.0.3, both checked 2026-10-20. Issue #1 closed with a pointer to this
  resolution.

### Next-research trigger

- Re-run when the next `tinacms` or `@tinacms/cli` minor or patch lands, on any
  new advisory raising a floor, or at the next TTL window (registry rows now run
  to 2027-02-17; research topic files still 2027-02-10).
