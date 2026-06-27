## MODIFIED Requirements

### Requirement: Shader viewport pause
When a shader section scrolls out of the viewport, it SHALL do no rendering work. For WebGL shader sections this is done by setting `speed={0}`; the hero warp starfield is unmounted by `LazyShader` (its `requestAnimationFrame` loop is torn down) once the hero leaves the 200px rootMargin. When the section scrolls back into viewport range, a WebGL shader SHALL resume its original speed value, while the hero warp starfield SHALL re-mount and replay its warp entry (it is not resumed from a frozen state).

#### Scenario: Shader pauses when scrolled away
- **WHEN** a shader section exits the viewport plus 200px margin
- **THEN** a WebGL shader's `speed` prop is set to `0` (halting GPU rendering), and the hero warp starfield is unmounted with its rAF loop canceled

#### Scenario: Shader resumes when scrolled into view
- **WHEN** a shader section enters the viewport 200px rootMargin
- **THEN** a WebGL shader's `speed` prop is restored to its configured value (e.g., `0.3` for the about NeuroNoise), and the hero warp starfield re-mounts at maximum warp and replays its deceleration to cruise

### Requirement: Page visibility pause
All shaders and animation loops SHALL pause when the browser tab is not visible. The system SHALL use the Page Visibility API (`document.visibilitychange` / `document.hidden`) to detect tab visibility.

#### Scenario: Tab becomes hidden
- **WHEN** the user switches to another browser tab
- **THEN** all WebGL shader `speed` props are set to `0` and the hero warp starfield rAF loop freezes star travel

#### Scenario: Tab becomes visible again
- **WHEN** the user returns to the portfolio tab
- **THEN** shaders resume their configured speed and the hero warp starfield resumes star travel

## REMOVED Requirements

### Requirement: Color animation throttling
**Reason**: The `useAnimatedRayColors` hook existed only to drive the hero `GodRays` ray colors. The hero now uses the canvas-2D warp starfield (see the `hero-warp-starfield` capability), whose color and motion are intrinsic to its own rAF render loop, so the separate throttled color-animation hook is removed.
**Migration**: Remove `useAnimatedRayColors` and `HERO_RAY_COLORS_HSL` from `ShaderBackground.tsx`. Hero color/motion is now produced by the warp starfield's own render loop; no separate per-frame color recomputation hook is required. The remaining WebGL shaders (`about` NeuroNoise, `contact` Water) use static color props and never depended on this hook.
