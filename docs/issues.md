# jotter.md Issue Plan

This file is the source plan for GitHub Issues.

The live execution plan can become a GitHub project board later.

Each task is sized for one focused agent run, review, and rollback.

## Phases

Phase 0: Repo planning and scaffolding.

Phase 1: Local anonymous MVP.

Phase 2: Deployed anonymous MVP on GCP.

Phase 3: Personal saved-doc product for Owain.

Phase 4: Payments and public paid tier.

## Shared Decisions

- Docs are Markdown only.
- Anonymous docs stay browser-local.
- Phase 1 has no auth, database, API, CLI, or billing.
- Phase 2 deploys the anonymous app before persistence exists.
- Phase 3 adds saved docs for Owain only.
- Phase 4 adds Stripe and the public paid tier.
- Saved docs are private by default once saved docs exist.
- Public docs are available only through explicit unguessable share URLs.
- Public shared docs are read-only for anyone with the URL.
- Raw `.md` URLs are required once sharing exists.
- `Ctrl+R` and `Cmd+R` switch between edit and view modes.
- The CLI is part of the saved-doc product, not the anonymous scratchpad.
- The deployed target is GCP.

## Phase 0 Issues

### 1. Scaffold the web app and developer workflow

Goal: Create the initial Next.js web app and local command path.

Context: The repo currently starts docs-first.

Relevant docs: `docs/prd.md`, `docs/architecture.md`.

Proposed approach: Add `apps/web`, package manager config, TypeScript, linting, tests, formatting, and README setup instructions.

Acceptance criteria:

- The repo has an `apps/web` Next.js app.
- The web app can run locally.
- The web app has TypeScript configured.
- The web app has lint and test commands.
- README includes exact local setup commands.
- CI or local quality commands are documented.

Verify:

- Run the documented install command.
- Run the documented web command.
- Run the documented lint command.
- Run the documented test command.

Out of scope: Product UI, auth, database, API, CLI, billing, and deployment.

### 2. Add baseline app shell and styling system

Goal: Establish the visual foundation for a calm writing surface.

Context: The editor should be minimal and should not feel like an admin dashboard.

Relevant docs: `docs/prd.md`, `docs/architecture.md`, `AGENTS.md`.

Proposed approach: Add the root route, app layout, global CSS, font choice, color tokens, and a simple responsive shell.

Acceptance criteria:

- Visiting the app opens the editor route.
- The homepage tag appears as `A Markdown notepad for agents and humans.`
- The layout has a thin top bar and restrained bottom bar.
- The writing area is visually dominant.
- The page works on desktop and mobile widths.
- Styling avoids heavy cards, marketing layout, and decorative clutter.

Verify:

- Run the web app locally.
- Inspect desktop and mobile browser layouts.
- Run lint and tests.

Out of scope: CodeMirror, Markdown preview, export, saved docs, and auth.

## Phase 1 Issues

### 3. Implement the anonymous Markdown editor

Goal: Let users write Markdown immediately without an account.

Context: Phase 1 is a local anonymous scratchpad.

Relevant docs: `docs/prd.md`, `docs/architecture.md`.

Proposed approach: Add CodeMirror 6 for Markdown editing and connect it to local React state.

Acceptance criteria:

- The default screen contains a blank Markdown editor.
- Users can type and edit Markdown.
- The editor has sensible keyboard behavior for plain Markdown writing.
- The UI remains focused on writing.
- No document save API exists or is called.

Verify:

- Run the app locally.
- Type and edit a Markdown document.
- Check browser network activity during editing.
- Run frontend tests for editor rendering.

Out of scope: Preview mode, local persistence, export, auth, and saved docs.

### 4. Persist anonymous drafts locally

Goal: Make transient drafts survive refresh in the same browser.

Context: Anonymous drafts are local only and do not touch a server.

Relevant docs: `docs/prd.md`, `docs/architecture.md`.

Proposed approach: Store draft body and metadata in browser storage, then hydrate the editor on load.

Acceptance criteria:

- Draft text survives refresh in the same browser.
- Draft metadata records the last edited timestamp.
- Users can clear the local draft.
- Clearing the local draft removes the stored body.
- Local persistence does not run during server rendering.

Verify:

- Type Markdown.
- Refresh and confirm the draft remains.
- Clear the draft and refresh.
- Run tests for storage read, write, and clear behavior.

Out of scope: Cross-device sync, database persistence, auth, and autosave to an API.

### 5. Add edit and view modes with keyboard shortcuts

Goal: Support the core writing and reading loop.

Context: The default early experience is edit or view, not split view.

Relevant docs: `docs/prd.md`.

Proposed approach: Add mode state, toolbar controls, bottom status, and `Ctrl+R` plus `Cmd+R` handling inside the app.

