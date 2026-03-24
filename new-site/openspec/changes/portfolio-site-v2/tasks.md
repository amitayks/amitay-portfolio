## 1. Project Scaffolding

- [x] 1.1 Initialize Vite + React + TypeScript project in `new-site/` (or use existing empty dir) with `npm create vite@latest . -- --template react-ts`
- [x] 1.2 Install core dependencies: tailwindcss, postcss, autoprefixer, tailwindcss-animate, @radix-ui/react-dialog, @radix-ui/react-slot, lucide-react, class-variance-authority, clsx, tailwind-merge
- [x] 1.3 Install animation + data dependencies: motion (framer-motion), @tanstack/react-query, @tanstack/react-query-persist-client, idb-keyval, @supabase/supabase-js, hls.js
- [x] 1.4 Install form + utility dependencies: react-hook-form, zod, @hookform/resolvers, @emailjs/browser, marked
- [x] 1.5 Install dev dependencies: @biomejs/biome
- [x] 1.6 Configure `tailwind.config.js` — extend fontFamily (heading, body), add custom colors, configure content paths
- [x] 1.7 Configure `postcss.config.js` with tailwindcss and autoprefixer
- [x] 1.8 Configure `tsconfig.json` with path aliases (`@/` → `src/`)
- [x] 1.9 Configure `vite.config.ts` with React plugin and path alias resolution
- [x] 1.10 Configure `biome.json` for linting and formatting
- [x] 1.11 Set up file structure: `src/{components,components/ui,sections,hooks,services,contexts,lib,types,constants}`

## 2. Design System Foundation

- [x] 2.1 Create `src/index.css` — Google Fonts import (Instrument Serif italic, Barlow 300/400/500/600), CSS variables (--background, --foreground, --primary, --border, --radius, --font-heading, --font-body), Tailwind directives
- [x] 2.2 Add liquid-glass CSS classes in `@layer components` — `.liquid-glass` with ::before gradient border mask, `.liquid-glass-strong` with stronger blur/shadow
- [x] 2.3 Add shimmer skeleton animation keyframes (`@keyframes shimmer`) in index.css
- [x] 2.4 Create `src/lib/utils.ts` — `cn()` helper combining clsx + tailwind-merge
- [x] 2.5 Initialize shadcn/ui — create `components.json`, add Button component, add Input component, add Textarea component, add Dialog component (Radix-based)
- [x] 2.6 Create `src/components/LiquidSkeleton.tsx` — skeleton loading component with liquid-glass background + shimmer animation, supporting text/image/card shape variants
- [x] 2.7 Create `src/components/SectionBadge.tsx` — reusable badge with liquid-glass pill styling
- [x] 2.8 Create `src/components/SectionHeading.tsx` — reusable heading with responsive sizing and heading font

## 3. Video & Animation Components

- [x] 3.1 Create `src/components/HlsVideo.tsx` — HLS video player component: hls.js for MSE browsers, native fallback for Safari, accepts `src`, `className`, `desaturate` props. Includes autoplay/loop/muted/playsInline attributes
- [x] 3.2 Create video fade overlay component/utility — top + bottom 200px gradient fades (black ↔ transparent) as absolute positioned divs
- [x] 3.3 Create `src/components/BlurText.tsx` — word-by-word blur-in animation using motion/react + IntersectionObserver. Props: text, className, delay. Blur: 10px→5px→0px, opacity: 0→0.5→1, y: 50→-5→0, step 0.35s, 100ms delay per word
- [x] 3.4 Add reduced motion support — `useReducedMotion()` hook from framer-motion, disable auto-scroll and blur animations when active

## 4. Supabase Services

- [x] 4.1 Create `src/services/supabase.ts` — initialize Supabase client with existing URL and anon key
- [x] 4.2 Create `src/services/apiContent.ts` — `fetchSiteContent(lang)` function that queries `site_content` table filtered by lang, returns `Record<string, string>` key-value map
- [x] 4.3 Create `src/services/apiPortfolio.ts` — `getPortfolio(lang, projectType?)` and `getPortfolioById(SKU, lang)` functions with proper select/filter/order
- [x] 4.4 Create `src/services/apiImages.ts` — `getSiteImage(imageName)` and `getPortfolioImage(imageName)` functions generating 100-day signed URLs from Supabase Storage

