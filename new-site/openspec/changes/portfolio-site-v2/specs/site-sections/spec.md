## ADDED Requirements

### Requirement: Single page layout
The entire site SHALL be a single scrollable page. There SHALL be no client-side routing. All sections render in a single component tree within `App.tsx`.

#### Scenario: Page structure
- **WHEN** the site loads
- **THEN** all sections (Hero through Footer) render on one scrollable page

### Requirement: Navbar section
A fixed navbar SHALL render at `top-4`, full-width, `z-50`. Left: logo/monogram ("AK") in a liquid-glass-strong circle (48x48). Center: liquid-glass rounded-full pill with nav links ("Home", "Work", "About", "Contact") as `text-sm font-medium text-foreground/90` that smooth-scroll to their target sections. Right: language toggle. Far right: solid `bg-white text-black rounded-full` "Get in Touch" button that scrolls to contact section.

#### Scenario: Nav link smooth scroll
- **WHEN** user clicks "Work" in the navbar
- **THEN** the page smooth-scrolls to the code carousel section

#### Scenario: Active section highlighting
- **WHEN** the user scrolls to the About section
- **THEN** the "About" nav link is visually highlighted as active (determined via IntersectionObserver)

### Requirement: Hero section
The hero SHALL be 1000px tall with a background video (from template), overlay gradients, and centered content. Content: badge pill with "Building Addit, Muse & AgentMesh", BlurText heading "I ship products, not prototypes.", subtext paragraph (motion.p with blur fade at 0.8s delay), and two CTA buttons (motion.div at 1.1s delay): "See My Work" (liquid-glass-strong, scrolls to code carousel) and "Get in Touch" (text-only, scrolls to contact).

#### Scenario: Hero renders with animation
- **WHEN** the page loads
- **THEN** the hero heading animates word-by-word with blur effect, subtext fades in, then CTA buttons appear

#### Scenario: Hero CTA scrolls to section
- **WHEN** user clicks "See My Work"
- **THEN** the page smooth-scrolls to the code carousel section

### Requirement: Products bar section
Below the hero, a centered section SHALL display a badge "Currently shipping" and a horizontal row of product names: "Addit", "Muse", "AgentMesh", "Visara" in `text-2xl md:text-3xl font-heading italic text-white` with `gap-12`.

#### Scenario: Products bar content
- **WHEN** the products bar renders
- **THEN** four product names appear horizontally in italic serif font

### Requirement: Code carousel section
After the products bar, a full-width infinite carousel SHALL display all `Web-Development` projects, auto-scrolling to the right. Uses the `InfiniteCarousel` component with `direction="right"`.

#### Scenario: Code projects displayed
- **WHEN** the code carousel section renders
- **THEN** web development projects scroll continuously to the right in 1:1 image cards

### Requirement: About section
A full-width section with min-height 700px, `py-32`, and an HLS video background (from template, desaturated). Content: badge "About", heading "Self-taught. Ship-obsessed." (two lines), body text (3 paragraphs about self-teaching journey, shipping products, and 8200 background), and a "Download Resume" CTA button that downloads the resume PDF.

#### Scenario: Resume download
- **WHEN** user clicks "Download Resume"
- **THEN** the resume PDF file downloads (or opens in new tab)

#### Scenario: About content from Supabase
- **WHEN** the about section renders
- **THEN** all text is sourced from `useSiteText()` with `about.*` keys

### Requirement: Skills grid section
A section with `py-24` displaying badge "What I Do", heading "The full stack. For real.", and a 4-column grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`) of liquid-glass cards. Cards: (1) Mobile — Smartphone icon, (2) Backend & Infrastructure — Server icon, (3) AI & Agents — Brain icon, (4) Security & Protocols — Shield icon. Each card has an icon in a liquid-glass-strong circle, title in heading font, and description in body font.

#### Scenario: Skills grid responsive layout
- **WHEN** viewport is mobile
- **THEN** skills cards stack in a single column

#### Scenario: Skills grid desktop layout
- **WHEN** viewport is desktop (lg+)
- **THEN** all four skills cards appear in a single row

### Requirement: Stats section
A section with an HLS video background (desaturated, from template), top + bottom black fades. Content: a liquid-glass `rounded-3xl` card with `p-12 md:p-16`, `grid grid-cols-2 lg:grid-cols-4 gap-8 text-center`. Stats: "4+" / "Products in production", "5" / "Languages", "1,000+" / "Soldiers supported (8200)", "0" / "Runtime dependencies (Muse)". Values in heading font `text-4xl md:text-5xl lg:text-6xl`, labels in body font `text-white/60`.

#### Scenario: Stats render from Supabase
- **WHEN** the stats section renders
- **THEN** stat values and labels are sourced from `useSiteText()` with `stats.*` keys

### Requirement: Wood carousel section
After stats, a full-width infinite carousel SHALL display all `Wood-Working` projects, auto-scrolling to the LEFT (opposite of code carousel). There SHALL be NO section header, badge, or label — the carousel appears unexpectedly.

#### Scenario: Surprise woodwork carousel
- **WHEN** user scrolls past the stats section
- **THEN** a carousel of woodworking projects appears with no introduction, scrolling left

### Requirement: Testimonials section
A section with badge "What They Say", heading "Don't take our word for it.", and a 3-column grid of liquid-glass cards. Each card: quote in `text-white/80 font-body font-light text-sm italic`, name in `text-white font-body font-medium text-sm`, role in `text-white/50 font-body font-light text-xs`. This section SHALL be conditionally rendered — if no testimonial data exists in Supabase, the section SHALL not render.

#### Scenario: No testimonials available
- **WHEN** no testimonial data exists in the database
- **THEN** the testimonials section is not rendered at all

#### Scenario: Testimonials display
- **WHEN** testimonial data is available
- **THEN** quotes display in a 3-column grid with glass card styling

### Requirement: Contact section
A section with an HLS video background, heading "Let's build something.", subtext, contact form (see contact-form spec), social links row (GitHub, LinkedIn, X, Instagram, WhatsApp, Email as liquid-glass-strong rounded-full icon buttons), and a "Download Resume (PDF)" text link.

#### Scenario: Social links open correctly
- **WHEN** user clicks the GitHub social link icon
- **THEN** it opens `https://github.com/amitayks` in a new tab

### Requirement: Footer section
A footer with `mt-32 pt-8 border-t border-white/10`. Left: copyright text "© 2026 Amitay Keisar". Right: links (Privacy, Terms, Contact) in `text-white/40 text-xs font-body`.

#### Scenario: Footer renders
- **WHEN** the page is scrolled to the bottom
- **THEN** the footer appears with copyright and legal links

### Requirement: Smooth scroll navigation
All internal navigation (navbar links, CTA buttons) SHALL use smooth scrolling (`behavior: 'smooth'`) to target sections. Each section SHALL have an `id` attribute for scroll targeting.

#### Scenario: Smooth scroll to section
- **WHEN** user clicks "About" in the navbar
- **THEN** the page smoothly scrolls to the about section over ~500ms

### Requirement: Accessibility
The site SHALL use semantic HTML (nav, main, section, article, footer, h1-h3). All interactive elements SHALL have ARIA labels. The `<html>` element SHALL have `lang` and `dir` attributes matching the current language. Color contrast SHALL meet WCAG AA standards (white on black exceeds this).

#### Scenario: Screen reader navigation
- **WHEN** a screen reader user navigates the page
- **THEN** sections are announced by their semantic roles and headings provide clear structure
