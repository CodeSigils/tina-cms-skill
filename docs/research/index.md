# Research index

Authoring-only record. This file owns two things that no other file owns: the
tier definitions, and the finding-ID registry. Every finding ID is registered
exactly once here; the ID's evidence lives in its owning topic file. The runtime
skill loads only files under `skills/tina-cms/` and never reads or links this
directory. References are distilled from these findings, never the reverse.

## Tier definitions

| Tier | Name | Meaning | Citation policy |
| --- | --- | --- | --- |
| TIER1 | Official | Primary official TinaCMS documentation, the official project issue tracker, or source files in the official packages | Eligible to cite directly |
| TIER2 | Verified-community | Third-party skill or material that was independently verified safe and whose claim was cross-checked against official material | Eligible to cite with attribution as a corroborating source |
| TIER3 | Consensus | Agreement across multiple non-authoritative sources, not independently verified against primary material | Flag it; do not cite as authority |
| TIER4 | Low-confidence | A single unverified source, or an inference not yet checked | Flag it as a re-verification trigger; do not cite |

## Finding-ID registry

Every ID below is namespaced by concern and appears in its owning topic file.

| ID | Tier | Source | Checked date | Owning topic file |
| --- | --- | --- | --- | --- |
| INST-01 | TIER1 | tinacms/tinacms issue #6308; corroborated by verified-community skills | 2026-10-13 | installation.md |
| INST-02 | TIER1 | tinacms/tinacms issue #5838 | 2026-10-13 | installation.md |
| INST-03 | TIER1 | Official Next 16 / React 19 / Node requirements; corroborated by verified-community floors table | 2026-10-13 | installation.md |
| INST-04 | TIER1 | Official config-rearrangement documentation | 2026-10-13 | installation.md |
| INST-05 | TIER1 | Official Tina 3.x React 19 pairing | 2026-10-13 | installation.md |
| INST-06 | TIER4 | jezweb-derived (excluded entry) Node starter observation | 2026-10-13 | installation.md |
| INST-07 | TIER2 | Verified-community install guidance | 2026-10-13 | installation.md |
| INST-08 | TIER2 | genericservice/claude-skills nextjs-tinacms floors table | 2026-10-13 | installation.md |
| CLI-01 | TIER1 | CVE-2026-28792 / GHSA-8pw3-9m7f-q734 | 2026-10-13 | tina-cli.md |
| CLI-02 | TIER1 | Official current stable line | 2026-10-13 | tina-cli.md |
| CLI-03 | TIER1 | tinacms/tinacms issue #6364 | 2026-10-13 | tina-cli.md |
| CLI-04 | TIER1 | tinacms/tinacms issue #6361 | 2026-10-13 | tina-cli.md |
| CLI-05 | TIER1 | Official build-ordering documentation | 2026-10-13 | tina-cli.md |
| CLI-06 | TIER2 | genericservice/claude-skills tina-schema-sync | 2026-10-13 | tina-cli.md |
| CLI-07 | TIER1 | Official CLI flags and subcommands | 2026-10-13 | tina-cli.md |
| CLI-08 | TIER1 | Official ESM-only package line | 2026-10-13 | tina-cli.md |
| CLI-09 | TIER1 | Official legacy v4 package line | 2026-10-13 | tina-cli.md |
| CLI-10 | TIER1 | Official CLI overview package scope (`@tinacms/cli`) versus the `tinacms` runtime package | 2026-10-13 | tina-cli.md |
| CLI-11 | TIER1 | Official dev-versus-build workflow guidance | 2026-10-13 | tina-cli.md |
| SCHEMA-01 | TIER1 | tinacms/tinacms issue #6345 | 2026-10-13 | schema-and-collections.md |
| SCHEMA-02 | TIER1 | tinacms/tinacms issue #6346 | 2026-10-13 | schema-and-collections.md |
| SCHEMA-03 | TIER1 | Official collections and fields reference | 2026-10-13 | schema-and-collections.md |
| SCHEMA-04 | TIER1 | Official field-type documentation | 2026-10-13 | schema-and-collections.md |
| SCHEMA-05 | TIER2 | Community-sourced reference-field typing note (Cogan 2.1 to 2.3) | 2026-10-13 | schema-and-collections.md |
| SCHEMA-06 | TIER1 | Official config-determinism guidance | 2026-10-13 | schema-and-collections.md |
| SCHEMA-07 | TIER1 | Official field `format`/`parse` transform documentation | 2026-10-13 | schema-and-collections.md |
| API-01 | TIER1 | Official generated-client guidance and package source | 2026-10-13 | content-api-and-graphql.md |
| API-02 | TIER1 | Official package source, useTina | 2026-10-13 | content-api-and-graphql.md |
| API-03 | TIER1 | Official package source, tinaField | 2026-10-13 | content-api-and-graphql.md |
| API-04 | TIER1 | Official data-layer architecture | 2026-10-13 | content-api-and-graphql.md |
| API-05 | TIER1 | Official GraphQL queries page | 2026-10-13 | content-api-and-graphql.md |
| API-06 | TIER1 | Official contextual-editing overview | 2026-10-13 | content-api-and-graphql.md |
| API-07 | TIER1 | Official generated-artifact and lock-file contract | 2026-10-13 | content-api-and-graphql.md |
| API-08 | TIER2 | genericservice/claude-skills tina-schema-sync hybrid artifact pattern | 2026-10-13 | content-api-and-graphql.md |
| API-09 | TIER1 | Official framework request-interception guidance | 2026-10-13 | content-api-and-graphql.md |
| DEPLOY-01 | TIER1 | Official Vercel deployment option | 2026-10-13 | deployment.md |
| DEPLOY-02 | TIER1 | Official Netlify deployment option | 2026-10-13 | deployment.md |
| DEPLOY-03 | TIER1 | Official GitHub Pages deployment option | 2026-10-13 | deployment.md |
| DEPLOY-04 | TIER1 | Official Cloudflare Pages deployment option | 2026-10-13 | deployment.md |
| DEPLOY-05 | TIER1 | Official Cloudflare Workers deployment option | 2026-10-13 | deployment.md |
| DEPLOY-06 | TIER1 | Official deployment-options family | 2026-10-13 | deployment.md |
| DEPLOY-07 | TIER1 | Official Git-provider documentation and TinaCloud scope | 2026-10-13 | deployment.md |
| DEPLOY-08 | TIER1 | Official deployment-versus-backend separation | 2026-10-13 | deployment.md |
| DEPLOY-09 | TIER1 | Official build-environment `.env` guidance | 2026-10-13 | deployment.md |
| CLOUD-01 | TIER2 | Community-corroborated branch handling | 2026-10-13 | tinacloud.md |
| CLOUD-02 | TIER3 | TinaCloud breach disclosure recorded at 4.1 | 2026-10-13 | tinacloud.md |
| CLOUD-03 | TIER1 | Official TinaCloud environment contract | 2026-10-13 | tinacloud.md |
| CLOUD-04 | TIER1 | Official lock-file indexing contract | 2026-10-13 | tinacloud.md |
| CLOUD-05 | TIER1 | Official TinaCloud Git-provider scope | 2026-10-13 | tinacloud.md |
| SELF-01 | TIER1 | tinacms/tinacms issue #4363 (wontfix) | 2026-10-13 | self-hosted.md |
| SELF-02 | TIER1 | tinacms/tinacms issue #6365 | 2026-10-13 | self-hosted.md |
| SELF-03 | TIER1 | Official self-hosted overview and manual setup | 2026-10-13 | self-hosted.md |
| SELF-04 | TIER1 | Official custom Git-provider documentation | 2026-10-13 | self-hosted.md |
| SELF-05 | TIER1 | Official self-hosted auth guidance | 2026-10-13 | self-hosted.md |
| TDOCS-01 | TIER3 | TinaDocs OpenAPI documentation | 2026-10-13 | tinadocs-openapi.md |
| TDOCS-02 | TIER1 | Official TinaDocs scope | 2026-10-13 | tinadocs-openapi.md |
| TDOCS-03 | TIER4 | TinaDocs OpenAPI compatibility areas, not independently verified | 2026-10-13 | tinadocs-openapi.md |
| TDOCS-04 | TIER3 | TinaDocs styling documentation | 2026-10-13 | tinadocs-openapi.md |
| STYLE-01 | TIER1 | Official styling and contextual-editing guidance | 2026-10-13 | styling.md |
| STYLE-02 | TIER1 | tinacms/tinacms issue #6325 | 2026-10-13 | styling.md |
| STYLE-03 | TIER1 | Official fields and object-field documentation | 2026-10-13 | styling.md |
| STYLE-04 | TIER1 | Official tinaField guidance | 2026-10-13 | styling.md |

