## Why

The site uses WebGL shaders (GodRays, NeuroNoise, Water) and CSS glass effects (`backdrop-filter: blur`) heavily across all sections. On desktop, the page becomes laggy after scrolling through multiple sections. On mobile, battery drains rapidly. The root causes: shaders render continuously even when off-screen, no pixel ratio capping, expensive `blur(50px)` on many elements, per-frame color animations with no throttle, and zero mobile/low-power adaptation. All visual elements must stay — optimizations target rendering efficiency only.

## What Changes

- Add visibility-based shader pause/resume — shaders stop rendering when scrolled out of viewport
- Add Page Visibility API integration — pause all animations and shaders when tab is hidden
- Cap pixel ratio per device tier (desktop: 2, mobile: 1.5, low-end: 1)
- Reduce `backdrop-filter` blur radius on `.liquid-glass-strong` from `blur(50px)` to `blur(20px)`
- Throttle the hero ray color animation from every frame (~60fps) to every 3-4 frames (~15-20fps)
- Add CSS `contain: strict` on glass containers to isolate compositing
- Add `will-change: transform` on shader canvas wrappers to hint GPU layer promotion
- Detect low-power / mobile devices and apply appropriate quality tiers

## Capabilities

### New Capabilities
- `shader-lifecycle`: Controls for pausing, resuming, and quality-tiering WebGL shader rendering based on viewport visibility, page visibility, and device capability
- `performance-adaptation`: Device detection and tiered quality settings for GPU-intensive effects (pixel ratio caps, animation throttling, blur reduction)

### Modified Capabilities
- `liquid-glass-design-system`: Blur radius reduction on `.liquid-glass-strong` from `blur(50px)` to `blur(20px)` and addition of `contain` property for compositing isolation

## Impact

- **Components**: `ShaderBackground.tsx` (shader lifecycle, pixel ratio, throttling), `index.css` (glass blur values, contain property)
- **New hooks/utilities**: `usePageVisibility`, `useDeviceTier`, updated `LazyShader` with pause/resume
- **Dependencies**: No new dependencies — all optimizations use native browser APIs
- **Visual**: Blur radius change is subtle (dark shader backgrounds make 20px vs 50px nearly indistinguishable). Pixel ratio cap invisible on organic shader effects. All UI elements, glass styling, and animations preserved.
- **Sections affected**: All sections with shader backgrounds (Hero, About, Stats, Contact) and all elements using liquid-glass classes
