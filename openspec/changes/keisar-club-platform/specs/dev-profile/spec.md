## ADDED Requirements

### Requirement: Profile entity
The system SHALL maintain a `profiles` table with one row per `auth.users` entry. Columns SHALL include: `id` (uuid, PK, references `auth.users.id`), `role` (enum: `admin`, `manager`, `dev`, `client`), `github_handle`, `full_name`, `display_name`, `avatar_url`, `bio`, `resume_url`, `links` (jsonb), `status` (enum: `active`, `suspended`, default `active`), `invited_by` (FK to `profiles.id`, nullable), `created_at`, `updated_at`.

#### Scenario: Profile row created on first login
- **WHEN** a user completes the OAuth flow for the first time and redeems a valid invite
- **THEN** a `profiles` row exists with `id = auth.users.id`, `role = 'dev'`, `status = 'active'`, and `invited_by` set to the admin who issued the invite

### Requirement: Self-edit at /me
A logged-in developer SHALL be able to edit the following fields of their own profile at `/me`: `full_name`, `display_name`, `avatar_url`, `bio`, `resume_url`, `links`. They MUST NOT be able to edit `role`, `status`, `invited_by`, or another user's profile.

#### Scenario: Dev updates display name
- **WHEN** a dev changes `display_name` from "alex" to "Alex K." at `/me` and clicks Save
- **THEN** the `profiles` row is updated, the new value is visible on subsequent page loads, and an entry is written to `profile_audit`

#### Scenario: Dev cannot edit role
- **WHEN** the front-end renders the profile editor
- **THEN** no input is bound to `role`, and a direct API call attempting to update `role` is rejected by RLS

### Requirement: Profile audit trail
Every change to a `profiles` row's editable fields SHALL append a row to `profile_audit(id, profile_id, field, old_value, new_value, changed_at)`. The trigger SHALL fire on UPDATE and record one row per changed field.

#### Scenario: Single update writes multiple audit rows
- **WHEN** a dev updates both `display_name` and `bio` in one Save action
- **THEN** two `profile_audit` rows are appended, one per field, both with the same `changed_at` timestamp

#### Scenario: Unchanged fields not recorded
- **WHEN** a dev submits the form with only `bio` changed
- **THEN** only one `profile_audit` row is appended (for `bio`) and `display_name` produces no audit entry

### Requirement: Name-flip detection
The admin profile view SHALL display a warning badge on any profile whose `full_name` has changed more than once across its `profile_audit` history.

#### Scenario: Two name changes triggers badge
- **WHEN** an admin opens the profile of a dev whose `profile_audit` contains two rows with `field='full_name'`
- **THEN** the profile view shows a "Name changed multiple times" warning badge and lists the historical values

### Requirement: Public profile view excludes sensitive columns
A `profiles_public` view SHALL expose only `id`, `display_name`, `avatar_url`, `github_handle`, `bio`, `links` for profiles where `status = 'active'`. Anonymous clients MUST NOT be able to read `full_name`, `resume_url`, `invited_by`, `role`, or `profile_audit`.

#### Scenario: Anonymous query returns no sensitive fields
- **WHEN** an anonymous Supabase client selects from `profiles_public`
- **THEN** only the six allowed columns are returned and rows with `status='suspended'` are excluded

#### Scenario: Anonymous query to profiles table denied
- **WHEN** an anonymous Supabase client selects from `profiles` directly
- **THEN** RLS returns zero rows
