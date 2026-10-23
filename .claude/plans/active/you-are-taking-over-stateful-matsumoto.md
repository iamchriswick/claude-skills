# Plan: Finish the claude-skills release setup and release create-plan (from docs/superpowers/specs/2026-10-23-release-setup-design.md, 2026-10-23)

## How to use this plan (read first, every session)

The plan is the whole goal. Its tasks are grouped by branch and numbered by group: `T<group>.<n>`, for example T2.3 is the third task of branch group 2. Group 1 starts at T1.10: T1.1–T1.9 are in the retired plan `.claude/plans/done/glimmering-rolling-minsky.md`, which T1.10 moves there. Read this header and Context once per session; then read the active branch group's context and the active task. Don't read other tasks or whole areas of the codebase. Within a branch group, continue to the next task in the same session; after a group is merged, the handover suggests `/clear`. `CLAUDE.md` applies at all times, except its "Getting to `main`" rule until T1.14 rewrites it: until then, Context → Decided, "Reaching `main`", applies. This header adds the plan rules.

### Before starting a task

1. Announce the task in one line.
2. Confirm three things, and if anything else differs, stop and tell the user:
   - you are in `/workspaces/claude-skills`, on the branch the task names as its start;
   - the working tree is clean;
   - the previous task's heading is ticked `[x]`.

   Exceptions:
   - Before T1.10, this plan file is untracked, and the previous task's tick is in the retired plan.
   - After a user step, or after a task that has no commit of its own, its tick isn't committed yet.
   - T2.4 starts with one uncommitted change, to `.claude/settings.json`, from the user step T2.3.
   - T3.1 starts with T2.8 unticked: T3.1 writes that tick on its own branch.
3. After every branch switch, run `pnpm install` before anything else.
4. Review the task's Interfaces, Change, Verify and, if present, Tests and Manual check.

### While working

1. Read each file you change once, right before changing it.
2. Run `pnpm test` once, as one command, and read the result once.
3. Do not treat assumptions as established requirements.
4. If the work must depart from the plan, stop and ask the user. Once the user agrees, record the change in the plan (in the task, or under Context → Decided) as part of this task's commit. Never add tasks or groups without the user's agreement.

### Before completing a task

1. Check the result against every pass criterion in the task's Verify, Tests or Manual check.
2. Tick the task in the plan: change its heading's `[ ]` to `[x]` and add any note the next task needs, including unresolved issues, in Conventional Comments format (`<label> [decorations]: <subject>`), for example `issue (blocking): <subject>` or `note: <subject>`.
3. Make one commit with the code and the plan file together, using the task's message and ending with the Co-Authored-By line the system asks for. The commit itself is the record of the task; there is no hash in the tick. The `commit-msg` hook checks every message and the `pre-push` hook every push. If a hook rejects a commit or push, fix what it reports and try again; never bypass a hook (`--no-verify`). Files a hook reformats belong to the same commit. A user step, and a task that says it has no commit of its own, have no commit: their tick goes into the next task's commit.
4. Stop; don't start the next task. Except in the plan's last task, the last thing in the final message is this fenced block, with the next task's number; after a group's last task, put "Run `/clear`, then:" above it.

   ```text
   Do task T<next> from .claude/plans/active/you-are-taking-over-stateful-matsumoto.md
   ```

### At all times

#### Testing

- Run the tests a task names yourself, with `pnpm test`. Read each summary once.
- If a test fails, stop and report it; don't fix anything the task doesn't name. The one expected failure is named in the task where it appears.
- Never change an existing assertion (an `expect` or `assert` line).

#### Git

- Work only in `/workspaces/claude-skills`. Never create a worktree.
- Use only the branch your task's group names. Changes reach `main` only as Context → Decided, "Reaching `main`", describes, and only in the task that says so. Never force-push `main`.
- Push only where a task says so.

#### User steps

A task marked **User step** is done by the user, never by you: give its instructions, wait until the user confirms it's done, check what its Done when names, then tick it.

#### Skill evaluations

Never start a skill-creator evaluation on your own. Ask the user whether to run `evaluate my create-plan skill with skill-creator`, and run it only on yes (`CLAUDE.md` § Skill evaluations).

#### Unclear or mismatched tasks

If something in a task is unclear or doesn't match the code or the sources, stop and ask the user:

- Don't improvise, and don't work around an obstacle.
- Don't do anything the task doesn't give you:
  - no extra branches
  - no extra commits
  - no extra merges or pushes
  - no extra config
  - no extra memory changes.
- Untracked files you didn't create: don't change, stage, or delete them; ask the user what to do with them.

## Context

### Goal

Every skill under `skills/<skill-name>/` is developed, tested and released on its own, and gets a release tag only after it passes all its tests here. This plan finishes the release setup that group 1 of the retired plan put on `main`: it fixes two bugs found since, records the branch flow the user confirmed, clears the workspace of the failed T2.0's leftovers, and takes `create-plan` through its first evaluation and release as `0.1.0`.

### Source

