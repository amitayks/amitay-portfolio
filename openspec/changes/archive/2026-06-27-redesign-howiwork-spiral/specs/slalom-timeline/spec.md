## RENAMED Requirements

- FROM: `### Requirement: Slalom SVG path renders as a zigzag across the viewport`
- TO: `### Requirement: Timeline SVG path renders as a vertical serpentine`

## MODIFIED Requirements

### Requirement: Timeline SVG path renders as a vertical serpentine
The section SHALL render a single continuous SVG path shaped as a vertical sine serpentine that flows top→bottom while swaying left and right around a center axis. The path SHALL be corner-free (no straight segments meeting at sharp angles) so the scroll-driven draw reads as smooth. The path SHALL be generated from a sine function (`x = cx − amplitude · cos(2π·(y − y0)/wavelength)`) rather than hand-authored segment commands.

#### Scenario: Path renders as a smooth vertical wave
- **WHEN** the HowIWork section is visible
- **THEN** the SVG displays one continuous undulating curve that descends the viewport, alternating between a left extreme and a right extreme, with no visible corners

#### Scenario: Path is responsive
- **WHEN** the viewport width changes
- **THEN** the serpentine scales proportionally via the SVG viewBox while keeping the same wave structure on all screen sizes

### Requirement: Nodes are positioned along the path at waypoints
Each journey step SHALL be anchored to a left/right extreme of the wave (derived from the same sine function that generates the path) and rendered as a bulb-and-label group placed just **outside** the curve in the open space — not centered on the line. Within the group the bulb SHALL sit nearest the line and the label beyond it; the group SHALL flow to the left of left-extreme nodes and to the right of right-extreme nodes.

#### Scenario: Node groups sit on the outer side of each bump
- **WHEN** the section renders
- **THEN** each bulb sits just outside its extreme of the serpentine (beside the line, not on it), with its label further out on the same side — left for left-extreme nodes, right for right-extreme nodes

#### Scenario: Bulbs render behind the line
- **WHEN** a bulb and its glow are near the line
- **THEN** the line stroke renders in front of the bulb (the bulb appears to sit behind the line)

### Requirement: Journey steps cover the full client engagement
The timeline SHALL include 5 nodes that summarize the client journey from first contact to a live product.

#### Scenario: All journey phases are represented
- **WHEN** the section renders
- **THEN** nodes cover, in order: First Contact, Scope & Proposal, Build, Iterate, Your Product Live

### Requirement: Nodes glow on scroll activation
Each node bulb SHALL be hidden (not yet "in existence") until the scroll-driven line draw reaches it. **WHEN** the draw reaches a node, its bulb SHALL pop into existence with a springy scale-up while sliding outward from behind the line, then settle to a lit state. Two lit states SHALL exist: active (bright glow, the current frontier) and passed (soft steady glow). Labels SHALL fade in alongside their bulb.

#### Scenario: Bulb pops in when the draw reaches it
- **WHEN** the scroll-driven path drawing reaches a node's position
- **THEN** the bulb transitions from hidden (scale 0, transparent) to visible with a spring overshoot ("pop"), sliding outward from behind the line, and its label fades in

#### Scenario: Node settles from active to passed
- **WHEN** the scroll progresses past a node's position
- **THEN** the node settles to a soft steady glow while remaining visible

#### Scenario: Final node has special treatment
- **WHEN** the last node ("Your Product, Live") activates
- **THEN** it renders larger than other nodes with an intensified (golden) glow effect

### Requirement: Same layout on mobile and desktop
The serpentine layout SHALL be identical on mobile and desktop. Only stroke width, node size, label font size, and overall scale SHALL adjust. The vertical wave structure SHALL NOT collapse to a straight vertical line on mobile.

#### Scenario: Mobile renders the serpentine
- **WHEN** viewed on a 375px wide viewport
- **THEN** the serpentine path renders with the same wave structure as desktop, scaled to width with thinner strokes and smaller labels
