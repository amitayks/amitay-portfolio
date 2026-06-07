## Purpose

The navbar profile card behaviors: hover-flip to reveal the photo, click-to-expand to a full-screen profile view, mobile-friendly touch handling, keyboard accessibility, and position tracking across resize.

## Requirements

### Requirement: Navbar placeholder element
The Navbar component SHALL render an invisible placeholder `<div>` in the position where the logo icon button currently exists. This placeholder SHALL have the same dimensions as the current logo button (`w-12 h-12`, i.e., 48×48px) and be round (`rounded-full`). It SHALL occupy space in the navbar's flex layout but SHALL NOT be visually visible (no background, no border, no content). A React `ref` on this placeholder SHALL be exposed via `IntroContext` so the FlipCard can read its position with `getBoundingClientRect()`.

#### Scenario: Placeholder occupies correct space
- **WHEN** the Navbar renders
- **THEN** the placeholder SHALL occupy exactly the same flex layout position and dimensions as the current logo button
- **AND** the navbar's other elements (nav links pill, language toggle) SHALL be positioned identically to the current layout

#### Scenario: Placeholder is invisible
- **WHEN** the Navbar renders
- **THEN** the placeholder SHALL NOT be visually visible (no background, no border, no shadow)
- **AND** only the FlipCard overlay (positioned via fixed/absolute) SHALL be visible at that location

#### Scenario: Placeholder ref is accessible via context
- **WHEN** any component reads the `navbarIconRef` from `IntroContext`
- **THEN** the ref SHALL point to the placeholder DOM element
- **AND** `getBoundingClientRect()` on this ref SHALL return the correct viewport-relative coordinates

### Requirement: Hover flip to reveal profile photo
When the intro is complete (`introPhase === "done"`) and the user hovers over the FlipCard (which is visually overlaying the navbar placeholder), the card SHALL perform a smooth X-axis rotation from 0 to 180 degrees, revealing the profile photo on the back face. When the hover ends (mouse leaves), the card SHALL rotate back from 180 to 0 degrees, showing the logo face again.

The hover flip SHALL take approximately 500–700ms with an ease-in-out timing function. The transition SHALL be smooth and deliberate — not instant, but not sluggish.

#### Scenario: Hover starts flip to profile
- **WHEN** the intro is complete
- **AND** the user hovers over the navbar icon (FlipCard)
- **THEN** the card SHALL rotate 180 degrees on the X-axis over ~500–700ms
- **AND** the profile photo SHALL become visible as the back face rotates into view

#### Scenario: Hover end flips back to logo
- **WHEN** the user stops hovering (mouse leaves the FlipCard)
- **THEN** the card SHALL rotate back 180 degrees on the X-axis over ~500–700ms
- **AND** the logo face SHALL become visible again

#### Scenario: Rapid hover/unhover does not break animation
- **WHEN** the user quickly hovers and unhovers multiple times
- **THEN** the card SHALL smoothly reverse direction from its current rotation angle
- **AND** there SHALL be no visual jump, stutter, or stuck state

#### Scenario: Hover does not trigger during intro
- **WHEN** the intro is still playing (`introPhase !== "done"`)
- **AND** the user hovers over the FlipCard area
- **THEN** no hover flip SHALL occur
- **AND** the card SHALL continue its current intro animation uninterrupted

### Requirement: Click expands card to full-screen profile view
When the intro is complete and the user clicks the FlipCard (at navbar size), the card SHALL animate from the navbar position to the center of the viewport, expanding to show the full profile photo. This expansion animation SHALL mirror the intro's coin-flip flight in reverse:

