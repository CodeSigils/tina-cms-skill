# TinaCloud (CLOUD)

> Provenance: findings `CLOUD-01` through `CLOUD-05` | tiers: TIER1, TIER2, TIER3 (per row) | checked 2026-10-13 | recheck trigger: when the TinaCloud environment contract or indexing model changes, or when the breach-disclosure status changes.

## CLOUD-01 (TIER2) Branch support

Multi-branch work uses a branch variable (for example `NEXT_PUBLIC_TINA_BRANCH`)
alongside the config `branch`. Corroborated by a verified-community config
reference; confirm the branch contract before advising on previews or
multi-branch content.

## CLOUD-02 (TIER3) Breach disclosure

A TinaCloud breach disclosure is recorded at 4.1. This is a security-context
note recorded from the jezweb-derived findings and not independently verified to
the source advisory; verify the current TinaCloud status before advising on
cloud credentials.

## CLOUD-03 (TIER1) Environment contract

The TinaCloud environment contract uses `NEXT_PUBLIC_TINA_CLIENT_ID`,
`TINA_TOKEN`, and often `NEXT_PUBLIC_TINA_BRANCH`. `TINA_TOKEN` is a secret; only
the `NEXT_PUBLIC_*` values are public. Never print, move, or commit a secret.

## CLOUD-04 (TIER1) Lock-file indexing contract

`tina/tina-lock.json` must be committed and pushed: TinaCloud consumes it at
deploy to index the schema and branches, and it is not produced by
`tinacms build` alone.

## CLOUD-05 (TIER1) Git-provider scope

TinaCloud's Git provider is GitHub-only in the documented model. Other hosts
require the self-hosted path with a custom Git Provider.
