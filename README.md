# passage.md

A Markdown notepad for agents and humans.

`passage.md` is a minimal Markdown writing app with a CLI-first workflow.

Free users can write transient docs in the browser.

Paid users can save, sync, export, share, customize themes, and use the CLI/API.

## Product

The product reference is GitHub Gist with a better writing surface.

The visual reference is iA Writer-style minimalism.

The technical wedge is agent usefulness.

Every saved doc is plain Markdown, private by default, and addressable through web, CLI, and API.

## Docs

- [PRD](docs/prd.md)
- [Architecture](docs/architecture.md)
- [Project board](https://github.com/users/owainlewis/projects/14)
- [Goal prompts](docs/goal-prompts.md)
- [Local MVP demo goal](docs/local-mvp-demo-goal.md)

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

Build the web app:

```sh
npm run build:web
```

## Phases

Phase 1 gets the anonymous editor running locally.

Phase 2 deploys the anonymous editor to GCP.

Phase 3 adds personal saved docs, sharing, API, and CLI for Owain's own use.

Phase 4 adds payments and the public paid tier.

## Repository Status

The anonymous browser editor foundation is built.

The implementation plan lives on the [GitHub project board](https://github.com/users/owainlewis/projects/14), which is the source of truth for issues.
