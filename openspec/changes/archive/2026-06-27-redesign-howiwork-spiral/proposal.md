## Why

The "How I Work" timeline (`HowIWork.tsx`) is a horizontal zigzag (boustrophedon): straight rows joined by tight 180° arcs. As the scroll-driven line draws, it runs straight then whips around hard corners — the motion reads as jerky rather than fluid. It also packs 13 granular steps, which is more detail than a prospective client needs to grasp the process at a glance.

## What Changes

- **BREAKING** Replace the horizontal zigzag path with a single continuous **vertical sine serpentine** (flows top→bottom, swaying left/right). A sine has no corners, so the drawing line glides smoothly — this is the core fix for "smoother."
- Reduce the journey from **13 steps to 5**: First Contact → Scope & Proposal → Build → Iterate → Your Product, Live.
- Reorient the layout from wide (`viewBox 1000×780`) to **tall and narrow** (~`600×1560`).
- Move step labels from "below the line" to **alternating sides** (label sits in the open space outside each left/right bump).
- Derive node positions from the sine function itself (always exactly on-curve) instead of hand-placed coordinates.
- Tune the wave to a **gentle, wide** amplitude/wavelength (calm, lazy S-curves).
- Keep the scroll-draw engine (`stroke-dashoffset` + `getPointAtLength` node sampling), the three node states, the final golden-bulb treatment, the cool→warm gradient, and full i18n — all unchanged in mechanism.
- Update Supabase `site_content` journey keys: repurpose `journey.node1`–`node5` for the new labels (EN + HE); the old `journey.node6`–`node13` keys become orphaned.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `slalom-timeline`: Path shape changes from horizontal zigzag to vertical sine serpentine; step count drops from ~13 to 5; label placement changes from above/below-row to alternating sides; layout reorients from wide to tall. Scroll-draw, node glow states, final-node treatment, gradient, and translatability are unchanged.

## Impact

- **Code**: `src/sections/HowIWork.tsx` (path generation, `NODES` array, label positioning, viewBox). Animation/state logic reused as-is.
- **Spec**: `openspec/specs/slalom-timeline/spec.md`.
- **Data**: Supabase `site_content` — `journey.node1`–`node5` values (EN/HE) updated; `journey.node6`–`node13` orphaned (safe to prune).
- **No** API, dependency, or routing changes.