## 5. Data Layer & Caching

- [x] 5.1 Create `src/lib/queryClient.ts` — React Query client with retry:2, refetchOnWindowFocus:true, refetchOnReconnect:'always', gcTime:30 days
- [x] 5.2 Set up IndexedDB persister in queryClient.ts — using idb-keyval with key 'portfolio-v2-cache', 30-day max age
- [x] 5.3 Create `src/types/portfolio.ts` — PortfolioItem interface with lang field, updated settings (no dir), all existing fields
- [x] 5.4 Create `src/types/content.ts` — SiteContentMap type (`Record<string, string>`), Language type ('en' | 'he')
- [x] 5.5 Create `src/hooks/usePortfolioItems.ts` — React Query hook for portfolio list, filtered by lang + projectType, staleTime:0
- [x] 5.6 Create `src/hooks/usePortfolioItem.ts` — React Query hook for single item by SKU + lang, staleTime:1 hour
- [x] 5.7 Create `src/hooks/usePortfolioImage.ts` — React Query hook for image signed URL, staleTime:14 days
- [x] 5.8 Create `src/hooks/useSiteImage.ts` — React Query hook for site image signed URL, staleTime:14 days

## 6. i18n System

- [x] 6.1 Create `src/contexts/LanguageContext.tsx` — LanguageProvider with lang state ('en'|'he'), setLang, dir ('ltr'|'rtl'), persists to localStorage key 'portfolio-lang', updates `<html>` lang + dir attributes
- [x] 6.2 Create `src/hooks/useLanguage.ts` — convenience hook that returns `{ lang, setLang, dir }` from LanguageContext
- [x] 6.3 Create `src/hooks/useSiteText.ts` — fetches site_content for current lang via React Query (staleTime:24h), returns `t(key, fallback?)` function and `isLoading` state
- [x] 6.4 Create `src/components/LanguageToggle.tsx` — small toggle button switching between en/he, updates language context

## 7. Constants & Config

- [x] 7.1 Create `src/constants/personal.ts` — PERSONAL_INFO (name, email, phone, social URLs), EMAILJS_CONFIG (service/template/user IDs), SOCIAL_LINKS array
- [x] 7.2 Place resume PDF in `public/Amitay_Keisar_Resume.pdf` for direct download

## 8. App Shell

- [x] 8.1 Create `src/App.tsx` — wrap with QueryClientProvider + PersistQueryClientProvider + LanguageProvider, render all sections in order
- [x] 8.2 Create `src/main.tsx` — render App into root with StrictMode
- [x] 8.3 Update `index.html` — set title, meta description, viewport, favicon, black background on body

## 9. Navbar

- [x] 9.1 Create `src/components/Navbar.tsx` — fixed navbar at top-4, z-50. Left: "AK" monogram in liquid-glass-strong circle. Center: liquid-glass pill with nav links (smooth scroll to sections). Right: language toggle + "Get in Touch" solid white button
- [x] 9.2 Implement active section detection — IntersectionObserver on each section, highlight active nav link
- [x] 9.3 Implement smooth scroll — onClick handlers that scroll to section by ID with `behavior: 'smooth'`

## 10. Hero Section

- [x] 10.1 Create `src/sections/Hero.tsx` — 1000px height container, background video (template URL), overlay gradients
- [x] 10.2 Add hero badge pill — liquid-glass rounded-full with "New" tag + badge text from `useSiteText()`
- [x] 10.3 Add BlurText heading — two-line heading "I ship products, / not prototypes." from `useSiteText()`
- [x] 10.4 Add subtext — motion.p with blur fade-in at 0.8s delay, text from `useSiteText()`
- [x] 10.5 Add CTA buttons — motion.div at 1.1s delay, "See My Work" (glass, scrolls to carousel) + "Get in Touch" (text-only, scrolls to contact)

## 11. Products Bar Section

- [x] 11.1 Create `src/sections/ProductsBar.tsx` — centered section with badge "Currently shipping" + horizontal row of product names in italic serif (Addit, Muse, AgentMesh, Visara) from `useSiteText()`

