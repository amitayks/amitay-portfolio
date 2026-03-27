## Context

The portfolio site renders 4 WebGL shaders (via `@paper-design/shaders-react`) and extensive CSS glass effects (`backdrop-filter: blur`). Current state:

- **4 independent WebGL contexts**, each rendering every frame once mounted
- **No pause mechanism** — shaders continue rendering when scrolled off-screen
- **No pixel ratio cap** — Retina/3x devices render millions of unnecessary pixels on organic, soft effects
- **`backdrop-filter: blur(50px)`** on ~6 elements simultaneously (navbar, about, stats, skills cards, contact form)
- **Per-frame color animation** (`useAnimatedRayColors`) running `requestAnimationFrame` at 60fps for a slow sine wave
- **No page visibility handling** — shaders keep rendering in background tabs
- **No device-tier adaptation** — same quality on flagship desktop and budget phone

The `@paper-design/shaders-react` library supports `speed` (set to `0` to pause), `minPixelRatio`, and `maxPixelCount` props on all shader components. These are the primary levers for optimization.

## Goals / Non-Goals

**Goals:**
- Eliminate GPU work for off-screen shaders (pause rendering, not just unmount)
- Reduce per-frame pixel count via device-appropriate pixel ratio caps
- Lower compositing cost of glass blur without visible quality loss
- Throttle slow animations to match their perceptual rate
- Pause all GPU work when the tab is not visible
- Maintain identical visual appearance at normal viewing distance

**Non-Goals:**
- Removing or replacing any shader or glass element
- Adding a "low quality" mode toggle for users
- Changing the visual design, layout, or element structure
- Optimizing non-GPU performance (bundle size, network, etc.)
- Supporting WebGL1 fallbacks (library handles this internally)

## Decisions

### Decision 1: Pause shaders via `speed={0}` when off-screen

**Choice:** Pass `speed={isVisible ? originalSpeed : 0}` to each shader component. The `LazyShader` wrapper already tracks `isVisible` via IntersectionObserver — expose this to the shader props.

**Alternative considered:** Unmount/remount shaders when off-screen. Rejected because remounting creates visible flicker and WebGL context recreation is expensive. Setting `speed={0}` freezes the shader on its last frame with zero GPU cost.

**Implementation:** Refactor `LazyShader` to pass `isVisible` to a render-prop or context, so each shader variant can conditionally set its `speed`.

### Decision 2: Page Visibility API — pause everything when tab hidden

**Choice:** Create a `usePageVisibility()` hook using `document.visibilitychange`. When `document.hidden === true`, all shaders get `speed={0}` and the `useAnimatedRayColors` rAF loop skips frames.

**Alternative considered:** Rely on browser rAF throttling. Rejected because browsers throttle but don't stop rAF in background tabs, and WebGL rendering continues consuming GPU even at reduced framerate.

### Decision 3: Cap pixel ratio per device tier

**Choice:** Create a `useDeviceTier()` hook that returns quality settings based on device capability:

| Tier | Detection | `maxPixelCount` | Notes |
|------|-----------|-----------------|-------|
| Desktop | `!navigator.maxTouchPoints` or width > 1024 | `2048 * 1200` (~2.4M) | Equivalent to ~2x on most monitors |
| Mobile | touch + width <= 1024 | `960 * 600` (~576K) | ~1.5x on most phones |
| Low-end | `navigator.hardwareConcurrency <= 4` or `deviceMemory <= 4` | `640 * 400` (~256K) | ~1x, still looks smooth for organic effects |

**Why `maxPixelCount` over `minPixelRatio`:** The library's `maxPixelCount` caps total rendered pixels regardless of canvas dimensions. This auto-adapts to any viewport size. A fixed pixel ratio doesn't account for canvas area.

**Alternative considered:** Media queries in CSS. Rejected because shader resolution is a JS/WebGL concern, not CSS.

### Decision 4: Reduce `backdrop-filter: blur(50px)` to `blur(20px)`

**Choice:** Change `.liquid-glass-strong` from `blur(50px)` to `blur(20px)`.

**Rationale:** Glass elements sit over dark shader backgrounds. At `blur(20px)` the visual diffusion is still strong (the content behind is fully illegible), but the browser samples a much smaller kernel. The difference is imperceptible on dark/low-contrast backgrounds. The `blur(4px)` on `.liquid-glass` stays unchanged — it's already cheap.

**Alternative considered:** `blur(12px)`. Rejected as potentially noticeable on lighter sections. `blur(20px)` is a safe middle ground.

### Decision 5: Throttle `useAnimatedRayColors` to ~15fps

**Choice:** Add a frame-skip counter to the rAF loop. Only recalculate and `setColors()` every 4th frame. The sine wave drifts at `speed=0.8` with ±18deg hue shift — the per-frame delta is ~0.3deg, invisible to the human eye at 60fps. At 15fps the delta is ~1.2deg, still smooth.

**Alternative considered:** Using `setInterval` instead of rAF. Rejected because rAF naturally pauses in background tabs (partial benefit) and avoids timer drift.

### Decision 6: CSS `contain: content` on glass containers

**Choice:** Add `contain: content` to `.liquid-glass` and `.liquid-glass-strong`. This tells the browser the element's rendering is self-contained, enabling compositing optimizations.

**Why `content` not `strict`:** `strict` includes size containment which would break auto-sizing of glass cards. `content` gives layout + paint + style containment without requiring explicit dimensions.

### Decision 7: `will-change: transform` on shader canvas wrapper

**Choice:** Add `will-change: transform` to the shader wrapper div (the one with `absolute inset-0` that wraps the canvas). This promotes the element to its own compositor layer, preventing the shader canvas from triggering repaints on sibling elements.

**Note:** Only apply to the shader wrapper, not to glass elements. Adding `will-change` to many glass elements would increase memory usage for compositor layers.

## Risks / Trade-offs

- **[Blur reduction visible on light backgrounds]** → Mitigated: all shader backgrounds are dark. If a future section has a light background, it may need a different blur value. The glass class can be extended with a modifier if needed.

- **[`speed={0}` visual pop on scroll]** → Mitigated: the 200px rootMargin means shaders resume 200px before entering viewport. At normal scroll speed, the shader is already animating before the user sees it.

- **[Device tier misdetection]** → Mitigated: `hardwareConcurrency` and `deviceMemory` are hints, not guarantees. The tiers are conservative — even the "low-end" tier produces good quality for organic effects. Worst case: a capable device gets slightly lower resolution, which is imperceptible.

- **[`contain: content` breaking layout]** → Low risk since glass elements are already `position: relative; overflow: hidden`. Test that skills grid cards and stats section still auto-size correctly.

- **[Memory from `will-change` layers]** → Mitigated: only applied to 1-4 shader wrappers (one per visible section), not to dozens of glass elements.
