# Source registry

This is a runtime reference for the skill. It is the single source of the
external documentation links the skill may cite. The columns are exactly:

`topic | official URL | checked date | version/applicability evidence | caveat | recheck trigger`

Usage: look up the topic you need and pull the cited URL into an answer. Never
invent, guess, or "remember" a docs URL. When a topic is missing from this
registry, say the link is unverified and omit it rather than fabricating one.
Rows stay target-generic: they name documentation topics, never a specific
repository, local path, commit, digest, or test result. Target-specific
observations belong in the authoring record under `docs/research/`, which the
runtime skill never reads or links.

Provenance: every URL below was verified reachable on 2026-10-13 against the
current official TinaCMS documentation set. Several routes were corrected to
their canonical page (for example `/docs/reference/schema`, not `/docs/schema`;
`/docs/graphql/queries` plus `/docs/graphql/cli`, not `/docs/graphql/overview`;
`/docs/reference/content-api/data-layer`, not a content-delivery path). Each row
carries its own checked date, so a single stale row can be refreshed without
touching the rest. Several topics resolve to one canonical page; where a page
documents more than one lookup topic, each topic gets its own row so an agent
can still find it by the phrase a user is likely to use.

## Update triggers

Refresh a row when any of these happen:

- a TinaCMS documentation page is renamed, moved, or removed;
- the deployment-options family changes (a target is added or dropped);
- the current stable `tinacms` or `@tinacms/cli` line advances and a page's
  content is version-sensitive;
- a review finds a row whose checked date is older than the freshness window.

Do not add a row for an unverified URL. Do not lower a version floor here; the
dated floors, windows, and history live in `version-registry.md`.

