## ADDED Requirements

### Requirement: IntroContext provides intro phase state
A React context (`IntroContext`) SHALL be created and provided at the app root level (wrapping `AppContent`). It SHALL expose the following values:

- **`introPhase`**: A string representing the current intro phase. Possible values: `"card-fadein"`, `"logo-assembly"`, `"breath"`, `"flight"`, `"landing"`, `"final-flip"`, `"overlay-fadeout"`, `"done"`. The phase SHALL progress through these values in order as the intro sequence plays out.
- **`isIntroComplete`**: A boolean shortcut, `true` when `introPhase === "done"`.
- **`navbarIconRef`**: A React `RefObject<HTMLDivElement>` pointing to the navbar placeholder element.

The context SHALL be provided by an `IntroProvider` component that manages the intro state machine and exposes the phase transitions.

#### Scenario: IntroContext is available throughout the app
- **WHEN** any component within `AppContent` calls `useIntro()` (the context hook)
- **THEN** it SHALL receive the current `introPhase`, `isIntroComplete`, and `navbarIconRef`

#### Scenario: Intro phases progress in order
- **WHEN** the intro plays
- **THEN** `introPhase` SHALL transition through the phases in this exact order: `"card-fadein"` → `"logo-assembly"` → `"breath"` → `"flight"` → `"landing"` → `"final-flip"` → `"overlay-fadeout"` → `"done"`
- **AND** no phase SHALL be skipped (except when reduced motion is active — see below)

#### Scenario: isIntroComplete is true only when done
- **WHEN** `introPhase` is any value other than `"done"`
- **THEN** `isIntroComplete` SHALL be `false`
- **WHEN** `introPhase` transitions to `"done"`
- **THEN** `isIntroComplete` SHALL become `true` and remain `true` for the rest of the session

### Requirement: Hero animations delayed until intro completes
The Hero section's animations — `BlurText` word-by-word blur-in and the `motion.p` subtext fade-in — SHALL NOT begin playing until the intro sequence is complete (`introPhase === "done"` or `introPhase === "overlay-fadeout"`).

**Mechanism**: The Hero component SHALL read `introPhase` from `IntroContext`. It SHALL add a delay to its animations equal to a small offset after the intro completes (e.g., 200–400ms after the overlay starts fading). This ensures the Hero content animates in as the overlay dissolves, creating a seamless transition from intro to page content.

Specifically:
- `BlurText` SHALL receive a `delay` prop that accounts for the intro timing
- The `motion.p` subtext SHALL have its `transition.delay` increased by the same amount
- If `BlurText` uses IntersectionObserver to trigger (it does), the observer will fire immediately since Hero is above the fold — but the `delay` ensures the animation doesn't visually start until after the intro

#### Scenario: Hero does not animate during intro
- **WHEN** the intro overlay is active
- **THEN** the Hero's BlurText heading SHALL NOT be animating (even if the IntersectionObserver has triggered)
- **AND** the Hero's subtext SHALL NOT be animating

#### Scenario: Hero animates as overlay fades
- **WHEN** the intro transitions to the `"overlay-fadeout"` phase
- **THEN** the Hero's BlurText SHALL begin its word-by-word blur-in animation
- **AND** the subtext SHALL begin its blur + opacity fade-in
- **AND** these animations SHALL be visible as the overlay dissolves, creating a layered reveal effect

#### Scenario: Hero timing feels natural
- **WHEN** the overlay finishes fading out and the Hero is fully visible
- **THEN** the Hero animations SHALL already be partway through (they started during the fade)
- **AND** the transition from intro to Hero SHALL feel like one continuous choreographed sequence, not two separate events

### Requirement: Navbar appearance delayed until intro completes
The Navbar's nav links pill, language toggle, and other non-icon elements SHALL NOT be visible until the intro is complete. They SHALL fade in after the overlay starts dissolving (`introPhase === "overlay-fadeout"` or `"done"`).

The FlipCard itself (the logo icon) is always visible — it's part of the intro. But the rest of the navbar chrome should appear simultaneously with the page content reveal.

#### Scenario: Nav links hidden during intro
- **WHEN** the intro overlay is active
- **THEN** the navbar's nav links pill SHALL NOT be visible (opacity 0 or not rendered)
- **AND** the language toggle SHALL NOT be visible