## jezweb-derived findings (recorded, distributed across the registry above)

These fourteen findings originate from the audited-and-excluded
`jezweb/claude-skills/tinacms` entry and were re-checked against official or
tiered material before being recorded. They map to registered IDs as follows:

1. Issue #4363 (edge runtime incompatible with self-hosted backend) to SELF-01
2. Issue #6308 (pnpm required above tinacms 2.7.3) to INST-01
3. Issue #6325 (media manager ghost uploads) to STYLE-02
4. Issue #6345 (3.0.x to 3.2.x list-field regression) to SCHEMA-01
5. Issue #6346 (list-field regression companion fix in 3.3.1) to SCHEMA-02
6. Issue #6364 (filename and lock divergence) to CLI-03
7. Issue #6361 (filename and lock divergence companion) to CLI-04
8. Issue #6365 (self-hosted examples out of date) to SELF-02
9. Issue #5838 (CDN UI-asset coupling, pin exact) to INST-02
10. Cogan 2.1 to 2.3 updates (reference-field typing, admin sub-path) to SCHEMA-05
11. React 19 support to INST-05
12. Branch support to CLOUD-01
13. Node starter or template issues to INST-06
14. TinaCloud breach disclosure (4.1) to CLOUD-02

## Excluded entry

`jezweb/claude-skills/tinacms` is recorded here as EXCLUDED and unsafe. It must
not be adopted into any runtime reference or into the source registry. Reasons:
recursive deletion of lockfiles and `node_modules`, `@latest` repair defaults,
destructive text rewrites, and a pinned CLI below the CVE-2026-28792 floor.

## Verified-safe community sources

| Source | Tier | Use |
| --- | --- | --- |
| genericservice/claude-skills `nextjs-tinacms` | TIER2 | Corroborates the version floors and known-bad windows; content source for authoring only |
| genericservice/claude-skills `tina-schema-sync` | TIER2 | Source of the hybrid artifact-sync pattern; content source for authoring only |
| yigitkonur/skills-by-yigitkonur `build-tinacms-nextjs` | TIER2 | Detect-first-hop and probe-script model; content source for authoring only |

These are content sources, not substitutes for this skill's own registries,
research pipeline, or scenario suite.
