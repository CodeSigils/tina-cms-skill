# UI And Customization

Read this file when a task touches how a Tina surface is rendered or styled:
the public site, the Tina admin, contextual (visual) editing, or a custom admin
field UI. The first job is to name the surface, because these do not share one
contract and a fix for one is usually wrong for another.

> Provenance: findings `STYLE-01` through `STYLE-04`, `API-01` through `API-03`, `API-06`, `API-09`, `CLI-11`, `SCHEMA-05`, `TDOCS-02` | tiers: TIER1, TIER2 (per row) | checked 2026-10-13 | recheck trigger: when the fields, object-field, contextual-editing, or media documentation changes, or before recommending any custom admin field UI.

This reference is part of the runtime skill and has no path into `docs/research/`.
External specifics are referenced by topic and pulled from `source-registry.md`;
this file does not carry raw URLs.

## Name the surface before suggesting code

Four surfaces are commonly conflated. Identify which one the task touches before
proposing any rendering or CSS change:

| Surface | What it is | Where its guidance lives |
| :--- | :--- | :--- |
| Public-site rendering | The site that reads content and renders it to visitors. | The generated client and contextual-editing topics; the field-type pages for rendered content. |
| Tina admin | The `/admin` editing UI that Tina serves. | Admin route placement and request-interception topics. |
| Custom admin field UI | A custom editor control inside the admin for a specific field. | The fields reference and the object field type (see below). |
| TinaDocs | A separate documentation-site workflow with its own OpenAPI generation. | Do not merge with TinaCMS admin or content work; TinaDocs is a distinct module. |

Also separate CSS by surface: public-site CSS, TinaCMS admin CSS, and TinaDocs
CSS have different contracts. Do not offer general CSS advice until the affected
surface is identified.

## Reading content: the generated client

The current `tinacms` line has no `generateClient()` helper and no `<TinaCMS>`
component. Any code using either is stale and must not be reproduced. Read
content through the generated client:

- Import from `tina/__generated__/client` and read with `client.queries.*` or
  `client.request`.
- Where the generated surface fits, prefer it; reserve custom queries for cases
  it cannot express.

See the generated-client-usage and custom-query topics in `source-registry.md`.

## Contextual editing and visual markers

Visual editing is client-side and binds DOM elements to content paths:

- `useTina` from `tinacms/dist/react` returns the live-editable data for a query,
  variables, and data. It is a Client Component hook only and cannot run in a
  Server Component, so confirm the component boundary before advising.
- `tinaField` produces the `data-tina-field` value that binds an element to a
  content path. Apply the marker to the DOM element that actually renders the
  value, not to a component wrapper. Incorrect placement breaks click-to-edit and
  field highlighting in the admin.

See the contextual-editing, visual-editing-client-boundary, and tinaField topics
in `source-registry.md`.

## Custom admin field UI

Cover a custom editor control through the fields reference and the object field
type: use the field `ui` configuration and object fields to compose the control.
Do not cite the extending-Tina custom-field-components page; it was not verified
on 2026-10-13 and deeper claims about custom field components must be
re-verified before being made. When a request needs that page, say the specific
link is unverified and route through the fields and object-field topics instead.

## Media and images

Media configuration (`build.media` and the local public folder) must match where
content actually references media; a mismatch makes uploads succeed while images
fail to resolve. The media manager can also report an upload or delete error
while the operation succeeds in the background, so confirm the actual state
before retrying and avoid duplicate uploads. See the media-and-image topic in
`source-registry.md`.

## Runtime boundaries that break the UI

- Never ship a `tinacms dev` artifact. A dev process and its watch output are
  development-only; the admin and preview must be served from the production
  `tinacms build` output, and `tinacms build` runs before the framework build.
- Request interception: a `proxy.ts` (Next 16+) or `middleware.ts` rewrite or
  redirect that touches `/admin`, `/api/preview`, or `/api/tina/*` breaks the
  CMS. Inspect the interception file before attributing a broken admin or a 404
  backend route to anything else, and report the likely cause rather than editing
  it blind.
- Admin sub-path: loading admin assets under a sub-path has known issues even
  with `basePath`. Deploy the admin at the domain root or on its own subdomain.
  See the admin-route-placement topic in `source-registry.md`.

## Checklist output

For a rendering, contextual-editing, or customization change, report: the named
surface (public site, admin, custom admin field UI, or TinaDocs), the file(s) the
change touches, whether the marker sits on a DOM element rather than a wrapper,
whether the hook stays inside a Client Component, and whether request
interception or a sub-path deployment could interfere. For a change, require a
diff or backup plan for any generated or content-mutating action.
