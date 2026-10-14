---
name: tina-cms
description: "Use if working in or diagnosing a repository that has a TinaCMS surface: tina/config.ts or tina/config.tsx, tinacms or @tinacms/cli in package.json, tina/tina-lock.json, useTina, or a generated Tina client. Covers TinaCMS setup, schema and collections, content and generated GraphQL artifacts, TinaCloud versus self-hosted routing, deployment targets, public-site and admin CSS, and TinaDocs OpenAPI. Detects the actual Tina surface in the repository before advising. Not for general Next.js, Astro, or Hugo work with no Tina layer."
---

# TinaCMS

Tina is not one surface. A single repository can combine the TinaCMS content framework, a content backend (local files, TinaCloud, or self-hosted), an optional TinaDocs API-documentation site, the public site, and a custom admin. These do not share one runtime contract, so the first job is always to find out which surface the task touches before answering.

## Runtime Boundary

This skill loads only files under `skills/tina-cms/` (this file, `references/`, and `scripts/`). Nothing the loaded skill reads or links may point at `docs/research/` or any path outside the skill directory; those are authoring-time inputs, not runtime inputs. Every external link comes from `references/source-registry.md`. Never invent or "remember" a docs URL; look the topic up in the registry, or state that the link is unverified.

## Step 0: Inspect The Repository Before Advising

Do not answer from memory or from another project's shape. Every task starts with repository evidence. Scan the repo first, then load the reference that matches the surface you found.

Load triggers:

- Read `references/project-inspection.md` when you need the full CMS / backend / TinaDocs / deployment-target routing procedure and its first-hop signal table.
- Read `references/conventions.md` before advising on any change. It is the project-conventions checklist the project's own layout must pass first, including which generated-artifact mode the project runs.
- Read `references/source-registry.md` when you need an official docs link or a provenance-checked, dated source. Pull the cited link from there; do not embed raw URLs.
- Read `references/version-registry.md` when the task depends on a Tina, Next, React, or Node version, or when the repository's installed versions may sit below the security floor or inside a known-bad window.

Domain load triggers, read after the core references above and routed by the surface the task touches:

- Read `references/cli.md` when the task touches the `tinacms` / `@tinacms/cli` commands, dev or build flags, ports, the `audit` / `doctor` diagnostics, or version pinning.
- Read `references/schema-and-content.md` when the task authors or changes a collection, field, template, or frontmatter content, or validates that config and content still agree.
- Read `references/content-api-and-deployment.md` when the task touches the content backend (local files, TinaCloud, self-hosted), the generated client and lock artifacts, the data layer or GraphQL reads, or a deployment target.
- Read `references/ui-and-customization.md` when the task touches how a surface renders or is styled: public-site rendering, the Tina admin, contextual editing, or a custom admin field UI.
- Read `references/tinadocs-openapi-and-styling.md` only when a TinaDocs documentation site or an API-schema (OpenAPI spec) collection is actually present; it does not apply to an ordinary TinaCMS GraphQL content task.

## Detect TinaCMS In The Repo (First Hop)

Run these scans in the target project. Strong signals confirm the skill is engaged and tell you which surface applies. Weak signals mean you may be in the wrong skill; say so instead of guessing. The full signal table, including the self-hosted backend lane and request-interception checks, is in `references/project-inspection.md`.