## 12. Infinite Carousel Engine

- [x] 12.1 Create `src/components/InfiniteCarousel.tsx` — core carousel component. Props: items, direction ('left'|'right'), renderCard. Duplicates items 3x for seamless loop
- [x] 12.2 Implement constant-speed auto-scroll — requestAnimationFrame loop at ~30-40px/sec, configurable via prop. Translate using framer-motion useMotionValue
- [x] 12.3 Implement infinite loop reset — detect when scroll reaches end of first item set, seamlessly reset translateX to equivalent position
- [x] 12.4 Implement hover slow-down — on mouseEnter, reduce speed to 50%; on mouseLeave, restore full speed
- [x] 12.5 Implement drag/swipe interaction — framer-motion drag="x" gesture, pause auto-scroll during drag
- [x] 12.6 Implement momentum + resume — on drag end, apply spring/decay momentum, then resume auto-scroll in original direction after momentum settles
- [x] 12.7 Create `src/components/CarouselCard.tsx` — liquid-glass rounded-2xl card with 1:1 image, bottom gradient overlay, project title + truncated description. Click handler prop. Responsive sizing (300px desktop, 240px tablet, 70-80vw mobile)
- [x] 12.8 Implement image lazy loading in carousel cards — eager for first 6, lazy for rest, skeleton placeholder, opacity transition on load
- [x] 12.9 Implement hover prefetch on carousel cards — prefetch project detail + main image via queryClient.prefetchQuery on mouseEnter (200ms debounce)

## 13. Code Carousel Section

- [x] 13.1 Create `src/sections/CodeCarousel.tsx` — fetches Web-Development projects via usePortfolioItems, renders InfiniteCarousel with direction="right", passes CarouselCard as renderCard
- [x] 13.2 Wire up card click to open ProjectModal with selected SKU

## 14. About Section

- [x] 14.1 Create `src/sections/About.tsx` — full-width section with min-h-700px, py-32, HLS video background (template URL, desaturated)
- [x] 14.2 Add about content — badge, heading ("Self-taught. / Ship-obsessed."), body paragraphs, all from `useSiteText()`
- [x] 14.3 Add "Download Resume" CTA button — links to `/Amitay_Keisar_Resume.pdf`

## 15. Skills Grid Section

- [x] 15.1 Create `src/sections/SkillsGrid.tsx` — badge, heading, 4-column responsive grid
- [x] 15.2 Add four skill cards — Mobile (Smartphone), Backend & Infrastructure (Server), AI & Agents (Brain), Security & Protocols (Shield). All content from `useSiteText()`, icons from Lucide

## 16. Stats Section

- [x] 16.1 Create `src/sections/Stats.tsx` — HLS video background (desaturated), liquid-glass card with 2x2/4-col grid
- [x] 16.2 Add four stats — "4+" Products, "5" Languages, "1,000+" Soldiers, "0" Dependencies. Values and labels from `useSiteText()`

## 17. Wood Carousel Section

- [x] 17.1 Create `src/sections/WoodCarousel.tsx` — fetches Wood-Working projects via usePortfolioItems, renders InfiniteCarousel with direction="left". NO header/badge/label
- [x] 17.2 Wire up card click to open ProjectModal with selected SKU

## 18. Project Overlay Modal

- [x] 18.1 Create `src/components/ProjectModal.tsx` — full-screen overlay using Radix Dialog. Backdrop: blur(20px) + bg-black/60. Panel: liquid-glass-strong, rounded-t-3xl, max-h-90vh, overflow-y-auto, max-w-4xl centered
- [x] 18.2 Implement open animation — slide up from bottom (y: 100vh → 0) + fade in, 0.4s, ease-out via framer-motion
- [x] 18.3 Implement close animation — slide down (y: 0 → 100vh) + fade out, 0.3s
- [x] 18.4 Implement close triggers — X button top-right, backdrop click, Escape key
- [x] 18.5 Implement body scroll lock — overflow:hidden on body when modal open
- [ ] 18.6 Implement focus trap — tab cycling within modal, focus returns to trigger on close
- [x] 18.7 Create `src/components/ProjectImageGallery.tsx` — main image (1:1 aspect) + thumbnail grid (up to 4 from imagePack). Click/keyboard to swap main image. Images fetched via usePortfolioImage
- [x] 18.8 Add project content layout — title, description, longDescription (markdown via marked), technologies as liquid-glass pills, additional info table (liquid-glass), external link buttons
- [x] 18.9 Add external link buttons — "Visit Live Site" and "View on GitHub" (conditionally rendered), open in new tab
- [x] 18.10 Wire modal to carousel — receive SKU prop, fetch data via usePortfolioItem, show skeleton while loading

