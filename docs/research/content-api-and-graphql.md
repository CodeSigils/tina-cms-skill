# Content API and GraphQL (API)

> Provenance: findings `API-01` through `API-09` | tiers: TIER1, TIER2 (per row) | checked 2026-10-13 | recheck trigger: when the generated client, data layer, artifact contract, or GraphQL reference changes, or when the `tinacms` package source is re-read.

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

## API-07 (TIER1) Generated artifacts are build output

Everything under `tina/__generated__/` (or `.tina/__generated__/`) is build
output and must never be hand-edited; edits are overwritten on the next build.
In the official build-on-CI model the repository commits `tina/tina-lock.json`
only and gitignores the generated directory, and the build regenerates the
client and types before the framework compiles.

## API-08 (TIER2) Hybrid pre-commit artifact policy

A verified-community pattern (corroborated by the `tina-schema-sync` material,
not an official recommendation) pre-commits the generated artifacts so the site
can build without a fresh cloud indexing step: `tina/__generated__/`,
`tina/tina-lock.json`, and the built `public/admin/` are committed together as
one atomic unit so the tracked artifacts never diverge from the lockfile.
Regenerate with `tinacms dev --noWatch --noTelemetry` (see CLI-06), and verify
the pattern against the project before relying on it.

## API-09 (TIER1) Runtime URL prefixes and request interception

At runtime the CMS depends on three URL prefixes: the admin route under
`/admin`, the preview endpoint at `/api/preview`, and (in self-hosted projects)
the backend under `/api/tina/*`. A `proxy.ts` (Next 16+) or `middleware.ts`
rewrite or redirect that captures one of those prefixes breaks the CMS. Read the
interception file and report the likely cause rather than editing it blind.
