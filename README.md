# jotter.md

A Markdown notepad for agents and humans.

`jotter.md` is a minimal Markdown writing app with a CLI-first workflow.

Free users can write transient docs in the browser.

Paid users can save, sync, share, and use the CLI/API.

## Product

The product reference is GitHub Gist with a better writing surface.

The visual reference is iA Writer-style minimalism.

The technical wedge is agent usefulness.

Every saved doc is plain Markdown, private by default, and addressable through web, CLI, and API.

## Docs

- [PRD](docs/prd.md)
- [Architecture](docs/architecture.md)
- [Issue plan](docs/issues.md)

## Local Development

Prerequisites:

- Node.js 22 or newer.
- npm 10 or newer.

Install dependencies:

```sh
npm install
```

Run the web app:

```sh
npm run dev:web
```

The app runs at `http://localhost:3000` by default.

If that port is busy, Next.js prints the alternate local URL.

Run lint:

```sh
npm run lint
```

Run tests:

```sh
npm test
```

Run browser acceptance tests:

```sh
npm run test:e2e:web
```

Build the web app:

```sh
npm run build:web
```

## Phase 1 Visual QA

Open the app with `npm run dev:web`.

Check desktop at 1440 by 900.

Check mobile at 390 by 844.

Confirm typing and editing Markdown works.

Refresh and confirm the local draft remains.

Clear the draft and confirm it is removed.

Toggle edit and view modes with the visible controls.

Toggle edit and view modes with `Ctrl+R` or `Cmd+R`.

Preview headings, paragraphs, lists, links, blockquotes, tables, code blocks, and inline code.

Preview one valid Mermaid diagram.

Preview one invalid Mermaid diagram and confirm the rest of the document still works.

Export a `.md` file and confirm it contains the exact Markdown source.

Copy Markdown and confirm it can be pasted elsewhere.

Check for console errors, horizontal overflow, overlap, clipped text, unreadable text, and broken responsive layout.

## Phases

Phase 1 gets the anonymous editor running locally.

Phase 2 deploys the anonymous editor to GCP.

Phase 3 adds personal saved docs, sharing, API, and CLI for Owain's own use.

Phase 4 adds payments and the public paid tier.

## Repository Status

This repository currently contains the product and implementation plan.

The implementation plan is in [docs/issues.md](docs/issues.md).
