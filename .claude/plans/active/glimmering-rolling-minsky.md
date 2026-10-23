# Plan: Release setup for claude-skills (from docs/superpowers/specs/2026-10-23-release-setup-design.md, 2026-10-23)

## How to use this plan (read first, every session)

The plan is the whole goal. Its tasks are grouped by branch and numbered by group: `T<group>.<n>`, for example T1.3 is the third task of branch group 1. Read this header and Context once per session; then read the active branch group's context and the active task. Don't read other tasks or whole areas of the codebase. Within a branch group, continue to the next task in the same session; after a group is merged, the handover suggests `/clear`. The repository has no `CLAUDE.md` until T1.7 writes it. Until then, the conventions under Context → Constraints apply. After T1.7, `CLAUDE.md` applies at all times, and this header adds the plan rules.

### Before starting a task

1. Announce the task in one line.
2. Confirm three things, and if anything else differs, stop and tell the user:
   - you are on the branch the task names as its start;
   - the working tree is clean;
   - the previous task's heading is ticked `[x]`.

   Exceptions:
   - T1.1 starts with one uncommitted change, to `.claude/settings.json`, which T1.1 itself restores.
   - Before T1.2, the plan file isn't committed yet.
   - After a user step, its tick isn't committed yet.
3. After every branch switch, run `pnpm install` before anything else. This applies from T1.2 on, the task that adds `package.json`.
4. Review the task's Interfaces, Change, Verify and, if present, Tests.

### While working

1. Read each file you change once, right before changing it.
2. Run `pnpm test` once, as one command, and read the result once. This applies from T1.3 on, the task that adds the command. Before T1.3, run only the commands the task names.
3. Do not treat assumptions as established requirements.
4. If the work must depart from the plan, stop and ask the user. Once the user agrees, record the change in the plan, either in the task or under Context → Decided, as part of this task's commit.

### Before completing a task

1. Check the result against every pass criterion in the task's Verify or Tests.
2. Tick the task in the plan: change its heading's `[ ]` to `[x]`. Add any note the next task needs, including unresolved issues, in Conventional Comments format (`<label> [decorations]: <subject>`), for example `issue (blocking): <subject>` or `note: <subject>`.
3. Make one commit with the code and the plan file together, using the task's message and ending with the Co-Authored-By line the system asks for. The commit itself is the record of the task; there is no hash in the tick.
   - **Hooks:** from T1.2 on, the `commit-msg` hook checks every message, and from T1.4 on, the `pre-push` hook checks every push. If a hook rejects a commit or push, fix what it reports and try again. Never bypass a hook (`--no-verify`). Files a hook reformats belong to the same commit.
   - **No commit of its own:** a user step, and a task that says so, have no commit. Their tick goes into the next task's commit.
4. Stop; don't start the next task. Except in the plan's last task, the last thing in the final message is this fenced block, with the next task's number. After a group's last task, put "Run `/clear`, then:" above it.

   ```text
   Do task T<next> from .claude/plans/active/glimmering-rolling-minsky.md
   ```

### At all times

#### Testing

- Run the tests a task names yourself, with `pnpm test`. A command that doesn't exist yet on the current branch isn't run. Read each summary once.
- If a test fails, stop and report it; don't fix anything the task doesn't name.
- Never change an existing assertion (an `expect` or `assert` line).

#### Git

- Use only the branch your task's group names. Never commit to, merge into or push `main`. The one exception is T1.1's single direct push of `main`, which it makes after the user agrees. After that, changes reach `main` only through a pull request that the user merges on GitHub with "Create a merge commit".
- Push only where a task says so.
- **Group 2 runs in the worktree `/workspaces/claude-skills-create-plan`,** where `feat/create-plan-skill` is checked out. That branch can't be checked out in `/workspaces/claude-skills` too.

#### User steps

A task marked **User step** is done by the user, never by you: give its instructions, wait until the user confirms it's done, check what its Done when names, then tick it.

#### Skill evaluations

Never start a skill-creator evaluation on your own. When a task needs one, ask the user whether to run `evaluate my <skill-name> skill with skill-creator`, and run it only on yes.

#### Unclear or mismatched tasks

If something in a task is unclear or doesn't match the code or the sources, stop and ask the user:

- Don't improvise.
- Don't do anything the task doesn't give you:
  - no extra branches
  - no extra commits
  - no extra merges or pushes
  - no extra config
  - no extra memory changes.
- Untracked files you didn't create: don't change, stage, or delete them; ask the user what to do with them.

## Context

### Goal

Every skill under `skills/<skill-name>/` is developed, tested and released on its own. A skill gets a release tag only after it passes all its tests in this repository. Consumers install from `main` with `npx skills add`, or pin a release tag, without testing again.

### Source

- **The user's request:** `/create-plan` for "write the implementation plan" of the release setup design (user, 2026-10-23).
- **`docs/superpowers/specs/2026-10-23-release-setup-design.md`:** the plan implements all of it:
  - § Decisions;
  - § 1 Branches and the release flow;
  - § 2 Commit messages and the local hook;
  - § 3 Tests, CI and release;
  - § Moving the current branches over;
  - § Steps only the user can do.

  Its § Not in scope stays out of scope.

### State confirmed (2026-10-23), before T1.1

- **`main`:** `git rev-parse main` and `git ls-remote origin` both show `7fb15b8` (Initial commit). `origin` is `https://github.com/iamchriswick/claude-skills.git`, a public repo with `main` as its default branch (`gh repo view`).
- **`develop`:** at `ea77c02`. `git merge-base --is-ancestor main develop` succeeds, so `main` can fast-forward to it.
- **`chore/release-setup`:** at `8146df6`, three commits on top of `develop`:
  - `33b2d76` the spec;
  - `150ae44` the evaluation gate;
  - `8146df6` `plansDirectory`.
