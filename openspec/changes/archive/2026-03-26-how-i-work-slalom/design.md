## Context

The current `HowIWork.tsx` is a simple 3-card grid. We're replacing it with a scroll-animated SVG slalom timeline that visualizes the full client journey as a zigzag path with glowing nodes.

Existing tools: `motion/react` (framer-motion) with `useScroll`/`useTransform`, liquid-glass CSS classes, `useSiteText` for i18n. No new dependencies needed.

## Goals / Non-Goals

**Goals:**
- Visually striking scroll-driven timeline that feels handcrafted, not templated
- Smooth 60fps scroll animation for path drawing and node activation
- Same slalom layout on all screen sizes (responsive spacing, not different layouts)
- Full i18n support via existing Supabase text system

**Non-Goals:**
- No sticky section header
- No vertical-only mobile layout — same zigzag everywhere
- No interaction beyond scroll (no click, hover tooltips, etc.)
- No parallax or 3D effects

## Decisions

### 1. SVG path approach for the slalom line

Use a single `<svg>` element with one `<path>` that traces the entire slalom. The path is defined with:
- Horizontal `L` segments for the straight runs
- Quadratic bezier `Q` curves for the arcs connecting rows

The path is drawn via `stroke-dasharray` set to `pathLength` and `stroke-dashoffset` animated from `pathLength → 0` based on scroll progress.

**Why not CSS/div-based?** SVG path drawing is the only way to get a smooth, continuous line that reveals progressively. CSS borders can't animate partial visibility along a curved path.

### 2. Scroll tracking with framer-motion useScroll

```
const ref = useRef(null)
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ["start end", "end start"]
})
```

`scrollYProgress` (0→1) maps directly to `stroke-dashoffset` and node activation thresholds. Each node has a threshold (e.g., node 3 at 0.23) — when `scrollYProgress` crosses it, that node activates.

**Why framer-motion over IntersectionObserver?** IO gives binary in/out, we need continuous 0-1 progress for smooth path drawing. framer-motion's `useScroll` is already in the project.

### 3. Node positioning: absolute positioned divs overlaying the SVG

Nodes are NOT SVG circles — they're HTML `<div>` elements absolutely positioned over the SVG. This gives us:
- Full CSS styling (liquid-glass, box-shadow glow, blur)
- Easy text rendering (labels, descriptions)
- Standard responsive behavior

Each node's position is calculated from the SVG viewBox coordinates, scaled to the actual rendered size.

### 4. Slalom geometry

The SVG viewBox uses a fixed coordinate system (e.g., `0 0 1000 800`). The slalom is defined as:

- **4 rows**, each containing 3-4 nodes along a horizontal segment
- Row 1 (left→right): y=100, nodes at x≈150, 400, 650, 900
- Arc down to Row 2 (right→left): y=300, nodes at x≈850, 600, 350, 100
- Arc down to Row 3 (left→right): y=500, nodes at x≈150, 400, 650, 900
- Arc down to Row 4 (right→left): y=700, final node centered at x≈500

The arcs are 180° curves (quadratic bezier) connecting the end of one row to the start of the next. The viewBox scales responsively — the SVG stretches to fill width and the aspect ratio determines height.

### 5. Node states via scroll thresholds

Each node has a `threshold` value (0-1) based on its position along the total path length. The component maps `scrollYProgress` to determine each node's state:

- `scrollProgress < threshold - 0.02` → **upcoming** (dim, `opacity: 0.1`, no glow)
- `threshold - 0.02 <= scrollProgress < threshold + 0.02` → **active** (bright, glow pulse, scale up)
- `scrollProgress >= threshold + 0.02` → **passed** (soft glow, `opacity: 0.4`)

### 6. Gradient on the stroke

Use an SVG `<linearGradient>` along the path. Since the path zigzags, a simple left-right gradient won't work. Instead, apply the gradient by using multiple path segments with `stroke` transitioning from cool blue-white at the start to warm amber-white at the end. Alternatively, use a single gradient rotated to follow overall progress (top-to-bottom since the path descends), which approximates the cool→warm effect.

### 7. Responsive spacing

The SVG `viewBox` stays fixed. The container has:
- `width: 100%` and a responsive `max-width`
- `padding` adjusts per breakpoint (tighter on mobile)
- Node font sizes scale: `text-xs` on mobile, `text-sm` on desktop
- Stroke width: thinner on mobile (1.5px vs 2.5px)
- Node circle size: smaller on mobile (32px vs 48px)

The slalom shape is identical — only physical dimensions change.

### 8. Supabase keys structure

```
journey.badge         = "How I Work"
journey.heading       = "Straightforward process. No surprises."
journey.node1.label   = "First Contact"
journey.node2.label   = "Scoping Call"
journey.node3.label   = "Proposal & Cost"
journey.node4.label   = "Architecture Plan"
journey.node5.label   = "Kickoff"
journey.node6.label   = "First Build"
journey.node7.label   = "Weekly Check-ins"
journey.node8.label   = "Iterations"
journey.node9.label   = "Final Review"
journey.node10.label  = "Deployment"
journey.node11.label  = "Handoff"
journey.node12.label  = "Post-Launch"
journey.node13.label  = "Your Product, Live"
```

Reuses existing `process.badge` and `process.heading` keys (or migrates to `journey.*`).

## Risks / Trade-offs

- **[Performance on low-end devices]** → Scroll-linked SVG animation could jank. Mitigation: use `will-change: stroke-dashoffset` on the path, keep node count under 15, use `transform` for glow animations (GPU-accelerated).
- **[Section height]** → ~1000-1200px of vertical space. This is intentional — the journey needs room. But test that it doesn't feel like a dead zone on fast scrollers. Mitigation: The progressive reveal keeps visual interest throughout.
- **[SVG scaling on very narrow screens]** → Below ~320px, labels might overlap. Mitigation: use responsive font sizes and test on 375px (iPhone SE) as minimum target.
