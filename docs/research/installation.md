# Installation and version floors (INST)

> Provenance: findings `INST-01` through `INST-14` | tiers: TIER1, TIER2, TIER3, TIER4 (per row) | checked 2026-10-13 (INST-01 through INST-08), 2026-10-14 (INST-09 through INST-14) | recheck trigger: when a new `tinacms` or `@tinacms/cli` minor or patch lands, when a new advisory raises a floor, or when the version registry gains an explicit blocked-versions deny list.

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

## INST-09 (TIER1) Floors are monotonic

Floors and warn-only minimums are monotonic: never lower one without a recorded
research finding. When a target asks to treat a below-floor version as
acceptable, stop and report the request rather than comply. This restates the
version-registry rule and the CLI floor note (`CLI-01`). The checker enforces it:
its `--accept-below-floor` request is refused with a `policy.floor-downgrade-refused`
finding (exit 1), never silently honored.

## INST-10 (TIER3) Blocked-versions deny list

The version policy keeps an exact blocked-versions deny list, separate from the
floors and the range-based known-bad windows; the checker reports any package on
it as `version.blocked`. This is an adopted version-policy mechanism, not
independently verified against primary material. GAP FOUND: the version registry
as authored records floors (section B) and known-bad windows and constraints
(section C) but carries no explicit exact-version deny list, so the checker's
deny list is currently empty. The registry is owned by an earlier todo and was
not edited; the absence is recorded here as the recheck trigger rather than
worked around by hard-coding a list in the checker. The parser is verified to
work against a registry that does carry such a section.

## INST-11 (TIER3) Tri-state staleness

Staleness is tri-state: stale fails, and unknown or unverifiable never fails.
When the checker cannot determine an installed version (a missing lockfile or
artifact), it reports the package as unknown and exits 0 unless a real
below-floor, bad-window, or blocked finding exists. It never fabricates a
version and never fails on missing evidence. This is an adopted version-policy
mechanism, not independently verified against primary material.

## INST-12 (TIER1) A user-provided version is a target, not evidence

Treat a version the user supplies as a target to verify, not as evidence.
Confirm it against the lockfile and the installed packages before relying on it.
Restates the version-registry rule.

## INST-13 (TIER1) Never invent a CVE, range, or patched version

Never infer or invent a CVE, a vulnerable range, or a "patched" version number.
Cite only what the registry records. Restates the version-registry rule and
extends the security-floor note (`CLI-01`).

## INST-14 (TIER1) Fresh-release (`@latest`) caution

Do not suggest a release younger than about a week unless it is a CVE fix, and
never recommend `@latest` as a repair default. The registry records no release
dates, so the checker carries this as a static note rather than a computed check.
Restates the version-registry rule.
