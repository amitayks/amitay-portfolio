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
`/admin/projects` SHALL render a table of all projects (including unpublished) and `/admin/projects/:id` SHALL render an editor exposing every column on the `projects` table, including `status`, `developers` (multi-select of active devs), `assigned_manager` (single-select of admin/manager profiles), `client_visibility`, `dev_attribution`, `company_name`, `duration`, `started_at`, `finished_at`, and the existing portfolio fields.

#### Scenario: Admin assigns developers to a project
- **WHEN** an admin selects three developers in the `developers` multi-select and saves
- **THEN** `projects.developers` stores their `profiles.id` values in the order they were selected (lead first), and the public case study renders them in that order subject to `dev_attribution`

#### Scenario: Default visibility on new project
- **WHEN** an admin clicks "New project"
- **THEN** the editor opens with `client_visibility='logo_only'` and `dev_attribution='named'` pre-selected, and `assigned_manager` defaulting to the current admin's profile id

#### Scenario: Status drives spiral assignment
- **WHEN** an admin saves a project with `status='ongoing'`
- **THEN** the project appears in the Ongoing home spiral on the next public page load and does not appear in Finished or Upcoming

### Requirement: Admin write privileges enforced server-side
RLS policies SHALL allow INSERT, UPDATE, and DELETE on `dev_invites`, `projects`, and all admin-relevant tables only when the authenticated user's `profiles.role = 'admin'`. Front-end gating MUST NOT be the sole protection.

#### Scenario: Forged admin call blocked
- **WHEN** a logged-in user with `role='dev'` issues a direct Supabase call to insert into `dev_invites`
- **THEN** the call is rejected by RLS and no row is created
