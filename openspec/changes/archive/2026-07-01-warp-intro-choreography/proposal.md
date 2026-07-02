## Why

After `fast-intro-load` shipped, the intro choreography was refined over several direct iterations that were not captured in specs. The main specs (`intro-overlay`, `hero-warp-starfield`, `flip-card`) now describe behavior that no longer matches the code, and the new "warp in" text entrance for the hero header and navbar isn't specified at all. This change retroactively re-specs the current intro so the main specs are accurate. **The code is already implemented; this change is primarily spec capture plus verification.**

## What Changes

- **Warp reveal is synced to the flight.** The black overlay now fades at the start of the `flight` phase (not at `overlay-fadeout`), exposing the warp starfield the moment the card starts moving. The warp already runs at full speed behind the overlay, so this just surfaces the extra max-warp travel across flight + landing without moving the deceleration timeline.
- **Warp "engages" with an ease-in.** The starfield seeds at a gentle drift and eases up to full warp over a launch ramp (easeInOutCubic) once revealed, holds full speed, then runs the existing slowdown. Scroll-back re-entry still seeds at max warp (unchanged).
- **The final flip is removed and the intro is shortened.** The `final-flip` phase is gone. The flight now performs **two full flips (720°) landing face-forward on the logo** (no flip to the removed photo face). Phase durations are trimmed (breath, flight, landing, overlay-fadeout tail), pulling the header text ~750ms earlier and the whole intro ~1.6s shorter.
- **The logo scales continuously during the flight.** The logo is sized as a constant 1/3 of the card width (via CSS, not a discrete prop), so it shrinks in lockstep with the card instead of staying large and snapping to size at landing.
- **NEW: "warp in" entrance for the header and navbar.** The hero heading/subtext/buttons and the navbar pill/controls now enter with a shared `WarpIn` effect — emerging tiny and tilted from the starfield's vanishing point, then flying forward, un-tilting, and settling flat and readable — matching the stars streaming toward the viewer. Reduced-motion renders them plainly.

## Capabilities

### New Capabilities
- `warp-in-entrance`: A reusable "warp in toward you" entrance (the `WarpIn` component) that emerges small + tilted from the starfield vanishing point and flies forward into a flat, readable resting state; applied to the hero header (staggered) and the navbar; suppressed under reduced motion.

### Modified Capabilities
- `intro-overlay`: Overlay reveals the warp at `flight`; the `final-flip` phase and the final flip-to-logo are removed; the flight does two full flips landing face-forward on the logo; phase durations are shortened; the landing hold no longer shows a back face. Supersedes the (now-stale) `fast-intro-load` deltas for the flight/landing/timeline requirements.
- `hero-warp-starfield`: Mounts at `breath` and is revealed at `flight`; speed eases in from a gentle drift up to full warp over a launch ramp, holds, then runs the existing slowdown; scroll-back re-entry still seeds at max warp.
- `flip-card`: The intro flight performs two full flips (720°) landing logo-forward; the front-face logo is sized as a constant 1/3 of the card width so it scales continuously with the card (no snap at landing).

## Impact

- **Code (already implemented)**: `src/components/IntroOverlay.tsx` (reveal at flight), `src/pages/HomePage.tsx` (mount shader at breath), `src/components/WarpStarfield.tsx` (ease-in ramp), `src/contexts/IntroContext.tsx` (drop `final-flip` from phase order), `src/components/FlipCard.tsx` (two flips, shortened durations, 1/3 logo scaling), `src/components/AnimatedLogo.tsx` (`fill` prop), `src/components/WarpIn.tsx` (new), `src/sections/Hero.tsx` + `src/components/Navbar.tsx` (WarpIn entrance).
- **Specs**: re-modifies `intro-overlay`, `hero-warp-starfield`, `flip-card`; adds `warp-in-entrance`. `BlurText` is now unused (candidate for removal).
- **Dependencies**: none added or removed.