Acceptance criteria:

- Edit mode shows raw Markdown.
- View mode shows rendered Markdown.
- `Ctrl+R` toggles edit and view mode.
- `Cmd+R` toggles edit and view mode on macOS.
- Browser refresh is prevented only when the app handles the shortcut.
- The current mode is visible in the UI.
- Toggling modes does not lose editor content.

Verify:

- Toggle modes with the keyboard shortcuts.
- Toggle modes with the visible control.
- Run frontend tests for mode switching.
- Confirm normal browser refresh still works outside the editor shortcut context.

Out of scope: Split view and saved docs.

### 6. Implement Markdown preview

Goal: Render common Markdown as a polished document.

Context: View mode should feel like a finished document.

Relevant docs: `docs/prd.md`, `docs/architecture.md`.

Proposed approach: Use remark, rehype, remark-gfm, and sanitized rendering for preview mode.

Acceptance criteria:

- Preview supports headings, paragraphs, lists, links, blockquotes, tables, code blocks, and inline code.
- Links render safely.
- Raw HTML is either sanitized or disabled.
- Code blocks are readable.
- Preview typography is calm and readable.
- Preview works on desktop and mobile widths.

Verify:

- Render a fixture document covering supported Markdown.
- Inspect desktop and mobile browser layouts.
- Run frontend rendering tests.

Out of scope: Mermaid, public rendering, saved docs, and server-side rendering of shared docs.

### 7. Add Mermaid diagram preview

Goal: Make Markdown diagrams useful in specs, scripts, and agent context.

Context: Mermaid fenced blocks are important for technical writing.

Relevant docs: `docs/prd.md`, `docs/architecture.md`.

Proposed approach: Detect fenced `mermaid` blocks in preview mode and render them with Mermaid.

Acceptance criteria:

- Valid Mermaid blocks render as diagrams in preview mode.
- Invalid Mermaid blocks show a readable inline error.
- Invalid Mermaid does not block editing or previewing the rest of the doc.
- Raw Markdown export preserves the original Mermaid block.
- Rendering does not flash broken layout during normal use.

Verify:

- Preview a valid flowchart.
- Preview an invalid diagram.
- Confirm the rest of the document still renders.
- Run frontend tests where practical.

Out of scope: Visual Mermaid editing.

### 8. Add Markdown export and document actions

Goal: Let anonymous users get their Markdown out of the app.

Context: Phase 1 has no database save, so export matters.

Relevant docs: `docs/prd.md`.

Proposed approach: Add export, copy, and clear actions with restrained UI.

Acceptance criteria:

- Export downloads the current draft as a `.md` file.
- The exported file contains the exact Markdown source.
- Copy writes the current Markdown source to the clipboard.
- Clear asks for confirmation before deleting the local draft.
- Actions are available without creating dashboard clutter.

Verify:

- Export a draft and inspect the downloaded file.
- Copy a draft and paste it into a text editor.
- Clear a draft and confirm storage is removed.
- Run tests for export filename and content behavior where practical.

Out of scope: Import, saved docs, and sharing.

### 9. Add Phase 1 acceptance tests and visual QA

Goal: Make the local MVP coherent enough to deploy.

Context: Phase 2 should start only after the local product feels right.

Relevant docs: `docs/prd.md`, `docs/architecture.md`.

Proposed approach: Add browser tests for the anonymous flow, fixture docs for preview, and manual QA notes in README.

Acceptance criteria:

- A new developer can run the local MVP from README instructions.
- Anonymous scratchpad flow works.
- Draft persistence works.
- Edit and view toggling works.
- Export works.
- Mermaid preview works.
- Visual QA confirms the editor is minimal and readable.

Verify:

- Run the full documented test command.
- Run the browser acceptance tests.
- Complete the anonymous scratchpad flow manually.
- Inspect desktop and mobile screenshots.

Out of scope: GCP deployment, auth, saved docs, and CLI.

## Phase 2 Issues

### 10. Prepare the GCP deployment plan

Goal: Define the exact GCP deployment shape before provisioning.

Context: Phase 2 deploys the anonymous editor only.

Relevant docs: `docs/architecture.md`.

Proposed approach: Document required services, IAM roles, secrets, domain setup, build path, and smoke tests.

Acceptance criteria:

- Required GCP APIs are listed.
- Required project values are listed.
- Cloud Run service names are defined.
- Artifact Registry requirements are defined.
- Domain and HTTPS plan is documented.
- A checklist exists for values Owain must provide.
- The plan explicitly excludes Postgres, auth, Stripe, and saved docs.

Verify:

- Review the deployment doc.
- Confirm every environment value has an owner and source.

Out of scope: Creating the GCP project.

### 11. Containerize the anonymous web app

Goal: Produce a deployable artifact for Cloud Run.

