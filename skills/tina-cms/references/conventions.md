# Project Conventions Checklist

Run this checklist before advising on, or making, any change to a Tina project. It is a gate: if the project's own layout fails a line here, report the finding before proposing the change, rather than building on top of a broken convention.

This reference is part of the runtime skill and has no path into `docs/research/`. External specifics are referenced by topic and pulled from `source-registry.md`; this file does not carry raw URLs.

## Step 1: Identify the generated-artifact mode first

The most important decision is not which files to edit; it is which artifact mode the project already runs, because that decides what may be committed and how regeneration happens. Identify the mode from repository evidence before giving any artifact advice. Do not assume; confirm from `.gitignore`, git tracking, and the build scripts.

Evidence to read:

- Is `tina/__generated__/` (or `.tina/__generated__/`) tracked by git or ignored?
- Is `public/admin/` (the built admin assets) tracked by git or ignored?
- Is `tina/tina-lock.json` tracked?
- What do the `build` and any pre-commit scripts actually run?

## Invariants in every mode

These hold in all modes and are never negotiable:

- Never hand-edit anything under `tina/__generated__/` (or `.tina/__generated__/`). It is generated output; edits are overwritten on the next build.
- Never commit secrets. `TINA_TOKEN` and any auth secret stay in environment variables, not in the repo. Only the `NEXT_PUBLIC_*` Tina values are public.
- `tina/tina-lock.json` must be committed and pushed, because TinaCloud consumes it at deploy to index content and branches. It is not produced by `tinacms build` alone.
- `tinacms`, `@tinacms/cli`, and every other `@tinacms/*` package must be pinned to the same version. Mixed versions cause module-resolution and UI/runtime mismatches. Do not recommend `@latest` as a repair default; pin from the version registry.

## Mode: build-on-CI (official)

The documented model. The CI/host build generates the artifacts on every build.

- Commit `tina/tina-lock.json` only.
- Gitignore the generated artifacts: `tina/__generated__/` (or `.tina/__generated__/`) and the built `public/admin/`.
- The build step runs `tinacms build` before the framework build, so the generated client and types exist when the framework compiles.

## Mode: hybrid / pre-commit (TIER2 community workaround)

Some projects pre-commit the generated artifacts so the site can build without a TinaCloud indexing step. Treat this whole mode as TIER2: the underlying contract mechanics are officially corroborated, but the pre-commit workflow itself is not an official recommendation.

- Commit `tina/__generated__/`, `tina/tina-lock.json`, and `public/admin/` together, as one atomic unit, so the tracked artifacts never diverge from the lockfile.
- Regenerate with `tinacms dev --noWatch --noTelemetry`, not `tinacms build`. The reason: `tinacms build` can hit TinaCloud indexing and fail with an "Unable to seed" error when the cloud schema does not yet carry the local block types.
- Record in advice that this is a community pattern with a specific failure mode, and verify it against the project before relying on it.

When in doubt about which mode applies, say which evidence you found and ask, rather than silently assuming build-on-CI or hybrid.

## Layout and file conventions

| Convention | Check | Why it matters |
| :--- | :--- | :--- |
| Config location | Current projects use `tina/config.ts` (`tsx` also valid). Legacy projects use `.tina/`. | The config moved from `.tina/` to `tina/`; advising against the wrong path fails. |
| Generated directory | `tina/__generated__/` (or `.tina/__generated__/`) is gitignored (except in hybrid mode) and rebuilt by `tinacms dev` / `tinacms build`. | It is build output; it must not be hand-edited or, in build-on-CI mode, tracked. |
| Lockfile | `tina/tina-lock.json` is committed. | TinaCloud consumes it at deploy; stale or untracked locks break indexing. |
| Build order | The build script runs `tinacms build` before the framework build. | The framework compile depends on the generated types and client. |
| ESM-only | The current Tina line is ESM-only. | A CommonJS build setup will not resolve the packages correctly. |
| Media config | The media store (`build.media` and the local public folder) matches where content actually references media. | A mismatch makes uploads succeed but images fail to resolve. |

## Collection conventions

- `name` is singular and carries no spaces or dashes (only letters, numbers, underscores).
- `path` and `format` describe the content directory and file type; globs (`match` and similar) carry no file extension.
- Use `fields` XOR `templates`: `fields` for a collection with one shape, `templates` for a collection with multiple shapes. Do not mix them on one collection.
- A collection using `templates` requires the `_template` key in each document's frontmatter to select the shape.
- Field names allow letters, numbers, and underscores only. Reserved names to avoid: `children`, `mark`, `_template`, `_sys`, `id`, `__typename`.
- Mark the display title with `isTitle` and the rich-text body with `isBody`.

## Config determinism

- Do not call `Date.now()`, `Math.random()`, or any other non-deterministic function at the top level of `tina/config.*`. The config is executed to build the schema, and non-deterministic values make builds and lockfiles unstable.
- Keep imports in `tina/config.*` minimal and type-only where possible; importing frontend-only code (DOM, hooks, component libraries) can break the config build.

## Framework-specific conventions

| Framework | Convention |
| :--- | :--- |
| Next.js App Router | Admin route under `app/admin/...`; content reads through the generated client; `useTina` only in a Client Component. |
| Next.js Pages Router | Admin route under `pages/admin/...` with the matching pages-router shape. |
| Astro | Admin is served as an island/output within the Astro build; confirm the Tina build runs before the Astro build. |

Read the admin route for the framework actually present; do not assume one router shape.

## Local-mode and runtime constraints

- Local-mode path change: when a collection's `path` or the config changes, restart the `tinacms dev` process; a running dev server does not always pick up the new path.
- Single-root-query data-layer constraint: the generated data layer expects one root query shape. Restructuring content across multiple independent roots conflicts with it; flag the constraint before proposing a restructure.
- Request interception: a `proxy.ts` (Next 16+) or `middleware.ts` rewrite or redirect that touches `/admin`, `/api/preview`, or `/api/tina/*` breaks the CMS. Check it before attributing a failure elsewhere.
- Self-hosted backend is Node.js runtime only. Edge runtimes (Cloudflare Workers, edge functions) cannot host it; use TinaCloud for edge-served sites.

## Checklist output

For a change, report each line above as pass, finding, or not-applicable, and state the resolved artifact mode. Name the files the change will touch, confirm the checklist passes for those files, and require a diff or backup plan for any generated or content-mutating action (see the diagnostic-versus-change rule in `SKILL.md`).