#### Scenario: Nav links fade in with page content
- **WHEN** the intro transitions to `"overlay-fadeout"` or `"done"`
- **THEN** the nav links pill SHALL fade in (opacity 0 → 1) over approximately 300–500ms
- **AND** the language toggle SHALL fade in simultaneously
- **AND** the timing SHALL align with the Hero content reveal

#### Scenario: FlipCard visible throughout
- **WHEN** the intro is playing
- **THEN** the FlipCard (at the navbar icon position after the flight) SHALL remain visible regardless of the navbar fade state
- **AND** there SHALL be no moment where the navbar icon disappears between the intro flight landing and the navbar fade-in

### Requirement: Reduced motion skips entire intro
When `prefers-reduced-motion: reduce` is active (detected via `useReducedMotion()` from `motion/react`), the entire intro sequence SHALL be skipped. Specifically:

- `introPhase` SHALL be set to `"done"` immediately on mount
- The IntroOverlay SHALL NOT render at all
- The FlipCard SHALL render directly at the navbar position, showing the logo face, with no animation
- The Hero SHALL animate normally with its default delays (no intro offset)
- The Navbar SHALL be fully visible immediately
- Hover-flip on the navbar icon SHALL still work but with instant transition (no animation, just swap faces)
- Click-to-expand SHALL still work but with instant position change (no flight animation)

#### Scenario: No overlay on reduced motion
- **WHEN** `prefers-reduced-motion: reduce` is active
- **THEN** the IntroOverlay SHALL NOT be rendered
- **AND** no intro animation SHALL play
- **AND** the FlipCard SHALL appear at the navbar position immediately

#### Scenario: Hero animates normally on reduced motion
- **WHEN** `prefers-reduced-motion: reduce` is active
- **THEN** the Hero's BlurText and subtext SHALL use their original delays (no intro offset)
- **AND** they SHALL render as plain text (BlurText already handles this via `useReducedMotion()`)

#### Scenario: Interactions still work without animation
- **WHEN** `prefers-reduced-motion: reduce` is active
- **AND** the user hovers over the navbar icon
- **THEN** the card face SHALL swap instantly to the profile photo (no rotation animation)
- **WHEN** the user clicks the navbar icon
- **THEN** the profile photo SHALL appear centered on screen instantly (no flight animation)
- **AND** the backdrop SHALL appear without fade

### Requirement: Intro plays on every load and reload
The intro sequence SHALL play every time the page loads or reloads. There SHALL be no session storage, local storage, or cookie-based mechanism to skip the intro on subsequent visits. Each page load is treated as a fresh visit.

#### Scenario: Reload triggers full intro
- **WHEN** the user reloads the page (F5, Cmd+R, or browser refresh)
- **THEN** the full intro sequence SHALL play from the beginning
- **AND** the experience SHALL be identical to the first visit

#### Scenario: No "skip intro" persistence
- **WHEN** the user has visited the site before (same session or different session)
- **AND** the user navigates to the site again
- **THEN** the intro SHALL play in full
- **AND** there SHALL be no stored flag that bypasses the intro

### Requirement: IntroProvider component tree placement
The `IntroProvider` SHALL wrap `AppContent` (and be inside `LanguageProvider` and `PersistQueryClientProvider`). The FlipCard and IntroOverlay components SHALL be children of `IntroProvider` but siblings of `AppContent`, so they render at the same DOM level as the main content (not nested inside it).

```
App
└── PersistQueryClientProvider
    └── LanguageProvider
        └── IntroProvider
            ├── AppContent (contains Navbar, Hero, sections)
            ├── FlipCard (fixed position, reads context)
            └── IntroOverlay (fixed position, reads context)
```

#### Scenario: Context is accessible to all components
- **WHEN** a component inside `AppContent` (e.g., Hero, Navbar) calls `useIntro()`
- **THEN** it SHALL receive the context values
- **AND** components outside `IntroProvider` SHALL NOT have access (nor need it)

#### Scenario: FlipCard and IntroOverlay are siblings of AppContent
- **WHEN** the app renders
- **THEN** FlipCard and IntroOverlay SHALL be in the same parent as AppContent (inside IntroProvider)
- **AND** they SHALL NOT be nested inside the scrollable content area
