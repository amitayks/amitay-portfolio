## ADDED Requirements

### Requirement: Modal covers full viewport
The modal panel SHALL cover the entire viewport dimensions — full width and full height — with no top gap, no max-width constraint on the outer shell, and no rounded top corners.

#### Scenario: Modal opens
- **WHEN** the modal is opened
- **THEN** it covers the full screen (inset-0) with the glass background stretching edge to edge

#### Scenario: Content is centered within full-width modal
- **WHEN** the modal content is rendered
- **THEN** it is horizontally centered with a max-width constraint (e.g., max-w-5xl) and horizontal padding, so text doesn't stretch to screen edges on wide monitors

### Requirement: Close button is fixed to viewport
The X close button SHALL be positioned fixed relative to the viewport (not the scrollable content), staying in the same screen position regardless of scroll.

#### Scenario: User scrolls modal content
- **WHEN** the user scrolls down within the modal
- **THEN** the X button remains visible at the same position on screen (top-right area)

#### Scenario: Close button z-index
- **WHEN** the modal is open
- **THEN** the close button renders above the modal panel content (higher z-index)

### Requirement: Unified content flow without section breaks
The modal content SHALL flow as one continuous piece without nested glass panels or visually distinct section containers. Only the outer modal shell has the glass effect.

#### Scenario: Additional info rendering
- **WHEN** additional info rows are rendered
- **THEN** they appear inline in the content flow without a separate glass card wrapper

#### Scenario: Visual spacing between sections
- **WHEN** different content sections (title, description, tags, info, links) are rendered
- **THEN** they are separated by consistent spacing only, not by distinct background panels or borders

### Requirement: No scroll-triggered animations on inner content
Content inside the modal SHALL NOT use viewport-triggered enter/exit animations (no `whileInView`, no per-section `AnimatePresence`). All content is immediately present once the modal opens.

#### Scenario: User scrolls past content and scrolls back
- **WHEN** the user scrolls down past content and then scrolls back up
- **THEN** all content remains visible without any disappear/reappear animation

#### Scenario: Modal open
- **WHEN** the modal finishes its entry animation
- **THEN** all content sections are immediately visible (no staggered reveals)

### Requirement: Technology tags are centered
The technology tag pills SHALL be centered horizontally within their container.

#### Scenario: Tags layout
- **WHEN** technology tags are rendered
- **THEN** they are centered (not left-aligned), wrapping to multiple centered lines if needed
