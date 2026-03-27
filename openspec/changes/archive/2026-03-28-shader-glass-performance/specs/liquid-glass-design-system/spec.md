## MODIFIED Requirements

### Requirement: Liquid glass strong variant
The `.liquid-glass-strong` CSS class SHALL apply: `background: rgba(255,255,255,0.02)`, `background-blend-mode: luminosity`, `backdrop-filter: blur(20px)`, `border: none`, `box-shadow: 4px 4px 4px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.15)`, `position: relative`, `overflow: hidden`, `contain: content`. It SHALL include a `::before` pseudo-element with a gradient border mask using `-webkit-mask-composite: xor` / `mask-composite: exclude`.

#### Scenario: Strong glass effect renders
- **WHEN** an element has `.liquid-glass-strong` class
- **THEN** it displays a frosted glass effect with `backdrop-filter: blur(20px)` and stronger border visibility

#### Scenario: Strong glass compositing isolation
- **WHEN** an element has `.liquid-glass-strong` class
- **THEN** it has `contain: content` set, isolating its paint and layout from surrounding elements

### Requirement: Liquid glass subtle variant
The `.liquid-glass` CSS class SHALL apply: `background: rgba(255,255,255,0.01)`, `background-blend-mode: luminosity`, `backdrop-filter: blur(4px)`, `border: none`, `box-shadow: inset 0 1px 1px rgba(255,255,255,0.1)`, `position: relative`, `overflow: hidden`, `contain: content`. It SHALL include a `::before` pseudo-element with a gradient border mask using `-webkit-mask-composite: xor` / `mask-composite: exclude`.

#### Scenario: Subtle glass effect renders
- **WHEN** an element has `.liquid-glass` class
- **THEN** it displays a subtle frosted glass effect with a thin gradient border visible at top and bottom edges

#### Scenario: Subtle glass compositing isolation
- **WHEN** an element has `.liquid-glass` class
- **THEN** it has `contain: content` set, isolating its paint and layout from surrounding elements