- **`feat/create-plan-skill`:** at `427947c`, four commits on top of `7fb15b8`. It's checked out in the worktree `/workspaces/claude-skills-create-plan` (`git worktree list`). Its `.gitignore` is identical to `develop`'s (`git diff develop feat/create-plan-skill -- .gitignore` is empty). `~/.claude/skills/create-plan` links to `/workspaces/claude-skills-create-plan/skills/create-plan`.
- **Working tree:** `.claude/settings.json` has an uncommitted change setting `"plansDirectory": ".claude/plans/active/"`. The committed value, in `8146df6`, is `"./.claude/plans/active"`.
- **No `CLAUDE.md`** exists on any branch.
- **Tracked files on `chore/release-setup`:**
  - `.claude/settings.json`
  - `.devcontainer/devcontainer.json`
  - `.gitignore`
  - `LICENSE`
  - `docs/superpowers/specs/2026-10-23-release-setup-design.md`
- **`.gitignore:1-2`:** `.devcontainer/devcontainer-lock.json` and `drafts/`.
- **`.devcontainer/devcontainer.json:45-47`:** a `postCreateCommand` already exists: `"sudo chown -R node:node /home/node/.claude"`.
- **Tools:**
  - Node `v24.16.0`;
  - pnpm `11.7.0`. pnpm 11 refuses dependency build scripts until they're allowed: `ERR_PNPM_IGNORED_BUILDS` for `esbuild`, seen in a test run on 2026-10-23;
  - `gh` signed in as `iamchriswick`;
  - `git subtree` isn't installed in this container (`git subtree --help` fails).

### Decided (user, 2026-10-23)

These come from the spec's § Decisions, plus the user's answers when this plan was made:

- **Branch model:** GitHub flow. `main` is the only long-lived branch and `develop` is retired. Changes reach `main` through a PR that the **user** merges on GitHub with "Create a merge commit". The agent pushes the branch, opens the PR with `gh`, and stops (user, 2026-10-23).
- **Versions:** one version per skill, starting at `0.1.0`. Tags are `<skill-name>-vX.Y.Z`, and split tags are `split/<skill-name>/vX.Y.Z` (spec § 1).
- **Commits and hooks:** Conventional Commits with `@commitlint/config-conventional`'s types. The allowed scopes are the folder names under `skills/` plus `repo`, `ci`, `deps`, `release` and `main`. Husky runs commitlint on every commit (spec § 2).
- **`plansDirectory`** stays relative, `./.claude/plans/active` (user, 2026-10-23). T1.1 discards the uncommitted absolute value.
- **Benchmark check:** `scripts/check-benchmarks.mjs` and `pnpm eval:record` are written in group 1 against the format agentskills.io documents: `run_summary.with_skill.pass_rate.mean` and `run_summary.without_skill.pass_rate.mean`. Group 2 checks them against the first real skill-creator run and fixes them there if they differ (user, 2026-10-23).
- **Release token:** a fine-grained personal access token, limited to this repo, with Contents and Pull requests read and write, saved as the repository secret `RELEASE_TOKEN` (user, 2026-10-23).
- **Evaluations:** started by the user, or asked for by the agent before a skill branch is merged, never by the agent alone. There are two phases: writing test cases with the user, then running the loop (spec § 3).

Planning decisions, not from the sources or the user:

- **Group 1 reuses the existing branch `chore/release-setup`,** which already holds the spec. Group 2 reuses `feat/create-plan-skill`.
- **pnpm build scripts:** `pnpm-workspace.yaml` allows esbuild's build script (`allowBuilds: { esbuild: true }`), so that `pnpm install` works under pnpm 11.7.0.
- **The dev container's `postCreateCommand`** becomes `sudo chown -R node:node /home/node/.claude && pnpm install`. The existing `chown` is kept and `pnpm install` is appended.
- **Scripts:** the skill hash lives in `scripts/skill-hash.mjs`, which both `scripts/check-benchmarks.mjs` and `scripts/eval-record.mjs` use. Each script exports its functions for Vitest and runs as a command when called directly.
- **The hash:** SHA-256 over every file in `skills/<name>/` except the top-level `evals/`, `tests/` and `CHANGELOG.md`. Files are taken in sorted path order, and each contributes `path\0content\0`. In `SKILL.md`, every line containing `x-release-please-version` is removed before hashing.
- **`pnpm eval:record`** refuses to record a run that is below the threshold or doesn't beat the without-skill score. So a failing benchmark is never committed.
- **Which skills a PR changes:** the benchmark check works this out with `git diff --name-only $(git merge-base <base> HEAD) HEAD -- skills/`. `<base>` comes from `BASE_REF`, which defaults to `origin/main`. Skills whose `SKILL.md` no longer exists are skipped.
- **The release workflow** runs release-please only when at least one `skills/*/SKILL.md` exists, so `main` without skills doesn't fail the job.
- **"Allow GitHub Actions to create pull requests"** (spec § Steps only the user can do) isn't needed: release PRs are created with `RELEASE_TOKEN`, not `GITHUB_TOKEN`. The spec needs the same change.
- **The CI jobs** are named `commitlint`, `test` and `benchmarks`. These are the names `main`'s protection requires.
- **Merged branches** `chore/project-setup` and `chore/claude` stay untouched. Only `develop` is deleted (spec § Moving the current branches over).

### Constraints

