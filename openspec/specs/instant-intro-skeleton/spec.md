# instant-intro-skeleton Specification

## Purpose
TBD - created by archiving change fast-intro-load. Update Purpose after archive.
## Requirements
### Requirement: Static intro card painted at first paint
`index.html` SHALL contain a static, self-contained intro card (a centered glass rectangle with the rotating-gradient border) rendered as inline markup plus an inline `<style>`, so it is painted as soon as the HTML document arrives — before the JavaScript bundle and before the external CSS bundle have loaded. The skeleton SHALL NOT depend on the JS bundle, the React app, the external CSS file, any web font, or any image. Its geometry (centered position, dimensions, border-radius, glass surface, rotating border) SHALL visually match the React `FlipCard`'s resting front-face state at the start of the intro.

#### Scenario: Card rectangle visible before the bundle loads
- **WHEN** a visitor with an empty cache opens the site and the ~2 KB HTML has arrived but the JS bundle has not finished downloading or parsing
- **THEN** the centered glass intro card rectangle (with its border) SHALL already be visible on the black background
- **AND** its appearance SHALL NOT wait on the JS bundle, the external CSS bundle, a font, or an image

#### Scenario: Skeleton geometry matches the React card
- **WHEN** the skeleton is shown and the React `FlipCard` later mounts at the intro's centered resting state
- **THEN** the skeleton's center, width, height, border-radius, glass fill, and border SHALL match the React card so the hand-off is not perceptible as a position or size change

### Requirement: Seamless hand-off from skeleton to React card
When the React app mounts, it SHALL remove the inline skeleton node and take over the intro without a visible flash, double-card, or re-fade. The React `FlipCard` SHALL adopt the already-visible state (it SHALL NOT replay an opacity 0→1 fade over the skeleton). The skeleton SHALL be removed before or in the same frame as the React card's first paint.

#### Scenario: No flash on hand-off
- **WHEN** the React app mounts and replaces the skeleton with the live `FlipCard`
- **THEN** there SHALL be no frame in which both the skeleton and the React card are visible at once, and no frame in which neither is visible
- **AND** the card SHALL NOT fade from transparent to opaque again (no re-materialize)

#### Scenario: Assembly begins from the handed-off card
- **WHEN** the hand-off completes
- **THEN** the logo assembly SHALL begin on the card that is already on screen
- **AND** the visitor SHALL NOT see an empty card-fade-in beat before the assembly

### Requirement: Skeleton suppressed for reduced motion
The inline skeleton SHALL only be shown when the visitor has not requested reduced motion. Under `prefers-reduced-motion: reduce` the centered skeleton SHALL NOT be displayed, consistent with the reduced-motion path that skips the intro and parks the card in the navbar.

#### Scenario: Reduced-motion visitor sees no centered skeleton
- **WHEN** a visitor with `prefers-reduced-motion: reduce` opens the site
- **THEN** the centered intro skeleton SHALL NOT be painted
- **AND** the experience SHALL match the existing reduced-motion behavior (no centered intro card)

### Requirement: Early connection warming for Supabase
`index.html` SHALL include a `preconnect` resource hint for the Supabase origin so the TLS connection is established before the first Supabase request (auth session check and the deferred profile image) is made.

#### Scenario: Supabase connection is warmed early
- **WHEN** the document loads
- **THEN** a `<link rel="preconnect">` (with `crossorigin`) for the Supabase origin SHALL be present in the document head
- **AND** the first Supabase request SHALL be able to reuse the warmed connection rather than paying a cold DNS/TCP/TLS setup

