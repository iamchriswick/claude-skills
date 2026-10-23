# Release setup for claude-skills: design

Date: 2026-10-23
Status: draft, for review

## Goal

Every skill in `skills/<skill-name>/` is developed, tested and released on its own. A skill only gets a release tag after it has passed all its tests in this repository. Consumers can then trust a tag without testing again:

- `npx skills add iamchriswick/claude-skills --skill <skill-name>` installs from `main`.
- A later plugin repository, `iamchriswick/my-claude-plugin`, pins a released version of each skill it uses.

## Decisions

| Topic | Decision | Source |
|---|---|---|
| Branch model | GitHub flow: `main` is the only long-lived branch. No `develop` | User, 2026-10-23 |
| Reaching `main` | Skill branches: pull request on GitHub, CI must pass, merged with a merge commit. Repository branches: merged locally with a merge commit and pushed by the agent; the owner may bypass `main`'s protection | User, 2026-10-23 |
| Versions | One version per skill, released and tagged on its own | User, 2026-10-23 |
| First version | `0.1.0` for each skill | User, 2026-10-23 |
| Commit messages | Conventional Commits with `@commitlint/config-conventional`'s 11 types; `fix` is the only fix type | User, 2026-10-23 |
| Local hook | Husky and commitlint check every commit message | User, 2026-10-23 |
| Behavior tests | Agent Skills `evals/evals.json` inside each skill, run with skill-creator in this repo before a release | User, 2026-10-23 |
| Plugin repo | Trusts release tags and doesn't retest. Out of scope here | User, 2026-10-23 |

## 1. Branches and the release flow

```
<type>/<skill-name>-<desc> ──PR (merge commit)──▶ main
                                                   │ release-please reads the new commits
                                                   ▼
                                    release PR per skill (version + CHANGELOG)
                                                   │ merged when CI passes
                                                   ▼
                     tag <skill-name>-vX.Y.Z on main + GitHub release
                                                   │ release job
                                                   ▼
               git subtree split --prefix=skills/<skill-name>
               → branch split/<skill-name> + tag split/<skill-name>/vX.Y.Z
```

- **Branches** are cut from `main` and follow Conventional Branch naming:
  - `<type>/<skill-name>-<desc>` for work on one skill, for example `feat/create-plan-detail-tasks`;
  - `<type>/<desc>` for repository work, for example `chore/release-setup`;
  - `<type>` is `feat`, `bugfix`, `hotfix` or `chore`.

  `hotfix/` only marks urgency. It follows the same path as every other branch.
- **Merge commits:** every commit on a branch lands on `main`. This keeps create-plan's per-task commits, and release-please reads each one.
- **Repository branches** (`<type>/<desc>`, no changes under `skills/`) are merged into `main` locally with `--no-ff` and pushed after `pnpm test` passes. Every branch that changes `skills/` goes through a pull request.
- **Versioning:** release-please (`googleapis/release-please-action`) runs in manifest mode with one component per `skills/<skill-name>/`.
  - **Which skill a commit belongs to:** decided by the paths it touches. The commit scope is for readers.
  - **Bumps:** `feat` → minor, `fix` → patch, `!` or `BREAKING CHANGE:` → major. Other types don't bump.
  - **Release PRs:** one per skill (`separate-pull-requests: true`). Merging it creates the tag `<skill-name>-vX.Y.Z` and a GitHub release.
- **Split for consumers:** after a skill is released, the release job runs `git subtree split --prefix=skills/<skill-name>` from the tagged commit. It pushes the branch `split/<skill-name>` and the tag `split/<skill-name>/vX.Y.Z`. The split contains only the skill folder, at its root. CI is the only thing that writes to it.
- **What `npx skills add` users get:** they always install from `main`. The skills CLI (v1.7.4) has no way to pin a version or ref, so a merge to `main` is live for them immediately. Only reviewed, tested work reaches `main`.

## 2. Commit messages and the local hook

