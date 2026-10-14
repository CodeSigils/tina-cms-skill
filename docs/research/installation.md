# Installation and version floors (INST)

> Provenance: findings `INST-01` through `INST-08` | tiers: TIER1, TIER2, TIER4 (per row) | checked 2026-10-13 | recheck trigger: when a new `tinacms` or `@tinacms/cli` minor or patch lands, or when a new advisory raises a floor.

## INST-01 (TIER1) Package manager for the current line

`tinacms` greater than 2.7.3 wants pnpm for module resolution (issue #6308).
npm or yarn can hit module-resolution errors. For the current line, pnpm is the
safe default. A verified-community skill independently records the same
constraint.

## INST-02 (TIER1) Pin exact Tina versions

UI assets are served from a CDN and can update ahead of the local CLI, so pin
exact versions instead of caret ranges (issue #5838). Mixed UI and runtime
versions break the admin. Do not treat `@latest` as a repair default.

## INST-03 (TIER1) Framework floors

The current line pairs with `next` >= 16.0.10, `react` / `react-dom` >= 19.0.x,
and Node.js >= 20.9.0. These values are corroborated by the verified-community
`nextjs-tinacms` floors table.

## INST-04 (TIER1) Config location moved

The config moved from `.tina/` to `tina/`. Detect the actual location in the
project before advising; legacy projects still use `.tina/`.

## INST-05 (TIER1) React 19 support

The current Tina 3.x line supports React 19. Recorded as a jezweb-derived
finding and confirmed against official pairing.

## INST-06 (TIER4) Node starter or template issues

The Node starter or template can lag the current docs. Recorded from the
excluded jezweb entry and not independently verified: treat template output as a
starting point and verify against the registries and docs.

## INST-07 (TIER2) Install flags and peer dependencies

Do not install with `--no-optional` or `--omit=optional`. `react` and
`react-dom` are required even for non-React frameworks. Verified-community
guidance.

## INST-08 (TIER2) Independent corroboration of the floors

`genericservice/claude-skills` `nextjs-tinacms` independently records `next` >=
16.0.10, `tinacms` >= 3.3.x, `@tinacms/cli` >= 2.1.8, `react`/`react-dom` >=
19.0.x, and Node.js >= 20.9.0, matching this skill's registry. Anti-pattern not
to copy: its Quick Start still uses `@latest`; this skill pins from the version
registry instead.
