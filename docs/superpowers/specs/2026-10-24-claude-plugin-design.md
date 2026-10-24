# Claude Code plugin built from claude-skills: design

Date: 2026-10-24
Status: draft, for review. Items 2–6, 8 and 9 under Open carry recommended solutions. They're decided in the plugin's own project, and everything under "To verify in the plugin project" gets resolved there.

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
| gitslave | Not used. It coordinates whole repositories and can't take out a single folder. Its repositories also aren't part of the plugin repository, and Claude Code installs a plugin only from that repository (item 2) | User, 2026-10-23 and 2026-10-24 |
| Repository and plugin name | The repository is `iamchriswick/claude-plugin-pro-tools`. `.claude-plugin/plugin.json` has `"name": "protools"`, so skills are invoked as `/protools:<skill-name>`, for example `/protools:create-plan`. The user searched plugin directories such as buildwithclaude.com and found `protools` unused | User, 2026-10-24 |

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

Every item here except item 1 is undecided. Each one lists the options discussed so far, and most carry a recommended solution.

### 1. The repository's name (decided)

Decided on 2026-10-24. See Decided, "Repository and plugin name". The marketplace's own `name` in `marketplace.json`, which users type after `@` when installing, is still open.

### 2. How skills get into the plugin

**Fact that bears on it.** Claude Code installs a plugin by cloning the plugin's repository. It rejects component paths and symlinks that lead outside the plugin directory (Plugin loading reference, § Paths that escape the plugin directory). So the skill files have to be committed in the plugin repository itself.

| Option | How it works | Trade-offs |
|---|---|---|
| `git subtree` | `git subtree add/pull --prefix=skills/<skill> https://github.com/iamchriswick/claude-skills.git split/<skill>/vX.Y.Z --squash` | The skill files become ordinary files in the plugin repository. Each upgrade is a `subtree pull`. With `--squash`, the skill's individual commits aren't kept in the plugin |
| Copy script | A script copies `skills/<skill>` from a tag, with `git archive` or a sparse clone, driven by a list of skills and versions | Same result as subtree, plain files, but no subtree history and no extra branches |
| Git submodule | The plugin includes `claude-skills` as a submodule | A submodule always brings the whole repository at one commit, so it can't pin each skill separately |
| Marketplace `git-subdir` source | A Claude Code marketplace installs a plugin from a subfolder of a git repository | It installs a whole plugin from one subfolder, so each skill would become a plugin of its own, not one plugin with several skills |

**Recommended, not decided: the copy script.** `pnpm skills:vendor <skill> <version>`, for example `pnpm skills:vendor create-plan 0.1.0`:
1. fetches the tag `split/<skill>/v<version>` from `iamchriswick/claude-skills`. That tag's tree is exactly the skill folder;
2. replaces `skills/<skill>/` with that tree;
3. writes the skill's entry in the pin file (item 3).

Compared with `git subtree`, it adds no merge commits and no history from `claude-skills` to the plugin repository, and the result is easy to check (item 5).

### 3. Pin file

Whether the plugin keeps a file listing each skill and its version, as the record of which versions it contains.

**Recommended, not decided:** `skills.lock.json` at the repository root, written only by `pnpm skills:vendor`. It records the exact commit as well as the version, so the pin doesn't depend on the tag alone:

```json
{
  "source": "iamchriswick/claude-skills",
  "skills": {
    "create-plan": {
      "version": "0.1.0",
      "tag": "split/create-plan/v0.1.0",
      "commit": "<the full 40-character commit the tag points at>"
    }
  }
}
```

### 4. Finding new skill versions

Whether and how new skill versions are found. For example, a scheduled GitHub Action that lists `split/<skill>/v*` tags in `claude-skills` and opens a PR with the update, or doing it by hand.

**Recommended, not decided: by hand.** The user decides when a skill update goes into the plugin, and with it when the plugin releases. A read-only helper, `pnpm skills:outdated`, lists newer `split/<skill>/v*` tags for each skill in `skills.lock.json`, without changing anything.

### 5. Checking vendored files

Whether the plugin's CI checks that each vendored `skills/<skill>/` matches exactly the split tag it pins, so vendored skill files can't be edited by hand.

**Recommended, not decided:** yes, in CI and in a pre-commit hook. A split commit's tree is exactly the skill folder. So the check compares the git tree of `skills/<skill>/` in the plugin with the tree of the commit pinned in `skills.lock.json`, and fails on any difference. That also stops a development copy (item 9) from being committed by accident.

