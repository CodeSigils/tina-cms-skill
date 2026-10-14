# Project Inspection

Read this file when you need the full routing procedure: which Tina surface a task touches, which content backend the project runs, whether TinaDocs is present, and which host it deploys to. Run it before advising, and before loading `conventions.md` for a change.

This reference is part of the runtime skill. It has no path into `docs/research/`; authoring notes stay outside the loaded skill. Every external link named below is referenced by topic and pulled from `source-registry.md`; this file does not carry raw URLs.

> Provenance: findings `DEPLOY-01` through `DEPLOY-09`, `CLOUD-01` through `CLOUD-05`, `SELF-01` through `SELF-05`, `API-01`, `API-09`, `CLI-05` | tiers: TIER1, TIER2, TIER3 (per row) | checked 2026-10-13 | recheck trigger: whenever a deployment-target or backend-routing fact changes, or a host adds or retires a documented deployment option.

## The four inspection axes

The skill routes on three independent content axes plus a deployment axis. They are independent: resolve each one on its own and never let one decide another.

| Axis                     | Branch values                                                                           | What the branch controls                                               |
| :----------------------- | :-------------------------------------------------------------------------------------- | :--------------------------------------------------------------------- |
| CMS                      | TinaCMS present / absent                                                                | Whether this skill applies at all.                                     |
| Content backend          | local files / TinaCloud / self-hosted                                                   | Which env names, lockfile contract, and build expectations apply.      |
| TinaDocs                 | present / absent                                                                        | Whether TinaDocs OpenAPI workflows are in scope at all.                |
| Deployment target (host) | Vercel / Netlify / GitHub Pages / Cloudflare Pages / Cloudflare Workers / local / other | Where `tinacms build` runs and which generated-artifact mode is valid. |

Deployment host is not the content backend. A Vercel or Netlify site can serve local-file, TinaCloud, or self-hosted content; the host changes the build source and the artifact mode, not the content source. Identify the host and the backend separately.

## Step A: First-hop signal table

Scan the target project for these signals. A strong signal confirms the skill is engaged and narrows the surface. A weak or absent signal means you may be in the wrong skill: say so instead of guessing.

| Signal                                                                                      | What it means                                                                                                                                                                                                                   | Route                                                                                                                                |
| :------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------- |
| `tina/config.ts` or `tina/config.tsx`                                                       | Required configuration for a current TinaCMS project.                                                                                                                                                                           | TinaCMS present; continue. Legacy projects instead carry `.tina/` (see `conventions.md`).                                            |
| `tina/tina-lock.json`                                                                       | Schema lockfile. It must be committed and pushed: TinaCloud consumes it at deploy to index the schema, and it is not produced by `tinacms build` alone.                                                                         | Confirms TinaCMS; check it is tracked by git and not stale.                                                                          |
| `tina/__generated__/` or `.tina/__generated__/`                                             | Generated client, types, and (in self-hosted projects) a database client. It is gitignored and rebuilt by `tinacms dev` / `tinacms build`; it must never be hand-edited. A missing gitignore entry is a finding, not a feature. | Confirms TinaCMS; flag any diff or manual edit inside the directory.                                                                 |
| `tinacms`, `@tinacms/cli`, or any other `@tinacms/*` entry in `package.json`                | TinaCMS install.                                                                                                                                                                                                                | Confirm the install; then check that `tinacms` and every `@tinacms/*` package are pinned to the same version (see `conventions.md`). |
| `tinacms dev -c "next dev"` (or another framework command) in `package.json` scripts        | The Tina dev script wraps the framework dev server.                                                                                                                                                                             | Confirms the dev workflow; read the wrapped command to learn the framework.                                                          |
| `import { useTina } from "tinacms/dist/react"`                                              | The visual-editing hook. It is a Client Component hook only and cannot run in a Server Component.                                                                                                                               | Confirms content-driven rendering; note the client-only constraint.                                                                  |
| `import { client } from "@/tina/__generated__/client"` (or a similar generated-client path) | Generated GraphQL client.                                                                                                                                                                                                       | Confirms content is read through the generated API rather than hand-written GraphQL.                                                 |
| `app/api/tina/[...routes]/route.ts`, or an equivalent `/api/tina/*` route                   | Self-hosted Tina backend route backed by `@tinacms/datalayer`.                                                                                                                                                                  | Select the self-hosted backend lane (Step B).                                                                                        |
| `NEXT_PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`, `NEXT_PUBLIC_TINA_BRANCH`                       | The TinaCloud environment contract. `TINA_TOKEN` is a read token and a secret; the `NEXT_PUBLIC_*` values are public and may be exposed to the browser.                                                                         | Select the TinaCloud backend lane (Step B). Never print, move, or commit a secret value.                                             |
| `proxy.ts` (Next 16+) or `middleware.ts`                                                    | Request interception in front of the app.                                                                                                                                                                                       | Inspect it before advising: a rewrite or redirect that touches `/admin`, `/api/preview`, or `/api/tina/*` breaks the CMS (Step E).   |

