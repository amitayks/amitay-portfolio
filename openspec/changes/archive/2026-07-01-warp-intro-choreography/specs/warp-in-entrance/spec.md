## ADDED Requirements

### Requirement: Warp-in entrance effect
The `WarpIn` component SHALL provide a "warp in toward you" entrance: the wrapped content SHALL begin small, tilted back, blurred, and transparent — as if emerging from deep space near the starfield's vanishing point — and SHALL animate forward to full scale, flat (no tilt), sharp, and opaque, settling into a flat readable resting state. The entrance SHALL apply a 3D perspective and an ease-out curve so the growth reads as decelerating toward the viewer, matching the warp stars streaming outward. The entrance SHALL be gated by a `show` flag and SHALL support a per-element `delay` and an initial `fromScale` (smaller = further away).

#### Scenario: Content warps in when shown
- **WHEN** a `WarpIn`-wrapped element's `show` becomes true
- **THEN** the content SHALL animate from small + tilted (rotateX) + blurred + transparent to full-scale + flat + sharp + opaque
- **AND** it SHALL end in a flat, readable resting state

#### Scenario: Perspective and deceleration
- **WHEN** the entrance plays
- **THEN** it SHALL apply a 3D perspective so the tilt reads as depth
- **AND** the motion SHALL ease out (decelerate) into place

### Requirement: Applied to the hero header
The hero heading, subtext, and CTA buttons SHALL each enter via `WarpIn`, gated on the hero's intro-complete signal (`canAnimate`), with a stagger so the heading arrives first, then the subtext, then the buttons. The heading SHALL use the most distant starting scale (largest travel).

#### Scenario: Header elements warp in staggered
- **WHEN** the hero entrance is triggered (`canAnimate` becomes true, at `overlay-fadeout`)
- **THEN** the heading, subtext, and buttons SHALL each warp in
- **AND** they SHALL be staggered (heading, then subtext, then buttons)

### Requirement: Applied to the navbar
The navbar's links pill and its right-side controls SHALL enter via `WarpIn`, gated on the navbar's `showNavContent` signal, replacing the previous plain opacity fade. They MAY use a nearer starting scale than the header (a subtler warp).

#### Scenario: Navbar warps in with the header
- **WHEN** `showNavContent` becomes true (at `overlay-fadeout`)
- **THEN** the nav links pill and the right-side controls SHALL warp in
- **AND** this SHALL occur together with the header entrance, while the warp starfield is still streaming

### Requirement: Reduced motion renders plainly
Under `prefers-reduced-motion: reduce`, `WarpIn` SHALL render its children directly with no transform, scale, tilt, blur, or entrance animation.

#### Scenario: Reduced-motion visitor sees no warp
- **WHEN** a visitor has `prefers-reduced-motion: reduce`
- **THEN** `WarpIn` SHALL render its children flat and visible with no entrance animation
