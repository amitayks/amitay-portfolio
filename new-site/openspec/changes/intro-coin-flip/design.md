## Context

The portfolio site is a single-page React 19 app built with Vite, using `motion/react` v12 (Framer Motion) for animations and `@paper-design/shaders-react` for WebGL shader backgrounds. The site's visual language is built around "liquid glass" — translucent surfaces with animated conic-gradient borders, backdrop blur, and shader-driven color. The existing `AnimatedLogo` component assembles 6 SVG path fragments via staggered Framer Motion animations, then reveals a `MeshGradient` shader masked to the logo shape. It currently plays at 16×32px inside a 48×48 round liquid-glass button in the navbar.

The navbar is `fixed top-4 z-50`, with the logo button at `w-12 h-12 rounded-full liquid-glass-strong`. The Hero section animates a `BlurText` heading (word-by-word blur-in) and a `motion.p` subtext (blur + opacity fade). Both animate on mount/visibility.

Profile images live in the Supabase `site-image` storage bucket, fetched via `useSiteImage()` → `getSiteImage()` → `createSignedUrl()`.

### Current component tree (relevant)
```
App
├── PersistQueryClientProvider
│   └── LanguageProvider
│       └── AppContent
│           ├── Navbar
│           │   └── AnimatedLogo (size=16, in 48×48 button)
│           ├── Hero
│           │   ├── ShaderBackground variant="hero"
│           │   ├── BlurText (heading)
│           │   └── motion.p (subtext)
│           └── ...sections
```

### Key constraints
- `liquid-glass-strong` uses `overflow: hidden` (clips children) — the navbar button already overrides this with `!overflow-visible` for the AnimatedLogo's scatter animation
- The `liquid-glass` / `liquid-glass-strong` `::before` pseudo-element provides the animated conic-gradient border — any new card component that uses this styling gets the border for free
- `AnimatedLogo` uses `scaleX(-1)` on its root (logo is mirrored)
- `AnimatedLogo` total assembly duration: `6 fragments × 150ms stagger + 800ms shader fade ≈ 1700ms`
- `useReducedMotion()` from `motion/react` is already used in AnimatedLogo and BlurText

## Goals / Non-Goals

**Goals:**
- Create a cinematic entrance sequence that plays on every site load/reload
- Build a dual-face 3D card with the logo on the front and the profile photo on the back
- Animate the card from screen center to the navbar icon position with a dramatic X-axis coin-flip tumble (4–6 rotations)
- Make the navbar icon an interactive flip card (hover → profile reveal, click → full-screen expand)
- Gate all page content animations behind the intro completion
- Maintain the existing liquid-glass visual language throughout

**Non-Goals:**
- Session-based "skip intro on revisit" logic — the intro plays every time
- Sound effects or haptic feedback
- Customizable animation timing via user settings
- Loading screen / progress bar — the intro IS the loading moment
- Changing the AnimatedLogo SVG paths or assembly animation itself
- Modifying any sections beyond Hero (no other sections need gating — they use IntersectionObserver)

## Decisions

### 1. Single FlipCard instance in a fixed-position portal layer

**Decision**: The FlipCard component renders in a fixed-position layer at the `App` root level (sibling to the main content), NOT inside the navbar DOM. The navbar has an invisible 48×48 placeholder `<div>` where the icon would normally be. The FlipCard visually overlays this placeholder using measured coordinates.

