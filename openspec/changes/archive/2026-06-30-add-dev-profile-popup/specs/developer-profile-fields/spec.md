## ADDED Requirements

### Requirement: New public profile properties
The `profiles` table SHALL provide three additional developer-describing properties: `headline` (a short, untranslated role tagline), `skills` (an ordered list of short tags), and `availability` (one of `available`, `open_to_work`, or `busy`, or unset). `skills` SHALL default to an empty list and `availability` SHALL be optional (unset means "no availability shown").

#### Scenario: Properties exist with safe defaults
- **WHEN** a profile row is created without specifying the new properties
- **THEN** `headline` is unset, `skills` is an empty list, and `availability` is unset — no consumer needs to special-case missing values beyond "not shown"

#### Scenario: Availability is constrained
- **WHEN** `availability` is set
- **THEN** its value is one of `available`, `open_to_work`, or `busy`

### Requirement: New properties are exposed publicly
The public profile projection (`profiles_public`) SHALL expose `headline`, `skills`, and `availability`, in addition to the previously public fields, and SHALL also expose `resume_url`. The projection SHALL continue to surface only `active` profiles.

#### Scenario: Public projection includes the new fields
- **WHEN** a public profile is read for an active developer
- **THEN** the result includes `headline`, `skills`, `availability`, and `resume_url` alongside the existing `display_name`, `avatar_url`, `github_handle`, `bio`, and `links`

#### Scenario: Inactive profiles stay hidden
- **WHEN** a profile is not `active`
- **THEN** it is absent from the public projection regardless of the new fields

### Requirement: Public profile shape carries the new fields
The `PublicProfile` type and the developer-profile fetch SHALL carry `headline`, `skills`, `availability`, and `resume_url`, so that any consumer of public developer data (including the project modal credits and the developer profile popup) can read them without an additional request.

#### Scenario: Fetched developer profiles carry the new fields
- **WHEN** developer public profiles are fetched for a project's credited developers
- **THEN** each returned profile includes `headline`, `skills`, `availability`, and `resume_url`

### Requirement: Developers can edit their new profile fields
The profile self-edit surface SHALL let a signed-in developer set their own `headline`, `skills`, and `availability`, and persist them through the existing profile update path. `resume_url` remains editable through the existing resume field.

#### Scenario: Developer sets headline, skills, and availability
- **WHEN** a developer edits their profile and provides a headline, a set of skills, and an availability value
- **THEN** the values are saved to their profile and subsequently appear in their public profile

#### Scenario: Developer clears availability
- **WHEN** a developer sets availability to the "none" option
- **THEN** availability is unset and no availability badge is shown for them
