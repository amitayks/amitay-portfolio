## ADDED Requirements

### Requirement: Dual-face 3D card structure
The FlipCard component SHALL render a 3D card with exactly two faces: a **front face** (logo + shader) and a **back face** (profile photo). The card SHALL use CSS 3D transforms with `transform-style: preserve-3d` on the inner container and `backface-visibility: hidden` on each face. The back face SHALL have `rotateX(180deg)` pre-applied so it is visible when the card is flipped 180 degrees on the X-axis. The component SHALL accept a `rotateX` value (in degrees) as a controlled prop to determine which face is visible.

#### Scenario: Card shows front face at 0 degrees
- **WHEN** the FlipCard is rendered with `rotateX={0}`
- **THEN** the front face (AnimatedLogo with MeshGradient shader) SHALL be visible
- **AND** the back face (profile photo) SHALL be hidden via `backface-visibility: hidden`

#### Scenario: Card shows back face at 180 degrees
- **WHEN** the FlipCard is rendered with `rotateX={180}`
- **THEN** the back face (profile photo) SHALL be visible
- **AND** the front face SHALL be hidden via `backface-visibility: hidden`

#### Scenario: Card at intermediate rotation shows edge
- **WHEN** the FlipCard is rendered with `rotateX={90}` (edge-on)
- **THEN** both faces SHALL be hidden (edge view) due to `backface-visibility: hidden` on each face
- **AND** the card SHALL appear as a thin edge/line from the viewer's perspective

### Requirement: Front face renders AnimatedLogo with shader
The front face SHALL contain the existing `AnimatedLogo` component with its `MeshGradient` shader background. The AnimatedLogo SHALL accept a `size` prop that adapts to the card's current scale. When the card is in its large intro state, the AnimatedLogo SHALL render at a size proportional to the card dimensions (e.g., `size` of ~80 for a 240px-wide card). When the card is in its small navbar state, the AnimatedLogo SHALL render at `size={16}` (matching the current navbar logo). The front face SHALL have no background of its own — the shader paints through the logo mask shape, and the liquid-glass card surface shows through everywhere else.

#### Scenario: Front face at intro scale
- **WHEN** the FlipCard is in the intro/centered state with card width ~240px
- **THEN** the AnimatedLogo SHALL render with a `size` prop scaled proportionally to fill the card face (approximately `size={80}`)
- **AND** the MeshGradient shader SHALL be visible through the logo mask

#### Scenario: Front face at navbar scale
- **WHEN** the FlipCard is in the navbar/settled state at 48×48px
- **THEN** the AnimatedLogo SHALL render with `size={16}` matching the current navbar logo appearance exactly
- **AND** the shader SHALL continue animating at this small size

### Requirement: Back face renders profile photo
The back face SHALL display a profile photo fetched from Supabase's `site-image` storage bucket via `useSiteImage()`. The photo is a 1:1 aspect ratio image. When displayed on the 2:3 card face, the image SHALL use `object-fit: cover` to fill the card, cropping the top and bottom to fit the taller aspect ratio. The image SHALL be centered both vertically and horizontally within the face (`object-position: center`).

#### Scenario: Profile photo fills 2:3 card
- **WHEN** the FlipCard is in its large intro state (2:3 aspect ratio)
- **AND** the card is flipped to show the back face
- **THEN** the 1:1 profile photo SHALL fill the entire card face using `object-fit: cover`
- **AND** the photo SHALL be cropped symmetrically (top and bottom trimmed) to fit the 2:3 ratio

#### Scenario: Profile photo in 1:1 navbar icon
- **WHEN** the FlipCard is in its navbar state (48×48px, 1:1 aspect ratio)
- **AND** the card is flipped to show the back face (e.g., on hover)
- **THEN** the 1:1 profile photo SHALL fill the circular icon without cropping
- **AND** the photo SHALL be clipped to the circular shape via `border-radius: 9999px` and `overflow: hidden`

