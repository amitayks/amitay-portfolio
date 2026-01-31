## Why

The current PortfolioCard animation is too bouncy and complex with spring physics, dual-mode "wind" state, and directional movement. Users want a subtle, ambient "cloud-like" floating effect that makes items feel alive without being distracting - gentle, continuous hovering rather than reactive bouncing.

## What Changes

- **Replace spring-based animation** with smooth sine-wave floating motion
- **Remove "wind" feature entirely** - delete `useWind` context and all references
- **Simplify animation logic** - remove imperative animation loop, AbortController complexity
- **Add organic variation** - each card has slightly different timing/offset for natural feel
- **Remove hover settle effect** - cards keep floating during interaction
- **Preserve accessibility** - keep `useReducedMotion` support

## Capabilities

### New Capabilities
- `floating-animation`: Defines the ambient floating animation behavior for portfolio items - movement range, timing, organic variation, and accessibility considerations

### Modified Capabilities
- `animation-preferences`: Update to remove wind mode references, simplify to single ambient mode

## Impact

- **Files to modify**:
  - `src/components/PortfolioCard.tsx` - animation logic rewrite
  - `src/contexts/` - remove WindContext entirely
  - Any components importing `useWind`
- **Dependencies**: None changing (still using Framer Motion)
- **Breaking**: Wind feature removed (internal only, no external API impact)
