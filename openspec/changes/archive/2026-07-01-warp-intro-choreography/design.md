## Context

These intro refinements were implemented directly (in several quick iterations) after `fast-intro-load` was archived, so the code is already live and this change is retroactive spec capture. It re-modifies `intro-overlay`, `hero-warp-starfield`, and `flip-card` (superseding `fast-intro-load`'s now-stale flight/landing/timeline requirements) and adds the `warp-in-entrance` capability. The goal is only to make the main specs match reality.

## Goals / Non-Goals

**Goals:**
- Main specs accurately describe the current intro (warp reveal at flight, ease-in ramp, two-flip logo-forward landing, no final flip, shortened timings, continuous logo scaling, warp-in text entrance).

**Non-Goals:**
- No new behavior. No further tuning (spin speed, ramp duration, timings are already set and merely captured).
- Not fixing unrelated pre-existing spec drift (e.g. `intro-overlay`/`flip-card` still describe a `MeshGradient` shader and `rotateX` flip in requirements this change doesn't touch).

## Decisions

### D1 — Reveal the warp at `flight`, not `overlay-fadeout`
The overlay fades the moment the card starts moving, exposing the ~1.9s of already-existing max-warp travel across flight + landing. The warp's per-phase deceleration targets are unchanged — only visibility moved earlier. Chosen so the shader motion is coherent with the card's flight rather than appearing only after it lands.

### D2 — Ease the warp in, held gentle during `breath`
The field seeds a gentle drift and, at `flight`, eases up to full warp over an easeInOutCubic ramp (~700ms), holds, then runs the existing slowdown. The gentle speed is held during the hidden `breath` warm-up so the ease-in is fully *visible* from the reveal. Re-entry keeps the original seed-at-max behavior (guarded on `phase === "done"`).

### D3 — Two flips, land logo-forward, no final flip
With the profile image removed from the intro, the flip-to-photo + flip-back are pointless. The flight does two full Y-axis turns (720° ≡ front face) and lands on the logo; the `final-flip` phase is deleted and `rotationBase` syncs to 720° so the post-intro hover flip still starts from the logo with no jump.
- *Alternative — no flip (rotateY 0):* considered and briefly implemented; the user preferred keeping two flips.

### D4 — Logo sized as a constant 1/3 of the card width
The logo is a CSS fraction (`calc(100%/3)` + `aspect-ratio: 1/2`, `AnimatedLogo fill`) instead of a discrete `size` prop that snapped from ~80px to 16px at landing. 1/3 is exact at both ends (80/240, 16/48), so it scales continuously with the animated card.

### D5 — `WarpIn` "toward you" entrance
Header and navbar emerge small + tilted (perspective + rotateX) from the vanishing point and fly forward, un-tilting to flat/readable — matching the stars streaming outward. One reusable component, gated on the existing `canAnimate` / `showNavContent` signals, suppressed under reduced motion.

## Risks / Trade-offs

- **Two flips in ~1.1s is a fast spin (~650°/s)** → tunable via `INTRO_FLIGHT_DURATION` / `INTRO_FLIGHT_TURNS`; accepted as-is.
- **Removing `final-flip` drops the warp's `MID/2` step** → the warp now eases `MAX → MID → cruise`; still smooth, one fewer notch.
- **`BlurText` is now unused** → orphan file; safe to delete in a cleanup.
