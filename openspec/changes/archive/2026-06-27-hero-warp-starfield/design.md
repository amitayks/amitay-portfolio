## Context

The hero background is rendered by `src/components/ShaderBackground.tsx`, which wraps every section's effect in a shared `LazyShader` (IntersectionObserver mount + CSS-gradient fallback + WebGL context-loss recovery) and feeds shaders a `maxPixelCount` from `useDeviceTier` and a paused `speed` from `usePageVisibility`. The hero variant currently renders the `GodRays` shader from `@paper-design/shaders-react`, with animated colors from the `useAnimatedRayColors` hook.

The intro is a phased sequence in `IntroContext` (`card-fadein → landing → final-flip → overlay-fadeout → done`). The hero shader only mounts from `landing` onward (`HomePage.tsx`), and the hero headline blurs in at `overlay-fadeout` (`Hero.tsx`). `IntroContext` already collapses to `done` immediately under `prefers-reduced-motion`.

This change replaces the hero effect with a custom warp starfield while preserving that surrounding infrastructure. `@paper-design/shaders-react` ships no starfield/warp shader (its `Warp` export is domain-warp noise), so the effect is built directly.

## Goals / Non-Goals

**Goals:**
- A convincing light-speed starfield that enters at max warp and decelerates into a calm cruise, synchronized with the intro's headline reveal.
- Reuse `LazyShader`, `useDeviceTier`, `usePageVisibility`, and the fallback-gradient pattern — no new rendering infrastructure.
- Readable hero: minimal motion where the text sits, comfortable resting state, full reduced-motion support.
- No new runtime dependencies.

**Non-Goals:**
- No change to the `about` (NeuroNoise), `stats` (GodRays), or `contact` (Water) effects.
- No Three.js / react-three-fiber / WebGL adoption for this effect.
- No nebula/volumetric raymarching; the cyan/violet glow is a simple radial gradient, not a simulated nebula.
- No change to intro timing or phase machinery — the starfield only *reads* `introPhase`.

## Decisions

### Decision: Canvas-2D projected starfield, not GLSL or Three.js
Render the field with a plain `<canvas>` 2D context: each star is `{x, y, z}`; project to screen as `vanishingPoint + (x/z, y/z) * focal * scale`; decrement `z` each frame by the current speed; draw a line from the previous projected position to the current one (the streak); recycle stars that cross the near plane.

- **Why**: The entire effect hinges on a *controllable speed value* that ramps with the intro. A plain JS number eased toward a per-phase target is trivial to drive and reason about; a shader uniform choreographed across phases is not. Canvas-2D also makes reduced-motion (draw one static frame) and freeze-on-hidden (stop the rAF) straightforward, and adds zero dependencies.
- **Alternatives considered**:
  - *Custom GLSL via the library's `ShaderMount`* — keeps the WebGL pipeline and `maxPixelCount`, and could look lusher, but discrete-streak control and the precise speed ramp are awkward in a fragment shader, plus ongoing GLSL maintenance. Rejected for control/complexity.
  - *Three.js / react-three-fiber* — a heavy dependency for a 2D-projected backdrop. Rejected as overkill.

### Decision: New `WarpStarfield` component inside the hero branch
Add `src/components/WarpStarfield.tsx`. `ShaderBackground`'s `variant === "hero"` branch renders `<WarpStarfield isVisible={isVisible} />` inside the existing `LazyShader`. The component reads `usePageVisibility`, `useDeviceTier`, and `useIntro` itself.

- **Why**: Keeps the shared mount/fallback/visibility infrastructure while isolating the imperative canvas logic. The WebGL context-loss handling in `LazyShader` is inert for a 2D canvas (harmless) and the CSS fallback still covers pre-mount/SSR-less first paint.

### Decision: Per-phase target speed with eased interpolation
Map intro phase → target speed (illustrative): `landing` → `MAX_WARP`, `overlay-fadeout` → mid, `final-flip` → low, `done` → `CRUISE`. Each frame, ease the rendered speed toward the target (exponential smoothing, e.g. `speed += (target - speed) * k`). **Initialize rendered speed at `MAX_WARP` on every mount** — not seeded from the current phase.