## 19. Testimonials Section

- [x] 19.1 Create `src/sections/Testimonials.tsx` — conditionally rendered (only if testimonial data exists). Badge, heading, 3-column grid of quote cards
- [ ] 19.2 Define testimonials data structure — either in site_content as JSON or as separate Supabase table (TBD when user provides quotes)

## 20. Contact Section

- [x] 20.1 Create `src/sections/Contact.tsx` — HLS video background, heading "Let's build something.", subtext
- [x] 20.2 Create `src/components/ContactForm.tsx` — React Hook Form + Zod schema (name, email, subject, message — all required). Dark-themed liquid-glass inputs
- [x] 20.3 Implement EmailJS submission — submit handler using @emailjs/browser with existing config, loading state on submit button
- [x] 20.4 Implement success state — form fades out, animated checkmark + success message in liquid-glass card
- [x] 20.5 Implement error state — inline error message below submit button, red-tinted
- [x] 20.6 Add social links row — GitHub, LinkedIn, X, Instagram, WhatsApp, Email as liquid-glass-strong icon buttons with links from PERSONAL_INFO
- [x] 20.7 Add resume download link below social links
- [x] 20.8 Connect all form labels/placeholders/messages to `useSiteText()` for translation support

## 21. Footer Section

- [x] 21.1 Create `src/sections/Footer.tsx` — border-t, copyright text, Privacy/Terms/Contact links, all from `useSiteText()`

## 22. Supabase Data Setup

- [x] 22.1 Create `site_content` table in Supabase — schema: id, key, lang, value, created_at, unique(key, lang), RLS with public read
- [x] 22.2 Populate `site_content` with all English content keys (hero, nav, about, skills, stats, contact, footer — full list in design.md)
- [x] 22.3 Populate `site_content` with all Hebrew content keys (translations of all English keys)
- [x] 22.4 Add `lang` column to `portfolio` table — TEXT NOT NULL DEFAULT 'en'
- [x] 22.5 Add unique constraint on `(SKU, lang)` to portfolio table
- [x] 22.6 Get existing portfolio rows from user and review/edit
- [x] 22.7 Create Hebrew duplicate rows for all existing portfolio items with translated content
- [x] 22.8 Update RLS policies on portfolio table if needed

## 23. Analytics Integration

- [ ] 23.1 Create `src/hooks/useAnalytics.ts` — Umami analytics hook with type-safe event tracking (carousel interaction, modal open, form submit, link click, language toggle, resume download)
- [ ] 23.2 Add analytics tracking calls to carousel cards, modal, contact form, social links, language toggle, resume download button

## 24. Polish & Accessibility

- [x] 24.1 Add semantic HTML throughout — nav, main, section, article, footer, proper heading hierarchy (h1 for hero, h2 for sections, h3 for cards)
- [x] 24.2 Add ARIA labels to all interactive elements — carousel cards, modal controls, form inputs, social links, nav items
- [x] 24.3 Add section id attributes for scroll targeting — id="home", id="work", id="about", id="skills", id="stats", id="contact"
- [ ] 24.4 Test and fix reduced motion behavior — verify carousels are static, animations are simple fades
- [ ] 24.5 Test RTL layout — verify Hebrew mode renders correctly with dir="rtl"
- [ ] 24.6 Performance audit — verify lazy loading, code-split modal (dynamic import), check bundle size, verify video loading is deferred
- [ ] 24.7 Mobile responsive testing — verify carousel card sizing, navbar mobile layout, form on small screens, modal on mobile
- [ ] 24.8 Cross-browser testing — Chrome, Safari (HLS native), Firefox, Edge
