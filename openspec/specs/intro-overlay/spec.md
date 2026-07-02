## Purpose

The first-load intro sequence: a full-screen overlay that plays a logo assembly, coin-flips into the navbar, lands on the profile photo, and flips back to the logo before fading out to hand off to the live site.
## Requirements
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
When the intro starts, the FlipCard SHALL be presented at the center of the viewport (both horizontally and vertically) in its large intro dimensions (2:3 aspect ratio, ~240×360px desktop, ~180×270px mobile). When the inline intro skeleton (see the `instant-intro-skeleton` capability) has already painted the card, the React FlipCard SHALL adopt that already-visible state and SHALL NOT replay an opacity 0→1 fade — the card is simply present and the assembly begins. When no skeleton hand-off occurs (e.g. reduced-motion is off but the skeleton was unavailable), the card MAY fade in over ~300–500ms, but the AnimatedLogo SHALL already be mounted so there is no empty-card beat.

#### Scenario: Card already present via skeleton hand-off
- **WHEN** the intro starts and the inline skeleton has painted the card
- **THEN** the React FlipCard SHALL appear at the same centered position and size
- **AND** it SHALL NOT fade from transparent to opaque (no re-materialize)

#### Scenario: Card is centered in its large intro dimensions
- **WHEN** the intro starts
- **THEN** the FlipCard SHALL be horizontally and vertically centered in the viewport
- **AND** it SHALL be in its large intro dimensions (2:3 aspect ratio)

### Requirement: Logo assembly plays inside centered card
The AnimatedLogo SHALL be mounted from the start of the intro (it SHALL NOT be withheld until a separate empty card-fade-in completes), and the scatter-to-assemble animation SHALL begin as soon as the card is on screen. This is the existing animation where the 6 SVG path fragments fly in from their respective start positions and coalesce into the logo shape. The AnimatedLogo SHALL be at its large intro size (proportional to the card dimensions), and the card SHALL remain stationary at screen center during the entire assembly.

#### Scenario: Assembly begins immediately, with no empty-card beat
- **WHEN** the intro card appears (whether via skeleton hand-off or React fade-in)
- **THEN** the AnimatedLogo SHALL already be mounted and the scatter-to-assemble animation SHALL begin without a separate empty card-fade-in delay first
- **AND** the card SHALL remain centered and stationary during assembly

#### Scenario: Assembly uses the existing fragment animation
- **WHEN** the logo assembly is playing
- **THEN** it SHALL use the same 6-fragment staggered scatter-to-assemble animation as the existing `AnimatedLogo` component (each fragment flying in from its start position)
- **AND** the assembly SHALL complete before the flight phase begins

### Requirement: Breath pause after logo assembly
After the AnimatedLogo assembly completes, there SHALL be a deliberate pause of approximately 200–400ms where the card holds perfectly still at screen center, showing the fully assembled logo with its shader. This pause gives the viewer a moment to register the logo before the dramatic flight begins.

#### Scenario: Card holds still after assembly
- **WHEN** the logo assembly completes
- **THEN** the card SHALL remain stationary at screen center for approximately 200–400ms
- **AND** no movement or transformation SHALL occur during this pause

### Requirement: Coin-flip flight from center to navbar
After the breath pause, the FlipCard SHALL animate from its centered position to the navbar icon placeholder position. This flight SHALL include ALL of the following simultaneous transformations:

1. **Position**: Translate from screen center to the navbar icon's `getBoundingClientRect()` coordinates, arcing slightly upward before curving down to the target (coin-toss feel).

2. **Y-axis rotation**: The card SHALL perform exactly **two full flips** on the Y-axis (`rotateY: 0 → 720deg`), landing **face-forward on the logo** (720° ≡ front face). The card SHALL NOT land on the back face, and there is no separate final flip. The back (liquid-glass) face flashes twice mid-flight during the two turns.

3. **Scale/size**: The card SHALL shrink from its intro dimensions (~240×360px) to the navbar icon dimensions (48×48px), width and height animating independently (2:3 → 1:1).

4. **Border radius**: From `16px` to `9999px`, animated continuously.

The intro flight duration SHALL be approximately 1000–1200ms (shorter than the expand/dismiss interaction, which keeps its own longer duration). The animation SHALL feel smooth and cinematic.

#### Scenario: Flight path arcs upward
- **WHEN** the flight animation is in progress
- **THEN** the card's Y-position SHALL follow an arc slightly above the straight-line path before descending to the navbar position

#### Scenario: Card performs two full Y-axis flips
- **WHEN** the flight animation is in progress
- **THEN** the card SHALL complete exactly two full rotations on its Y-axis (720°)
- **AND** the rotation SHALL ease smoothly with a bias toward deceleration

#### Scenario: Card lands face-forward on the logo
- **WHEN** the flight animation reaches the navbar position
- **THEN** the card SHALL end at `rotateY ≡ 720deg` (front face / logo visible)
- **AND** the card SHALL be 48×48px with border-radius 9999px (circular)

### Requirement: Landing hold on profile photo
After the flight lands at the navbar position showing the logo (front face), the card SHALL hold briefly — approximately 150–250ms — before the intro completes. There is no final flip and no back face shown at landing; the card is already logo-forward.

#### Scenario: Logo held at navbar position
- **WHEN** the flight animation completes during the intro
- **THEN** the card SHALL display the logo (front) face at the navbar icon position
- **AND** the card SHALL hold still for approximately 150–250ms before `done`
- **AND** no back face (photo or glass) SHALL be shown at landing

### Requirement: Overlay fade-out after intro completes
The black overlay SHALL fade out (opacity 1 → 0) at the **start of the flight** phase — the moment the card begins moving — revealing the warp starfield beneath it while the card flies to the navbar on top. The overlay SHALL remain transparent through `landing` and `overlay-fadeout`, then be removed from the DOM (unmounted) so it cannot block pointer events. The hero text still enters later, at `overlay-fadeout` (unchanged).

#### Scenario: Warp revealed at flight start
- **WHEN** the intro enters the `flight` phase
- **THEN** the overlay SHALL fade from opacity 1 to 0 over ~300–500ms, revealing the warp starfield
- **AND** the flying card SHALL remain visible above the revealed starfield

#### Scenario: Overlay removed from DOM
- **WHEN** the intro reaches the end of `overlay-fadeout`
- **THEN** the (already-transparent) overlay element SHALL be unmounted from the DOM
- **AND** no residual overlay SHALL intercept pointer events

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
The full intro sequence SHALL follow this timeline (approximate, tuned visually). On a normal load the inline skeleton hand-off starts the intro at `logo-assembly` (the empty card-fade-in beat is skipped):

| Phase | Duration (ms) | What Happens |
|-------|---------------|--------------|
| Logo assembly | ~900 | SVG fragments assemble into the logo (front face) |
| Breath | ~250 | Card holds still, logo visible |
| Flight | ~1100 | Two Y-axis flips, shrinking to the navbar; overlay fades → warp revealed |
| Landing | ~200 | Logo held at navbar position |
| Overlay-fadeout | ~1000 | Warp eases to cruise; hero header + navbar warp in |
| **Total** | **~3450** | Intro complete, site interactive |

There is no `final-flip` phase.

#### Scenario: Phases execute in sequence
- **WHEN** the intro plays
- **THEN** each phase SHALL start only after the previous completes
- **AND** the sequence SHALL NOT include a final-flip phase

