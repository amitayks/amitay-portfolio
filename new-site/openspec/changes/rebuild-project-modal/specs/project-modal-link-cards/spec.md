## ADDED Requirements

### Requirement: Link cards display preview image as clickable button
GitHub and LiveSite links SHALL be presented as tall image cards (9:16 aspect ratio) where the preview image fills the card and the entire card is clickable, opening the link in a new tab.

#### Scenario: Card with preview image
- **WHEN** a github/liveSite entry has a `previewImage.dark` value
- **THEN** the card displays that image filling the full 9:16 area, and clicking anywhere on the card opens the link

#### Scenario: Card click behavior
- **WHEN** a user clicks on a link card
- **THEN** the associated URL opens in a new tab with `noopener,noreferrer`

### Requirement: Link cards use dark preview image only
The link card SHALL use only the `previewImage.dark` image variant, ignoring the light variant.

#### Scenario: Image selection
- **WHEN** a link card renders with `previewImage: { dark: "img.png", light: "other.png" }`
- **THEN** it fetches and displays only the dark image

### Requirement: Link cards show blur overlay with title
Each link card SHALL display a blur + gradient overlay at the bottom of the card showing the link title and an appropriate icon (GitHub icon for github, ExternalLink icon for liveSite).

#### Scenario: Overlay content
- **WHEN** a github link card renders with label "GitHub"
- **THEN** a blurred gradient overlay at the bottom shows the GitHub icon and the label text

### Requirement: Fallback when no preview image exists
When a github/liveSite entry exists but has no `previewImage` or the image fails to load, the card SHALL show a centered fallback icon on a subtle glass background.

#### Scenario: No preview image data
- **WHEN** a github entry exists with no `previewImage` field
- **THEN** the card shows a centered GitHub icon as fallback, maintaining the 9:16 aspect ratio

#### Scenario: Image load failure
- **WHEN** a preview image URL fails to load
- **THEN** the card falls back to the centered icon display

### Requirement: Cards hidden when no link data exists
If a project has no `github` or `liveSite` data, the corresponding card SHALL NOT be rendered. If neither exists, the entire link cards section is hidden.

#### Scenario: No github or liveSite
- **WHEN** a project has neither `github` nor `liveSite` fields
- **THEN** no link cards section is rendered

#### Scenario: Only github exists
- **WHEN** a project has `github` but no `liveSite`
- **THEN** only the GitHub card is shown

### Requirement: Link cards laid out in a 2-column grid
When both github and liveSite exist, they SHALL be displayed side by side in a 2-column grid.

#### Scenario: Both links present
- **WHEN** both github and liveSite exist
- **THEN** they render as two cards side by side with equal width

### Requirement: Link card images fetched via usePortfolioImage
The preview image filenames SHALL be resolved to URLs using the existing `usePortfolioImage` hook, consistent with how gallery images are fetched.

#### Scenario: Image fetching
- **WHEN** a link card has `previewImage.dark` set to "preview-dark.png"
- **THEN** the component uses `usePortfolioImage("preview-dark.png")` to get the image URL
