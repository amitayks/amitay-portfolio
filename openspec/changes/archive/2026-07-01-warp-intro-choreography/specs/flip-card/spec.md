## MODIFIED Requirements

### Requirement: Front face renders AnimatedLogo with shader
The front face SHALL contain the `AnimatedLogo` component (inline white SVG logo fragments — no raster image or shader). The logo SHALL be sized as a **constant 1/3 of the card's current width** via CSS — a `calc(100% / 3)` wrapper with a `1 / 2` aspect ratio, with `AnimatedLogo` filling it (`fill`) — rather than a discrete pixel `size` prop. Because the size is a fraction of the animated card, the logo SHALL scale **continuously** with the card: ~80px in the ~240px intro card and 16px in the 48px navbar icon (both exactly 1/3 of the card width), with no snap or resize step during the flight. The front face SHALL have no background of its own; the liquid-glass card surface shows behind the logo.

#### Scenario: Logo scales continuously during the flight
- **WHEN** the card animates from its intro size (~240px) to the navbar size (48px) during the flight
- **THEN** the logo SHALL scale smoothly in lockstep (~80px → 16px), staying 1/3 of the card width throughout
- **AND** there SHALL be no discrete size snap at landing

#### Scenario: Front face at intro scale
- **WHEN** the FlipCard is in the intro/centered state with card width ~240px
- **THEN** the logo SHALL render at ~80px (1/3 of the card width), filling its wrapper

#### Scenario: Front face at navbar scale
- **WHEN** the FlipCard is in the navbar/settled state at 48×48px
- **THEN** the logo SHALL render at 16px (1/3 of the card width), matching the navbar logo appearance
