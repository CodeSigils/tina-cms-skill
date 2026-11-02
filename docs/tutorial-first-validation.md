# Tutorial: validate a TinaCMS skill checkout

This tutorial gives a new maintainer one complete, read-only experience: verify
that the portable TinaCMS skill is structurally sound, then observe how the
version checker reports a known unsafe fixture. It does not contact a remote,
change a runtime reference, or modify Git history.

## Before you begin

You need a checkout of this repository and Node.js. Run the following commands
from the repository root.

## Verify the portable payload

Run the structural checker:

```bash
node tests/check-skill.mjs
```

The expected result begins `check-skill: clean`. This proves the
shipped payload has valid frontmatter and reference routing, preserves the
runtime/authoring boundary, and has complete provenance and research finding
registrations.

## Check the current version fixture

Run the version checker against the fixture that represents a supported target:

```bash
node scripts/check-versions.mjs tests/fixtures/versions/current.json
```

This exits `0` when the fixture satisfies the dated floors and known-bad-window
rules in the [version registry](../skills/tina-cms/references/version-registry.md).

## Observe a finding safely

Now run the intentionally below-floor fixture:

```bash
node scripts/check-versions.mjs tests/fixtures/versions/below-floor.json
```

This command should report a finding and exit `1`. That is the expected result:
it demonstrates that the checker distinguishes an unsafe version from a tool
failure. The fixture is read-only, so no package or lockfile is changed.

## What to do next

You have completed the safe maintainer validation path. Before changing Tina
guidance, follow [Research before you write](../AGENTS.md#research-before-you-write).
For the complete contribution gate, use [Verification](../AGENTS.md#verification)
and return to the [documentation map](README.md) to choose the next document.
