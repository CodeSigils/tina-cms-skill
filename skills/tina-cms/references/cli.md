# Tina CLI And Package Pinning

Read this file when a task touches the `tinacms` / `@tinacms/cli` commands, the
dev or build workflow, CLI flags and ports, or the versions the project pins.
It is the runtime counterpart to the inspection in `project-inspection.md`: once
that inspection has confirmed a TinaCMS project, this file answers "which command
and which pin".

> Provenance: findings `CLI-01` through `CLI-11`, `INST-02` | tiers: TIER1, TIER2 (per row) | checked 2026-10-13 | recheck trigger: on every new `@tinacms/cli` or `tinacms` release, and whenever a documented flag, subcommand, or port default changes.

This reference is part of the runtime skill and has no path into `docs/research/`.
External specifics are referenced by topic and pulled from `source-registry.md`;
this file does not carry raw URLs. Version-sensitive advice is checked against
`version-registry.md`, never recalled from memory.

## Two packages, not one

Tina ships as two separately distributed packages that both appear in a
project's `package.json`:

- The `tinacms` package is the runtime and editor surface.
- The `@tinacms/cli` package provides the `tinacms` command, and the CLI overview
  documentation is written for it.

They sit on separate release lines. Pin both exactly, do not float one while
pinning the other, and never resolve either with `@latest`. Read the current line
for each from `version-registry.md` and compare it against the installed and
locked versions before advising.

## The commands that matter

The CLI overview topic in `source-registry.md` is the single source for the
documented command surface. Confirm every flag against the installed CLI version
before quoting it, because flags are version-sensitive.

| Command or flag | What it does |
| :--- | :--- |
| `tinacms dev -c "<framework dev>"` | Runs the dev server and wraps the framework's own dev command. The wrapped command (`-c`) is the framework dev server, so read it to learn the framework. |
| `tinacms build` | Produces the production CMS build. Run it before the framework build (the framework compile depends on the generated client and types). A script such as `tinacms build && next build` is the documented order. |
| `--content=local` | Selects a local content source instead of cloud indexing. Local mode skips the cloud index, and a `path` or config change may need a dev restart. |
| `--port` | Dev server port; documented default `4001`. |
| `--datalayer-port` | Data-layer port; documented default `9000`. |
| `-c "<command>"` | The framework command the dev server wraps. |
| `--noWatch` | Disables file watching during dev, so a single controlled regeneration can run. |
| `--noSDK` | Skips SDK generation. |
| `--noTelemetry` | Disables telemetry. |
| `audit --clean` | Project audit and cleanup diagnostic. |
| `doctor --json` | Project diagnosis, emitted as JSON. |

`audit` and `doctor` are diagnostics: run them to gather evidence, then read the
installed CLI version before acting on the output. See the CLI overview and the
audit/doctor topics in `source-registry.md`.

## Why exact pins, not caret ranges

UI assets are served from a CDN and can update ahead of the local CLI. When the
local pin floats, the admin can load a UI bundle that no longer matches the
installed runtime, and the admin breaks in ways that look unrelated to the
change. Pin exact Tina versions (no caret ranges) and never treat `@latest` as a
repair default; resolve the safe version from `version-registry.md` instead.

The same coupling is why the CLI and the runtime package must move together:
mixing a new CLI with an old runtime, or the reverse, is a known mismatch source.

## The hybrid-mode regeneration path

Some projects pre-commit the generated artifacts so the site can build without a
fresh cloud indexing step. That pattern regenerates with:

```bash
tinacms dev --noWatch --noTelemetry
```

not with `tinacms build`. The reason: `tinacms build` can hit TinaCloud indexing
and fail with an "Unable to seed" error when the cloud schema does not yet carry
the local block types, while `--noWatch --noTelemetry` regenerates the artifacts
without watching or phoning home. Treat this whole path as a TIER2
community-verified workaround: the underlying contract mechanics are officially
corroborated, but the pre-commit workflow itself is not an official
recommendation. Verify it against the project before relying on it, and see
`conventions.md` for which artifact mode the project actually runs.

## Safety boundaries

- Never deploy or package a `tinacms dev` artifact as the production CMS. A dev
  process and its watch output are development-only; production ships the
  `tinacms build` result.
- Never run the CLI from memory. Read the installed version, then confirm the
  flag or subcommand against that version.
- If the repository sits below the `@tinacms/cli` security floor or inside a
  known-bad window, name the exact installed version and the safe path before
  giving command-specific advice; the floors and windows live in
  `version-registry.md`.

## Checklist output

For a CLI or pinning change, report: the installed `tinacms` and `@tinacms/cli`
versions, the version-registry status of each (floor, window, current line), the
exact command with its flags, and whether the action is diagnostic or a change.
For a change, name the files touched and require a diff or backup plan for any
generated or content-mutating action.
