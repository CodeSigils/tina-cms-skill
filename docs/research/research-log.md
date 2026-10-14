# Research log

Authoring-only record. This directory is input to the skill's references; the
runtime skill loads only files under `skills/tina-cms/` and never reads or links
anything here. Findings flow one way: references are distilled from this record.

## Session 2026-10-13: TinaCMS 3.x documentation, CLI, and version landscape

### Packages researched

- `tinacms` (current stable line 3.14.4 at the time of the session)
- `@tinacms/cli` (current stable line 2.1.8 and newer on the 2.1.x line)

### Sources

- Official TinaCMS documentation at `https://tina.io/docs` and the topic pages
  recorded in `index.md` and mirrored into `skills/tina-cms/references/source-registry.md`.
- Official project issue tracker and advisory material for the security floor and
  the known-bad windows (CVE-2026-28792 / GHSA-8pw3-9m7f-q734, issues #4363,
  #5838, #6308, #6325, #6345, #6346, #6361, #6364, #6365).
- Two verified-safe community skills, cross-checked against the official
  material: `genericservice/claude-skills` `nextjs-tinacms` and `tina-schema-sync`.
- One verified-safe community skill, `yigitkonur/skills-by-yigitkonur`
  `build-tinacms-nextjs`, used for the detect-first-hop and probe-script models.
- One excluded entry, `jezweb/claude-skills/tinacms`, retained only as a record
  of unsafe and stale practice. It is not a source for any runtime reference.

### Method

- Every documentation URL was opened and confirmed reachable on 2026-10-13; the
  canonical route was recorded and stale routes were corrected (for example,
  `/docs/reference/schema` instead of `/docs/schema`, `/docs/graphql/queries`
  plus `/docs/graphql/cli` instead of `/docs/graphql/overview`,
  `/docs/reference/content-api/data-layer` instead of a content-delivery path).
- Version floors and windows were corroborated across the official material and
  the two verified-safe community skills before being recorded, and each was
  given a tier and a recheck trigger.
- Findings are namespaced per concern (`INST-*`, `CLI-*`, `SCHEMA-*`, `API-*`,
  `DEPLOY-*`, `CLOUD-*`, `SELF-*`, `TDOCS-*`, `STYLE-*`). Each finding ID is
  registered exactly once in `index.md` and owns one topic file.
- The `jezweb/claude-skills/tinacms` entry was audited and excluded for unsafe
  repair commands (recursive deletion of lockfiles and `node_modules`), `@latest`
  repair defaults, destructive text rewrites, and a pinned CLI below the
  CVE-2026-28792 floor. It is listed in `index.md` only as an excluded entry.

### What was not verified

- OAS version, YAML, `$ref` behavior, and manual-page preservation for TinaDocs
  OpenAPI generation were not independently confirmed; they are recorded as
  re-verification triggers, not facts.
- Details attributed to the excluded jezweb entry and to community sources are
  recorded at their tier and are not cited as authority.

### Next-research trigger

Re-run this session when any of the following happens: a new `tinacms` or
`@tinacms/cli` minor or patch lands; a new advisory raises a version floor; a
source-registry or version-registry row passes its freshness window; a
deployment-options page is added or removed; or a TinaDocs OpenAPI compatibility
area is exercised against a real target.