- **Format:** `type(scope): summary`.
  - **Types:** `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`.
  - **Scope:** optional. When given, it must be a folder name under `skills/`, read at check time, or one of `repo`, `ci`, `deps`, `release` and `main`. release-please writes its own commits with the `main` scope.
  - Merge commits are skipped (commitlint's default).
- **Files:**
  - `package.json`: `private: true`, `packageManager` pinned to the pnpm version in use, dev dependencies only, and the scripts `prepare: husky` and `test: vitest run`;
  - `pnpm-lock.yaml`;
  - `commitlint.config.js`: extends `@commitlint/config-conventional` and adds the dynamic `scope-enum`;
  - `.husky/commit-msg`: `pnpm exec commitlint --edit "$1"`;
  - `.husky/pre-push`: `node scripts/check-benchmarks.mjs`, the same benchmark check CI runs. A branch with a skill change that hasn't been evaluated can't be pushed.
- **Dev container:** `postCreateCommand: pnpm install`, so the hook is active in every new container.
- **Version metadata in each skill:**
  - `SKILL.md` frontmatter carries `metadata.version`. release-please updates it through a generic `extra-files` entry marked `x-release-please-version`.
  - Each skill has its own `CHANGELOG.md`.
  - The first plan task verifies that the generic updater can update a YAML frontmatter line. If it can't, the version moves to `skills/<skill-name>/version.txt`.

## 3. Tests, CI and release

### Tests live inside each skill

```
skills/<skill-name>/
├── SKILL.md
├── <supporting files>
├── CHANGELOG.md
├── tests/                 # static checks, Vitest
│   └── *.test.ts
└── evals/
    ├── evals.json         # behavior tests, Agent Skills format
    ├── files/             # fixture files the cases use
    ├── benchmark.json     # copied from the latest skill-creator run
    └── benchmark.meta.json
```

The tests travel with the skill: into the subtree split, into `npx skills add` installs, and into a plugin that vendors the skill. Claude Code doesn't load them into context unless `SKILL.md` refers to them.

**Static checks (Vitest):**
- **Shared, in the root `tests/skills.test.ts`, for every folder under `skills/`:**
  - `SKILL.md` exists;
  - its frontmatter is valid YAML;
  - `name` matches the folder and uses only lowercase letters, digits and hyphens;
  - `description` is present and 1024 characters or fewer;
  - every file `SKILL.md` links to exists;
  - `evals/evals.json` exists and is valid against the Agent Skills format.
- **Skill-specific, in `skills/<skill-name>/tests/`.** For `create-plan`:
  - `plan-template.md` contains the title pattern and exactly the three top-level sections;
  - each task kind in the template shows its required fields.

**Behavior tests (skill-creator):**
- Written in `evals/evals.json`: realistic prompts, expected output, fixture files and assertions.
- Run in this repository, in a normal Claude Code session, with the `skill-creator` plugin (`skill-creator@claude-plugins-official`). Each case runs once with the skill and once without it.
- **When:** as the last step before merging any branch that changes `skills/<skill-name>/`. The user starts it (`evaluate my <skill-name> skill with skill-creator`), or the agent asks the user whether to run it. The agent never starts an evaluation on its own.
- **Two phases:**
  1. **Writing test cases with the user.** The plugin walks through the cases in `evals/evals.json`. This happens the first time a skill is evaluated, and when a change adds behavior the existing cases don't cover.
  2. **Running the loop.** The plugin runs, grades and opens the review viewer. If the result isn't good enough, the skill is improved and the loop runs again.
- **Recording the result:** `pnpm eval:record <skill-name> <iteration-dir>` copies the run's `benchmark.json` to `skills/<skill-name>/evals/benchmark.json` and writes `benchmark.meta.json`. The agent commits both. `benchmark.meta.json` stores:
  - `skill_sha256`: a hash over every file in the skill folder except `evals/`, `tests/`, `CHANGELOG.md` and the `metadata.version` line;
  - the run date and the skill-creator iteration number;
  - the pass threshold the run was held to.
- **What it doesn't cover:** single skills only. Two skills interfering inside one plugin isn't tested.
- **For `create-plan`,** the first suite turns the scenarios from its creation into `evals.json` cases:
  - a request covering several features;
  - a single bugfix;
  - a plan built from a spec;
  - a vague request;
  - a plan file outside the repository;
  - the "don't ask" pressure case.

### CI: `.github/workflows/ci.yml` on every pull request into `main`

1. **commitlint:** checks every commit in the PR range.
2. **Vitest:** `pnpm test`, covering the shared and skill-specific static checks.
3. **Benchmark check:** `node scripts/check-benchmarks.mjs`, free and deterministic. For each skill whose files the PR changes:
   - `benchmark.meta.json` exists, and its `skill_sha256` equals the hash of the skill as it is in the PR;
   - `benchmark.json` shows a with-skill pass rate of at least `0.9`;
   - the with-skill pass rate is above the without-skill pass rate.

   A PR that changes a skill without re-running its evals fails this check.

No model runs in CI and no Anthropic key is needed.

### Release: `.github/workflows/release.yml` on every push to `main`

1. **release-please** opens or updates one release PR per skill. Because CI must pass before a release PR can merge, a skill whose checks fail can't be released.
2. **Split:** for each skill release created, the job:
   - checks out the tagged commit;
   - runs `git subtree split --prefix=skills/<skill-name>`;
   - force-pushes `split/<skill-name>` with lease;
   - pushes the tag `split/<skill-name>/vX.Y.Z`.

The release workflow uses a GitHub App token or a fine-grained personal access token, with contents and pull requests read and write, instead of `GITHUB_TOKEN`. Otherwise its release PRs wouldn't trigger CI. The token is a repository secret.

### Repository instructions: `CLAUDE.md`

A root `CLAUDE.md` records the conventions agents follow here, so create-plan and other skills can rely on them:
- `main` is the base branch, and the branch names and commit format above apply;
- skill branches through PRs and repository branches merged locally, both with merge commits; `main` is protected;
- the commands: `pnpm install`, `pnpm test`, and the benchmark check;
- the agent never opens or merges a PR for a branch that changes a skill until that skill has been evaluated. When the user says the branch is ready to merge, the agent asks whether to run `evaluate my <skill-name> skill with skill-creator`. It never starts an evaluation on its own, and records the result with `pnpm eval:record`;
- the rule that the eval workspace (`skills/*-workspace/`) is never committed.

### Ignored files

The `.gitignore` adds:
- `node_modules/`;
- `skills/*-workspace/`, which skill-creator creates next to the skill folder;
- `**/evals/results/`.

## Moving the current branches over

`develop` is retired. Nothing has been pushed except the initial commit on `origin/main`.

1. Fast-forward `main` to `develop`. That brings in `.gitignore`, `LICENSE`, `.devcontainer/devcontainer.json` and `.claude/settings.json`.
2. Push `main`, the only direct push. Protection is turned on afterwards.
3. Delete `develop`, locally and on the remote if it's there.
4. Rebase `feat/create-plan-skill` and `chore/release-setup` onto `main`.
5. Open the release-setup PR first, so CI and the release job exist before the first skill PR. `create-plan` then gets its eval suite and goes in as its own PR, with `0.1.0` as its first release.

## Steps only the user can do

- **Protect `main`** on GitHub: require a PR and the CI checks, block force pushes, and allow administrators to bypass the rule so repository work can be pushed directly.
- **Create the release token** (a GitHub App or a fine-grained personal access token) and save it as a repository secret.
- **Approve and merge** each release PR.

## Not in scope

- The plugin repository `iamchriswick/my-claude-plugin`: its lock file, how it pulls skills in (subtree, or a marketplace `git-subdir` source), its own version and CI.
- Running behavior evals in CI with `claude plugin eval`. Probe results, 2026-10-23:
  - it works on a skill folder when targeting a case file;
  - its runs can't write under `.claude/`, which blocks create-plan's plan-writing step;
  - `--eval-dir` can't point inside `skills/`.
- New skills beyond `create-plan`.
- Listing the skills on a public skills directory.

## Risks

| Risk | Guard |
|---|---|
| A skill change merges without fresh evals | The benchmark check compares the hash of the skill files with `benchmark.meta.json` |
| A benchmark is edited by hand to pass | Reviewing the PR. CI can't tell a real `benchmark.json` from an edited one |
| The release PR's version bump changes the skill hash | The hash leaves out `CHANGELOG.md` and the `metadata.version` line |
| A merge to `main` is live for `npx` users before its release is tagged | CI gates every PR. The release tag matters to version-pinning consumers |
| release-please can't update YAML frontmatter | Verified in the first task. The fallback is `version.txt` |
| skill-creator's `benchmark.json` fields differ from the agentskills.io example (`run_summary.with_skill.pass_rate.mean`) | The first eval task checks the file a real run produces before `check-benchmarks.mjs` is written against it |
| skill-creator's subagent runs can't write `create-plan`'s plan file under `.claude/` | Checked in the first `create-plan` eval run. If writes are blocked, those cases assert the plan in the final message instead |
| A split branch is rewritten wrongly | Only the release job writes it, from a tagged commit |

## Sources

- [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
- [Conventional Branch](https://conventionalbranch.org/)
- [`@commitlint/config-conventional`](https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/config-conventional/src/index.ts)
- [Evaluating skill output quality, agentskills.io](https://agentskills.io/skill-creation/evaluating-skills)
- [Skills: run evals with skill-creator, Claude Code Docs](https://code.claude.com/docs/en/skills#run-evals-with-skill-creator)
- [Test plugins with evals, Claude Code Docs](https://code.claude.com/docs/en/plugin-evals)
- `npx skills --help` (skills CLI 1.7.4), run 2026-10-23
