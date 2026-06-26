# passage.md PRD

## Summary

`passage.md` is a Markdown notepad for agents and humans.

It starts as a clean browser writing surface for transient Markdown.

It should feel like GitHub Gist with better writing, better preview, and better agent workflows.

The first version is for Owain's own workflow and for validating the product shape.

Saving, sharing, CLI access, API access, and payments come in later phases.

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

The first problem to solve is simpler.

Owain needs a polished local Markdown scratchpad that can become the foundation for saved docs, CLI workflows, and sharing.

## Users

Primary users:

- Owain writing notes, scripts, specs, prompts, and architecture docs.
- Developers writing transient Markdown in a calm browser surface.
- AI coding agents that need reliable Markdown context later.
- Technical founders who want simple shareable Markdown without repo friction later.

Secondary users:

- Writers who prefer Markdown.
- Teams that need lightweight shared technical notes later.

## Positioning

`passage.md` is a minimal Markdown notepad.

It is browser-first for humans.

It becomes CLI-first for agents once persistence exists.

It is not a full knowledge base.

It is not a rich-text editor.

It is not a docs platform with heavy permissions in V1.

## Product Model By Phase

### Phase 1: Local Anonymous MVP

- Open the browser editor.
- Write Markdown.
- Preview Markdown.
- Preview Mermaid diagrams.
- Keep a transient local draft.
- Copy Markdown from the editor.
- No account required.
- No database save.
- No CLI.
- No hosted deployment requirement.

### Phase 2: Deployed Anonymous MVP

- Deploy the anonymous editor to GCP.
- Keep the same no-account writing flow.
- Keep drafts browser-local.
- Add production build, container, HTTPS, domain, and smoke tests.
- Do not add public user accounts yet.

### Phase 3: Personal Saved Docs

- Add auth for Owain only.
- Add Postgres-backed saved docs.
- Add autosave.
- Add list, search, open, archive, and export.
- Add public share URLs and raw `.md` URLs for saved docs.
- Add the CLI and API against the same document backend.
- Keep access private and controlled.
- Do not add a general paid tier yet.

### Phase 4: Payments And Public Paid Tier

- Add Stripe Checkout and Billing.
- Add paid entitlements.
- Let paid users save, sync, export, share, and use the CLI/API.
- Add paid appearance features such as dark mode and themes.
- Keep anonymous users limited to transient browser drafts.

## Core UX

The default screen is a writing surface.

There should be no dashboard feeling inside the editor.

The editor has a thin top bar, centered title, and minimal actions.

The bottom bar can show mode, word count, local save state, and small controls.

`Ctrl+R` switches between edit and view mode.

`Cmd+R` does the same on macOS.

Edit mode shows raw Markdown.

View mode shows rendered Markdown.

The default early experience is edit or view, not split view.

Split view can come later.

## Anonymous Drafts

Anonymous drafts are stored only in browser storage.

Anonymous drafts do not touch the database.

Anonymous drafts should survive refresh in the same browser.

Anonymous drafts can be cleared by the user.

Anonymous users can copy Markdown from the editor.

File export is part of the paid tier once payments exist.

## Saved Documents

Saved documents are out of scope for Phase 1 and Phase 2.

Phase 3 adds saved documents for Owain's own use.

Phase 4 turns saved documents into the paid product boundary.

All saved docs are private by default.

A doc becomes public only when the owner shares it.

Anyone with the shared URL can read the doc.

Anyone with the shared URL cannot edit the doc in the first sharing model.

Unsharing disables public access.

Private docs return 404 from public routes.

## Public URLs

Human HTML view:

```txt
https://passage.md/d/share_abc123
```

Raw Markdown view:

```txt
https://passage.md/d/share_abc123.md
```

The raw `.md` route is required once sharing exists because agents need stable Markdown context URLs.

Durable server share links are a paid feature.

Paid share pages should be unbranded.

They should not show Passage navigation, upgrade prompts, product marketing, or visible app branding.

The page should feel like the user's document.

Anonymous fragment share links can stay free because they do not touch the backend and help people understand the product.

## Anonymous Sharing

Anonymous users can share a document before any account or server exists.

The share link carries the document inside the URL fragment after the `#`.