#### Scenario: Profile photo not yet loaded
- **WHEN** the profile image URL has not yet resolved or the image has not finished downloading
- **AND** the back face would be visible
- **THEN** a liquid-glass fallback surface SHALL be displayed instead (matching the card's glass styling)
- **AND** when the image finishes loading, it SHALL fade in with a brief opacity transition (~300ms)

### Requirement: Profile image preloading
The FlipCard SHALL begin fetching the profile image URL via `useSiteImage()` immediately on mount, regardless of whether the back face is currently visible. Once the URL is resolved, the component SHALL render a hidden `<img>` element (or use `new Image()`) to trigger the browser's image download. The goal is to have the image fully cached by the time the card first flips (~2.4 seconds after mount).

#### Scenario: Image preloads during logo assembly
- **WHEN** the FlipCard mounts and the intro is in the `card-fadein` or `logo-assembly` phase
- **THEN** the profile image URL fetch SHALL already be in progress
- **AND** the browser SHALL be downloading the image in the background

#### Scenario: Image is ready before first flip
- **WHEN** the flight animation begins (~2.4s after mount)
- **AND** the network connection is reasonably fast
- **THEN** the profile image SHALL already be cached in the browser
- **AND** the back face SHALL display the photo immediately when it rotates into view (no pop-in)

### Requirement: Liquid-glass card surface
The FlipCard container SHALL apply the `liquid-glass-strong` visual treatment — translucent background, backdrop blur, animated conic-gradient border via `::before`. Both card faces SHALL be children of this styled container. The liquid-glass border animation SHALL continue during all card states (intro, flight, navbar, expanded).

**Implementation note**: If `transform-style: preserve-3d` conflicts with the `::before` pseudo-element or `overflow: hidden` from `liquid-glass-strong`, the glass effect SHALL be applied to each face element individually rather than the container, or the border SHALL be recreated with a dedicated inner element.

#### Scenario: Glass border visible during intro
- **WHEN** the card is centered on screen during the intro
- **THEN** the animated conic-gradient border from `liquid-glass-strong` SHALL be visible around the card edges
- **AND** the backdrop blur SHALL be applied

#### Scenario: Glass border visible at navbar size
- **WHEN** the card has settled into the navbar position (48×48px round)
- **THEN** the liquid-glass-strong styling SHALL match the existing navbar icon appearance exactly
- **AND** the animated border SHALL continue rotating

### Requirement: Perspective container
The FlipCard SHALL be wrapped in a container with `perspective: 1200px` applied. This perspective container SHALL NOT be the animated element — it SHALL be a stable parent so the vanishing point remains fixed as the card moves and rotates. The perspective value of `1200px` provides moderate 3D depth without fish-eye distortion.

#### Scenario: 3D depth is visually perceivable
- **WHEN** the card rotates on the X-axis
- **THEN** the near edge of the card SHALL appear slightly larger than the far edge (foreshortening)
- **AND** the effect SHALL be subtle and cinematic, not exaggerated

### Requirement: Card dimensions and shape morphing
The FlipCard SHALL support animated transitions between two shape states:

| State | Width | Height | Aspect Ratio | Border Radius |
|-------|-------|--------|-------------|---------------|
| **Intro (centered)** | ~240px (desktop) / ~180px (mobile) | width × 1.5 (2:3) | 2:3 | 16px (`rounded-2xl`) |
| **Navbar (settled)** | 48px | 48px | 1:1 | 9999px (`rounded-full`) |

During the flight animation, width, height, and border-radius SHALL all animate simultaneously. The aspect ratio shift (2:3 → 1:1) SHALL be achieved by animating width and height independently.

#### Scenario: Card starts as 2:3 rectangle
- **WHEN** the intro begins
- **THEN** the card SHALL render at approximately 240×360px on desktop (or 180×270px on mobile)
- **AND** the border radius SHALL be 16px (rounded rectangle)

#### Scenario: Card morphs to circle during flight
- **WHEN** the flight animation is in progress
- **THEN** width, height, and border-radius SHALL animate from the intro values to 48×48px / 9999px
- **AND** the shape change SHALL be smooth and continuous

#### Scenario: Card at navbar size is visually identical to old icon
- **WHEN** the intro is complete and the card is at navbar position
- **THEN** the card SHALL be exactly 48×48px with border-radius 9999px (full circle)
- **AND** it SHALL visually match the appearance of the previous navbar logo button (same glass effect, same logo size)
