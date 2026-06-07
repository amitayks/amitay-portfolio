## Purpose

The "How I work" section's scroll-driven zigzag SVG path with glowing waypoint nodes that activate as the user scrolls. Step copy covers the client engagement journey, is translatable, and renders identically on mobile and desktop.

## Requirements

### Requirement: Slalom SVG path renders as a zigzag across the viewport
The section SHALL render an SVG path that zigzags horizontally — left-to-right on the first row, then curves down and goes right-to-left on the next row, repeating. The path SHALL use quadratic/cubic bezier curves for the connecting arcs between rows.

#### Scenario: Path renders with correct slalom shape
- **WHEN** the HowIWork section is visible
- **THEN** the SVG displays a slalom path with horizontal segments connected by curved arcs, alternating direction on each row

#### Scenario: Path is responsive
- **WHEN** the viewport width changes
- **THEN** the horizontal segment widths and spacing adjust proportionally, but the slalom structure remains the same on all screen sizes

### Requirement: Path draws itself on scroll
The SVG path line SHALL animate its `stroke-dashoffset` based on the user's scroll position within the section. The line SHALL progressively reveal from start to end as the user scrolls through the section.

#### Scenario: Path drawing tied to scroll
- **WHEN** the user scrolls through the HowIWork section
- **THEN** the SVG stroke draws proportionally — at 0% scroll the path is invisible, at 100% scroll the full path is drawn

#### Scenario: Path uses gradient
- **WHEN** the path is drawn
- **THEN** the visible stroke transitions from a cool tone (start) to a warm tone (end) along the path length

### Requirement: Nodes are positioned along the path at waypoints
Each journey step SHALL be represented by a circular node positioned at a specific point along the SVG path. Nodes SHALL have labels and optional one-liner descriptions.

#### Scenario: Nodes are placed at correct path positions
- **WHEN** the section renders
- **THEN** each node is centered on its corresponding waypoint along the slalom path

#### Scenario: Node labels are visible
- **WHEN** a node is rendered
- **THEN** its label text is displayed adjacent to the node (above or below depending on row)

### Requirement: Nodes glow on scroll activation
Each node SHALL transition through three visual states based on scroll progress: upcoming (dim outline), active (bright glow with box-shadow pulse), and passed (soft steady glow).

#### Scenario: Node transitions from upcoming to active
- **WHEN** the scroll-driven path drawing reaches a node's position
- **THEN** the node transitions from dim outline (white/10) to bright glow (white + blur shadow) with a single pulse animation

#### Scenario: Node transitions from active to passed
- **WHEN** the scroll progresses past a node's position
- **THEN** the node settles to a soft steady glow (white/40)

#### Scenario: Final node has special treatment
- **WHEN** the last node ("Your Product, Live") activates
- **THEN** it renders larger than other nodes with an intensified glow effect

### Requirement: Journey steps cover the full client engagement
The timeline SHALL include approximately 13 nodes representing the full client journey from first contact to post-launch.

#### Scenario: All journey phases are represented
- **WHEN** the section renders
- **THEN** nodes cover: First Contact, Scoping Call, Proposal & Cost, Architecture Plan, Kickoff, First Working Build, Weekly Check-ins, Iterations, Final Review, Deployment, Handoff, Post-Launch Support, Your Product Live

### Requirement: All text content is translatable
All node labels and descriptions SHALL use the `useSiteText` hook with Supabase keys and English fallbacks. Hebrew translations SHALL exist in Supabase.

#### Scenario: Language switch updates all labels
- **WHEN** the user switches language from EN to HE
- **THEN** all node labels and descriptions update to Hebrew

### Requirement: Same layout on mobile and desktop
The slalom layout SHALL be identical on mobile and desktop. Only spacing between rows, stroke width, node size, and font size SHALL adjust. The zigzag structure SHALL NOT collapse to a vertical line on mobile.

#### Scenario: Mobile renders slalom
- **WHEN** viewed on a 375px wide viewport
- **THEN** the slalom path renders with the same zigzag structure as desktop, with tighter spacing and thinner strokes
