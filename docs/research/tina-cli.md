# Tina CLI (CLI)

> Provenance: findings `CLI-01` through `CLI-11` | tiers: TIER1, TIER2 (per row) | checked 2026-10-13 | recheck trigger: on every new `@tinacms/cli` or `tinacms` release, or when a documented flag or subcommand changes.

## CLI-01 (TIER1) Security floor

`@tinacms/cli` >= 2.1.8 fixes CVE-2026-28792 / GHSA-8pw3-9m7f-q734 (drive-by
and path traversal in older versions). This floor is monotonic.

## CLI-02 (TIER1) Current stable line

At the time of the session, the stable line was `tinacms` 3.14.4 with
`@tinacms/cli` 2.1.8 or newer on the 2.1.x line. Never present this as timeless;
re-check on the next release.

## CLI-03 (TIER1) Filename and lock divergence

The filename and lock-file divergence (issue #6364) was fixed in 3.3.1 or later.
Stay on 3.3.1 or later.

## CLI-04 (TIER1) Filename and lock divergence companion

A companion to the divergence fix (issue #6361) landed in the same 3.3.1 or later
window. Same guidance: stay on 3.3.1 or later.

## CLI-05 (TIER1) Build ordering

`tinacms build` must run before the framework build so generated types and the
client exist when the framework compiles. A build script such as
`tinacms build && next build` is the documented order.

## CLI-06 (TIER2) Hybrid regeneration

A verified-community pattern regenerates artifacts with
`tinacms dev --noWatch --noTelemetry` rather than `tinacms build`, because
`build` can hit TinaCloud indexing and fail with an "Unable to seed" error when
the cloud schema lacks block types. This is a TIER2 community workaround: the
underlying contract mechanics are officially corroborated, but the pre-commit
workflow is not an official recommendation. Verify on the project before relying
on it.

## CLI-07 (TIER1) Flags and subcommands

Recorded CLI surface: `--content=local` selects a local content source; `--port`
defaults to 4001 and `--datalayer-port` defaults to 9000; `dev` wraps the
framework command with `-c` and supports `--noWatch` / `--noSDK` /
`--noTelemetry`; `audit --clean` and `doctor --json` support diagnosis. Confirm
flags against the installed CLI version.

## CLI-08 (TIER1) ESM-only line

The current line is ESM-only. A CommonJS build setup will not resolve the
packages; set `"type": "module"` or use `.ts` config.

## CLI-09 (TIER1) Legacy package line

A v4 legacy package line exists alongside the 3.x line. Do not mix the legacy
line with the current line; confirm which line the project is on.

## CLI-10 (TIER1) CLI package versus runtime package

The `tinacms` command is provided by the `@tinacms/cli` package, which is
distributed separately from the `tinacms` runtime/edit package. The two sit on
separate release lines, and the CLI overview documentation is written for
`@tinacms/cli`. PIN BOTH: never pin one and float the other, and never resolve
either with `@latest`.

## CLI-11 (TIER1) Dev output is not a production artifact

A running `tinacms dev` process and the artifacts it emits while watching are
development output. Production ships the `tinacms build` result, run before the
framework build (see CLI-05). Never deploy or package a `tinacms dev` artifact
as the production CMS.
