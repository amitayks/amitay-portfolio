## ADDED Requirements

### Requirement: Icon Button Accessibility
All icon-only buttons SHALL have an `aria-label` attribute describing their action.

#### Scenario: Settings button has accessible name
- **WHEN** screen reader focuses on settings button
- **THEN** it announces "Settings" or equivalent

#### Scenario: Theme toggle has accessible name
- **WHEN** screen reader focuses on theme toggle
- **THEN** it announces "Switch to dark mode" or "Switch to light mode" based on current state

#### Scenario: Menu button has accessible name
- **WHEN** screen reader focuses on mobile menu button
- **THEN** it announces "Open menu" or "Close menu" based on state

### Requirement: Image Dimensions
All `<img>` elements SHALL have explicit `width` and `height` attributes or be contained in aspect-ratio containers.

#### Scenario: Portfolio card image has dimensions
- **WHEN** portfolio card image loads
- **THEN** no layout shift occurs (CLS = 0 for that element)

#### Scenario: Portfolio detail images have dimensions
- **WHEN** portfolio detail page loads images
- **THEN** image containers reserve correct space before load

### Requirement: Semantic Interactive Elements
Interactive elements that perform actions SHALL use `<button>` elements, not `<div>` with click handlers.

#### Scenario: Image thumbnail selector is a button
- **WHEN** user tabs to image thumbnail in portfolio detail
- **THEN** element is focusable and activatable via Enter/Space

### Requirement: Keyboard Navigation
All interactive elements SHALL be operable via keyboard.

#### Scenario: Settings dropdown keyboard accessible
- **WHEN** user presses Enter on settings button
- **THEN** dropdown opens
- **AND** focus moves to first option
- **AND** Escape closes dropdown

### Requirement: Focus Visibility
All focusable elements SHALL have visible focus indicators.

#### Scenario: Button receives focus
- **WHEN** user tabs to a button
- **THEN** visible focus ring appears (not just outline: none)
