## Purpose

The project modal's external links (GitHub / Live): compact icon-and-label buttons (no preview images), rendered in the credits side column on desktop and as tabs on mobile.

## Requirements

### Requirement: Link cards display as compact icon-and-label buttons
GitHub and LiveSite links SHALL be presented as compact glass buttons showing the service icon (the GitHub icon for `github`, the ExternalLink icon for `liveSite`) alongside a short text label, with **no preview image**. The entire button SHALL be clickable, opening the link in a new tab. The buttons SHALL sit in the credits side column, below the developer slot.

#### Scenario: Icon-and-label button
- **WHEN** a `github`/`liveSite` entry exists
- **THEN** its button displays the corresponding icon and the link label on a glass background (no preview image)

#### Scenario: Card click behavior
- **WHEN** a user clicks a link button
- **THEN** the associated URL opens in a new tab with `noopener,noreferrer`

#### Scenario: Accessible label
- **WHEN** a link button renders
- **THEN** it exposes the link label via `aria-label` for assistive technology

### Requirement: Cards hidden when no link data exists
If a project has no `github` or `liveSite` data, the corresponding card SHALL NOT be rendered. If neither exists, the entire link cards section is hidden.

#### Scenario: No github or liveSite
- **WHEN** a project has neither `github` nor `liveSite` fields
- **THEN** no link cards section is rendered

#### Scenario: Only github exists
- **WHEN** a project has `github` but no `liveSite`
- **THEN** only the GitHub card is shown
