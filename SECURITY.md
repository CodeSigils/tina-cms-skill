# Security Policy

## Scope

This repository is a documentation and agent-skill repository. It ships Markdown
skill files plus small, dependency-free maintainer checks (Node ESM and Python
stdlib). It contains no runtime service, no network-facing endpoint, no
credentials, and no code that executes on a user's machine when the skill is
loaded. The trust surface is therefore the integrity of the shipped payload:
`skills/tina-cms/` (its `SKILL.md`, `references/`, and `agents/openai.yaml`).

Security concerns for this repository are limited to:

- a tampered skill payload that could steer an agent toward unsafe practices
  (destructive repairs, `@latest` upgrades, credential exposure, direct edits to
  generated artifacts);
- supply-chain tampering with the repository's own validation scripts; and
- accidental inclusion of secrets or generated artifacts in the tree.

## Reporting a Vulnerability

Report a vulnerability privately. Do not open a public issue for a security
report.

- Preferred: use the repository host's private security advisory channel
  ("Report a vulnerability" on the repository's **Security** tab). This keeps the
  report private until triage is complete.
- If no private advisory channel is available, contact the repository maintainer
  through the address or profile listed by the repository host, describing the
  issue and the impact without disclosing exploitation details publicly.

Please include: the affected file or path, the version or commit, a description
of the impact, and a minimal reproduction when one exists. Expect an initial
acknowledgement, a triage decision, and a coordinated disclosure once a fix or
mitigation is available.

## Secret Handling

The skill never acquires, stores, or transmits secrets.

- It may name environment variables (for example `TINA_TOKEN`), classify them as
  public or secret, and describe placeholder values in CI configuration.
- It does not read, print, request, store, or send real credentials, tokens, or
  API keys, and the repository tracks none.
- A task that would need a real secret is out of scope: report it instead of
  handling the value.
- `.env` files and generated artifacts are gitignored and must never be
  committed. See `.gitignore`.

## Supported Versions

Only the current `main` line receives security updates. The repository has no
tagged release yet; once one exists, only the latest release tag and `main`
receive updates.

## Last Reviewed

Last reviewed: 2026-10-14.
