## ADDED Requirements

### Requirement: Theme Color Meta Tag
The site SHALL include a `<meta name="theme-color">` tag that matches the current theme.

#### Scenario: Light mode theme color
- **WHEN** site loads in light mode
- **THEN** browser chrome uses light background color

#### Scenario: Dark mode theme color
- **WHEN** site loads in dark mode
- **THEN** browser chrome uses dark background color

### Requirement: Resource Preconnect
The site SHALL preconnect to known external domains in `<head>`.

#### Scenario: Supabase preconnect
- **WHEN** page loads
- **THEN** browser has early connection to Supabase domain

### Requirement: Lazy Loading Images
Below-fold images SHALL use `loading="lazy"` attribute.

#### Scenario: Portfolio grid images lazy load
- **WHEN** user scrolls to portfolio grid
- **THEN** images load as they approach viewport
- **AND** images above fold load immediately

### Requirement: Touch Action Optimization
Interactive elements SHALL use `touch-action: manipulation` to prevent tap delay.

#### Scenario: Button tap is immediate
- **WHEN** user taps a button on mobile
- **THEN** action triggers without 300ms delay

### Requirement: Overscroll Containment
Modal and drawer components SHALL use `overscroll-behavior: contain`.

#### Scenario: Mobile menu scroll is contained
- **WHEN** user scrolls within mobile menu
- **AND** reaches scroll boundary
- **THEN** parent page does not scroll
