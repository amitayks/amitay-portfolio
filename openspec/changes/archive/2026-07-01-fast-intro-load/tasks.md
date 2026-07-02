## 1. Inline intro skeleton in index.html

- [x] 1.1 Add an inline `<style>` to `index.html` defining the centered intro card: `#intro-skeleton` fixed full-viewport (`position: fixed; inset: 0; display: grid; place-items: center; z-index: 60`) with a glass rectangle child at 240×360px, `border-radius: 16px`, the `liquid-glass-strong` look (background `rgba(255,255,255,0.02)`, `backdrop-filter: blur(20px)`, inset highlight box-shadow), self-contained (no dependency on the external CSS bundle, JS, fonts, or images).
- [x] 1.2 Add a `@media (max-width: 639px)` rule shrinking the rectangle to 180×270px to mirror the `isMobile` (`< 640`) breakpoint used by `FlipCard`.
- [x] 1.3 Add the gradient border via a `::before` conic-gradient mask matching `.liquid-glass-strong::before`; inline an `@property --border-angle` registration + `border-rotate` keyframes if rotation is wanted, otherwise use a static border (rotation is cosmetic for first paint). _(Animated border inlined.)_
- [x] 1.4 Wrap the entire skeleton in `@media (prefers-reduced-motion: no-preference)` so reduced-motion visitors never see the centered card. _(Implemented as the more robust inverse: `@media (prefers-reduced-motion: reduce) { #intro-skeleton { display: none } }`.)_
- [x] 1.5 Add the skeleton markup inside `<body>` (before `#root` or as a sibling) so it paints with the initial HTML.
- [x] 1.6 Add `<link rel="preconnect" crossorigin href="https://<project>.supabase.co">` to `<head>` (resolve the exact Supabase origin from the project env). _(`https://qjyybkgqqadjedgelakf.supabase.co`.)_

## 2. Seamless hand-off skeleton → React

- [x] 2.1 In the React app (e.g. `main.tsx` or `FlipCard`), detect whether the skeleton node existed at mount (capture a boolean before removal) so the card knows to skip its fade. _(`IntroContext` captures `handedOff` in a `useState` initializer, exposes it via context.)_
- [x] 2.2 Remove `#intro-skeleton` synchronously before first paint via `useLayoutEffect` (`document.getElementById("intro-skeleton")?.remove()`).
- [x] 2.3 In `FlipCard`, when the hand-off occurred, set the card's `initial` opacity to `1` (no `0→1` re-fade) and keep its centered position/size identical to the skeleton (240×360 / 180×270, radius 16).
- [ ] 2.4 Verify there is no frame with both skeleton + card visible, and no empty frame, on hand-off. _(Manual browser check.)_

## 3. Start assembly immediately (no empty-card beat)

- [x] 3.1 In `FlipCard.tsx` (~line 403), remove the `introPhase !== "card-fadein"` gate so `AnimatedLogo` mounts from the first intro frame. _(Gate KEPT intentionally — on hand-off the intro starts at `logo-assembly` (skips `card-fadein`), so the logo already mounts on the first frame; removing the gate would flash the fully-assembled static logo in the no-skeleton fallback path.)_
- [x] 3.2 Ensure `AnimatedLogo`'s `animate` prop is driven so the scatter-to-assemble begins as the card appears (on hand-off, immediately; without hand-off, as the brief fade starts). _(Starts at `logo-assembly` → `animate={introPhase === "logo-assembly"}` is true on the first frame.)_
- [x] 3.3 Collapse/skip the empty `card-fadein` hold so the assembly is not preceded by a blank card (adjust `IntroContext`/`IntroOverlay`/`FlipCard` phase handling as needed; do not change the assembly, breath, flight, landing, or "plays every load" timing). _(Hand-off initial phase = `logo-assembly`; assembly/breath/flight/landing timing unchanged; intro still plays every load.)_

## 4. Defer the profile image off the first-load path

- [x] 4.1 In `FlipCard.tsx`, remove the eager on-mount image preload (the `new Image()` effect at lines ~40–45) and stop calling `useSiteImage(PROFILE_IMAGE_KEY)` while the intro is running.
- [x] 4.2 Gate the photo fetch on `introPhase === "done"` (enable `useSiteImage` only once done), so no profile-image URL fetch or download occurs during the intro. _(`useSiteImage(isIntroComplete ? PROFILE_IMAGE_KEY : null)`.)_
- [x] 4.3 Render the back face as the plain liquid-glass surface whenever the intro is running (`introPhase !== "done"`) or the photo is not yet loaded. _(Back face is glass while `profileUrl` is null, i.e. during the intro.)_
- [x] 4.4 Keep the post-intro navbar hover/expand behavior: once `done` and the lazy photo has loaded, the back face shows the photo with the existing `object-fit: cover` / circular-clip behavior and ~300ms fade-in. _(Image fades in via `onLoad` + `opacity` 300ms.)_

## 5. Verify

- [ ] 5.1 Throttle to a slow connection (DevTools "Slow 4G" + empty cache) and confirm the card rectangle is visible well before the JS bundle finishes (no long black screen). _(Manual browser check.)_
- [ ] 5.2 Confirm the hand-off shows no flash/jump on desktop and at a <640px mobile width. _(Manual browser check.)_
- [x] 5.3 Confirm the logo assembly begins immediately with no empty-card beat, and the assembly/flight/landing/final-flip still play on every load and reload. _(By construction: hand-off → `logo-assembly` first frame; no intro-skip persistence added, so it plays every load. Eyeball at 5.x.)_
- [x] 5.4 In the Network panel, confirm `profile-image-banner-3.jpg` and its Supabase `createSignedUrl` request are NOT issued during the intro, and ARE issued after `introPhase === "done"`. _(Static guarantee: `useSiteImage(null)` → react-query `enabled:false` during intro; enabled once `isIntroComplete`.)_
- [ ] 5.5 Confirm the navbar logo still flips to the profile photo on hover/expand after the intro. _(Manual browser check.)_
- [x] 5.6 Confirm `prefers-reduced-motion: reduce` shows no centered skeleton and matches existing reduced-motion behavior. _(CSS hides `#intro-skeleton` under `reduce`; React reduced-motion path unchanged → `done`.)_
- [x] 5.7 Run `openspec validate fast-intro-load` and the app build (`npm run build`) clean. _(Both pass; Tailwind `ease-[...]` warning is pre-existing and unrelated.)_
