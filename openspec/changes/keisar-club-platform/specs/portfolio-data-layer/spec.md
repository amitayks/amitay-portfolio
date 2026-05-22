## MODIFIED Requirements

### Requirement: Portfolio list query
A `getProjects(lang, opts?)` function SHALL fetch all rows from the `projects` table where `publish=true` and `lang=currentLang`, optionally filtered by `projectType` and/or `status`. Results SHALL be ordered as follows: when `status='finished'`, by `finished_at` DESC then `priority` DESC; when `status='ongoing'`, by `started_at` DESC then `priority` DESC; when `status='upcoming'`, by `priority` DESC then `created_at` ASC; when no status filter is supplied, by `priority` DESC then `id` ASC.

#### Scenario: Fetch finished web projects in English
- **WHEN** `getProjects('en', { projectType: 'Web-Development', status: 'finished' })` is called
- **THEN** it returns all published English Web-Development projects with `status='finished'`, ordered by `finished_at` DESC then `priority` DESC

#### Scenario: Fetch ongoing projects (no type filter)
- **WHEN** `getProjects('en', { status: 'ongoing' })` is called
- **THEN** it returns all published English projects with `status='ongoing'`, ordered by `started_at` DESC then `priority` DESC

#### Scenario: Fetch upcoming projects
- **WHEN** `getProjects('en', { status: 'upcoming' })` is called
- **THEN** it returns all published English projects with `status='upcoming'`, ordered by `priority` DESC then `created_at` ASC

#### Scenario: Fetch all projects (no filters)
- **WHEN** `getProjects('en')` is called with no opts
- **THEN** it returns all published English projects regardless of type or status, ordered by `priority` DESC then `id` ASC

### Requirement: Portfolio single item query
A `getProjectBySku(SKU, lang)` function SHALL fetch a single row from `projects` matching `SKU`, `lang`, and `publish=true`. It SHALL select all original portfolio fields (id, SKU, title, description, longDescription, technologies, projectType, image, imagePack, additionalInfo, featured, settings, priority, liveSite, github) AND the new v1 fields: `status`, `company_name`, `duration`, `developers` (as `profiles_public` rows joined by id, preserving array order), `assigned_manager` (as `profiles_public` row), `client_visibility`, `dev_attribution`, `started_at`, `finished_at`.

#### Scenario: Fetch single project includes new fields
- **WHEN** `getProjectBySku('WEB-ADDIT', 'en')` is called for a project with two assigned developers
- **THEN** the returned object includes `status`, `companyName`, `duration`, `developers` as an array of two public-profile objects in lead-first order, `assignedManager` as a single public-profile object, `clientVisibility`, `devAttribution`, `startedAt`, `finishedAt`, in addition to all original portfolio fields

#### Scenario: Hidden client returned with null companyName
- **WHEN** `getProjectBySku('WEB-FOO', 'en')` is called for a project with `client_visibility='hidden'`
- **THEN** the response either omits `companyName` or returns `null` for it, regardless of the underlying stored value, so that the UI cannot accidentally render it

### Requirement: Query key structure
Query keys SHALL follow the pattern: `['site_content', lang]`, `['projects', lang, { projectType?, status? }]`, `['project', SKU, lang]`, `['portfolioImage', imageName]`, `['siteImage', imageName]`, `['profile', userId]`, `['profile_public', userId]`.

#### Scenario: Language change invalidates project queries
- **WHEN** the language changes from 'en' to 'he'
- **THEN** queries with the new lang key are fetched (or served from cache if previously fetched) under the `['projects', 'he', …]` and `['project', SKU, 'he']` keys

#### Scenario: Status change refetches correct spiral
- **WHEN** the Finished spiral mounts with `['projects', 'en', { status: 'finished' }]` and the Ongoing spiral mounts with `['projects', 'en', { status: 'ongoing' }]`
- **THEN** each spiral has its own React Query cache entry and refetches independently

### Requirement: Prefetch on carousel card hover
When a user hovers over a carousel card, `queryClient.prefetchQuery` SHALL be called for the project detail query and the main image query for that project. The detail query SHALL use the new `['project', SKU, lang]` key shape.

#### Scenario: Hover triggers prefetch
- **WHEN** user hovers over a card with SKU "WEB-MUSE" for 200ms+
- **THEN** `queryClient.prefetchQuery` is called for `['project', 'WEB-MUSE', lang]` and `['portfolioImage', mainImageName]`

## ADDED Requirements

### Requirement: Profile fetch helpers
The service layer SHALL expose `getProfile(userId)` (full row, self or admin only) and `getPublicProfile(userId)` (reads from `profiles_public` view). Both SHALL return `null` when the row is not found or not accessible.

#### Scenario: Self fetch returns full row
- **WHEN** a logged-in dev calls `getProfile(myId)`
- **THEN** all profile columns including `full_name`, `resume_url`, and `links` are returned

#### Scenario: Cross-user fetch returns null
- **WHEN** a logged-in dev calls `getProfile(otherDevId)`
- **THEN** the call returns `null` because RLS denies the read

#### Scenario: Public profile fetch always limited
- **WHEN** any caller (anonymous, dev, admin) calls `getPublicProfile(userId)`
- **THEN** only the public-view columns are returned, regardless of caller's role

### Requirement: Invite token validation helper
The service layer SHALL expose `validateInvite(rawToken)` that returns `{ email, expiresAt }` if the SHA-256 hash of `rawToken` matches an unused, unexpired row in `dev_invites`, and `null` otherwise. The function MUST NOT mark the invite as used.

#### Scenario: Valid token validates successfully
- **WHEN** `validateInvite(<valid_unused_unexpired_token>)` is called
- **THEN** it returns `{ email, expiresAt }` and `used_at` remains null

#### Scenario: Used token returns null
- **WHEN** `validateInvite(<token_whose_invite_has_used_at_set>)` is called
- **THEN** it returns `null`

### Requirement: Invite redemption helper
The service layer SHALL expose `redeemInvite(rawToken, profilePayload)` that atomically: (1) verifies the invite is still valid, (2) verifies the authenticated user's email matches the invite email, (3) sets `used_at = now()`, and (4) upserts the `profiles` row with `profilePayload` and `invited_by` from the invite. The function MUST fail closed if any step does not succeed.

#### Scenario: Successful redemption marks invite used
- **WHEN** an authenticated user with matching email calls `redeemInvite(rawToken, payload)`
- **THEN** the `dev_invites.used_at` is set to now and the `profiles` row is upserted

#### Scenario: Email mismatch aborts redemption
- **WHEN** the authenticated user's email does not match the invite email
- **THEN** the function throws an error, `used_at` remains null, and no profile is created
