## MODIFIED Requirements

### Requirement: Animation Fallbacks
Components with animations SHALL provide reduced motion variants.

#### Scenario: PortfolioCard in reduced motion mode
- **WHEN** user prefers reduced motion
- **THEN** floating animation is disabled
- **AND** card remains static (no movement)

#### Scenario: Page transitions in reduced motion mode
- **WHEN** user prefers reduced motion
- **AND** user navigates between pages
- **THEN** transitions are instant or very short

## REMOVED Requirements

### Requirement: Wind Mode Animation
**Reason**: Wind feature removed to simplify animation system. Single ambient floating mode replaces dual-mode behavior.
**Migration**: No migration needed - wind mode was internal-only with no external API. PortfolioCard now uses continuous ambient floating animation instead.
