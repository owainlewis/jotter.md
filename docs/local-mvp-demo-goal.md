# Local MVP Demo Goal

Use this when you want Codex to build the rest of the local anonymous app for a demo.

It is meant to be easy to undo.

The goal uses one demo branch and one demo worktree.

Do not use this for deployment.

Do not use this for saved docs, auth, billing, API, or CLI work.

## What Is This Goal For?

This goal builds the rest of the local Phase 1 app.

It should take the app from a shell to a working anonymous Markdown scratchpad.

It should run locally and be checked in a real browser.

## What Problem Does It Solve?

A normal prompt might build one feature and stop.

This goal keeps going through the remaining local MVP tickets.

It checks the app after each pass.

It stops only when the local app works, tests pass, browser checks pass, or a real blocker is reported.

## How Does It Work?

Codex reads the plan, builds Phase 1 issues 3-9 in order, tests each slice, runs the app locally, checks desktop and mobile in a browser, and reports proof.

It does not deploy.

It opens a draft PR after verification so the demo shows the real agent delivery loop.

It does not merge.

It keeps all demo work in a dedicated branch and worktree so it can be removed later.

## Copy-Ready Goal

```md
/goal
Build the local anonymous passage.md MVP for a demo.

Use `docs/issues.md` Phase 1 issues 3 through 9 as the task list.

Do not work on Phase 2, deployment, auth, saved docs, database, API, CLI, billing, or public sharing.

Do not stop until one of these is true:

1. A draft PR is open for the local anonymous MVP, and Phase 1 issues 3 through 9 are tested and verified.
2. The work is genuinely blocked and the blocker is reported with evidence.

Before changing code, read `AGENTS.md`, `README.md`, `docs/issues.md`, `docs/prd.md`, `docs/architecture.md`, and the current app files.

Create a dedicated demo branch and worktree before editing code.

Use a branch name like `codex/demo-local-mvp`.

Use one demo branch for this whole local MVP demo so it is easy to undo later.

Keep the work scoped to Phase 1 local anonymous behavior.

Build the smallest complete version of each issue in order:

1. Issue 3: anonymous Markdown editor.
2. Issue 4: local draft persistence.
3. Issue 5: edit and view modes with keyboard shortcuts.
4. Issue 6: Markdown preview.
5. Issue 7: Mermaid preview.
6. Issue 8: Markdown export and document actions.
7. Issue 9: Phase 1 acceptance tests and visual QA.

Follow the existing codebase patterns.

Keep the writing surface calm and minimal.

Do not turn the editor into a dashboard.

Add or update focused tests for changed behavior.

After each issue, run the narrowest useful test first.

When a shared or user-facing path changes, run the full documented checks.

Required verification before success:

- Run `npm run lint`.
- Run `npm test`.
- Run `npm run build:web`.
- Run the app locally.
- Type and edit Markdown in the browser.
- Refresh and confirm the local draft remains.
- Clear the draft and confirm it is removed.
- Toggle edit and view modes with visible controls.
- Toggle edit and view modes with `Ctrl+R` or `Cmd+R`.
- Preview headings, paragraphs, lists, links, blockquotes, tables, code blocks, and inline code.
- Preview one valid Mermaid diagram.
- Preview one invalid Mermaid diagram and confirm the rest of the document still works.
- Export a `.md` file and confirm it contains the exact Markdown source.
- Copy Markdown and confirm it can be pasted elsewhere.
- Verify desktop and mobile layouts in a real browser.
- Check for console errors, horizontal overflow, overlap, clipped text, unreadable text, and broken responsive layout.

Use a review subagent after the implementation is complete.

Ask the review subagent to check for bugs, broken old behavior, missing tests, brittle code, and extra work that was not asked for.

Use a separate acceptance subagent after review.

Ask the acceptance subagent to mark each Phase 1 issue acceptance criterion as `satisfied`, `not applicable`, or `missing`.

Fix valid failures and repeat until verification is clean.

After verification is clean, commit the demo work.

Push the demo branch.

Open a draft PR.

The draft PR body must include:

- The Phase 1 issues covered.
- Summary of changes.
- Acceptance status for issues 3 through 9.
- Verification commands and results.
- Browser viewport sizes checked.
- Manual flows checked.
- Known risks or follow-up work.

Do not merge.

Do not deploy.

Do not edit changelogs, vendored files, or generated files unless required.

Do not discard unrelated local changes.

Stop and ask if a Phase 1 requirement is unclear, a product decision is needed, the same blocker repeats three times, a fix requires expanding beyond Phase 1, or deployment/server-side persistence becomes necessary.

The final report must include:

- Demo branch name.
- Demo worktree path.
- Local app URL.
- Files changed.
- Tests and commands run.
- Browser viewport sizes checked.
- Manual flows checked.
- Review subagent result.
- Acceptance subagent result.
- Draft PR URL.
- Anything blocked, with the exact reason.
- How to undo the demo PR, branch, and worktree.
```

## Undo Notes

Use these only after you are done with the demo work.

If the draft PR was not merged:

```sh
gh pr close <pr-number> --delete-branch
git worktree list
git worktree remove <demo-worktree-path>
git branch -D codex/demo-local-mvp
```

If the remote branch still exists after closing the PR:

```sh
git push origin --delete codex/demo-local-mvp
```

If the draft PR was merged by mistake, prefer a revert commit over rewriting `main`:

```sh
git switch main
git pull origin main
git revert -m 1 <merge-commit-sha>
git push origin main
```

Only use history rewriting if this is a private demo repo and Owain explicitly approves it:

```sh
git switch main
git reset --hard <pre-demo-main-sha>
git push --force-with-lease origin main
git worktree list
git worktree remove <demo-worktree-path>
git branch -D codex/demo-local-mvp
git push origin --delete codex/demo-local-mvp
```

To get back to the pre-demo state for another run:

1. Close or revert the demo PR.
2. Delete the remote demo branch.
3. Remove the local demo worktree.
4. Delete the local demo branch.
5. Confirm `main` points at the pre-demo commit or contains the revert commit.
6. Confirm Phase 1 issues 3 through 9 are still available as the work list for the next demo.

Do not run undo commands if the demo branch contains work you want to keep.
