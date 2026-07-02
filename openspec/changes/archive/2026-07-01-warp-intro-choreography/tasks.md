## 1. Verify code matches the captured specs

- [x] 1.1 `IntroOverlay.tsx` fades the overlay at `flight` (reveals the warp), keyed via `isRevealed`; unmount/advance stays at `overlay-fadeout`.
- [x] 1.2 `HomePage.tsx` mounts the shader from `breath`.
- [x] 1.3 `WarpStarfield.tsx` seeds `START_WARP` (gentle), holds it at `breath`, eases to `MAX_WARP` over `RAMP_MS` (easeInOutCubic) at `flight`, holds, then runs the existing slowdown; re-entry (`done`) seeds `MAX_WARP`.
- [x] 1.4 `IntroContext.tsx` phase order has no `final-flip`.
- [x] 1.5 `FlipCard.tsx` flight rotates `rotateY 0 → 720°` (two flips, `INTRO_FLIGHT_TURNS`), lands logo-forward; `rotationBase` syncs to `720°`; hover flip preserved.
- [x] 1.6 `FlipCard.tsx` intro flight uses `INTRO_FLIGHT_DURATION` (~1.1s), `breath` ~250ms, `LANDING_HOLD_MS` ~200ms; `IntroOverlay` tail `OVERLAY_FADE_MS + 600`.
- [x] 1.7 `FlipCard.tsx` logo is a `calc(100%/3)` + `aspect-ratio:1/2` wrapper with `AnimatedLogo fill` (continuous 1/3 scaling, no snap); `AnimatedLogo.tsx` has the `fill` prop.
- [x] 1.8 `WarpIn.tsx` exists; `Hero.tsx` wraps heading/subtext/buttons (staggered); `Navbar.tsx` wraps pill + controls; reduced-motion renders plainly.

## 2. Validate

- [x] 2.1 `npm run build` passes (tsc + vite) clean.
- [x] 2.2 `openspec validate warp-intro-choreography` passes.
- [ ] 2.3 Visual pass in the browser: warp reveals at flight, eases in → full → slows; two flips land on the logo with the logo scaling smoothly; header + navbar warp in together.

## 3. Cleanup (optional)

- [ ] 3.1 Delete the now-unused `src/components/BlurText.tsx` (no remaining importers).
