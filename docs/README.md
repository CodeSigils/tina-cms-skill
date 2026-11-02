# Documentation

This map is for maintainers and contributors. It is authoring-only: installed
copies load only `skills/tina-cms/`.

The sections follow [Diátaxis](https://diataxis.fr/) (method source checked
2026-11-01): tutorials help a reader learn through a complete experience;
how-to guides support a concrete task; reference provides facts to consult; and
explanation provides context for decisions.

## Learn (tutorials)

- [Validate a TinaCMS skill checkout](tutorial-first-validation.md) — run a
  safe first verification pass and see the repository's clean and finding
  outcomes.

## Do (how-to guides)

- [Update a runtime reference safely](how-to-update-runtime-reference.md) —
  complete a source-backed reference update while preserving the boundary and
  provenance contract.

## Operational policy (outside Diátaxis)

[`AGENTS.md`](../AGENTS.md) is the canonical owner of repository policy and
required gates. Use it for [research requirements](../AGENTS.md#research-before-you-write),
[editing constraints](../AGENTS.md#editing-rules), [verification](../AGENTS.md#verification),
and [repository operations](../AGENTS.md#repository-shape-and-operations).

## Look up (reference)

- [Roadmap](roadmap.md) — milestones, shipped work, deferred items, and
  maintenance triggers.
- [Research index](research/index.md) — finding IDs, evidence tiers, and topic
  ownership.
- [Official links](official-links.md) — human-facing export of the dated Tina
  documentation link bank.
- [Source registry](../skills/tina-cms/references/source-registry.md) — runtime
  source of truth for external links.
- [Version registry](../skills/tina-cms/references/version-registry.md) —
  security floors, known-bad windows, and dated stable lines.

## Understand (explanation)

- [The two-boundary model](../README.md#the-two-boundary-model) — why runtime
  guidance is distilled from, but never links back to, authoring research.
- [Research evidence model](research/index.md#tier-definitions) — how source
  quality and uncertainty determine what may ship in a runtime reference.
- [Roadmap purpose](roadmap.md#purpose) and [ideal state](roadmap.md#ideal-state)
  — the constraints that shape the skill's long-term direction.

## Project state (outside Diátaxis)

The [roadmap](roadmap.md) records the durable project state. It is not a
changelog: commit bodies and the research log retain per-change detail.
