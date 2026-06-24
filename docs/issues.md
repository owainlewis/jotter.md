# jotter.md Issue Plan

This file is the source plan for GitHub Issues.

The live execution plan is the GitHub project board.

## Phases

Phase 1: MVP runs locally.

Phase 2: MVP deployed to GCP.

## Shared Decisions

- Docs are Markdown only.
- Anonymous docs stay browser-local.
- Paid saved docs are stored in Postgres.
- Saved docs are private by default.
- Public docs are available only through explicit unguessable share URLs.
- Public V1 access is read-only for anyone with the URL.
- `Ctrl+R` and `Cmd+R` switch between edit and view modes.
- The CLI is part of V1.
- The deployed target is GCP.

## Phase 1 Issues

### 1. Scaffold the monorepo and local developer workflow

Goal: Create the initial application scaffold and local commands.

Context: The repo currently starts docs-first.

Relevant docs: `docs/prd.md`, `docs/architecture.md`.

Proposed approach: Add a Next.js web app, Go API, Go CLI, shared config, local Postgres, migrations, tests, linting, and README setup instructions.

Acceptance criteria:

- The repo has `apps/web`, `server`, and `cli` directories.
- A local Postgres database can be started or connected.
- The web app can run locally.
- The API can run locally.
- The CLI can build locally.
- README includes exact local setup commands.
- CI or local quality commands are documented.

Verify:

- Run the documented install command.
- Run the documented API command.
- Run the documented web command.
- Run the documented CLI build command.
- Run the documented test command.

Out of scope: Product UI, auth, billing, and deployed infrastructure.

### 2. Implement the anonymous browser scratchpad

Goal: Build the free transient writing surface.

Context: Free users should be able to write immediately without an account.

Relevant docs: `docs/prd.md`.

Proposed approach: Create the homepage/editor route with a local draft stored in browser storage.

Acceptance criteria:

- Visiting the app opens a blank Markdown writing surface.
- The homepage tag appears as `A Markdown notepad for agents and humans.`
- Anonymous writing does not call document save APIs.
- Draft text survives refresh in the same browser.
- Export downloads a `.md` file.
- The UI is minimal and writing-focused.

Verify:

- Open the app in a browser.
- Type Markdown.
- Refresh and confirm the draft remains.
- Export and inspect the `.md` file.
- Check network requests do not include saved document writes.

Out of scope: Paid save, auth, CLI, and sharing.

### 3. Add edit and view modes with Markdown preview

Goal: Support the core writing/reading loop.

Context: The editor should copy iA Writer minimalism and use mode switching instead of default split view.

Relevant docs: `docs/prd.md`.

Proposed approach: Use CodeMirror 6 for edit mode and sanitized Markdown rendering for view mode.

Acceptance criteria:

- Edit mode shows raw Markdown.
- View mode shows rendered Markdown.
- `Ctrl+R` toggles edit/view mode.
- `Cmd+R` toggles edit/view mode on macOS.
- The browser refresh shortcut is prevented only inside the app editor context.
- Preview supports headings, paragraphs, lists, links, blockquotes, tables, code blocks, and inline code.
- View mode has polished typography and generous spacing.

Verify:

- Toggle modes with keyboard shortcuts.
- Render a fixture document covering supported Markdown.
- Run frontend tests for mode switching and rendering.
- Inspect desktop and mobile browser layouts.

Out of scope: Mermaid, saved docs, and collaboration.

### 4. Add Mermaid diagram preview

Goal: Make Markdown diagrams useful for scripts, specs, and agent context.

Context: Owain writes scripts and docs that need Markdown diagrams.

Relevant docs: `docs/prd.md`.

Proposed approach: Render fenced `mermaid` code blocks in preview mode with Mermaid.

Acceptance criteria:

- Valid Mermaid blocks render as diagrams in preview mode.
- Invalid Mermaid blocks show a readable inline error.
- Invalid Mermaid does not block editing, saving, or previewing the rest of the doc.
- Raw Markdown export preserves the original Mermaid block.

Verify:

- Preview a valid flowchart.
- Preview an invalid diagram.
- Export and confirm source Markdown is unchanged.
- Run frontend tests for Mermaid block handling where practical.

Out of scope: Visual Mermaid editing.

### 5. Implement auth and paid entitlement checks

Goal: Add the account and paid-access foundation.

Context: Saving docs is the paid boundary.

Relevant docs: `docs/prd.md`, `docs/architecture.md`.

Proposed approach: Add user auth, session handling, subscription state, and server-side entitlement checks.

Acceptance criteria:

