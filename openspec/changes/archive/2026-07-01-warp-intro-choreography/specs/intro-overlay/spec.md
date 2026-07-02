## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: Final deliberate flip to logo
**Reason**: The final flip existed to turn the card from the profile photo (revealed during the flight) back to the logo. With the profile image removed from the intro and the flight now landing face-forward on the logo (two full flips), there is nothing to flip back from.
**Migration**: The flight lands directly on the logo face (`rotateY ≡ 720°`); the `final-flip` phase is removed from the phase order, and the card's post-intro resting rotation is synced to the flight's final value so the hover flip still works with no jump.
