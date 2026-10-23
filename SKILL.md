---
name: create-plan
description: Use when the user asks to create or detail a plan for multi-step work (one or several features, phases or fixes) that will be carried out task by task across sessions, grouped by branch.
disable-model-invocation: true
argument-hint: "[what to plan, or the documents to plan from]"
---

# Create a plan

**Announce at start:** "I'm using the create-plan skill to create the plan."

You write a plan that another agent carries out one task at a time, across sessions, often right after `/clear`. The plan covers the whole goal. Its tasks are grouped by branch, and each task ends with one commit that carries both the work and that task's tick in the plan. You write the plan; you never carry it out.

The request is the message that asked for the plan, including any `/create-plan` arguments.

## Ask before you write

**The plan file gets no content until the user has answered.** Ask about these:

- **Scope.** The goal in one sentence, what the plan covers and what it leaves out. A vague request ("make it faster") gets questions, not a plan.
- **Contradictions.** Places where the sources disagree with each other or with the code.
- **Open items in the sources.** Every TODO, open question or optional item the plan depends on.
- **Open implementation choices** that change what gets built or how it behaves: user-visible behavior, the data model, new dependencies, and anything the sources leave open.
- **Missing conventions.** Anything `CLAUDE.md` doesn't set that the plan needs, such as the test command or the merge and push rules. Don't fill these in from `package.json`, a Makefile or your own habits.
- **User steps.** Steps only the user can do, and which approvals are needed.

**Decide yourself how the work is arranged.** That covers:
- names of files, modules, functions and tests that follow the codebase's patterns;
- branch names in `CLAUDE.md`'s format;
- task order and how tasks are split;
- settings that an agreed step needs in order to work.

List these under Context → Decided as planning decisions. The user reviews them when approving the plan.

**How to ask.** Ask everything in one round, with the most consequential questions first. Give a recommended option and the alternatives for each question. AskUserQuestion takes up to 4 questions per call, so use several calls in a row if you need more. Ask a second round only about what the answers themselves opened up.

What the user answers becomes a decision in the plan. What the user leaves open stays open in the plan. Questions are never written into the plan.

| Thought | Reality |
|---|---|
| "The plan uses these defaults if you don't answer" | That's deciding for the user. Ask, and wait. |
| "I'll draft it and list the questions at the end" | The draft hardens your guesses. Ask first. |
| "It's a small call, I'll just make it" (an extra shortcut, a fallback name) | Each one is a requirement nobody asked for. Ask, or leave it out. |
| "The optional item is cheap, I'll include it" | Optional means the user decides. Ask. |
| "`package.json` has a `test` script, so that's the test command" | `CLAUDE.md` sets conventions. Ask what it should say. |
| "Is `wb/fix/stale-delete` OK? Is `src/search/fuzzy.ts` OK?" | `CLAUDE.md` and the codebase already settle this. It's a planning decision, so list it under Decided. |

## Plan file location

Plan mode hands you a plan file path. If you aren't in plan mode, enter it before you start analysing.

Plans live in the project, in `.claude/plans/active/`. Finished plans go to `.claude/plans/done/`, next to it. Claude Code puts plans there when `plansDirectory` is `./.claude/plans/active` in any of its settings files: user, project or local.

- **Path is not `<project>/.claude/plans/active/<name>.md`** (for example `~/.claude/plans/…`): stop and tell the user to set `"plansDirectory": "./.claude/plans/active"` and start again. The plan must be in the repository, so that it is committed and follows every clone. Don't write it anywhere else, and don't pick another folder yourself.
- **Path is in that folder:** keep the file name Claude Code gives you.

## Process

1. **Read the sources** in full:
   - the request;
   - every document it names;
   - `CLAUDE.md`;
   - the code on the base branch;
   - `plan-template.md` next to this file.

   If a source can't be read, stop and say which one. Never plan from unseen material.
2. **Check the repository's state:**
   - the base branch's last commit;
   - uncommitted work;
   - existing plans in the plans folder;
   - whether the tools and commands the plan relies on exist.
3. **Map the files** each part of the work creates or changes. Follow the codebase's existing patterns.
4. **Split the work into branch groups**, one per feature, phase or fix. Unrelated work, such as two features, goes into separate groups. A group whose code builds on an earlier group's changes gets only a Detail task (`T<n>.0`), which details it once the earlier group is merged. A group that doesn't depend on another is detailed now.
5. **Verify every claim** the plan makes about the code in the groups detailed now, and record where you checked it (`<path>:<lines>`).
6. **Present your findings and ask the questions** above, in a Q&A session with AskUserQuestion (see "How to ask").
7. **Write the plan** in the template's format.
8. **Self-review** the plan, fix what you find, then present it through plan mode (ExitPlanMode).
9. **When the user approves, stop.** Give the handover block for T1.1 from the header's "Before completing a task", step 4, and let the user start it.

A **Detail task** follows the same process for one group: on that group's branch, against the code after the previous merge, with its result written into this plan and committed.

## Writing the plan

Follow `plan-template.md`. Its structure is binding; its wording is illustrative.

- **Title and sections.** The title is `# Plan: <goal> (from <source>, <YYYY-MM-DD>)`, followed by exactly three sections:
  1. `## How to use this plan (read first, every session)`
  2. `## Context`
  3. `## Tasks`

  Nothing else goes at the top level. `<goal>` names the whole plan, not one feature. If no short phrase covers it, the plan bundles unrelated work: ask whether to split it.
- **The header.** Start from the template's header and change it only where this plan needs it. If the plan itself adds something the header relies on, such as a test command or hooks, say per rule from which task that rule applies and what to do until then.
- **Context.** Use the template's subsections. Cite where everything comes from:
  - code claims: `<path>:<lines>`;
  - decisions: the request, a document section, or "user, `<date>`".

  Mark planning decisions as yours, not as decisions from the sources or the user. If the user's answer changes a decision in a named document, record the final approach under Decided and tell the user that document needs the same change. Cite the sources and `CLAUDE.md`; don't copy them.
- **Tasks.** Use the template's headings: `#### [ ] T<group>.<n>: <outcome>`, user steps, and Detail tasks.
  - **Fields.** Use the template's fields in the template's order.
  - **Task size.** Make a task the smallest unit with its own check that a reviewer could approve or reject on its own. Setup, config and docs go into the task that needs them.
  - **Group ending.** Each group ends with a task that checks the group, merges it and pushes it, as `CLAUDE.md` sets out.
  - **Plan file.** The first task's commit adds the plan file. The plan's last task moves the file to `done/`.
- **Conventions.** Branch names, commit format, merge and push rules, and the install, check and test commands come from `CLAUDE.md`. Where it doesn't set them and the user doesn't either, use Conventional Branch names and Conventional Commits, and write unresolved issues in Conventional Comments format.
- **Who the plan speaks to.** The plan addresses only the agent that carries it out. It never mentions its author and never speaks to the user ("I'd suggest", "Should I").
- **No placeholders in detailed groups.** None of these:
  - "TBD", "add error handling", "write tests for this", "similar to T1.2";
  - names that no task or existing code defines;
  - commands, paths or rules invented without a source.

## Self-review

Check each of these and fix what you find:

1. Every requirement has a task or appears under Not in scope.
2. No placeholders appear in a detailed group.
3. Names, signatures, paths and branches match across tasks and their Interfaces.
4. After `/clear`, each task can be done from the header, Context, its group's context and the task alone.
5. The plan has the title and exactly three sections, contains no questions, and doesn't refer to its author.
