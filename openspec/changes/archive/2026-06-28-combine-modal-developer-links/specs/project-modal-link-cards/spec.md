## RENAMED Requirements

- FROM: `### Requirement: Link cards display preview image as clickable button`
- TO: `### Requirement: Link cards display as compact icon-and-label buttons`

## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: Link cards use dark preview image only
**Reason**: Link cards no longer display any preview image.
**Migration**: Cards render the service icon directly; `previewImage` data is ignored.

### Requirement: Link cards show blur overlay with title
**Reason**: There is no image or title overlay; the card is a centered icon only.
**Migration**: The link label is exposed via `aria-label` instead of a visible blurred overlay.

### Requirement: Fallback when no preview image exists
**Reason**: The icon is now the permanent presentation, not a fallback state.
**Migration**: All link cards render the service icon directly, regardless of `previewImage`.

### Requirement: Link cards laid out in a 2-column grid
**Reason**: Links now live in the centered credits row, not a standalone 2-column grid.
**Migration**: See `project-modal-credits` — link buttons render inside the centered, wrapping credits row after the description.

### Requirement: Link card images fetched via usePortfolioImage
**Reason**: No images are fetched for link cards anymore.
**Migration**: Remove `usePortfolioImage` usage for links; the icon is rendered directly.
