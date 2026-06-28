## ADDED Requirements

### Requirement: Credits occupy the side column beside the main image
The project modal SHALL place developer and project-link content in a vertical column to the right of the main image (the former thumbnail area), not in a separate row elsewhere. The column SHALL contain, top to bottom: a developer container and a links container.

#### Scenario: Column position and order
- **WHEN** the modal renders with credits content
- **THEN** a column appears to the right of the main image, ordered developer container (top), links container (bottom)

#### Scenario: Column omitted when empty
- **WHEN** there are no developers and no links
- **THEN** no side column renders and the main image spans the full width

### Requirement: Containers have headers
Each container in the side column SHALL show a small header label identifying its content. The developer container header SHALL read "Developer" for one developer and "Built by" for more than one; the links container header SHALL read "Links".

#### Scenario: Developer container header
- **WHEN** the developer container renders with one developer
- **THEN** it shows a "Developer" header (and "Built by" when there is more than one)

#### Scenario: Links container header
- **WHEN** the links container renders
- **THEN** it shows a "Links" header above the link buttons

### Requirement: Developer slot adapts to developer count
The developer container SHALL change layout based on the number of credited developers:
- exactly 1 → the developer's image with the name centered below it and an optional description (bio)
- exactly 2 → each developer's image with their name centered beneath, side by side
- 3 to 6 → image-only thumbnails in a grid (up to six, in two rows); names and descriptions omitted

#### Scenario: Single developer
- **WHEN** there is exactly one credited developer
- **THEN** the container shows a large image with the name centered below it (styled as a title) and the description (bio) below that

#### Scenario: Two developers
- **WHEN** there are exactly two credited developers
- **THEN** the container shows two image-above-name cells side by side (no description)

#### Scenario: Three to six developers
- **WHEN** there are three to six credited developers
- **THEN** the container shows image-only thumbnails (names and descriptions omitted), arranged in two rows

#### Scenario: More than six developers
- **WHEN** there are more than six credited developers
- **THEN** only the first six thumbnails are shown

### Requirement: Single-developer image is large and centered
In the single-developer layout, the developer image SHALL be a large centered square that scales to fit the available space (shrinking when the container is short, capped at a sensible maximum), with the name centered beneath it. The image SHALL always remain square (never stretched to the photo's natural aspect ratio).

#### Scenario: Large centered image
- **WHEN** there is exactly one developer
- **THEN** the image is rendered as a large centered square that scales with the available space, staying square, with the name centered below

### Requirement: Developer attribution modes
The developer container SHALL honor the project's attribution mode.

#### Scenario: Named attribution
- **WHEN** `devAttribution` is `named`
- **THEN** developers show their `avatar_url` image and `display_name` (and `bio` as the description in the single-developer layout)

#### Scenario: Anonymized attribution
- **WHEN** `devAttribution` is `anonymized`
- **THEN** developers show a placeholder image and a generated name ("Developer A", "Developer B", …) with no description

#### Scenario: Hidden attribution
- **WHEN** `devAttribution` is `hidden`, or there are no developer profiles
- **THEN** no developer container is rendered

### Requirement: Missing developer avatar shows a placeholder
When a credited developer has no avatar image (or attribution is anonymized), the developer image SHALL be replaced by a placeholder user icon on a glass background.

#### Scenario: No avatar
- **WHEN** a credited developer has no avatar
- **THEN** a placeholder user icon is shown in place of the image

### Requirement: Column degrades gracefully
The side column SHALL render whenever it has at least one of: a developer container or a links container.

#### Scenario: Links only
- **WHEN** there are no visible developers but links exist
- **THEN** the column shows only the links container

#### Scenario: Developers only
- **WHEN** links are absent but developers exist
- **THEN** the column shows only the developer container

### Requirement: Mobile shows uniform tabs without the photo
On narrow (mobile) viewports, the credits SHALL render below the full-width main image as a stack of uniform tabs — a developer tab (name only, no photo), a GitHub tab, and a Live tab — all sharing the same style. The developer tab SHALL be a button intended to open a developer-info window (behavior added later). On wider viewports, the side-column layout (with the developer photo) is used instead.

#### Scenario: Mobile uniform tabs
- **WHEN** the modal is viewed on a narrow (mobile) viewport with credits content
- **THEN** the main image is full width and the developer (name only, no photo), GitHub, and Live render as three uniformly-styled tabs below it

#### Scenario: Developer tab is a button
- **WHEN** the developer tab renders on mobile
- **THEN** it is a button (intended to later open a developer-info window) styled identically to the GitHub/Live tabs

#### Scenario: Desktop keeps the side column
- **WHEN** the modal is viewed on a wider viewport
- **THEN** the side-column layout with the developer photo is shown instead of the tabs

### Requirement: Column containers fill the full image height
The side column SHALL stretch to the full height of the main image, and its containers SHALL grow to fill that height with no empty gap, regardless of which are present. The developer container SHALL take a larger share than the links container.

#### Scenario: Only links present
- **WHEN** the column has only the links container
- **THEN** it grows to fill the full image height (no empty space below it)

#### Scenario: Only a developer container present
- **WHEN** the column has only the developer container
- **THEN** the developer container fills the full image height

#### Scenario: Developer container plus links container
- **WHEN** the column has both containers
- **THEN** they fill the full image height together, with the developer container taller than the links container

#### Scenario: Containers shrink to fit (no overflow)
- **WHEN** the combined natural content would exceed the main image height
- **THEN** the containers and their contents (including the developer image) shrink together so the column never exceeds the main image height
