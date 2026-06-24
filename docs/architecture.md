# jotter.md Architecture

## Summary

Use a boring SaaS stack with a first-class CLI.

The browser app is the writing surface.

The Go API owns persistence, auth checks, billing entitlements, sharing, and public rendering.

The Go CLI talks to the same API.

## Stack

- Web: Next.js, React, TypeScript.
- API: Go HTTP server.
- CLI: Go.
- Database: Postgres.
- Billing: Stripe Checkout and Stripe Billing.
- Editor: CodeMirror 6.
- Markdown preview: remark, rehype, remark-gfm, Mermaid.
- Public rendering: server-side sanitized HTML.
- Deployment: GCP Cloud Run.
- Database hosting: Cloud SQL for Postgres.

## Why This Stack

Next.js gives a strong browser app without much ceremony.

Go is a good fit for the API and CLI.

Postgres is enough for users, docs, search, versions, billing state, and API tokens.

Cloud Run keeps operational complexity low.

Stripe gives the fastest path to paid save and sync.

## Main Components

### Web App

The web app owns the editor, preview, auth UI, document list, and share controls.

The editor route should be visually minimal and should avoid the feeling of an admin dashboard.

Anonymous mode stores the current document locally in the browser.

Paid mode autosaves through the API.

### API

The API owns server-side truth.

It exposes document CRUD, content replace, public share, raw Markdown, auth, billing webhook handling, and API token management.

It must enforce paid-only save/share/API access.

### CLI

The CLI is a core product surface.

It should support human terminal workflows and agent workflows.

It should provide plain text output by default and JSON output with a flag.

It should store auth tokens in the user's local config directory.

### Database

The database stores saved docs only.

Anonymous drafts do not touch the database.

Docs are private by default.

Public access depends on an explicit share token.

## Suggested Data Model

### users

- `id`
- `email`
- `created_at`
- `updated_at`

### subscriptions

- `id`
- `user_id`
- `stripe_customer_id`
- `stripe_subscription_id`
- `status`
- `current_period_end`
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

## API Shape

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

## Auth And Entitlements

Reading and writing private docs requires auth.

Creating saved docs requires an active paid entitlement.

Replacing saved doc content requires an active paid entitlement.

Sharing docs requires an active paid entitlement.

Public shared docs do not require auth.

CLI/API token access requires an active paid entitlement.

## Error Behavior

Private or unshared public docs return 404 from public routes.

Unauthenticated private API requests return 401.

Authenticated users without paid access receive 402 for paid-only operations.

Unauthorized access to another user's private document returns 404.

Invalid Markdown should still save because Markdown is text.

Invalid Mermaid should render as an inline preview error without blocking save.

## Local Development

Phase 1 should document one local path for:

- Web app.
- API server.
- CLI.
- Postgres.
- Migrations.
- Tests.

Docker Compose is acceptable for local Postgres in this new repo.

## Deployment

Phase 2 deploys to GCP.

Expected services:

- Cloud Run for the API and web runtime if combined.
- Cloud SQL for Postgres.
- Secret Manager for application secrets.
- Artifact Registry for container images.
- Cloud Build or GitHub Actions for build and deploy.

Owain will create the GCP project and provide project IDs/secrets when needed.
