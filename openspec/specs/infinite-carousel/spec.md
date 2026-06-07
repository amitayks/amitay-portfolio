## Purpose

The edge-to-edge, auto-scrolling card carousel used for project showcases. Supports hover pause, drag/swipe, configurable direction, and prefetch-on-hover into the project modal.

## Requirements

### Requirement: Edge-to-edge layout
The carousel SHALL span the full viewport width with no horizontal padding. Vertical padding SHALL be `py-16`.

#### Scenario: Carousel width
- **WHEN** the carousel section renders on any screen size
- **THEN** it extends from the left edge to the right edge of the viewport with no side margins

### Requirement: Infinite loop scroll
The carousel SHALL render items in an infinite loop by duplicating the item array (2-3x) to fill the viewport plus overflow. When the scroll position reaches the end of the first item set, it SHALL seamlessly reset to the beginning with no visible jump.

#### Scenario: Seamless loop
- **WHEN** the carousel scrolls past the last item in the first rendered set
- **THEN** the scroll position resets to the equivalent position in the first set without any visual discontinuity

### Requirement: Constant-speed auto-scroll
The carousel SHALL auto-scroll continuously at approximately 30-40px per second. Speed SHALL be configurable via a CSS variable `--carousel-speed`. The scroll SHALL use `requestAnimationFrame` for smooth rendering.

#### Scenario: Auto-scroll on idle
- **WHEN** the page loads and the carousel is visible
- **THEN** the carousel scrolls smoothly at constant speed without user interaction

### Requirement: Configurable scroll direction
The carousel component SHALL accept a `direction` prop: `"right"` (scroll content rightward) or `"left"` (scroll content leftward). The code carousel SHALL use `direction="right"` and the wood carousel SHALL use `direction="left"`.

#### Scenario: Opposite directions
- **WHEN** both carousels are visible on screen
- **THEN** the code carousel scrolls right and the wood carousel scrolls left, creating a visual counter-flow

### Requirement: Hover interaction
On desktop, hovering over the carousel SHALL slow the auto-scroll speed (not stop completely). The cursor SHALL change to `pointer`.

#### Scenario: Hover slows scroll
- **WHEN** user hovers over a carousel card on desktop
- **THEN** the auto-scroll speed reduces to approximately 50% of normal speed

### Requirement: Drag and swipe interaction
Users SHALL be able to drag (desktop) or swipe (mobile) the carousel to manually control position. During drag, auto-scroll SHALL pause. On release, the carousel SHALL apply momentum (deceleration based on drag velocity) and then resume auto-scroll in the original direction.

#### Scenario: Drag to browse
- **WHEN** user clicks and drags the carousel on desktop
- **THEN** the carousel follows the pointer position, auto-scroll pauses

#### Scenario: Swipe on mobile
- **WHEN** user swipes the carousel on a touch device
- **THEN** the carousel follows the touch with natural momentum on release

#### Scenario: Resume after interaction
- **WHEN** the user releases after dragging/swiping and momentum has decayed
- **THEN** the auto-scroll resumes in the original direction at the original constant speed

### Requirement: Carousel card design
Each card SHALL be a `liquid-glass rounded-2xl overflow-hidden` container displaying a 1:1 aspect-ratio image with a gradient overlay at the bottom (transparent → black) containing the project title (`font-heading italic text-white text-lg`) and short description (`font-body text-white/60 text-xs`, single line, truncated with ellipsis).

#### Scenario: Card visual structure
- **WHEN** a carousel card renders
- **THEN** it shows a square image with the project title overlaid at the bottom over a dark gradient

### Requirement: Carousel card sizing
Cards SHALL be approximately 300px wide on desktop, 240px on tablet, and 70-80vw on mobile. Gap between cards SHALL be 12px.

#### Scenario: Mobile card sizing
- **WHEN** viewport is mobile width
- **THEN** cards are 70-80vw wide, showing one full card and peek of the next

### Requirement: Card click opens modal
Clicking a carousel card SHALL open the project overlay modal for that project, identified by SKU.

#### Scenario: Click to open project
- **WHEN** user clicks a carousel card
- **THEN** the project overlay modal opens showing full details for that project

### Requirement: Image loading strategy
The first 6 carousel images SHALL load eagerly. Remaining images SHALL use `loading="lazy"`. Each image SHALL show a liquid-glass skeleton placeholder while loading and transition from `opacity: 0` to `opacity: 1` over `0.3s ease-in-out` when loaded.

#### Scenario: Lazy loading beyond viewport
- **WHEN** the carousel renders with 15 project cards
- **THEN** only the first 6 images load immediately; the rest load as they approach the viewport

### Requirement: Data source filtering
The code carousel SHALL query portfolio items with `projectType = 'Web-Development'`. The wood carousel SHALL query with `projectType = 'Wood-Working'`. Both SHALL filter by current language.

#### Scenario: Code carousel shows only code projects
- **WHEN** the code carousel fetches data
- **THEN** only items with `projectType = 'Web-Development'` and `lang = currentLang` are returned

### Requirement: Prefetch on hover
When a user hovers over a carousel card, the system SHALL prefetch the full project data and first image for that project using React Query `prefetchQuery`, so the modal opens instantly.

#### Scenario: Hover prefetch
- **WHEN** user hovers over a carousel card for 200ms+
- **THEN** the full project detail and main image are prefetched into React Query cache
