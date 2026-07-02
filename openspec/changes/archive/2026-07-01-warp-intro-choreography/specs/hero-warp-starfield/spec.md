## MODIFIED Requirements

### Requirement: Intro-synchronized speed ramp
On the initial intro the field SHALL **ease in** from a gentle drift up to maximum warp, then decelerate; on re-entry it SHALL seed at maximum warp (as before). Specifically:

- The field SHALL mount at the `breath` phase and hold a slow **START** drift while it warms up behind the (still-opaque) overlay, so the ease-in is fully visible once the flight reveals it.
- At the `flight` phase (when the overlay reveals the starfield) the speed SHALL ease from START up to maximum warp over a fixed launch ramp (~700ms, easeInOutCubic), then hold maximum warp through the rest of the flight and `landing`.
- From `overlay-fadeout` onward the speed SHALL ease down toward a slow cruise by `done` — the existing eased deceleration, unchanged.
- On a **re-entry** (the hero scrolls back into view after the intro is `done`) the field SHALL seed at maximum warp and ease straight down to cruise, replaying the original warp-in (no ease-in ramp).

Both the launch ramp and the deceleration SHALL be eased (smooth interpolation toward the target), never a discrete jump.

#### Scenario: Field eases in to full warp on initial load
- **WHEN** the flight reveals the starfield during the initial intro
- **THEN** travel speed SHALL start at a gentle drift and ease up to maximum warp over the launch ramp
- **AND** it SHALL then hold maximum warp through `landing` before the slowdown begins

#### Scenario: Field decelerates to cruise as the headline lands
- **WHEN** the intro advances through `overlay-fadeout` into `done`
- **THEN** travel speed eases down to the cruise value, leaving stars as a slow drift

#### Scenario: Re-entering the hero replays the warp
- **WHEN** the hero scrolls back into the viewport after the intro has completed (`done`)
- **THEN** the starfield remounts at maximum warp and eases down to cruise (no ease-in ramp)

#### Scenario: Speed changes are continuous
- **WHEN** the rendered speed differs from the current target
- **THEN** the rendered speed interpolates smoothly toward it rather than snapping
