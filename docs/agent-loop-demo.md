# Agent Loop Demo Plan

## Topic

Use `passage.md` to demonstrate how `/goal` keeps a coding agent working until a real product slice is complete.

The demo should show the difference between asking an agent to write code once and giving it a clear goal, acceptance criteria, verification steps, and permission to loop until the work is genuinely done.

## Recommended Title

How I Use `/goal` to Keep Coding Agents Working Until the Feature Is Actually Done

## Title Options

1. How I Use `/goal` With Coding Agents
2. Agent Loops With Codex: A Real Repo Demo
3. How To Make Coding Agents Finish The Work
4. The `/goal` Workflow I Use For Real Features
5. Agent Loops Are More Than Prompting
6. From Product Plan To Working Feature With `/goal`

## Core Idea

Most agent demos stop after the first code generation pass.

That is not where the useful workflow ends.

The useful workflow is a loop.

The agent reads the product plan, implements a scoped slice, runs tests, checks the browser, notices gaps, fixes them, and keeps going until the acceptance criteria are met.

`passage.md` is a good demo repo because the plan is already written as small product phases with acceptance criteria and verification steps.

## Why This Repo Works

The repo starts with clear docs instead of a finished app.

That makes the agent workflow visible.

The important files are:

- `docs/issues.md`
- `docs/prd.md`
- `docs/architecture.md`
- `AGENTS.md`

The product is intentionally small.

That keeps the demo focused on the workflow instead of a huge application.

Phase 1 is especially useful because it has a complete local MVP shape:

- Anonymous Markdown editing.
- Local draft persistence.
- Edit and view modes.
- Markdown preview.
- Mermaid preview.
- Export and copy actions.
- Acceptance tests and visual QA.

## Best Demo Path

If the repo is still docs-only, start with Phase 0.

Phase 0 turns the plan into a runnable app.

That is the safest live demo because the agent starts from docs and ends with a working local skeleton.

Use this goal:

```text
/goal Scaffold the passage.md web app and app shell from docs/issues.md issues 1 and 2.
Loop until the app runs locally, lint and tests pass, README setup works, and the desktop/mobile writing surface has been visually checked.
```

If Phase 0 already exists, use Phase 1.

Phase 1 is the stronger product demo because it shows the full anonymous MVP loop.

Use this goal:

```text
/goal Complete Phase 1 of passage.md from docs/issues.md issues 3 through 9.
Loop until the anonymous Markdown editor supports editing, local draft persistence, edit/view mode, Markdown preview, Mermaid preview, export, acceptance tests, and visual QA.
```

For a shorter recording, use one vertical slice.

Issue 5 is probably the cleanest slice because it has visible behavior, keyboard handling, UI state, and tests.

Use this goal:

```text
/goal Implement issue 5: edit and view modes with Ctrl+R and Cmd+R.
Loop until keyboard toggling works, browser refresh behavior is correct, tests pass, and the UI still feels minimal.
```

## Demo Examples

### Example 1: Phase 0 From Docs To App

Use this when the repo has only planning docs.

The viewer sees the agent:

- Read the product plan.
- Create the Next.js app structure.
- Add TypeScript, linting, testing, and scripts.
- Add the first calm app shell.
- Update setup instructions.
- Run the documented commands.
- Fix anything that fails.

This is a good opening demo because the outcome is obvious.

The repo starts as docs.

The repo ends with an app that runs.

### Example 2: Phase 1 As The Full Agent Loop

Use this when the app scaffold already exists.

The viewer sees the agent work through a real product phase:

- Build the Markdown editor.
- Add browser-local persistence.
- Add edit and view mode.
- Render Markdown safely.
- Render Mermaid diagrams.
- Add export, copy, and clear actions.
- Add acceptance tests.
- Do browser QA.

This is the best example of `/goal` as an outer loop.

The agent is not just completing one task.

It is moving a product phase from planned to working.

### Example 3: Issue 5 As A Clean Vertical Slice

Use this when the video needs to be tight.

The viewer sees the agent:

- Read the issue.
- Add mode state.
- Add a visible control.
- Add `Ctrl+R` and `Cmd+R` handling.
- Avoid breaking normal refresh behavior.
- Preserve editor content while toggling.
- Add tests.
- Verify in the browser.

This is the easiest version to explain on camera.

It has a simple user outcome.

The user can switch between writing Markdown and reading the rendered document.

### Example 4: Acceptance-Ready Quality Loop

Use this after Phase 1 has a rough implementation.

The goal is not to add a new feature.

The goal is to make the feature ready.

Use this goal:

```text
/goal Take the current Phase 1 implementation and make it acceptance-ready.
Use docs/issues.md issue 9 as the quality bar.
Run tests, add missing browser coverage, complete desktop/mobile visual QA, fix failures, and stop only when the local MVP is coherent.
```

This is useful because it shows the part of agent work that many demos skip.

The agent loops through tests, browser checks, visual issues, and small fixes until the product feels coherent.

## Recording Flow

Start by opening `docs/issues.md`.

Show that the repo already has phases, acceptance criteria, verification steps, and out-of-scope notes.

Explain that this is the shape a coding agent can actually use.

Then run one `/goal`.

Use Phase 0 for the safest live demo, or issue 5 for the tightest feature demo.

As the agent works, call out the loop:

1. Read the plan.
2. Implement the smallest complete slice.
3. Run checks.
4. Inspect the app.
5. Fix gaps.
6. Repeat until the goal is complete.

The main point is simple.

`/goal` is useful because it gives the agent a finishing condition.

Without a finishing condition, the agent can produce code and stop too early.

With a finishing condition, the agent has a reason to keep testing, checking, and correcting itself.

## Suggested Intro

This is a real demo of how I use `/goal` with coding agents.

By the end of the video, you will understand how to give an agent a product slice, acceptance criteria, and verification steps, then let it loop until the work is actually done.

Most agent demos stop after the first code generation pass.

That can look impressive, but it is not how professional software gets shipped.

In this video, I will use a small repo called `passage.md` and show how a coding agent can move from product docs to a working feature by reading the plan, writing code, running checks, fixing issues, and continuing until the goal is complete.

So, let's get into it.

## What To Emphasize

The workflow matters more than the tool.

The agent needs clear context before it can do useful work.

The plan should include acceptance criteria, verification steps, and explicit out-of-scope notes.

The loop should include tests and browser checks, not just code edits.

The goal should be big enough to matter, but small enough to verify.

Phase 1 is a good outer loop.

Issue 5 is a good single-feature loop.

Issue 9 is a good quality loop.

## Honest Limitation

Do not pretend a full product phase is always a good live demo.

Phase 1 may be too large for one recording if the repo is starting from scratch.

For a cleaner video, record the full run, then narrate the important loop moments.

For a live segment, use Phase 0 or issue 5.

## Final CTA

If you want to go deeper on building real software with AI agents, that is what I am building inside AI Engineer: https://aiengineer.co
