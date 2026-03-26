## ADDED Requirements

### Requirement: Full-screen fixed overlay
The IntroOverlay SHALL render as a `position: fixed` element covering the entire viewport (`inset: 0`) with a z-index higher than all other content (at minimum `z-60`, above the navbar's `z-50`). It SHALL be visible from the moment the app mounts and SHALL remain visible until the intro sequence is complete. The overlay SHALL prevent any page content from being visible behind it.

#### Scenario: Overlay visible on mount
- **WHEN** the app first renders
- **THEN** a full-screen overlay SHALL be visible covering the entire viewport
- **AND** no page content (Hero, Navbar, sections) SHALL be visible behind it

#### Scenario: Overlay above all content
- **WHEN** the overlay is active
- **THEN** its z-index SHALL be higher than the navbar (`z-50`)
- **AND** no page elements SHALL visually overlap the overlay

### Requirement: Subtle shader background on overlay
The overlay SHALL have a subtle animated shader background using `MeshGradient` from `@paper-design/shaders-react`. The shader SHALL use near-black colors with barely perceptible hints of deep blue and purple (e.g., `["#000000", "#050a14", "#0a0812", "#060610", "#000000"]`). The shader speed SHALL be very low (`speed: ~0.04`), distortion minimal (`distortion: ~0.15`), and swirl gentle (`swirl: ~0.2`). The visual effect SHALL resemble a dark ocean at night — the viewer barely notices movement, but the surface has life.

#### Scenario: Shader is barely visible
- **WHEN** the overlay is displayed
- **THEN** the background SHALL appear near-black with very subtle color movement
- **AND** the movement SHALL be slow and calm, not distracting from the card animation

#### Scenario: Shader is consistent with site palette
- **WHEN** the overlay shader colors are compared to other site shaders (Hero, About, etc.)
- **THEN** the color family SHALL be consistent (cool darks — deep blue/purple, not warm tones)

### Requirement: Card fade-in at screen center
When the overlay first appears, the FlipCard SHALL be positioned at the center of the viewport (both horizontally and vertically). The card SHALL fade in with an opacity transition from 0 to 1 over approximately 400–500ms, accompanied by a subtle scale animation from ~0.95 to 1.0. The card SHALL be in its large intro dimensions (2:3 aspect ratio, ~240×360px desktop).

#### Scenario: Card appears centered
- **WHEN** the intro starts
- **THEN** the FlipCard SHALL be horizontally and vertically centered in the viewport
- **AND** it SHALL fade in from fully transparent to fully opaque

#### Scenario: Card fade-in has subtle scale
- **WHEN** the card is fading in
- **THEN** it SHALL simultaneously scale from ~0.95 to 1.0
- **AND** the combined effect SHALL feel like the card is gently materializing, not popping in

#### Scenario: Card fade-in timing
- **WHEN** the app mounts
- **THEN** the card fade-in SHALL begin immediately (no initial delay)
- **AND** the fade-in SHALL complete within approximately 400–500ms

### Requirement: Logo assembly plays inside centered card
Immediately after the card fade-in completes, the AnimatedLogo assembly animation SHALL begin inside the card's front face. This is the existing scatter-to-assemble animation where 6 SVG path fragments fly in from different directions and coalesce into the logo shape, followed by the MeshGradient shader fading in through the logo mask. The AnimatedLogo SHALL be at its large intro size (proportional to the card dimensions). The card SHALL remain stationary at screen center during the entire assembly.

#### Scenario: Logo assembly starts after card fade-in
- **WHEN** the card fade-in completes (~500ms after mount)
- **THEN** the AnimatedLogo scatter-to-assemble animation SHALL begin
- **AND** the card SHALL remain centered and stationary

#### Scenario: Logo assembly uses existing animation
- **WHEN** the logo assembly is playing
- **THEN** it SHALL use the exact same fragment animation as the existing `AnimatedLogo` component (6 fragments, staggered at 150ms, flying from their respective start positions)
- **AND** after all fragments assemble, the MeshGradient shader SHALL fade in through the logo mask shape

#### Scenario: Logo assembly duration
- **WHEN** the logo assembly animation plays
- **THEN** the total duration SHALL be approximately 1700ms (6 × 150ms stagger + 800ms shader fade)
- **AND** the animation SHALL complete fully before the flight phase begins

### Requirement: Breath pause after logo assembly
After the AnimatedLogo assembly completes, there SHALL be a deliberate pause of approximately 200–400ms where the card holds perfectly still at screen center, showing the fully assembled logo with its shader. This pause gives the viewer a moment to register the logo before the dramatic flight begins.

#### Scenario: Card holds still after assembly
- **WHEN** the logo assembly completes
- **THEN** the card SHALL remain stationary at screen center for approximately 200–400ms
- **AND** no movement or transformation SHALL occur during this pause

### Requirement: Coin-flip flight from center to navbar
After the breath pause, the FlipCard SHALL animate from its centered position to the navbar icon placeholder position. This flight animation SHALL include ALL of the following simultaneous transformations:

1. **Position**: Translate from screen center to the navbar icon's `getBoundingClientRect()` coordinates. The path SHALL arc slightly upward (by approximately 80–120px above the straight line between start and end) before curving down to the target, simulating a coin tossed into the air.

2. **X-axis rotation**: The card SHALL rotate 4–6 full turns on the X-axis (`rotateX: 0 → 1440–2160deg`). The rotation SHALL accelerate during the first third, reach peak speed in the middle, and decelerate in the final third — like a real coin toss. The final rotation SHALL end at `rotateX ≡ 180deg` (back face showing = profile photo visible).

3. **Scale/size**: The card SHALL shrink from its intro dimensions (~240×360px) to the navbar icon dimensions (48×48px). Width and height animate independently to shift the aspect ratio from 2:3 to 1:1.

4. **Border radius**: From `16px` (rounded rectangle) to `9999px` (full circle), animated continuously.

The total flight duration SHALL be approximately 1200–1800ms. The animation SHALL feel smooth, dramatic, and cinematic — never jerky or stuttering.

#### Scenario: Flight path arcs upward
- **WHEN** the flight animation is in progress
- **THEN** the card's Y-position SHALL follow an arc that goes slightly above the straight-line path before descending to the navbar position
- **AND** the arc peak SHALL be approximately 80–120px above the straight line

#### Scenario: Card tumbles 4–6 full rotations on X-axis
- **WHEN** the flight animation is in progress
- **THEN** the card SHALL complete 4–6 full rotations around its horizontal X-axis
- **AND** rotation speed SHALL vary: slower at start, fastest in the middle, slower at the end (ease-in-out with bias toward deceleration)

#### Scenario: Profile photo flashes during tumble
- **WHEN** the card is tumbling during flight
- **THEN** the back face (profile photo) SHALL be visible for brief moments during each rotation
- **AND** the viewer SHALL perceive flashes of the profile photo without being able to fully register it until landing

#### Scenario: Card lands showing profile photo
- **WHEN** the flight animation reaches the navbar position
- **THEN** the card SHALL end with `rotateX ≡ 180deg` (the back face / profile photo visible)
- **AND** the card SHALL be 48×48px with border-radius 9999px (circular)

#### Scenario: Flight animation is smooth at 60fps
- **WHEN** the flight animation plays on a modern device (desktop or mobile released within 3 years)
- **THEN** the animation SHALL maintain a consistent frame rate without visible jank or stuttering
- **AND** all property transitions (position, rotation, scale, border-radius) SHALL be synchronized

### Requirement: Landing hold on profile photo
After the flight animation lands at the navbar position showing the profile photo, the card SHALL hold this state (back face visible, 48×48px, circular, at navbar position) for approximately 300–500ms. This is the "moment of recognition" where the viewer sees Amitay's face.

#### Scenario: Profile photo visible at navbar position
- **WHEN** the flight animation completes
- **THEN** the card SHALL display the profile photo (back face) at the navbar icon position
- **AND** the card SHALL remain still for approximately 300–500ms

### Requirement: Final deliberate flip to logo
After the landing hold, the card SHALL perform one final, slow, deliberate X-axis flip from the profile photo back to the logo face. This flip SHALL take approximately 400–600ms with a smooth ease-in-out timing. This single flip is the punctuation mark — intentional and unhurried, in contrast to the rapid tumble of the flight.

#### Scenario: Single flip from profile to logo
- **WHEN** the landing hold completes
- **THEN** the card SHALL rotate 180 degrees on the X-axis (from back face to front face)
- **AND** the rotation SHALL take approximately 400–600ms
- **AND** the easing SHALL be smooth ease-in-out (not linear, not abrupt)

#### Scenario: Logo face is final resting state
- **WHEN** the final flip completes
- **THEN** the card SHALL show the logo face (AnimatedLogo with shader)
- **AND** this SHALL be the card's resting state for the navbar icon going forward

### Requirement: Overlay fade-out after intro completes
After the final flip completes and the card is settled at the navbar position showing the logo, the overlay SHALL fade out over approximately 300–500ms (opacity 1 → 0). After the fade completes, the overlay element SHALL be removed from the DOM (unmounted) to avoid blocking pointer events or consuming GPU resources with the shader.

#### Scenario: Overlay fades out smoothly
- **WHEN** the final flip to logo completes
- **THEN** the overlay background (shader + any remaining visual elements) SHALL fade from opacity 1 to 0 over approximately 300–500ms

#### Scenario: Overlay is removed from DOM
- **WHEN** the overlay fade-out completes
- **THEN** the overlay element SHALL be unmounted / removed from the DOM entirely
- **AND** no residual overlay elements SHALL remain that could intercept pointer events or consume resources

### Requirement: Scroll locked during intro
While the intro overlay is active (from mount until the overlay is fully removed), the page SHALL NOT be scrollable. `document.body` SHALL have `overflow: hidden` applied. When the overlay is removed, normal scroll behavior SHALL be restored.

#### Scenario: No scroll during intro
- **WHEN** the intro overlay is active
- **THEN** the user SHALL NOT be able to scroll the page (mouse wheel, touch swipe, keyboard arrow keys)
- **AND** `document.body.style.overflow` SHALL be set to `"hidden"`

#### Scenario: Scroll restored after intro
- **WHEN** the intro overlay is removed
- **THEN** normal page scrolling SHALL be restored
- **AND** `document.body.style.overflow` SHALL be reset to its original value

### Requirement: Complete intro timeline
The full intro sequence SHALL follow this timeline (times are approximate, to be tuned visually):

| Phase | Start (ms) | Duration (ms) | What Happens |
|-------|-----------|---------------|--------------|
| Card fade-in | 0 | 400–500 | Card materializes at screen center |
| Logo assembly | ~500 | ~1700 | SVG fragments assemble, shader fades in |
| Breath pause | ~2200 | 200–400 | Card holds still, logo visible |
| Flight | ~2500 | 1200–1800 | Coin-flip tumble to navbar position |
| Landing hold | ~4000 | 300–500 | Profile photo visible at navbar |
| Final flip | ~4400 | 400–600 | Single flip back to logo |
| Overlay fade-out | ~4900 | 300–500 | Background dissolves, page revealed |
| **Total** | — | **~5300** | **Intro complete, site interactive** |

#### Scenario: Phases execute in sequence
- **WHEN** the intro plays
- **THEN** each phase SHALL start only after the previous phase completes
- **AND** there SHALL be no gaps or visual discontinuities between phases

#### Scenario: Total duration is approximately 5 seconds
- **WHEN** the full intro plays from start to finish
- **THEN** the total elapsed time SHALL be approximately 4.5–5.5 seconds
- **AND** the pacing SHALL feel deliberate and cinematic, not rushed or dragging
