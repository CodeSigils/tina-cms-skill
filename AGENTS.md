# Repository Instructions

Scope: maintainer and authoring conventions for this repository. This file is
not part of the runtime payload and is never loaded by the installed skill.

## Layout And Boundaries

The repository has exactly two boundaries:

- Runtime payload: `skills/tina-cms/` (`SKILL.md`, `references/`,
  `agents/openai.yaml`). This is the single portable skill directory that ships
  to every host. It is the only thing the installed skill loads.
- Authoring-only: `docs/` (`docs/research/` and `docs/official-links.md`), plus
  `README.md`, `SECURITY.md`, `LICENSE`, `AGENTS.md`, `docs/roadmap.md`,
  `scripts/`, `tests/`, and `.github/`. Nothing here is loaded at runtime.

The dependency is one-way: references are distilled **from** `docs/research/`.
The reverse is never allowed.

## Orient Before You Change

Before starting any change, read [`docs/roadmap.md`](docs/roadmap.md) (Milestones,
`Shipped`, and `Backlog`) and [`docs/research/index.md`](docs/research/index.md)
for the project's current state.

- Check the `Backlog` so you do not redo planned or deferred work; a parked item
  (for example, one blocked on a missing provider) is deliberate, not forgotten.
- Confirm against `Shipped` what has already landed, and keep an item's ID when
  moving it forward.
- At phase close, move a landed `Backlog` item to `Shipped` with its landing date
  (see the phase-close gate below).

## Editing Rules

- Never link `docs/research/` from a runtime file. The runtime payload must not
  contain a loadable path, markdown link, or relative climb into `docs/research/`
  or any path outside `skills/tina-cms/`. `tests/check-skill.mjs` enforces this.
- No reference-only edits. Every substantive change to a file under
  `skills/tina-cms/references/` must be backed by a finding in `docs/research/`.
  Only trivial typo, whitespace, or link corrections are exempt.
- Every reference carries a provenance header citing its findings (finding ID +
  tier + checked date + recheck trigger).
- Every finding ID (`INST-*`, `CLI-*`, `SCHEMA-*`, `API-*`, `DEPLOY-*`,
  `CLOUD-*`, `SELF-*`, `TDOCS-*`, `STYLE-*`) is registered exactly once in
  `docs/research/index.md`, which also owns the tier definitions. A finding ID
  that appears in a topic file but is not registered (orphan), or is registered
  more than once (duplicate), is a defect.
- Any change to a `docs/research/` topic file updates `docs/research/index.md`
  in the same commit, so the finding and its registration always move together.
  `node tests/check-skill.mjs` fails if a topic file cites an unregistered ID or
  a registered ID is missing from its owning topic file.
- Never lower a version floor, invent a CVE, a vulnerable range, or a "patched"
  version, present a single "current version" as timeless truth, or recommend
  `@latest` as a repair default. Floors and windows live only in the dated
  `skills/tina-cms/references/version-registry.md`.
- Every external link in a runtime reference comes from
  `skills/tina-cms/references/source-registry.md`. Do not invent or paste a
  remembered URL.

## Commit Message Contract

Every commit has a concise imperative subject and a body with both fields, in
this order:

```text
<imperative subject>

what: Describe the files, behavior, or documentation changed.
why: Explain the user need, evidence, or design reason for the change.
```

`scripts/check_commit_messages.py` enforces a concise subject plus non-empty
`what:` then `why:` fields. Run it before handoff:

```bash
python3 scripts/check_commit_messages.py HEAD
```

To review a batch, pass a range:

```bash
python3 scripts/check_commit_messages.py HEAD~3..HEAD
```

The `validate` workflow applies the same check to pull requests and pushes to
`main`.

Do not add AI or agent attribution, `Co-authored-by` trailers, or authorship
claims to commits or files. Provenance belongs to the repository owners.

## No Changelog

This repository keeps no `CHANGELOG.md` and no changelog file under any other
name. The commit history is the canonical change record: every commit body
carries `what:` then `why:`. Research and decision records hold detailed
rationale, and `docs/roadmap.md` tracks durable milestones, phase status, and
maintenance triggers. Do not reintroduce a changelog.

## Working Plan Is Not Shipped

The build plan under `.omo/plans/` is a build artifact and is never copied into
the repository. `docs/roadmap.md` is the shipped distillation.

## Enabling The Pre-Commit Hook

The hook at `.githooks/pre-commit` is not active until the repository opts in:

```bash
git config core.hooksPath .githooks
```

The hook runs `python3 scripts/check_commit_messages.py HEAD` and the fast
structural check `node tests/check-skill.mjs`; it exits 0 on a clean tree and
blocks on findings. Do not commit with `--no-verify`.

## Verification

Run the deterministic checks before claiming completion:

```bash
node tests/check-skill.mjs
node scripts/check-versions.mjs tests/fixtures/versions/current.json
python3 scripts/check_commit_messages.py HEAD
```

The behavioral scenario suite (`node tests/run-scenarios.mjs`) is LLM-judged and
degrades to exit 2 when no model provider is configured; exit 2 means
"could not run", not "findings". `quick_validate.py` from the Codex
skill-creator is an optional manual check, not a required repository step.

## Documentation Drift Review

Some changes make other root documents stale without touching them. When a
change alters any of the following, review and update the affected root
authoring documents in the same commit, and record what was reviewed in the
commit body:

- the runtime-payload scope or layout (`skills/tina-cms/`: what the skill covers
  or refuses to do);
- CI, workflows, hooks, or the verification machinery (`tests/`, `scripts/`,
  `.github/`, `.githooks/`);
- the roadmap (`docs/roadmap.md`).

The root authoring documents in scope are:

| Document      | Review when                                     | Confirm                                                                                            |
| :------------ | :---------------------------------------------- | :------------------------------------------------------------------------------------------------- |
| `README.md`   | scope, install, or verification changes         | Overview, Install, Verification, and See Also still match reality                                  |
| `SECURITY.md` | scope, trust surface, or release-policy changes | `Scope`, `Secret Handling`, and `Supported Versions` still match, and `Last reviewed` is refreshed |
| `AGENTS.md`   | layout, rules, or machinery changes             | Boundaries, Editing Rules, and Verification still match reality                                    |

`tests/check-skill.mjs` verifies these documents exist, that `SECURITY.md`
carries a `Last reviewed` date, and that this section names the required set; it
cannot judge semantic staleness, so the review itself is a human or agent step.

## Mandatory Phase-Close Documentation Gate

At the end of every roadmap phase, before reporting the phase complete or
starting the next one:

1. Update every affected authoring document: the relevant `docs/research/` topic
   file and its provenance header, `docs/research/index.md` (registrations), the
   `docs/research/research-log.md` session entry, `docs/roadmap.md` (phase status,
   acceptance evidence, the `Shipped` table, and moving any landed backlog item
   from `Backlog` to `Shipped` with its landing date), the root documents named by
   [Documentation Drift Review](#documentation-drift-review) (`README.md`,
   `SECURITY.md`, `AGENTS.md`), and any runtime reference distilled from a changed
   finding.
2. Update checked dates where evidence was rechecked and verify affected
   relative Markdown links.
3. Record any intentionally unchanged document with the reason in the handoff.

A phase is not complete until its documentation updates and verification are
complete.
