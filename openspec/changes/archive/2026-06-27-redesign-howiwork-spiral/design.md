## Context

`src/sections/HowIWork.tsx` renders the "How I Work" timeline as a horizontal zigzag: hand-authored `M/L/Q` path (`SLALOM_PATH`), 13 hand-placed nodes (`NODES`), a scroll-driven `stroke-dashoffset` draw, and bulb nodes that transition `unlit → active → passed`. Node-to-path snapping is done by sampling `getPointAtLength` and picking the closest path point per node, so the activation logic is already **path-agnostic**.

The straight runs + tight `Q` arcs make the drawing line accelerate then whip around corners (jerky). The goal is a continuous **vertical sine serpentine** with **5** steps, drawn the same way but flowing smoothly because a sine has no corners.

## Goals / Non-Goals

**Goals:**
- One continuous, corner-free vertical sine path flowing top→bottom.
- Reduce 13 steps → 5, with node coordinates derived from the sine function (always on-curve).
- Alternating-side labels (outer side of each bump), gentle/wide wave feel.
- Reuse the existing draw + node-state + gradient + final-bulb machinery untouched.
- Preserve i18n via `useSiteText`.

**Non-Goals:**
- No change to the scroll-draw mechanism, node state machine, or bulb visuals.
- No new dependencies, routes, or APIs.
- Not rewriting the broader `site-sections` layout.
- Not deleting orphaned Supabase keys in this change (prune later).

## Decisions

### 1. Generated sine path instead of hand-authored commands
Add a helper `buildSinePath(cx, amplitude, wavelength, halfPeriods, y0, step)` that samples the curve and emits an SVG path string (a dense polyline, ~24+ points per half-period). The displayed line is visually smooth at that density, and because node positions snap via `getPointAtLength` on this same path, snapping stays exact.

- **Curve function:** `x(y) = cx − amplitude · cos(2π · (y − y0) / wavelength)`. The `−cos` phase puts node 1 exactly at the **left** extreme at `y = y0`, then extremes alternate right/left every half-period.
- **Alternative considered — cubic Béziers per half-period:** mathematically cleaner and a lighter DOM path, but more code and no visible benefit at this stroke width. Polyline wins on simplicity. (Can swap later without touching node logic.)

### 2. Concrete geometry (gentle & wide)
- `viewBox = "0 0 600 1520"`, `cx = 300`, `amplitude = 210` → x ∈ [90, 510].
- Half-period `H = 320` (wavelength `λ = 640`), `y0 = 120`, 5 nodes → 4 half-periods, last node at `y = 1400`, +120 bottom pad.
- Node positions (derived, exact):

  | # | label | x | y | extreme |
  |---|-------|---|---|---------|
  | 1 | First Contact | 90 | 120 | left |
  | 2 | Scope & Proposal | 510 | 440 | right |
  | 3 | Build | 90 | 760 | left |
  | 4 | Iterate | 510 | 1080 | right |
  | 5 | Your Product, Live | 90 | 1400 | left |

  In code these come from the same `buildNodes()` math, not literals, so amplitude/wavelength tuning moves them automatically.

### 3. Alternating-side labels
Label side is purely geometric: `node.x < cx` → label to the **left** of the bulb; else to the **right**. The bulb sits centered on the curve point; the label is offset horizontally into the open space (translate ±X, vertically centered). This replaces the current "bulb above / label below" block. Final node keeps `isFinal` (larger golden bulb).

### 4. Reused, untouched
`scrollYProgress`/`progress`, `dashOffset`, the `getPointAtLength` 500-sample node-fraction pass, `useMotionValueEvent` state updates, the cool→warm `linearGradient`, and the background track path. They operate on whatever `d` and `NODES` we feed them.

### 5. Step merge (13 → 5)
| New step | Absorbs |
|---|---|
| First Contact | First Contact |
| Scope & Proposal | Scoping Call, Proposal & Cost, Architecture Plan |
| Build | Kickoff, First Working Build |
| Iterate | Weekly Check-ins, Iterations |
| Your Product, Live | Final Review, Deployment, Handoff, Post-Launch, Live |

### 6. i18n / data
`journey.node1`–`node5` Supabase `site_content` values are updated (EN + HE) to the new labels; `journey.node6`–`node13` become orphaned (left in place). Component fallbacks updated to match. Hebrew strings are drafted but flagged for the user to wordsmith (customer-facing).

## Risks / Trade-offs

- **Polyline `getTotalLength` is an approximation** → use ≥24 samples per half-period; node snapping uses the same path, so it's self-consistent regardless.
- **Taller section increases page height** → acceptable for a dedicated section; gentle amplitude was the user's pick. `H` is a single tunable if it feels too long.
- **Side labels can clip on narrow mobile** → keep small responsive text (`text-[8px] md:text-xs`), constrain container width, and ensure the overlay has horizontal padding so left/right labels stay readable.
- **Orphaned `node6`–`node13` keys** → harmless dead data; pruning deferred.
- **RTL** → side-choice is geometric (outer side), independent of text direction; Hebrew still right-aligns within its label box. Serpentine is L-R symmetric, so no start-side bias.

## Migration Plan

1. Update `HowIWork.tsx`: add `buildSinePath`/`buildNodes`, swap `SLALOM_PATH` + `NODES`, change `viewBox`, replace label block with alternating-side logic.
2. Update Supabase `site_content` `journey.node1`–`node5` (EN + HE).
3. Verify scroll-draw + activation across desktop/mobile and EN/HE.
4. **Rollback:** revert the component and the 5 key values; old `node6`–`node13` keys are untouched, so revert is clean.
