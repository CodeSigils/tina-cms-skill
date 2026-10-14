# Styling and editor UI (STYLE)

> Provenance: findings `STYLE-01` through `STYLE-04` | tiers: TIER1 (all rows) | checked 2026-10-13 | recheck trigger: when the fields, object-field, contextual-editing, or media documentation changes, or before recommending any custom admin field UI.

## STYLE-01 (TIER1) Separate the surfaces first

Separate public-site CSS, TinaCMS admin CSS, and TinaDocs CSS before suggesting
code. They are different surfaces with different contracts; do not offer general
CSS advice until the affected surface is identified.

## STYLE-02 (TIER1) Media manager ghost uploads

The media manager can report an upload or delete error while the operation
succeeds in the background (issue #6325). Confirm the actual state before
retrying, and avoid duplicate uploads.

## STYLE-03 (TIER1) Custom admin field UI

Cover custom admin field UI through the fields reference and the object field
type. The extending-Tina custom-field-components page was not verified on
2026-10-13 and must not be cited; re-verify before making deeper claims about
custom field components.

## STYLE-04 (TIER1) Visual-editing markers

`data-tina-field` markers belong on DOM elements, not component wrappers.
Incorrect placement breaks click-to-edit and field highlighting in the admin.
