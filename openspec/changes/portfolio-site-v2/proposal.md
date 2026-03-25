## Why

The current portfolio site (old-site) needs a complete visual and architectural rebuild. The design feels dated and doesn't reflect the caliber of work being showcased. A new dark, premium design system ("liquid glass" morphism) will create a site that matches the quality of the products being presented — while moving all content to Supabase for full CMS-like control and bilingual support without frontend JSON files.

## What Changes

- **Complete frontend rebuild** from scratch using React + Vite + TypeScript + Tailwind + shadcn/ui with a dark premium liquid-glass design system
- **Single-page architecture** replacing the old multi-page React Router setup. Projects open in full-screen overlay modals instead of separate routes
- **Infinite auto-scrolling carousels** replacing the static project grid. Two carousels scrolling in opposite directions (code → right, woodwork → left) create a distinctive, memorable browsing experience
- **Supabase-driven i18n** replacing i18next JSON files. All site text (UI chrome + portfolio content) served from Supabase with aggressive React Query caching and IndexedDB persistence
- **New `site_content` table** in Supabase for all translatable UI strings
- **`lang` column added to `portfolio` table** with duplicate rows per language instead of separate translation files
- **BREAKING**: Removal of React Router, i18next, and all old-site component architecture
- **BREAKING**: Portfolio table schema change (new `lang` column, `settings.dir` becomes implicit)

## Capabilities

### New Capabilities
- `liquid-glass-design-system`: Core CSS design system — liquid glass effects, fonts (Instrument Serif + Barlow), CSS variables, skeleton loading states, HLS video backgrounds
- `infinite-carousel`: Edge-to-edge infinite auto-scrolling carousel engine with opposite-direction support, drag/swipe interaction, momentum decay, and resume behavior
- `project-overlay-modal`: Full-screen overlay modal for viewing project details — image gallery, markdown descriptions, technology badges, external links. Triggered from carousel cards
- `supabase-i18n`: Supabase-driven internationalization — `site_content` table, `useSiteText()` hook, `LanguageContext` provider, language toggle. Replaces i18next entirely
- `portfolio-data-layer`: React Query data fetching with IndexedDB persistence — portfolio queries filtered by lang + projectType, image signed URLs, aggressive caching strategy
- `contact-form`: Contact section with React Hook Form + Zod validation + EmailJS submission. Fields: name, email, subject, message
- `site-sections`: All page sections — Hero, Products Bar, About, Skills Grid, Stats, Testimonials, Contact/CTA, Footer. Each consumes `useSiteText()` for content

### Modified Capabilities
(No existing specs to modify — this is a greenfield build in a new directory)

## Impact

- **Supabase**: New `site_content` table created. `portfolio` table gains `lang` column + duplicate rows per language. RLS policies updated.
- **Dependencies**: Adds hls.js, motion (framer-motion). Removes react-router-dom, i18next ecosystem, date-fns, gh-pages.
- **Old site**: Remains untouched. New site is built independently in `/new-site/`.
- **Deployment**: TBD — new site will need its own hosting setup.
- **Data migration**: Existing portfolio rows need duplication for Hebrew translations.
