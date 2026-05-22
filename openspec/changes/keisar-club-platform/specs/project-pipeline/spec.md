## ADDED Requirements

### Requirement: Project status enum drives pipeline
Every project SHALL have a `status` of exactly one of `upcoming`, `ongoing`, `finished`. The status SHALL determine which home spiral the project appears in and the ordering rules applied.

#### Scenario: Finished project ordered by finishedAt
- **WHEN** the Finished spiral is rendered
- **THEN** projects with `status='finished'` are ordered by `finished_at` descending, with null `finished_at` last

#### Scenario: Ongoing project ordered by startedAt
- **WHEN** the Ongoing spiral is rendered
- **THEN** projects with `status='ongoing'` are ordered by `started_at` descending

### Requirement: Developer attribution model
Every project SHALL track its assigned developers in an ordered `developers uuid[]` column referencing `profiles.id`. The order MUST be preserved as authored by the admin, with the lead developer at index 0.

#### Scenario: Lead developer displayed first
- **WHEN** a project case study renders attributed devs and the `developers` array is `[lead_id, contributor_id]`
- **THEN** the lead is shown first in the attribution list

#### Scenario: Empty developers array on personal project
- **WHEN** a project has `developers=[]` (legacy or non-attributed)
- **THEN** the case study renders no developer attribution block, regardless of `dev_attribution` setting

### Requirement: Manager assignment
Every project SHALL have an `assigned_manager uuid` column referencing a `profiles.id` whose `role` is `admin` or `manager`. In v1, the value SHALL default to Amitay's profile id.

#### Scenario: New project defaults manager to current admin
- **WHEN** an admin creates a project without explicitly setting `assigned_manager`
- **THEN** the column is populated with the creating admin's `profiles.id`

#### Scenario: Manager change recorded
- **WHEN** an admin changes the `assigned_manager` on an existing project
- **THEN** the new value is persisted and reflected in the admin UI; no migration is required to introduce future `role='manager'` users

### Requirement: Client visibility flag
Every project SHALL have a `client_visibility` enum: `public` (company name and logo shown), `logo_only` (logo only, no name), or `hidden` (neither shown). The default for new projects SHALL be `logo_only`.

#### Scenario: Hidden client renders as "Confidential client"
- **WHEN** a project with `client_visibility='hidden'` is rendered publicly
- **THEN** the case study shows "Confidential client" in place of company name and no logo

#### Scenario: Public client shows name
- **WHEN** a project with `client_visibility='public'` and `company_name='Acme'` is rendered
- **THEN** "Acme" appears in the case study header

### Requirement: Developer attribution flag
Every project SHALL have a `dev_attribution` enum: `named` (display name and avatar shown), `anonymized` (placeholder name and silhouette), or `hidden` (no developer block). The default for new projects SHALL be `named`.

#### Scenario: Anonymized devs render placeholders
- **WHEN** a project with `dev_attribution='anonymized'` is rendered
- **THEN** each developer in `developers[]` is shown as "Developer A", "Developer B", … with a generic silhouette avatar

#### Scenario: Hidden attribution removes the block
- **WHEN** a project with `dev_attribution='hidden'` is rendered
- **THEN** no developer attribution section appears on the case study

### Requirement: Public read restricted to published projects
RLS policies SHALL allow anonymous SELECT on `projects` only when `publish = true`. All other access (unpublished projects, all writes) SHALL require `role = 'admin'`.

#### Scenario: Unpublished project hidden from anonymous read
- **WHEN** an anonymous Supabase client queries `projects` and one row has `publish=false`
- **THEN** that row is not returned

#### Scenario: Admin sees unpublished projects in admin queries
- **WHEN** an admin queries `projects` from `/admin/projects`
- **THEN** all rows are returned including `publish=false`

### Requirement: Migration of legacy portfolio rows
Existing `portfolio_items` rows SHALL be migrated to `projects` with: `status='finished'`, `developers=[amitay_profile_id]`, `assigned_manager=amitay_profile_id`, `client_visibility='hidden'`, `dev_attribution='named'`, `finished_at=completion_date` (when available, otherwise null). No data SHALL be lost in the migration.

#### Scenario: Existing portfolio item appears in Finished spiral after migration
- **WHEN** the migration runs against a database with N existing `portfolio_items` rows
- **THEN** the `projects` table contains N rows, each tagged `status='finished'` with Amitay as the sole developer and manager, and the home page Finished spiral renders all of them
