# tina-cms-skill

[![Agent Skills compatible](https://img.shields.io/badge/Agent%20Skills-compatible-blue)](https://agentskills.io/specification)
[![skills.sh](https://img.shields.io/badge/skills.sh-directory-blue)](https://skills.sh/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**tina-cms-skill** is one installable, portable skill for working in a
TinaCMS-backed repository. It identifies the actual Tina surface in the target
project before it advises, then routes to bounded, source-backed guidance.

**How it works, in one line:** inspect the repository, detect the Tina surface,
route to the bounded reference for that surface, and check installed versions
before giving version-dependent advice.

Tina is not one surface. A single repository can combine the [TinaCMS](https://tina.io) content
framework, a content backend (local files, TinaCloud, or self-hosted), the public
site, a custom admin, and an optional TinaDocs API-documentation site — and they
do not share one runtime contract. The skill's first job is always to find out
which surface the task touches.

## Official Tina Links

- [Tina](https://tina.io) — the official TinaCMS site.
- [Tina documentation](https://tina.io/docs) — the official TinaCMS docs.
- [Tina license](https://github.com/tinacms/tinacms/blob/main/LICENSE) — Apache-2.0.

## What The Skill Covers

- **TinaCMS setup** — project initialization, package manager, build ordering,
  exact version pinning.
- **Schema and collections** — collections, fields, templates, and the
  frontmatter content that must agree with them.
- **Content and generated GraphQL artifacts** — the generated client, the data
  layer, queries, and the lock/generated-artifact contract.
- **TinaCloud versus self-hosted routing** — environment contract, lock-file
  indexing, the Node-only self-hosted backend, and the custom Git-provider path.
- **Deployment targets** — Vercel, Netlify, GitHub Pages, Cloudflare Pages, and
  Cloudflare Workers, each with its own build and artifact traps.
- **Public-site and admin CSS** — public rendering, contextual editing markers,
  the Tina admin, and custom admin field UI.
- **TinaDocs OpenAPI** — only when a TinaDocs site or an API-schema collection is
  actually present; regeneration is a mutation boundary.

It also carries two dated, provenance-checked registries the agent reads at use:
an official docs-link bank
([`references/source-registry.md`](skills/tina-cms/references/source-registry.md)) and a
version registry of security floors and known-bad windows
([`references/version-registry.md`](skills/tina-cms/references/version-registry.md)). When a project sits below a floor or inside a
known-bad window, the skill says so — with the exact installed versions and a
safe path — before giving version-dependent advice.

## How It Works

Every invocation runs the same bounded loop:

1. **Inspect the repository.** Read the first-hop signals — `tina/config.ts` or
   `tina/config.tsx`, `tina/tina-lock.json`, a generated Tina client, `useTina`,
   the content-backend environment variables, and any request-interception
   config.
2. **Detect the surface.** Decide which surface the task touches: the CMS, the
   content backend (local files, TinaCloud, or self-hosted), an optional TinaDocs
   site, and the deployment host. A deployment host is not the same thing as the
   content backend.
3. **Route.** Load only the bounded reference for that surface, rather than
   answering from memory.
4. **Check versions.** Compare the project's installed versions against the dated
   version registry and warn — with exact versions and a safe path — before
   giving any version-dependent advice.
5. **Advise.** Give source-backed guidance that preserves content, lockfiles,
   generated artifacts, and secrets.

### What it looks like in practice

A prompt like *"Add an image field to the posts collection"* against a project
pinned to `@tinacms/cli` 2.0.9 first detects the Tina surface, then flags that
the CLI is below the security floor before it discusses the schema change, and
finally gives field guidance from the schema reference without touching
generated artifacts or the lockfile.

## What It Does Not Do

- It is **not** a general Next.js, Astro, or Hugo skill. With no Tina layer it
  does not activate.
- It does **not** replace TinaCMS or run as a service; it is guidance only.
- It does **not** give TinaDocs OpenAPI guidance unless a TinaDocs site or an
  API-schema collection is actually present.
- It does **not** edit generated artifacts or remove lockfiles, and it never
  acquires, stores, or transmits secrets.

## The Two-Boundary Model

The repository has exactly two boundaries, and the dependency runs one way.

- **Runtime payload — `skills/tina-cms/`.** This is the single portable skill
  directory that ships to every host: `SKILL.md`, `references/`, and
  `agents/openai.yaml`. It is the only thing the installed skill loads. Nothing
  it reads or links may point outside itself, and it never reaches into
  `docs/research/`.
- **Authoring-only — `docs/`.** The research record under `docs/research/` and
  the human-facing link export `docs/official-links.md` are inputs used to
  author the skill. References are distilled **from** these findings; the reverse
  never happens.

The one-way rule is enforced: `tests/check-skill.mjs` fails the build if a
runtime file contains a loadable `docs/research/` path or escapes the skill
directory.

## Install

Both hosts install from the **same** `skills/tina-cms/` payload. Run the commands
below from the repository root.

### Codex

Copy the payload into the Codex skills directory:

```bash
mkdir -p ~/.codex/skills
cp -r skills/tina-cms ~/.codex/skills/tina-cms
```

Or symlink it for live updates from this checkout:

```bash
mkdir -p ~/.codex/skills
ln -s "$PWD/skills/tina-cms" ~/.codex/skills/tina-cms
```

### opencode

Copy the payload into the opencode skills directory:

```bash
mkdir -p ~/.config/opencode/skills
cp -r skills/tina-cms ~/.config/opencode/skills/tina-cms
```

Or symlink it:

```bash
mkdir -p ~/.config/opencode/skills
ln -s "$PWD/skills/tina-cms" ~/.config/opencode/skills/tina-cms
```

The payload carries no host-specific runtime commands or absolute paths. Each
host's own invocation controls are respected: activation is driven by the skill's
`name` and `description` frontmatter, and the only host-adjacent file,
`agents/openai.yaml`, holds display metadata for Codex. Nothing in the payload
forces or suppresses a host's implicit-versus-manual invocation behavior.

## Runtime Payload

Only [`skills/tina-cms/`](skills/tina-cms/) ships to an agent.

```text
skills/tina-cms/
├── SKILL.md                              # router: inspect, then route by surface
├── agents/
│   └── openai.yaml                       # Codex display metadata
└── references/
    ├── source-registry.md                # dated official docs-link bank (runtime source of URLs)
    ├── version-registry.md               # dated security floors and known-bad windows
    ├── project-inspection.md             # detect-the-surface procedure and signal table
    ├── conventions.md                    # project-conventions checklist
    ├── cli.md                            # CLI commands, dev/build flags, pinning
    ├── schema-and-content.md             # collections, fields, templates, content
    ├── content-api-and-deployment.md     # backend lane, generated artifacts, deployment
    ├── ui-and-customization.md           # public rendering, admin, contextual editing
    └── tinadocs-openapi-and-styling.md   # TinaDocs OpenAPI and CSS surface
```

## Verification

Deterministic checks ship with the repository:

```bash
node tests/check-skill.mjs
node scripts/check-versions.mjs tests/fixtures/versions/current.json
python3 scripts/check_commit_messages.py HEAD
```

- `tests/check-skill.mjs` validates the payload (frontmatter, reference routing,
  runtime-path boundary, registry shapes, research provenance and finding-ID
  registration, and the copied payload). Exit `0` clean, `1` findings,
  `2` could-not-run.
- `scripts/check-versions.mjs` compares a target's installed Tina/Next/React/Node
  versions against [`references/version-registry.md`](skills/tina-cms/references/version-registry.md) and reports below-floor,
  known-bad-window, and blocked-version findings (tri-state exit codes).
- `tests/run-scenarios.mjs` runs the LLM-judged behavioral suite; with no model
  provider configured it degrades to exit `2` ("could not run").

`quick_validate.py` from the Codex skill-creator is an optional manual check, not
a required repository step.

## Commit And Change Policy

Every commit has a concise imperative subject and a body with `what:` then
`why:`; `scripts/check_commit_messages.py` enforces it. This repository keeps
**no `CHANGELOG.md`** and no changelog file under any other name: the commit
history is the canonical change record, `docs/research/` holds detailed
rationale, and [`docs/roadmap.md`](docs/roadmap.md) tracks durable milestones, a
shipped log, a backlog, and maintenance triggers.

To enable the optional pre-commit hook:

```bash
git config core.hooksPath .githooks
```

## Repository Layout

```text
skills/tina-cms/       # the portable runtime payload (the only shipped artifact)
docs/research/         # authoring-only findings: research-log, index, topic files
docs/official-links.md # human-facing export of the docs-link bank
docs/roadmap.md        # milestones, shipped log, backlog, maintenance triggers
tests/                 # deterministic structural checker + behavioral scenarios
scripts/               # version checker and commit-message checker
.github/workflows/     # validation and scheduled freshness workflows
.githooks/             # optional pre-commit hook
```

## See Also

| Document                                                                                           | Purpose                                                                                                                                                                                       |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`AGENTS.md`](AGENTS.md)                                                                           | Contributor and maintainer conventions: boundaries, editing rules, and the commit message contract. This repository has no separate `CONTRIBUTING.md`; `AGENTS.md` is the contributing guide. |
| [`SECURITY.md`](SECURITY.md)                                                                       | Security policy, scope, and reporting.                                                                                                                                                        |
| [`LICENSE`](LICENSE)                                                                               | MIT license text.                                                                                                                                                                             |
| [`docs/roadmap.md`](docs/roadmap.md)                                                               | Milestones, shipped log, backlog, and maintenance triggers.                                                                                                                                   |
| [`docs/official-links.md`](docs/official-links.md)                                                 | Human-facing export of the docs-link bank.                                                                                                                                                    |
| [`skills/tina-cms/SKILL.md`](skills/tina-cms/SKILL.md)                                             | The runtime entrypoint (router).                                                                                                                                                              |
| [`skills/tina-cms/references/source-registry.md`](skills/tina-cms/references/source-registry.md)   | Dated official docs-link bank.                                                                                                                                                                |
| [`skills/tina-cms/references/version-registry.md`](skills/tina-cms/references/version-registry.md) | Dated security floors and known-bad windows.                                                                                                                                                  |

## Security

This is a documentation and agent-skill repository with no runtime service. The
skill never acquires, stores, or transmits secrets. See
[SECURITY.md](SECURITY.md) for the reporting and scope policy.

## License

MIT — see [LICENSE](LICENSE). SPDX identifier: `MIT`.