- **Why**: Phases are discrete and their wall-clock durations are owned by `IntroContext`; easing toward a target yields smooth deceleration regardless of exact phase timing and avoids hand-tuned keyframes. Seeding at `MAX_WARP` on *every* mount is deliberate: because `LazyShader` unmounts the starfield off-screen and remounts it on re-entry, this makes the warp **replay every time the hero scrolls back into view**, as well as on initial load. On initial load the target is still `MAX_WARP` at `landing`, so the seed simply holds until the phase target drops — preserving the intro-synced deceleration. On a re-entry (phase already `done`, target `CRUISE`) the seeded max warp decays straight to cruise, replaying the entry. (An earlier iteration seeded from the current phase to *suppress* the remount burst; that was reversed by request.)

### Decision: Device-tier scaling via star count + DPR cap (not `maxPixelCount`)
`maxPixelCount` is a `@paper-design` WebGL prop and does not apply here. Instead, derive `starCount` and a backing-store DPR cap from `useDeviceTier().tier` (desktop: most stars, DPR cap ~2; mobile: fewer, ~1.5; low-end: fewest, ~1). Size the canvas backing store to `cssSize * cap` and scale the 2D context.

- **Why**: These are the two real cost levers for a 2D starfield (number of streaks drawn × pixels filled). Reuses the existing tier detection without inventing a new heuristic.

### Decision: Reduced motion = one static frame
When `useReducedMotion()` (the same signal `IntroContext` uses) is true, draw a single frame of stars as points and never start the rAF loop.

- **Why**: Honors the platform setting and matches the existing intro behavior, which already jumps straight to `done`.

### Decision: Lifecycle gating
The rAF loop advances `z` only when `isVisible && pageVisible`; otherwise it parks (either skipping the advance or canceling the rAF and restarting on resume), preserving star state so resume has no visible jump. A `ResizeObserver` recomputes canvas size and vanishing point on layout changes.

- **Why**: Matches the `shader-lifecycle` viewport/visibility-pause requirements that previously applied to the GodRays `speed` prop.

### Decision: Palette and fallback
Stars blue-white (slight per-star hue jitter toward cyan), background near-black, a faint cyan/violet radial-gradient bloom drawn at the vanishing point each frame. Update `FALLBACK_GRADIENTS.hero` to a deep-space radial gradient.

## Risks / Trade-offs

- **Motion discomfort / text legibility behind a fast field** → The vanishing point sits behind the headline, where projected motion is *smallest* (stars near center are short points, not long streaks); the field decelerates to a low cruise before the user settles to read; cap `CRUISE` low. Reduced-motion users get a static field.
- **Canvas-2D CPU cost with many long streaks** → Tier-scaled `starCount`, DPR cap, freeze when offscreen/hidden, and a bounded `MAX_WARP`. Streaks are single `lineTo` segments, not per-pixel work.
- **Retina over-draw** → Cap backing-store DPR per tier rather than using raw `devicePixelRatio`.
- **Mount-timing flash** → The deep-space CSS fallback renders immediately (z-0) and the canvas initializes at `MAX_WARP`, so the first painted canvas frame is already mid-warp with no warm-up flash.
- **Reduced-motion path divergence** → Gate on `useReducedMotion()` directly in the component, not only on `introPhase === "done"`, so the static path is correct even if reached via the normal flow.

## Migration Plan

1. Add `WarpStarfield.tsx`; render it from the hero branch of `ShaderBackground`.
2. Update `FALLBACK_GRADIENTS.hero` to the deep-space gradient.
3. Remove the hero `GodRays` block, `useAnimatedRayColors`, and `HERO_RAY_COLORS_HSL` (hero-only; other variants use static colors).
4. Verify warp-on-entry → cruise across the intro, reduced-motion static field, offscreen/tab-hidden freeze, and the three device tiers.

**Rollback**: revert `ShaderBackground.tsx` and remove `WarpStarfield.tsx`; no data or API surface is affected.

## Open Questions

- Cruise behavior: perpetual slow drift (default) vs. easing fully to static after a few seconds. Defaulting to a continuous slow cruise; revisit if it competes with content.
- Optional subtle twinkle (per-star alpha flicker) at cruise — deferred unless the resting state feels too inert.