| topic | official URL | checked date | version/applicability evidence | caveat | recheck trigger |
| --- | --- | --- | --- | --- | --- |
| TinaCMS documentation home | [tina.io/docs](https://tina.io/docs) | 2026-10-13 | Reachable; entry point for the current documentation set | Landing page only; it links the topic pages listed below, so cite the specific topic, not this home | Recheck when the docs information architecture changes |
| Project initialization (tina init) | [introduction/tina-init](https://tina.io/docs/introduction/tina-init) | 2026-10-13 | Applies to the current `tinacms` 3.x line | Names the init flow; do not present `npx ...@latest init` as a default, pin from `version-registry.md` | Recheck when the init flow or starter default changes |
| CLI overview | [cli-overview](https://tina.io/docs/cli-overview) | 2026-10-13 | Applies to `@tinacms/cli` 2.x | Overview only; subcommands and flags are version-sensitive, confirm against the installed CLI | Recheck when `@tinacms/cli` ships a new minor |
| Tina folder layout | [tina-folder/overview](https://tina.io/docs/tina-folder/overview) | 2026-10-13 | Current config location is `tina/` | A legacy project may still use `.tina/`; detect the actual location before advising | Recheck if the config location moves again |
| Config location move (.tina to tina) | [blog/tina-config-rearrangements](https://tina.io/blog/tina-config-rearrangements) | 2026-10-13 | Explains the historical `.tina/` to `tina/` move | Blog post is a dated explanation, not the current reference; pair it with the folder overview | Recheck on the next config-location change |
| Generated artifacts and lock file contract | [tina-folder/overview](https://tina.io/docs/tina-folder/overview) | 2026-10-13 | Documents `tina/tina-lock.json` and the generated directory | The lock file is consumed at deploy and is not produced by the build alone; verify the project's own artifact mode first | Recheck when the lock/artifact contract changes |
| Separate content repository | [guides/separate-content-repo](https://tina.io/docs/guides/separate-content-repo) | 2026-10-13 | Guide for a split content repo | Treat committed-generated-artifacts guidance here as the superseded model; confirm the project's mode | Recheck when the content-repo guide is revised |
| Schema reference | [reference/schema](https://tina.io/docs/reference/schema) | 2026-10-13 | Canonical schema page for the current line | Corrected route: `/docs/reference/schema`, not `/docs/schema` | Recheck when the schema object shape changes |
| Schema build and validation | [reference/schema](https://tina.io/docs/reference/schema) | 2026-10-13 | Covers schema construction and validation errors | Schema errors surface at build; inspect the actual error before advising | Recheck on the next schema-schema change |
| Collections reference | [reference/collections](https://tina.io/docs/reference/collections) | 2026-10-13 | Canonical collections page | Collections map to repo directories; confirm the actual content directory | Recheck when collection keys change |
| Collection path and format | [reference/collections](https://tina.io/docs/reference/collections) | 2026-10-13 | Documents `path` and `format` | A `path` that does not match the real directory is a common failure; verify against the repo | Recheck when path/format semantics change |
| Collection match globs | [reference/collections](https://tina.io/docs/reference/collections) | 2026-10-13 | Documents match patterns | Match globs carry no file extension; confirm against the project | Recheck when glob behavior changes |
| Collection fields versus templates | [reference/collections](https://tina.io/docs/reference/collections) | 2026-10-13 | Explains single-shape versus multi-shape collections | Use `fields` XOR `templates`; a `templates` collection needs `_template` in each document | Recheck when collection modeling changes |
| Fields reference | [reference/fields](https://tina.io/docs/reference/fields) | 2026-10-13 | Canonical fields page for the current line | Field UI and validation live here; deeper per-type detail is in the type pages | Recheck when field keys change |
| Field UI and validation | [reference/fields](https://tina.io/docs/reference/fields) | 2026-10-13 | Documents field `ui`, `required`, `isTitle`, `isBody` | Reserved field names still apply; check the collection conventions before advising | Recheck when field `ui` keys change |
| Field type: string | [reference/types/string](https://tina.io/docs/reference/types/string) | 2026-10-13 | Current documented field type | `select` is a string field with `options`, not a first-class keyword | Recheck when the string field shape changes |
| Field type: number | [reference/types/number](https://tina.io/docs/reference/types/number) | 2026-10-13 | Current documented field type | Numeric coercion differs from string; confirm the stored value shape | Recheck when the number field shape changes |
| Field type: datetime | [reference/types/datetime](https://tina.io/docs/reference/types/datetime) | 2026-10-13 | Current documented field type | Date formatting and timezone behavior are version-sensitive | Recheck when datetime handling changes |
| Field type: boolean | [reference/types/boolean](https://tina.io/docs/reference/types/boolean) | 2026-10-13 | Current documented field type | Simple scalar; watch default handling in frontmatter | Recheck when the boolean field shape changes |
| Field type: image | [reference/types/image](https://tina.io/docs/reference/types/image) | 2026-10-13 | Current documented field type | Media config must match where content references media | Recheck when media handling changes |
| Field type: reference | [reference/types/reference](https://tina.io/docs/reference/types/reference) | 2026-10-13 | Current documented field type | A `reference` cannot be `list: true` directly; shared field names across referenced collections must share a type | Recheck when reference behavior changes |
| Field type: object | [reference/types/object](https://tina.io/docs/reference/types/object) | 2026-10-13 | Current documented field type | Grouping uses object fields; use this for custom admin field UI rather than an unverified extending page | Recheck when the object field shape changes |
| Field type: rich-text | [reference/types/rich-text](https://tina.io/docs/reference/types/rich-text) | 2026-10-13 | Current documented field type | Rich-text is a structured document; rendering differs from plain Markdown | Recheck when rich-text handling changes |
| Field type: display-only | [reference/types/display-only](https://tina.io/docs/reference/types/display-only) | 2026-10-13 | Current documented field type | Display-only fields are not edited; confirm the project uses them intentionally | Recheck when display-only behavior changes |
| Field type: rendering-markdown | [reference/types/rendering-markdown](https://tina.io/docs/reference/types/rendering-markdown) | 2026-10-13 | Current documented field type | Markdown rendering differs from rich-text; pick the type the content actually needs | Recheck when markdown rendering changes |
| GraphQL queries | [graphql/queries](https://tina.io/docs/graphql/queries) | 2026-10-13 | Canonical queries page for the current line | Corrected route: `/docs/graphql/queries`, not `/docs/graphql/overview` | Recheck when the query surface changes |
| GraphQL query filtering, sorting, pagination | [graphql/queries](https://tina.io/docs/graphql/queries) | 2026-10-13 | Documents filters, sorting, and pagination | Generated client methods are version-sensitive; confirm against the installed client | Recheck when filter/sort options change |
| GraphQL CLI | [graphql/cli](https://tina.io/docs/graphql/cli) | 2026-10-13 | Canonical CLI page for GraphQL | Corrected route: `/docs/graphql/cli`; do not cite `/docs/graphql/overview` | Recheck when the GraphQL CLI changes |
| Content API data layer | [reference/content-api/data-layer](https://tina.io/docs/reference/content-api/data-layer) | 2026-10-13 | Canonical data-layer page | Corrected route: `/docs/reference/content-api/data-layer`, not a content-delivery path | Recheck when the data layer changes |
| Data fetching overview | [data-fetching/overview](https://tina.io/docs/data-fetching/overview) | 2026-10-13 | Canonical data-fetching page | Fetch strategy and revalidation are version-sensitive | Recheck when the fetching model changes |
| Custom queries | [data-fetching/custom-queries](https://tina.io/docs/data-fetching/custom-queries) | 2026-10-13 | Documents hand-written queries | Prefer the generated client where it fits; confirm before diverging | Recheck when custom-query guidance changes |
| Generated client usage | [data-fetching/overview](https://tina.io/docs/data-fetching/overview) | 2026-10-13 | Shows reading content through the generated client | Use `tina/__generated__/client` with `client.queries.*` or `client.request`; there is no `generateClient()` helper in the current line | Recheck when generated-client guidance changes |
| Contextual editing overview | [contextual-editing/overview](https://tina.io/docs/contextual-editing/overview) | 2026-10-13 | Canonical contextual-editing page | Visual editing is client-side; confirm the component boundary | Recheck when contextual editing changes |
| tinaField data attributes | [contextual-editing/tinafield](https://tina.io/docs/contextual-editing/tinafield) | 2026-10-13 | Documents click-to-edit data attributes | Apply `data-tina-field` to DOM elements, not component wrappers | Recheck when `tinaField` guidance changes |
| Next.js App Router integration | [frameworks/next/app-router](https://tina.io/docs/frameworks/next/app-router) | 2026-10-13 | Canonical App Router integration page | Router shape and async request APIs are version-sensitive | Recheck when the framework integration changes |
| Admin route placement | [frameworks/next/app-router](https://tina.io/docs/frameworks/next/app-router) | 2026-10-13 | Shows where the admin route lives | Admin usually sits at the domain root or its own subdomain; sub-path deployments have known asset issues | Recheck when admin routing changes |
| Request interception (proxy or middleware) | [frameworks/next/app-router](https://tina.io/docs/frameworks/next/app-router) | 2026-10-13 | Relevant to `proxy.ts` (Next 16+) and `middleware.ts` | A rewrite touching `/admin`, `/api/preview`, or `/api/tina/*` breaks the CMS | Recheck when the framework request layer changes |
| Visual editing client boundary | [contextual-editing/overview](https://tina.io/docs/contextual-editing/overview) | 2026-10-13 | Explains the client-only hook boundary | `useTina` cannot run in a Server Component | Recheck when the hook contract changes |
| TinaCloud overview | [tinacloud/overview](https://tina.io/docs/tinacloud/overview) | 2026-10-13 | Canonical TinaCloud page | Managed service; the Git provider is GitHub-only in the documented model | Recheck when TinaCloud scope changes |
| TinaCloud environment contract | [tinacloud/overview](https://tina.io/docs/tinacloud/overview) | 2026-10-13 | Documents the client id, token, and branch variables | `TINA_TOKEN` is a secret; only the `NEXT_PUBLIC_*` values are public | Recheck when the environment contract changes |
| TinaCloud schema indexing | [tinacloud/overview](https://tina.io/docs/tinacloud/overview) | 2026-10-13 | Explains lock-file based indexing at deploy | The lock file must be committed and pushed for indexing | Recheck when the indexing contract changes |
| TinaCloud troubleshooting | [tinacloud/troubleshooting](https://tina.io/docs/tinacloud/troubleshooting) | 2026-10-13 | Diagnosis page for cloud issues | Symptom-to-cause guidance; confirm against the project's own logs | Recheck when TinaCloud failure modes change |
| Deployment option: Vercel | [tinacloud/deployment-options/vercel](https://tina.io/docs/tinacloud/deployment-options/vercel) | 2026-10-13 | Documents the Vercel target | The Tina build must run before the framework build; set explicit revalidation | Recheck when the deployment recipe changes |
| Deployment option: Netlify | [tinacloud/deployment-options/netlify](https://tina.io/docs/tinacloud/deployment-options/netlify) | 2026-10-13 | Documents the Netlify target | `netlify.toml` takes precedence over the UI build-command setting | Recheck when the deployment recipe changes |
| Deployment option: GitHub Pages | [tinacloud/deployment-options/github-pages](https://tina.io/docs/tinacloud/deployment-options/github-pages) | 2026-10-13 | Documents the GitHub Pages target | The site source must select "GitHub Actions", not "Deploy from a branch" | Recheck when the deployment recipe changes |
| Deployment option: Cloudflare Pages | [tinacloud/deployment-options/cloudflare-pages](https://tina.io/docs/tinacloud/deployment-options/cloudflare-pages) | 2026-10-13 | Documents the Cloudflare Pages target | Static/Pages target; the Tina build must run in the build step | Recheck when the deployment recipe changes |
| Deployment option: Cloudflare Workers | [tinacloud/deployment-options/cloudflare-workers](https://tina.io/docs/tinacloud/deployment-options/cloudflare-workers) | 2026-10-13 | Documents the Cloudflare Workers target | Edge runtime; it cannot host the self-hosted Node backend, use TinaCloud for edge | Recheck when the deployment recipe changes |
| Self-hosted overview | [self-hosted/overview](https://tina.io/docs/self-hosted/overview) | 2026-10-13 | Canonical self-hosted page | Node.js runtime only; edge runtimes are not supported | Recheck when self-hosting guidance changes |
| Self-hosted manual setup | [self-hosted/manual-setup](https://tina.io/docs/self-hosted/manual-setup) | 2026-10-13 | Step-by-step manual setup | Confirm each step against the project; the shipped examples may lag the docs | Recheck when manual setup changes |
| Self-hosted runtime constraint (Node only) | [self-hosted/overview](https://tina.io/docs/self-hosted/overview) | 2026-10-13 | States the Node-runtime requirement | Edge functions and Workers cannot host the backend; this is a wontfix limitation | Recheck if the runtime constraint is lifted |
| Self-hosted Git provider overview | [reference/self-hosted/git-provider/overview](https://tina.io/docs/reference/self-hosted/git-provider/overview) | 2026-10-13 | Documents the Git provider interface | GitHub is the supported provider; other hosts need a custom provider | Recheck when provider support changes |
| Self-hosted custom Git provider | [reference/self-hosted/git-provider/make-your-own](https://tina.io/docs/reference/self-hosted/git-provider/make-your-own) | 2026-10-13 | Documents building a custom GitProvider | Reaching a non-GitHub host requires this path; it is not a first-class target | Recheck when the provider API changes |
| Self-hosted auth and environment | [self-hosted/manual-setup](https://tina.io/docs/self-hosted/manual-setup) | 2026-10-13 | Covers auth wiring and environment variables | Hash credentials and keep secrets out of the repo; never commit raw credentials | Recheck when auth guidance changes |
| Build ordering (tinacms build first) | [cli-overview](https://tina.io/docs/cli-overview) | 2026-10-13 | Documents the build command | The Tina build must run before the framework build so generated types exist | Recheck when build behavior changes |
| Dev workflow wrapper | [cli-overview](https://tina.io/docs/cli-overview) | 2026-10-13 | Documents `tinacms dev -c "<command>"` | The wrapped command is the framework dev server; never ship a dev artifact | Recheck when the dev workflow changes |
| Audit and doctor diagnostics | [cli-overview](https://tina.io/docs/cli-overview) | 2026-10-13 | Documents the audit and doctor subcommands | Diagnostic only; confirm flags against the installed CLI version | Recheck when diagnostics change |
| GraphQL codegen commands | [graphql/cli](https://tina.io/docs/graphql/cli) | 2026-10-13 | Documents code generation from the CLI | Codegen writes generated files; never hand-edit them | Recheck when codegen changes |
| Local content source | [cli-overview](https://tina.io/docs/cli-overview) | 2026-10-13 | Documents the local content flag | Local mode skips cloud indexing; a path or config change may need a dev restart | Recheck when local mode changes |
| Markdown and MDX rendering | [reference/types/rendering-markdown](https://tina.io/docs/reference/types/rendering-markdown) | 2026-10-13 | Documents Markdown rendering | Rendering is separate from storage format; confirm the project's renderer | Recheck when rendering guidance changes |
| Media and image handling | [reference/types/image](https://tina.io/docs/reference/types/image) | 2026-10-13 | Documents image fields and media | Media config must match where content references media | Recheck when media handling changes |
| Reference field constraints | [reference/types/reference](https://tina.io/docs/reference/types/reference) | 2026-10-13 | Documents reference fields | Large referenced collections can make the picker slow; shared field names must share a type | Recheck when reference behavior changes |
| Object and group fields | [reference/types/object](https://tina.io/docs/reference/types/object) | 2026-10-13 | Documents object fields | Use object fields for grouped data and custom field UI | Recheck when the object field shape changes |
| Data layer architecture and constraints | [reference/content-api/data-layer](https://tina.io/docs/reference/content-api/data-layer) | 2026-10-13 | Documents the data-layer architecture | Expects one root query shape; multiple independent roots conflict | Recheck when the data layer changes |
| Content revalidation and caching | [data-fetching/overview](https://tina.io/docs/data-fetching/overview) | 2026-10-13 | Documents fetch and cache behavior | On Vercel, set explicit revalidation or content goes stale | Recheck when caching guidance changes |
