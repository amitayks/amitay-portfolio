## Why

The current "How I Work" section uses three static glass cards (01/02/03) — a pattern that feels generic and AI-generated. It doesn't connect emotionally with clients or differentiate the portfolio. The process section is the #1 trust-builder for freelancers, and it deserves a visual treatment that matches the quality of the rest of the site.

## What Changes

- Replace the 3-card static layout in `HowIWork.tsx` with an animated SVG slalom timeline
- The timeline zigzags horizontally across the screen (left-to-right, then right-to-left, repeating) with curved connectors between rows
- Each node is a "light ball" that glows when activated via scroll position — dim outline → bright glow → soft steady
- The SVG path line draws itself as the user scrolls using `stroke-dashoffset` tied to scroll progress
- Expand from 3 steps to ~13 nodes representing the full client journey: First Contact → Scoping → Proposal → Architecture → Kickoff → First Build → Weekly Updates → Iterations → Final Review → Deployment → Handoff → Post-Launch → Your Product Live
- Same layout on mobile and desktop — only spacing and line widths adjust, not the structure
- No sticky header — section scrolls naturally
- The final node is larger/brighter with a special glow as the payoff moment
- Line gradient from cool (start) to warm (end) to visually communicate progress

## Capabilities

### New Capabilities
- `slalom-timeline`: Scroll-driven SVG slalom timeline with glow nodes, path-drawing animation, and responsive spacing

### Modified Capabilities

## Impact

- Replaces `src/sections/HowIWork.tsx` entirely
- Supabase `process.*` keys still used for i18n (may need new keys for additional node labels)
- Uses existing `motion/react` for scroll-linked animations (`useScroll`, `useTransform`)
- No new dependencies needed
- Section will need more vertical space (~1000-1200px) to accommodate the full slalom journey
