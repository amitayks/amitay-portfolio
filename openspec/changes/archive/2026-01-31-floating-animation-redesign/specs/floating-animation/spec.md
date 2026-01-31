## ADDED Requirements

### Requirement: Continuous floating animation
Portfolio cards SHALL display a continuous, ambient floating animation that creates a "hovering in place" effect similar to a cloud or object floating on water.

#### Scenario: Card displays floating animation on load
- **WHEN** a portfolio card becomes visible in the viewport
- **THEN** the card SHALL begin a smooth, continuous floating animation

#### Scenario: Animation continues indefinitely
- **WHEN** the floating animation completes one cycle
- **THEN** the animation SHALL seamlessly restart without pause or visual interruption

### Requirement: Subtle movement range
The floating animation SHALL use subtle movement values that are visible to the human eye but not distracting.

#### Scenario: Vertical float range
- **WHEN** the card is animating
- **THEN** the vertical movement SHALL stay within 3-5 pixels range

#### Scenario: Horizontal sway range
- **WHEN** the card is animating
- **THEN** the horizontal movement SHALL stay within 1-2 pixels range

#### Scenario: Rotation range
- **WHEN** the card is animating
- **THEN** the rotation SHALL stay within 0.5 degrees or less

### Requirement: Organic variation between cards
Each portfolio card SHALL have slightly different animation timing to create an organic, non-synchronized effect.

#### Scenario: Different durations per card
- **WHEN** multiple cards are displayed
- **THEN** each card SHALL have a different animation duration within a 5-7 second range

#### Scenario: Different start phases per card
- **WHEN** multiple cards load simultaneously
- **THEN** each card SHALL begin at a different phase of the animation cycle

#### Scenario: Deterministic variation
- **WHEN** the page is reloaded
- **THEN** each card SHALL have the same timing variation as before (based on card index)

### Requirement: Smooth easing
The animation SHALL use smooth easing that mimics natural floating motion.

#### Scenario: Sine-wave-like motion
- **WHEN** the card moves through its animation cycle
- **THEN** the motion SHALL accelerate and decelerate smoothly (no linear or jerky movement)

### Requirement: Hover behavior
Cards SHALL continue floating during user interaction.

#### Scenario: Floating continues on hover
- **WHEN** the user hovers over a portfolio card
- **THEN** the floating animation SHALL continue unchanged

### Requirement: Reduced motion accessibility
The floating animation SHALL respect user accessibility preferences.

#### Scenario: Reduced motion preference enabled
- **WHEN** the user has `prefers-reduced-motion: reduce` enabled
- **THEN** the floating animation SHALL be disabled entirely

#### Scenario: Reduced motion preference disabled
- **WHEN** the user has no reduced motion preference
- **THEN** the floating animation SHALL display normally
