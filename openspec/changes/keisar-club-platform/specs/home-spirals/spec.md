## ADDED Requirements

### Requirement: Three labeled spirals
The home page SHALL render three independent project spirals, each labeled with a section heading: **Finished**, **Ongoing**, **Upcoming**. Each spiral SHALL be populated from `projects` filtered by the matching `status` value.

#### Scenario: Finished spiral lists only finished projects
- **WHEN** the home page loads
- **THEN** the Finished spiral renders one card per `projects` row where `publish=true AND status='finished'`

#### Scenario: Ongoing spiral lists only ongoing projects
- **WHEN** the home page loads
- **THEN** the Ongoing spiral renders one card per `projects` row where `publish=true AND status='ongoing'`

#### Scenario: Upcoming spiral lists only upcoming projects
- **WHEN** the home page loads
- **THEN** the Upcoming spiral renders one card per `projects` row where `publish=true AND status='upcoming'`

### Requirement: Section order on home page
The three spirals SHALL appear in the order: Finished → Ongoing → Upcoming (top to bottom on the page).

#### Scenario: Page composition
- **WHEN** the home page DOM is inspected
- **THEN** the Finished spiral container precedes the Ongoing spiral container, which precedes the Upcoming spiral container

### Requirement: Empty-state hiding
A spiral SHALL be hidden (rendered as zero-height, with no section heading and no placeholder cards) when its filtered query returns zero published projects. The Finished spiral SHALL be allowed to be empty at build-time but the launch requirement is that it has at least one item.

#### Scenario: No upcoming projects
- **WHEN** the home page loads and no project has `status='upcoming' AND publish=true`
- **THEN** the Upcoming section heading and spiral are entirely absent from the DOM

#### Scenario: No ongoing projects
- **WHEN** the home page loads and no project has `status='ongoing' AND publish=true`
- **THEN** the Ongoing section heading and spiral are entirely absent from the DOM

### Requirement: Spiral direction
Each spiral SHALL scroll in a fixed direction: Finished left, Ongoing right, Upcoming left. The directions are decorative and SHALL NOT change with content.

#### Scenario: Direction persists across visits
- **WHEN** the home page is loaded on two separate visits
- **THEN** the spiral directions are the same on both visits

### Requirement: Carousel primitive reuse
Each spiral SHALL render using the existing `InfiniteCarousel` and `CarouselCard` components. The card SHALL display the project's `image`, `title`, and a status-derived badge ("Coming soon" for Upcoming, "In progress" for Ongoing, no badge for Finished).

#### Scenario: Card renders status badge
- **WHEN** a card for an `ongoing` project is rendered
- **THEN** the card displays an "In progress" badge

#### Scenario: Finished card has no badge
- **WHEN** a card for a `finished` project is rendered
- **THEN** the card does not display a status badge

### Requirement: Click behavior unchanged
Clicking a card in any spiral SHALL open the project modal/case study route identically to the current behavior, regardless of status.

#### Scenario: Click opens case study
- **WHEN** a user clicks a card in the Ongoing spiral with SKU `WEB-FOO`
- **THEN** the project modal opens for `WEB-FOO`, using the same handler currently bound to existing carousels
