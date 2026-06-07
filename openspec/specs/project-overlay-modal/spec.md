## Purpose

The shared overlay-modal primitive for project deep-dives: full-screen presentation, backdrop, open/close animations, scroll lock, focus trap, gallery, content rendering, external-link buttons, and data fetching with prefetch support.

## Requirements

### Requirement: Full-screen overlay presentation
The modal SHALL render as a full-screen overlay on top of the page content. It SHALL NOT change the URL. The modal container SHALL have `max-height: 90vh`, `overflow-y: auto`, `rounded-t-3xl` (rounded top corners), and use `liquid-glass-strong` styling. On desktop, the modal SHALL be centered with `max-w-4xl` and side margins. On mobile, it SHALL be full-width.

#### Scenario: Modal renders as overlay
- **WHEN** a project modal opens
- **THEN** it appears as a glass panel overlaying the page, not a new route

### Requirement: Backdrop effect
When the modal is open, the page content behind it SHALL blur (`backdrop-filter: blur(20px)`) and dim (`bg-black/60`).

#### Scenario: Background blurs on modal open
- **WHEN** the modal opens
- **THEN** the main page content behind becomes blurred and darkened

### Requirement: Open animation
The modal SHALL animate in by sliding up from the bottom (`y: 100vh → 0`) with a fade (`opacity: 0 → 1`), duration `0.4s`, ease-out curve.

#### Scenario: Modal slides up on open
- **WHEN** a carousel card is clicked
- **THEN** the modal slides up from the bottom of the screen with a fade-in effect

### Requirement: Close triggers
The modal SHALL close when: (1) the X button in the top-right corner is clicked, (2) the backdrop area outside the modal is clicked, or (3) the Escape key is pressed.

#### Scenario: Close via escape key
- **WHEN** the modal is open and the user presses Escape
- **THEN** the modal closes with a reverse slide-down + fade-out animation

#### Scenario: Close via backdrop click
- **WHEN** the user clicks the blurred area outside the modal panel
- **THEN** the modal closes

### Requirement: Close animation
The modal SHALL animate out with the reverse of the open animation: slide down (`y: 0 → 100vh`) with fade (`opacity: 1 → 0`), duration `0.3s`.

#### Scenario: Modal slides down on close
- **WHEN** the modal is dismissed
- **THEN** it slides down and fades out smoothly

### Requirement: Body scroll lock
When the modal is open, the body SHALL have `overflow: hidden` to prevent background scrolling. The modal itself SHALL be independently scrollable.

#### Scenario: Scroll lock when open
- **WHEN** the modal is open and the user tries to scroll
- **THEN** only the modal content scrolls, not the page behind it

### Requirement: Focus trap
Keyboard focus SHALL be trapped within the modal when open. Tab cycling SHALL loop within modal interactive elements. Focus SHALL return to the triggering carousel card when the modal closes.

#### Scenario: Tab stays within modal
- **WHEN** the modal is open and user presses Tab repeatedly
- **THEN** focus cycles through modal elements only and does not escape to the page behind

### Requirement: Image gallery
The modal SHALL display the project's main image (`image` field) at 1:1 aspect ratio, and up to 4 thumbnail images from `imagePack`. Clicking a thumbnail SHALL swap it into the main image position. Thumbnails SHALL be keyboard-accessible (Enter/Space to select).

#### Scenario: Thumbnail image swap
- **WHEN** user clicks a thumbnail image in the modal
- **THEN** that image replaces the main image display

#### Scenario: Keyboard image selection
- **WHEN** user focuses a thumbnail and presses Enter
- **THEN** that image becomes the main displayed image

### Requirement: Project content display
The modal SHALL display: project title (`font-heading italic text-3xl text-white`), short description, long description (rendered from markdown via `marked`), technologies as liquid-glass pills (`liquid-glass rounded-full px-3 py-1`), additional info in a liquid-glass table, and external links (live site, GitHub) as `liquid-glass-strong rounded-full` buttons.

#### Scenario: Markdown long description renders
- **WHEN** a project with markdown in `longDescription` is displayed
- **THEN** the markdown is rendered as formatted HTML (headings, lists, links, code blocks)

#### Scenario: Technologies as pills
- **WHEN** a project has technologies ["React", "TypeScript", "Supabase"]
- **THEN** three liquid-glass pill badges appear with those labels

### Requirement: External link buttons
If the project has `liveSite`, a "Visit Live Site" button with ArrowUpRight icon SHALL appear. If the project has `github`, a "View on GitHub" button SHALL appear. Both SHALL open in new tabs (`target="_blank" rel="noopener noreferrer"`).

#### Scenario: Live site link present
- **WHEN** a project has a `liveSite.link` value
- **THEN** a glass button labeled with `liveSite.label` or "Visit Live Site" appears and opens the URL in a new tab

#### Scenario: No external links
- **WHEN** a project has neither `liveSite` nor `github`
- **THEN** no external link buttons are rendered

### Requirement: Data fetching and prefetch
The modal SHALL fetch project data via `getPortfolioById(SKU, lang)`. Image URLs SHALL be fetched via `getPortfolioImage(imageName)`. If data was prefetched on hover, the modal SHALL open instantly from cache.

#### Scenario: Instant open from prefetch
- **WHEN** user hovered on a card (triggering prefetch) and then clicks it
- **THEN** the modal opens immediately with data from React Query cache, no loading spinner
