# Plan template

The format every plan follows. Text in angle brackets, such as `<path>`, is a placeholder for facts from the sources, the code and the user's answers; a note says where a placeholder stays as written. Italic notes explain how to fill the template in; don't copy them into the plan. The structure (sections, headings, task fields, their order) is binding; the wording and level of detail are illustrative.

````markdown
# Plan: <goal> (from <source>, <YYYY-MM-DD>)

## How to use this plan (read first, every session)

The plan is the whole goal. Its tasks are grouped by branch and numbered by group: `T<group>.<n>`, for example T2.3 is the third task of branch group 2. Read this header and Context once per session; then read the active branch group's context and the active task. Don't read other tasks or whole areas of the codebase. Within a branch group, continue to the next task in the same session; after a group is merged, the handover suggests `/clear`. `CLAUDE.md` applies at all times; this header adds the plan rules.

### Before starting a task

1. Announce the task in one line.
2. Confirm you are on the branch the task names as its start, with a clean working tree, and that the previous task's heading is ticked `[x]`. Two exceptions: before T1.1 the plan file itself is not yet committed, and after a user step its tick is not yet committed. If anything else differs, stop and tell the user.
3. After every branch switch, install dependencies with the project's install command (`CLAUDE.md`) before anything else.
4. Review the task's Interfaces, Change, Verify and, if present, Tests and Manual check.

### While working

1. Read each file you change once, right before changing it.
2. Run the project's checks (`CLAUDE.md`, for example type check and lint) once, as one command; read the result once.
3. Do not treat assumptions as established requirements.
4. If the work must depart from the plan, stop and ask the user. Once the user agrees, record the change in the plan (in the task, or under Context → Decided) as part of this task's commit.

### Before completing a task

1. Check the result against every pass criterion in the task's Verify, Tests or Manual check.
2. Tick the task in the plan: change its heading's `[ ]` to `[x]` and add any note the next task needs, including unresolved issues, in Conventional Comments format (`<label> [decorations]: <subject>`), for example `issue (blocking): <subject>` or `note: <subject>`.
3. Make one commit with the code and the plan file together, using the task's message and ending with the Co-Authored-By line the system asks for. The commit itself is the record of the task; there is no hash in the tick. If the project's hooks reject the commit, fix what they report and commit again; never bypass them. Files a hook reformats belong to the same commit. A user step has no commit: its tick goes into the next task's commit.
4. Stop; don't start the next task. Except in the plan's last task, the last thing in the final message is this fenced block, with the next task's number; after a group's last task, put "Run `/clear`, then:" above it.

   ```text
   Do task T<next> from <plans-folder>/<plan-file>.md
   ```

   *Replace `<plans-folder>` with the project's plans folder (`plansDirectory` in `.claude/settings.json`, for example `.claude/plans/active`) and `<plan-file>` with the name Claude Code gave the plan. Leave `<next>` as written; the agent following the plan fills it in.*

### At all times

#### Testing

- Run the tests a task names yourself, with the project's test commands (`CLAUDE.md`). A command that doesn't exist yet on the current branch isn't run. Read each summary once.
- If a test fails, stop and report it; don't fix anything the task doesn't name.
- Never change an existing assertion (an `expect` or `assert` line).
- Browser checks: sign in only as the test user `CLAUDE.md` names, never as the owner.

#### Git

- Use only the branch your task's group names. Never commit to, merge into or push a branch `CLAUDE.md` protects; changes reach it only as `CLAUDE.md` describes.
- Push only where a task says so.

#### User steps

A task marked **User step** is done by the user, never by you: give its instructions, wait until the user confirms it's done, check what its Done when names, then tick it.

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

*Context covers the whole plan. Every claim about the code names where it was verified (`<path>:<lines>`). Every decision names where it comes from: `<prompt>`, a named document and its section, or the user. Include only the parts that apply.*

### Goal

<What the whole plan achieves, and why.>

### Source

- <The user's request, in one or two sentences.>
- <Each named document and the parts the plan implements.>

### State confirmed (<YYYY-MM-DD>), before T1.1

- <A fact checked while planning and how it was checked, for example `git log -1 --oneline <base>` shows `<hash>`.>
- <The current content of a file the first group changes (`<path>:<lines>`).>

### Decided (user, <YYYY-MM-DD>)

<The approach the user confirmed in the Q&A session.>

- <Each concrete decision, with where it comes from.>

### Constraints

- <A rule every task inherits, with its exact value, for example a version floor or a naming rule, and where it comes from.>

### Already in place and reused

- <Existing code the work relies on and must not rebuild (`<path>:<lines>`).>

### Not in scope

<What the plan leaves unchanged, and why. Anything the user wants to be consulted about before it is added. Protected branches and releases are never changed by a task; a release pull request appears only as a user step.>

### Risks

- <What the work could break, the riskiest step, or an alternative not taken, and which task guards against it.>

### Expected result

<The observable outcome when all groups are done, measurable where possible.>

### Branch groups