**Why**: This avoids DOM reparenting (moving a node from one parent to another breaks React's reconciliation and restarts animations). The card lives in one place forever and just animates its position. During intro it's centered; after settling it tracks the navbar placeholder's `getBoundingClientRect()`. On click-expand, it animates back to center — no DOM changes needed.

**Alternatives considered**:
- **Two instances (overlay card + navbar card)**: Would require a pixel-perfect handoff at the end of the flight animation. Any timing mismatch causes a visual "pop." Rejected for fragility.
- **Single instance reparented into navbar**: React unmounts/remounts the component on reparenting, losing animation state. Would require `createPortal` gymnastics and still risk flicker. Rejected.

**How it works**:
```
App
├── LanguageProvider
│   └── IntroProvider ← NEW (provides introPhase + navbarIconRef)
│       └── AppContent
│           ├── Navbar
│           │   └── <div ref={navbarIconRef} /> ← invisible placeholder (48×48)
│           ├── Hero (gated by introPhase)
│           └── ...
│       └── FlipCard ← NEW (fixed position, reads navbarIconRef)
│       └── IntroOverlay ← NEW (fixed overlay with shader BG)
```

### 2. IntroContext for coordination

**Decision**: A React context (`IntroContext`) manages the intro state machine and provides:
- `introPhase`: the current phase of the intro (`"card-fadein" | "logo-assembly" | "flight" | "landing" | "final-flip" | "done"`)
- `navbarIconRef`: a ref to the navbar placeholder element
- `isIntroComplete`: boolean shortcut for `introPhase === "done"`

**Why**: Multiple components need to react to the intro state — the overlay (to know when to fade out), the FlipCard (to know which animation phase to execute), the Hero (to know when to start its animations), and the Navbar (to know when to show nav links). A context avoids prop-drilling through 4+ levels and provides a single source of truth.

**Alternatives considered**:
- **Prop drilling**: Would require threading `introPhase` through App → AppContent → Hero/Navbar. Messy and couples unrelated components.
- **Global event bus / zustand**: Over-engineered for a single piece of state that only matters at mount time.

### 3. X-axis rotation with separate easing per property

**Decision**: The flight animation uses Framer Motion's `animate` with independently-eased properties:

| Property | Start | End | Easing | Notes |
|----------|-------|-----|--------|-------|
| `x` | `centerX` | `navbarX` | `[0.4, 0, 0.2, 1]` | Smooth ease-out |
| `y` | `centerY` | `navbarY` | keyframes via `[0, -arcPeak, 1]` times | Slight upward arc then down |
| `rotateX` | `0` | `1800` (5 full) | `[0.2, 0.8, 0.3, 1]` | Fast in middle, decelerates at end |
| `scale` | `1` | `targetScale` | `[0.4, 0, 0.2, 1]` | Matches position easing |
| `width` | `cardWidth` | `48` | `[0.4, 0, 0.2, 1]` | Aspect ratio shift |
| `height` | `cardHeight` | `48` | `[0.4, 0, 0.2, 1]` | Aspect ratio shift |
| `borderRadius` | `16` | `9999` | `[0.4, 0, 0.2, 1]` | Rectangle → circle |

**Why**: Independent easings create organic movement. A single easing for all properties makes the animation feel robotic. The rotation specifically needs to accelerate mid-flight and decelerate for landing — like a real coin toss. The Y-axis arc (going slightly up before coming down) adds the "tossed in the air" feel.

**The arc path**: Instead of a straight diagonal from center to navbar, the card arcs upward slightly (by ~80-120px above the straight line) before gravity pulls it to the navbar position. This is achieved with Y-axis keyframes: `[centerY, centerY - arcPeak, navbarY]` with appropriate timing offsets.

**5 rotations**: With a ~1.5s flight duration, 5 rotations = 3.33 rotations/second at peak. Fast enough to feel dramatic, slow enough that the profile face flashes are perceivable. The deceleration at the end means the last rotation is slow and deliberate, making the profile reveal on landing feel intentional.

### 4. Landing sequence: profile hold then final flip

**Decision**: The flight animation ends with the card showing the profile photo (landing at `rotateX(1800)` ≡ `0` but we overshoot to `rotateX(1980)` ≡ `180deg` = back face showing). The card holds on the profile for ~400ms, then performs one final deliberate flip (`rotateX: 1980 → 2160` ≡ back to `0` = logo side) over ~500ms with a smooth ease-in-out.

**Why**: The hold-on-profile creates a "moment of recognition" — the user sees Amitay's face. The final deliberate flip back to the logo is the punctuation mark: "Here's who I am → Here's my mark." Two distinct beats, not a continuous blur.

**Math**: `1980 mod 360 = 180` (back face), `2160 mod 360 = 0` (front face). By accumulating rather than resetting, we avoid any visual discontinuity.

### 5. CSS 3D setup: perspective on a parent, preserve-3d on the card

**Decision**: The FlipCard's fixed-position wrapper gets `perspective: 1200px`. The card inner container gets `transform-style: preserve-3d`. Each face gets `backface-visibility: hidden`. The back face has `rotateX(180deg)` pre-applied.

```
<div style="position:fixed; perspective:1200px">  ← perspective container
  <motion.div style="transform-style:preserve-3d"> ← card inner (animated)
    <div style="backface-visibility:hidden">        ← front face (logo)
      <AnimatedLogo />
    </div>
    <div style="backface-visibility:hidden; transform:rotateX(180deg)"> ← back face (photo)
      <img src={profileUrl} />
    </div>
  </motion.div>
</div>
```

**Why**: `perspective` on the parent (not the animated element) keeps the vanishing point stable as the card moves. `preserve-3d` on the animated inner lets both faces participate in the 3D space. This is the standard CSS 3D card flip pattern.

**Perspective value**: `1200px` gives moderate depth — the rotation is visible and dramatic but not fish-eye distorted. Too low (e.g., 400px) makes the card warp excessively; too high (e.g., 3000px) flattens the 3D effect.

### 6. Overlay shader: MeshGradient with near-black colors

**Decision**: Add a new variant `"intro"` to `ShaderBackground` (or use `MeshGradient` directly in the overlay) with colors like `["#000000", "#050a14", "#0a0812", "#060610", "#000000"]` and very low speed (`0.04`), low distortion (`0.15`), low swirl (`0.2`).

**Why**: The background should feel like looking at a dark ocean at night — barely perceptible color movement. It provides visual texture without competing with the card animation. The colors are near-black with very subtle hints of deep blue/purple, consistent with the site's cool-dark palette.

### 7. Profile image: preloaded before card back is first visible

**Decision**: The profile image URL is fetched via `useSiteImage("profile")` immediately on app mount. An `<img>` element with `loading="eager"` is rendered hidden (or in the back face with `opacity: 0`) so the browser downloads it during the logo assembly phase. By the time the card starts flipping (~2.4s after mount), the image is loaded.

**Why**: If the image isn't preloaded, the first time the back face shows during the flip, it would flash empty and then pop in — destroying the cinematic feel. The logo assembly phase gives us ~2 seconds of "free" time to preload.

**Fallback**: If the image hasn't loaded by flight time, show a `liquid-glass` surface as the back face (glass card with no photo). The image swap-in is handled by a fade when the image `onLoad` fires.

### 8. Navbar placeholder and position tracking

**Decision**: The Navbar renders an invisible placeholder `<div>` with the same dimensions and position as the current logo button (`w-12 h-12 rounded-full`). A `ref` on this placeholder is passed up via `IntroContext`. The FlipCard component uses `getBoundingClientRect()` on this ref to compute its target position.

Position is recalculated:
- Once when the flight animation starts (to compute the target)
- On window resize (in case the viewport changes after intro settles)
- NOT during the flight itself (to avoid jitter)

**Why**: The navbar is flexbox-positioned, so the icon's absolute pixel position depends on viewport width, language direction, and nav item count. We can't hardcode it. Measuring at flight-start and on resize covers all cases.

### 9. Hero animation gating via `delay` prop enhancement

**Decision**: Rather than adding conditional rendering or extra state to Hero, we set the `delay` prop on `BlurText` and the `transition.delay` on the Hero's `motion.p` to be relative to the intro completion time. The IntroContext provides `introDelay` — a number (in seconds) that represents how long after mount the intro completes. Hero adds this to its existing delays.

**Why**: This is minimally invasive. BlurText already accepts a `delay` prop. The Hero's motion.p already has a `transition.delay`. We just offset them. No structural changes to Hero.

**Concern**: BlurText uses `IntersectionObserver` to trigger — since the Hero is above the fold and the overlay is transparent to the DOM (it's `position: fixed`, not blocking layout), the observer will fire immediately. But the animation won't visually start until the delay passes. This means the animation is "primed" but waiting. Acceptable — the user won't see it behind the overlay.

### 10. Click-to-expand: reverse FLIP with backdrop

**Decision**: When the user clicks the navbar icon (in `done` state), the FlipCard animates from navbar position back to screen center using the same motion properties (but reversed). A semi-transparent backdrop (`bg-black/60`) fades in behind it. The card:
- Expands from 48×48 to a large square (~min(80vw, 400px)`)
- Spins X-axis 4-6 rotations (matching the intro drama)
- Morphs from circle to rounded square (`borderRadius: 9999 → 24`)
- Lands showing the profile photo (back face)
- The photo is now 1:1 (no crop, `object-fit: contain`)

Dismissing (click card again or click backdrop) reverses back to navbar.

**Why**: Reusing the coin-flip motion creates a visual callback to the intro. The user subconsciously recognizes the movement. The larger card at 1:1 shows the full uncropped profile — the "zoom out" from the cropped card to the full photo is satisfying.

### 11. Scroll lock during intro

**Decision**: When `introPhase !== "done"`, set `document.body.style.overflow = "hidden"`. Reset on completion.

**Why**: Prevents the user from scrolling the page behind the overlay, which could desync the navbar position measurement and cause the flight animation to target the wrong coordinates.

### 12. Reduced motion: skip everything

**Decision**: When `prefers-reduced-motion: reduce` is active (detected via `useReducedMotion()` from motion/react), the entire intro is skipped. The FlipCard renders directly at the navbar position showing the logo (no animation). Hover still flips (but uses `transition: none` or instant swap). Click-to-expand shows the profile without animation.

**Why**: The entire intro is motion-intensive. There's no way to meaningfully reduce it — it IS motion. Better to skip entirely and go straight to the functional state.

## Risks / Trade-offs

**[Risk] 3D transforms and liquid-glass `::before` pseudo-elements may conflict**
The `liquid-glass-strong` class uses `::before` with `mask-composite` for the animated border. When combined with `transform-style: preserve-3d` and `backface-visibility: hidden`, some browsers may clip or hide the pseudo-element. → **Mitigation**: Test early. If there's a conflict, apply the liquid-glass effect to the face elements rather than the card container, or recreate the border effect with a dedicated inner element instead of `::before`.

**[Risk] `getBoundingClientRect()` measurement during flight gives stale values**
If the page layout shifts during the ~5s intro (e.g., fonts loading, images causing reflow), the navbar placeholder position may change after we measured it. → **Mitigation**: Measure at the START of the flight phase (not at mount), which is ~2.4s in — fonts should be loaded by then. Also, `position: fixed` on the navbar means its position is viewport-relative and immune to content reflow.

**[Risk] Profile image not loaded by flight time**
On slow connections, the Supabase signed URL fetch + image download may take >2.4s. → **Mitigation**: Start fetching immediately on mount. Use the liquid-glass fallback for the back face. Fade the image in when it loads. The fast tumble during flight means even a brief absence of the image won't be jarring — the back face flashes by in ~100ms per rotation.

**[Risk] Mobile performance with shader background + 3D transforms + AnimatedLogo SVG animation**
Running a `MeshGradient` shader on the overlay + the logo's `MeshGradient` shader + CSS 3D transforms simultaneously may drop frames on lower-end mobile devices. → **Mitigation**: The overlay shader is very subtle (low speed, low distortion) — minimal GPU load. The logo shader is tiny (16×32px during navbar state, ~240×360px during intro). Monitor FPS during development; if needed, disable the overlay shader on mobile or use a static gradient fallback.

**[Risk] Aspect ratio morph (2:3 → 1:1) during fast spin may look odd**
At 5 rotations per ~1.5s, the card shape changes quickly. The 2:3 → 1:1 shift might look like a glitch rather than a smooth morph. → **Mitigation**: The spin is fast enough that the shape change happens subliminally. The human eye tracks rotation, not aspect ratio during fast motion. If it does look off, we can ease the aspect ratio shift to happen mostly in the first 30% of the flight (while the card is still large enough to notice the shape).

**[Trade-off] ~5 seconds before page is interactive**
The intro delays content visibility. Users who return frequently may find this tedious. → **Accepted**: Per requirements, the intro plays every time. This is a portfolio site, not a productivity app — first impressions matter more than time-to-interactive. The intro IS the content.

**[Trade-off] FlipCard in fixed layer means it doesn't participate in navbar flex layout**
The navbar placeholder takes up space but the visible card is in a separate stacking context. If other navbar elements interact with the icon (e.g., focus ring, keyboard nav), the visual and DOM elements are in different places. → **Mitigation**: Keyboard focus is directed to the placeholder via `tabIndex`. The FlipCard layer has `pointer-events: none` on its wrapper, `pointer-events: auto` on the card itself. Click/hover events go to the FlipCard; keyboard focus goes to the placeholder which triggers FlipCard state changes via context.

## Open Questions

- **Exact profile image key in Supabase**: Need to confirm the file name in the `site-image` bucket (e.g., `"profile"`, `"profile.jpg"`, `"amitay-profile"`).
- **Card dimensions**: The 2:3 ratio at what pixel width? `240×360` feels right for desktop but should we scale down on mobile (e.g., `180×270`)?
- **Flight arc height**: How much does the Y-axis arc peak above the straight line? `80px`? `120px`? Needs visual tuning.
- **Rotation count**: 4, 5, or 6? The exact number affects perceived speed. Needs visual tuning during implementation.
- **Backdrop on click-expand**: Solid `bg-black/60` or blurred (`backdrop-blur-sm`)? Either fits the liquid-glass aesthetic.
