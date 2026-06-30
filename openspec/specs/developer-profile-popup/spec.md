# developer-profile-popup

## Purpose

A minimalist developer profile popup that opens from the project modal credits — surfacing a credited developer's avatar, name, availability, headline, bio, skills, and links — reachable only when the project's attribution is `named`, and dismissible without closing the underlying project modal.

## Requirements

### Requirement: Popup opens from the credits
A developer profile popup SHALL open from the project modal credits: on mobile via the developer tab, and on desktop via the developer's avatar/name in the developer container. The popup SHALL display the chosen developer.

#### Scenario: Open from the mobile developer tab
- **WHEN** the user taps the developer tab in the mobile credits
- **THEN** the developer profile popup opens showing that developer

#### Scenario: Open from a desktop developer avatar
- **WHEN** the user clicks a developer's avatar or name in the desktop developer container
- **THEN** the developer profile popup opens showing that developer

### Requirement: Popup is reachable only for named attribution
The popup SHALL be reachable only when the project's `dev_attribution` is `named`. When attribution is `anonymized` or `hidden`, the credits triggers SHALL be inert (no popup), because there is no real identity to reveal.

#### Scenario: Anonymized attribution does not open a popup
- **WHEN** the project's attribution is `anonymized` and the user activates a developer trigger
- **THEN** no popup opens

#### Scenario: Hidden attribution exposes no trigger
- **WHEN** the project's attribution is `hidden`
- **THEN** no developer credit (and therefore no popup trigger) is present

### Requirement: Popup shows minimalist crucial info
The popup SHALL present, in order: the developer's avatar, name, an availability badge, headline, bio, skills, and a row of links. It SHALL stay minimalist — every field below name renders only when present, so the card is never blank but never padded with empty sections.

#### Scenario: Fully populated developer
- **WHEN** a named developer with avatar, headline, bio, skills, availability, and links is shown
- **THEN** the popup shows the avatar, name with an availability badge, the headline, the bio, the skills, and the links

#### Scenario: Sparse developer
- **WHEN** a named developer has only a name and avatar
- **THEN** the popup shows the avatar and name and omits the availability badge, headline, bio, skills, and links sections (no empty placeholders)

### Requirement: Availability badge reflects status
When `availability` is set, the popup SHALL show an availability badge labeling the status (`available`, `open_to_work`, or `busy`). When `availability` is unset, no badge SHALL be shown.

#### Scenario: Availability shown
- **WHEN** the developer's availability is `open_to_work`
- **THEN** the popup shows an availability badge indicating they are open to work

#### Scenario: Availability absent
- **WHEN** the developer's availability is unset
- **THEN** no availability badge is shown

### Requirement: Links row includes social links and resume
The links row SHALL render a link for each available destination: GitHub (from the developer's GitHub handle), and the developer's `linkedin`, `website`, and `twitter` links, plus a Resume link when a resume URL is present. Each link SHALL open in a new tab. Links that are absent SHALL be omitted.

#### Scenario: Resume link present
- **WHEN** the developer has a resume URL
- **THEN** the links row includes a Resume link that opens in a new tab

#### Scenario: Only some links present
- **WHEN** the developer has a GitHub handle and a website link but no LinkedIn, Twitter, or resume
- **THEN** the links row shows only the GitHub and website links

### Requirement: Skills render as capped chips
Skills SHALL render as a wrapping set of chips. To preserve the minimalist layout, the popup SHALL cap the number of visible chips and indicate any remainder (e.g. "+N") rather than growing unbounded.

#### Scenario: Many skills
- **WHEN** a developer has more skills than the visible cap
- **THEN** the popup shows the capped set of chips plus an indicator of how many more exist

### Requirement: Popup dismissal does not close the project modal
The popup SHALL be dismissible by pressing Escape or clicking its backdrop, and dismissing it SHALL close only the popup, leaving the underlying project modal open. Interactions inside the popup SHALL NOT dismiss the underlying project modal.

#### Scenario: Escape closes only the popup
- **WHEN** the popup is open and the user presses Escape
- **THEN** the popup closes and the project modal remains open

#### Scenario: Backdrop click closes only the popup
- **WHEN** the popup is open and the user clicks its backdrop
- **THEN** the popup closes and the project modal remains open
