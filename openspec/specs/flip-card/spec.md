## Purpose

A dual-face 3D card used in the navbar and intro: front shows the AnimatedLogo shader, back shows the profile photo, with perspective-based flip animation on a liquid-glass surface.
## Requirements
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
The front face SHALL contain the `AnimatedLogo` component (inline white SVG logo fragments — no raster image or shader). The logo SHALL be sized as a **constant 1/3 of the card's current width** via CSS — a `calc(100% / 3)` wrapper with a `1 / 2` aspect ratio, with `AnimatedLogo` filling it (`fill`) — rather than a discrete pixel `size` prop. Because the size is a fraction of the animated card, the logo SHALL scale **continuously** with the card: ~80px in the ~240px intro card and 16px in the 48px navbar icon (both exactly 1/3 of the card width), with no snap or resize step during the flight. The front face SHALL have no background of its own; the liquid-glass card surface shows behind the logo.

#### Scenario: Logo scales continuously during the flight
- **WHEN** the card animates from its intro size (~240px) to the navbar size (48px) during the flight
- **THEN** the logo SHALL scale smoothly in lockstep (~80px → 16px), staying 1/3 of the card width throughout
- **AND** there SHALL be no discrete size snap at landing

#### Scenario: Front face at intro scale
- **WHEN** the FlipCard is in the intro/centered state with card width ~240px
- **THEN** the logo SHALL render at ~80px (1/3 of the card width), filling its wrapper

#### Scenario: Front face at navbar scale
- **WHEN** the FlipCard is in the navbar/settled state at 48×48px
- **THEN** the logo SHALL render at 16px (1/3 of the card width), matching the navbar logo appearance

### Requirement: Back face renders profile photo
The back face SHALL display a profile photo fetched from Supabase's `site-image` storage bucket via `useSiteImage()`, but the photo SHALL NOT be fetched or rendered during the intro. While the intro is running (`introPhase !== "done"`) the back face SHALL display only the liquid-glass surface — no photo — so that no heavy image is on the first-load critical path. After the intro completes, the photo SHALL be available for the navbar interactions: it is a 1:1 aspect ratio image, and when shown on the 1:1 navbar icon it SHALL fill the circular icon without cropping (`object-fit: cover`, `object-position: center`, clipped via `border-radius: 9999px` and `overflow: hidden`); when shown on the expanded 2:3 card it SHALL fill the face using `object-fit: cover`, cropped symmetrically.

#### Scenario: Back face is glass (no photo) during the intro
- **WHEN** the FlipCard's back face rotates into view during the intro flight (before `introPhase === "done"`)
- **THEN** the back face SHALL show only the liquid-glass surface
- **AND** no profile photo SHALL be fetched or displayed

#### Scenario: Profile photo in 1:1 navbar icon (post-intro)
- **WHEN** the intro has completed and the FlipCard is in its navbar state (48×48px, 1:1 aspect ratio)
- **AND** the card is flipped to show the back face (e.g., on hover)
- **THEN** the 1:1 profile photo SHALL fill the circular icon without cropping
- **AND** the photo SHALL be clipped to the circular shape via `border-radius: 9999px` and `overflow: hidden`

#### Scenario: Profile photo on expanded card (post-intro)
- **WHEN** the intro has completed and the card is expanded to its large 2:3 state showing the back face
- **THEN** the 1:1 profile photo SHALL fill the card face using `object-fit: cover`
- **AND** the photo SHALL be cropped symmetrically (top and bottom trimmed) to fit the taller ratio

#### Scenario: Photo not yet loaded post-intro
- **WHEN** the back face would be visible after the intro but the lazily-fetched photo has not finished downloading
- **THEN** a liquid-glass fallback surface SHALL be displayed instead (matching the card's glass styling)
- **AND** when the image finishes loading, it SHALL fade in with a brief opacity transition (~300ms)

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

### Requirement: Deferred profile image loading
The FlipCard SHALL NOT fetch the profile image URL or download the image while the intro is running. The fetch (`useSiteImage()` and the subsequent image download) SHALL be deferred until after the intro has completed (`introPhase === "done"`), or until the back face is first needed by a navbar interaction, whichever the implementation finds cleaner. The goal is that a fresh/uncached first load incurs zero bytes and zero Supabase round-trips for the profile photo until the intro is over.

#### Scenario: No image fetch during the intro
- **WHEN** the FlipCard mounts and the intro is playing (`introPhase !== "done"`)
- **THEN** no request for the profile image URL or the image file SHALL be issued
- **AND** the first-load network and main thread SHALL be free of the profile photo

#### Scenario: Image fetched after the intro completes
- **WHEN** `introPhase` becomes `"done"`
- **THEN** the profile image fetch SHALL begin
- **AND** once loaded, the photo SHALL be shown on the navbar back face for hover/expand interactions

