# TinaDocs and OpenAPI (TDOCS)

> Provenance: findings `TDOCS-01` through `TDOCS-04` | tiers: TIER1, TIER3, TIER4 (per row) | checked 2026-10-13 | recheck trigger: before citing any TinaDocs URL or making any OpenAPI compatibility claim, and whenever a TinaDocs regeneration is exercised against a real target.

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
