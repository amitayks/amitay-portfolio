## 1. Supabase — Journey Node Keys

- [x] 1.1 Add `journey.node1.label` through `journey.node13.label` keys (EN) to Supabase: First Contact, Scoping Call, Proposal & Cost, Architecture Plan, Kickoff, First Build, Weekly Check-ins, Iterations, Final Review, Deployment, Handoff, Post-Launch, Your Product Live
- [x] 1.2 Add `journey.node1.label` through `journey.node13.label` keys (HE) to Supabase with Hebrew translations
- [x] 1.3 Rename existing `process.badge` / `process.heading` to `journey.badge` / `journey.heading` in Supabase (EN + HE), or add new `journey.*` keys if keeping process keys for backward compat

## 2. SVG Slalom Path

- [x] 2.1 Define the slalom path data: 4 horizontal rows with bezier arcs connecting them. Use a fixed viewBox (e.g., `0 0 1000 900`). Row 1 left→right, Row 2 right→left, Row 3 left→right, Row 4 right→left with final centered node
- [x] 2.2 Create the SVG `<path>` element with the slalom `d` attribute
- [x] 2.3 Add an SVG `<linearGradient>` (top-to-bottom) transitioning from cool white-blue at the top to warm white-amber at the bottom. Apply as the path stroke
- [x] 2.4 Set `stroke-dasharray` equal to total path length and `stroke-dashoffset` as a motion value driven by scroll progress

## 3. Scroll-Driven Animation

- [x] 3.1 Add a section `ref` and use framer-motion `useScroll({ target: ref, offset: ["start end", "end start"] })` to get `scrollYProgress`
- [x] 3.2 Use `useTransform` to map `scrollYProgress` (0→1) to `stroke-dashoffset` (pathLength→0)
- [x] 3.3 Define a threshold value (0-1) for each of the 13 nodes based on their position along the path
- [x] 3.4 Use `useMotionValueEvent` or `useTransform` to derive each node's state (upcoming / active / passed) from `scrollYProgress` crossing its threshold

## 4. Glow Nodes

- [x] 4.1 Create node data array: 13 entries each with `key` (Supabase text key), `fallback` (EN label), `x`/`y` position (matching SVG viewBox coordinates), and `threshold` (0-1)
- [x] 4.2 Render nodes as absolutely positioned HTML `<div>` elements overlaying the SVG, positioned by scaling viewBox coords to actual rendered size
- [x] 4.3 Style three node states: upcoming (border white/10, bg transparent), active (bg white, box-shadow glow, scale 1.2, pulse animation), passed (bg white/40, soft glow)
- [x] 4.4 Render node labels adjacent to each node — above the node for odd rows (left→right), below for even rows (right→left)
- [x] 4.5 Style the final node (node 13) larger than others with an intensified glow effect when active

## 5. Responsive Scaling

- [x] 5.1 Set SVG container to `width: 100%` with viewBox preserving aspect ratio
- [x] 5.2 Use responsive classes for node circle size: `w-8 h-8 md:w-12 md:h-12` (32px mobile, 48px desktop)
- [x] 5.3 Use responsive classes for label text: `text-[10px] md:text-xs` on mobile, `text-sm` on desktop
- [x] 5.4 Set responsive stroke width: `1.5` on mobile, `2.5` on desktop (via media query or responsive class)
- [x] 5.5 Add horizontal padding: `px-4 md:px-16 lg:px-24`

## 6. Rewrite HowIWork Component

- [x] 6.1 Replace the contents of `src/sections/HowIWork.tsx` with the new slalom timeline component (keep the section badge + heading above the SVG area)
- [x] 6.2 Use `useSiteText` for all labels: `t("journey.nodeN.label", "Fallback")` for each node, `t("journey.badge", "How I Work")` and `t("journey.heading", "Straightforward process. No surprises.")` for the header
- [x] 6.3 Ensure section has enough vertical space (~1000-1200px) for the slalom to breathe
- [x] 6.4 Remove old `process.step*` Supabase key references from the component (old 3-card content)

## 7. Cleanup

- [x] 7.1 Verify the old `process.step*` keys in Supabase are no longer referenced anywhere — leave them in DB but confirm no code fetches them
- [ ] 7.2 Test scroll animation performance — verify 60fps on Chrome and Safari
- [ ] 7.3 Test on 375px viewport — verify labels don't overlap and slalom is legible
