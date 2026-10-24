# Claude Code plugin built from claude-skills: design

Date: 2026-10-24
Status: draft, for review. Most points are deliberately still open. They get decided in the plugin's own project.

## Goal

A separate repository holds a Claude Code plugin. The plugin bundles selected skills from `iamchriswick/claude-skills`, each at one pinned, released version. The plugin has its own version and its own release cycle.

## Decided

| Topic | Decision | Source |
|---|---|---|
| Separate repository | The plugin lives in its own repository under `iamchriswick`, not in `claude-skills` | User, 2026-10-23 |
| The plugin's version | Set in the plugin's `.claude-plugin/plugin.json` and released on its own schedule, independent of the skill versions. Pulling in a new skill version is an ordinary change in the plugin repository, and the plugin's own release decides how much its version changes | User, 2026-10-23 |
| Skill selection | The plugin chooses which skills from `claude-skills` it contains, and pins one released version of each | User, 2026-10-23 |
| What is pinned | A skill's split release from `claude-skills`, `split/<skill-name>/vX.Y.Z`, which contains only the skill folder | User, 2026-10-23 |
| No retesting | A skill only gets a release tag after passing all its tests in `claude-skills`. The plugin trusts the tag and doesn't test the skills again | User, 2026-10-23 |
| gitslave | Not used. It coordinates whole repositories and can't take out a single folder | User, 2026-10-23 |

## What claude-skills provides

These are facts checked against `iamchriswick/claude-skills` on 2026-10-24.

- **Release tag:** `<skill-name>-vX.Y.Z` on `main`, with a GitHub release, for example `create-plan-v0.1.0`, release "create-plan: v0.1.0".
- **Split release:**
  - the branch `split/<skill-name>` and the tag `split/<skill-name>/vX.Y.Z`, for example `split/create-plan` and `split/create-plan/v0.1.0`, both at `ecfd25d`;
  - created by `git subtree split --prefix=skills/<skill-name>` in `claude-skills`' release workflow;
  - only that workflow writes to split branches and tags (release setup spec, § 1).
- **Protection:** release tags (`*-v*`), split tags (`split/**`) and split branches (`split/**`) are protected against updates and deletion. GitHub's rulesets "release tags" and "split branches" enforce this, with bypass only for the Repository admin role, which the release workflow acts as through `RELEASE_TOKEN`. A pinned split tag therefore can't move or disappear by accident. Checked with `gh api repos/iamchriswick/claude-skills/rulesets` on 2026-10-24.
- **What a split contains:** the skill folder at its root, with nothing else from the repository. For `create-plan` 0.1.0:
  - `SKILL.md`, `plan-template.md`, `CHANGELOG.md`;
  - `tests/plan-template.test.ts` (Vitest);
  - `evals/evals.json`, `evals/benchmark.json`, `evals/benchmark.meta.json`;
  - `evals/files/notes-cli/`, a fixture project that has its own `.claude/settings.json` and `CLAUDE.md`.
- **Where the version is:** in `SKILL.md`'s frontmatter, `metadata.version: "0.1.0" # x-release-please-version`.
- **What a release tag guarantees:** the skill passed its static checks and its skill-creator evaluation in `claude-skills`, with a with-skill pass rate of at least 0.9 that beats the without-skill rate (release setup spec, § 3).
- **What stays in `claude-skills`:** the tools that record and check evaluations (`pnpm eval:record`, `scripts/skill-hash.mjs`, `scripts/check-benchmarks.mjs`) aren't part of a split.

## Open

Every item here is undecided. Each one lists the options discussed so far.

### 1. The repository's name

`iamchriswick/<plugin-repo>`, for example `my-claude-plugin`. The plugin's name in `plugin.json` decides how its skills are namespaced, for example `/<plugin-name>:create-plan`.

### 2. How skills get into the plugin

| Option | How it works | Trade-offs |
|---|---|---|
| `git subtree` | `git subtree add/pull --prefix=skills/<skill> https://github.com/iamchriswick/claude-skills.git split/<skill>/vX.Y.Z --squash` | The skill files become ordinary files in the plugin repository. Each upgrade is a `subtree pull`. With `--squash`, the skill's individual commits aren't kept in the plugin |
| Copy script | A script copies `skills/<skill>` from a tag, with `git archive` or a sparse clone, driven by a list of skills and versions | Same result as subtree, plain files, but no subtree history and no extra branches |
| Git submodule | The plugin includes `claude-skills` as a submodule | A submodule always brings the whole repository at one commit, so it can't pin each skill separately |
| Marketplace `git-subdir` source | A Claude Code marketplace installs a plugin from a subfolder of a git repository | It installs a whole plugin from one subfolder, so each skill would become a plugin of its own, not one plugin with several skills |

### 3. Pin file

Whether the plugin keeps a file listing each skill and its version, for example `skills.lock.json` with `{ "create-plan": "0.1.0" }`, as the record of which versions it contains.

### 4. Finding new skill versions

Whether and how new skill versions are found. For example, a scheduled GitHub Action that lists `split/<skill>/v*` tags in `claude-skills` and opens a PR with the update, or doing it by hand.

### 5. Checking vendored files

Whether the plugin's CI checks that each vendored `skills/<skill>/` matches exactly the split tag it pins, so vendored skill files can't be edited by hand.

### 6. The plugin's CI and releases

- the tooling for the plugin's own version and releases;
- how much the plugin's version changes when a skill version changes. Discussed: as much as the skill changed, so a skill `fix` → patch, a skill `feat` → minor, a breaking skill change → major;
- whether the plugin's changelog lists the pinned skill versions per release.

### 7. Tests and evals inside the plugin

A split brings each skill's `tests/` and `evals/`, including fixture projects with their own `.claude/` folder, as in `create-plan`'s `evals/files/notes-cli/`. Open: whether they ship inside the plugin as they are, or are removed when skills are vendored.

## Known gap, accepted

Skills are tested one at a time, in `claude-skills`. Whether skills clash inside one plugin, for example through overlapping descriptions so the wrong skill triggers, isn't tested (release setup spec, § 3, "What it doesn't cover").

**Possible way to test it, undecided.** A vendored skill brings its `evals/evals.json` and fixture files, whose paths are relative to the skill folder. That makes it possible, in principle, to run `evaluate my <skill-name> skill, located in skills/<skill-name>/, with skill-creator` from the plugin workspace's root, with the plugin's other skills present. This hasn't been tried. Differences from a run in `claude-skills`:

- the result covers the skill together with the plugin's other skills;
- recording and the hash check aren't available, because those tools stay in `claude-skills`;
- skill-creator writes its workspace next to the skill, as `skills/<skill-name>-workspace/`, which the plugin repository would need to ignore.

This is an option on top of the decision not to retest. It doesn't replace that decision.

## Not in scope

- Changes to `iamchriswick/claude-skills` or its release process.
- New skills.
- Running behavior evals in the plugin's CI with `claude plugin eval`. Probe results from 2026-10-23 are in the release setup spec, § Not in scope.

## Sources

- `docs/superpowers/specs/2026-10-23-release-setup-design.md` in `iamchriswick/claude-skills`
- `git ls-tree -r split/create-plan/v0.1.0`, `git ls-remote origin` and `gh release list`, run on 2026-10-24
- [Plugin loading reference, Claude Code Docs](https://code.claude.com/docs/en/plugins/loading.md), for marketplace source types including `git-subdir`
- [Skills: run evals with skill-creator, Claude Code Docs](https://code.claude.com/docs/en/skills#run-evals-with-skill-creator)
- [Evaluating skill output quality, agentskills.io](https://agentskills.io/skill-creation/evaluating-skills)
