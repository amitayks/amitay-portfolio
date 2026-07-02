## Context

The intro is a hard, full-screen gate on a black background. On a fresh/uncached load nothing visible happens until the single 1.38 MB / 425 KB-gzip JS bundle has downloaded **and** parsed, after which React mounts and `FlipCard` fades a centered glass card in over ~0.45s, then the `AnimatedLogo` (pure inline SVG) assembles. Two costs stack on first load:

1. **Time to the card rectangle** is gated entirely by the JS pipeline (≈0.7s fast desktop → ≈5s slow/cold). The card itself is pure CSS and needs no JS to be drawn.
2. **The card's back face fetches `profile-image-banner-3.jpg` (437.8 KB) on mount** via a Supabase signed-URL round-trip, competing with the bundle for bandwidth and the assembly for main-thread time. The photo is only meaningfully used by the post-intro navbar hover/expand interaction.

Additionally, `AnimatedLogo` is deliberately withheld until after a 0.45s empty `card-fadein` (`FlipCard.tsx:403`), creating a dead beat between "card border shows" and "logo assembles."

The logo-assembly choreography and its "plays on every load" behavior (`intro-timing-gate`) are intentional and stay exactly as-is. This change only attacks first-paint latency and main-thread/bandwidth contention.

## Goals / Non-Goals

**Goals:**
- Make the centered card rectangle visible at first paint (~TTFB), independent of the JS bundle, on every connection.
- Remove the 437.8 KB profile JPEG and its Supabase round-trip from the first-load critical path.
- Start the logo assembly the instant React is ready — eliminate the empty-card beat.
- Keep the assembly + flight choreography and "every load" behavior unchanged.
- Preserve the navbar hover/expand "see the face" interaction (photo loaded lazily after the intro).

**Non-Goals:**
- Code-splitting the 1.38 MB bundle (route `React.lazy`, dynamic-importing `hls.js`/paper-design shaders/`marked`). High-value but a larger, separate change.
- Deferring `AuthProvider.getSession()` / react-query persist-restore. The auth flow has delicate ordering (documented deadlock constraints); left untouched here.
- Skipping or shortening the intro on repeat visits (explicitly rejected — assembly stays on every load).
- Re-exporting the profile photo at a smaller size/format (worthwhile follow-up; not required for the first-load win).

## Decisions

### D1 — Defer the profile image, do not delete it
The photo is **not fetched during the intro** and is loaded lazily once `introPhase === "done"`, then used by the navbar hover/expand flip. This fully satisfies "no heavy image on load / nothing behind the logo" while keeping the existing navbar feature.
- *Alternative — full removal:* drop the photo everywhere, back face becomes permanent glass. Lighter, but silently kills the navbar "see the face" interaction. Chosen against by default; trivial to switch to if desired (see Open Questions).

### D2 — Inline, self-contained skeleton in `index.html`
The skeleton is hand-written markup plus an inline `<style>` in `index.html`, **not** a reference to the app's `.liquid-glass-strong` class (which lives in the render-blocking external CSS bundle). Self-contained inline CSS lets the card paint the moment the ~2 KB HTML arrives, independent of both the JS and CSS bundles.
- The skeleton reproduces the resting front face only: centered fixed position (`position: fixed; inset: 0; display: grid; place-items: center`), fixed dimensions matching `CARD_WIDTH_DESKTOP/MOBILE` (240×360 / 180×270) via a `@media (max-width: 639px)` query mirroring the JS `isMobile` breakpoint, `border-radius: 16px`, the glass fill, and the gradient border.
- The rotating border (`--border-angle` conic-gradient) requires an `@property --border-angle` registration to animate; if that is awkward to inline, the skeleton MAY use a **static** border (rotation is a nicety, not required for first paint). The React card resumes the animated border on hand-off.

### D3 — Hand-off: remove skeleton before React's first paint, no re-fade
On mount React removes `#intro-skeleton` (e.g. `document.getElementById("intro-skeleton")?.remove()` in a `useLayoutEffect`, before paint), and `FlipCard`'s initial state is `opacity: 1` (not 0) when a skeleton hand-off occurred — so the card does not re-materialize. At the resting front face (rotateY 0) the skeleton and React card are pixel-identical, so the swap is invisible.
- *Alternative — crossfade:* fade skeleton out while React card fades in. Rejected: risks a double-card or empty frame.
- A small signal (e.g. a global flag set by the inline script, or simply "skeleton node existed at mount") tells `IntroContext`/`FlipCard` to skip the fade.

### D4 — Mount `AnimatedLogo` immediately
Remove the `introPhase !== "card-fadein"` gate so the logo is present from the first intro frame and assembly starts as the card appears. With D3 the card is already on screen, so assembly can begin essentially at React-ready. The empty 0.45s `card-fadein` hold collapses to nothing (or near-nothing).

### D5 — Keep the flight; glass back face during the intro
The coin-flip flight (the "spin" the user values) is unchanged. Because the photo is deferred, the back face revealed mid-flight and at landing is the glass surface instead of the photo. The final flip to the logo is mechanically unchanged.
- *Alternative — drop the flip-to-back during the flight* so the logo stays face-up and lands on the logo (no glass-back reveal, no final flip). Cleaner "logo-only" narrative but a larger choreography change. Deferred (see Open Questions).

### D6 — `preconnect` to Supabase
Add `<link rel="preconnect" crossorigin href="https://<project>.supabase.co">` so the first Supabase request (auth `getSession`, then the deferred photo) reuses a warm TLS connection.

## Risks / Trade-offs

- **Skeleton ↔ React card geometry mismatch → visible jump on hand-off** → Derive the skeleton's dimensions/radius from the same constants the component uses (240×360 / 180×270, radius 16) and mirror the 640px mobile breakpoint exactly. Verify on desktop + mobile widths.
- **Hand-off flash (double-card or empty frame)** → Remove the skeleton synchronously in `useLayoutEffect` (pre-paint) and start the React card at `opacity: 1`; never crossfade.
- **`backdrop-filter: blur()` over a black background may render as essentially black** → Acceptable; the card reads via its border + inset highlight (same as today, where the card sits over the black overlay anyway).
- **Reduced-motion visitors must not see a centered skeleton** → Wrap the skeleton in `@media (prefers-reduced-motion: no-preference)`; their path already parks the card in the navbar.
- **Navbar hover immediately after `done` before the lazy photo finishes** → Back face shows the glass fallback, then the photo fades in (~300ms) — same graceful fallback the spec already allows.
- **Rotating border won't animate without `@property --border-angle`** → Inline the registration, or accept a static border in the skeleton only (cosmetic; React takes over the animation on hand-off).

## Migration Plan

Pure client-side; no data or API migration.
1. Add the inline skeleton markup + `<style>` + Supabase `preconnect` to `index.html`.
2. Update `FlipCard` (and `IntroContext`/`IntroOverlay` as needed): remove the skeleton on mount, start at `opacity: 1` on hand-off, mount `AnimatedLogo` immediately, drop the eager image preload, defer the photo to `introPhase === "done"`, render glass on the back during the intro.
3. Verify hand-off on desktop + mobile, reduced-motion, and that the navbar photo still appears post-intro.

**Rollback:** revert the `index.html` and component edits — no persistent state involved.

## Open Questions

- **D1 confirmation:** defer the photo (keep the navbar "see the face" flip) vs. fully remove it? Default = defer.
- **D5:** keep the flight's flip-to-glass-back, or drop the flip-to-back entirely for a logo-only intro? Default = keep the flight as-is.
- Exact Supabase origin to hard-code in the `preconnect` (from the project's env / Supabase URL).
