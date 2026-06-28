## Purpose

The project modal's image area: a static main image at ~60% of the width, with the credits side column (developer + links) occupying the remaining ~40%. The image spans full width when there is no credits content. The former project-image thumbnail browser has been removed.

## Requirements

### Requirement: Image gallery uses 60/40 width split
The project modal SHALL display the main image at approximately 60% of the gallery width, with the credits side column (developer slot + link buttons) occupying the remaining ~40%. When there is no credits content (no developers and no links), the main image SHALL span the full width.

#### Scenario: Gallery renders with correct proportions
- **WHEN** the modal renders with credits content
- **THEN** the main image container occupies ~60% of the horizontal space and the credits side column occupies ~40%

#### Scenario: No credits content
- **WHEN** there are no developers and no links
- **THEN** no side column renders and the main image spans the full width
