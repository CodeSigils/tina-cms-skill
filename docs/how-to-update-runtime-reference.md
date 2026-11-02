# How to update a runtime reference safely

Use this guide when a source-backed TinaCMS change requires an update beneath
`skills/tina-cms/references/`. It describes the task sequence; `AGENTS.md`
remains the canonical owner of policy, exceptions, and required gates.

## Before you begin

Start by reading the [roadmap](roadmap.md) and the
[research index](research/index.md). Confirm that the work is not already
shipped, deferred, or blocked, and identify the topic file that owns the
finding.

## 1. Establish the evidence

Verify the claim against a primary source and record its URL and checked date
in the owning research topic. Register a new finding in the
[research index](research/index.md) when needed. Follow the complete
[research rules](../AGENTS.md#research-before-you-write); do not write a
version floor, vulnerable range, or stable-line claim from memory.

## 2. Update the runtime reference

Distil only the supported guidance into the relevant runtime reference. Keep
the reference self-contained and do not link it to `docs/research/` or any
path outside `skills/tina-cms/`. Update its provenance header with the finding
ID, tier, checked date, and recheck trigger. Add every new external runtime
link to the [source registry](../skills/tina-cms/references/source-registry.md).

For the complete boundary, provenance, and version-registry rules—including
the scheduled stable-line exception—use [Editing Rules](../AGENTS.md#editing-rules).

## 3. Verify the change

Run the deterministic repository gate specified in
[Verification](../AGENTS.md#verification), which is the canonical owner of its
commands and exit semantics. Review the affected authoring documents under
[Documentation Drift Review](../AGENTS.md#documentation-drift-review) before
handing the work off.
