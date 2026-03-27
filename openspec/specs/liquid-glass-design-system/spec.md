## ADDED Requirements

### Requirement: Pure black background
The site SHALL use `bg-black` (#000000) as the background color for the entire page. The outer page wrapper SHALL have `overflow-visible`.

#### Scenario: Page background
- **WHEN** the page loads
- **THEN** the background color is pure black (#000) with no gradient or pattern

### Requirement: Font system
The site SHALL import Google Fonts: Instrument Serif (italic) for headings and Barlow (weights 300, 400, 500, 600) for body text. Tailwind config SHALL extend `fontFamily` with `heading: ["'Instrument Serif'", "serif"]` and `body: ["'Barlow'", "sans-serif"]`.

#### Scenario: Heading typography
- **WHEN** any heading element renders
- **THEN** it uses `font-heading italic text-white tracking-tight leading-[0.9]`

#### Scenario: Body typography
- **WHEN** any body text renders
- **THEN** it uses `font-body font-light text-white/60 text-sm`

### Requirement: CSS variables
The site SHALL define CSS custom properties on `:root` in `index.css`: `--background: 213 45% 67%`, `--foreground: 0 0% 100%`, `--primary: 0 0% 100%`, `--primary-foreground: 213 45% 67%`, `--border: 0 0% 100% / 0.2`, `--radius: 9999px`, `--font-heading`, `--font-body`.

#### Scenario: CSS variables available
- **WHEN** any component references a CSS variable (e.g., `hsl(var(--foreground))`)
- **THEN** the variable resolves to the defined value

### Requirement: Liquid glass subtle variant
The `.liquid-glass` CSS class SHALL apply: `background: rgba(255,255,255,0.01)`, `background-blend-mode: luminosity`, `backdrop-filter: blur(4px)`, `border: none`, `box-shadow: inset 0 1px 1px rgba(255,255,255,0.1)`, `position: relative`, `overflow: hidden`, `contain: content`. It SHALL include a `::before` pseudo-element with a gradient border mask using `-webkit-mask-composite: xor` / `mask-composite: exclude`.

#### Scenario: Subtle glass effect renders
- **WHEN** an element has `.liquid-glass` class
- **THEN** it displays a subtle frosted glass effect with a thin gradient border visible at top and bottom edges

#### Scenario: Subtle glass compositing isolation
- **WHEN** an element has `.liquid-glass` class
- **THEN** it has `contain: content` set, isolating its paint and layout from surrounding elements

### Requirement: Liquid glass strong variant
The `.liquid-glass-strong` CSS class SHALL apply: `background: rgba(255,255,255,0.02)`, `background-blend-mode: luminosity`, `backdrop-filter: blur(20px)`, `border: none`, `box-shadow: 4px 4px 4px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.15)`, `position: relative`, `overflow: hidden`, `contain: content`. It SHALL include a `::before` pseudo-element with a gradient border mask using `-webkit-mask-composite: xor` / `mask-composite: exclude`.

#### Scenario: Strong glass effect renders
- **WHEN** an element has `.liquid-glass-strong` class
- **THEN** it displays a frosted glass effect with `backdrop-filter: blur(20px)` and stronger border visibility

#### Scenario: Strong glass compositing isolation
- **WHEN** an element has `.liquid-glass-strong` class
- **THEN** it has `contain: content` set, isolating its paint and layout from surrounding elements

### Requirement: Section badge pattern
All section badges SHALL use: `liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body inline-block mb-4`.

#### Scenario: Badge styling consistency
- **WHEN** any section renders its badge
- **THEN** it appears as a small pill-shaped glass element with white text

### Requirement: Section heading pattern
All section headings SHALL use: `text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]`.

#### Scenario: Heading sizing responsive
- **WHEN** the viewport is desktop (lg)
- **THEN** section headings render at `text-6xl` with italic serif font

### Requirement: Button pattern
All buttons SHALL use `font-body` with `rounded-full`. Primary CTAs SHALL use `liquid-glass-strong rounded-full`. Solid CTAs SHALL use `bg-white text-black rounded-full`.

#### Scenario: Glass button styling
- **WHEN** a primary CTA button renders
- **THEN** it has the liquid-glass-strong effect with fully rounded corners

### Requirement: Liquid glass skeleton loading
Loading states SHALL render as liquid-glass background shapes with an animated shimmer effect: a gradient sliding left-to-right (`background-size: 200% 100%`, `animation: shimmer 1.5s infinite`). Skeleton shapes SHALL match the content they replace (rounded bars for text, aspect-square blocks for images, full card shapes for cards).

#### Scenario: Skeleton displays while data loads
- **WHEN** Supabase data is not yet available (first visit, no cache)
- **THEN** liquid-glass skeleton shapes with shimmer animation appear in place of content

#### Scenario: Skeleton transitions to content
- **WHEN** data arrives from Supabase
- **THEN** skeletons are replaced by actual content with no layout shift

### Requirement: HLS video background component
A reusable `HlsVideo` component SHALL play HLS video streams using `hls.js` with Safari native fallback (`canPlayType`). Videos SHALL have attributes: `autoplay`, `loop`, `muted`, `playsInline`. Video sections SHALL include top and bottom fade overlays (200px height, `linear-gradient` from black to transparent and vice versa).

#### Scenario: HLS video plays in Chrome
- **WHEN** the browser supports MSE (Chrome, Firefox, Edge)
- **THEN** hls.js loads and plays the HLS stream

#### Scenario: HLS video plays in Safari
- **WHEN** the browser natively supports HLS (Safari)
- **THEN** the video element plays the HLS stream natively without hls.js

#### Scenario: Video fade overlays
- **WHEN** a video background section renders
- **THEN** the top and bottom 200px of the video fade to black, blending with adjacent sections

### Requirement: BlurText animation component
A `BlurText` component SHALL split text by words and animate each word via IntersectionObserver: `filter: blur(10px) → blur(5px) → blur(0px)`, `opacity: 0 → 0.5 → 1`, `y: 50 → -5 → 0`. Step duration SHALL be `0.35s` with 100ms delay per word. Implementation SHALL use `motion/react` (framer-motion).

#### Scenario: Hero heading animates on scroll into view
- **WHEN** the hero heading enters the viewport
- **THEN** each word animates from blurry/transparent/below to clear/opaque/in-place sequentially

### Requirement: Reduced motion support
When `prefers-reduced-motion` is enabled, the site SHALL disable carousel auto-scroll, disable BlurText word-by-word animation (use simple fade-in instead), and reduce all motion transitions to simple opacity fades.

#### Scenario: Reduced motion preference respected
- **WHEN** the user has `prefers-reduced-motion: reduce` set in their OS
- **THEN** carousels are static (manual scroll only), text appears with simple fade, and no continuous animations run
