# create-plan rework: design

Date: 2026-10-24. Status: draft for review.

## Goal

Rework the `create-plan` skill (released as 0.1.0) so that it:

1. keeps the agent that writes the plan and the agent that carries it out strictly apart;
2. runs a git preflight in Claude Code before planning, instead of assuming git exists;
3. handles a missing or incomplete `CLAUDE.md`;
4. works in Claude Code and on Claude.ai, with one template for each.

The rework goes through superpowers:writing-skills on a skill branch, then the evaluation gate in `CLAUDE.md`, then a pull request.

## Terms

- **Planning agent:** the agent running `/create-plan`. It analyses the sources and the code, asks the user, and writes the plan.
- **Executing agent:** the agent that later carries out the plan's tasks, one at a time.

## Principles

1. **Separation.** The planning agent only writes the plan. Every git step in a plan (branches, commits, `git mv`, merges, pushes), and every change to `CLAUDE.md`, is a task for the executing agent.
2. **Read-only planning agent.** The planning agent runs only read-only commands. The exceptions are installing git, `git init` and setting the git identity, and each happens only after the user agrees to it.
3. **The user decides what gets committed.** Which files get committed is up to the user's `.gitignore`. The skill never commits anything and makes no decisions about it for the user.
4. **No assumed tools.** The skill relies only on what it checks. Tools outside git, such as `gh`, have no part in the skill.

## Product

Claude knows from its own context whether it is running in Claude Code or on Claude.ai. The skill branches on that:

- **Claude Code:** the git preflight, the `CLAUDE.md` handling and the Claude Code template, with the plan written through plan mode as today.
- **Claude.ai:** the plan becomes a Claude Docs document made from the Claude.ai template. There is no plan mode, file system, `CLAUDE.md`, `.claude` folder, `/clear` or git, and the skill does none of the preflight steps.

## Claude Code: git preflight

### Load-time checks

The skill gathers the facts it needs through dynamic context injection (`` !`<command>` ``) while it loads. Each check:

- is read-only;
- always exits 0 and prints a fallback value when its answer is "no" (for example `git: not installed`), because a non-zero exit aborts the invocation;
- is listed in `allowed-tools`, because outside auto mode, a check that isn't allowed aborts the invocation.

| Check | Fact |
|---|---|
| git installed | `git --version`, or `not installed` |
| repository | `git rev-parse --is-inside-work-tree`, or `none` |
| privileges | root, or `sudo -n true` (passwordless sudo), or neither |
| environment | OS (`/etc/os-release` or `uname`) and the package manager present |
| identity | `git config --get user.name` and `user.email`, or empty |

`allowed-tools` also holds `Bash(git rev-parse *)` and `Bash(git init)`. `AskUserQuestion` needs no entry. The grant lasts only for the turn that invoked the skill. `.git` is a protected path, so in plan mode `git init` goes through the auto-mode classifier or one approval prompt. The exact command strings are set during implementation and covered by the tests.

### One question round

If git is installed and the workspace is a repository, nothing is asked. Otherwise one `AskUserQuestion` round gives only the options that apply:

- **Init:** git is installed, there is no repository.
- **Install and init:** git is missing.
- **Skip:** go on without git.

### Flows

| Flow | When | What happens |
|---|---|---|
| Ready | git installed, repository present | No question. Go on to the identity check. |
| Init | The user picks Init | The planning agent runs `git init`, then verifies it. |
| Agent installs | The user picks Install, and the agent is root or has passwordless sudo | The planning agent installs git with the detected package manager, runs `git init`, then verifies both. |
| User installs | The user picks Install, and the agent has no privileges | The agent gives one command for the user to run in their own terminal, then waits for the user to confirm. It doesn't suggest the `!` prefix, which works only in the CLI. The agent then runs `git init` and verifies it. |
| Retry | A verification fails | The agent says what failed and asks again: retry or skip. |
| Declined | The user picks Skip | The agent asks whether the **execution** workspace will have git. If yes, the plan keeps its git parts. If no, the plan has none. |

Rules for every flow:

- every step that changes the system is verified afterwards with read-only commands;
- the skill is never invoked again, because its content is still in context;
- plan mode is never left.

### Git identity

After git is installed or a repository is initialized, if `user.name` or `user.email` is empty:

1. `AskUserQuestion` asks whether to set them.
2. If yes, `AskUserQuestion` asks for the scope: `--global`, for every repository on the machine, or only the workspace `/create-plan` was invoked in. It also asks for the values.
3. The planning agent sets them with `git config`, then verifies with `git config --get`.

If no, the identity stays unset and the plan doesn't touch it.

## Claude Code: CLAUDE.md handling

The planning agent asks, because it is the one analysing the codebase to decide how the plan's goals are carried out.

### CLAUDE.md does not exist

The agent warns the user that the plan relies on `CLAUDE.md` content the skill expects, and asks through `AskUserQuestion`:

1. **Run `/init` to create `CLAUDE.md` (recommended):** the planning agent makes "run `/init`" the plan's **first task**.
2. **Exit `/create-plan`:** the skill ends without producing a plan.

### CLAUDE.md exists

The planning agent checks with the user, through `AskUserQuestion`, what the skill expects `CLAUDE.md` to contain. If anything needs to change, it makes "update `CLAUDE.md`" the plan's **first task**, and that task says what to change, based on what the skill expects and on the user's answers. If `CLAUDE.md` already holds everything the skill expects, no edit is needed and the plan gets no such task.

### Shared rules

- The planning agent only records these tasks. It does not run `/init` and does not edit `CLAUDE.md`.
- The executing agent runs `/init` and edits `CLAUDE.md` directly, as part of the plan's tasks.

## Templates

- **Claude Code template:** today's `plan-template.md`, changed as follows:
  - its git parts appear only when the execution workspace will have git. These are the branch groups, start branches, commit messages, the merges and pushes, and moving the finished plan to `done/` with `git mv`;
  - every git step it names is written as a step for the executing agent;
  - it gains the first task from the `CLAUDE.md` handling.
- **Claude.ai template:** a new template for a Claude Docs document. It has no plan mode, files, `CLAUDE.md`, `.claude`, `/clear` or git.

## Changes to SKILL.md

- **Remove assumptions that git exists while planning.** These are the base branch and last commit (lines 31, 67 and 71–74) and branch groups (line 77). Each depends on the preflight's outcome.
- **Rewrite git lines in plans as executing-agent steps,** only when the execution workspace will have git. These are line 3 ("grouped by branch"), line 14 ("one commit"), line 58 ("committed and follows every clone"), line 84 (Detail task "committed") and lines 104–110 (start branch, commit message, merge and push, plan file, conventions).
- **Add** the product branching, the preflight with its frontmatter (`allowed-tools`), the identity check, the `CLAUDE.md` handling and the Claude.ai template.

## Testing

1. **writing-skills, RED then GREEN, one scenario per case:**
   - the six preflight flows;
   - identity set globally, identity set for the workspace, identity declined;
   - `CLAUDE.md` missing, with Run `/init` and with Exit;
   - `CLAUDE.md` present;
   - Claude.ai.

   Each scenario also checks that the planning agent changed nothing beyond what the user agreed to.
2. **The evaluation gate in `CLAUDE.md`:** the test cases in `skills/create-plan/evals/evals.json` are updated with the user, the skill-creator evaluation loop runs, and the result is recorded with `pnpm eval:record` before the pull request.

## Not in scope

- `gh` and `gh auth login`.
- `/auto-mode-setup`.
- Any commit, or any decision about what gets committed, by the skill.