### 6. The plugin's CI and releases

- the tooling for the plugin's own version and releases;
- how much the plugin's version changes when a skill version changes. Discussed: as much as the skill changed, so a skill `fix` → patch, a skill `feat` → minor, a breaking skill change → major;
- whether the plugin's changelog lists the pinned skill versions per release.

**Recommended, not decided:** release-please in its normal single-component mode, running on `develop` (see item 8).
- It collects releasable commits in one release PR into `develop`: `feat` → minor, `fix` → patch, `!` or `BREAKING CHANGE` → major. Commits of type `chore`, `ci`, `build`, `docs` and `test` don't bump the version.
- The release PR updates `version` in `.claude-plugin/plugin.json` and `CHANGELOG.md`. Merging it is the release: it creates the tag `vX.Y.Z`, and `main` is fast-forwarded to it.
- A skill update's commit type sets how much the plugin's version changes.
- Unverified: whether release-please's JSON updater (`extra-files` with `jsonpath: $.version`) updates `.claude-plugin/plugin.json`.

### 7. Tests and evals inside the plugin

A split brings each skill's `tests/` and `evals/`, including fixture projects with their own `.claude/` folder, as in `create-plan`'s `evals/files/notes-cli/`. Open: whether they ship inside the plugin as they are, or are removed when skills are vendored.

### 8. Branch model

How changes reach users, and which branch installs come from.

**Facts that bear on it** (Plugin loading reference, § Versions and updates; Marketplace reference, § Plugin sources and § Marketplace sources):
- `claude plugin marketplace add iamchriswick/claude-plugin-pro-tools` registers a `github` marketplace source whose `ref` defaults to the repository's default branch. A plugin listed with a relative path is installed from that clone. Claude Code doesn't read git tags or GitHub releases.
- If `.claude-plugin/plugin.json` sets `version`, users who already have the plugin stay on their cached copy until that string changes: "a manifest that pins `"version": "1.0.0"` keeps every user on the cached copy until its author changes the string, however many commits they push".
- A fresh install has no cached copy, so it gets whatever the default branch holds at that moment.

So whatever lands on the default branch reaches new installs at once, released or not.

**Recommended, not decided:** `main` is the release branch and stays the default branch. `develop` is where the work happens.
- Work branches are cut from `develop` with Conventional Branch names.
- Changes to what users get, meaning `skills/` and the components `plugin.json` declares, go into `develop` through a PR with CI. Tooling, CI and docs are pushed to `develop` directly.
- PRs are merged with merge commits, which keeps the per-task commits.
- release-please runs on `develop` (`target-branch: develop`) and opens its release PR into `develop`. Merging it is the release and creates the tag `vX.Y.Z` (item 6).
- The release workflow then fast-forwards `main` to that tag. Nothing else ever lands on `main`, so `main` always equals the latest release.
- `claude plugin marketplace add iamchriswick/claude-plugin-pro-tools` therefore always installs the latest release. Unreleased work on `develop` never reaches a fresh install.

**Installing a specific version.** The Marketplace reference documents `owner/repo@ref` and `owner/repo#ref` for `claude plugin marketplace add`. So `claude plugin marketplace add iamchriswick/claude-plugin-pro-tools@v0.1.0` installs the plugin as it was at release `v0.1.0`, even after `v0.2.0` exists.
- The user stays on that version and gets no updates. Changing versions means removing the marketplace and adding it again with another tag.
- Each marketplace name can be registered only once per user, so two versions can't be installed side by side.
- It works for every release tag, because each one points at a commit on `main` that contains `marketplace.json` and the plugin.

Unverified:
- that release-please works with `target-branch: develop` in this setup;
- that the release workflow's fast-forward push to `main` gets through the repository's rulesets with its token;
- that installing with `@<tag>` works as documented.

