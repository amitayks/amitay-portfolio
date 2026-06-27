## Why

The homepage hero currently renders a warm `GodRays` "rays of sun" shader, which reads as a static landscape mood. We want the hero to feel like the site *brought you somewhere* — a light-speed jump through space that drops out of warp into a calm star-drift exactly as the headline ("I ship products, not prototypes.") lands. The effect should reinforce the intro's existing cinematic arrival, not just sit behind it.

## What Changes

- **Replace** the hero `GodRays` shader with a custom canvas-2D **warp starfield**: a 3D-projected starfield where stars travel toward the camera and streak by, with streak length driven by a single `speed` value.
- **Warp entry on every viewport mount**: the field enters at maximum warp (long radial streaks) and decelerates to a slow cruise — both on the initial load and every time the hero scrolls back into view (`LazyShader` remounts it). On the initial load the deceleration target follows the intro phase (held through `landing`, easing to cruise by `done`) so it syncs with the headline blur-in; on a later re-entry it eases straight from max warp to cruise. The hero does **not** sit at constant max warp (legibility + motion comfort behind body text and CTAs).
- **Shift the hero palette** from warm earth tones to a cool deep-space scheme: near-black void, blue-white stars, a faint cyan/violet central bloom at the vanishing point.
- **Place the vanishing point** centered horizontally and slightly above mid-section, so stars emanate from behind the headline for depth.
- **Reuse existing infrastructure**: `LazyShader` viewport mounting, the CSS-gradient fallback, `useDeviceTier` (now scaling star count + canvas DPR instead of WebGL `maxPixelCount`), and `usePageVisibility` (pause when tab hidden). The starfield's `requestAnimationFrame` loop participates in viewport-pause and tab-visibility-pause just as the shader `speed` prop did.
- **Reduced motion**: when `prefers-reduced-motion` is set (or the intro is in `done` via reduced-motion), render a static starfield with no travel.
- **Remove** the now-dead hero `GodRays` config, the `useAnimatedRayColors` hook, and `HERO_RAY_COLORS_HSL` (used only by the hero).
- **Scope**: hero section only. The `about` (NeuroNoise), `stats` (GodRays), and `contact` (Water) shaders are untouched.

## Capabilities

### New Capabilities
- `hero-warp-starfield`: A canvas-2D, 3D-projected warp starfield for the hero background — light-speed entry that decelerates to a cruise in sync with the intro, cool deep-space palette, device-tier density scaling, and reduced-motion handling.

### Modified Capabilities
- `shader-lifecycle`: The hero background is no longer a WebGL `GodRays` shader driven by `useAnimatedRayColors`. The viewport-pause and page-visibility-pause requirements now also govern the hero starfield's rAF animation loop; the GodRays-specific hero color-throttling requirement is removed.

## Impact

- **Code**: `src/components/ShaderBackground.tsx` (hero branch swapped for the new starfield; remove `useAnimatedRayColors`, `HERO_RAY_COLORS_HSL`, hero `GodRays`). New component, e.g. `src/components/WarpStarfield.tsx`. Reads `introPhase` from `IntroContext` to drive the speed ramp.
- **Hooks/infra reused**: `LazyShader`, `useDeviceTier`, `usePageVisibility`, `IntroContext`.
- **Dependencies**: none added — pure canvas-2D, no Three.js, no new shader library export. `@paper-design/shaders-react` stays for the other sections.
- **Visual**: hero mood shifts warm → cool; the `FALLBACK_GRADIENTS.hero` value updates to a deep-space gradient to match.
