# Content API And Deployment

Read this file when a task touches the content backend (local files, TinaCloud,
or self-hosted), the generated client and lock artifacts, the data layer or
GraphQL reads, or a deployment target. It answers two independent questions that
are often confused: where the content comes from, and where the site is built and
served. Resolve them separately.

> Provenance: findings `DEPLOY-01` through `DEPLOY-09`, `CLOUD-03` through `CLOUD-05`, `SELF-01` through `SELF-05`, `API-01`, `API-04`, `API-07`, `API-08`, `CLI-05` | tiers: TIER1, TIER2 (per row) | checked 2026-10-13 | recheck trigger: when a deployment-options page is added or removed, when the environment or indexing contract changes, or when a host's build-source requirement changes.

This reference is part of the runtime skill and has no path into `docs/research/`.
External specifics are referenced by topic and pulled from `source-registry.md`;
this file does not carry raw URLs. Version-sensitive runtime advice is checked
against `version-registry.md`.

## The content backend modes

Pick the lane from repository evidence (see `project-inspection.md`), then apply
its contract. The three modes are independent of the deployment host.

| Mode        | How to recognize it                                                                                                                            | What it changes                                                                                                         |
| :---------- | :--------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| Local files | No cloud client id or token; no `/api/tina/*` route; content is read from the repo at build time.                                              | No cloud environment required. `--content=local` selects this source; a `path` or config change may need a dev restart. |
| TinaCloud   | `NEXT_PUBLIC_TINA_CLIENT_ID` / `TINA_TOKEN` (often `NEXT_PUBLIC_TINA_BRANCH`); a `clientId`/`token` in `tina/config.*`; a committed lock file. | The cloud environment contract, lock-file indexing, and the deploy-time build-source requirement apply.                 |
| Self-hosted | A `/api/tina/*` route backed by `@tinacms/datalayer` (often `tinacms-authjs`).                                                                 | Runs a Node.js backend and needs a configured Git provider. It does not run on an edge runtime.                         |

If both cloud environment names and a `/api/tina/*` route appear, treat it as
self-hosted and confirm the Git provider; do not assume TinaCloud.

For TinaCloud, the environment contract uses `NEXT_PUBLIC_TINA_CLIENT_ID`,
`TINA_TOKEN`, and often `NEXT_PUBLIC_TINA_BRANCH`. `TINA_TOKEN` is a secret; only
the `NEXT_PUBLIC_*` values are public and safe to expose to the browser. Never
print, move, or commit a secret value. See the TinaCloud environment-contract and
troubleshooting topics in `source-registry.md`.

## The lock file and generated artifacts

Two artifacts drive indexing and compilation, and they are handled differently:

- `tina/tina-lock.json` must be committed and pushed. TinaCloud consumes it at
  deploy to index the schema and branches, and it is not produced by
  `tinacms build` alone. A stale or untracked lock breaks indexing.
- `tina/__generated__/` (or `.tina/__generated__/`) is build output. Never
  hand-edit it; edits are overwritten on the next build. Read content through the
  generated client, and treat any manual diff inside the directory as a finding.

### The two artifact policies

Choose the policy from repository evidence (see `conventions.md`), never by
assumption.

- Build-on-CI (official): commit `tina/tina-lock.json` only, gitignore the
  generated directory and the built admin, and regenerate on every build. The
  build step runs `tinacms build` before the framework build.
- Hybrid / pre-commit (TIER2 community pattern): commit the generated directory,
  the lock file, and the built `public/admin/` together as one atomic unit so the
  tracked artifacts never diverge from the lockfile. Regenerate with
  `tinacms dev --noWatch --noTelemetry`, not `tinacms build`, because `build` can
  hit TinaCloud indexing and fail with an "Unable to seed" error. Mark this
  pattern as community-verified and verify it against the project.

### Build order

`tinacms build` must run before the framework build, so the generated client and
types exist when the framework compiles. A build script such as
`tinacms build && next build` is the documented order. See the build-ordering and
generated-artifact topics in `source-registry.md`.

## The data-layer constraint