- Users can sign up and sign in locally.
- The API exposes the current user and entitlement state.
- Paid-only operations are denied without an active entitlement.
- Paid-only failures return a consistent 402 response.
- Private API routes require auth.
- Unauthorized access to another user's private doc returns 404.

Verify:

- Run API auth tests.
- Run web auth flow locally.
- Attempt paid-only operations as anonymous, unpaid, and paid test users.

Out of scope: Stripe production setup and deployment.

### 6. Implement saved documents

Goal: Let paid users create, edit, autosave, list, search, and archive docs.

Context: Saved docs are the first paid feature.

Relevant docs: `docs/prd.md`, `docs/architecture.md`.

Proposed approach: Add document database tables, document API routes, autosave in the editor, and a minimal saved-doc list.

Acceptance criteria:

- Paid users can create saved docs.
- Paid users can autosave document content.
- Paid users can rename docs through first heading or title metadata.
- Paid users can list saved docs.
- Paid users can search saved docs.
- Paid users can archive docs.
- Unpaid users cannot create or save docs.
- Docs are scoped to their owner.

Verify:

- Run migration tests.
- Run API document tests.
- Run web tests for autosave and list behavior.
- Confirm unpaid save attempts fail with 402.

Out of scope: Sharing, CLI, document history, and teams.

### 7. Implement public sharing and raw Markdown URLs

Goal: Allow paid users to share read-only docs by URL.

Context: Docs are private unless explicitly shared.

Relevant docs: `docs/prd.md`, `docs/architecture.md`.

Proposed approach: Add share/unshare API routes, public HTML rendering, and public raw Markdown routes.

Acceptance criteria:

- Saved docs are private by default.
- Paid users can share a doc.
- Sharing creates or enables an unguessable public token.
- Anyone with the public URL can read the HTML view.
- Anyone with the `.md` URL can read raw Markdown.
- Anyone with the URL cannot edit the doc.
- Unsharing disables both public routes.
- Private or unshared docs return 404 from public routes.

Verify:

- Run API sharing tests.
- Share a doc and open its public HTML URL.
- Open the public `.md` URL.
- Unshare the doc and confirm both URLs return 404.

Out of scope: Private invites, comments, and collaboration.

### 8. Implement the CLI MVP

Goal: Make `jotter.md` useful from terminals and coding agents.

Context: The CLI is a V1 product surface, not a later add-on.

Relevant docs: `docs/prd.md`, `docs/architecture.md`.

Proposed approach: Build a Go CLI that authenticates, stores tokens locally, and calls the document API.

Acceptance criteria:

- `jotter auth login` stores a usable local token.
- `jotter new` creates a saved doc for paid users.
- `jotter list` lists saved docs.
- `jotter push` creates or updates a doc from a file.
- `jotter pull` writes a doc to a file.
- `jotter cat` prints doc Markdown to stdout.
- `jotter append` appends Markdown from a file or stdin.
- `jotter replace` replaces doc content from a file or stdin.
- `jotter share` returns the public URL.
- `jotter unshare` disables public access.
- `jotter raw` returns the raw Markdown URL for shared docs.
- CLI commands have JSON output support.

Verify:

- Run CLI unit tests.
- Run CLI against local API.
- Exercise the command list against a paid test user.
- Confirm unpaid users cannot use paid document commands.

Out of scope: Homebrew distribution and shell completions.

### 9. Add document history

Goal: Provide a safety net for saved docs.

Context: Paid users should be able to recover earlier content.

Relevant docs: `docs/prd.md`, `docs/architecture.md`.

Proposed approach: Store document versions on meaningful saves and expose a minimal version list and restore flow.

Acceptance criteria:

- Saved docs record versions at safe intervals or explicit saves.
- Users can list versions for their own docs.
- Users can restore a previous version.
- Version restore creates a new latest version.
- Version access is owner-scoped.

Verify:

- Run API version tests.
- Save several edits and inspect versions.
- Restore a version and confirm current content changes.

Out of scope: Visual diffs.

### 10. Add Phase 1 quality pass and local MVP acceptance

Goal: Make the local MVP coherent enough to deploy.

Context: Phase 2 should start only after the local product is usable.

Relevant docs: `docs/prd.md`, `docs/architecture.md`.

Proposed approach: Add end-to-end tests, visual QA, docs cleanup, and local smoke scripts.

Acceptance criteria:

- A new developer can run the local MVP from README instructions.
- Anonymous scratchpad flow works.
- Paid saved-doc flow works with seeded local entitlement.
- Public sharing flow works.
- CLI flow works against local API.
- Tests cover critical auth, document, sharing, and CLI behavior.
- Visual QA confirms the editor is minimal and readable.

Verify:

