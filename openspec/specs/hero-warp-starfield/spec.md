## Purpose

A canvas-2D, 3D-projected warp starfield for the homepage hero background — a light-speed entry that decelerates to a calm cruise in sync with the intro, replays each time the hero re-enters the viewport, uses a cool deep-space palette, scales density to the device tier, and honors reduced motion.

## Requirements

### Requirement: Warp starfield rendering
The hero background SHALL render a starfield on an HTML `<canvas>` using the 2D context and a 3D perspective projection. Each star SHALL have a depth that decreases over time, so the star moves outward from a vanishing point and is drawn as a line streak whose length is proportional to the current travel speed. A star that passes the camera (depth reaches the near plane) SHALL be recycled to a random position at the far depth.

#### Scenario: Stars stream outward from the vanishing point
- **WHEN** the starfield is animating
- **THEN** each star's projected position moves radially away from the vanishing point as its depth decreases

#### Scenario: Streak length tracks travel speed
- **WHEN** travel speed is high (warp)
- **THEN** each star is drawn as a long streak between its previous and current projected positions
- **AND WHEN** travel speed is low (cruise)
- **THEN** each star is drawn as a short streak or a point

#### Scenario: Stars recycle at the far plane
- **WHEN** a star's depth crosses the near plane (passes the camera)
- **THEN** the star is reassigned a new random x/y and the maximum depth, keeping the field populated indefinitely

### Requirement: Intro-synchronized speed ramp
The field SHALL begin at maximum warp **every time it mounts into the hero viewport** — on the initial page load and again each time the hero scrolls back into view (`LazyShader` remounts it). The deceleration target SHALL be derived from the current intro phase: held at maximum warp through `landing`, easing down through `overlay-fadeout` / `final-flip`, and reaching a slow cruise by `done`. On the initial load this synchronizes the deceleration with the headline reveal; on a later re-entry (intro already `done`) the seeded maximum warp eases straight down to the cruise target, replaying the warp. Deceleration SHALL be eased (smooth interpolation toward the target), never a discrete jump.

#### Scenario: Field enters at maximum warp on initial load
- **WHEN** the starfield first mounts during the intro (`landing`)
- **THEN** travel speed is at its maximum value and stars render as long radial streaks, holding through `landing` before easing down

#### Scenario: Field decelerates to cruise as the headline lands
- **WHEN** the intro advances through `overlay-fadeout` into `done`
- **THEN** travel speed eases down to the cruise value, synchronized with the headline blur-in, leaving stars as a slow drift

#### Scenario: Re-entering the hero replays the warp
- **WHEN** the hero scrolls back into the viewport after the intro has completed (`done`)
- **THEN** the starfield remounts at maximum warp and eases back down to cruise, replaying the warp entry

#### Scenario: Deceleration is continuous
- **WHEN** the rendered speed differs from the current target
- **THEN** the rendered speed interpolates smoothly toward the target rather than snapping to it

### Requirement: Deep-space palette
The starfield SHALL use a cool deep-space color scheme: a near-black background, blue-white stars, and a faint cyan/violet bloom centered on the vanishing point. The hero CSS-gradient fallback (shown before the canvas mounts or if it fails) SHALL be a matching deep-space gradient rather than the previous warm tones.

#### Scenario: Stars render blue-white on a near-black field
- **WHEN** the starfield draws a frame
- **THEN** the background is near-black and stars are rendered in blue-white tones

#### Scenario: Central bloom at the vanishing point
- **WHEN** the starfield renders
- **THEN** a faint cyan/violet radial glow is present at the vanishing point

#### Scenario: Fallback gradient is deep-space
- **WHEN** the hero is visible but the canvas has not yet mounted (or has failed)
- **THEN** the visible fallback is a deep-space gradient consistent with the starfield palette

### Requirement: Vanishing point placement
The vanishing point (origin of star travel) SHALL be positioned centered horizontally and slightly above the vertical middle of the hero section, so stars emanate from behind the headline for depth. The vanishing point SHALL be recomputed when the hero is resized.

#### Scenario: Vanishing point sits behind the headline
- **WHEN** the hero renders at any viewport size
- **THEN** the star travel origin is horizontally centered and above mid-height, behind the headline text

#### Scenario: Vanishing point follows resize
- **WHEN** the viewport or hero size changes
- **THEN** the vanishing point and canvas backing size are recomputed so the projection stays correct

### Requirement: Device-tier density scaling
The starfield SHALL scale its cost to the detected device tier via `useDeviceTier`. The star count and the canvas backing-store resolution (device-pixel-ratio cap) SHALL be reduced on lower tiers — desktop renders the most stars at the highest DPR cap, mobile fewer, and low-end the fewest.

#### Scenario: Desktop renders a dense field
- **WHEN** the device tier is "desktop"
- **THEN** the starfield uses its highest star count and DPR cap

#### Scenario: Low-end renders a sparse field
- **WHEN** the device tier is "low-end"
- **THEN** the starfield uses a reduced star count and a lower DPR cap to limit per-frame cost

### Requirement: Reduced-motion static field
When the user prefers reduced motion (`prefers-reduced-motion`, surfaced through the intro's reduced-motion handling), the starfield SHALL render a single static frame of stars with no travel and no streaks (points only), and SHALL not run a continuous animation loop.

#### Scenario: Reduced motion shows a static field
- **WHEN** `prefers-reduced-motion` is set
- **THEN** the starfield renders stars as static points with no warp travel and no rAF-driven motion

#### Scenario: Motion restored when preference clears
- **WHEN** the reduced-motion preference is no longer set
- **THEN** the starfield resumes its animated warp-to-cruise behavior

### Requirement: Animation loop gating
The starfield SHALL do no rendering work while off-screen or while the tab is hidden. Off-screen is handled by `LazyShader`, which mounts the starfield only within its 200px viewport range and unmounts it (tearing down the `requestAnimationFrame` loop) when the hero leaves that range — so a re-entry is a fresh mount that replays the warp (see "Intro-synchronized speed ramp"). While mounted, the loop SHALL advance star travel only when the page is visible (`usePageVisibility`); when the tab is hidden, travel SHALL freeze in place and resume from the frozen state, without a visible jump, when the tab becomes visible again.

#### Scenario: Loop is torn down when the hero scrolls off-screen
- **WHEN** the hero scrolls outside the `LazyShader` 200px rootMargin
- **THEN** `LazyShader` unmounts the starfield and its rAF loop is canceled, doing no off-screen rendering work

#### Scenario: Travel freezes when the tab is hidden
- **WHEN** the browser tab becomes hidden while the hero is in view
- **THEN** the starfield stops advancing star depth (travel freezes in place) until the tab is visible again

#### Scenario: Travel resumes in place when the tab returns
- **WHEN** the tab becomes visible again with the hero still in view
- **THEN** the starfield resumes advancing from where it froze, without a visible jump (the elapsed hidden time is dropped)
