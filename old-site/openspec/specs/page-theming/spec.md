### Requirement: Consistent Page Theming
All pages SHALL respect the user's current theme preference without overriding it on mount or unmount.

#### Scenario: Navigate to Apply page in dark mode
- **WHEN** user has dark mode enabled
- **AND** user navigates to the Apply page
- **THEN** the Apply page renders in dark mode
- **AND** theme does not change

#### Scenario: Navigate to Apply page in light mode
- **WHEN** user has light mode enabled
- **AND** user navigates to the Apply page
- **THEN** the Apply page renders in light mode
- **AND** theme does not change

#### Scenario: Leave Apply page preserves theme
- **WHEN** user is on the Apply page
- **AND** user navigates to another page
- **THEN** the theme remains unchanged