- **Base branch:** `main`. Every group branch is cut from it (spec § 1).
- **Branch names:** `<type>/<skill-name>-<desc>` or `<type>/<desc>`, where `<type>` is `feat`, `bugfix`, `hotfix` or `chore` (spec § 1).
- **Commit format:** `type(scope): summary`, with the types `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style` and `test` (spec § 2).
- **Commit scopes:** a folder name under `skills/`, or one of `repo`, `ci`, `deps`, `release` and `main` (spec § 2).
- **pnpm version:** `packageManager` is `pnpm@11.7.0`, the version in use.
- **Benchmark threshold:** the with-skill pass rate is at least `0.9` and higher than the without-skill pass rate (spec § 3).
- **Never committed:** `node_modules/`, `skills/*-workspace/` and `**/evals/results/` (spec § 3, Ignored files).

### Already in place and reused

- **`.claude/settings.json`** at `8146df6`: `plansDirectory` and the enabled superpowers plugin.
- **`.gitignore:1-2`:** extended, not replaced.
- **`.devcontainer/devcontainer.json`:** its features already install Python, `gh` and Claude Code (`:14-21`), and its `postCreateCommand` (`:47`) is extended.
- **`skills/create-plan/SKILL.md` and `plan-template.md`** on `feat/create-plan-skill`: group 2 adds tests and evals to them and doesn't change their instructions.

### Not in scope

- **The plugin repository `iamchriswick/my-claude-plugin`:** its lock file, how it pulls skills in, its own version and CI.
- **`claude plugin eval` in CI** (spec § Not in scope).
- **Skills other than `create-plan`,** and listing skills on a public skills directory.
- **Deleting `chore/project-setup` and `chore/claude`.**
- **`main`'s protection settings and release PRs:** they're changed only by the user, through the user steps.

### Risks

- **The direct push of `main` in T1.1 can't be undone without a force push.** T1.1 asks the user first and checks that `main` fast-forwards (`--ff-only`).
- **release-please's generic updater may not update a YAML frontmatter line.** T1.5 tests it on a sample before anything depends on it. If it fails, group 2 keeps the version in `skills/create-plan/version.txt` instead, as the spec's fallback says.
- **The real `benchmark.json` may not match the documented format.** Group 2's Detail task checks it against the first real run.
- **`git subtree` may be missing on GitHub's `ubuntu-latest` runner.** `scripts/split-released.mjs` checks for it and fails with a clear message. The first real release, in group 2, shows whether it works.
- **pnpm 11 build-script approval:** T1.3 allows esbuild in `pnpm-workspace.yaml`, and its Verify runs a clean install.
- **Branch protection needs the CI check names, which only appear after one CI run.** The protection user step, T1.9, comes after T1.8 has opened the PR and CI has run.

### Expected result

- `main` contains:
  - the hooks;
  - the Vitest checks;
  - the benchmark scripts;
  - `ci.yml` and `release.yml`;
  - `release-please-config.json` and its manifest;
  - `CLAUDE.md`;
  - `create-plan` with its tests and evals.
- Every PR into `main` runs `commitlint`, `test` and `benchmarks`. The user merges it.
- `create-plan` is released as `create-plan-v0.1.0`, with a GitHub release, a `split/create-plan` branch and a `split/create-plan/v0.1.0` tag holding only the skill folder.
- `develop` no longer exists.

### Branch groups

1. `chore/release-setup`: retire `develop` and add the release, test and hook setup. Gate: the PR's `commitlint`, `test` and `benchmarks` checks pass, and the user merges it. Detailed.
2. `feat/create-plan-skill`: give `create-plan` its tests, evals and version metadata, and release it as `0.1.0`. Gate: `create-plan-v0.1.0` and `split/create-plan/v0.1.0` exist on `origin`. Detailed by T2.0, because it builds on group 1's scripts, CI and release-please config.

## Tasks

### Branch group 1: `chore/release-setup`

**Goal:** after this group, `main` has the GitHub-flow tooling. That is:
- local commit and push checks;
- static skill checks;
- the benchmark gate;
- CI on every PR;
- per-skill releases with subtree splits;
- the repository's `CLAUDE.md`.

It also retires `develop`, as spec § Moving the current branches over describes.