Context: The local app needs a production runtime.

Relevant docs: `docs/architecture.md`.

Proposed approach: Add a production Dockerfile, health endpoint if needed, and documented local image commands.

Acceptance criteria:

- The web app can be built into a production container.
- The container runs locally.
- The container serves the editor.
- The container has a health check or documented readiness path.
- Build commands are documented.

Verify:

- Build the production image locally.
- Run the image locally.
- Open the app from the local container.
- Run the health check or readiness check.

Out of scope: API container, CLI artifacts, and database migrations.

### 12. Deploy the anonymous MVP to Cloud Run

Goal: Make the anonymous editor publicly available on GCP.

Context: This validates the hosted product surface before persistence exists.

Relevant docs: `docs/architecture.md`.

Proposed approach: Deploy the container, configure the domain, and validate browser behavior in production.

Acceptance criteria:

- The app is reachable over HTTPS.
- The custom domain is configured.
- Anonymous editor flow works in production.
- Local browser drafts stay local in production.
- Export works in production.
- No auth, database, Stripe, or saved-doc feature is exposed.

Verify:

- Run production smoke tests.
- Complete anonymous scratchpad flow.
- Refresh and confirm local draft persistence.
- Export a `.md` file.

Out of scope: Auth, saved docs, public sharing, CLI, and payments.

### 13. Add deployment CI/CD and release checklist

Goal: Make production updates repeatable.

Context: Manual deploys are acceptable early, but releases need a clear path.

Relevant docs: `docs/architecture.md`.

Proposed approach: Add GitHub Actions or Cloud Build for tests, image build, and deploy.

Acceptance criteria:

- Main branch runs tests.
- Deploy workflow builds the production image.
- Deploy workflow publishes the image.
- Deploy workflow updates Cloud Run.
- Required secrets are documented.
- Release checklist covers build, deploy, smoke test, and rollback.

Verify:

- Run CI on a pull request.
- Run deploy workflow in a controlled environment.
- Confirm release checklist is accurate.

Out of scope: Database migrations and CLI releases.

## Phase 3 Issues

### 14. Add personal auth foundation

Goal: Add authentication for Owain-only saved docs.

Context: Phase 3 is for Owain's own use cases before a public paid tier exists.

Relevant docs: `docs/prd.md`, `docs/architecture.md`.

Proposed approach: Add auth, session handling, current-user API, and an allowlist for the personal saved-doc feature.

Acceptance criteria:

- Owain can sign in locally.
- The app can identify the current user.
- Saved-doc routes require auth.
- Non-allowed users cannot use saved-doc features.
- Unauthorized private API requests return 401.
- Authenticated users without access receive 403.

Verify:

- Run API auth tests.
- Run web auth flow locally.
- Attempt saved-doc operations as anonymous, allowed, and not allowed users.

Out of scope: Stripe, public paid signups, and team accounts.

### 15. Add Postgres and document migrations

Goal: Create the persistence foundation for saved docs.

Context: Anonymous drafts remain browser-local, but saved docs need durable storage.

Relevant docs: `docs/architecture.md`.

Proposed approach: Add local Postgres, migrations, document tables, and test database setup.

Acceptance criteria:

- Local Postgres can be started or connected.
- Migrations create users, documents, document versions, and API token tables as needed.
- Migration commands are documented.
- Tests can run against a local or test database.

Verify:

- Start local Postgres.
- Run migrations.
- Run database tests.
- Inspect the created schema.

Out of scope: Stripe subscription tables unless needed later.

### 16. Implement saved document API

Goal: Let the app create, read, update, search, and archive saved docs.

Context: The API becomes server-side truth for personal saved docs.

Relevant docs: `docs/prd.md`, `docs/architecture.md`.

Proposed approach: Add Go HTTP routes for document CRUD, content replace, search, archive, ownership checks, and error behavior.

Acceptance criteria:

- Allowed users can create saved docs.
- Allowed users can read their own docs.
- Allowed users can update document title and body.
- Allowed users can list saved docs.
- Allowed users can search saved docs.
- Allowed users can archive docs.
- Unauthorized access to another user's doc returns 404.
- Anonymous private API requests return 401.

Verify:

- Run API document tests.
- Exercise routes against the local API.
- Confirm ownership and access checks.

Out of scope: Sharing, CLI, document history UI, and payments.

### 17. Connect the web editor to saved docs

Goal: Let Owain save and reopen documents from the browser app.

Context: The editor should support local anonymous drafts and saved docs without becoming a dashboard.

Relevant docs: `docs/prd.md`, `docs/architecture.md`.

Proposed approach: Add saved-doc mode, autosave, document list, search, open, archive, and clear separation from anonymous drafts.

Acceptance criteria:

