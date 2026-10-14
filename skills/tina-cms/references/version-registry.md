# Version registry

> Provenance: findings `CLI-01` through `CLI-04`, `CLI-07`, `CLI-08`, `CLI-12`, `INST-01` through `INST-06`, `INST-08` through `INST-14`, `SCHEMA-01`, `SCHEMA-02`, `SCHEMA-05`, `SELF-01`, `SELF-02`, `STYLE-02`, `CLOUD-01`, `CLOUD-02` | tiers: TIER1, TIER2, TIER3, TIER4 (per row) | checked 2026-10-13, refreshed 2026-10-14 | recheck trigger: on every new `tinacms` or `@tinacms/cli` minor or patch, when a new advisory raises a floor, or when a row passes its freshness window.

This is a runtime reference for the skill. It holds the dated version floors,
known-bad windows, and recent change history that version-dependent advice must
be checked against. When a task depends on a Tina, Next, React, or Node version,
read this file, compare it with the repository's installed and locked versions,
and if the repository sits below a floor or inside a window, tell the user with
the exact installed versions and a safe path before giving version-dependent
advice.

Rules for this file:

- Floors are monotonic. Never lower a floor or a warn-only minimum without a
  recorded research finding; stop and report a requested downgrade instead.
- Never present one "current version" as timeless truth. Every row carries a
  checked date, and the stable line moves.
- Never infer or invent a CVE, a vulnerable range, or a patched version. Cite
  only what is recorded here.
- Never recommend `@latest` as a repair default. Pin from this registry.
- A user-provided version is a target to verify, not evidence. Confirm it
  against the lockfile and the installed packages.
- Treat a freshly published release (younger than about a week) with caution
  unless it is a CVE fix.

## A. Current stable line (checked 2026-10-14)

| line | value | checked date | recheck trigger |
| --- | --- | --- | --- |
| `tinacms` stable line | 3.14.4 | 2026-10-14 | Recheck on every new `tinacms` minor or patch |
| `@tinacms/cli` stable line | 4.0.2 | 2026-10-14 | Recheck on every new `@tinacms/cli` major, minor, or patch; `2.1.8` is the security floor (`CLI-01`), not the current line |

## B. Security floors (monotonic, checked 2026-10-13)

