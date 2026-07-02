## MODIFIED Requirements

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

### Requirement: Landing hold on profile photo
After the flight animation lands at the navbar position, the card SHALL hold briefly (approximately 300–500ms) before the final flip. During the intro the photo is not loaded (see `flip-card`), so the landed back face SHALL show the liquid-glass surface rather than a profile photo. The flight and landing motion themselves are unchanged.

#### Scenario: Glass back face held at navbar position
- **WHEN** the flight animation completes during the intro
- **THEN** the card SHALL display its liquid-glass back face (no profile photo) at the navbar icon position
- **AND** the card SHALL remain still for approximately 300–500ms before the final flip to the logo face
