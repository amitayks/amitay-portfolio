## Context

The portfolio site uses React 18, Tailwind CSS, and Framer Motion for animations. It's a client-side rendered SPA with React Router. The site fetches data from Supabase and displays portfolio items with images.

Current issues identified:
- Icon buttons lack accessible names
- Images don't have dimensions causing layout shifts
- No reduced motion support for users who prefer less animation
- Forms lack proper autocomplete and inputmode attributes
- Mobile menu doesn't prevent overscroll

## Goals / Non-Goals

**Goals:**
- Pass WCAG 2.1 AA for interactive elements
- Eliminate Cumulative Layout Shift from images
- Respect `prefers-reduced-motion` user preference
- Improve Core Web Vitals (LCP, CLS)
- Add proper form accessibility

**Non-Goals:**
- Full WCAG AAA compliance
- Changing visual design or branding
- Adding new features
- Refactoring component architecture

## Decisions

### Decision: Use aria-label for icon buttons
- Rationale: Simplest solution for icon-only buttons
- Alternative: Using visually hidden text - rejected as more complex for this use case

### Decision: Add dimensions via Tailwind classes
- Rationale: Already using Tailwind, consistent with codebase
- Alternative: Inline width/height attributes - acceptable fallback for `<img>` elements

### Decision: CSS media query for reduced motion
- Rationale: Global solution via Tailwind's `motion-reduce:` variant
- Alternative: JavaScript check - useful for Framer Motion, will use both

### Decision: Keep animations, just reduce them
- Rationale: Animations are part of brand identity, so reduce rather than disable
- Alternative: Completely disable - rejected as too aggressive

### Decision: Add preconnect in index.html
- Rationale: Earliest possible connection for Supabase
- Alternative: Dynamic injection - too late for initial load

## Risks / Trade-offs

**Risk: Framer Motion doesn't natively support reduced motion**
- Mitigation: Wrap animations in a hook that checks `prefers-reduced-motion` and returns minimal variants

**Risk: Image dimensions may not match all dynamic images**
- Mitigation: Use aspect ratio containers with Tailwind's aspect-* utilities

**Risk: Form autocomplete may conflict with custom styling**
- Mitigation: Test across browsers, use `appearance-none` where needed

## Implementation Approach

1. **index.html changes** - Add meta tags, preconnect links
2. **Global CSS** - Add reduced-motion utilities, touch-action
3. **NavigationBar** - Add aria-labels, keyboard support, overscroll
4. **PortfolioCard/Image** - Add dimensions, lazy loading, aria
5. **Forms** - Add autocomplete, inputmode attributes
6. **Animation hook** - Create useReducedMotion hook for Framer Motion
