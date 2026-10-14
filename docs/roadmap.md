# Roadmap

Durable direction and milestone history for this skill. This is not a changelog:
per-change detail lives in the git commit bodies (each carries `what:` then
`why:`) and in `docs/research/`. This file records what the skill is for, which
milestones are complete, and what maintenance keeps it honest.

## Purpose

Ship one portable, installable skill that, given a TinaCMS-backed repository,
first identifies the actual Tina surface in that repository — framework, content
backend, admin/public/CSS surface, and optional TinaDocs — and then gives
bounded, source-backed, version-aware guidance. Volatile advice always carries a
primary source, a checked date, applicable evidence, and a recheck trigger.

## Ideal State

The skill is complete when these properties hold:

| #    | Property                                                                                                                                                                                    |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IS-1 | Setup, schema/content, generated-API, deployment, and CSS requests route to the correct actual Tina surface in the target project.                                                          |
| IS-2 | Volatile advice names a primary source, checked date, applicable evidence, and a re-verification trigger.                                                                                   |
| IS-3 | Schema and deployment advice preserves content, lockfiles, generated artifacts, and secrets, and proves the relevant result.                                                                |
| IS-4 | TinaDocs OpenAPI workflows appear only when TinaDocs is present, and warn before document regeneration.                                                                                     |
| IS-5 | The distributed skill validates structurally after a portable copy and succeeds on realistic positive and negative scenarios.                                                               |
| IS-6 | A repository below the security floor or inside a known-bad window is flagged — with exact installed versions, the floor/window meaning, and a safe path — before version-dependent advice. |
| IS-7 | Guidance cites a verified official docs link from the registry and inspects the project's Tina conventions before advising.                                                                 |

## Milestones

Phases are complete when their implementation and their documentation gate are
both done.

| Phase                                 | Scope                                                                                                                                                                                   | Status   | Completed                                          |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------- |
| 1. Payload and registries             | Portable `skills/tina-cms/` payload; project-inspection routing and conventions checklist; dated source registry (docs-link bank) and version registry (floors, windows, history).      | Complete | 2026-10-14                                         |
| 2. Core guidance                      | Schema/content, CLI, content-API/backend and deployment, UI/CSS, and the TinaDocs OpenAPI module — each distilled from research findings with a provenance header.                      | Complete | 2026-10-14                                         |
| 3. Verification and version awareness | Deterministic structural checker with fixtures; LLM-judged behavioral scenario suite with a recorded baseline; `scripts/check-versions.mjs`; research findings recorded and registered. | Complete | 2026-10-14 (behavioral baseline pending — see R-1) |
| 4. Packaging and anti-drift CI        | README, LICENSE, SECURITY, AGENTS, this roadmap; validation workflow; scheduled freshness workflow; commit-message checker and pre-commit hook.                                         | Complete | 2026-10-14                                         |

Release cadence: none. There are no tagged releases and none are planned;
`main` is the shipping line, and the commit history is the change record.

## Shipped

Milestone-level record of what has landed. Granularity stays at feature or
milestone level — per-change detail lives in the commit bodies and
`docs/research/`, never here.

| Date       | Item                   | Summary                                                                                                                                                                            | Commits              |
| ---------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| 2026-10-14 | Initial implementation | Portable payload, nine references, source and version registries, research baseline, deterministic test suite, version checker, and packaging/CI layer.                            | `4413a1d`..`94ff3df` |
| 2026-10-14 | Post-review fix wave   | Corrected the `@tinacms/cli` current-stable line to the npm-verified 4.0.2, added reference provenance headers, tightened the `tinacms` floor to 3.3.1, and cleared review minors. | `b973d57`            |

## Maintenance Triggers

The skill is dated by design. Re-run research and refresh the affected records
when any of the following happens:

- a new `tinacms` or `@tinacms/cli` minor or patch lands;
- a new advisory raises a version floor;
- a source-registry or version-registry row, or a `docs/research/` topic file,
  passes its freshness window (default TTL 120 days);
- a TinaCMS documentation page is renamed, moved, or removed;
- the deployment-options family changes (a target is added or dropped);
- a new skill capability or runtime reference is added;
- a TinaDocs OpenAPI compatibility area is exercised against a real target.

The scheduled freshness workflow resolves the current stable `tinacms` and
`@tinacms/cli` from npm and flags TTL-expired rows for these reasons. On drift it
opens or updates a single `skill-staleness` issue rather than failing the build,
and always records the run in `docs/research/research-log.md`.

## Next-Research Trigger

Next scheduled recheck: **2027-02-10** (120 days after the 2026-10-13/14 research
sessions). Bring it forward on any maintenance trigger above.

## Backlog

Deferred until a concrete need or target exercise makes them worthwhile. A
landed item moves to [Shipped](#shipped) with its landing date and keeps its ID.

| ID  | Feature                                                        | Why                                                                                                                                                                                   | Status   |
| --- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| R-1 | Recorded behavioral baseline (`tests/scenarios.baseline.json`) | The LLM-judged scenario suite needs a first full green run to pin real results; blocked on a configured model provider (`SCENARIO_BASE_URL` / `SCENARIO_MODEL` / `SCENARIO_API_KEY`). | Blocked  |
| R-2 | Vendored structural validator                                  | Gives `quick_validate.py` parity inside CI without the Codex skill-creator.                                                                                                           | Deferred |
| R-3 | Exact-version blocked-versions deny list                       | The checker already parses one; the version registry does not yet carry it.                                                                                                           | Deferred |
| R-4 | Computed fresh-release check                                   | Once the registry records release dates, this replaces the static `@latest` caution.                                                                                                  | Deferred |
| R-5 | Verified TinaDocs OpenAPI behavior                             | OAS version, `$ref`, and manual-page preservation should be recorded only after a real target exercise.                                                                               | Deferred |
| R-6 | Evidence-file naming alignment                                 | Reconcile the build plan's `<attemptDir>/task-N-tina-cms-skill.<ext>` with the actual `.omo/evidence/task-N.<ext>` convention.                                                        | Deferred |
