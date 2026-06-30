## MODIFIED Requirements

### Requirement: Mobile shows uniform tabs without the photo
On narrow (mobile) viewports, the credits SHALL render below the full-width main image as a stack of uniform tabs — a developer tab (name only, no photo), a GitHub tab, and a Live tab — all sharing the same style. The developer tab SHALL be a button that opens the developer profile popup (when attribution is `named`). On wider viewports, the side-column layout (with the developer photo) is used instead.

#### Scenario: Mobile uniform tabs
- **WHEN** the modal is viewed on a narrow (mobile) viewport with credits content
- **THEN** the main image is full width and the developer (name only, no photo), GitHub, and Live render as three uniformly-styled tabs below it

#### Scenario: Developer tab opens the popup
- **WHEN** the developer tab renders on mobile for a `named` developer and the user taps it
- **THEN** it is a button styled identically to the GitHub/Live tabs, and tapping it opens the developer profile popup

#### Scenario: Desktop keeps the side column
- **WHEN** the modal is viewed on a wider viewport
- **THEN** the side-column layout with the developer photo is shown instead of the tabs

## ADDED Requirements

### Requirement: Desktop developer avatars open the popup
In the desktop developer container, each credited developer's avatar/name SHALL be an interactive trigger that opens the developer profile popup for that developer, when the project's attribution is `named`. When attribution is `anonymized` or `hidden`, the avatars/names SHALL NOT be interactive.

#### Scenario: Click a named developer's avatar
- **WHEN** the desktop developer container shows a `named` developer and the user clicks their avatar or name
- **THEN** the developer profile popup opens for that developer

#### Scenario: Anonymized developers are not interactive
- **WHEN** the project's attribution is `anonymized`
- **THEN** the desktop developer avatars/names are not interactive and clicking them opens no popup
