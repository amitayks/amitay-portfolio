## 1. IntroContext & Provider

- [x] 1.1 Create `src/contexts/IntroContext.tsx` with the `IntroContext` and `IntroProvider` component. Define the phase type (`"card-fadein" | "logo-assembly" | "breath" | "flight" | "landing" | "final-flip" | "overlay-fadeout" | "done"`). Expose `introPhase`, `isIntroComplete`, and `navbarIconRef` via context. Implement the phase state machine with `useState` and transition functions that advance the phase. When `useReducedMotion()` is true, set `introPhase` to `"done"` immediately on mount. Create the `useIntro()` convenience hook.

- [x] 1.2 Wire `IntroProvider` into `src/App.tsx`. Wrap `AppContent` (and the future FlipCard/IntroOverlay siblings) inside `IntroProvider`, which itself is inside `LanguageProvider`. The component tree should be: `PersistQueryClientProvider > LanguageProvider > IntroProvider > [AppContent, FlipCard, IntroOverlay]`.

## 2. FlipCard Component

- [x] 2.1 Create `src/components/FlipCard.tsx` — the dual-face 3D card primitive. Structure: a fixed-position perspective container (`perspective: 1200px`) wrapping a `motion.div` inner card (`transform-style: preserve-3d`). Two child face divs, each with `backface-visibility: hidden`. The back face has `rotateX(180deg)` pre-applied. The component accepts a controlled `rotateX` value via Framer Motion's `animate` prop. Apply `liquid-glass-strong` styling to each face individually (to avoid conflicts with `preserve-3d`). Render `AnimatedLogo` on the front face and the profile `<img>` on the back face.

- [x] 2.2 Implement profile image preloading in FlipCard. Use `useSiteImage()` to fetch the profile image URL on mount. Render a hidden `<img>` or use `new Image()` to trigger browser download. Track load state (`loading | loaded | error`). On the back face: show a liquid-glass fallback surface while loading, fade in the image with ~300ms opacity transition once loaded.

- [x] 2.3 Implement card dimension/shape state management. The FlipCard needs to animate between two shape states: intro (2:3, ~240×360px desktop / ~180×270px mobile, border-radius 16px) and navbar (48×48px, border-radius 9999px). Use Framer Motion `animate` to transition width, height, and borderRadius. Detect mobile vs desktop via viewport width for intro card sizing.

- [x] 2.4 Implement FLIP position tracking. The FlipCard reads `navbarIconRef` from `IntroContext`. During intro phases (`card-fadein` through `breath`), position at viewport center. When `introPhase` is `"flight"`, measure `navbarIconRef.current.getBoundingClientRect()` and animate position from center to that rect. After intro (`"done"`), track the navbar placeholder position on `resize` events and update the card's fixed position immediately (no animation).

## 3. IntroOverlay Component

- [x] 3.1 Create `src/components/IntroOverlay.tsx` — the full-screen fixed overlay. Renders at `position: fixed; inset: 0; z-index: 60` (above navbar z-50). Contains a `MeshGradient` shader background with near-black colors (`["#000000", "#050a14", "#0a0812", "#060610", "#000000"]`, speed ~0.04, distortion ~0.15, swirl ~0.2). Reads `introPhase` from `IntroContext`. Conditionally renders: visible when `introPhase !== "done"`, fades out during `"overlay-fadeout"` phase (opacity 1→0 over ~400ms). Unmounts from DOM after fade completes.

- [x] 3.2 Implement scroll lock in IntroOverlay. When the overlay is mounted, set `document.body.style.overflow = "hidden"`. On unmount (after fade-out completes and overlay is removed from DOM), restore `document.body.style.overflow` to its original value. Use a `useEffect` cleanup for this.

## 4. Intro Animation Orchestration

- [x] 4.1 Implement the card fade-in phase. When `introPhase === "card-fadein"`, the FlipCard at viewport center animates from `opacity: 0, scale: 0.95` to `opacity: 1, scale: 1` over ~400–500ms. On animation complete, call the IntroContext's phase transition to advance to `"logo-assembly"`.

