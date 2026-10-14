# Official links

Human-facing export of the skill's documentation-link bank. This file
mirrors the same URL set as `skills/tina-cms/references/source-registry.md`,
which is the runtime source of truth. If the two disagree, the registry wins.

Each row lists the lookup topic, the official URL, the date it was checked,
and the trigger that should prompt a recheck. Authoring notes and findings live
under `docs/research/` and are not part of this export.

| topic | official URL | checked date | recheck trigger |
| --- | --- | --- | --- |
| TinaCMS documentation home | [https://tina.io/docs](https://tina.io/docs) | 2026-10-13 | Recheck when the docs information architecture changes |
| Project initialization (tina init) | [https://tina.io/docs/introduction/tina-init](https://tina.io/docs/introduction/tina-init) | 2026-10-13 | Recheck when the init flow or starter default changes |
| CLI overview | [https://tina.io/docs/cli-overview](https://tina.io/docs/cli-overview) | 2026-10-13 | Recheck when `@tinacms/cli` ships a new minor |
| Tina folder layout | [https://tina.io/docs/tina-folder/overview](https://tina.io/docs/tina-folder/overview) | 2026-10-13 | Recheck if the config location moves again |
| Config location move (.tina to tina) | [https://tina.io/blog/tina-config-rearrangements](https://tina.io/blog/tina-config-rearrangements) | 2026-10-13 | Recheck on the next config-location change |
| Generated artifacts and lock file contract | [https://tina.io/docs/tina-folder/overview](https://tina.io/docs/tina-folder/overview) | 2026-10-13 | Recheck when the lock/artifact contract changes |
| Separate content repository | [https://tina.io/docs/guides/separate-content-repo](https://tina.io/docs/guides/separate-content-repo) | 2026-10-13 | Recheck when the content-repo guide is revised |
| Schema reference | [https://tina.io/docs/reference/schema](https://tina.io/docs/reference/schema) | 2026-10-13 | Recheck when the schema object shape changes |
| Schema build and validation | [https://tina.io/docs/reference/schema](https://tina.io/docs/reference/schema) | 2026-10-13 | Recheck on the next schema-schema change |
| Collections reference | [https://tina.io/docs/reference/collections](https://tina.io/docs/reference/collections) | 2026-10-13 | Recheck when collection keys change |
| Collection path and format | [https://tina.io/docs/reference/collections](https://tina.io/docs/reference/collections) | 2026-10-13 | Recheck when path/format semantics change |
| Collection match globs | [https://tina.io/docs/reference/collections](https://tina.io/docs/reference/collections) | 2026-10-13 | Recheck when glob behavior changes |
| Collection fields versus templates | [https://tina.io/docs/reference/collections](https://tina.io/docs/reference/collections) | 2026-10-13 | Recheck when collection modeling changes |
| Fields reference | [https://tina.io/docs/reference/fields](https://tina.io/docs/reference/fields) | 2026-10-13 | Recheck when field keys change |
| Field UI and validation | [https://tina.io/docs/reference/fields](https://tina.io/docs/reference/fields) | 2026-10-13 | Recheck when field `ui` keys change |
| Field type: string | [https://tina.io/docs/reference/types/string](https://tina.io/docs/reference/types/string) | 2026-10-13 | Recheck when the string field shape changes |
| Field type: number | [https://tina.io/docs/reference/types/number](https://tina.io/docs/reference/types/number) | 2026-10-13 | Recheck when the number field shape changes |
| Field type: datetime | [https://tina.io/docs/reference/types/datetime](https://tina.io/docs/reference/types/datetime) | 2026-10-13 | Recheck when datetime handling changes |
| Field type: boolean | [https://tina.io/docs/reference/types/boolean](https://tina.io/docs/reference/types/boolean) | 2026-10-13 | Recheck when the boolean field shape changes |
| Field type: image | [https://tina.io/docs/reference/types/image](https://tina.io/docs/reference/types/image) | 2026-10-13 | Recheck when media handling changes |
| Field type: reference | [https://tina.io/docs/reference/types/reference](https://tina.io/docs/reference/types/reference) | 2026-10-13 | Recheck when reference behavior changes |
| Field type: object | [https://tina.io/docs/reference/types/object](https://tina.io/docs/reference/types/object) | 2026-10-13 | Recheck when the object field shape changes |
| Field type: rich-text | [https://tina.io/docs/reference/types/rich-text](https://tina.io/docs/reference/types/rich-text) | 2026-10-13 | Recheck when rich-text handling changes |
| Field type: display-only | [https://tina.io/docs/reference/types/display-only](https://tina.io/docs/reference/types/display-only) | 2026-10-13 | Recheck when display-only behavior changes |
| Field type: rendering-markdown | [https://tina.io/docs/reference/types/rendering-markdown](https://tina.io/docs/reference/types/rendering-markdown) | 2026-10-13 | Recheck when markdown rendering changes |
| GraphQL queries | [https://tina.io/docs/graphql/queries](https://tina.io/docs/graphql/queries) | 2026-10-13 | Recheck when the query surface changes |
| GraphQL query filtering, sorting, pagination | [https://tina.io/docs/graphql/queries](https://tina.io/docs/graphql/queries) | 2026-10-13 | Recheck when filter/sort options change |
| GraphQL CLI | [https://tina.io/docs/graphql/cli](https://tina.io/docs/graphql/cli) | 2026-10-13 | Recheck when the GraphQL CLI changes |
| Content API data layer | [https://tina.io/docs/reference/content-api/data-layer](https://tina.io/docs/reference/content-api/data-layer) | 2026-10-13 | Recheck when the data layer changes |
| Data fetching overview | [https://tina.io/docs/data-fetching/overview](https://tina.io/docs/data-fetching/overview) | 2026-10-13 | Recheck when the fetching model changes |
| Custom queries | [https://tina.io/docs/data-fetching/custom-queries](https://tina.io/docs/data-fetching/custom-queries) | 2026-10-13 | Recheck when custom-query guidance changes |
| Generated client usage | [https://tina.io/docs/data-fetching/overview](https://tina.io/docs/data-fetching/overview) | 2026-10-13 | Recheck when generated-client guidance changes |
| Contextual editing overview | [https://tina.io/docs/contextual-editing/overview](https://tina.io/docs/contextual-editing/overview) | 2026-10-13 | Recheck when contextual editing changes |
| tinaField data attributes | [https://tina.io/docs/contextual-editing/tinafield](https://tina.io/docs/contextual-editing/tinafield) | 2026-10-13 | Recheck when `tinaField` guidance changes |
| Next.js App Router integration | [https://tina.io/docs/frameworks/next/app-router](https://tina.io/docs/frameworks/next/app-router) | 2026-10-13 | Recheck when the framework integration changes |
| Admin route placement | [https://tina.io/docs/frameworks/next/app-router](https://tina.io/docs/frameworks/next/app-router) | 2026-10-13 | Recheck when admin routing changes |
| Request interception (proxy or middleware) | [https://tina.io/docs/frameworks/next/app-router](https://tina.io/docs/frameworks/next/app-router) | 2026-10-13 | Recheck when the framework request layer changes |
| Visual editing client boundary | [https://tina.io/docs/contextual-editing/overview](https://tina.io/docs/contextual-editing/overview) | 2026-10-13 | Recheck when the hook contract changes |
| TinaCloud overview | [https://tina.io/docs/tinacloud/overview](https://tina.io/docs/tinacloud/overview) | 2026-10-13 | Recheck when TinaCloud scope changes |
| TinaCloud environment contract | [https://tina.io/docs/tinacloud/overview](https://tina.io/docs/tinacloud/overview) | 2026-10-13 | Recheck when the environment contract changes |
| TinaCloud schema indexing | [https://tina.io/docs/tinacloud/overview](https://tina.io/docs/tinacloud/overview) | 2026-10-13 | Recheck when the indexing contract changes |
| TinaCloud troubleshooting | [https://tina.io/docs/tinacloud/troubleshooting](https://tina.io/docs/tinacloud/troubleshooting) | 2026-10-13 | Recheck when TinaCloud failure modes change |
| Deployment option: Vercel | [https://tina.io/docs/tinacloud/deployment-options/vercel](https://tina.io/docs/tinacloud/deployment-options/vercel) | 2026-10-13 | Recheck when the deployment recipe changes |
| Deployment option: Netlify | [https://tina.io/docs/tinacloud/deployment-options/netlify](https://tina.io/docs/tinacloud/deployment-options/netlify) | 2026-10-13 | Recheck when the deployment recipe changes |
| Deployment option: GitHub Pages | [https://tina.io/docs/tinacloud/deployment-options/github-pages](https://tina.io/docs/tinacloud/deployment-options/github-pages) | 2026-10-13 | Recheck when the deployment recipe changes |
| Deployment option: Cloudflare Pages | [https://tina.io/docs/tinacloud/deployment-options/cloudflare-pages](https://tina.io/docs/tinacloud/deployment-options/cloudflare-pages) | 2026-10-13 | Recheck when the deployment recipe changes |
| Deployment option: Cloudflare Workers | [https://tina.io/docs/tinacloud/deployment-options/cloudflare-workers](https://tina.io/docs/tinacloud/deployment-options/cloudflare-workers) | 2026-10-13 | Recheck when the deployment recipe changes |
| Self-hosted overview | [https://tina.io/docs/self-hosted/overview](https://tina.io/docs/self-hosted/overview) | 2026-10-13 | Recheck when self-hosting guidance changes |
| Self-hosted manual setup | [https://tina.io/docs/self-hosted/manual-setup](https://tina.io/docs/self-hosted/manual-setup) | 2026-10-13 | Recheck when manual setup changes |
| Self-hosted runtime constraint (Node only) | [https://tina.io/docs/self-hosted/overview](https://tina.io/docs/self-hosted/overview) | 2026-10-13 | Recheck if the runtime constraint is lifted |
| Self-hosted Git provider overview | [https://tina.io/docs/reference/self-hosted/git-provider/overview](https://tina.io/docs/reference/self-hosted/git-provider/overview) | 2026-10-13 | Recheck when provider support changes |
| Self-hosted custom Git provider | [https://tina.io/docs/reference/self-hosted/git-provider/make-your-own](https://tina.io/docs/reference/self-hosted/git-provider/make-your-own) | 2026-10-13 | Recheck when the provider API changes |
| Self-hosted auth and environment | [https://tina.io/docs/self-hosted/manual-setup](https://tina.io/docs/self-hosted/manual-setup) | 2026-10-13 | Recheck when auth guidance changes |
| Build ordering (tinacms build first) | [https://tina.io/docs/cli-overview](https://tina.io/docs/cli-overview) | 2026-10-13 | Recheck when build behavior changes |
| Dev workflow wrapper | [https://tina.io/docs/cli-overview](https://tina.io/docs/cli-overview) | 2026-10-13 | Recheck when the dev workflow changes |
| Audit and doctor diagnostics | [https://tina.io/docs/cli-overview](https://tina.io/docs/cli-overview) | 2026-10-13 | Recheck when diagnostics change |
| GraphQL codegen commands | [https://tina.io/docs/graphql/cli](https://tina.io/docs/graphql/cli) | 2026-10-13 | Recheck when codegen changes |
| Local content source | [https://tina.io/docs/cli-overview](https://tina.io/docs/cli-overview) | 2026-10-13 | Recheck when local mode changes |
| Markdown and MDX rendering | [https://tina.io/docs/reference/types/rendering-markdown](https://tina.io/docs/reference/types/rendering-markdown) | 2026-10-13 | Recheck when rendering guidance changes |
| Media and image handling | [https://tina.io/docs/reference/types/image](https://tina.io/docs/reference/types/image) | 2026-10-13 | Recheck when media handling changes |
| Reference field constraints | [https://tina.io/docs/reference/types/reference](https://tina.io/docs/reference/types/reference) | 2026-10-13 | Recheck when reference behavior changes |
| Object and group fields | [https://tina.io/docs/reference/types/object](https://tina.io/docs/reference/types/object) | 2026-10-13 | Recheck when the object field shape changes |
| Data layer architecture and constraints | [https://tina.io/docs/reference/content-api/data-layer](https://tina.io/docs/reference/content-api/data-layer) | 2026-10-13 | Recheck when the data layer changes |
| Content revalidation and caching | [https://tina.io/docs/data-fetching/overview](https://tina.io/docs/data-fetching/overview) | 2026-10-13 | Recheck when caching guidance changes |