Also read the framework and build files: the package manager and its lockfile, every `package.json` script, the config location (`tina/` current vs `.tina/` legacy), the generated-artifact directory, the content frontmatter format, the admin route, and any host or deploy configuration.

## Step B: Select the content backend lane

| Lane        | Signals                                                                                                                                                 | What changes                                                                                                          |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------- |
| Local files | No `clientId`/`token` in config, or an explicit local flag; no `/api/tina/*` route; content read at build time from the repo.                           | No cloud env required. Path changes need a dev restart (see `conventions.md`).                                        |
| TinaCloud   | `NEXT_PUBLIC_TINA_CLIENT_ID` / `TINA_TOKEN` (and often `NEXT_PUBLIC_TINA_BRANCH`); a `clientId`/`token` in `tina/config.*`; `tina-lock.json` committed. | Cloud env contract, lockfile indexing, and the deploy-time build-source requirement apply.                            |
| Self-hosted | `app/api/tina/[...routes]/route.ts` (or equivalent), `@tinacms/datalayer`, and often `tinacms-authjs`.                                                  | Runs a Node.js backend; the Git provider must be configured. The self-hosted backend does not run on an edge runtime. |

If both cloud env names and a `/api/tina/*` route appear, treat it as self-hosted and confirm the Git provider, do not assume TinaCloud.

## Step C: TinaDocs present or absent

Only route to TinaDocs work when a TinaDocs site or an API-schema collection is actually present (typically a `collections` entry that points at OpenAPI/API-spec content, or a TinaDocs content tree). TinaDocs OpenAPI page generation is a documentation-site workflow with its own mutation boundary; it is not the TinaCMS GraphQL content API. Never apply TinaDocs OpenAPI steps to an ordinary TinaCMS content task. The TinaDocs workflow itself lives in a separate routed reference.

## Step D: Identify the deployment target host

Identify the host before advising, because the host decides where `tinacms build` runs and which generated-artifact mode is valid.

| Host               | Route note                                                                                                                                         |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vercel / Netlify   | The build command must run `tinacms build` before the framework build. Netlify: `netlify.toml` takes precedence over the UI build-command setting. |
| GitHub Pages       | The site source must select "GitHub Actions" as the build source (not "Deploy from a branch"), or TinaCMS is never built.                          |
| Cloudflare Pages   | A static/Pages target; `tinacms build` must run in the build step.                                                                                 |
| Cloudflare Workers | An edge runtime target. It can serve a TinaCloud-backed site, but it cannot host the self-hosted Node backend.                                     |
| Local              | Development only; never ship a `tinacms dev` artifact to production.                                                                               |
| Other              | Unknown host: ask for the build configuration before advising on build order or artifacts.                                                         |

Do not present a host as supported that is not in the documented deployment-options family. In particular, GitLab is an unlisted target: TinaCloud's Git provider is GitHub-only, and GitLab Pages is not a documented deployment option. Route a GitLab-hosted project to the self-hosted path with a custom Git Provider, and say plainly that GitLab Pages is not supported. Pull the Git-provider and deployment topics from `source-registry.md` before quoting specifics.

## Step E: Check request interception

TinaCMS depends on three URL prefixes at runtime: the admin route under `/admin`, the preview endpoint at `/api/preview`, and (in self-hosted projects) the backend under `/api/tina/*`. Read `proxy.ts` (Next 16+) or `middleware.ts` and flag any rewrite or redirect that captures one of those prefixes. A matcher that is too broad is a common cause of a broken admin or a 404 on the backend route; report it as the likely cause rather than editing it blind.

## Output of this inspection

Report, before any advice or change:

1. CMS present or absent, with the strongest signals.
2. Content backend lane (local / TinaCloud / self-hosted) and how it was determined.
3. TinaDocs present or absent, and whether the task is in scope for it.
4. Deployment target host, stated separately from the backend lane.
5. Any convention finding (legacy `.tina/`, untracked lockfile, hand-edited generated files, mismatched `@tinacms/*` versions) that `conventions.md` will expand into a checklist.
