# Schema and collections (SCHEMA)

> Provenance: findings `SCHEMA-01` through `SCHEMA-07` | tiers: TIER1, TIER2 (per row) | checked 2026-10-13 | recheck trigger: when the schema or collections reference changes, or when a new list-field or reference regression is reported.

## SCHEMA-01 (TIER1) List-field display regression

`tinacms` 3.0.x through 3.2.x had a list-field display regression (issue #6345),
fixed in 3.3.1. Treat 3.0.x to 3.2.x as a bad window.

## SCHEMA-02 (TIER1) List-field regression companion

A companion fix (issue #6346) landed in 3.3.1. Same guidance: avoid the 3.0.x to
3.2.x window.

## SCHEMA-03 (TIER1) Collection conventions

- `name` is singular, with no spaces or dashes (letters, numbers, underscores).
- `path` and `format` describe the content directory and file type; match globs
  carry no file extension.
- Use `fields` XOR `templates`: `fields` for one shape, `templates` for several.
  Do not mix them on one collection.
- A `templates` collection needs `_template` in each document's frontmatter.
- Field names allow letters, numbers, and underscores only. Reserved names to
  avoid: `children`, `mark`, `_template`, `_sys`, `id`, `__typename`.
- Mark the display title with `isTitle` and the rich-text body with `isBody`.

## SCHEMA-04 (TIER1) Field types

The documented field types are `string`, `number`, `datetime`, `boolean`,
`image`, `reference`, `object`, and `rich-text`. `select` is a scalar field with
`options`, not a first-class type. Grouping uses object fields. A `reference`
cannot be `list: true` directly.

## SCHEMA-05 (TIER2) Reference-field typing (community-sourced)

When a reference field targets multiple collections that share field names, the
shared fields must share a type; conflicting types (for example `bio: string`
versus `bio: rich-text`) cause GraphQL schema errors. This is community-sourced
(Adam Cogan's "7 Important Updates to TinaCMS 2.0", covering the 2.1 to 2.3
changes) and should be re-verified against the current reference-field page.
The same community source also notes a known admin sub-path asset limitation.

## SCHEMA-06 (TIER1) Config determinism

Do not call `Date.now()`, `Math.random()`, or another non-deterministic function
at the top level of `tina/config.*`: the config is executed to build the schema,
so non-deterministic values make builds and lock files unstable. Keep config
imports minimal and type-only where possible; importing frontend-only code (DOM,
hooks, component libraries) can break the config build.

## SCHEMA-07 (TIER1) Field format and parse transforms

A field's `format` and `parse` transforms decouple the rendered/editor value from
the value stored on disk: `format` maps the stored value to what the editor and
site render, and `parse` maps the edited value back to the canonical stored form
before saving. Use them to keep the saved value in one shape while the UI shows
another. Confirm the transform pair on the field-type page before prescribing it.
