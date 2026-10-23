# claude-skills

Claude Code skills, each in `skills/<skill-name>/`, released on its own.

## Git

- **Base branch:** `main`, the only long-lived branch.
- **Branch names:** `<type>/<skill-name>-<desc>` for one skill, `<type>/<desc>` for repository work. `<type>` is `feat`, `bugfix`, `hotfix` or `chore`.
- **Commits:** Conventional Commits, `type(scope): summary`. The scope is a skill folder name or one of `repo`, `ci`, `deps`, `release` and `main`. The `commit-msg` hook checks every message.
- **Getting to `main`:** only through a pull request. Push the branch, open the PR with `gh pr create --base main`, then stop. The user merges it on GitHub with "Create a merge commit". Never push to, merge into or force-push `main`.
- **Hooks:** never bypass them (`--no-verify`).

## Commands

- Install: `pnpm install`
- Tests: `pnpm test`
- Benchmark check: `pnpm run check:benchmarks`. The `pre-push` hook and CI run it.
- Record an evaluation: `pnpm eval:record <skill-name> <iteration-dir>`

## Skill evaluations

- **The gate:** never open or merge a PR for a branch that changes `skills/<skill-name>/` until that skill has been evaluated.
- **Who starts it:** when the user says the branch is ready to merge, ask whether to run `evaluate my <skill-name> skill with skill-creator`. Never start an evaluation on your own.
- **Order:** first write or update the test cases in `skills/<skill-name>/evals/evals.json` with the user, then run the loop, then record the result with `pnpm eval:record` and commit it.
- **Never commit** `skills/*-workspace/`.

## Releases

- release-please opens one release PR per skill, and the user merges it.
- A merged release creates the tag `<skill-name>-vX.Y.Z` and the split tag `split/<skill-name>/vX.Y.Z`.
- Never create tags or `split/*` branches by hand.