- [x] 4.2 Implement the logo assembly phase. When `introPhase === "logo-assembly"`, the AnimatedLogo inside the FlipCard's front face begins its scatter-to-assemble animation. The AnimatedLogo's `animate` prop is set to `true`. A timer (matching the AnimatedLogo's total duration: ~1700ms) fires and advances the phase to `"breath"`.

- [x] 4.3 Implement the breath pause phase. When `introPhase === "breath"`, the card holds still at center for ~300ms. After the pause, advance to `"flight"`.

- [x] 4.4 Implement the coin-flip flight animation. When `introPhase === "flight"`, measure the navbar placeholder's `getBoundingClientRect()`. Animate the FlipCard from center to navbar position over ~1200–1800ms with:
  - **Position X**: from centerX to navbarX, easing `[0.4, 0, 0.2, 1]`
  - **Position Y**: keyframed arc — `[centerY, centerY - arcPeak, navbarY]` (arcPeak ~80–120px)
  - **rotateX**: from 0 to 1800deg (5 full rotations, ending at 180° ≡ back face), easing `[0.2, 0.8, 0.3, 1]` (fast middle, decelerate at end)
  - **Width**: from cardWidth to 48px
  - **Height**: from cardHeight to 48px
  - **borderRadius**: from 16px to 9999px
  On animation complete, advance to `"landing"`.

- [x] 4.5 Implement the landing hold phase. When `introPhase === "landing"`, the card is at navbar position showing the profile photo (back face). Hold for ~400ms. Advance to `"final-flip"`.

- [x] 4.6 Implement the final deliberate flip. When `introPhase === "final-flip"`, animate `rotateX` from 1800 to 1980 (or equivalent: one additional 180° rotation to return to front face). Duration ~500ms, ease-in-out. On complete, advance to `"overlay-fadeout"`.

- [x] 4.7 Implement the overlay fade-out and completion. When `introPhase === "overlay-fadeout"`, the IntroOverlay fades opacity to 0 over ~400ms. On fade complete, the overlay unmounts and `introPhase` advances to `"done"`. The FlipCard remains at navbar position showing the logo face.

## 5. Navbar Integration

- [x] 5.1 Modify `src/components/Navbar.tsx` — replace the logo `<button>` (lines 73–79) with an invisible placeholder `<div>`. The placeholder has the same dimensions (`w-12 h-12 rounded-full`) and occupies the same flex layout position. Attach the `navbarIconRef` from `IntroContext` to this placeholder. Remove the old `AnimatedLogo` import and usage from Navbar. Add `role="button"`, `aria-label="View profile photo"`, and `tabIndex={0}` to the placeholder for accessibility.

- [x] 5.2 Implement navbar content fade-in. The nav links pill and language toggle should be hidden (`opacity: 0`) during the intro. When `introPhase` transitions to `"overlay-fadeout"` or `"done"`, fade them in (opacity 0→1 over ~400ms). Use Framer Motion's `animate` or a CSS transition gated by `isIntroComplete` from context.

## 6. Navbar Card Interactions

- [x] 6.1 Implement hover-flip on desktop. When `isIntroComplete` is true and the user hovers over the FlipCard, animate `rotateX` from 0 to 180 degrees over ~600ms ease-in-out (reveals profile photo). On hover end, animate back to 0. Handle rapid hover/unhover by reversing from current angle (Framer Motion handles this naturally with `animate` prop changes). Disable hover behavior when `introPhase !== "done"`.

- [x] 6.2 Implement click-to-expand. When `isIntroComplete` is true and the user clicks the FlipCard, animate from navbar position/size to viewport center at ~`min(80vw, 400px)` square, with 4–6 X-axis rotations, border-radius 9999→24px. Land showing profile photo (back face). The expanded card shows the 1:1 photo at full aspect ratio (no crop). Fade in a `bg-black/60` backdrop behind the card. Track expanded state (`isExpanded`) in the FlipCard component.

- [x] 6.3 Implement dismiss (close expanded view). Click on card or backdrop triggers reverse animation: card shrinks from center back to navbar (48×48, circular), 4–6 X-axis rotations, lands on logo face. Backdrop fades out. Set `isExpanded` to false. Also handle Escape key to dismiss.

- [x] 6.4 Implement mobile touch handling. On touch devices (detect via media query or pointer type), skip hover behavior entirely. Tap triggers click-to-expand directly. Ensure touch events don't conflict with the navbar's scroll behavior.

## 7. Hero Animation Gating

- [x] 7.1 Modify `src/sections/Hero.tsx` to read `introPhase` from `IntroContext` via `useIntro()`. Calculate a delay offset: when intro is active, add the full intro duration (~5s) to the existing `BlurText` delay and `motion.p` transition delay. When reduced motion is active (intro skips), use original delays (no offset). The BlurText component already accepts a `delay` prop — pass the computed value. The `motion.p` already has `transition.delay: 0.8` — add the intro offset to it.

- [x] 7.2 Test the timing: verify that as the overlay fades out, the Hero text starts animating in, creating a seamless choreographed transition. Adjust the delay offset if the text appears too early (visible behind the overlay) or too late (gap after overlay disappears).

## 8. Reduced Motion & Edge Cases

- [ ] 8.1 Verify reduced motion path end-to-end. With `prefers-reduced-motion: reduce`: IntroProvider sets phase to `"done"` immediately, IntroOverlay never renders, FlipCard appears at navbar position with logo face, Hero uses default delays, Navbar is fully visible. Hover swaps faces instantly (no animation). Click shows profile instantly at center (no flight).

- [ ] 8.2 Test profile image failure gracefully. If `useSiteImage()` returns an error or the image fails to load, the back face shows the liquid-glass fallback permanently. Hover and click still work — they just show a glass surface instead of a photo. No error states or broken images visible to the user.

- [ ] 8.3 Verify no layout shift when navbar placeholder replaces logo button. The placeholder must occupy exactly the same space in the flex layout. Compare navbar layout before/after the change — nav links and language toggle positions must not shift by even 1px.

## 9. Visual Polish & Tuning

- [ ] 9.1 Tune flight arc height, rotation count, and easing curves visually. Adjust arcPeak (80–120px range), rotation count (4–6), and cubic-bezier values until the flight feels cinematic and smooth. The rotation should look like a real coin toss — fast in the middle, graceful deceleration at the end.

- [ ] 9.2 Tune intro card size for mobile. On viewports <640px, use smaller card (~180×270px). On viewports ≥640px, use ~240×360px. The card should feel proportionate to the viewport — large enough to be impressive, small enough to not feel cramped.

- [ ] 9.3 Tune the overlay shader colors and intensity. The background should be barely visible — near-black with hints of color movement. If it's too visible, it competes with the card. If it's invisible, the background feels dead. Find the sweet spot.

- [ ] 9.4 Verify 60fps performance on mobile. Test on a mid-range phone (or throttled Chrome DevTools). If the overlay shader + card 3D transforms + AnimatedLogo SVG animation cause frame drops, consider: disabling the overlay shader on mobile (use static dark gradient), reducing the AnimatedLogo's intro size, or simplifying the flight animation.