| Signal | What it means |
| :--- | :--- |
| `tina/config.ts` or `tina/config.tsx` | TinaCMS project. This is the current config location; legacy projects use `.tina/`. |
| `tina/tina-lock.json` | Schema lockfile. Must be committed and pushed; TinaCloud consumes it at deploy, and it is not produced by `tinacms build` alone. |
| `tina/__generated__/` or `.tina/__generated__/` | Generated client and types. Gitignored and rebuilt by `tinacms dev` / `tinacms build`; never hand-edited. Absence of a gitignore entry is a finding, not a feature. |
| `tinacms`, `@tinacms/cli`, or any other `@tinacms/*` in `package.json` | TinaCMS install. Check that the packages are pinned to the same version. |
| `tinacms dev -c "..."` in `package.json` scripts | Tina dev script. The wrapped command is the framework dev server. |
| `import { useTina } from "tinacms/dist/react"` | Visual-editing hook. Client Component only; it cannot run in a Server Component. |
| `import { client } from "@/tina/__generated__/client"` (or a similar generated-client path) | Generated GraphQL client. Confirms content is read through the generated API. |
| `app/api/tina/[...routes]/route.ts` (or an equivalent `/api/tina/*` route) | Self-hosted Tina backend route. Signals the self-hosted lane, not TinaCloud. |
| `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`, `NEXT_PUBLIC_TINA_BRANCH` | TinaCloud environment contract. `TINA_TOKEN` is a secret; the `NEXT_PUBLIC_*` ones are public. |
| `proxy.ts` (Next 16+) or `middleware.ts` | Request interception. Inspect it: a rewrite or redirect that touches `/admin`, `/api/preview`, or `/api/tina/*` breaks the CMS. |

Also read the framework and build files: the package manager and lockfile, `package.json` scripts, the config location (`tina/` current vs `.tina/` legacy), the generated-artifact directory, the frontmatter/content format, the admin route, and the host or deploy config. The full procedure and the deployment-target axis live in `references/project-inspection.md`.

## Route By Surface

The routing model has three content axes plus a deployment axis. Pick one branch per axis, and do not let one axis decide another. In particular, the deployment host is not the content backend: a Vercel site may run local-file, TinaCloud, or self-hosted content, and the host only changes where the Tina build runs and which artifact mode applies.

| Axis | Branches | Route to |
| :--- | :--- | :--- |
| CMS | TinaCMS framework present / absent | Present: continue; route CLI, pinning, or dev/build work to `references/cli.md` and collection, field, or content work to `references/schema-and-content.md`. Absent: this skill does not apply; stop and say why. |
| Content backend | local files / TinaCloud / self-hosted | `references/project-inspection.md` selects the lane; the lane then sets env, lock, and build expectations. Read `references/content-api-and-deployment.md` for the lane contract, lock and generated-artifact handling, data-layer constraint, and build order. |
| TinaDocs | present / absent | Only route to TinaDocs work when a TinaDocs site or an API-schema collection exists. Never apply TinaDocs OpenAPI steps to ordinary TinaCMS GraphQL tasks. |
| Deployment target | Vercel / Netlify / GitHub Pages / Cloudflare Pages / Cloudflare Workers / local / other | Identify the host before advising. The host sets where `tinacms build` runs and which artifact mode applies; read `references/content-api-and-deployment.md` for the per-host traps. GitLab is an unlisted target: route it to the self-hosted path with a custom Git Provider; never present GitLab Pages as supported. |

Rendering and styling has no dedicated axis; route it by surface with `references/ui-and-customization.md` (public-site rendering, the Tina admin, a custom admin field UI, or TinaDocs CSS), after naming which surface applies.

When a routed reference does not exist yet in this skill, resolve the surface through `references/project-inspection.md` and the source registry, and flag the gap rather than improvising an answer.

## Version Awareness Is Mandatory

Tina ships fast and has an active security floor plus known-bad windows. When a task depends on versions, do not claim a "current version" from memory. Read `references/version-registry.md`, compare it against the repository's installed and locked versions, and if the repo falls below the floor or inside a bad window, tell the user with the exact installed versions and a safe path before giving version-dependent advice. Never recommend `@latest` as a repair default; pin from the registry.

## Primary Sources

Every external link in this skill is drawn from `references/source-registry.md`, the dated, provenance-checked docs-link bank. When you need an official URL, look up the matching topic there and pull the cited link into your answer. When the registry does not yet carry a topic, say the link is unverified and omit it; do not fabricate or paste a remembered URL. Do not carry raw external URLs in this file; the registry is the single source for them.

## Diagnostic Versus Change

Deciding what is wrong and asking for a change are different tasks. When the request is diagnostic, report the surface, the evidence, and the risk without editing. When the request is a change, name the files you will touch, confirm the conventions checklist passes, and require a diff or backup plan for any generated or content-mutating action.