**Covers:** spec § 1, § 2, § 3 (except `create-plan`'s own tests and evals), § Moving the current branches over, steps 1–4, and § Steps only the user can do.

**Gate:** on the group's PR, the `commitlint`, `test` and `benchmarks` checks pass, and the user merges it.

**Tests:**
- Vitest tests in `tests/`, run with `pnpm test`:
  - the shared skill checks;
  - `skill-hash`;
  - `check-benchmarks`;
  - `eval-record`;
  - the release outputs parser.
- The workflows themselves can only be checked on GitHub. `ci.yml` runs in T1.8. `release.yml` runs when the PR merges, and its release path runs in group 2.

#### [x] T1.1: Retire `develop` and bring `main` up to date

- **Start branch:** `chore/release-setup`. No commit of its own: the plan file is first committed in T1.2.
- **Files:** `.claude/settings.json` (uncommitted change discarded).
- **Change:**
  1. Run `git restore .claude/settings.json`. Then `git diff` is empty, and the file reads `"plansDirectory": "./.claude/plans/active"`.
  2. Ask the user: "T1.1 pushes `main` directly once, fast-forwarded to `develop` (`ea77c02`). OK?" Continue only on yes.
  3. Run `git switch main && git merge --ff-only develop && git push origin main`.
  4. Run `git branch -d develop`. Check `git ls-remote origin refs/heads/develop`: if it prints a line, run `git push origin --delete develop`.
  5. Run `git switch chore/release-setup`.
  6. Run `git -C /workspaces/claude-skills-create-plan rebase main`. Git drops `d52b8b0` (`chore: add .gitignore`), because `main` already has the same change.
- **Verify:**
  - `git ls-remote origin refs/heads/main` shows `ea77c02`;
  - `git branch --list develop` prints nothing;
  - `git merge-base --is-ancestor main chore/release-setup` succeeds;
  - `git log --oneline main..feat/create-plan-skill` shows exactly 3 commits: `feat(create-plan): add create-plan skill …`, `… state the required fields …` and `… ask only blockers …`;
  - `git status --short` is empty in both worktrees.

  If the fast-forward or the rebase fails, run `git merge --abort` or `git rebase --abort`, then stop and tell the user.
- **Report:** the new `origin/main` hash and the rebased `feat/create-plan-skill` log.

#### [x] T1.2: Check every commit message with Husky and commitlint

note: `pnpm add` doesn't run the root `prepare` script, and a later `pnpm install` that reports "Already up to date" skips it too. `core.hooksPath` was only set after `rm -rf node_modules && pnpm install`. A fresh clone or dev container gets the hooks normally.

- **Start branch:** `chore/release-setup`. The plan file is committed for the first time in this task's commit.
- **Files:**
  - `package.json` (new);
  - `pnpm-lock.yaml` (new);
  - `commitlint.config.js` (new);
  - `.husky/commit-msg` (new);
  - `.gitignore:1-2`;
  - `.devcontainer/devcontainer.json:45-47`.
- **Interfaces:**
  - Consumes: nothing.
  - Produces: `package.json` with `"type": "module"`, which T1.3 and T1.4 add scripts to, and the `commit-msg` hook.
- **Change:**
  1. `package.json` (new):

     ```json
     {
       "name": "claude-skills",
       "private": true,
       "type": "module",
       "packageManager": "pnpm@11.7.0",
       "scripts": {
         "prepare": "husky"
       }
     }
     ```

  2. Run `pnpm add -D husky @commitlint/cli @commitlint/config-conventional`. This adds `devDependencies`, writes `pnpm-lock.yaml`, and the `prepare` script sets `core.hooksPath` to `.husky/_`.
  3. `commitlint.config.js` (new):

     ```js
     import { existsSync, readdirSync } from "node:fs";

     const skillsDir = new URL("./skills/", import.meta.url);
     const skillScopes = existsSync(skillsDir)
       ? readdirSync(skillsDir, { withFileTypes: true })
           .filter((entry) => entry.isDirectory() && !entry.name.endsWith("-workspace"))
           .map((entry) => entry.name)
       : [];

     export default {
       extends: ["@commitlint/config-conventional"],
       rules: {
         "scope-enum": [2, "always", [...skillScopes, "repo", "ci", "deps", "release", "main"]],
       },
     };
     ```

  4. `.husky/commit-msg` (new, one line): `pnpm exec commitlint --edit "$1"`.
  5. `.gitignore`: append the line `node_modules/` after line 2. Nothing else changes.
  6. `.devcontainer/devcontainer.json`:
     - line 47 becomes `"postCreateCommand": "sudo chown -R node:node /home/node/.claude && pnpm install",`;
     - line 46's comment becomes `// A new volume is owned by root; this hands it to the "node" user so Claude Code can write to it, then installs the repo's dev dependencies, which also turns on its git hooks.`

     Nothing else in the file changes.
- **Commands:** `pnpm install`.
- **Verify:**
  - `echo "chore(repo): check" | pnpm exec commitlint` exits 0;
  - `echo "bad message" | pnpm exec commitlint` exits non-zero;
  - `echo "feat(unknown-scope): x" | pnpm exec commitlint` exits non-zero;
  - `git config core.hooksPath` prints `.husky/_`;
  - the task's own commit goes through the hook without errors.

  If any check fails, stop and tell the user.
- **Commit message:**

```text
build(repo): check commit messages with commitlint

Adds package.json, Husky and commitlint with the conventional types
and scopes limited to skill folders plus repo, ci, deps, release and
main. The dev container installs the hooks on creation.
```

#### [ ] T1.3: Check every skill's structure with Vitest

- **Start branch:** `chore/release-setup`.
- **Files:**
  - `pnpm-workspace.yaml` (new);
  - `vitest.config.ts` (new);
  - `tests/skills.test.ts` (new);
  - `package.json`;
  - `pnpm-lock.yaml`.
- **Interfaces:**
  - Consumes: `package.json` from T1.2.
  - Produces: the command `pnpm test`, and Vitest picking up `tests/**/*.test.ts` and `skills/*/tests/**/*.test.ts`. Group 2's skill tests rely on that pattern.
- **Change:**
  1. `pnpm-workspace.yaml` (new):

     ```yaml
     allowBuilds:
       esbuild: true
     ```

  2. Run `pnpm add -D vitest yaml`.
  3. `package.json`: add `"test": "vitest run"` to `scripts`. Nothing else changes by hand.
  4. `vitest.config.ts` (new):

     ```ts
     import { defineConfig } from "vitest/config";

     export default defineConfig({
       test: {
         include: ["tests/**/*.test.ts", "skills/*/tests/**/*.test.ts"],
         exclude: ["**/node_modules/**", "skills/*-workspace/**"],
       },
     });
     ```

  5. `tests/skills.test.ts` (new):
     - **Finding skills:** it lists every folder under `skills/`, except names ending in `-workspace`. If there's no `skills/` folder, it finds none.
     - **Always:** one test, `it("lists the skill folders")`, asserts that each folder name matches `/^[a-z0-9]+(-[a-z0-9]+)*$/`. It passes when there are no skills.
     - **Per skill,** a `describe(<name>)` with these tests:
       - `it("has a SKILL.md")`: `existsSync(skills/<name>/SKILL.md)` is true.
       - `it("has valid frontmatter")`: the text between the first two `---` lines parses with `parse` from `yaml`, without throwing, into an object.
       - `it("names the skill after its folder")`: `frontmatter.name` equals `<name>`.
       - `it("has a description within 1024 characters")`: `frontmatter.description` is a string with `1 <= length <= 1024`.
       - `it("links only to files that exist")`: take every Markdown link target `](<target>)` in `SKILL.md` that doesn't start with `http`, `https`, `mailto:` or `#`. Strip any `#…` anchor, resolve it against the skill folder, and `existsSync` it.
       - `it("has a valid evals/evals.json")`, checking the Agent Skills format:
         - the file exists and parses as JSON;
         - `skill_name` equals `<name>`;
         - `evals` is a non-empty array;
         - every entry has a numeric, unique `id`, a non-empty string `prompt` and a string `expected_output`;
         - `files`, when present, is an array of strings, each existing relative to the skill folder;
         - `assertions`, when present, is an array of non-empty strings.
