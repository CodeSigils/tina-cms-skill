# Content API and GraphQL (API)

> Provenance: findings `API-01` through `API-06` | tiers: TIER1 (all rows) | checked 2026-10-13 | recheck trigger: when the generated client, data layer, or GraphQL reference changes, or when the `tinacms` package source is re-read.

## API-01 (TIER1) Generated client accuracy flag

There is no `generateClient()` helper and no `<TinaCMS>` component in the
current `tinacms` line. Read content through `tina/__generated__/client` using
`client.queries.*` or `client.request`. Any reference to `generateClient()` or a
`<TinaCMS>` component is stale and must not be repeated.

## API-02 (TIER1) useTina source-verified

The `useTina` hook is source-verified at
`packages/tinacms/src/react.tsx#L8-L14` in the official package. It returns the
live-editable `data` for the supplied `query`, `variables`, and `data`.

## API-03 (TIER1) tinaField source-verified

`tinaField` is source-verified at
`packages/@tinacms/bridge/src/tina-field.ts#L1-L40` in the official package. It
produces the `data-tina-field` value that binds a DOM element to a content path.
Apply it to DOM elements, not component wrappers.

## API-04 (TIER1) Single-root-query data-layer constraint

The generated data layer expects one root query shape. Restructuring content
across multiple independent roots conflicts with it; flag the constraint before
proposing a restructure.

## API-05 (TIER1) GraphQL query surface

The generated client exposes a GraphQL query surface with filters, sorting, and
pagination. Reference the queries page and the GraphQL CLI page; do not cite a
generic "overview" route.

## API-06 (TIER1) useTina is client-only

`useTina` is a Client Component hook and cannot run in a Server Component.
Confirm the component boundary before advising.