- Owain can create a saved doc from the editor.
- Saved docs autosave.
- Autosave state is visible but quiet.
- Owain can list saved docs.
- Owain can search saved docs.
- Owain can open a saved doc.
- Owain can archive a saved doc.
- Anonymous users still get the local scratchpad flow.

Verify:

- Run web tests for saved-doc flows.
- Complete create, autosave, list, search, open, and archive manually.
- Confirm anonymous flow still works.

Out of scope: Public paid accounts, sharing, CLI, and document history UI.

### 18. Implement public sharing and raw Markdown URLs

Goal: Allow saved docs to be shared read-only by URL.

Context: Raw `.md` URLs are a core agent workflow.

Relevant docs: `docs/prd.md`, `docs/architecture.md`.

Proposed approach: Add share and unshare API routes, public HTML rendering, public raw Markdown routes, and UI controls.

Acceptance criteria:

- Saved docs are private by default.
- Owain can share a doc.
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

Out of scope: Private invites, comments, collaboration, and paid entitlements.

### 19. Implement the CLI MVP

Goal: Make saved docs useful from terminals and coding agents.

Context: The CLI is a first-class product surface once the document API exists.

Relevant docs: `docs/prd.md`, `docs/architecture.md`.

Proposed approach: Build a Go CLI that authenticates, stores tokens locally, and calls the document API.

Acceptance criteria:

- `jotter auth login` stores a usable local token.
- `jotter new` creates a saved doc.
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
- Run CLI against the local API.
- Exercise the command list against an allowed local user.
- Confirm anonymous users cannot use saved document commands.

Out of scope: Homebrew distribution and shell completions.

### 20. Add document history

Goal: Provide a safety net for saved docs.

Context: Saved Markdown should be recoverable after meaningful edits.

Relevant docs: `docs/prd.md`, `docs/architecture.md`.

Proposed approach: Store document versions on meaningful saves and expose a minimal version list and restore flow.

Acceptance criteria:

- Saved docs record versions at safe intervals or explicit saves.
- Owain can list versions for a doc.
- Owain can restore a previous version.
- Version restore creates a new latest version.
- Version access is owner-scoped.

Verify:

- Run API version tests.
- Save several edits and inspect versions.
- Restore a version and confirm current content changes.

Out of scope: Visual diffs.

## Phase 4 Issues

### 21. Add subscription data model and entitlement checks

Goal: Turn saved docs into a paid product boundary.

Context: Phase 4 opens saved docs beyond Owain.

Relevant docs: `docs/prd.md`, `docs/architecture.md`.

Proposed approach: Add subscription tables, entitlement service, paid-only checks, and consistent 402 errors.

Acceptance criteria:

- Users have subscription state.
- Paid-only operations require active entitlement.
- Unpaid users receive consistent 402 responses.
- Existing personal allowlist behavior can be removed or narrowed.
- Tests cover anonymous, unpaid, paid, and unauthorized cases.

Verify:

- Run entitlement tests.
- Attempt paid-only operations as anonymous, unpaid, paid, and unauthorized users.

Out of scope: Stripe checkout and webhooks.

### 22. Add Stripe checkout, portal, and webhooks

Goal: Connect production billing to paid entitlements.

Context: Paid status must be driven by Stripe events.

Relevant docs: `docs/prd.md`, `docs/architecture.md`.

Proposed approach: Add checkout flow, customer portal, verified webhooks, and subscription sync.

Acceptance criteria:

- Checkout starts from the app.
- Successful payment grants paid entitlement.
- Canceled or failed subscriptions remove paid entitlement according to policy.
- Stripe webhooks are verified.
- Users can open the billing portal.
- Stripe secrets are documented.

Verify:

- Complete Stripe test-mode checkout.
- Receive and process webhook events.
- Confirm entitlement changes in the app and API.

Out of scope: Multiple plans, coupons, taxes, and enterprise billing.

### 23. Harden the public paid product

Goal: Prepare the app for users beyond Owain.

Context: Payments make the product externally usable.

Relevant docs: `docs/prd.md`, `docs/architecture.md`.

Proposed approach: Add account polish, empty states, billing states, support paths, production monitoring, rate limits, and abuse checks.

Acceptance criteria:

- New users understand what is free and what is paid.
- Unpaid users keep the anonymous scratchpad flow.
- Paid users can save, sync, share, and use the CLI/API.
- Billing failure states are clear.
- Basic rate limits protect public routes and API routes.
- Error monitoring is configured.
- Production smoke tests cover anonymous, paid, sharing, and CLI flows.

Verify:

- Run full automated tests.
- Run production smoke tests.
- Complete anonymous, unpaid, paid, sharing, and CLI flows.
- Review monitoring and error logs after smoke tests.

Out of scope: Team workspaces, collaboration, comments, and enterprise features.
