# Self-hosted (SELF)

> Provenance: findings `SELF-01` through `SELF-05` | tiers: TIER1 (all rows) | checked 2026-10-13 | recheck trigger: when the self-hosted overview, manual setup, or Git-provider reference changes, or when the edge-runtime constraint is revisited.

## SELF-01 (TIER1) Edge runtime is incompatible

The self-hosted backend needs the Node.js runtime and cannot run on edge
runtimes (issue #4363, labeled wontfix). Cloudflare Workers and edge functions
must use TinaCloud content instead.

## SELF-02 (TIER1) Self-hosted examples are out of date

The project's self-hosted examples are acknowledged as out of date (issue
#6365). Cross-check every step against current docs rather than trusting the
example repos alone.

## SELF-03 (TIER1) Node.js runtime stack

The self-hosted backend runs on the Node.js runtime with `@tinacms/datalayer`
and `tinacms-authjs`, and a generated database client. It is a Node server, not
a Workers handler.

## SELF-04 (TIER1) Custom Git provider

Reaching a non-GitHub host requires a custom `GitProvider` ("make your own").
This is not a first-class target; treat it as an advanced path.

## SELF-05 (TIER1) Auth and secret hygiene

Hash self-hosted passwords and keep credentials and secrets in environment
variables. Never commit raw credentials or secrets to the repository.
