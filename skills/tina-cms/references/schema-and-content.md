# Schema And Content

Read this file when a task authors or changes a collection, a field, a template,
or frontmatter content, or when it validates that the config and the content
directory still agree. Schema work is coordinated work: a field change touches
`tina/config.*`, the content files, the generated client and types, and the
editor, so read this before proposing any schema edit.

> Provenance: findings `SCHEMA-01` through `SCHEMA-07` | tiers: TIER1, TIER2 (per row) | checked 2026-10-13 | recheck trigger: when the schema or collections reference changes, or when a new list-field or reference regression is reported.

This reference is part of the runtime skill and has no path into `docs/research/`.
External specifics are referenced by topic and pulled from `source-registry.md`;
this file does not carry raw URLs. Version-sensitive schema behavior is checked
against `version-registry.md`.

## Collections

A collection maps a directory in the repository to an editable content shape.
Author it against the collections reference and the schema reference in
`source-registry.md`.

- `name` is singular and carries no spaces or dashes; use letters, numbers, and
  underscores only.
- `path` and `format` describe the content directory and its file type. Confirm
  they match the real directory before advising; a `path` that points somewhere
  else is a common failure.
- `match` and similar globs carry no file extension.
- Mark the display title with `isTitle` and the rich-text body with `isBody`.
  These drive list labels and the editing surface; a document with neither is
  awkward to edit.
- Reserved field names to avoid: `children`, `mark`, `_template`, `_sys`, `id`,
  and `__typename`. Field names themselves allow letters, numbers, and
  underscores only.

### `fields` XOR `templates`

A collection has one shape (`fields`) or several shapes (`templates`); never mix
them on one collection.

- `fields` for a collection where every document has the same shape.
- `templates` for a collection where documents differ by shape. Each document's
  frontmatter then needs a `_template` key that selects its template, and the
  `_template` value must match a declared template name.

Treat the `fields`-versus-`templates` choice as the first modeling decision: it
determines how the document's frontmatter must be shaped.

## Fields and the eight documented types

The documented field types are `string`, `number`, `datetime`, `boolean`,
`image`, `reference`, `object`, and `rich-text`. Each has its own page in the
field-type topic family in `source-registry.md`; read the specific type page
before prescribing one.

Three accuracy flags matter because stale guidance circulates:

- `select` is not a first-class type keyword. It is a `string` field configured
  with `options`; author it as a string field with an options list, not as a
  `select` type.
- Grouping is done with `object` fields (and lists of objects). There is no
  separate "group" field; an object field holds nested fields.
- A `reference` field cannot be `list: true` directly. Author a list of
  references through whatever the current reference documentation prescribes
  rather than setting `list` on the reference itself; confirm against the
  reference-field topic.

Additional constraints worth checking against the reference topic:

- When a reference field targets multiple collections that share field names,
  the shared fields must share a type. Conflicting types (for example a `bio`
  that is `string` in one collection and `rich-text` in another) surface as
  GraphQL schema errors. This is community-sourced and should be re-verified
  against the current reference-field page before relying on it.
- Field UI and validation live under the fields reference: `ui`, `required`,
  `isTitle`, and `isBody` are configured there. Check the field `ui` keys against
  the installed line.

## Format and parse: rendered value versus saved value

A field's `format` and `parse` transforms decouple what the editor and site see
from what is stored on disk. `format` maps the stored value to the rendered value
the editor shows, and `parse` maps the edited value back to the canonical stored
form before saving. Use the pair when the stored shape and the displayed shape
should differ, and keep the saved value canonical so content reads stay
predictable. Confirm the exact transform contract on the field-type page before
prescribing it.

## Config determinism

The config is executed to build the schema, so it must be deterministic:

- Do not call `Date.now()`, `Math.random()`, or any other non-deterministic
  function at the top level of `tina/config.*`. Non-deterministic values make
  builds and the lock file unstable.
- Keep imports in `tina/config.*` minimal and type-only where possible.
  Importing frontend-only code (DOM, hooks, component libraries) can break the
  config build.

## Version windows that touch schema work

Floors and known-bad windows are not restated here; they are owned by
`version-registry.md`. Read them there, and check the project's installed
version before debugging a schema symptom such as a list-field display problem.

## Change workflow

For any schema or content change, require evidence across all four surfaces, not
just the config:

1. Config: the collection or field change in `tina/config.*`.
2. Content: representative documents still validate against the new shape, and
   any `_template` value still resolves.
3. Generated: regenerate the client and types (never hand-edit
   `tina/__generated__/`), and confirm the lock file updates.
4. Editor: the admin opens the changed collection and saves and reloads a
   document round-trip.

State which artifact mode the project runs (see `conventions.md`) before
regenerating, and require a diff or backup plan for any content-mutating action.
