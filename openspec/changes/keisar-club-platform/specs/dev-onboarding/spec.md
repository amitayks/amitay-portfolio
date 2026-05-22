## ADDED Requirements

### Requirement: Invite-only registration
Developer registration SHALL require a valid, unexpired, unused invite token bound to the developer's email. The system MUST NOT allow a developer to create a profile without redeeming a token.

#### Scenario: Anonymous visit to /onboard without token
- **WHEN** an anonymous visitor navigates to `/onboard` with no `token` query parameter
- **THEN** the page renders an "Invite required" message and does not show the registration form

#### Scenario: Invalid token rejected
- **WHEN** a visitor navigates to `/onboard?token=xxx` with a token whose SHA-256 hash is not present in `dev_invites`
- **THEN** the page shows "Invalid or expired invite" and the registration form is not rendered

### Requirement: Token storage and lifecycle
Invite tokens SHALL be 32-byte URL-safe random values. Only the SHA-256 hash SHALL be stored in `dev_invites.token_hash`. Each token SHALL expire 30 days after creation and SHALL be single-use (rejected after `used_at` is set).

#### Scenario: Token expires after 30 days
- **WHEN** a visitor uses an invite token whose `expires_at` is in the past
- **THEN** the registration is rejected with "Invite expired"

#### Scenario: Token cannot be reused
- **WHEN** a visitor presents a token whose `used_at` is not null
- **THEN** the registration is rejected with "Invite already used"

### Requirement: Email binding between invite and OAuth identity
The email returned by the OAuth provider SHALL match the invite's `email` (case-insensitive) for registration to succeed. If the OAuth provider returns no email or a non-matching email, the user MUST be blocked with a clear instruction to contact the admin.

#### Scenario: Matching GitHub email accepted
- **WHEN** an invite for `dev@example.com` is redeemed via GitHub login that returns the verified email `dev@example.com`
- **THEN** registration proceeds and `used_at` is set on the invite

#### Scenario: Mismatched email blocked
- **WHEN** an invite for `dev@example.com` is redeemed via Google login that returns `other@example.com`
- **THEN** registration is blocked with the message "This invite is for dev@example.com. Please contact us to update." and `used_at` remains null

#### Scenario: GitHub returns no email
- **WHEN** GitHub OAuth returns no email field (user has it private)
- **THEN** the onboarding flow blocks registration and instructs the user to make their primary email public on GitHub or contact admin

### Requirement: Onboarding form fields
The registration form SHALL collect: legal full name (required), display name (optional, defaults to legal name), avatar (defaults to OAuth-provided avatar; upload optional), bio (optional, max 500 chars), resume (optional file upload, PDF or DOCX up to 5 MB, stored in Supabase Storage), and links (optional JSON: github, linkedin, website, twitter).

#### Scenario: Submit with only required fields
- **WHEN** a developer submits the form with only legal name filled
- **THEN** a `profiles` row is created with that legal name, `display_name = full_name`, OAuth avatar as `avatar_url`, and other fields null or empty

#### Scenario: Resume file size enforced
- **WHEN** a developer attempts to upload a resume file larger than 5 MB
- **THEN** the upload is rejected client-side with "Resume must be 5 MB or smaller" before any network request

### Requirement: Admin invite generation
An admin SHALL be able to generate an invite by entering an email address. The generated invite URL containing the raw token SHALL be displayed to the admin exactly once for copying; it MUST NOT be retrievable again after navigation.

#### Scenario: Admin generates a new invite
- **WHEN** an admin enters `dev@example.com` in the invite form at `/admin/invites` and submits
- **THEN** a new `dev_invites` row is created with `token_hash`, `email='dev@example.com'`, `expires_at = now() + 30 days`, and a copyable URL `https://keisar.club/onboard?token=<raw>` is shown

#### Scenario: Raw token not recoverable
- **WHEN** an admin reloads the invite page after generating a token
- **THEN** the raw token is no longer displayed and only the hash, email, expiry, and used-status are visible
