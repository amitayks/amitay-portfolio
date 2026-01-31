## Context

PortfolioCard currently uses an imperative animation loop with `useAnimate` from Framer Motion, toggling between two spring-physics phases. There's a "wind" context that amplifies movement when active. The animation feels bouncy and mechanical rather than ambient.

The goal is a calm, cloud-like floating effect - items that feel alive and hovering without drawing attention to the animation itself.

## Goals / Non-Goals

**Goals:**
- Subtle, continuous floating animation that feels ambient
- Organic variation between cards (not synchronized robots)
- Simplified, declarative animation code
- Maintain accessibility (reduced motion support)
- Remove wind feature complexity entirely

**Non-Goals:**
- Interactive animation responses (hover effects that change float)
- Performance optimization beyond current state
- Animation on other components (scope limited to PortfolioCard)

## Decisions

### 1. Declarative vs Imperative Animation

**Decision**: Use Framer Motion's declarative `animate` prop with `transition.repeat: Infinity`

**Alternatives considered**:
- Keep imperative `useAnimate` loop → More complex, harder to maintain
- CSS keyframes → Less control, harder to vary per-card
- requestAnimationFrame → Overkill, potential performance issues

**Rationale**: Declarative approach is cleaner, Framer Motion handles the loop seamlessly, and we can easily vary timing per card.

### 2. Animation Timing Function

**Decision**: Use `ease: "easeInOut"` for smooth sine-wave feel

**Alternatives considered**:
- Spring physics → Too bouncy for ambient effect
- Linear → Robotic, unnatural
- Custom bezier → Unnecessary complexity

**Rationale**: easeInOut naturally creates the acceleration/deceleration pattern that mimics floating objects.

### 3. Organic Variation Strategy

**Decision**: Derive timing from card index using deterministic formulas

```
duration = 5 + (index % 5) * 0.4      // 5.0s to 6.6s range
delay = (index * 1.3) % duration      // Spreads start times
yOffset = 3 + (index % 3)             // 3-5px range
```

**Alternatives considered**:
- Random values → Not deterministic, would change on re-render
- Single timing for all → Looks robotic
- Store offsets in state → Unnecessary complexity

**Rationale**: Index-based formulas are deterministic (same on every render), simple to implement, and create enough variation for organic feel.

### 4. Animation Properties

**Decision**: Animate only Y, X, and subtle rotation

| Property | Range | Rationale |
|----------|-------|-----------|
| `y` | -2px to -5px | Main float, visible but gentle |
| `x` | -1px to 1px | Tiny horizontal sway |
| `rotate` | -0.3° to 0.3° | Barely perceptible, adds life |
| `scale` | none | Removed - keeps cards visually stable |

**Rationale**: Minimal properties = better performance and subtler effect.

### 5. Wind Context Removal

**Decision**: Delete WindContext entirely, remove all `isWindActive` references

**Rationale**: Feature is only used in PortfolioCard, adds complexity for minimal value. Clean removal simplifies codebase.

## Risks / Trade-offs

**[Risk] Animation may feel too subtle on first implementation**
→ Mitigation: Values can be tuned after seeing live. Start conservative.

**[Risk] Removing wind feature may disappoint if users expected it**
→ Mitigation: Wind was internal-only, no external API. No user impact.

**[Trade-off] Deterministic variation means same pattern every time**
→ Acceptable: Consistency is fine; organic feel comes from cards being out-of-sync with each other, not from true randomness.
