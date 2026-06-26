# jotter.md Architecture

## Summary

Use a boring stack and grow it in phases.

Phase 1 is a local browser app with no server dependency beyond the dev server.

Phase 2 deploys the anonymous editor.

Phase 3 adds the Go API, Postgres, saved docs, public sharing, and CLI.

Phase 4 adds Stripe and the public paid tier.

## Stack

- Web: Next.js, React, TypeScript.
- Editor: CodeMirror 6.
- Markdown preview: remark, rehype, remark-gfm, Mermaid.
- API: Go HTTP server, added when saved docs start.
- CLI: Go, added when saved docs start.
- Database: Postgres, added when saved docs start.
- Billing: Stripe Checkout and Stripe Billing, added after the personal saved-doc phase.
- Public rendering: server-side sanitized HTML once public sharing exists.
- Deployment: GCP Cloud Run.
- Database hosting: Cloud SQL for Postgres once persistence exists.

## Why This Stack

Next.js gives a strong browser app without much ceremony.

CodeMirror 6 gives a proper Markdown editor without building editor behavior from scratch.

Go is a good fit for the API and CLI once the product needs persistence and agent workflows.

Postgres is enough for users, docs, search, versions, billing state, and API tokens.

Cloud Run keeps operational complexity low.

Stripe gives the fastest path to paid save and sync when the public paid tier is ready.

## Phase 1 Shape

Phase 1 should ship as a polished local anonymous app.

The app stores the current draft in browser storage.

The app does not need a backend API.

The app does not need Postgres.

The app does not need auth.

The app should still be structured so a saved-document backend can be added without rewriting the editor.

Recommended Phase 1 directories:

```txt
apps/web
docs
```

Optional Phase 1 directories:

```txt
packages/markdown
packages/ui
```

Only add shared packages if they remove real duplication.

## Web App

The web app owns the editor, preview, export, local draft persistence, and keyboard shortcuts.

The default route should be the writing surface.

There should be no dashboard feeling inside the editor.

Anonymous mode stores the current document locally in the browser.

The editor should be built so its state can later be connected to saved docs.

## Markdown Rendering

Edit mode shows raw Markdown.

View mode renders sanitized Markdown.

Preview should support:

- Headings.
- Paragraphs.
- Lists.
- Links.
- Blockquotes.
- Tables.
- Code blocks.
- Inline code.
- Mermaid fenced blocks.

Invalid Markdown should still render as normal text where possible.

Invalid Mermaid should render as an inline preview error and should not break the rest of the document.

Raw Markdown export must preserve the original source.

## Local Draft Storage

Use browser storage for the anonymous draft.

The initial implementation can use `localStorage`.

Store enough metadata for a calm user experience:

- Draft body.
- Last edited timestamp.
- Optional title.

Do not send anonymous drafts to a server.

Do not introduce an account concept in Phase 1.

## Phase 3 API

The API owns server-side truth once saved docs exist.

It exposes document CRUD, content replace, public share, raw Markdown, auth, and API token management.

It must enforce private docs and later paid-only save/share/API access.

Browser and CLI should use the same document API.

Suggested routes:

```txt
GET    /api/v1/me
GET    /api/v1/documents
POST   /api/v1/documents
GET    /api/v1/documents/:id
PATCH  /api/v1/documents/:id
GET    /api/v1/documents/:id/content
PUT    /api/v1/documents/:id/content
DELETE /api/v1/documents/:id
POST   /api/v1/documents/:id/share
DELETE /api/v1/documents/:id/share
GET    /d/:token
GET    /d/:token.md
```

## Phase 3 CLI

The CLI is a core product surface once saved docs exist.

It should support human terminal workflows and agent workflows.

It should provide plain text output by default and JSON output with a flag.

It should store auth tokens in the user's local config directory.

## Suggested Data Model

The database starts in Phase 3.

### users

- `id`
- `email`
- `created_at`
- `updated_at`

### documents

- `id`
- `owner_user_id`
- `public_id`
- `title`
- `body`
- `is_public`
- `public_token`
- `archived_at`
- `created_at`
- `updated_at`

### document_versions

- `id`
- `document_id`
- `body`
- `created_at`
- `created_by`

### api_tokens

- `id`
- `user_id`
- `name`
- `token_hash`
- `last_used_at`
- `created_at`
- `revoked_at`

### subscriptions

Subscriptions start in Phase 4.

- `id`
- `user_id`
- `stripe_customer_id`
- `stripe_subscription_id`
- `status`
- `current_period_end`
- `created_at`
- `updated_at`

## Auth And Entitlements

Phase 1 has no auth.

Phase 2 can remain no-auth if the deployed app is anonymous only.

Phase 3 adds auth for Owain's personal saved docs.

Phase 4 adds public paid entitlements.

Reading and writing private docs requires auth once private docs exist.

Creating saved docs requires the personal allowlist in Phase 3.

Creating saved docs requires an active paid entitlement in Phase 4.

Replacing saved doc content requires the same entitlement check.

Sharing docs requires the same entitlement check.

Public shared docs do not require auth.

CLI/API token access requires the same entitlement check.

## Error Behavior

Private or unshared public docs return 404 from public routes.

Unauthenticated private API requests return 401.

Authenticated users without access receive 403 during the personal allowlist phase.

Authenticated users without paid access receive 402 once payments exist.

Unauthorized access to another user's private document returns 404.

Invalid Markdown should still save because Markdown is text.

Invalid Mermaid should render as an inline preview error without blocking save.

## Local Development

Phase 1 should document one local path for:

- Web app install.
- Web app dev server.
- Web app tests.
- Browser smoke test.

Phase 3 should add one local path for:

- API server.
- CLI.
- Postgres.
- Migrations.
- API tests.
- CLI tests.

Docker Compose is acceptable for local Postgres once persistence exists.

## Deployment

Phase 2 deploys the anonymous editor to GCP.

Expected services:

- Cloud Run for the web runtime or static-serving container.
- Secret Manager only if runtime secrets are needed.
- Artifact Registry for container images.
- Cloud Build or GitHub Actions for build and deploy.

Phase 3 adds:

- Cloud Run for the Go API.
- Cloud SQL for Postgres.
- Secret Manager for database credentials and auth secrets.

Phase 4 adds:

- Stripe secrets.
- Stripe webhook handling.
- Billing portal configuration.

Owain will create the GCP project and provide project IDs, domains, and secrets when needed.