1. **Position**: From navbar coordinates to viewport center
2. **X-axis rotation**: 4–6 full rotations (matching the intro's drama)
3. **Scale/size**: From 48×48px to a large square (`min(80vw, 400px)` × same, i.e., 1:1 aspect ratio)
4. **Border radius**: From 9999px (circle) to 24px (large rounded square)

The card SHALL land showing the profile photo (back face). Unlike the 2:3 intro card, the expanded card SHALL be 1:1 — matching the photo's natural aspect ratio, so the photo is fully visible without cropping (`object-fit: contain` or simply a 1:1 container with `object-fit: cover`).

A semi-transparent backdrop SHALL fade in behind the card during the expansion (`bg-black/60` or similar).

The total expansion animation SHALL take approximately 1000–1500ms.

#### Scenario: Click triggers expansion
- **WHEN** the intro is complete
- **AND** the user clicks the FlipCard at navbar size
- **THEN** the card SHALL begin expanding toward the viewport center

#### Scenario: Expansion mirrors intro flight
- **WHEN** the expansion animation plays
- **THEN** the card SHALL rotate 4–6 full turns on the X-axis (coin-flip tumble)
- **AND** the card SHALL grow from 48×48px circular to ~400×400px (or 80vw on mobile) rounded-square
- **AND** the flight path SHALL arc slightly (upward or downward, tuned visually)

#### Scenario: Expanded card shows full 1:1 profile
- **WHEN** the expansion animation completes
- **THEN** the card SHALL be centered in the viewport
- **AND** the card SHALL be 1:1 aspect ratio (square)
- **AND** the profile photo SHALL be fully visible without cropping
- **AND** the card SHALL show the back face (profile photo)

#### Scenario: Backdrop appears during expansion
- **WHEN** the expansion animation starts
- **THEN** a semi-transparent dark backdrop SHALL fade in behind the card
- **AND** the backdrop SHALL cover the entire viewport
- **AND** the backdrop z-index SHALL be below the FlipCard but above all page content

#### Scenario: Click during intro does nothing
- **WHEN** the intro is still playing
- **AND** the user clicks the FlipCard area
- **THEN** no expansion SHALL occur

### Requirement: Dismiss expanded profile view
When the profile view is expanded (card at center showing full profile), the user SHALL be able to dismiss it by:
1. Clicking the card itself, OR
2. Clicking the backdrop

Dismissing SHALL trigger a reverse animation: the card shrinks from center back to the navbar position with coin-flip rotation (4–6 turns), the backdrop fades out, and the card settles back at 48×48px circular showing the logo face. The dismiss animation timing and easing SHALL match the expansion animation.

#### Scenario: Click card to dismiss
- **WHEN** the profile view is expanded
- **AND** the user clicks the card
- **THEN** the card SHALL animate back to the navbar position with coin-flip rotation
- **AND** the card SHALL shrink to 48×48px circular
- **AND** the card SHALL land showing the logo face (front face)
- **AND** the backdrop SHALL fade out

#### Scenario: Click backdrop to dismiss
- **WHEN** the profile view is expanded
- **AND** the user clicks the backdrop (not the card)
- **THEN** the same dismiss animation SHALL play as clicking the card

#### Scenario: Dismiss animation matches expansion
- **WHEN** the dismiss animation plays
- **THEN** the duration, rotation count, and easing SHALL match the expansion animation
- **AND** the visual quality SHALL be identical in reverse

### Requirement: Mobile touch interactions
On mobile/touch devices, the hover-flip interaction SHALL NOT apply (no hover state on touch). Instead:

- **Tap** on the navbar FlipCard SHALL trigger the click-to-expand behavior (expand to full profile)
- The expand and dismiss interactions SHALL work identically to desktop click behavior
- Touch events SHALL be handled without interfering with the navbar's scroll-to-top functionality (currently the logo button has `onClick={() => scrollTo("home")}`)

**Important**: The FlipCard click-to-expand SHALL replace the current scroll-to-top behavior on the logo button. The user can still scroll to top via the "Home" nav item.

#### Scenario: Tap expands on mobile
- **WHEN** a mobile user taps the navbar FlipCard
- **THEN** the card SHALL expand to show the full profile (same as desktop click)
- **AND** no scroll-to-top SHALL occur

#### Scenario: No hover flip on touch devices
- **WHEN** a mobile user touches the FlipCard
- **THEN** no hover-flip animation SHALL play before the expansion
- **AND** the expansion SHALL begin directly from the logo face

### Requirement: Keyboard accessibility for navbar icon
The FlipCard's interactive area SHALL be keyboard-accessible. It SHALL be focusable via Tab key navigation. When focused and the user presses Enter or Space, it SHALL trigger the click-to-expand behavior. The placeholder element in the navbar SHALL have appropriate ARIA attributes (`role="button"`, `aria-label="View profile photo"`).

#### Scenario: FlipCard is focusable via Tab
- **WHEN** the user navigates with the Tab key
- **THEN** the FlipCard area SHALL receive focus in the normal tab order (positioned where the logo button currently is in the navbar)
- **AND** a visible focus indicator SHALL be displayed

#### Scenario: Enter/Space triggers expand
- **WHEN** the FlipCard area has keyboard focus
- **AND** the user presses Enter or Space
- **THEN** the click-to-expand animation SHALL trigger
- **AND** pressing Escape while expanded SHALL dismiss the profile view

#### Scenario: Escape dismisses expanded view
- **WHEN** the profile view is expanded
- **AND** the user presses the Escape key
- **THEN** the dismiss animation SHALL play (same as clicking the backdrop)

### Requirement: Position tracking on resize
After the intro completes and the FlipCard is visually settled at the navbar position, the component SHALL track the navbar placeholder's position on window resize events. If the viewport width changes (e.g., browser window resized, mobile orientation change), the FlipCard SHALL update its fixed position to continue overlaying the placeholder accurately. This position update SHALL be immediate (no animation) to avoid visual lag.

#### Scenario: Window resize updates card position
- **WHEN** the intro is complete
- **AND** the user resizes the browser window
- **THEN** the FlipCard SHALL immediately update its position to match the navbar placeholder's new `getBoundingClientRect()` coordinates
- **AND** there SHALL be no visible delay or animation during the repositioning

#### Scenario: Orientation change on mobile
- **WHEN** the device orientation changes (portrait ↔ landscape)
- **THEN** the FlipCard SHALL reposition to the placeholder's new coordinates
- **AND** the card SHALL remain visually aligned with the navbar