1. `<type>/<description>`: <goal>. Gate: <the check that ends the group>. Detailed.
2. `<type>/<description>`: <goal>. Gate: <check>. Detailed (independent of group 1).
3. `<type>/<description>`: <goal>. Gate: <check>. Detailed by T3.0 (builds on group 2's changes).

*Branch names follow `CLAUDE.md`; without a rule there, use Conventional Branch (`feat/`, `bugfix/`, `hotfix/`, `chore/`), lowercase letters and numbers joined by hyphens. Every group is cut from the base branch `CLAUDE.md` names.*

## Tasks

*Each work task changes one coherent thing and ends with one commit that also carries its tick. A group's first task creates its branch from the base branch; its last task checks, merges and pushes.*

### Branch group 1: `<type>/<description>`

*Each group opens with its own context: exactly one of the five type openings below, chosen by the group's branch type, then Covers, Gate and Tests.*

*Feature opening (template label, not a plan heading):*

*For feature groups.*

**Goal:** <What the feature adds, for whom, and why.>

**Wanted behavior:** <What the user can do when the group is done, step by step.>

*Refactor opening (template label, not a plan heading):*

*For refactor groups. Commits use type `refactor`.*

**Goal:** <What the refactoring improves, and why.>

**Current structure:** <How the code is organized today (`<path>:<lines>`).>

**Behavior that must not change:**

- <Each observable behavior that stays the same, and how to check it.>

*Bug opening (template label, not a plan heading):*

*For bugfix groups.*

**Problem:** <What goes wrong, where (`<path>`), and how it shows.>

**Cause:** <Why it happens, with the code that causes it (`<path>:<lines>`).>

*Hotfix opening (template label, not a plan heading):*

*For hotfix groups: an urgent fix that ships right after it merges. Ends with a user step for the release, as `CLAUDE.md` describes it.*

**Problem:** <What goes wrong in production, where (`<path>`), and how it shows.>

**Cause:** <Why it happens, with the code that causes it (`<path>:<lines>`).>

*Chore opening (template label, not a plan heading):*

*For chore groups: tooling, dependencies, config or docs.*

**Goal:** <What the non-code work changes and why.>

*Every group, after its opening:*

**Covers:** <The parts of the sources this group implements.>

**Gate:** <The check that ends the group.>

**Tests:** <Which tests cover the group's changes and where they are, what cannot be tested and why, and which commands run them.>

#### [ ] T1.1: <Outcome the task achieves>

- **Start branch:** `<base>`. Create the branch: `git switch -c <type>/<description>`. The plan file is committed for the first time in this task's commit.
- **Files:** `<path>` (new), `<path>:<lines>`.
- **Interfaces:**
  - Consumes: <what this task uses from existing code or earlier tasks, with exact names and signatures>.
  - Produces: <what later tasks rely on, with exact names, parameters and return types>.
- **Change:**
  1. `<path>`: <the exact change, including the signatures of any new exports>. Nothing else in the file changes.
  2. `<path>`: <the exact change>. Nothing else in the file changes.
- **Commands:** <the project's check command> (header "While working", step 2).
- **Verify:** <an observable check with an explicit pass criterion, for example `git diff <base> -- <dir>` shows only the changes above>. If it fails, stop and tell the user.
- **Tests:** <the test file, the `describe` block, the setup, and the exact assertions to add>. Run `<test command>` and read the summary. Affected: `<test file>`.

*A task has **Tests** when it adds or changes tests, or when its change needs a test run. Tests are written in the same group as the work they cover.*

- **Commit message:**

```text
<type>(<scope>): <description>

<Why the change was needed and what it does, in a few lines.>
```

*Commit messages follow `CLAUDE.md`; without a rule there, use Conventional Commits (`feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `ci`, `build`, `perf`, `style`, `revert`) with an optional scope.*

#### [ ] T1.2: <Outcome the task achieves>

- **Start branch:** `<type>/<description>`.
- <Same fields as T1.1.>

#### [ ] T1.<n>: User step: <what the user does>

- **Start branch:** <the branch the work is on>.
- **Instructions:** <the steps, citing the source where one applies>.
- **Done when:** <what you check after the user confirms>.

#### [ ] T1.<last>: Check group 1, run the tests, merge and push

- **Start branch:** `<type>/<description>`.
- **No code changes.** Its only commits are the plan tick and the merge commit. If a check fails, stop and tell the user; don't fix it here.
- **Before:** <the services the checks need, from `CLAUDE.md`; start them if they aren't running>.
- **Manual check:** <each state to check in the running app, what to observe, and an explicit pass criterion for each; the group's Gate is among them>. <A step that needs the user's consent: ask first, and do it only on yes.>
- **Tests:** run `<test commands>` and read the summaries. If anything fails, stop and report it.
- **Commit message:** tick T1.<last> with the check results first:

```text
docs: complete branch group 1 of <goal> plan
```

- **Merge:** <as `CLAUDE.md` sets it, for example `git switch <base> && git merge --no-ff --no-edit <type>/<description>`>. If the merge reports a conflict, abort it, confirm the working tree is clean, stop and tell the user.
- **Push:** <what to push, for example `git push origin <base>`, and what the push starts (hooks, builds)>. If it fails, stop and report it.
- **Report:** <the check results, the test summaries, the merge commit hash, and what was pushed>. Unresolved issues in Conventional Comments format. For a hotfix group, the release user step follows.

### Branch group 3: `<type>/<description>`

*A group that builds on an earlier group's changes holds only its Detail task until that task runs.*

#### [ ] T3.0: Detail branch group 3

- **Start branch:** `<base>`, with group 2 merged. Create the branch: `git switch -c <type>/<description>`.
- **Do:** read group 3's line in Context → Branch groups; confirm `git log -1 --oneline <base>` shows group 2's merge; analyse the code group 3 changes as it stands now; ask the user the open questions; then write group 3's context and tasks (T3.1 onward) under this task, in this template's format, with a dated State confirmed list. Tick T3.0.
- **Commit message:**

```text
docs: detail branch group 3 of <goal> plan
```

*The plan's last task is the last group's check-and-merge task. Its tick commit also moves the plan file from `active/` to `done/` (`git mv`), so the plan arrives in `done/` with the merge. Its final message says that all tasks are done (no next-task block).*
````