The fragment stays in the browser and never reaches a server.

This keeps the document private to whoever holds the link with no backend.

The shared view renders the document only, with no sidebar and no editor chrome.

The anonymous share route is:

```txt
https://passage.md/d#<encoded-markdown>
```

Large documents produce long links, so this model suits the anonymous tier.

Saved documents move to opaque token links once accounts and the server exist.

The server share routes stay `https://passage.md/d/<token>` and `https://passage.md/d/<token>.md`.

The shared view is the same in both models, so only the data source changes.

Shared HTML must be sanitized before this ships publicly because a crafted link can carry hostile Markdown.

## Pricing And Storage

The free tier writes, previews, copies Markdown, and can use anonymous fragment share links in the browser with no account.

The paid tier saves documents on the server, syncs them, exports files, manages durable share links, and unlocks the CLI and API.

Paid users also get minor product comforts:

- Dark mode.
- Additional writing themes.
- File export.
- Durable public share links.
- Raw `.md` share URLs for agents.
- Unbranded public share pages.

Do not make free mode feel broken.

Free mode should be useful as a transient browser notepad.

Paid mode starts when users want persistence, portability, agent access, or customization.

The pricing posture should be cheap enough that upgrading feels obvious once someone likes the app.

The model is a small useful product with a low monthly price, high daily utility, and quiet stickiness from saved docs and agent workflows.

Do not add heavy enterprise packaging for V1.

Do not make the paid tier feel expensive for an individual user.

Billing uses Stripe Checkout and Stripe Billing.

Offer one Pro product with a monthly price and an annual price.

The annual price should save about twenty to twenty five percent.

A one time lifetime price is an optional launch promotion.

A working target is five dollars monthly or forty eight dollars annual.

Set limits as anti abuse guardrails, not as a storage meter.

Cap each document at one megabyte, which is very large for Markdown.

Treat saved document counts as effectively unlimited under fair use.

Markdown text is cheap to store relative to subscription revenue.

Ten million documents at a realistic ten kilobytes each is about one hundred gigabytes raw.

Postgres compresses Markdown text, so stored size is smaller again.

Storage cost at that scale is tens of dollars per month, which is small against paid revenue.

Price on access and value, not on bytes.

## CLI

The CLI is part of the saved-doc product, not the anonymous scratchpad.

It should arrive in Phase 3 after the document API exists.

It should work well in terminals, shell scripts, and coding-agent sessions.

Core commands:

```sh
passage auth login
passage new "Launch script"
passage list
passage push script.md
passage pull doc_123
passage cat doc_123
passage append doc_123 notes.md
passage replace doc_123 script.md
passage share doc_123
passage unshare doc_123
passage url doc_123
passage raw doc_123
passage open doc_123
```

The CLI should output plain text by default.

It should support JSON output for agents and scripts.

## Phase 1 Requirements

- Anonymous users can write in the browser without an account.
- Anonymous drafts persist locally in the browser.
- Anonymous users can clear the local draft.
- Anonymous users can export Markdown.
- Edit mode shows raw Markdown.
- View mode renders Markdown.
- View mode renders Mermaid diagrams.
- Invalid Mermaid shows a readable inline error.
- The editor feels calm and uncluttered.
- The local MVP runs with one documented command path.
- Tests cover the core editor, local draft, export, preview, and keyboard shortcut behavior.

## Later Requirements

- Authenticated personal users can create saved docs.
- Saved docs can autosave.
- Saved docs can be listed, searched, opened, archived, and exported.
- Shared docs have public HTML and raw Markdown URLs.
- The CLI can authenticate and perform the core document commands.
- Server-side authorization enforces private docs, sharing, API access, and paid boundaries once those features exist.

## Non-Goals For The Early MVP

- User accounts.
- Database save.
- Paid tiers.
- Stripe.
- CLI.
- Public share URLs.
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

- A user can open `passage.md` locally and write Markdown immediately.
- The editor feels calm and uncluttered.
- A Markdown draft survives refresh in the same browser.
- A user can switch between edit and view modes without losing text.
- A user can export a `.md` file.
- Mermaid diagrams render in preview mode.
- The local MVP runs with one documented command path.
- The repo has an agent-ready plan for the next phases.
