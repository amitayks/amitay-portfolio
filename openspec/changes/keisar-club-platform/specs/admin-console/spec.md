## ADDED Requirements

### Requirement: Admin route gating
All `/admin/*` routes SHALL be accessible only to logged-in users with `profiles.role = 'admin'`. Non-admin users SHALL receive a 403 response, and the admin bundle MUST NOT load for them.

#### Scenario: Dev attempts to access /admin
- **WHEN** a logged-in user with `role='dev'` navigates to `/admin`
- **THEN** a 403 page renders and no admin code is fetched

### Requirement: Profile management list
`/admin` SHALL render a list of all profiles showing: avatar, display name, GitHub handle, role, status, created date, and a suspend/unsuspend toggle. The list SHALL support text search across `display_name`, `full_name`, and `github_handle`, and filtering by `status` and `role`.

#### Scenario: Admin suspends a profile
- **WHEN** an admin clicks the suspend toggle on a profile row
- **THEN** the `profiles.status` is updated to `'suspended'`, the row visibly updates, and the corresponding `profiles_public` view stops returning that profile

#### Scenario: Admin searches by GitHub handle
- **WHEN** an admin types `alex` into the search input
- **THEN** the list filters to rows where `display_name`, `full_name`, or `github_handle` contains `alex` (case-insensitive)

### Requirement: Invite generator
`/admin/invites` SHALL allow an admin to enter a target email and create a single-use invite. After creation, the page SHALL display the raw invite URL exactly once. A list of existing invites SHALL show: email, created date, expiry, used status, and invited_by — never the raw token.

#### Scenario: Generate invite and copy URL
- **WHEN** an admin enters `dev@example.com` and clicks "Create invite"
- **THEN** a new `dev_invites` row is created, a copyable URL containing the raw token is displayed, and the URL is removed from the DOM on page navigation

#### Scenario: Existing invites list never shows raw token
- **WHEN** an admin views the invites list
- **THEN** each row shows email, dates, status, and inviter, but no column exposes the raw token or its hash

### Requirement: Project CRUD with all new fields
`/admin/projects` SHALL render a table of all projects (including unpublished) — **without a `lang` column**, one row per SKU. `/admin/projects/:id` SHALL render an editor exposing every column on the `projects` table, including `status`, `developers` (multi-select of active devs), `assigned_manager` (single-select of admin/manager profiles), `client_visibility`, `dev_attribution`, `company_name`, `duration`, `started_at`, `finished_at`, and the existing portfolio fields. Translatable text fields (`title`, `description`, `longDescription`, `problem`, `what_i_built`, `how_it_works`, `result`, `company_name`, `duration`) SHALL render as **paired EN/HE inputs side-by-side**, each saving into the corresponding key of the JSONB `{ en, he }` value. Translatable JSONB-leaf fields inside `additionalInfo`, `liveSite`, and `github` SHALL preserve the documented `{ en, he }` shape at their leaves; the editor's JSON help text SHALL document this shape. The editor SHALL NOT show a `lang` selector. Non-translatable fields (`status`, `developers`, `assigned_manager`, `client_visibility`, `dev_attribution`, `started_at`, `finished_at`, `image`, `imagePack`, `technologies`, `projectType`, `priority`, `featured`, `publish`, `settings`) render once per project, no language pairing.

#### Scenario: Admin edits a bilingual title
- **WHEN** an admin opens the editor for an existing project and changes only the HE side of the `title` field, then saves
- **THEN** the row is updated with `title = { en: <unchanged>, he: <new value> }` and exactly one Supabase row is written (no second-language sibling row exists)

#### Scenario: New project starts with empty bilingual fields
- **WHEN** an admin clicks "New project"
- **THEN** every translatable field renders as a paired EN/HE input, both empty, and the saved row stores `{ en: "", he: "" }` (or `{ en: null, he: null }`) accordingly; no `lang` field is part of the payload

#### Scenario: Admin assigns developers to a project
- **WHEN** an admin selects three developers in the `developers` multi-select and saves
- **THEN** `projects.developers` stores their `profiles.id` values in the order they were selected (lead first), and the public case study renders them in that order subject to `dev_attribution`

#### Scenario: Default visibility on new project
- **WHEN** an admin clicks "New project"
- **THEN** the editor opens with `client_visibility='logo_only'` and `dev_attribution='named'` pre-selected, and `assigned_manager` defaulting to the current admin's profile id

#### Scenario: Status drives spiral assignment
- **WHEN** an admin saves a project with `status='ongoing'`
- **THEN** the project appears in the Ongoing home spiral on the next public page load and does not appear in Finished or Upcoming

### Requirement: Missing-translation badge
For every translatable field in the project editor, when one locale of the `{ en, he }` value is empty (`""`, `null`, or whitespace-only) while the other is non-empty, a small "Missing EN" or "Missing HE" badge SHALL appear adjacent to that field. The badge is informational only — it does NOT block saving.

#### Scenario: HE missing while EN filled
- **WHEN** an admin views a project editor where `description.en = "Short description"` and `description.he = ""`
- **THEN** a "Missing HE" badge appears next to the description row, in a visually distinct but non-blocking style (e.g., amber on dark)

#### Scenario: Both filled — no badge
- **WHEN** both EN and HE values of a field are non-empty
- **THEN** no badge appears for that field

#### Scenario: Both empty — no badge
- **WHEN** both EN and HE values of a field are empty
- **THEN** no badge appears for that field (a fully empty field is treated as "not yet authored", not "missing one locale")

#### Scenario: Badge does not block save
- **WHEN** an admin clicks "Save changes" on a form with one or more "Missing HE" badges showing
- **THEN** the save proceeds normally and the badges remain after save reflecting the still-missing locale

### Requirement: Project list shows translation completeness
The `/admin/projects` table SHALL include a column or per-row indicator that summarises translation completeness across all translatable fields, e.g., "EN ✓ HE ✓", "EN ✓ HE —" (HE missing on at least one field), etc.

#### Scenario: Fully translated project
- **WHEN** every translatable field on a project has both `en` and `he` non-empty
- **THEN** the project row shows "EN ✓ HE ✓"

#### Scenario: Partially translated project
- **WHEN** at least one translatable field has `he` empty while `en` is non-empty
- **THEN** the project row shows "EN ✓ HE —" (or equivalent indicator) and is visually distinguishable at a glance

### Requirement: Admin write privileges enforced server-side
RLS policies SHALL allow INSERT, UPDATE, and DELETE on `dev_invites`, `projects`, and all admin-relevant tables only when the authenticated user's `profiles.role = 'admin'`. Front-end gating MUST NOT be the sole protection.

#### Scenario: Forged admin call blocked
- **WHEN** a logged-in user with `role='dev'` issues a direct Supabase call to insert into `dev_invites`
- **THEN** the call is rejected by RLS and no row is created
