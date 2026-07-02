## Why

On a fresh or cache-cleared visit the intro feels slow: the card rectangle does not appear until a single 1.38 MB / 425 KB-gzip JS bundle has downloaded **and** parsed (≈0.7 s on fast desktop, ≈2.5–3 s on median 4G, ≈5 s on a slow/cold connection), and on top of that the back-of-card profile photo (`profile-image-banner-3.jpg`, **437.8 KB** — as heavy as the whole JS bundle) is fetched on mount, competing for bandwidth and main-thread time during the logo assembly. The logo-assembly animation itself is the desired experience and stays on every load; the problem is purely how long the first visitor waits before anything appears and how smoothly the assembly runs.

## What Changes

- **Remove the profile image from the first-load / intro critical path.** The 437.8 KB JPEG is no longer fetched on mount and is not shown during the intro. The card's back face is the plain liquid-glass surface throughout the intro. The photo is fetched lazily only **after** the intro completes (`introPhase === "done"`), preserving the navbar hover/expand "see the face" interaction at zero first-load cost.
- **Paint the card rectangle at first paint, before the JS bundle.** A static, CSS-only intro card (centered glass rectangle with the rotating border) is inlined directly into `index.html`, so it appears as soon as the ~2 KB HTML arrives — independent of the 1.38 MB bundle and on every connection. React removes it and takes over seamlessly with no flash.
- **Start the logo assembly the instant React is ready — no empty-card beat.** Today `AnimatedLogo` is withheld until after a 0.45 s empty `card-fadein`; instead the logo mounts immediately and assembly begins as the (already-visible) card hands off, eliminating the dead gap between "card border shows" and "logo assembles."
- **Warm the Supabase connection early** with a `preconnect` resource hint so the post-intro photo and auth calls start faster.
- The assembly choreography, its timing, and "plays on every load" behavior are **unchanged** (`intro-timing-gate` is not modified).

## Capabilities

### New Capabilities
- `instant-intro-skeleton`: A static, CSS-only intro card painted directly in `index.html` before the JS bundle loads, making the card rectangle visible at first paint on any connection, plus a seamless hand-off to the React `FlipCard` (no flash, no re-fade) and `preconnect` resource hints. Reduced-motion visitors do not see the centered skeleton.

### Modified Capabilities
- `flip-card`: The back face no longer loads or shows the profile photo during the intro; eager on-mount preloading is removed. The photo is fetched lazily only after the intro completes, for the navbar interactions.
- `intro-overlay`: The centered card no longer fades in empty for 0.45 s — the `AnimatedLogo` mounts immediately and the assembly begins as the card appears; when handed off from the inline skeleton the card does not re-fade. The flight reveals the glass back face (no photo) during the intro.

## Impact

- **Code**: `index.html` (inline skeleton markup + `<style>` + `preconnect`); `src/components/FlipCard.tsx` (drop eager image preload, defer photo to post-`done`, glass back during intro, skeleton hand-off, mount logo immediately); `src/contexts/IntroContext.tsx` and/or `src/components/IntroOverlay.tsx` (skip the empty `card-fadein` hold on hand-off).
- **Assets / network**: removes 437.8 KB JPEG + one Supabase signed-URL round-trip from first load; adds a `preconnect`.
- **Dependencies**: none added or removed.
- **Out of scope (possible follow-ups)**: route + heavy-lib code-splitting (`hls.js`, paper-design shaders, `marked`, admin/onboard routes) to shrink the 1.38 MB bundle; deferring `AuthProvider.getSession()`/react-query persist-restore off the intro; re-exporting the profile photo at a card-appropriate size/format.
