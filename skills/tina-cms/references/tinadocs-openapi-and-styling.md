# TinaDocs OpenAPI And Styling

Read this file only when the target actually carries a TinaDocs surface: a
TinaDocs documentation site, or an API-schema (OpenAPI spec) collection. TinaDocs
is a separate documentation-site workflow with its own mutation boundary, not the
TinaCMS GraphQL content API. Never apply the steps here to an ordinary TinaCMS
content task, and never conflate the two.

> Provenance: findings `TDOCS-01` through `TDOCS-10`, `STYLE-01` | tiers: TIER1, TIER3, TIER4 (per row) | checked 2026-10-13 | recheck trigger: before citing any TinaDocs URL or making any OpenAPI compatibility claim, and whenever a TinaDocs regeneration is exercised against a real target.

This reference is part of the runtime skill and has no path into `docs/research/`.
External specifics are referenced by topic and pulled from `source-registry.md`;
this file does not carry raw URLs. TinaDocs documentation topics are not yet
registered in `source-registry.md`, so treat any specific TinaDocs URL as
unverified and confirm behavior against the target's own documentation version.

## When TinaDocs applies (the gate)

Gate on evidence, never on assumption. Apply this file only when the repository
has one of:

- a TinaDocs documentation site, or
- an API-schema collection that stores an OpenAPI specification.

If neither is present, this file does not apply; route an ordinary TinaCMS
GraphQL content task through `content-api-and-deployment.md` and
`ui-and-customization.md` instead. Do not reach for TinaDocs OpenAPI generation
on a project that simply has a TinaCMS admin and a public site.

## Inspect the API-schema collection before advising

TinaDocs stores OpenAPI specifications in a dedicated collection that is managed
independently of the documentation pages. Before advising, read:

- the API-schema / specification collection entry and the spec it points at;
- the navigation, tab, and supermenu configuration (see navigation templates
  below);
- the docs pages themselves, to tell which API content is hand-authored inline
  and which was generated from the spec.

The answer to "inline or generated?" is not visible from the config alone; read
the pages and the spec collection together.

## Inline reference versus generated pages

A specification can be consumed two ways, and the choice has consequences worth
stating plainly:

- Inline: an API Reference component selects a schema (and optionally a single
  route) and renders it into a page you hand-author. The page stays yours; edits
  are not overwritten by generation.
- Generated: whole directories of pages are generated from the spec. Those pages
  are owned by the generator; a re-save can overwrite manual edits in them.

Recommend the inline path when the surrounding page needs hand-written prose, and
the generated path when the page tree should track the spec. Whichever is chosen,
say which one the project already uses before proposing a change, because
mixing the two silently can leave generated pages where hand-authored content was
expected.

## Regeneration discipline: never regenerate silently

Generation is triggered by saving from the navigation settings: when a group of
API references has endpoints selected, saving regenerates the matching documents.
That makes regeneration a content-mutating action, not a passive preview.

Before any regeneration:

1. Warn the user that saving will regenerate documents.
2. Capture a diff of the affected page tree.
3. Review the diff, and stop before applying it if generated pages would clobber
   hand-authored content.
4. Provide a recovery path (a backup, commit, stash, or branch of the docs tree)
   that can restore the pre-regeneration pages.

Never regenerate silently, and never assume manual edits survive a re-save.
Confirm the current state of the docs tree before and after.

## Navigation templates

API navigation is built from dedicated templates: an API Tab tab template and a
Group of API References supermenu group. The navbar can also derive sections from
the routes available in a specification. Read the navigation, tab, and supermenu
configuration before changing API documentation structure, because a
regeneration reads that configuration. A structure change and a regeneration are
one change, not two.

## Theme and public CSS boundaries

This styling axis belongs to TinaDocs only. TinaDocs is a public documentation
site with its own theming: a theme is selected through the site's settings
collection and defined in the site's global stylesheet, with a set of built-in
colour presets. Adding or changing a theme touches the settings collection, the
theme selector, and the stylesheet.

Keep the surfaces separate. The Tina admin and the ordinary public site, and any
custom admin field UI, are owned by `ui-and-customization.md`; do not bleed
TinaDocs theme advice into admin CSS or into general public-site styling, and do
not route admin or public-site styling here. Name the surface before suggesting
code.

## Uncertainty policy

State uncertainty rather than promising behavior:

- OAS version support, YAML specifics, and `$ref` handling are version-dependent
  and were not independently exercised here. Treat each as a re-verification
  trigger, not a guarantee.
- Preservation of manually edited generated pages across a regeneration is not
  guaranteed by anything recorded here. Verify it against the target before
  relying on it.
- Do not promise a specific OAS version, a specific `$ref` shape, or that manual
  edits survive regeneration without evidence from the target's installed
  version.

Verify every such claim against the target's own documentation for the version it
runs before advising. When the TinaDocs docs-link topic is not in
`source-registry.md`, say the specific link is unverified and omit it; never
fabricate a TinaDocs URL.

## Change workflow

For any TinaDocs change:

1. Confirm the gate (a real TinaDocs site or API-schema collection).
2. Inspect the spec collection, the navigation/tab/supermenu config, and the
   existing pages.
3. Decide and state inline versus generated for the affected pages.
4. For any regeneration, warn, diff, review, and prepare a recovery path before
   saving.
5. Verify the rendered navigation and the affected pages after the change.

Name the files or collections the change will touch, and require a diff or backup
plan for any generated or content-mutating action. This workflow never applies to
an ordinary TinaCMS GraphQL content task.