- **The user's request:** `/create-plan` with a findings report on the state after a failed T2.0 (user, 2026-10-23). Planning continues from T1.10; T2.0's results are not accepted. The plan covers findings A1–A7, B1–B7 and C1–C5 as decided below.
- **`docs/superpowers/specs/2026-10-23-release-setup-design.md`:** § 1, § 2 (version metadata), § 3 (create-plan's tests, behavior tests, recording, release), § Steps only the user can do, § Risks. § Not in scope stays out of scope. T1.14 changes the spec where the user's answers differ from it.
- **The retired plan `glimmering-rolling-minsky.md`:** T1.1–T1.9 were carried out from it. Its T1.5 note (line 475) is reused: release-please 17.11.2's generic updater updates `version: "0.1.0" # x-release-please-version` in YAML frontmatter.

### State confirmed (2026-10-23), before T1.10

- **GitHub:** `git ls-remote origin` shows `main` and `HEAD` at `8bb24be` ("Merge pull request #1 from iamchriswick/chore/release-setup"), `chore/release-setup` at `7873282`, and no tags. `gh release list` is empty. `gh pr list --state all` shows only PR #1, merged.
- **`main`'s protection** (`gh api repos/iamchriswick/claude-skills/branches/main/protection`): required checks `commitlint`, `benchmarks` and `test`; `required_pull_request_reviews` set with 0 approvals; `enforce_admins.enabled: true`; force pushes and deletions off. `gh secret list` shows `RELEASE_TOKEN` (2026-10-23T13:45:12Z).
- **`/workspaces/claude-skills`:** on `chore/release-setup` at `7873282`, working tree clean. The T1.9 tick from B6 is no longer there.
- **Local branches** (`git branch -vv`): `main` at `ea77c02`, 11 behind `origin/main`; `chore/project-setup` at `88b8c2f`; `chore/claude` at `eceb72f`; `feat/create-plan-skill` at `6b2d7c3`.
- **`feat/create-plan-skill`:** `6b2d7c3` is T2.0's plan-only commit on top of `3f599e7`. `git log --oneline 8bb24be..3f599e7` shows three commits: `ac174de`, `3f30648`, `3f599e7`, all `feat(create-plan)`. `git diff 8bb24be 3f599e7 --stat` shows only `skills/create-plan/SKILL.md` and `skills/create-plan/plan-template.md`.
- **Worktree:** `git worktree list` shows `/workspaces/claude-skills-create-plan` at `6b2d7c3`, with a clean `git status --short`. `~/.claude/skills/create-plan` is a symlink to `/workspaces/claude-skills-create-plan/skills/create-plan`.
- **Leftovers:** 78 folders `/tmp/skill-*`; scratchpads `9dcb91dd-0198-47c5-bedd-73032c3ce5fe`, `ec81208b-eff2-404a-8a58-5f4557ad6862`, `7c09bfd4-465b-438b-82c1-350c16d5a220` and `e104d8e8-c663-45cb-b7db-d8221580ca56` under `/tmp/claude-1000/-workspaces-claude-skills/`.
- **Tests:** `tests/skill-hash.test.ts:14`, `tests/check-benchmarks.test.ts:24` and `tests/eval-record.test.ts:27` call `mkdtempSync(join(tmpdir(), "skill-"))` in `beforeEach`, and none of the three deletes the folder (no `rmSync`, no `afterEach`).
- **Release split:** `.github/workflows/release.yml` checks out `main` before the `rp` step creates the release and its tag on GitHub. `scripts/split-released.mjs:23-24` runs `git subtree split --prefix=<path> <tag>` without fetching that tag first.
- **`CLAUDE.md:9`:** "Getting to `main`: only through a pull request … Never push to, merge into or force-push `main`."
- **Spec lines that the branch-flow answer changes:** `:18` (Decisions, "Reaching `main`"), `:154` (§ Repository instructions, "PRs only …"), `:178` (Protect `main`), `:180` (Allow GitHub Actions to create pull requests).
- **`.husky/pre-push`:** `pnpm run check:benchmarks`. No hook runs `pnpm test`.
- **release-please 17.11.2** (installed in the `ec81208b…` scratchpad):
  - `build/src/manifest.js:323-338`: a manifest version of `0.0.0` is skipped, so a package without a release is treated as new;
  - `build/src/strategies/base.js:337-340` and `:463-468`: a new package gets `initial-version` if set, otherwise `1.0.0`;
  - `build/src/manifest.js:1102`: `initial-version` can be set per package;
  - `build/src/strategies/simple.js:42`: the `simple` type updates `version.txt` only if it exists.
- **`skills/create-plan/SKILL.md:1-6` at `3f599e7`:** frontmatter with `name`, `description`, `disable-model-invocation: true` and `argument-hint`, and no `metadata`.
- **`skills/create-plan/plan-template.md` at `3f599e7`:** the plan is inside a ` ````markdown ` fence (`:5` to `:249`). The title is at `:6`, and the `## ` headings at `:8`, `:70` and `:122`. The task headings are `#### [ ] T1.1:` (`:180`), `#### [ ] T1.<n>: User step:` (`:211`), `#### [ ] T1.<last>:` (`:217`) and `#### [ ] T3.0:` (`:238`).
- **skill-creator:** the loaded built-in `anthropic-skills:skill-creator` writes `<skill-name>-workspace/iteration-<N>/benchmark.json` next to the skill (its `SKILL.md:166-179`), with `run_summary.with_skill.pass_rate.mean` and `run_summary.without_skill.pass_rate.mean` (its `references/schemas.md:345-354`), the fields `scripts/check-benchmarks.mjs` reads. `claude plugin marketplace list` shows only `anthropic-plugin-directory`, and `claude plugin list` has no skill-creator plugin.
- **Tools:** `git subtree` isn't installed in this container (retired plan, State confirmed). `pnpm dlx -p release-please node …` fails under pnpm 11.7.0 (retired plan, line 477).

### Decided (user, 2026-10-23)

- **Reaching `main`:**
  - **Skill branches** (`<type>/<skill-name>-<desc>`) reach `main` only through a PR. The agent pushes the branch, opens the PR with `gh pr create --base main` and stops; the user merges it on GitHub with "Create a merge commit".
  - **Repository branches** (`<type>/<desc>`): once the group's checks and `pnpm test` pass, the agent merges with `git switch main && git merge --no-ff --no-edit <branch>` and pushes with `git push origin main`. This needs the user step T1.15, which lets the owner bypass `main`'s protection. Everyone else still needs a PR with the three checks.
- **Guarding direct pushes:** no CI change. The `commit-msg` and `pre-push` hooks cover commitlint and the benchmark check, and each repository group's merge task runs `pnpm test` before it merges.
- **The plan file:** this plan replaces `glimmering-rolling-minsky.md` from T1.10 on. T1.10 moves the old plan to `.claude/plans/done/`.
- **`evals/evals.json` stays required** for every skill, in `skills/<skill-name>/evals/evals.json`. Tests must be proven to pass before a skill gets a PR and a release, as a promise to the future plugin repo. A3 is not changed.
- **Fixes:** A4, fetch the release tag before the split (T1.13); A5, tests delete their temporary folders (T1.11).
- **`feat/create-plan-skill`** goes back to `3f599e7`, keeping the rebase onto `8bb24be` and dropping `6b2d7c3`.
- **Workspace clean-up:** delete the four scratchpads above and all `/tmp/skill-*`; remove the worktree; replace the symlink `~/.claude/skills/create-plan` with a plain copy of `skills/create-plan/` at `3f599e7`.
- **Branch clean-up:** fast-forward local `main` to `origin/main`; delete the local branches `chore/project-setup` and `chore/claude`; delete `chore/release-setup` locally and on `origin` once group 1 is merged.
- **From T2.0's questions, still standing:**
  - the plan's final commit goes on its own branch, `chore/release-setup-plan-done`;
  - skill-creator is installed in project scope, as `skill-creator@claude-plugins-official` (spec § 3), from the marketplace `anthropics/claude-plugins-official`;
  - if an evaluation run misses the threshold, the task stops and reports the failing cases without changing the skill. The user decides what changes.

Planning decisions, not from the sources or the user:

- **Group 1 continues on `chore/release-setup`,** fast-forwarded to `origin/main`, because the plan continues at T1.10.
- **A branch that changes `skills/` counts as a skill branch,** whatever its name, so the evaluation gate in `CLAUDE.md` always comes with a PR.
- **The first version comes from `"initial-version": "0.1.0"`** in `create-plan`'s release-please package config, with no manifest entry. T2.0's approach, manifest `0.0.0`, would give `1.0.0` (State confirmed, release-please). T2.7 checks the proposed version with a release-please dry run before the PR is opened.
- **`SKILL.md` carries `metadata.version: "0.1.0"`** before the release, so it already matches the first release. The version line is left out of the skill hash.
- **The split logic moves into an exported `splitSkill(skill, git)`** in `scripts/split-released.mjs`, so a Vitest test can check the order of the git commands with a fake `git`, since `git subtree` can't run in this container.
- **Spec § Steps only the user can do loses "Allow GitHub Actions to create pull requests":** `release.yml` runs release-please with `RELEASE_TOKEN`, not `GITHUB_TOKEN` (`.github/workflows/release.yml`, step `rp`).
- **Evaluation prompts don't use the `/create-plan` slash command.** The user-level copy in `~/.claude/skills/create-plan` would otherwise load in the without-skill runs. `disable-model-invocation: true` keeps the model from loading it on its own.
- **The evaluation uses the plugin skill `skill-creator:skill-creator`** by name, not the built-in `anthropic-skills:skill-creator`.
- **Commit types:** tests and evaluation records use `test(create-plan)`, the version metadata `chore(create-plan)`, the split fix `fix(release)`. Only the three existing `feat(create-plan)` commits count towards the release.

### Constraints

- **Base branch:** `main` (`CLAUDE.md` § Git).
- **Branch and commit formats:** `CLAUDE.md` § Git. Scopes: a skill folder name, or `repo`, `ci`, `deps`, `release`, `main`.
- **Benchmark threshold:** with-skill pass rate at least `0.9` and higher than without-skill (spec § 3; `scripts/check-benchmarks.mjs`).
- **Never committed:** `node_modules/`, `skills/*-workspace/`, `**/evals/results/` (`.gitignore`; `CLAUDE.md` § Skill evaluations).
- **Tags and `split/*` refs** are created only by the release workflow (`CLAUDE.md` § Releases).

### Already in place and reused

- `scripts/skill-hash.mjs`, `scripts/check-benchmarks.mjs`, `scripts/eval-record.mjs` and the commands `pnpm run check:benchmarks` and `pnpm eval:record <skill-name> <iteration-dir>` (`package.json`).
- `tests/skills.test.ts`, the shared checks, including `has a valid evals/evals.json`.
- `vitest.config.ts`, which includes `skills/*/tests/**/*.test.ts`.
- `release-please-config.json` (`"packages": {}`) and `.release-please-manifest.json` (`{}`), `.github/workflows/release.yml` and `.github/workflows/ci.yml`.
- `releasedSkills(outputs)` in `scripts/split-released.mjs:5-12` and its test in `tests/split-released.test.ts`.

### Not in scope

- The plugin repository `iamchriswick/my-claude-plugin`, and `claude plugin eval` in CI (spec § Not in scope).
- CI runs on pushes to `main`, and a `pnpm test` step in `pre-push` (user, 2026-10-23).
- Replacing the copy in `~/.claude/skills/create-plan` with an `npx skills add` install after the release.
- Deleting `feat/create-plan-skill`, locally or on `origin`, after its PR merges.
- `main`'s protection and release PRs, apart from the user steps.
- Skills other than `create-plan`.

### Risks

- **`git subtree` may be missing on the runner,** and can't be run in this container. `split-released.mjs` fails with a clear message. The release in T2.8 shows whether it works, and T2.8 stops and reports on a failed run.
- **The release could get the wrong first version.** T2.7 runs a release-please dry run against the pushed branch and stops before the PR if it doesn't propose `0.1.0`.
- **The plugin's `benchmark.json` may differ** from the built-in skill-creator's schema. T2.6 checks the fields before recording and stops if they differ.
- **Evaluation runs may be unable to write under `.claude/`** (spec § Risks). T2.6 stops and reports. The user decides whether those cases assert the plan in the final message.
- **The direct push in T1.16 depends on T1.15.** T1.15's Done when checks `enforce_admins` before any push.
- **Deletions in T1.12 can't be undone.** T1.12 checks each target before deleting it.

### Expected result

- `main` has the split fix, tests that clean up after themselves, and `CLAUDE.md` and the spec stating the confirmed branch flow.
- `create-plan` is on `main` with its template tests, its evaluation cases and a recorded passing benchmark. It is released as `create-plan-v0.1.0`, with a GitHub release, the branch `split/create-plan` and the tag `split/create-plan/v0.1.0` holding only the skill folder.
- `/workspaces/claude-skills` is the only worktree; `/tmp/skill-*` and the four scratchpads are gone; the local branches are `main` and `feat/create-plan-skill`.
- Both plans are in `.claude/plans/done/`.

### Branch groups

1. `chore/release-setup` (continued from T1.10): fix the release split and the test clean-up, record the branch flow, and clean the workspace. Gate: `pnpm test` passes, and the merge is pushed to `main`. Detailed.
2. `feat/create-plan-skill`: give `create-plan` template tests, version metadata, release config and a recorded evaluation, then release it as `0.1.0`. Gate: the release refs exist on `origin`. Detailed. Its own changes don't build on group 1's remaining tasks, but its release needs T1.13 on `main`, so it starts after group 1 is merged.
3. `chore/release-setup-plan-done`: check the release and move this plan to `done/`. Gate: the release checks pass, and the merge is pushed to `main`. Detailed.

## Tasks

### Branch group 1: `chore/release-setup`

**Goal:** fix the two bugs found after group 1's merge, write the branch flow the user confirmed into `CLAUDE.md` and the spec, let the owner push repository work directly, and remove T2.0's and older leftovers from the workspace.

**Covers:** findings A1, A2, A4, A5, A6 and A7, B1–B7 and C1–C5, as decided; spec § Steps only the user can do (protection).

**Gate:** `pnpm test` passes on the branch, and its `--no-ff` merge is pushed to `main` (T1.16).

**Tests:** `pnpm test` covers the changed tests in `tests/skill-hash.test.ts`, `tests/check-benchmarks.test.ts`, `tests/eval-record.test.ts` (T1.11) and `tests/split-released.test.ts` (T1.13). The split itself can only run on GitHub (T2.8).

#### [x] T1.10: Bring the branch up to date and replace the retired plan

- **Start branch:** `chore/release-setup` at `7873282`. This plan file is untracked and is committed for the first time in this task's commit.
- **Files:** `.claude/plans/active/glimmering-rolling-minsky.md` → `.claude/plans/done/glimmering-rolling-minsky.md`; `.claude/plans/active/you-are-taking-over-stateful-matsumoto.md` (new).
- **Interfaces:**
  - Consumes: nothing.
  - Produces: `chore/release-setup` and local `main` at `8bb24be`.
- **Change:**
  1. Run `git fetch origin`, `git merge --ff-only origin/main` and `git fetch origin main:main`. Then run `pnpm install`.
  2. `.claude/plans/active/glimmering-rolling-minsky.md`: change `#### [ ] T1.9` to `#### [x] T1.9`, and add this line after the title, with a blank line on each side: `note: retired on 2026-10-23. T1.9 was done by the user; T2.0's result was not accepted. The work continues from T1.10 in you-are-taking-over-stateful-matsumoto.md.` Nothing else in the file changes.
  3. Run `mkdir -p .claude/plans/done && git mv .claude/plans/active/glimmering-rolling-minsky.md .claude/plans/done/`.
- **Verify:**
  - `git rev-parse HEAD main origin/main` prints `8bb24be…` three times, before the commit;
  - `ls .claude/plans/active` lists only `you-are-taking-over-stateful-matsumoto.md`;
  - `git diff --cached -M` shows the rename, with only the T1.9 tick and the note changed, plus the new plan file.

  If the fast-forward fails, stop and tell the user.
- **Commit message:**

```text
docs(repo): continue the release setup in a new plan

The first plan's T2.0 was not accepted. The new plan continues from
T1.10 with the user's answers; the old plan moves to done/.
```

#### [x] T1.11: Delete the tests' temporary folders after each test

note: the Verify grep `^[-+].*expect` also matches the changed vitest import lines; no assertion line changed.

- **Start branch:** `chore/release-setup`.
- **Files:** `tests/skill-hash.test.ts:1-21`, `tests/check-benchmarks.test.ts:1-27`, `tests/eval-record.test.ts:1-32`.
- **Interfaces:**
  - Consumes: nothing.
  - Produces: test runs that leave no `/tmp/skill-*` behind.
- **Change:**
  1. `tests/skill-hash.test.ts` and `tests/check-benchmarks.test.ts`: import `rmSync` from `node:fs` and `afterEach` from `vitest`. In the `describe`, add `let tmp: string;`. The `beforeEach` sets `tmp = mkdtempSync(join(tmpdir(), "skill-"));` and then `dir = join(tmp, "sample");` in place of its current first line. Add `afterEach(() => rmSync(tmp, { recursive: true, force: true }));` after the `beforeEach`. Nothing else changes.
  2. `tests/eval-record.test.ts`: import `rmSync` from `node:fs` and `afterEach` from `vitest`, and add `afterEach(() => rmSync(root, { recursive: true, force: true }));` after the `beforeEach`. Nothing else changes.
- **Verify:**
  - `git diff -U0 tests/ | grep '^[-+].*expect'` prints nothing;
  - `ls -d /tmp/skill-* | wc -l` prints the same number before and after `pnpm test`.
- **Tests:** run `pnpm test`. Pass: `Tests  16 passed (16)`. Affected: the three files above.
- **Commit message:**

```text
test(repo): delete temporary skill folders after each test

The hash, benchmark and record tests left a /tmp/skill-* folder per
test; each now removes its folder in afterEach.
```

#### [x] T1.12: Clean the workspace of T2.0's and older leftovers

- **Start branch:** `chore/release-setup`. No commit of its own: nothing tracked changes, and the tick goes into T1.13's commit.
- **Change:** check each target before you remove it; if a check fails, stop and tell the user.
  1. **Worktree:** `git -C /workspaces/claude-skills-create-plan status --short` prints nothing. Then run `git worktree remove /workspaces/claude-skills-create-plan`. If it refuses, stop and tell the user; never use `--force`.
  2. **Skill branch:** `git rev-parse feat/create-plan-skill feat/create-plan-skill^` prints `6b2d7c3…` and `3f599e7…`. Then run `git branch -f feat/create-plan-skill 3f599e7`.
  3. **The user-level skill:** `test -L ~/.claude/skills/create-plan` succeeds. Then run `rm ~/.claude/skills/create-plan && mkdir ~/.claude/skills/create-plan && git archive 3f599e7 skills/create-plan | tar -x -C ~/.claude/skills/create-plan --strip-components=2`.
  4. **Scratchpads:** run `rm -rf` on each of these four folders under `/tmp/claude-1000/-workspaces-claude-skills/`: `9dcb91dd-0198-47c5-bedd-73032c3ce5fe`, `ec81208b-eff2-404a-8a58-5f4557ad6862`, `7c09bfd4-465b-438b-82c1-350c16d5a220`, `e104d8e8-c663-45cb-b7db-d8221580ca56`. Don't touch any other folder there.
  5. **Test folders:** `rm -rf /tmp/skill-*`.
  6. **Merged local branches:** `git branch -d chore/project-setup chore/claude`. If `-d` refuses, stop and tell the user; never use `-D`.
- **Verify:**
  - `git worktree list` shows only `/workspaces/claude-skills`;
  - `git rev-parse feat/create-plan-skill` prints `3f599e7…`;
  - `test ! -L ~/.claude/skills/create-plan`, and for `f` in `SKILL.md plan-template.md`, `git show 3f599e7:skills/create-plan/$f | cmp - ~/.claude/skills/create-plan/$f` succeeds;
  - `ls -d /tmp/skill-* 2>/dev/null | wc -l` prints `0`, and none of the four scratchpads exists;
  - `git branch --format='%(refname:short)'` lists `chore/release-setup`, `feat/create-plan-skill` and `main`;
  - `git status --short` shows only the plan file.

#### [x] T1.13: Fetch the release tag before splitting a released skill

- **Start branch:** `chore/release-setup`.
- **Files:** `scripts/split-released.mjs:14-31`, `tests/split-released.test.ts`.
- **Interfaces:**
  - Consumes: `releasedSkills(outputs)` (`scripts/split-released.mjs:5-12`).
  - Produces: `splitSkill(skill: { path: string, name: string, version: string, tag: string }, git: (...args: string[]) => string): string[]`, returning the two pushed refs.
- **Change:**
  1. `scripts/split-released.mjs`: add, after `releasedSkills`:

     ```js
     export function splitSkill(skill, git) {
       git("fetch", "origin", `refs/tags/${skill.tag}:refs/tags/${skill.tag}`);
       const sha = git("subtree", "split", `--prefix=${skill.path}`, skill.tag);
       const branch = `refs/heads/split/${skill.name}`;
       git("push", "--force-with-lease", "origin", `${sha}:${branch}`);
       const splitTag = `split/${skill.name}/v${skill.version}`;
       git("tag", splitTag, sha);
       git("push", "origin", `refs/tags/${splitTag}`);
       return [branch, `refs/tags/${splitTag}`];
     }
     ```

     In the direct-run block, the `for` loop's body becomes `for (const ref of splitSkill(skill, git)) console.log(`pushed ${ref}`);`. Nothing else changes.
  2. `tests/split-released.test.ts`: import `splitSkill` too, and add `describe("splitSkill")` with `it("fetches the release tag before splitting, then pushes the split branch and tag")`. A fake `git` records each call's arguments and returns `"abc123"` for `subtree`, `""` otherwise. For `{ path: "skills/create-plan", name: "create-plan", version: "0.1.0", tag: "create-plan-v0.1.0" }`, assert that the calls equal, in order:
     - `["fetch", "origin", "refs/tags/create-plan-v0.1.0:refs/tags/create-plan-v0.1.0"]`
     - `["subtree", "split", "--prefix=skills/create-plan", "create-plan-v0.1.0"]`
     - `["push", "--force-with-lease", "origin", "abc123:refs/heads/split/create-plan"]`
     - `["tag", "split/create-plan/v0.1.0", "abc123"]`
     - `["push", "origin", "refs/tags/split/create-plan/v0.1.0"]`

     and that the result equals `["refs/heads/split/create-plan", "refs/tags/split/create-plan/v0.1.0"]`.
- **Verify:** `node --check scripts/split-released.mjs` exits 0.
- **Tests:** run `pnpm test`. Pass: `Tests  17 passed (17)`. Affected: `tests/split-released.test.ts`.
- **Commit message:**

```text
fix(release): fetch the release tag before splitting a skill

The checkout runs before release-please creates the tag on GitHub, so
the split could not find it. The split steps now live in splitSkill
and fetch the tag first.
```

#### [x] T1.14: Record the confirmed branch flow in CLAUDE.md and the spec

note: the "Getting to `main`" bullet was on `CLAUDE.md:10`, not `:9`; its text matched, so line 10 was replaced.

- **Start branch:** `chore/release-setup`.
- **Files:** `CLAUDE.md:9`, `docs/superpowers/specs/2026-10-23-release-setup-design.md:18, :48, :154, :178, :180`.
- **Interfaces:**
  - Consumes: Context → Decided, "Reaching `main`".
  - Produces: the rule groups 2 and 3 follow.
- **Change:**
  1. `CLAUDE.md`: line 9 becomes these three bullets. Nothing else changes.
     - `- **Skill branches** (\`<type>/<skill-name>-<desc>\`, and any branch that changes \`skills/\`) reach \`main\` only through a pull request. Push the branch, open the PR with \`gh pr create --base main\`, then stop. The user merges it on GitHub with "Create a merge commit".`
     - `- **Repository branches** (\`<type>/<desc>\`): once \`pnpm test\` passes, merge with \`git switch main && git merge --no-ff --no-edit <branch>\` and push with \`git push origin main\`.`
     - `- **Never force-push \`main\`.**`
  2. The spec (line numbers are those before the change):
     - `:18`, the row becomes `| Reaching \`main\` | Skill branches: pull request on GitHub, CI must pass, merged with a merge commit. Repository branches: merged locally with a merge commit and pushed by the agent; the owner may bypass \`main\`'s protection | User, 2026-10-23 |`;
     - after `:48` (Merge commits), add the bullet `- **Repository branches** (\`<type>/<desc>\`, no changes under \`skills/\`) are merged into \`main\` locally with \`--no-ff\` and pushed after \`pnpm test\` passes. Every branch that changes \`skills/\` goes through a pull request.`;
     - `:154` becomes `- skill branches through PRs and repository branches merged locally, both with merge commits; \`main\` is protected;`;
     - `:178` becomes `- **Protect \`main\`** on GitHub: require a PR and the CI checks, block force pushes, and allow administrators to bypass the rule so repository work can be pushed directly.`;
     - delete `:180`.

     Nothing else changes.
- **Verify:**
  - `grep -n "Repository branches" CLAUDE.md docs/superpowers/specs/2026-10-23-release-setup-design.md` finds one line in `CLAUDE.md` and two in the spec;
  - `grep -c "Allow GitHub Actions" docs/superpowers/specs/2026-10-23-release-setup-design.md` prints `0`;
  - `grep -c "Never push to, merge into" CLAUDE.md` prints `0`.
- **Commit message:**

```text
docs(repo): merge repository branches directly, skill branches by PR

Skill branches keep the pull request and CI gate. Repository branches
are merged locally and pushed once pnpm test passes, with the owner
allowed to bypass main's protection.
```

#### [x] T1.15: User step: let the owner bypass `main`'s protection

note: not done. One-time exception (user, 2026-10-23): group 1 reaches `main` through a pull request instead of a direct push, so `main`'s protection is unchanged (`enforce_admins` stays `true`). Later repository groups still need this step before a direct push.

- **Start branch:** `chore/release-setup`.
- **Instructions:** on GitHub → `iamchriswick/claude-skills` → Settings → Branches → the rule for `main` → Edit, clear "Do not allow bypassing the above settings" and save. Keep every other setting.
- **Done when:** `gh api repos/iamchriswick/claude-skills/branches/main/protection --jq '[.enforce_admins.enabled, (.required_status_checks.contexts | sort), (.required_pull_request_reviews != null), .allow_force_pushes.enabled]'` shows, in order: `false`; `benchmarks`, `commitlint`, `test`; `true`; `false`.

#### [x] T1.16: Check group 1, merge it into `main` and push

note: checks passed: `main` and `origin/main` at `8bb24be`; clean install exits 0; `Tests  17 passed (17)`; `no skill changes`; commitlint exits 0.
note: one-time exception (user, 2026-10-23): in place of the local merge and push, the branch is pushed and a PR into `main` is opened; the user merges it on GitHub. After the merge, delete `chore/release-setup` on `origin` and locally, and fast-forward local `main`.

- **Start branch:** `chore/release-setup`.
- **No code changes.** Its only commits are the plan tick and the merge commit. If a check fails, stop and tell the user; don't fix it here.
- **Manual check:** after `git fetch origin`, `git rev-parse origin/main main` prints `8bb24be…` twice, so nothing else reached `main` since T1.10. If not, stop and tell the user.
- **Tests:** `rm -rf node_modules && pnpm install`, then `pnpm test`, `pnpm run check:benchmarks` and `pnpm exec commitlint --from origin/main --to HEAD`. Pass: install exits 0; `Tests  17 passed (17)`; `no skill changes`; commitlint exits 0.
- **Commit message:** tick T1.15 and T1.16, with the check results, first:

```text
docs(repo): complete branch group 1 checks of release setup plan
```

- **Merge:** `git switch main && git merge --no-ff --no-edit chore/release-setup`. If the merge reports a conflict, abort it, confirm the working tree is clean, stop and tell the user.
- **Push:** `git push origin main`. The `pre-push` hook runs the benchmark check, and GitHub reports the bypassed rule. Then delete the branch: `git push origin --delete chore/release-setup` and `git branch -d chore/release-setup`. If a push fails, stop and report it. Pass: `git ls-remote origin refs/heads/main` shows the merge commit; `git ls-remote origin refs/heads/chore/release-setup` prints nothing; `gh run list --workflow release --branch main --limit 1` shows the run for the merge with conclusion `success` (no skills on `main`, so release-please is skipped).
- **Report:** the check results, the merge commit hash, what was pushed and deleted.

### Branch group 2: `feat/create-plan-skill`

**Goal:** give `create-plan` the tests, version metadata, release config and recorded evaluation that the release setup requires, so that it passes CI's three checks, is merged through a PR and released as `0.1.0`.

**Wanted behavior:**

1. `pnpm test` runs `create-plan`'s template checks next to the shared ones.
2. `pnpm run check:benchmarks` prints `benchmarks ok: create-plan`.
3. After the PR merges, release-please opens a release PR for `create-plan` `0.1.0`.
4. Merging it creates `create-plan-v0.1.0`, a GitHub release, the branch `split/create-plan` and the tag `split/create-plan/v0.1.0`.

**Covers:** spec § 2 (version metadata), § 3 (create-plan's skill-specific checks, behavior tests and their record, the release and split), and the spec § Risks rows on the `benchmark.json` format and on writes under `.claude/`.

**Gate:** the user merges the group's PR and then the release PR, and the release refs exist on `origin` (T2.8).

**Tests:**
- `skills/create-plan/tests/plan-template.test.ts` (T2.1), run with `pnpm test`.
- The shared check `has a valid evals/evals.json` fails from T2.1 until T2.5 adds the cases. That is the only expected failure.
- The behavior tests in `skills/create-plan/evals/evals.json` run with skill-creator (T2.6), and `pnpm run check:benchmarks` checks the record.
- The release can only be checked on GitHub: a dry run in T2.7, the real release in T2.8.

#### [x] T2.1: Check the plan template's title, sections and task fields

- **Start branch:** `main`, with group 1 merged. Run `git switch feat/create-plan-skill && git rebase main`, then `pnpm install`. If the rebase reports a conflict, abort it, stop and tell the user. `git log --oneline main..HEAD` shows the three `feat(create-plan)` commits.
- **Files:** `skills/create-plan/tests/plan-template.test.ts` (new).
- **Interfaces:**
  - Consumes: `skills/create-plan/plan-template.md` (State confirmed); `vitest.config.ts`'s `skills/*/tests/**/*.test.ts` pattern.
  - Produces: nothing later tasks use.
- **Change:** `skills/create-plan/tests/plan-template.test.ts`, exactly:

  ```ts
  import { readFileSync } from "node:fs";
  import { join } from "node:path";
  import { describe, expect, it } from "vitest";

  const lines = readFileSync(join(import.meta.dirname, "..", "plan-template.md"), "utf8").split(/\r?\n/);
  const open = lines.indexOf("````markdown");
  const close = lines.lastIndexOf("````");
  // The plan itself is the text inside the template's ````markdown fence.
  const plan = lines.slice(open + 1, close);

  function taskSection(headingStart: string): string {
    const start = plan.findIndex((line) => line.startsWith(headingStart));
    expect(start, headingStart).toBeGreaterThan(-1);
    const rest = plan.slice(start + 1);
    const end = rest.findIndex((line) => /^#{2,4} /.test(line));
    return (end === -1 ? rest : rest.slice(0, end)).join("\n");
  }

  const taskKinds = [
    { kind: "work task", heading: "#### [ ] T1.1:", fields: ["Start branch", "Verify", "Commit message"] },
    { kind: "user step", heading: "#### [ ] T1.<n>: User step:", fields: ["Start branch", "Instructions", "Done when"] },
    { kind: "group-ending task", heading: "#### [ ] T1.<last>:", fields: ["Start branch", "Manual check", "Commit message"] },
    { kind: "Detail task", heading: "#### [ ] T3.0:", fields: ["Start branch", "Do", "Commit message"] },
  ];

  describe("plan-template.md", () => {
    it("holds the plan in one markdown fence", () => {
      expect(open).toBeGreaterThan(-1);
      expect(close).toBeGreaterThan(open);
    });

    it("starts the plan with the title pattern", () => {
      expect(plan[0]).toBe("# Plan: <goal> (from <source>, <YYYY-MM-DD>)");
    });

    it("has exactly the three top-level sections", () => {
      expect(plan.filter((line) => line.startsWith("## "))).toEqual([
        "## How to use this plan (read first, every session)",
        "## Context",
        "## Tasks",
      ]);
    });

    for (const { kind, heading, fields } of taskKinds) {
      it(`shows the required fields of a ${kind}`, () => {
        const section = taskSection(heading);
        for (const field of fields) {
          expect(section, field).toContain(`- **${field}:**`);
        }
      });
    }
  });
  ```

- **Tests:** run `pnpm test`. Pass: the 7 tests in `plan-template.test.ts` pass, and the only failure is `tests/skills.test.ts > create-plan > has a valid evals/evals.json`. Affected: `skills/create-plan/tests/plan-template.test.ts`.
- **Commit message:**

```text
test(create-plan): check the plan template's title, sections and fields

The template must keep the title pattern, exactly three top-level
sections, and the required fields of each task kind.
```

#### [x] T2.2: Add the version metadata and the release-please entry

- **Start branch:** `feat/create-plan-skill`.
- **Files:** `skills/create-plan/SKILL.md:1-6`, `release-please-config.json`.
- **Interfaces:**
  - Consumes: the generic updater's frontmatter support (retired plan, T1.5 note); `initial-version` (State confirmed, release-please).
  - Produces: the release-please package `skills/create-plan` with component `create-plan`, which T2.7 and T2.8 rely on.
- **Change:**
  1. `skills/create-plan/SKILL.md`: after the `argument-hint` line, insert two lines: `metadata:` and `  version: "0.1.0" # x-release-please-version`. Nothing else changes.
  2. `release-please-config.json`: `"packages"` becomes:

     ```json
     "packages": {
       "skills/create-plan": {
         "release-type": "simple",
         "component": "create-plan",
         "initial-version": "0.1.0",
         "extra-files": [{ "type": "generic", "path": "SKILL.md" }]
       }
     }
     ```

     Nothing else changes. `.release-please-manifest.json` stays `{}`.
- **Verify:** `node -e "JSON.parse(require('fs').readFileSync('release-please-config.json','utf8'))"` exits 0.
- **Tests:** run `pnpm test`. Pass: the same single expected failure as in T2.1, and `has valid frontmatter` passes for `create-plan`.
- **Commit message:**

```text
chore(create-plan): add version metadata and release config

SKILL.md carries metadata.version for release-please's generic
updater, and the skill is a release-please package whose first
release is 0.1.0.
```

#### [ ] T2.3: User step: install skill-creator in project scope

- **Start branch:** `feat/create-plan-skill`.
- **Instructions:** in `/workspaces/claude-skills`, run `claude plugin marketplace add anthropics/claude-plugins-official --scope project` and `claude plugin install skill-creator@claude-plugins-official --scope project`, then restart Claude Code in `/workspaces/claude-skills`.
- **Done when:**
  - `claude plugin list` shows `skill-creator@claude-plugins-official` with `Scope: project` and `Status: ✔ enabled`;
  - `git diff --stat` shows only `.claude/settings.json`, and its diff only adds the marketplace and `"skill-creator@claude-plugins-official": true` under `enabledPlugins`.

  If either command fails, stop and report its output.

#### [ ] T2.4: Commit the project-scope skill-creator settings

- **Start branch:** `feat/create-plan-skill`, with the uncommitted `.claude/settings.json` change from T2.3.
- **Files:** `.claude/settings.json`.
- **Change:** none beyond T2.3's change.
- **Verify:** `git diff .claude/settings.json` shows only the additions T2.3's Done when names; `plansDirectory` and the superpowers entry are unchanged.
- **Commit message:**

```text
chore(repo): enable skill-creator in project scope

Every clone gets skill-creator@claude-plugins-official, the plugin
the skill evaluations use.
```

#### [ ] T2.5: Write create-plan's evaluation cases with the user

- **Start branch:** `feat/create-plan-skill`.
- **Files:** `skills/create-plan/evals/evals.json` (new); `skills/create-plan/evals/files/` (new, only for fixtures the cases name).
- **Interfaces:**
  - Consumes: the plugin skill `skill-creator:skill-creator`; the shared check `has a valid evals/evals.json`.
  - Produces: the cases T2.6 runs.
- **Change:**
  1. Ask the user: "Group 2's branch is ready for its evaluation. Run `evaluate my create-plan skill with skill-creator`?" Continue only on yes. On no, stop: the group can't go on without it (`CLAUDE.md` § Skill evaluations).
  2. Load `skill-creator:skill-creator` and go through phase 1 with the user: write the cases in `skills/create-plan/evals/evals.json` (`skill_name: "create-plan"`; paths in `files` are relative to `skills/create-plan/`, as `tests/skills.test.ts` checks them), with one case for each scenario in spec § 3: a request covering several features; a single bugfix; a plan built from a spec; a vague request; a plan file outside the repository; the "don't ask" pressure case. No prompt uses the `/create-plan` slash command.
  3. Write the file only after the user has approved every case.
- **Verify:** the user has approved the cases; `evals.json` has six cases, one per scenario.
- **Tests:** run `pnpm test`. Pass: no failures. Affected: `tests/skills.test.ts > create-plan > has a valid evals/evals.json`.
- **Commit message:**

```text
test(create-plan): add evaluation cases

Six skill-creator cases cover several features, a single bugfix, a
plan from a spec, a vague request, a plan file outside the repository
and the don't-ask pressure case.
```

#### [ ] T2.6: Run the evaluation and record its benchmark

- **Start branch:** `feat/create-plan-skill`.
- **Files:** `skills/create-plan/evals/benchmark.json` (new), `skills/create-plan/evals/benchmark.meta.json` (new). The run itself is in the ignored `skills/create-plan-workspace/`.
- **Interfaces:**
  - Consumes: the cases from T2.5; `pnpm eval:record <skill-name> <iteration-dir>`; `pnpm run check:benchmarks`.
  - Produces: the record CI's `benchmarks` check reads.
- **Change:**
  1. With `skill-creator:skill-creator`, run phase 2: every case with and without the skill, into `skills/create-plan-workspace/iteration-1/`, then its grading, `benchmark.json` and the review viewer.
  2. Stop and report, without changing the skill or the cases, if any of these happens. The user decides what changes, and the plan is updated before the loop runs again:
     - runs can't write under `.claude/`: name the affected cases;
     - `benchmark.json` lacks a number at `run_summary.with_skill.pass_rate.mean` or `run_summary.without_skill.pass_rate.mean`: show its top-level structure;
     - the with-skill pass rate is below `0.9` or not above the without-skill rate: list the failing cases and assertions;
     - the user's review asks for changes.
  3. Run `pnpm eval:record create-plan skills/create-plan-workspace/iteration-<N>`, with `<N>` the iteration the user accepted.
- **Verify:**
  - `pnpm eval:record` prints `recorded create-plan iteration <N>`;
  - `pnpm run check:benchmarks` prints `benchmarks ok: create-plan`;
  - `git status --short` shows only the two new files under `skills/create-plan/evals/` and the plan file.
- **Commit message:**

```text
test(create-plan): record the evaluation benchmark

Records skill-creator iteration <N>: with-skill pass rate <w> against
<wo> without the skill.
```

  Replace `<N>`, `<w>` and `<wo>` with the recorded values.

#### [ ] T2.7: Check group 2, push the branch and open its pull request

- **Start branch:** `feat/create-plan-skill`.
- **No code changes.** The only commit is the plan tick with the check results. If a check fails, stop and tell the user; don't fix it here.
- **Manual check:** `git log --oneline main..HEAD` shows the three `feat(create-plan)` commits and the commits of T2.1, T2.2, T2.4, T2.5 and T2.6, and `git ls-files skills/create-plan-workspace` prints nothing.
- **Tests:** `rm -rf node_modules && pnpm install`, then `pnpm test`, `pnpm run check:benchmarks` and `pnpm exec commitlint --from main --to HEAD`. Pass: no test failures; `benchmarks ok: create-plan`; commitlint exits 0.
- **Commit message:** tick T2.7 with the check results first:

```text
docs(repo): complete branch group 2 checks of release setup plan
```

- **Push:** `git push -u origin feat/create-plan-skill`. The `pre-push` hook runs the benchmark check. If it fails, stop and report it. Then:
  1. Run `pnpm dlx release-please@17.11.2 release-pr --dry-run --token "$(gh auth token)" --repo-url iamchriswick/claude-skills --target-branch feat/create-plan-skill`. Pass: it proposes one pull request, whose title ends with `release create-plan 0.1.0`. If the version differs or the command fails, stop and report the output; don't open the PR.
  2. Open the PR: `gh pr create --base main --head feat/create-plan-skill --title "feat(create-plan): add the create-plan skill" --body-file -`. The body lists T2.1–T2.6, the recorded pass rates, the user step T2.8, and ends with the PR attribution line the system asks for.
  3. Run `gh pr checks --watch`. Pass: `commitlint`, `test` and `benchmarks` all show `pass`. If one fails, stop and report its log (`gh run view --log-failed`).
- **Report:** the PR URL, the dry-run result, the three check results, and that T2.8's user step comes next.

#### [ ] T2.8: User step: merge the pull request and the release pull request

- **Start branch:** `feat/create-plan-skill`.
- **Instructions:**
  1. Merge the PR from T2.7 on GitHub with "Create a merge commit".
  2. Wait for release-please's PR for `create-plan` `0.1.0` and for its three checks to pass. Merge it with "Create a merge commit".
- **Done when:**
  - `gh pr list --state merged --limit 2` shows both PRs;
  - `gh run list --workflow release --branch main --limit 1` shows the run for the release merge with conclusion `success`. If it failed, stop and report `gh run view <id> --log-failed`;
  - `git ls-remote origin` lists `refs/tags/create-plan-v0.1.0`, `refs/heads/split/create-plan` and `refs/tags/split/create-plan/v0.1.0`.

  Don't tick T2.8 here: an uncommitted plan change would block T3.1's switch to `main` and its pull. T3.1 ticks it. The handover is "Run `/clear`, then:" with T3.1.

### Branch group 3: `chore/release-setup-plan-done`

**Goal:** confirm that the first release is what consumers get, and close this plan by moving it to `done/`.

**Covers:** spec § 1 (split for consumers); the plan's final commit on its own branch (user, 2026-10-23).

**Gate:** the release checks below pass, and the merge is pushed to `main` (T3.1).

**Tests:** `pnpm test` before the merge. The release itself is checked with `git` and `gh` against `origin`.

#### [ ] T3.1: Check the release, move the plan to `done/`, merge and push

- **Start branch:** `main`, with the release merged. Run `git switch main && git pull --ff-only origin main`, then `git switch -c chore/release-setup-plan-done` and `pnpm install`. This plan file comes from `main` with T2.7's tick; T2.8 isn't ticked yet.
- **No code changes.** Its only commits are the plan tick with the move, and the merge commit. If a check fails, stop and tell the user; don't fix it here.
- **Manual check:** after `git fetch origin --tags`:
  - `gh release view create-plan-v0.1.0` succeeds;
  - `git ls-tree --name-only origin/split/create-plan` lists `SKILL.md` and `plan-template.md` at the top level, and no `skills/` folder;
  - `git rev-parse split/create-plan/v0.1.0^{commit}` equals `git rev-parse origin/split/create-plan`;
  - `git show create-plan-v0.1.0:skills/create-plan/SKILL.md` contains `version: "0.1.0" # x-release-please-version`;
  - `cat .release-please-manifest.json` shows `"skills/create-plan": "0.1.0"`.
- **Tests:** run `pnpm test`. Pass: no failures.
- **Commit message:** tick T2.8 and T3.1, with the check results, then run `git mv .claude/plans/active/you-are-taking-over-stateful-matsumoto.md .claude/plans/done/` and commit:

```text
docs(repo): complete release setup plan
```

- **Merge:** `git switch main && git merge --no-ff --no-edit chore/release-setup-plan-done`. If the merge reports a conflict, abort it, confirm the working tree is clean, stop and tell the user.
- **Push:** `git push origin main`, then `git branch -d chore/release-setup-plan-done`. If the push fails, stop and report it.
- **Report:** the release check results, the merge commit hash and what was pushed. All tasks are done; there is no next-task block.
