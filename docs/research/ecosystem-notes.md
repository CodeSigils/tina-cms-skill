# Ecosystem notes: the public skill landscape

Authoring-only. This file is **not** part of the runtime payload (`skills/tina-cms/`) and the installed skill never reads it. It is maintainer reference material gathered from public skill registries and recorded on 2026-10-14, so the maintainers can see how the wider agent-skill ecosystem is shaped without re-running the research.

It is deliberately **not** a findings topic file: it carries no finding IDs and nothing in it is registered in `index.md`. Every external link was checked reachable (HTTP 200) on 2026-10-14.

## Why this file exists

Recorded on request, for repository and maintainer consumption. Nothing here changes the runtime payload. It informs future decisions (for example, how much to invest in discoverability versus correctness, and whether the verification direction this repo already took matches the ecosystem).

## The registry at a glance (skills.sh, 2026)

- **Scale**: about one million skills and roughly 280 million installs recorded, seven months after launch — faster than repositories on GitHub, apps on the App Store, or packages on npm reached their first million.
- **Concentration**: nearly half of all skills were installed exactly once. The top 375 skills (0.04% of the registry) account for 62% of installs, and the top 1.2% account for 94%.
- **Demand distribution** (share of installs): software engineering about 18%, agent workflows about 15%, business operations and writing/documents about 11% each.
- **Cross-industry skills** (useful at banks, hospitals, law firms, restaurants alike) are about 66% of classified listings and about 87.5% of installs; they draw roughly 3.6 times the installs per listing of industry-specific skills.
- **Expectation shift**: the ecosystem is moving from popularity to effectiveness. The consistent message is that "the best signal of a skill's quality" will shift from install count to whether the agent does the job better with the skill than without it — that is, skills "will get tests and benchmarks."

## Most-installed skills worth knowing (snapshot, 2026-10-14)

Recorded installs are aggregate registry counters, not unique users; figures differ slightly between snapshot sources.

| Skill                                                                                                       | Publisher           | Recorded installs | Why it is relevant here                                                                                            |
| ----------------------------------------------------------------------------------------------------------- | ------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| `find-skills`                                                                                               | vercel-labs         | ~3.8M             | The single most-installed skill is about **finding** skills — discoverability is the ecosystem's biggest friction. |
| `agent-browser`                                                                                             | vercel-labs         | ~1.1M             | Browser automation; a common task category.                                                                        |
| `frontend-design`                                                                                           | anthropics          | ~1.0M             | An official-vendor skill; vendor skills dominate the tail.                                                         |
| `grill-me`, `grill-with-docs`, `tdd`, `improve-codebase-architecture`, `codebase-design`, `diagnosing-bugs` | mattpocock          | ~0.8M–1.3M each   | One publisher dominates an engineering-workflow cluster; process and debugging skills rank high.                   |
| `skill-creator`                                                                                             | community           | popular           | Authoring skills are widely used.                                                                                  |
| `verification-before-completion`, `systematic-debugging`                                                    | community           | high              | Verification-first and debugging skills rank high.                                                                 |
| `writing-great-skills`, `writing-for-agents`                                                                | community           | high              | Skill-authoring craft is a named category.                                                                         |
| `skillscan`, `skill-vetter`                                                                                 | community (ClawHub) | ~0.2M–0.3M        | **Security-vetting** skills are themselves popular; the ecosystem treats skill safety as a first-class problem.    |

## What this suggests for this repository

- This skill is framework-specific (TinaCMS), which places it in the long tail — expected, given the concentration and the cross-industry advantage above. Popularity is not the goal; correctness and low support cost are.
- The ecosystem's direction is verification-first (tests and benchmarks), which matches this repo's deterministic checker (`tests/check-skill.mjs`) plus the LLM-judged scenario matrix (backlog `R-1`).
- Skill safety is a recognized ecosystem concern. This repo's design — no runtime service, no credentials, no code execution on load, plus `SECURITY.md` — is already aligned with that concern.
- That `find-skills` leads the registry reinforces that the **description** is the highest-leverage part of a skill: a discriminating name, a "use if" trigger, and explicit non-triggers. This repo's `SKILL.md` frontmatter is already checked for exactly that (check `a`).
- Single-owner references and progressive disclosure match the published skill-authoring norms; this repo already applies both.

## Caveats

- All figures are aggregate registry counters, not unique users or independent choices; snapshots differ per source and date, and repeated skill IDs across hubs mean counts are not de-duplicated globally.
- The aggregators (Linkly AI, SkillSignal, the olshansky dashboard) are **not** affiliated with skills.sh; their composite scores are opinions, not authorities. Prefer the Vercel report and skills.sh itself for registry-wide facts.
- No claim here is used at runtime. This file is maintainer context only.

## Sources

| Source                                      | URL                                                   | Method    | Notes                                                                          |
| ------------------------------------------- | ----------------------------------------------------- | --------- | ------------------------------------------------------------------------------ |
| Vercel, "State of agent skills"             | https://vercel.com/blog/state-of-agent-skills         | docs      | Registry scale, concentration, and category distribution. Verified 2026-10-14. |
| skills.sh directory                         | https://www.skills.sh/                                | docs      | Live leaderboard of installed skills. Verified 2026-10-14.                     |
| Linkly AI, most-installed skills            | https://linkly.ai/skills/most-installed               | community | Cross-hub install counts; open dataset under CC BY 4.0. Verified 2026-10-14.   |
| SkillSignal, "Top 100 Agent Skills in 2026" | https://skill-signal.org/reports/top-100-agent-skills | community | Leaderboard analysis separating adoption from quality. Verified 2026-10-14.    |
| olshansky, skills.sh ecosystem dashboard    | https://skills-dashboard.olshansky.info/              | community | Distribution and publisher views over skills.sh data. Verified 2026-10-14.     |
| LinklyAI/best-skills (GitHub)               | https://github.com/LinklyAI/best-skills               | community | Daily-updated CSV rankings across hubs. Verified 2026-10-14.                   |
