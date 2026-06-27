## 1. Scaffold the WarpStarfield component

- [x] 1.1 Create `src/components/WarpStarfield.tsx` with a `<canvas>` filling its parent (`absolute inset-0`, `width/height: 100%`), accepting an `isVisible: boolean` prop.
- [x] 1.2 Wire the canvas backing store: size it to `cssSize * dprCap` and `ctx.scale(dprCap, dprCap)`; recompute on a `ResizeObserver`. Compute the vanishing point as horizontally centered, slightly above mid-height.
- [x] 1.3 Pull `usePageVisibility()`, `useDeviceTier()`, and `useIntro()` (`introPhase`) inside the component; add `useReducedMotion()` from `motion/react`.

## 2. Starfield model and projection

- [x] 2.1 Define star data as a typed array / array of `{x, y, z}` with a far-depth max; seed `starCount` stars at random positions and depths.
- [x] 2.2 Implement perspective projection: `screen = vanishingPoint + (x/z, y/z) * focal`; track each star's previous projected position for streak drawing.
- [x] 2.3 Implement the per-frame update: decrement `z` by current speed; when `z` crosses the near plane, recycle the star to new random `x/y` at max depth.
- [x] 2.4 Derive `starCount` and `dprCap` from `useDeviceTier().tier` (desktop: most stars / cap ~2; mobile: fewer / ~1.5; low-end: fewest / ~1).

## 3. Rendering (palette + streaks + bloom)

- [x] 3.1 Clear to near-black each frame (full clear, or low-alpha fill for a subtle trail if it reads better).
- [x] 3.2 Draw each star as a line from its previous to current projected position (streak); blue-white stroke with slight per-star hue jitter toward cyan; width/alpha scale with nearness.
- [x] 3.3 Draw a faint cyan/violet radial-gradient bloom centered on the vanishing point each frame.
- [x] 3.4 Update `FALLBACK_GRADIENTS.hero` in `ShaderBackground.tsx` to a matching deep-space radial gradient.

## 4. Intro-synchronized speed ramp

- [x] 4.1 Map `introPhase` → target speed: `landing`/`final-flip` → `MAX_WARP`, `overlay-fadeout` → mid, `done` → `CRUISE` (tune constants so cruise is calm and legible).
- [x] 4.2 Each frame, ease rendered speed toward the target (`speed += (target - speed) * k`); initialize rendered speed at `MAX_WARP` on mount so the canvas's first painted frame is mid-warp.
- [x] 4.3 Verify deceleration lands in sync with the headline blur-in (`overlay-fadeout` → `done`).

## 5. Lifecycle gating and reduced motion

- [x] 5.1 Run the rAF loop only while `isVisible && pageVisible`; when either is false, freeze travel (skip `z` advance or cancel rAF) preserving star state; resume without a jump.
- [x] 5.2 When `useReducedMotion()` is true, render a single static frame of stars as points (no streaks, no rAF loop); re-render correctly if the preference clears.
- [x] 5.3 Clean up rAF, `ResizeObserver`, and listeners on unmount.

## 6. Integrate and remove the old hero shader

- [x] 6.1 In `ShaderBackground.tsx`, replace the `variant === "hero"` `GodRays` block with `<WarpStarfield isVisible={isVisible} />` inside the existing `LazyShader`.
- [x] 6.2 Remove `useAnimatedRayColors`, `HERO_RAY_COLORS_HSL`, and the `hslToHex` helper if no longer referenced; drop the now-unused `GodRays` import if nothing else uses it (note: `stats` variant still references `GodRays`, so keep the import unless that branch is also gone).
- [x] 6.3 Remove the hero entry from `SHADER_SPEEDS` if it is no longer consumed by any WebGL shader path.

## 7. Verify

- [x] 7.1 Run the dev server and confirm: warp-on-entry → decelerate → cruise across the intro; vanishing point sits behind the headline; cool palette reads correctly.
- [x] 7.2 Confirm freeze on tab-hide and on scroll-away, and clean resume; confirm reduced-motion shows a static field.
- [x] 7.3 Spot-check the three device tiers (throttle / resize) for smooth framerate; confirm the deep-space fallback shows before the canvas mounts.
- [x] 7.4 Run `npm run build` / lint to confirm no dead-code or type errors from the removed hero shader code.

## 8. Replay warp on every viewport re-entry

- [x] 8.1 Seed rendered speed at `MAX_WARP` on every mount (not from the current phase), so the warp entry replays each time the hero scrolls back into view as well as on initial load.
- [x] 8.2 Keep the per-phase target driving deceleration so the initial load stays synced to the intro (held through `landing`, easing to cruise by `done`).
- [x] 8.3 Sync artifacts: speed-ramp + loop-gating requirements, `shader-lifecycle` viewport-pause delta, proposal and design.
