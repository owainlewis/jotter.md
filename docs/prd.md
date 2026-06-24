# jotter.md PRD

## Summary

`jotter.md` is a Markdown notepad for agents and humans.

It gives anyone a clean browser writing surface for transient Markdown.

Paid users can save, sync, share, and use the CLI/API.

The product should feel like GitHub Gist with better writing, better preview, and better agent workflows.

## Homepage Tag

A Markdown notepad for agents and humans.

## Product Reference

GitHub Gist is the functional reference.

iA Writer is the visual reference.

The editor should feel quiet, focused, and almost empty.

The preview should feel like a finished document.

## Problem

Markdown is still the simplest portable format for scripts, specs, prompts, diagrams, and agent context.

GitHub is useful for code but clumsy for quick thinking and writing.

Most Markdown apps are built for humans first and agents later.

Agents need docs that are easy to create, fetch, append, replace, and share as raw Markdown.

## Users

Primary users:

- Developers writing notes, scripts, specs, prompts, and architecture docs.
- AI coding agents that need a reliable Markdown notepad.
- Technical founders who want simple shareable Markdown without repo friction.

Secondary users:

- Writers who prefer Markdown.
- Teams that need lightweight shared technical notes.

## Positioning

`jotter.md` is a minimal Markdown notepad.

It is browser-first for humans.

It is CLI-first for agents.

It is not a full knowledge base.

It is not a rich-text editor.

It is not a docs platform with heavy permissions in V1.

## Product Model

Free:

- Open the browser editor.
- Write Markdown.
- Preview Markdown.
- Preview Mermaid diagrams.
- Keep a transient local draft.
- Export Markdown.
- No account required.
- No database save.

Paid:

- Save documents.
- Sync documents across devices.
- Share documents by URL.
- Use CLI auth.
- Use API tokens.
- Search saved docs.
- Access document history.

## Core UX

The default screen is a writing surface.

There should be no dashboard feeling inside the editor.

The editor has a thin top bar, centered title, and minimal actions.

The bottom bar can show mode, word count, and small controls.

`Ctrl+R` switches between edit and view mode.

`Cmd+R` does the same on macOS.

Edit mode shows raw Markdown.

View mode shows rendered Markdown.

The default V1 experience is edit or view, not split view.

Split view can come later.

## Document Privacy

All saved docs are private by default.

A doc becomes public only when the owner shares it.

Anyone with the shared URL can read the doc.

Anyone with the shared URL cannot edit the doc in V1.

Unsharing disables public access.

Private docs return 404 from public routes.

## Public URLs

Human HTML view:

```txt
https://jotter.md/d/share_abc123
```

Raw Markdown view:

```txt
https://jotter.md/d/share_abc123.md
```

The raw `.md` route is a V1 requirement because agents need stable Markdown context URLs.

## CLI

The CLI is part of V1.

It should work well in terminals, shell scripts, and coding-agent sessions.

Core commands:

```sh
jotter auth login
jotter new "Launch script"
jotter list
jotter push script.md
jotter pull doc_123
jotter cat doc_123
jotter append doc_123 notes.md
jotter replace doc_123 script.md
jotter share doc_123
jotter unshare doc_123
jotter url doc_123
jotter raw doc_123
jotter open doc_123
```

The CLI should output plain text by default.

It should support JSON output for agents and scripts.

## MVP Requirements

- Anonymous users can write in the browser without an account.
- Anonymous drafts persist locally in the browser.
- Anonymous users can export Markdown.
- Anonymous users cannot save to the database.
- Authenticated paid users can create saved docs.
- Paid users can autosave docs.
- Paid users can list, search, open, and archive docs.
- Paid users can share and unshare docs.
- Shared docs have public HTML and raw Markdown URLs.
- The CLI can authenticate and perform the core document commands.
- Docs are private unless shared.
- Server-side authorization enforces the paid save/share/API boundary.

## Non-Goals For V1

- Realtime collaboration.
- Team workspaces.
- Rich-text editing.
- Full permissions.
- Comments.
- Mobile apps.
- Offline sync across devices.
- Import from GitHub.
- AI generation inside the app.

## Success Criteria

- A user can open `jotter.md` and write Markdown immediately.
- The editor feels calm and uncluttered.
- A paid user can save and share a doc.
- An agent can fetch a shared doc as raw Markdown.
- An agent can create, update, read, and share docs through the CLI.
- The local MVP runs with one documented command path.
- The deployed MVP has working auth, billing gate, persistence, and public sharing.