- **Commands:** `rm -rf node_modules && pnpm install` (a clean install proves the esbuild allowance), then `pnpm test`.
- **Verify:**
  - the clean install exits 0;
  - `pnpm test` passes with 1 test, since there's no `skills/` yet;
  - then create a throwaway `skills/check-tmp/SKILL.md` whose frontmatter has `name: wrong`, and run `pnpm test`: the `names the skill after its folder` and `has a valid evals/evals.json` tests fail;
  - delete `skills/` again, and `git status --short` shows only this task's files.
- **Tests:** `tests/skills.test.ts` as above. Run `pnpm test` and read the summary. Affected: `tests/skills.test.ts`.
- **Commit message:**

```text
test(repo): check skill structure with vitest

Every skill folder must have a SKILL.md with valid frontmatter, a
name matching its folder, a description of at most 1024 characters,
existing link targets and a valid evals/evals.json.
```

#### [ ] T1.4: Gate skill changes on a recorded, passing benchmark

- **Start branch:** `chore/release-setup`.
- **Files:**
  - `scripts/skill-hash.mjs` (new);
  - `scripts/check-benchmarks.mjs` (new);
  - `scripts/eval-record.mjs` (new);
  - `.husky/pre-push` (new);
  - `tests/skill-hash.test.ts` (new);
  - `tests/check-benchmarks.test.ts` (new);
  - `tests/eval-record.test.ts` (new);
  - `package.json`;
  - `.gitignore`.
- **Interfaces:**
  - Consumes: `pnpm test` from T1.3.
  - Produces:
    - `skillFiles(skillDir: string): string[]` in `scripts/skill-hash.mjs`;
    - `skillHash(skillDir: string): string` in `scripts/skill-hash.mjs`, returning hex SHA-256;
    - `THRESHOLD = 0.9`, `checkSkill(skillDir: string): string[]` (a list of error messages, empty when the skill passes) and `changedSkills(repoRoot: string, baseRef: string): string[]` in `scripts/check-benchmarks.mjs`;
    - `recordEvaluation(repoRoot: string, skillName: string, iterationDir: string): object` in `scripts/eval-record.mjs`, returning the written meta;
    - the commands `pnpm run check:benchmarks` and `pnpm eval:record <skill-name> <iteration-dir>`.
- **Change:**
  1. `scripts/skill-hash.mjs`:
     - `skillFiles` walks `skillDir` recursively. It returns relative paths with `/` separators, sorted, and leaves out the top-level `evals/` and `tests/` folders and the top-level `CHANGELOG.md`.
     - `skillHash` feeds a SHA-256 hash, for each file in that order: the path, `\0`, the file's bytes, `\0`. For `SKILL.md`, it first removes every line matching `/^.*x-release-please-version.*$\n?/gm` and then hashes the remaining text as UTF-8.
  2. `scripts/check-benchmarks.mjs`:
     - **`checkSkill`** returns one error per problem found:
       - `<name>: no evals/benchmark.meta.json — evaluate the skill with skill-creator, then run pnpm eval:record`;
       - `<name>: skill files changed since the last evaluation` when `meta.skill_sha256 !== skillHash(skillDir)`;
       - `<name>: no evals/benchmark.json`;
       - `<name>: unrecognised benchmark.json format` when `run_summary.with_skill.pass_rate.mean` or `run_summary.without_skill.pass_rate.mean` isn't a number;
       - `<name>: with-skill pass rate <w> is below 0.9`;
       - `<name>: with-skill pass rate <w> does not beat without-skill <wo>`.
     - **`changedSkills`** runs `git merge-base <baseRef> HEAD` and then `git diff --name-only <base> HEAD -- skills/` in `repoRoot`. It returns the unique second path segments that have a `skills/<name>/SKILL.md` on disk, leaving out names ending in `-workspace`.
     - **When run directly,** it uses `BASE_REF` (default `origin/main`). It prints each error and exits 1 if there are any, and otherwise prints `benchmarks ok: <names>` or `no skill changes`, and exits 0.
  3. `scripts/eval-record.mjs`:
     - **Errors (it throws):** a missing `<iterationDir>/benchmark.json`, a folder name that doesn't match `/iteration-(\d+)$/`, a missing `skills/<skillName>/SKILL.md`, or a benchmark that fails the two pass-rate checks from step 2.
     - **Otherwise,** it copies the benchmark to `skills/<skillName>/evals/benchmark.json` and writes `skills/<skillName>/evals/benchmark.meta.json` as `{ "skill_sha256", "evaluated_at": "<YYYY-MM-DD>", "iteration": <n>, "threshold": 0.9 }`, pretty-printed with 2 spaces and a trailing newline.
     - **When run directly,** it takes `argv[2]` and `argv[3]`, prints `recorded <skill> iteration <n>`, and exits 1 with the error message on failure.
  4. `package.json` `scripts`: add `"check:benchmarks": "node scripts/check-benchmarks.mjs"` and `"eval:record": "node scripts/eval-record.mjs"`.
  5. `.husky/pre-push` (new, one line): `pnpm run check:benchmarks`.
  6. `.gitignore`: append `skills/*-workspace/` and `**/evals/results/`.
