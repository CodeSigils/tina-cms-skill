# TinaDocs and OpenAPI (TDOCS)

> Provenance: findings `TDOCS-01` through `TDOCS-10` | tiers: TIER1, TIER3, TIER4 (per row) | checked 2026-10-13 | recheck trigger: before citing any TinaDocs URL or making any OpenAPI compatibility claim, and whenever a TinaDocs regeneration is exercised against a real target.

## TDOCS-01 (TIER3) OpenAPI generation mutation boundary

TinaDocs OpenAPI page generation regenerates documents when selected API-reference
groups are saved. This is a documentation-site mutation boundary: inspect and
diff before and after generation, and prepare a recovery path. Recorded at
TIER3 because it comes from TinaDocs documentation that was not independently
exercised in this session.

## TDOCS-02 (TIER1) TinaDocs is a separate module

TinaDocs is an independent documentation-site workflow, not the TinaCMS content
API. Never apply TinaDocs OpenAPI steps to an ordinary TinaCMS GraphQL content
task, and never conflate the two.

## TDOCS-03 (TIER4) Unverified compatibility areas

OAS version, YAML handling, `$ref` behavior, and manually edited generated-page
preservation were not independently verified on 2026-10-13. Treat each as a
re-verification trigger rather than a guarantee. Do not promise support for a
specific OAS version or `$ref` shape without target-version evidence.

## TDOCS-04 (TIER3) TinaDocs styling

TinaDocs styling is a separate public-site concern from TinaCMS admin and public
CSS. Route styling questions to the actual surface before suggesting code.
Recorded at TIER3 pending independent verification of the TinaDocs styling page.

## TDOCS-05 (TIER1) Gating on an actual TinaDocs surface

TinaDocs work is gated on an actual TinaDocs surface: a TinaDocs documentation
site or an API-schema (OpenAPI spec) collection. Detect one in the target before
advising. The TinaDocs OpenAPI steps must not be applied to an ordinary TinaCMS
GraphQL content task; the two surfaces have different contracts.

## TDOCS-06 (TIER1) OpenAPI spec storage, inline versus generated

TinaDocs stores OpenAPI specifications in a dedicated collection, managed
independently of the documentation pages. A specification can be consumed two
ways: read inline by an API Reference component that selects a schema (and
optionally a single route), leaving the page hand-authored; or used to generate
whole directories of pages, in which case those pages are owned by the generator.

## TDOCS-07 (TIER1) Generation is a save-triggered mutation

Page generation is triggered by saving from the navigation settings: when a "Group
of API References" entry has endpoints selected, saving regenerates the matching
documents. This corroborates the regeneration mutation boundary (`TDOCS-01`)
against the reachable official page, and is why regeneration must be warned
about and diffed rather than run silently.

## TDOCS-08 (TIER1) API navigation templates

API documentation navigation is built from dedicated templates: an API Tab
template and a Group of API References supermenu group. The navbar can also
derive sections from the routes available in a specification. Read the
navigation, tab, and supermenu configuration before changing API doc structure,
because a regeneration reads it.

## TDOCS-09 (TIER1) TinaDocs theming surface

TinaDocs theming is configured through the site's own settings collection and a
global stylesheet, with a set of built-in colour presets. Selecting or adding a
theme touches the settings collection, the theme selector component, and the
stylesheet. This is a public-documentation-site surface, distinct from the Tina
admin and from an ordinary public website.

## TDOCS-10 (TIER1) TinaDocs documentation reachability

The TinaDocs documentation topics for OpenAPI spec docs, the API-documentation
overview, TinaDocs styling, and deploying your docs were confirmed reachable
(checked 2026-10-13):

- `https://tina.io/tinadocs/docs/tinadocs-features/openapi-spec-docs`
- `https://tina.io/tinadocs/docs/api-documentation/overview`
- `https://tina.io/tinadocs/docs/tinadocs-features/styling`
- `https://tina.io/tinadocs/docs/going-live/deploying-your-docs`

These URLs are recorded here for authoring only and are NOT registered in the
runtime `source-registry.md`. Treat any specific TinaDocs URL as unverified in
runtime advice and verify it against the target's own documentation version; do
not cite a TinaDocs URL as a source until it is registered.