The generated data layer expects one root query shape. Restructuring content
across multiple independent roots conflicts with it, so flag this constraint
before proposing a restructure. GraphQL reads go through the generated client;
prefer the generated surface over hand-written queries where it fits, and reserve
custom queries for the cases the generated client cannot express. See the
data-layer, data-fetching, and custom-query topics in `source-registry.md`.

Note the accuracy flag for this area: the current `tinacms` line has no
`generateClient()` helper and no `<TinaCMS>` component. Read content through the
generated client with `client.queries.*` or `client.request`. Any code that calls
`generateClient()` or renders a `<TinaCMS>` component is stale and must not be
reproduced. See `ui-and-customization.md` for the rendering boundaries.

## Deployment host is separate from the content backend

The host only decides where `tinacms build` runs and which artifact mode applies.
A Vercel or Netlify site can serve local-file, TinaCloud, or self-hosted content;
identify the host and the backend independently. See the deployment-versus-backend
finding and the deployment-options topics in `source-registry.md`.

### The documented deployment-options family and its traps

The documented family is `{vercel, netlify, github-pages, cloudflare-pages,
cloudflare-workers}`. Do not present a target as supported if it is not in this
family.

| Host               | Trap to check before advising                                                                                                                                                                                                            |
| :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vercel             | The Tina build must run before the framework build. Set explicit revalidation or content goes stale. Conditional deploys can use an ignore-build step; full GitHub Actions delegation needs a Vercel token and project/org id secrets.   |
| Netlify            | `netlify.toml` takes precedence over the build command set in the UI, and the build command must run `tinacms build` before the framework build. Monorepos may need to forward environment variables through the monorepo tool's config. |
| GitHub Pages       | The site source must select "GitHub Actions", not "Deploy from a branch", or TinaCMS is never built. A missing entry page can cause a root-URL 404.                                                                                      |
| Cloudflare Pages   | A static/Pages target; `tinacms build` must run in the build step.                                                                                                                                                                       |
| Cloudflare Workers | An edge-runtime target. It can serve a TinaCloud-backed site, but it cannot host the self-hosted Node backend. Use TinaCloud for edge-served sites.                                                                                      |

Valid targets with no documented recipe (for example a self-managed server) are
"other": ask for the build configuration before advising on build order or
artifact mode.

### GitLab is an unlisted target

TinaCloud's Git provider is GitHub-only in the documented model, and GitLab Pages
is not in the documented deployment-options family. Do not present GitLab as a
supported TinaCloud provider or GitLab Pages as a supported host. Route a
GitLab-hosted project to the self-hosted path with a custom Git Provider, and say
plainly that GitLab Pages is not supported. Reaching GitLab requires building a
custom provider; it is not a first-class target.

## Self-hosting constraints

The self-hosted backend runs on the Node.js runtime with `@tinacms/datalayer`
(often `tinacms-authjs`) and a generated database client. It is a Node server,
not a Workers handler.

- Node runtime only. Edge runtimes cannot host the backend (a wontfix
  limitation), so edge-served sites must use TinaCloud content instead.
- Hash passwords and keep credentials and secrets in environment variables.
  Never commit raw credentials or secrets to the repository.
- Reaching a non-GitHub host requires a custom `GitProvider` ("make your own"),
  an advanced path, not a first-class target.
- The project's self-hosted example repositories are acknowledged as out of
  date, so cross-check every step against current documentation rather than
  trusting the examples alone.

## Build-time environment file

The production build environment reads `.env`, not `.env.local`. Put non-secret
build inputs in the file the build actually loads, and keep secrets out of the
repository entirely. A `.env.local` that is never read at build time is a common
cause of missing configuration; confirm which file the target's build step loads
before advising.

## Change workflow

For a backend, artifact, or deployment change, require evidence across the
surfaces it touches:

1. Config and content: the config change and representative content still agree.
2. Generated: regenerate through the CLI (never hand-edit
   `tina/__generated__/`), and confirm the lock file updates.
3. Build: the build runs `tinacms build` before the framework build, in the
   artifact mode the project actually uses.
4. Runtime: the admin loads, and a content round-trip works against the resolved
   backend.

State the backend lane and the host separately, name the files the change will
touch, and require a diff or backup plan for any generated or content-mutating
action. Never prescribe deleting the lockfile or exposing a token.
