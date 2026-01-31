## Why

The portfolio site has accessibility gaps, performance issues, and missing web standards that impact user experience and SEO. An audit against Vercel React Best Practices and Web Interface Guidelines revealed issues across accessibility, performance, forms, and animations that need addressing.

## What Changes

### Accessibility
- Add `aria-label` to all icon-only buttons (NavigationBar, PortfolioCard)
- Add explicit `width` and `height` to all images (prevents CLS)
- Replace clickable `<div>` elements with proper `<button>` elements
- Add keyboard navigation support to settings dropdown

### Performance & Meta
- Add `<meta name="theme-color">` for mobile browser theming
- Add `<link rel="preconnect">` for Supabase and CDN domains
- Add `loading="lazy"` to below-fold images
- Add `prefers-reduced-motion` media query support for animations

### Forms
- Add `autocomplete` attributes to Contact and Apply form inputs
- Add proper `inputmode` attributes for email, phone fields
- Add visible focus states to all interactive elements

### Animation
- Honor `prefers-reduced-motion` preference
- Add `overscroll-behavior: contain` to mobile menu
- Add `touch-action: manipulation` to interactive elements

## Capabilities

### New Capabilities

- `accessibility-standards`: WCAG-compliant accessibility patterns
- `performance-optimization`: Core Web Vitals improvements
- `animation-preferences`: Respecting user motion preferences

### Modified Capabilities

None (no existing specs)

## Impact

- Affected code: NavigationBar.tsx, PortfolioCard.tsx, PortfolioImage.tsx, Contact.tsx, Apply.tsx, index.html, global CSS
- Affected systems: All interactive components, image loading, form submissions
- Risk: Low - additive changes that improve standards compliance
- User experience: Better accessibility, faster loading, respects user preferences