- **Commands:** `pnpm test`.
- **Verify:**
  - `pnpm test` passes;
  - `pnpm run check:benchmarks` prints `no skill changes` and exits 0;
  - the task's commit goes through the `commit-msg` hook without errors.

  If anything fails, stop and tell the user.
- **Tests:** all three files build skill folders with `mkdtempSync(join(tmpdir(), "skill-"))`.
  - `tests/skill-hash.test.ts`, `describe("skillHash")`:
    - the hash is unchanged after editing a file under `evals/`, a file under `tests/` and `CHANGELOG.md`;
    - it's unchanged after changing only the `x-release-please-version` line in `SKILL.md`;
    - it changes after editing another line of `SKILL.md`;
    - it changes after adding `plan-template.md`.
  - `tests/check-benchmarks.test.ts`, `describe("checkSkill")`:
    - a skill with a matching meta and pass rates 1.0 vs 0.5 gives `[]`;
    - with no meta, the result contains a message matching `/no evals\/benchmark.meta.json/`;
    - with a stale hash, `/changed since the last evaluation/`;
    - with a pass rate of 0.8, `/below 0.9/`;
    - with 0.95 vs 0.95, `/does not beat/`;
    - with a benchmark missing `run_summary`, `/unrecognised benchmark.json format/`.
  - `tests/eval-record.test.ts`, `describe("recordEvaluation")`:
    - from `<tmp>/create-plan-workspace/iteration-3/benchmark.json`, it writes both files, and the meta has `iteration: 3`, `threshold: 0.9` and a `skill_sha256` equal to `skillHash`;
    - it throws for a pass rate below 0.9;
    - it throws for a folder named `run-3`.

  Run `pnpm test` and read the summary. Affected: the three new test files.
- **Commit message:**

```text
feat(repo): gate skill changes on a recorded benchmark

Hashes each skill's files, records skill-creator benchmarks with
pnpm eval:record, and fails a push or PR that changes a skill
without a fresh, passing benchmark.
```

#### [ ] T1.5: Release each skill on its own with release-please and a subtree split

- **Start branch:** `chore/release-setup`.
- **Files:**
  - `release-please-config.json` (new);
  - `.release-please-manifest.json` (new);
  - `.github/workflows/release.yml` (new);
  - `scripts/split-released.mjs` (new);
  - `tests/split-released.test.ts` (new).
- **Interfaces:**
  - Consumes: nothing from earlier tasks.
  - Produces:
    - `releasedSkills(outputs: Record<string, string>): { path: string, name: string, version: string, tag: string }[]` in `scripts/split-released.mjs`;
    - an empty `packages` map in `release-please-config.json`, which group 2 adds `skills/create-plan` to;
    - a `RELEASE_TOKEN` secret that the workflow expects, created in T1.9.
- **Change:**
  1. `release-please-config.json`:

     ```json
     {
       "$schema": "https://raw.githubusercontent.com/googleapis/release-please/main/schemas/config.json",
       "separate-pull-requests": true,
       "include-component-in-tag": true,
       "packages": {}
     }
     ```

  2. `.release-please-manifest.json`: `{}` followed by a newline.
  3. `scripts/split-released.mjs`:
     - **`releasedSkills(outputs)`:** reads `outputs.paths_released`, a JSON array string. For each path `p`, it returns `{ path: p, name: <last segment of p>, version: outputs[`${p}--version`], tag: outputs[`${p}--tag_name`] }`.
     - **When run directly:**
       - it reads `process.env.RP_OUTPUTS`, a JSON object;
       - it exits 1 with `git subtree is not available on this runner` if `git subtree --help` fails;
       - for each skill, it runs `git subtree split --prefix=<path> <tag>` to get the split commit `<sha>`;
       - then `git push --force-with-lease origin <sha>:refs/heads/split/<name>`;
       - then `git tag split/<name>/v<version> <sha>` and `git push origin refs/tags/split/<name>/v<version>`;
       - it prints each pushed ref.
  4. `.github/workflows/release.yml`:

     ```yaml
     name: release
     on:
       push:
         branches: [main]
     permissions:
       contents: write
       pull-requests: write
     jobs:
       release:
         runs-on: ubuntu-latest
         steps:
           - uses: actions/checkout@v4
             with:
               fetch-depth: 0
               token: ${{ secrets.RELEASE_TOKEN }}
           - id: skills
             run: |
               if ls skills/*/SKILL.md >/dev/null 2>&1; then echo "any=true" >> "$GITHUB_OUTPUT"; else echo "any=false" >> "$GITHUB_OUTPUT"; fi
           - id: rp
             if: steps.skills.outputs.any == 'true'
             uses: googleapis/release-please-action@v4
             with:
               token: ${{ secrets.RELEASE_TOKEN }}
               config-file: release-please-config.json
               manifest-file: .release-please-manifest.json
           - name: Split released skills
             if: steps.rp.outputs.releases_created == 'true'
             env:
               RP_OUTPUTS: ${{ toJSON(steps.rp.outputs) }}
             run: node scripts/split-released.mjs
     ```

  5. **Generic updater check:** run release-please's generic updater on a sample. Run `pnpm dlx -p release-please node --input-type=module -e "<script>"`. The script imports `Generic` from `release-please/build/src/updaters/generic.js` and `Version` from `release-please/build/src/version.js`. It calls `new Generic({ version: Version.parse("0.2.0") }).updateContent(sample)`, where `sample` is

     ```text
     ---
     name: sample
     metadata:
       version: "0.1.0" # x-release-please-version
     ---
     ```

     and prints the result. No file is written.
