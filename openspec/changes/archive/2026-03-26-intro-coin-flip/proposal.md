## Why

The portfolio site currently loads directly into the Hero section with no introduction ceremony. The AnimatedLogo plays in a small 16×32px container in the navbar — easy to miss. There is no moment that says "you've arrived." A cinematic entrance sequence transforms the first impression from "a page loaded" into "an experience began." This establishes Amitay's brand identity (the Keisar logo) and personal identity (profile photo) before a single line of content is read.

## What Changes

- **New full-screen intro overlay** that plays on every site load/reload, blocking all page content until complete
- **Large-scale AnimatedLogo assembly** plays inside a centered 2:3 liquid-glass card with a subtle shader background
- **Coin-flip flight animation** — the card tumbles (X-axis, 4–6 full rotations) from screen center to the navbar icon position, shrinking and morphing from a rounded rectangle to a circle
- **Dual-face card** — the card has a front (logo + shader) and back (profile photo); the profile is revealed during the tumbling and the card lands on the profile side, then does one final deliberate flip back to the logo
- **Navbar icon becomes interactive flip card** — hover flips to reveal profile photo (X-axis); click expands the card back to screen center showing the full 1:1 profile photo with the same coin-flip animation
- **Hero and page content animations are delayed** until the intro overlay completes, so animations don't play invisibly behind the overlay
- **Scroll is locked** during the intro sequence

## Capabilities

### New Capabilities
- `flip-card`: The dual-face 3D card primitive — front (AnimatedLogo + shader) and back (profile photo). Handles CSS 3D transforms, backface visibility, and controlled rotation on the X-axis. Used at both large (intro) and small (navbar) scales.
- `intro-overlay`: The full-screen cinematic entrance sequence — overlay with subtle shader background, card fade-in, logo assembly, coin-flip flight to navbar, landing sequence, and overlay dismissal.
- `navbar-card-interactions`: Hover-flip and click-to-expand behavior for the navbar icon after the intro settles. Includes the reverse FLIP animation (navbar → center screen) for the full profile view.
- `intro-timing-gate`: Coordination mechanism that delays Hero animations, navbar appearance, and page interactivity until the intro sequence completes.

### Modified Capabilities
_(none — no existing specs are being modified)_

## Impact

- **`src/components/AnimatedLogo.tsx`** — consumed inside the FlipCard front face; its `animate` prop and timing need to coordinate with the intro timeline
- **`src/components/Navbar.tsx`** — the logo button (line 73–79) is replaced by the FlipCard component with hover/click interactions; the FlipCard must match the current 48×48 round liquid-glass styling after the intro settles
- **`src/sections/Hero.tsx`** — BlurText and subtext animations need to be gated behind intro completion
- **`src/App.tsx`** — IntroOverlay mounts here; IntroContext provider wraps the app
- **`src/index.css`** — may need `perspective` on a parent for 3D transforms, and scroll-lock utility class
- **Dependencies** — `motion/react` (already installed), `@paper-design/shaders-react` (already installed). No new dependencies expected.
- **Supabase** — profile image fetched from `site-image` bucket via `useSiteImage()`
