## ADDED Requirements

### Requirement: Image gallery uses 60/40 width split
The `ProjectImageGallery` component SHALL display the main image at approximately 60% of the gallery width and the thumbnail area at approximately 40%.

#### Scenario: Gallery renders with correct proportions
- **WHEN** the gallery is rendered with a main image and any number of thumbnails
- **THEN** the main image container occupies ~60% of the horizontal space and the thumbnail grid occupies ~40%

### Requirement: Thumbnail grid is 2 columns by 3 rows
The thumbnail area SHALL always render as a 2-column × 3-row grid, providing 6 slots total.

#### Scenario: All 6 thumbnails present
- **WHEN** the imagePack contains 6 or more images
- **THEN** the grid displays 6 thumbnails in a 2×3 layout and the total grid height matches the main image height

#### Scenario: Fewer than 6 thumbnails
- **WHEN** the imagePack contains fewer than 6 images
- **THEN** the grid still renders all 6 slots, with empty slots showing as blank placeholders maintaining grid structure

#### Scenario: No thumbnails
- **WHEN** the imagePack is empty
- **THEN** the grid still renders with 6 empty placeholder slots maintaining the 2×3 structure

### Requirement: Thumbnails are 1:1 square aspect ratio
All thumbnail slots SHALL use a 1:1 (square) aspect ratio. No circular clipping or border-radius rounding to circles.

#### Scenario: Thumbnail shape
- **WHEN** a thumbnail image is rendered
- **THEN** it displays as a square with minor rounded corners (consistent with existing `rounded-md` style)

### Requirement: Thumbnail click swaps main image
Clicking a thumbnail SHALL replace the main image with the clicked thumbnail's image.

#### Scenario: User clicks a thumbnail
- **WHEN** a user clicks on a populated thumbnail
- **THEN** the main image updates to show the clicked thumbnail's image

### Requirement: Gallery reads up to 6 images from imagePack
The gallery SHALL use up to 6 images from the `imagePack` array (previously limited to 4).

#### Scenario: imagePack has more than 6 images
- **WHEN** the imagePack contains more than 6 images
- **THEN** only the first 6 are displayed in the thumbnail grid