- Run the full documented test command.
- Run local smoke script.
- Complete anonymous, paid, share, and CLI flows manually.

Out of scope: GCP deployment.

## Phase 2 Issues

### 11. Prepare GCP infrastructure plan

Goal: Define the exact GCP deployment shape before provisioning.

Context: Owain will create the GCP project and provide project details.

Relevant docs: `docs/architecture.md`.

Proposed approach: Document required services, IAM roles, secrets, domains, environments, and deployment commands.

Acceptance criteria:

- Required GCP APIs are listed.
- Required secrets are listed.
- Cloud Run services are named.
- Cloud SQL instance requirements are defined.
- Artifact Registry requirements are defined.
- Domain and HTTPS plan is documented.
- A checklist exists for values Owain must provide.

Verify:

- Review the deployment doc.
- Confirm every environment variable has an owner and source.

Out of scope: Creating the GCP project.

### 12. Containerize web, API, and CLI build artifacts

Goal: Produce deployable artifacts for GCP.

Context: Phase 2 uses Cloud Run and Artifact Registry.

Relevant docs: `docs/architecture.md`.

Proposed approach: Add Dockerfiles, production build commands, and image publishing scripts or CI jobs.

Acceptance criteria:

- The API/web runtime can be built into a production container.
- The container runs locally.
- The container exposes health checks.
- The CLI can be built as release artifacts.
- Build commands are documented.

Verify:

- Build the production image locally.
- Run the image locally.
- Hit the health endpoint.
- Build CLI binaries locally.

Out of scope: GCP service creation.

### 13. Provision Cloud SQL and run migrations

Goal: Set up production Postgres and migration flow.

Context: Saved docs and billing state need durable storage.

Relevant docs: `docs/architecture.md`.

Proposed approach: Configure Cloud SQL, database users, connection secrets, and migration execution.

Acceptance criteria:

- Cloud SQL Postgres is provisioned.
- Database credentials are stored in Secret Manager.
- Migrations can run against the deployed database.
- Rollback guidance is documented.
- The API can connect to Cloud SQL from Cloud Run.

Verify:

- Run migrations against the target database.
- Deploy API with DB connection.
- Confirm readiness endpoint reports database connectivity.

Out of scope: App domain routing.

### 14. Configure Stripe for production entitlements

Goal: Enable the paid save/sync boundary in production.

Context: Paid status must be driven by Stripe webhooks.

Relevant docs: `docs/prd.md`, `docs/architecture.md`.

Proposed approach: Add production Stripe products, checkout flow, customer portal, webhook handling, and entitlement sync.

Acceptance criteria:

- Checkout starts from the app.
- Successful payment grants paid entitlement.
- Canceled or failed subscriptions remove paid entitlement according to policy.
- Stripe webhooks are verified.
- Users can open the billing portal.
- Stripe secrets are stored in Secret Manager.

Verify:

- Complete Stripe test-mode checkout in deployed environment.
- Receive and process webhook events.
- Confirm entitlement changes in the app and API.

Out of scope: Multiple plans and coupons.

### 15. Deploy the MVP to Cloud Run

Goal: Make the MVP publicly available on GCP.

Context: This completes the deployed MVP.

Relevant docs: `docs/architecture.md`.

Proposed approach: Deploy the app/API container, configure environment variables, connect Cloud SQL, configure domain, and validate public routes.

Acceptance criteria:

- The app is reachable over HTTPS.
- The custom domain is configured.
- Auth works in production.
- Paid entitlement works in production.
- Saved docs persist.
- Public share URLs work.
- Raw `.md` share URLs work.
- Private docs are not publicly accessible.
- The CLI can target the production API.

Verify:

- Run production smoke tests.
- Complete anonymous scratchpad flow.
- Complete paid save flow.
- Complete share and unshare flow.
- Fetch a shared `.md` URL from the CLI or curl.

Out of scope: Team collaboration and realtime editing.

### 16. Add deployment CI/CD and release checklist

Goal: Make production updates repeatable.

Context: Manual deploys are acceptable early, but the MVP needs a documented release path.

Relevant docs: `docs/architecture.md`.

Proposed approach: Add GitHub Actions or Cloud Build for tests, image build, deploy, and CLI artifact release.

Acceptance criteria:

- Main branch runs tests.
- Deploy workflow builds and publishes the container.
- Deploy workflow updates Cloud Run.
- CLI release artifacts are produced.
- Required secrets are documented.
- Release checklist covers migration, deploy, smoke test, and rollback.

Verify:

- Run CI on a pull request.
- Run deploy workflow in a controlled environment.
- Confirm release checklist is accurate.

Out of scope: Multi-region deployment and enterprise release process.
