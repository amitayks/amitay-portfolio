## MODIFIED Requirements

### Requirement: Image gallery uses 60/40 width split
The project modal SHALL display the main image at approximately 60% of the gallery width, with the credits side column (developer slot + link buttons) occupying the remaining ~40%. When there is no credits content (no developers and no links), the main image SHALL span the full width.

#### Scenario: Gallery renders with correct proportions
- **WHEN** the modal renders with credits content
- **THEN** the main image container occupies ~60% of the horizontal space and the credits side column occupies ~40%

#### Scenario: No credits content
- **WHEN** there are no developers and no links
- **THEN** no side column renders and the main image spans the full width

## REMOVED Requirements

### Requirement: Thumbnail grid is 2 columns by 3 rows
**Reason**: The project-image thumbnail grid is removed; the 40% area now holds the credits side column.
**Migration**: See `project-modal-credits` — the area beside the main image now contains the developer slot and link buttons.

### Requirement: Thumbnails are 1:1 square aspect ratio
**Reason**: There is no project-image thumbnail grid anymore.
**Migration**: Developer images in the credits column use their own square treatment (see `project-modal-credits`).

### Requirement: Thumbnail click swaps main image
**Reason**: Project image browsing is removed; the main image is static.
**Migration**: None — only the single `image` is shown; `imagePack` is no longer displayed in the modal.

### Requirement: Gallery reads up to 6 images from imagePack
**Reason**: `imagePack` is no longer rendered in the modal.
**Migration**: None — `imagePack` data remains but is unused by the modal.