| package | floor | reason / evidence | checked date | recheck trigger |
| --- | --- | --- | --- | --- |
| `tinacms` | >= 3.3.1 | List-field regression (#6345, #6346) and filename/lock divergence (#6364, #6361) fixes landed in 3.3.1 | 2026-10-14 | Recheck when a new advisory names a higher floor |
| `@tinacms/cli` | >= 2.1.8 | CVE-2026-28792 / GHSA-8pw3-9m7f-q734 (drive-by and path traversal in older versions) | 2026-10-13 | Recheck on any new advisory or a higher patched version |
| `next` | >= 16.0.10 | Security patches for the Next 16 line | 2026-10-13 | Recheck when Next ships a new patch floor |
| `react` / `react-dom` | >= 19.0.x | Required by the current Tina 3.x and Next 16 pairing | 2026-10-13 | Recheck when the supported React major moves |
| Node.js | >= 20.9.0 | Required by Next 16 | 2026-10-13 | Recheck when the Next Node requirement moves |

## C. Known-bad windows and constraints (checked 2026-10-13)

| subject | window / constraint | impact | checked date | recheck trigger |
| --- | --- | --- | --- | --- |
| Package manager | `tinacms` greater than 2.7.3 wants pnpm for module resolution (#6308) | npm or yarn can hit "Could not resolve" style errors; pnpm is the safe default for the current line | 2026-10-13 | Recheck when the module-resolution constraint is lifted |
| List-field display | `tinacms` 3.0.x through 3.2.x list-field display regression, fixed in 3.3.1 (#6345, #6346) | Lists render incorrectly; treat 3.0.x to 3.2.x as a bad window | 2026-10-13 | Recheck if a later regression reappears |
| Filename and lock divergence | filename and lock-file divergence fixed in 3.3.1 or later (#6364, #6361) | Generated filenames can diverge from the lock; stay on 3.3.1 or later | 2026-10-13 | Recheck when artifact naming changes |
| CDN asset coupling | UI assets are served from a CDN and can update ahead of the local CLI; pin EXACT versions (#5838) | Mismatched UI and runtime break the admin; use exact pins, not caret ranges | 2026-10-13 | Recheck when asset delivery changes |
| Edge runtime vs self-hosted backend | the self-hosted backend needs the Node.js runtime; edge runtimes cannot host it (#4363, wontfix) | Cloudflare Workers and edge functions must use TinaCloud content, not a self-hosted backend | 2026-10-13 | Recheck if the runtime constraint is lifted |
| Self-hosted examples | the repository's self-hosted examples are acknowledged as out of date (#6365) | Cross-check every step against current docs, do not trust the example repos alone | 2026-10-13 | Recheck when the examples are refreshed |
| Module system | the current Tina line is ESM-only | A CommonJS build setup will not resolve the packages; set `"type": "module"` or use `.ts` | 2026-10-13 | Recheck if a CJS build is reintroduced |
| Config location | the config moved from `.tina/` to `tina/` | Advising against the wrong path fails; detect the actual location first | 2026-10-13 | Recheck if the config location moves again |
| Separate package lines | `tinacms` and `@tinacms/cli` sit on separate release lines (`tinacms` 3.x, `@tinacms/cli` 4.x); there is no `tinacms` v4 | Do not assume the two packages share a major version; read the current line for each from section A before pinning | 2026-10-14 | Recheck when either package's major line moves |
| Media manager | media upload and delete can report an error while the operation succeeds in the background (#6325) | Confirm actual state before retrying; avoid duplicate uploads | 2026-10-13 | Recheck when the media manager is fixed |
| Reference field typing | a reference field across collections with shared field names requires the shared fields to share a type (community-sourced, see research record) | Conflicting types cause GraphQL schema errors | 2026-10-13 | Recheck against `reference/types/reference` before relying on it |
| Admin sub-path | loading admin assets under a sub-path has known issues, even with `basePath` | Deploy admin at the domain root or its own subdomain | 2026-10-13 | Recheck when sub-path support changes |
| React 19 support | the current Tina 3.x line supports React 19 | Confirm the project's React major against the floor before advising | 2026-10-13 | Recheck when the supported React major moves |
| Branch support | multi-branch work uses a branch variable such as `NEXT_PUBLIC_TINA_BRANCH` alongside the config `branch` | Confirm the branch contract before advising on previews or multi-branch content | 2026-10-13 | Recheck when branch handling changes |
| Node template issues | the Node starter or template can lag the current docs | Treat template output as a starting point and verify against the registry and docs | 2026-10-13 | Recheck when the starter is refreshed |
| TinaCloud breach disclosure | a TinaCloud security breach disclosure (4.1) is recorded in the research log | Treat as a security-context note; verify current TinaCloud status before advising on credentials | 2026-10-13 | Recheck the disclosure status before advising on cloud security |

## D. Recent API and CLI change history that affects user projects (checked 2026-10-13)

| change | detail | checked date | recheck trigger |
| --- | --- | --- | --- |
| Config location | the config moved from `.tina/` to `tina/` | 2026-10-13 | Recheck on the next config-location change |
| Build flags | `--content=local` selects a local content source; `--port` (default 4001) and `--datalayer-port` (default 9000) control the dev ports | 2026-10-13 | Recheck when CLI flags change |
| Dev flags | `dev` supports `-c` to wrap the framework command and `--noWatch` / `--noSDK` / `--noTelemetry` for controlled regeneration | 2026-10-13 | Recheck when dev flags change |
| Diagnostics | `audit --clean` and `doctor --json` support project diagnosis | 2026-10-13 | Recheck when diagnostics change |
| Exact pinning | because UI assets are CDN-served, pin exact Tina versions instead of caret ranges (#5838) | 2026-10-13 | Recheck when asset delivery changes |
| Starter default | Astro is the default starter in the current line; the framework is not implied by Tina | 2026-10-13 | Recheck when the default starter changes |

When network access is unavailable, distinguish repository evidence from memory
and do not present an unverified version as current. Record the check date in the
project's own notes when the detail is volatile.
