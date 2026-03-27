## 1. Hooks and Utilities

- [x] 1.1 Create `usePageVisibility` hook in `src/hooks/usePageVisibility.ts` — returns boolean from Page Visibility API, listens to `visibilitychange` event
- [x] 1.2 Create `useDeviceTier` hook in `src/hooks/useDeviceTier.ts` — detects device tier (desktop/mobile/low-end) and returns `{ tier, maxPixelCount }` computed once on mount

## 2. Shader Lifecycle (ShaderBackground.tsx)

- [x] 2.1 Refactor `LazyShader` to expose `isVisible` state to children via render-prop or callback pattern
- [x] 2.2 Integrate `usePageVisibility` into `ShaderBackground` — combine with `isVisible` to determine effective `speed` for each shader (speed = 0 when off-screen OR tab hidden)
- [x] 2.3 Pass `speed={effectiveSpeed}` to each shader variant (GodRays hero, NeuroNoise about, GodRays stats, Water contact) instead of hardcoded speed values
- [x] 2.4 Pass `maxPixelCount` from `useDeviceTier` to each shader component
- [x] 2.5 Add `will-change: transform` to the shader canvas wrapper div (the `absolute inset-0` div that wraps `{children}` inside LazyShader)

## 3. Color Animation Throttling

- [x] 3.1 Add frame-skip counter to `useAnimatedRayColors` rAF loop — only call `setColors()` every 4th frame
- [x] 3.2 Integrate page visibility into `useAnimatedRayColors` — skip all updates when `document.hidden` is true

## 4. CSS Glass Optimization

- [x] 4.1 Change `.liquid-glass-strong` `backdrop-filter` from `blur(50px)` to `blur(20px)` in `src/index.css`
- [x] 4.2 Add `contain: content` to `.liquid-glass` class in `src/index.css`
- [x] 4.3 Add `contain: content` to `.liquid-glass-strong` class in `src/index.css`

## 5. Verification

- [x] 5.1 Test desktop: scroll through all sections, verify shaders pause/resume smoothly with no visible pop or flicker
- [x] 5.2 Test tab switching: switch away and back, confirm shaders pause and resume correctly
- [x] 5.3 Test mobile viewport: verify `maxPixelCount` is applied and shaders still look clean
- [x] 5.4 Verify glass elements auto-size correctly with `contain: content` (skills grid cards, stats section, navbar)
- [x] 5.5 Verify `prefers-reduced-motion` still works — intro skip, static borders, no blur animations