- **Commands:** `pnpm test`.
- **Verify:**
  - `pnpm test` passes;
  - `pnpm exec node --input-type=module -e "import { parse } from 'yaml'; import { readFileSync } from 'node:fs'; parse(readFileSync('.github/workflows/release.yml','utf8'))"` exits 0;
  - the generic updater's output contains `version: "0.2.0" # x-release-please-version`. If it doesn't, write `note: release-please's generic updater does not update the frontmatter line; group 2 uses skills/create-plan/version.txt (spec § 2 fallback)` under this task's tick and continue.
- **Tests:** `tests/split-released.test.ts`, `describe("releasedSkills")`:
  - given `{ paths_released: '["skills/create-plan"]', "skills/create-plan--version": "0.1.0", "skills/create-plan--tag_name": "create-plan-v0.1.0" }`, it returns `[{ path: "skills/create-plan", name: "create-plan", version: "0.1.0", tag: "create-plan-v0.1.0" }]`;
  - given `paths_released: "[]"`, it returns `[]`.

  Run `pnpm test`. Affected: `tests/split-released.test.ts`.
- **Commit message:**

```text
ci(release): release skills with release-please and split them

release-please in manifest mode gives each skill its own version, tag
and release PR; after a release the skill folder is split into
split/<skill> with a split/<skill>/vX.Y.Z tag.
```

#### [ ] T1.6: Run commitlint, tests and the benchmark check on every pull request

- **Start branch:** `chore/release-setup`.
- **Files:** `.github/workflows/ci.yml` (new).
- **Interfaces:**
  - Consumes:
    - `pnpm exec commitlint` from T1.2;
    - `pnpm test` from T1.3;
    - `pnpm run check:benchmarks` from T1.4.
  - Produces: the checks `commitlint`, `test` and `benchmarks`, which T1.9 makes required.
- **Change:** `.github/workflows/ci.yml`:

  ```yaml
  name: ci
  on:
    pull_request:
      branches: [main]
  jobs:
    commitlint:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
          with:
            fetch-depth: 0
        - uses: pnpm/action-setup@v4
        - uses: actions/setup-node@v4
          with:
            node-version: 24
            cache: pnpm
        - run: pnpm install --frozen-lockfile
        - run: pnpm exec commitlint --from ${{ github.event.pull_request.base.sha }} --to ${{ github.event.pull_request.head.sha }} --verbose
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: pnpm/action-setup@v4
        - uses: actions/setup-node@v4
          with:
            node-version: 24
            cache: pnpm
        - run: pnpm install --frozen-lockfile
        - run: pnpm test
    benchmarks:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
          with:
            fetch-depth: 0
        - uses: pnpm/action-setup@v4
        - uses: actions/setup-node@v4
          with:
            node-version: 24
            cache: pnpm
        - run: pnpm install --frozen-lockfile
        - run: pnpm run check:benchmarks
          env:
            BASE_REF: origin/${{ github.base_ref }}
  ```

- **Commands:** `pnpm test`.
- **Verify:**
  - the workflow parses, using the same `yaml` command as in T1.5 with `ci.yml`;
  - `pnpm exec commitlint --from main --to HEAD --verbose` exits 0;
  - `BASE_REF=main pnpm run check:benchmarks` prints `no skill changes`.
- **Commit message:**

```text
ci(repo): check commits, tests and benchmarks on pull requests

Every pull request into main runs commitlint over its commits, the
vitest checks, and the benchmark check for changed skills.
```

#### [ ] T1.7: Record the repository's conventions in CLAUDE.md

- **Start branch:** `chore/release-setup`.
- **Files:** `CLAUDE.md` (new).
- **Interfaces:**
  - Consumes: the commands from T1.2–T1.4.
  - Produces: the conventions every later task and session follows.
- **Change:** `CLAUDE.md` with these sections and rules, in this order:
  1. **`# claude-skills`:** one line: Claude Code skills, each in `skills/<skill-name>/`, released on its own.
  2. **`## Git`:**
     - **Base branch:** `main`, the only long-lived branch.
     - **Branch names:** `<type>/<skill-name>-<desc>` for one skill, `<type>/<desc>` for repository work. `<type>` is `feat`, `bugfix`, `hotfix` or `chore`.
     - **Commits:** Conventional Commits, `type(scope): summary`. The scope is a skill folder name or one of `repo`, `ci`, `deps`, `release` and `main`. The `commit-msg` hook checks every message.
     - **Getting to `main`:** only through a pull request. The agent pushes the branch and opens the PR with `gh pr create --base main`, then stops. The user merges it on GitHub with "Create a merge commit". Never push to, merge into or force-push `main`.
     - **Hooks:** never bypass them (`--no-verify`).
  3. **`## Commands`:**
     - install: `pnpm install`;
     - tests: `pnpm test`;
     - benchmark check: `pnpm run check:benchmarks`, which `pre-push` and CI run;
     - recording an evaluation: `pnpm eval:record <skill-name> <iteration-dir>`.
  4. **`## Skill evaluations`:**
     - **The gate:** never open or merge a PR for a branch that changes `skills/<skill-name>/` until that skill has been evaluated.
     - **Who starts it:** when the user says the branch is ready to merge, ask whether to run `evaluate my <skill-name> skill with skill-creator`. Never start an evaluation on your own.
     - **Order:** first write or update the test cases in `skills/<skill-name>/evals/evals.json` with the user, then run the loop, then record the result with `pnpm eval:record` and commit it.
     - **Never commit** `skills/*-workspace/`.
  5. **`## Releases`:**
     - release-please opens one release PR per skill, and the user merges it;
     - a merged release creates `<skill-name>-vX.Y.Z` and `split/<skill-name>/vX.Y.Z`;
     - never create tags or `split/*` branches by hand.
