## ADDED Requirements

### Requirement: Reduced Motion Support
The site SHALL respect the `prefers-reduced-motion` user preference.

#### Scenario: User prefers reduced motion
- **WHEN** user has `prefers-reduced-motion: reduce` set
- **THEN** animations are minimized or disabled
- **AND** transitions use instant or very short durations

#### Scenario: User allows motion
- **WHEN** user has no motion preference or `prefers-reduced-motion: no-preference`
- **THEN** full animations play normally

### Requirement: Reduced Motion Hook
A `useReducedMotion` hook SHALL be available for Framer Motion components.

#### Scenario: Hook returns user preference
- **WHEN** component uses `useReducedMotion` hook
- **THEN** hook returns boolean indicating if motion should be reduced

### Requirement: Animation Fallbacks
Components with animations SHALL provide reduced motion variants.

#### Scenario: PortfolioCard in reduced motion mode
- **WHEN** user prefers reduced motion
- **THEN** floating animation is disabled
- **AND** hover effects are simplified

#### Scenario: Page transitions in reduced motion mode
- **WHEN** user prefers reduced motion
- **AND** user navigates between pages
- **THEN** transitions are instant or very short

### Requirement: Form Autocomplete
Form inputs SHALL have appropriate `autocomplete` attributes.

#### Scenario: Name input has autocomplete
- **WHEN** user focuses on name input
- **THEN** browser can suggest saved names

#### Scenario: Email input has autocomplete
- **WHEN** user focuses on email input
- **THEN** browser can suggest saved emails

### Requirement: Input Mode
Form inputs SHALL have appropriate `inputmode` attributes for mobile keyboards.

#### Scenario: Email input shows email keyboard
- **WHEN** user taps email input on mobile
- **THEN** email-optimized keyboard appears

#### Scenario: Phone input shows numeric keyboard
- **WHEN** user taps phone input on mobile
- **THEN** numeric keyboard appears
