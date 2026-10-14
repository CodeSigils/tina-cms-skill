# Deployment (DEPLOY)

> Provenance: findings `DEPLOY-01` through `DEPLOY-08` | tiers: TIER1 (all rows) | checked 2026-10-13 | recheck trigger: when a deployment-options page is added or removed, or when a host's build-source requirement changes.

## DEPLOY-01 (TIER1) Vercel

The Tina build must run before the framework build. Set explicit revalidation
(for example `fetchOptions: { next: { revalidate: N } }`) or content goes stale.
Conditional deploys can use an ignore-build step; full GitHub Actions delegation
needs the Vercel token and project/org id secrets.

## DEPLOY-02 (TIER1) Netlify

`netlify.toml` takes precedence over the build command set in the UI. The build
command must run `tinacms build` before the framework build. Monorepos may need
to forward environment variables through the monorepo tool's config.

## DEPLOY-03 (TIER1) GitHub Pages

The site source must select "GitHub Actions", not "Deploy from a branch", or
TinaCMS is never built. A missing entry page can cause root-URL 404s.

## DEPLOY-04 (TIER1) Cloudflare Pages

A static/Pages target. `tinacms build` must run in the build step.

## DEPLOY-05 (TIER1) Cloudflare Workers

An edge-runtime target. It can serve a TinaCloud-backed site, but it cannot host
the self-hosted Node backend.

## DEPLOY-06 (TIER1) Deployment-options family

The documented family is `{vercel, netlify, github-pages, cloudflare-pages,
cloudflare-workers}`. Enumerate the family rather than assuming only three
targets.

## DEPLOY-07 (TIER1) GitLab is not a documented target

TinaCloud's Git provider is GitHub-only, and GitLab Pages is not a documented
deployment option. Route a GitLab-hosted project to the self-hosted path with a
custom Git Provider, and state plainly that GitLab Pages is not supported. The
self-hosted path supports only the GitHub Git Provider plus a custom
"make your own" provider; reaching GitLab requires that custom provider.

## DEPLOY-08 (TIER1) Host is independent of the content backend

The deployment host is not the content backend. A Vercel or Netlify site can
serve local-file, TinaCloud, or self-hosted content. The host changes where the
Tina build runs and which artifact mode applies, not the content source.
