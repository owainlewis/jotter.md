# AGENTS.md

Guidance for AI agents and contributors working in this repository.

## What This Is

`jotter.md` is a Markdown notepad for agents and humans.

The product is intentionally small.

Free users can write transient Markdown in the browser.

Paid users can save docs, share docs by URL, and use the CLI/API.

## Product Principles

- Keep the writing surface calm and minimal.
- Copy the restraint of iA Writer without copying its brand.
- Treat the CLI as a first-class product surface.
- Store saved documents as plain Markdown.
- Make private the default.
- Make public sharing explicit.
- Make raw `.md` URLs easy for agents to consume.

## Engineering Principles

- Make the smallest complete change.
- Prefer boring infrastructure.
- Prefer vertical slices over layer-by-layer work.
- Keep auth, billing, sharing, and persistence server-enforced.
- Do not add collaboration until the V1 share model is shipped.
- Do not add complex rich-text behavior.

## Planned Stack

- Web: Next.js, React, TypeScript.
- API: Go HTTP server.
- CLI: Go.
- Database: Postgres.
- Billing: Stripe Checkout and Billing.
- Editor: CodeMirror 6.
- Markdown preview: remark, rehype, remark-gfm, Mermaid.
- Deployment: GCP Cloud Run and managed Postgres.

## Quality Bar

Every implementation issue should include:

- A clear goal.
- Context and relevant docs.
- Acceptance criteria.
- Concrete verification steps.
- Explicit out-of-scope notes.

## GitHub Workflow

Use the GitHub CLI, `gh`, for GitHub Issues and Projects work in this repo.

Repository:

- `owainlewis/jotter.md`
- URL: `https://github.com/owainlewis/jotter.md`

Project:

- Owner: `owainlewis`
- Project number: `14`
- Title: `jotter.md MVP`
- URL: `https://github.com/users/owainlewis/projects/14`
- Status field options: `Todo`, `In Progress`, `Done`

Useful commands:

```sh
gh issue list --repo owainlewis/jotter.md --state all --limit 100
gh issue view <number> --repo owainlewis/jotter.md
gh project item-list 14 --owner owainlewis --limit 100
gh project field-list 14 --owner owainlewis
```

Treat GitHub Issues and the project board as the live execution tracker.

Check `docs/issues.md` before creating or changing issues because the local plan may be newer than the live board.

## Writing Style

Be concise, direct, and useful.

Explain simply.

Never use em dashes.

Use one sentence per line in long Markdown.