**Reference.** `obra/superpowers`, checked on 2026-10-24:
- work branches go into `dev` through PRs, as merge commits (40 of the last 47 merged PRs);
- each release is one PR from `dev` into `main`, usually squashed (`Release vX.Y.Z: …`);
- small fixes sometimes go straight into `main` through a PR (for example #2049 and #2570);
- no commit on `main` arrived without a PR.

The recommendation follows the same idea: `main` is for releases only. Two differences: releases reach `main` by a fast-forward to the release tag instead of a squashed PR, and release-please creates the version.

**Alternatives considered:**
- **Only `main`, no `develop`:** fresh installs would get merged but unreleased changes under the old version number.
- **Pin the marketplace entry** with `"source": { "source": "github", "repo": …, "ref": "vX.Y.Z", "sha": … }`: the entry would need updating with every release.
- **Users pin the marketplace with `@<tag>`:** they never get updates.

### 9. Working on skills from the plugin project

How a skill gets fixed when testing it in the plugin shows a problem, for example that it doesn't fit with another skill, without opening `claude-skills` as a separate project.

**Recommended, not decided: a development clone of `claude-skills` inside the plugin project.**
1. **The clone.** `pnpm dev:setup` clones `iamchriswick/claude-skills` into `.dev/claude-skills/`. `.dev/` is in `.gitignore`, so the clone never becomes part of the plugin repository and never reaches users. It's a normal, standalone `claude-skills` repository with its own branches, hooks and `CLAUDE.md`.
2. **Access from the plugin session.** The plugin's `.claude/settings.json` lists `.dev/claude-skills` in `permissions.additionalDirectories`. A Claude Code session opened in `claude-plugin-pro-tools` can then read and edit files there and run git and `pnpm` in it.
3. **The development loop, all from the plugin project:**
   1. Fix the skill in `.dev/claude-skills/skills/<skill>/`, on a skill branch there, for example `bugfix/create-plan-<desc>`.
   2. Run `pnpm skills:dev <skill>`, which copies that working state into the plugin's `skills/<skill>/`, uncommitted, so it can be tried alongside the plugin's other skills.
   3. When it fits, in `.dev/claude-skills`: run the skill-creator evaluation, then the PR and the release, all under `claude-skills`' own `CLAUDE.md`.
   4. Run `pnpm skills:vendor <skill> <new version>` in the plugin, which brings in the released version and replaces the development copy.
4. **The safety net.** The check in item 5 makes sure only the pinned, released version of a skill can be committed in the plugin.

**Where commits happen.** Commits to a skill happen only in the clone `.dev/claude-skills`, a separate repository chosen for that purpose. The plugin's own files and plans stay in the plugin repository only.

## To verify in the plugin project

None of these was tried in `claude-skills`. Each must be checked in the plugin project before the design depends on it.

| # | To verify | Item |
|---|---|---|
| V1 | release-please's JSON updater (`extra-files` with `jsonpath: $.version`) updates `version` in `.claude-plugin/plugin.json` | 6 |
| V2 | release-please works with `target-branch: develop`: the release PR goes into `develop` and the tag `vX.Y.Z` is created there | 6, 8 |
| V3 | The release workflow's fast-forward push of `main` to the release tag gets through the repository's rulesets with its token | 8 |
| V4 | `claude plugin marketplace add iamchriswick/claude-plugin-pro-tools@<tag>` installs exactly that release | 8 |
| V5 | `"name": "protools"` passes `claude plugin validate`, and skills load as `/protools:<skill-name>` | 1 |
| V6 | `pnpm skills:vendor` can fetch one split tag on its own, for example with a shallow fetch, and its tree matches the skill folder exactly | 2, 5 |
| V7 | `permissions.additionalDirectories` accepts the relative path `.dev/claude-skills`, and a session in the plugin project can edit files and run git and `pnpm` there | 9 |
| V8 | Whether `claude-skills`' `CLAUDE.md` is loaded automatically for the additional directory, or needs a setting or environment variable. Its rules (branches, PRs, the evaluation gate) must apply to work in the clone | 9 |
| V9 | A skill-creator evaluation runs correctly for a skill in the additional directory, and `pnpm eval:record` works there | 9 |
| V10 | A skill-creator evaluation of a vendored skill runs from the plugin workspace's root, with the plugin's other skills present | Known gap |

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
- [Plugin loading reference, Claude Code Docs](https://code.claude.com/docs/en/plugins/loading.md), for marketplace source types including `git-subdir`, and for how a pinned `version` holds users on their cached copy
- [Marketplace reference, Claude Code Docs](https://code.claude.com/docs/en/plugins/marketplace-reference.md), for plugin and marketplace sources, `ref`/`sha`, and `owner/repo@ref`
- `obra/superpowers` on GitHub, branches, PRs and `main`'s history, checked with `gh api` on 2026-10-24
- [Skills: run evals with skill-creator, Claude Code Docs](https://code.claude.com/docs/en/skills#run-evals-with-skill-creator)
- [Evaluating skill output quality, agentskills.io](https://agentskills.io/skill-creation/evaluating-skills)
