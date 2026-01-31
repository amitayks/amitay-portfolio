## 1. HTML Meta Tags & Preconnect

- [x] 1.1 Add `<meta name="theme-color" content="#ffffff">` to index.html
- [x] 1.2 Add `<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">` for dark mode
- [x] 1.3 Add `<link rel="preconnect" href="https://your-supabase-url.supabase.co">` (replace with actual URL)
- [x] 1.4 Add `color-scheme: light dark` to html element in CSS

## 2. Create useReducedMotion Hook

- [x] 2.1 Create `src/hooks/useReducedMotion.ts` hook that returns boolean based on `prefers-reduced-motion`
- [x] 2.2 Export hook from hooks index if exists

## 3. NavigationBar Accessibility

- [x] 3.1 Add `aria-label="Settings"` to settings button (line ~196)
- [x] 3.2 Add `aria-label` to theme toggle button ("Switch to dark mode" / "Switch to light mode")
- [x] 3.3 Add `aria-label` to mobile menu button ("Open menu" / "Close menu")
- [x] 3.4 Add `overscroll-behavior: contain` to mobile menu panel
- [x] 3.5 Add keyboard support (Escape to close) to settings dropdown

## 4. PortfolioCard Accessibility & Performance

- [x] 4.1 Add `width` and `height` attributes to portfolio card images
- [x] 4.2 Add `loading="lazy"` to portfolio card images (except first few above fold)
- [x] 4.3 Use `useReducedMotion` to disable floating animation when reduced motion preferred
- [x] 4.4 Add `aria-label` to GitHub and LiveSite icon buttons

## 5. PortfolioImage Accessibility

- [x] 5.1 Replace clickable `<div>` thumbnail with `<button>` element
- [x] 5.2 Add `width` and `height` to main image
- [x] 5.3 Add `width` and `height` to thumbnail images
- [x] 5.4 Add keyboard support for thumbnail selection

## 6. Form Improvements (Contact.tsx)

- [x] 6.1 Add `autocomplete="name"` to name input
- [x] 6.2 Add `autocomplete="email"` and `inputmode="email"` to email input
- [x] 6.3 Add `inputmode="tel"` to phone input if exists
- [x] 6.4 Add `autocomplete="off"` to message textarea

## 7. Form Improvements (Apply.tsx)

- [x] 7.1 Add `autocomplete="name"` to name input
- [x] 7.2 Add `autocomplete="email"` and `inputmode="email"` to email input
- [x] 7.3 Add `inputmode="tel"` to phone input
- [x] 7.4 Add `autocomplete="off"` to project textarea

## 8. Global CSS Utilities

- [x] 8.1 Add `touch-action: manipulation` to buttons and interactive elements in global CSS
- [x] 8.2 Add reduced motion media query utilities to Tailwind config or global CSS
- [x] 8.3 Ensure all focusable elements have visible focus states

## 9. Verification

- [x] 9.1 Run build to ensure no errors
- [ ] 9.2 Test with screen reader (VoiceOver or similar)
- [ ] 9.3 Test with `prefers-reduced-motion` enabled in browser
- [ ] 9.4 Check Lighthouse accessibility score
- [ ] 9.5 Verify no CLS issues with images