- **Verify:**
  - `grep -c "^## " CLAUDE.md` prints `4`;
  - `grep -n "never start an evaluation on your own\|Never start an evaluation on your own" CLAUDE.md` finds the rule;
  - `grep -n "Create a merge commit" CLAUDE.md` finds the merge rule.
- **Commit message:**

```text
docs(repo): add CLAUDE.md with the repository conventions

Records the GitHub flow, branch and commit formats, commands, the
skill evaluation gate and the release rules for agents.
```

#### [ ] T1.8: Check group 1, push the branch and open its pull request

- **Start branch:** `chore/release-setup`.
- **No code changes.** The only commit is the plan tick with the check results. If a check fails, stop and tell the user; don't fix it here.
- **Tests:** `rm -rf node_modules && pnpm install` (clean install), then `pnpm test`, `pnpm run check:benchmarks` and `pnpm exec commitlint --from main --to HEAD`. Read each summary.
- **Commit message:** tick T1.8 with the check results first:

```text
docs(repo): complete branch group 1 checks of release setup plan
```

- **Push:** `git push -u origin chore/release-setup`. The `pre-push` hook runs the benchmark check. Then:

  `gh pr create --base main --head chore/release-setup --title "chore(repo): release setup" --body-file -`

  The body lists the group's tasks T1.1–T1.7, the user steps in T1.9, and ends with the PR attribution line the system asks for.

  If the push or the PR fails, stop and report it.
- **Manual check:** run `gh pr checks --watch`. Pass: `commitlint`, `test` and `benchmarks` all show `pass`. If one fails, stop and report its log (`gh run view --log-failed`).
- **Report:** the PR URL, the three check results, and that T1.9's user steps come next.

#### [ ] T1.9: User step: protect `main`, add the release token and merge the pull request

- **Start branch:** `chore/release-setup`.
- **Instructions:** spec § Steps only the user can do, adjusted under Context → Decided. The user:
  1. **Protects `main`,** under GitHub → Settings → Branches → Add branch protection rule for `main`:
     - require a pull request before merging;
     - require the status checks `commitlint`, `test` and `benchmarks` to pass;
     - don't allow force pushes or deletions;
     - apply the rule to administrators too.
  2. **Creates the release token:** a fine-grained personal access token, with repository access limited to `iamchriswick/claude-skills` and the permissions Contents (read and write) and Pull requests (read and write). Saves it as the repository secret `RELEASE_TOKEN`, under Settings → Secrets and variables → Actions.
  3. **Merges the PR** from T1.8 on GitHub with "Create a merge commit".
- **Done when:**
  - `gh api repos/iamchriswick/claude-skills/branches/main/protection --jq '.required_status_checks.contexts'` lists `commitlint`, `test` and `benchmarks`;
  - `gh secret list` shows `RELEASE_TOKEN`;
  - `gh pr view chore/release-setup --json state --jq .state` prints `MERGED`;
  - `gh run list --workflow release --branch main --limit 1` shows the run with conclusion `success`.

### Branch group 2: `feat/create-plan-skill`

#### [ ] T2.0: Detail branch group 2

- **Start branch:** `feat/create-plan-skill`, in `/workspaces/claude-skills-create-plan`, with group 1 merged. Run `git fetch origin && git rebase origin/main` there. If the rebase reports a conflict, abort it, stop and tell the user.
- **Do:**
  1. Read group 2's line in Context → Branch groups, and confirm that `git log -1 --oneline origin/main` shows group 1's merge.
  2. Analyse what group 2 changes, as it now stands:
     - `skills/create-plan/`;
     - `release-please-config.json` and `.release-please-manifest.json`;
     - `scripts/check-benchmarks.mjs` and `scripts/eval-record.mjs`;
     - the T1.5 note on the generic updater.
  3. Ask the user the open questions.
  4. Write group 2's context (Feature opening, Covers, Gate, Tests) and its tasks, from T2.1 on, under this task, in the template's format, with a dated State confirmed list. The tasks must cover:
     - **Skill-specific tests:** `skills/create-plan/tests/` checks that `plan-template.md` contains the title pattern and exactly the three top-level sections, and that each task kind shows its required fields (spec § 3).
     - **Version metadata:** `metadata.version: "0.1.0" # x-release-please-version` in `SKILL.md`, or `version.txt` if T1.5's note says so (spec § 2).
     - **release-please entry:** `skills/create-plan` in `release-please-config.json` (`release-type: simple`, `component: create-plan`, and an `extra-files` generic entry for `SKILL.md` unless `version.txt` is used), and the manifest entry so the first release is `0.1.0`.
     - **A user step to install skill-creator,** with `/plugin install skill-creator@claude-plugins-official`.
     - **The evaluation:** ask the user whether to run `evaluate my create-plan skill with skill-creator`. Then write the cases in `skills/create-plan/evals/evals.json` with the user, covering the six scenarios in spec § 3, then run the loop.
     - **Checking the benchmark scripts against the real `benchmark.json`,** fixing them in a `fix(repo)` commit if they differ, then `pnpm eval:record`. Also check whether the runs can write under `.claude/`. If they can't, those cases assert the plan in the final message (spec § Risks).
     - **The group-ending check, push and PR,** followed by a user step for merging the PR and then merging `create-plan`'s release PR.
     - **The final task,** which checks that `create-plan-v0.1.0` and `split/create-plan/v0.1.0` exist (`git ls-remote origin`) and moves this plan from `.claude/plans/active/` to `.claude/plans/done/` with `git mv` in its tick commit.
- **Commit message:**

```text
docs(repo): detail branch group 2 of release setup plan
```
