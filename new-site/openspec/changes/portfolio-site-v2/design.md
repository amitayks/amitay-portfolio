# Portfolio Site V2 — Complete Implementation Guide

## Overview

A single-page portfolio site for **Amitay Keisar** — full-stack developer and product builder. Built from scratch using the "liquid glass" dark premium design system, with all content served from Supabase.

**What this is NOT**: A copy of the old site. The old site's design, layout, routing, and component architecture are not carried over. Only the Supabase backend (data, images, auth keys) and EmailJS config are reused.

**What this IS**: A completely new build using the dark/premium design template from `instructions.md`, adapted to be a personal portfolio with custom sections (infinite carousels, full-screen overlay modals, Supabase-driven i18n).

---

## Tech Stack

### Dependencies (install fresh)

| Category | Package | Version | Purpose |
|----------|---------|---------|---------|
| Framework | `react` | ^18.3 | UI framework |
| Framework | `react-dom` | ^18.3 | DOM renderer |
| Build | `vite` | ^6.x | Bundler |
| Build | `@vitejs/plugin-react` | latest | React JSX transform |
| Language | `typescript` | ^5.5 | Type safety |
| Styling | `tailwindcss` | ^3.4 | Utility CSS |
| Styling | `postcss` + `autoprefixer` | latest | CSS processing |
| Styling | `tailwindcss-animate` | ^1.0 | Animation utilities |
| UI | `@radix-ui/react-dialog` | latest | Modal overlay primitive |
| UI | `@radix-ui/react-slot` | latest | shadcn component slot |
| UI | `lucide-react` | ^0.344 | Icon library |
| UI | `class-variance-authority` | ^0.7 | Component variant system |
| UI | `clsx` + `tailwind-merge` | latest | ClassName utilities |
| Animation | `motion` (framer-motion) | ^12.x | Animations & gestures |
| Data | `@tanstack/react-query` | ^5.67 | Data fetching + cache |
| Data | `@tanstack/react-query-persist-client` | ^5.90 | IndexedDB cache persistence |
| Data | `idb-keyval` | ^6.2 | IndexedDB wrapper |
| Backend | `@supabase/supabase-js` | ^2.49 | Supabase client |
| Video | `hls.js` | latest | HLS video streaming |
| Forms | `react-hook-form` | ^7.65 | Form state management |
| Forms | `zod` | ^4.1 | Validation schemas |
| Forms | `@hookform/resolvers` | ^5.2 | Zod resolver for RHF |
| Email | `@emailjs/browser` | ^4.4 | Contact form email |
| Markdown | `marked` | ^16.3 | Render project longDescription |
| Lint | `@biomejs/biome` | ^2.0 | Linter + formatter |

### NOT included (removed from old site)

- `react-router-dom` — single page, no routing
- `i18next` / `react-i18next` / `i18next-browser-languagedetector` — replaced by Supabase-driven i18n
- `date-fns` — not needed
- `gh-pages` — deployment TBD

---

## Design System (from instructions.md template)

### Fonts

Google Fonts import:
- **Instrument Serif** (italic) — all headings
- **Barlow** (weights: 300, 400, 500, 600) — all body text

Tailwind config — extend `fontFamily`:
```
heading: ["'Instrument Serif'", "serif"]
body: ["'Barlow'", "sans-serif"]
```

### CSS Variables (`:root` in `index.css`)

```css
:root {
  --background: 213 45% 67%;
  --foreground: 0 0% 100%;
  --primary: 0 0% 100%;
  --primary-foreground: 213 45% 67%;
  --border: 0 0% 100% / 0.2;
  --radius: 9999px;
  --font-heading: 'Instrument Serif', serif;
  --font-body: 'Barlow', sans-serif;
}
```

### Liquid Glass CSS (in `@layer components`)

#### `.liquid-glass` (subtle variant)
```css
.liquid-glass {
  background: rgba(255, 255, 255, 0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  border: none;
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.liquid-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.4px;
  background: linear-gradient(180deg,
    rgba(255,255,255,0.45) 0%,
    rgba(255,255,255,0.15) 20%,
    rgba(255,255,255,0) 40%,
    rgba(255,255,255,0) 60%,
    rgba(255,255,255,0.15) 80%,
    rgba(255,255,255,0.45) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

#### `.liquid-glass-strong` (more visible variant)
Same structure but:
- `backdrop-filter: blur(50px)`
- `box-shadow: 4px 4px 4px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.15)`
- Gradient opacities: 0.5 / 0.2 (slightly higher)

### Universal Patterns

| Element | Classes |
|---------|---------|
| Section badges | `liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body inline-block mb-4` |
| Section headings | `text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]` |
| Body text | `font-body font-light text-white/60 text-sm` |
| Buttons | `font-body rounded-full` |
| Page wrapper | `bg-black overflow-visible` |
| Video fades | `200px height, linear-gradient(to bottom/top, black, transparent)` |

### Video Backgrounds

All video sections use HLS via `hls.js` with Safari native fallback:
```typescript
if (Hls.isSupported()) {
  const hls = new Hls();
  hls.loadSource(src);
  hls.attachMedia(videoElement);
} else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
  videoElement.src = src;
}
```

Video element attributes: `autoplay`, `loop`, `muted`, `playsInline`.

Top + bottom fade overlays: absolute positioned divs, 200px height, `linear-gradient(to bottom, black, transparent)` and `linear-gradient(to top, black, transparent)`.

---

## Supabase Architecture

### Connection

Reuse existing Supabase project:
- URL: `https://qjyybkgqqadjedgelakf.supabase.co`
- Anon key: (same as old site, stored in `src/services/supabase.ts`)

### Table: `site_content` (NEW — create this)

```sql
CREATE TABLE site_content (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL,
  lang TEXT NOT NULL,       -- 'en' or 'he'
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(key, lang)
);

-- Enable RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON site_content
  FOR SELECT USING (true);
```

#### Content Keys (complete list)

```
-- Navbar
nav.home
nav.work
nav.about
nav.contact

-- Hero
hero.badge                    "Building Addit, Muse & AgentMesh"
hero.heading.line1            "I ship products,"
hero.heading.line2            "not prototypes."
hero.subtext                  "Full-stack developer across TypeScript, Kotlin, Rust & Python. I build complete products — from mobile apps to encrypted protocols to production infrastructure."
hero.cta.primary              "See My Work"
hero.cta.secondary            "Get in Touch"

-- Products Bar
products.badge                "Currently shipping"
products.items                "Addit,Muse,AgentMesh,Visara"  (comma-separated)

-- Code Carousel section (no header needed, but keeping key for potential label)
carousel.code.label           "Development"

-- About
about.badge                   "About"
about.heading.line1           "Self-taught."
about.heading.line2           "Ship-obsessed."
about.body                    "4 years ago I opened a code editor for the first time. No bootcamp. No CS degree. Just documentation, source code, and a need to build things that actually work.\n\nToday I ship full products across mobile, web, backend, and infrastructure. Every project you see here was built from nothing — designed, architected, coded, deployed, and maintained end-to-end.\n\nPreviously, I served as Head of Logistics in IDF Unit 8200, managing operations for a 1,000+ soldier technology center."
about.cta                     "Download Resume"

-- Skills Grid
skills.badge                  "What I Do"
skills.heading                "The full stack. For real."
skills.card1.title            "Mobile"
skills.card1.description      "React Native to native Kotlin. Both platforms, production-grade."
skills.card1.icon             "Smartphone"
skills.card2.title            "Backend & Infrastructure"
skills.card2.description      "Node.js, Rust, PostgreSQL, Docker, Terraform, GCP. Production-grade."
skills.card2.icon             "Server"
skills.card3.title            "AI & Agents"
skills.card3.description      "Claude SDK, MCP servers, Gemini, Deepgram. Building intelligent products."
skills.card3.icon             "Brain"
skills.card4.title            "Security & Protocols"
skills.card4.description      "E2E encryption, Signal Protocol, on-device processing, zero-trust architecture."
skills.card4.icon             "Shield"

-- Stats
stats.stat1.value             "4+"
stats.stat1.label             "Products in production"
stats.stat2.value             "5"
stats.stat2.label             "Languages"
stats.stat3.value             "1,000+"
stats.stat3.label             "Soldiers supported (8200)"
stats.stat4.value             "0"
stats.stat4.label             "Runtime dependencies (Muse)"

-- Wood Carousel section (NO label — appears unexpectedly)

-- Testimonials
testimonials.badge            "What They Say"
testimonials.heading          "Don't take our word for it."
(individual testimonials will be separate rows or a JSON array — TBD when user provides quotes)

-- Contact
contact.heading               "Let's build something."
contact.subtext               "Have a project in mind? I'd love to hear about it."
contact.cta                   "Send Message"
contact.form.name             "Name"
contact.form.email            "Email"
contact.form.subject          "Subject"
contact.form.message          "Message"
contact.form.name.placeholder       "Your name"
contact.form.email.placeholder      "your@email.com"
contact.form.subject.placeholder    "What's this about?"
contact.form.message.placeholder    "Tell me about your project..."
contact.form.success          "Message sent! I'll get back to you soon."
contact.form.error            "Something went wrong. Please try again."

-- Footer
footer.copyright              "© 2026 Amitay Keisar"
footer.privacy                "Privacy"
footer.terms                  "Terms"
footer.contact                "Contact"

-- Language toggle
lang.toggle                   "עב / EN"
```

### Table: `portfolio` (MODIFIED — add lang column)

The existing `portfolio` table needs modification:

```sql
-- Add lang column
ALTER TABLE portfolio ADD COLUMN lang TEXT NOT NULL DEFAULT 'en';

-- Drop old unique constraint if any, add new one
ALTER TABLE portfolio ADD CONSTRAINT portfolio_sku_lang_unique UNIQUE(SKU, lang);
```

After migration: duplicate each existing row with `lang='he'` and translate the text fields (title, description, longDescription, additionalInfo).

The `settings.dir` field becomes implicit: when `lang='he'`, render RTL. When `lang='en'`, render LTR.

#### Portfolio Query Pattern

```typescript
// All published portfolio items for current language
const getPortfolio = async (lang: string, projectType?: string) => {
  let query = supabase
    .from('portfolio')
    .select('*')
    .eq('publish', true)
    .eq('lang', lang);

  if (projectType && projectType !== 'all') {
    query = query.eq('projectType', projectType);
  }

  return query
    .order('priority', { ascending: false })
    .order('id', { ascending: true });
};

// Single portfolio item by SKU for current language
const getPortfolioById = async (SKU: string, lang: string) => {
  return supabase
    .from('portfolio')
    .select('id, SKU, title, description, longDescription, technologies, projectType, image, imagePack, additionalInfo, featured, settings, priority, liveSite, github')
    .eq('SKU', SKU)
    .eq('lang', lang)
    .eq('publish', true)
    .single();
};
```

#### Image Queries (unchanged)

```typescript
// Site images (logo, profile, etc.)
const getSiteImage = async (imageName: string) => {
  const { data, error } = await supabase.storage
    .from('site-image')
    .createSignedUrl(imageName, 100 * 60 * 60 * 24); // 100 days
  if (error) throw error;
  return data?.signedUrl ?? null;
};

// Portfolio project images
const getPortfolioImage = async (imageName: string) => {
  const { data, error } = await supabase.storage
    .from('products-image')
    .createSignedUrl(imageName, 100 * 60 * 60 * 24); // 100 days
  if (error) return null;
  return data?.signedUrl ?? null;
};
```

### Storage Buckets (unchanged)

- `products-image` — portfolio item images (1:1 aspect ratio)
- `site-image` — site-wide images (logo, profile banners)

---

## Caching Strategy

### React Query Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: true,
      refetchOnReconnect: 'always',
      gcTime: 1000 * 60 * 60 * 24 * 30, // 30 days
    },
  },
});
```

### Per-Query Stale Times

| Query | staleTime | Rationale |
|-------|-----------|-----------|
| `site_content` | 24 hours | Rarely changes, aggressive cache |
| `portfolio` (list) | 0 (stale-while-revalidate) | Always refetch in background |
| `portfolio` (single by SKU) | 1 hour | Individual items change less often |
| `portfolioImage` | 14 days | Signed URLs valid for 100 days |
| `siteImage` | 14 days | Same as portfolio images |

### IndexedDB Persistence

```typescript
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { get, set, del } from 'idb-keyval';

const persister = {
  persistClient: async (client) => await set('portfolio-v2-cache', client),
  restoreClient: async () => await get('portfolio-v2-cache'),
  removeClient: async () => await del('portfolio-v2-cache'),
};

// Cache key: 'portfolio-v2-cache'
// Max age: 30 days (matches gcTime)
```

### First Visit Behavior

1. No cache exists → show liquid-glass skeleton loading states
2. Fetch `site_content` + `portfolio` in parallel
3. Content materializes section-by-section as queries resolve (~200-400ms)
4. Cache persisted to IndexedDB

### Return Visit Behavior

1. IndexedDB cache loads instantly → immediate render
2. Background refetch happens silently
3. If content changed → seamless React Query swap (no flicker)

---

## i18n Architecture (Supabase-Driven)

### No i18next. Custom hook instead.

```typescript
// useSiteText hook concept
function useSiteText() {
  const { lang } = useLanguage(); // React context: 'en' | 'he'

  const { data: contentMap } = useQuery({
    queryKey: ['site_content', lang],
    queryFn: () => fetchSiteContent(lang),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  // Returns a t() function like i18next
  const t = (key: string, fallback?: string) => {
    return contentMap?.[key] ?? fallback ?? key;
  };

  return { t, isLoading: !contentMap };
}
```

### Language Context

```typescript
// LanguageProvider wraps the app
// Stores selected language in localStorage ('portfolio-lang')
// Default: 'en'
// When lang='he': set dir="rtl" on document root

interface LanguageContextType {
  lang: 'en' | 'he';
  setLang: (lang: 'en' | 'he') => void;
  dir: 'ltr' | 'rtl';
}
```

### Language Toggle

A small toggle button in the navbar. When toggled:
1. Update language context
2. React Query automatically refetches `site_content` for new lang (or serves from cache)
3. Portfolio items refetch with new lang filter
4. Document `dir` attribute updates
5. All text re-renders with new language

---

## Page Structure — Section by Section

### SECTION 1: NAVBAR

**Source template**: Section 1 from instructions.md

**Position**: Fixed at `top-4`, full-width, `z-50`

**Layout**:
- Left: Logo/name text "AK" or Amitay Keisar monogram (liquid-glass-strong circle, 48x48)
- Center: liquid-glass rounded-full pill containing:
  - Nav links: "Home", "Work", "About", "Contact" — `text-sm font-medium text-foreground/90`
  - Scroll-to-section on click (smooth scroll)
- Right: Language toggle (en/he) — small, subtle
- Far right: solid `bg-white text-black rounded-full` "Get in Touch" button with ArrowUpRight icon (scrolls to contact section)

**Mobile**: Hamburger menu or condensed pill. TBD during implementation.

**Active state**: Highlight current section based on scroll position (IntersectionObserver).

---

### SECTION 2: HERO

**Source template**: Section 2 from instructions.md (1000px height hero)

**Container**: `relative overflow-visible`, height `1000px`, black background.

**Background video**:
- Source: Use the template's video URL (from instructions.md)
- Position: `absolute, top: 20%, w-full h-auto object-contain z-0`
- Attributes: `autoplay, loop, muted, playsInline`
- Overlays: `absolute inset-0 bg-black/5 z-0` + bottom gradient (300px, `linear-gradient(to bottom, transparent, black)`)

**Content** (z-10, centered, paddingTop ~150px):

1. **Badge pill**: liquid-glass rounded-full containing:
   - White `bg-white text-black rounded-full` "New" tag
   - Text: `t('hero.badge')` → "Building Addit, Muse & AgentMesh"

2. **Heading**: BlurText animation component
   - Line 1: `t('hero.heading.line1')` → "I ship products,"
   - Line 2: `t('hero.heading.line2')` → "not prototypes."
   - Classes: `text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-foreground leading-[0.8] tracking-[-4px]`
   - Animation: word-by-word from bottom with blur-to-clear effect (delay 100ms per word)

3. **Subtext** (motion.p, fade in with blur at 0.8s delay):
   - Text: `t('hero.subtext')` → "Full-stack developer across TypeScript, Kotlin, Rust & Python. I build complete products — from mobile apps to encrypted protocols to production infrastructure."

4. **CTA buttons** (motion.div, 1.1s delay):
   - Primary: `liquid-glass-strong rounded-full` → `t('hero.cta.primary')` "See My Work" + ArrowUpRight icon → scrolls to code carousel
   - Secondary: text-only → `t('hero.cta.secondary')` "Get in Touch" + Mail icon → scrolls to contact section

#### BlurText Animation Component

From template: Uses `motion/react` (framer-motion). Splits text by words, each word animates via IntersectionObserver:
- `filter: blur(10px) → blur(5px) → blur(0px)`
- `opacity: 0 → 0.5 → 1`
- `y: 50 → -5 → 0`
- Step duration: `0.35s`

---

### SECTION 3: PRODUCTS BAR

**Source template**: Section 3 (Partners Bar), repurposed

**Layout**: Centered column, `py-8`

1. **Badge**: liquid-glass rounded-full → `t('products.badge')` → "Currently shipping"

2. **Products row**: horizontal row of product names
   - Names parsed from `t('products.items')` → "Addit", "Muse", "AgentMesh", "Visara"
   - Rendered as: `text-2xl md:text-3xl font-heading italic text-white, gap-12`
   - Separated by centered dots or just spacing

---

### SECTION 4: CODE CAROUSEL

**Source template**: NONE — this is a NEW section, unique to this site

**Position in page**: After Products Bar, before About section

**Layout**: Full viewport width, edge-to-edge, no horizontal padding. Vertical padding: `py-16`

**No section header** — the carousel speaks for itself. Optional: a very subtle small badge "Development" above, but preference is no label.

#### Data Source

```typescript
const { data: codeProjects } = useQuery({
  queryKey: ['portfolio', lang, 'Web-Development'],
  queryFn: () => getPortfolio(lang, 'Web-Development'),
});
```

#### Carousel Behavior

**Auto-scroll direction**: RIGHT (→)
**Speed**: ~30-40px per second (CSS `--carousel-speed` variable for tuning)
**Infinite loop**: Items array is duplicated (rendered 2-3x) to fill viewport + overflow. When scroll position reaches the end of first set, seamlessly reset to beginning.

**Interaction states**:
| State | Behavior |
|-------|----------|
| Idle | Continuous smooth scroll at constant speed → |
| Hover (desktop) | Slows down (not full stop), cursor changes to pointer |
| Drag/swipe | User controls position freely, auto-scroll pauses |
| Release after drag | Momentum decay (deceleration), then resume auto-scroll → |
| Click on card | Open project overlay modal |

**Implementation approach**:
- Use `requestAnimationFrame` for smooth constant-speed animation
- Framer Motion `useMotionValue` + `useAnimationFrame` for the auto-scroll
- Framer Motion drag gesture for user interaction
- On drag end: `useSpring` for momentum decay, then resume RAF loop

**Card design**:
```
┌─────────────────────┐
│                     │
│     1:1 IMAGE       │  ← Portfolio image from Supabase Storage
│     (aspect-square) │     Signed URL, lazy loaded
│                     │
│                     │
├─────────────────────┤
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  ← Gradient overlay (transparent → black)
│ Project Title       │  ← font-heading italic text-white text-lg
│ Short description   │  ← font-body text-white/60 text-xs, 1 line truncated
└─────────────────────┘

Card wrapper: liquid-glass rounded-2xl overflow-hidden
Card size: ~300px wide (desktop), ~240px (tablet), ~70vw (mobile)
Gap between cards: 12px
```

**Image loading**:
- First 6 images: eager load
- Rest: `loading="lazy"`
- Placeholder: liquid-glass skeleton with shimmer animation
- On load: opacity transition `0 → 1` over `0.3s ease-in-out`

**Mobile behavior**:
- Cards are ~70-80vw wide (see one full + peek of next)
- Auto-scroll still active
- Swipe gesture is native-feeling
- Momentum on release

---

### SECTION 5: ABOUT

**Source template**: Section 4 ("How It Works" / Start Section)

**Layout**: Full-width, min-height `700px`, `py-32 px-6 md:px-16 lg:px-24`

**Background HLS video**:
- Source: Use template's video URL (from instructions.md Section 4)
- Absolute, full cover, z-0
- Top + bottom fade gradients (200px each, black ↔ transparent)
- Desaturated: `style={{ filter: 'saturate(0.3)' }}` (subtle, so text is readable)

**Content** (z-10, centered, min-height 500px):

1. **Badge**: liquid-glass rounded-full → `t('about.badge')` → "About"

2. **Heading**:
   - Line 1: `t('about.heading.line1')` → "Self-taught."
   - Line 2: `t('about.heading.line2')` → "Ship-obsessed."
   - Classes: `text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]`

3. **Body text**:
   - Text: `t('about.body')` → The three paragraphs about self-teaching, shipping products, and 8200
   - Classes: `text-white/60 font-body font-light text-sm md:text-base max-w-2xl`
   - Paragraphs separated by `\n\n` → rendered as separate `<p>` elements with `mb-4`

4. **CTA button**: liquid-glass-strong rounded-full → `t('about.cta')` → "Download Resume" + Download icon
   - Links to the resume PDF file (hosted in public/ or Supabase storage)

---

### SECTION 6: SKILLS GRID

**Source template**: Section 6 (Features Grid — 4 columns)

**Layout**: `py-24 px-6 md:px-16 lg:px-24`

1. **Badge**: liquid-glass rounded-full → `t('skills.badge')` → "What I Do"
2. **Heading**: `t('skills.heading')` → "The full stack. For real."

3. **Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`

Each card: `liquid-glass rounded-2xl p-6`:
- Icon in `liquid-glass-strong rounded-full w-10 h-10` circle
- Title: `text-lg font-heading italic text-white`
- Description: `text-white/60 font-body font-light text-sm`

| # | Icon (Lucide) | Title | Description |
|---|---------------|-------|-------------|
| 1 | `Smartphone` | `t('skills.card1.title')` "Mobile" | `t('skills.card1.description')` "React Native to native Kotlin. Both platforms, production-grade." |
| 2 | `Server` | `t('skills.card2.title')` "Backend & Infrastructure" | `t('skills.card2.description')` "Node.js, Rust, PostgreSQL, Docker, Terraform, GCP. Production-grade." |
| 3 | `Brain` | `t('skills.card3.title')` "AI & Agents" | `t('skills.card3.description')` "Claude SDK, MCP servers, Gemini, Deepgram. Building intelligent products." |
| 4 | `Shield` | `t('skills.card4.title')` "Security & Protocols" | `t('skills.card4.description')` "E2E encryption, Signal Protocol, on-device processing, zero-trust architecture." |

---

### SECTION 7: STATS

**Source template**: Section 7 (Stats)

**Background HLS video**:
- Source: Use template's video URL (from instructions.md Section 7)
- Desaturated: `style={{ filter: 'saturate(0)' }}`
- Top + bottom black fades (200px)

**Content** (z-10): `liquid-glass rounded-3xl p-12 md:p-16`, `grid grid-cols-2 lg:grid-cols-4 gap-8 text-center`

| Value | Label |
|-------|-------|
| `t('stats.stat1.value')` → "4+" | `t('stats.stat1.label')` → "Products in production" |
| `t('stats.stat2.value')` → "5" | `t('stats.stat2.label')` → "Languages" |
| `t('stats.stat3.value')` → "1,000+" | `t('stats.stat3.label')` → "Soldiers supported (8200)" |
| `t('stats.stat4.value')` → "0" | `t('stats.stat4.label')` → "Runtime dependencies (Muse)" |

- Values: `text-4xl md:text-5xl lg:text-6xl font-heading italic text-white`
- Labels: `text-white/60 font-body font-light text-sm`

---

### SECTION 8: WOOD CAROUSEL

**Source template**: NONE — NEW section, mirrors Code Carousel

**Position in page**: After Stats, before Testimonials. Appears with NO header, NO label, NO introduction — just the carousel appearing unexpectedly.

**Layout**: Identical to Code Carousel but:
- **Auto-scroll direction**: LEFT (←) — OPPOSITE of code carousel
- Data source: `projectType = 'Wood-Working'`

```typescript
const { data: woodProjects } = useQuery({
  queryKey: ['portfolio', lang, 'Wood-Working'],
  queryFn: () => getPortfolio(lang, 'Wood-Working'),
});
```

All other behavior (speed, interaction, card design, image loading) is identical to Code Carousel.

The opposite scroll direction creates a visual contrast — two streams of work flowing in opposite directions. This is the "surprise moment" in the page flow.

---

### SECTION 9: TESTIMONIALS

**Source template**: Section 8 (Testimonials)

**Layout**: `py-24 px-6 md:px-16 lg:px-24`

1. **Badge**: liquid-glass rounded-full → `t('testimonials.badge')` → "What They Say"
2. **Heading**: `t('testimonials.heading')` → "Don't take our word for it."

3. **Grid**: 3-column grid (`grid-cols-1 md:grid-cols-3 gap-6`)

Each card: `liquid-glass rounded-2xl p-8`:
- Quote: `text-white/80 font-body font-light text-sm italic`
- Name: `text-white font-body font-medium text-sm`
- Role: `text-white/50 font-body font-light text-xs`

**Content**: TBD — user will provide real testimonials. Placeholder structure ready.

**If no testimonials are available at launch**: This section can be hidden entirely (conditionally rendered based on whether testimonial data exists in Supabase).

---

### SECTION 10: CONTACT / CTA

**Source template**: Section 9 (CTA Footer), merged with contact form

**Background HLS video**:
- Source: Use template's video URL (from instructions.md Section 9)
- Top + bottom black fades (200px)

**Content** (z-10, centered):

1. **Heading**: `t('contact.heading')` → "Let's build something."
   - Classes: `text-5xl md:text-6xl lg:text-7xl font-heading italic text-white`

2. **Subtext**: `t('contact.subtext')` → "Have a project in mind? I'd love to hear about it."

3. **Contact form** (liquid-glass rounded-2xl p-8, max-w-xl mx-auto):

| Field | Type | Placeholder | Validation |
|-------|------|-------------|------------|
| Name | text input | `t('contact.form.name.placeholder')` | Required, min 2 chars |
| Email | email input | `t('contact.form.email.placeholder')` | Required, valid email (Zod) |
| Subject | text input | `t('contact.form.subject.placeholder')` | Required, min 2 chars |
| Message | textarea | `t('contact.form.message.placeholder')` | Required, min 10 chars |

   - Submit button: `bg-white text-black rounded-full` → `t('contact.cta')` "Send Message" + ArrowUpRight
   - All inputs: dark themed, liquid-glass background, white text, placeholder text-white/30
   - Uses React Hook Form + Zod for validation
   - Submission: EmailJS

4. **Social links row** (below form, centered):
   - GitHub, LinkedIn, X/Twitter, Instagram, WhatsApp, Email
   - Rendered as liquid-glass-strong rounded-full icon buttons
   - Links from personal info constants

5. **Resume download**: Small text link below social links → "Download Resume (PDF)"

#### EmailJS Configuration (carried from old site)

```typescript
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_vtxkxkm',
  TEMPLATE_ID: 'template_1eehme9',
  USER_ID: 'fI7maFmjNQrrkKrV3',
};
```

#### Form Success/Error States

- **Success**: Form fades out, replaced by animated checkmark + `t('contact.form.success')` message. Liquid-glass card with green-tinted glow.
- **Error**: Inline error message below submit button, `t('contact.form.error')`. Red-tinted text.

---

### SECTION 11: FOOTER

**Source template**: Footer from Section 9

**Layout**: `mt-32 pt-8 border-t border-white/10`

- Left: `t('footer.copyright')` → "© 2026 Amitay Keisar"
- Right: Links → Privacy, Terms, Contact (text-white/40 text-xs)
- All in `font-body`

---

## Project Overlay Modal

**Triggered by**: Clicking any card in either carousel

**Transition**:
- **Open**: Slide up from bottom (y: 100vh → 0) + fade in, duration 0.4s, ease-out
- **Background**: Main page content blurs (backdrop-filter: blur(20px)) + dims (bg-black/60)
- **Body scroll**: Locked when modal open (`overflow: hidden` on body)

**Close**:
- Click X button (top-right)
- Click backdrop (outside modal)
- Press Escape key
- Transition: Reverse of open (slide down + fade out)

**Layout** (the modal itself):

```
┌─────────────────────────────────────────────────┐
│ Full-screen overlay: liquid-glass-strong         │
│ rounded-t-3xl (rounded top corners only)         │
│ max-height: 90vh, overflow-y: auto               │
│ Width: 100% on mobile, max-w-4xl centered on     │
│ desktop with side margins                         │
│                                                   │
│  ┌─ Close button ─────────────────────── [✕] ─┐  │
│  │                                             │  │
│  │  ┌───────────┐  ┌──────┐ ┌──────┐          │  │
│  │  │           │  │      │ │      │          │  │
│  │  │   MAIN    │  │ Th 2 │ │ Th 3 │          │  │
│  │  │   IMAGE   │  │      │ │      │          │  │
│  │  │   (1:1)   │  └──────┘ └──────┘          │  │
│  │  │           │  ┌──────┐ ┌──────┐          │  │
│  │  │           │  │      │ │      │          │  │
│  │  └───────────┘  │ Th 4 │ │ Th 5 │          │  │
│  │                 └──────┘ └──────┘          │  │
│  │                                             │  │
│  │  Project Title                              │  │
│  │  font-heading italic text-3xl text-white    │  │
│  │  ─────────────────────────────              │  │
│  │                                             │  │
│  │  Description                                │  │
│  │  font-body text-white/60                    │  │
│  │                                             │  │
│  │  Long Description (rendered from markdown)  │  │
│  │  font-body text-white/70                    │  │
│  │                                             │  │
│  │  Technologies:                              │  │
│  │  [React] [TypeScript] [Supabase] [Tailwind] │  │
│  │  (liquid-glass rounded-full px-3 py-1 each) │  │
│  │                                             │  │
│  │  ┌─ Additional Info ─────────────────────┐  │  │
│  │  │ liquid-glass rounded-xl p-4           │  │  │
│  │  │ Key:    Value                          │  │  │
│  │  │ Key:    Value                          │  │  │
│  │  └───────────────────────────────────────┘  │  │
│  │                                             │  │
│  │  [Visit Live Site ↗]   [View on GitHub ↗]  │  │
│  │  (liquid-glass-strong rounded-full buttons) │  │
│  │                                             │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Image Gallery Behavior (inside modal)

- **Main image**: `aspect-square w-full` (or max-w, responsive)
- **Thumbnails**: Grid of up to 4 additional images from `imagePack`
- **Click thumbnail**: Swap main image (local component state)
- **All images**: Fetched via `getPortfolioImage(imageName)` → signed URLs
- **Loading**: Skeleton placeholders with liquid-glass shimmer
- **Keyboard**: Enter/Space to select thumbnail

### Data Fetching for Modal

When modal opens with a SKU:
```typescript
const { data: project } = useQuery({
  queryKey: ['portfolio', SKU, lang],
  queryFn: () => getPortfolioById(SKU, lang),
});

// Prefetch images
project?.imagePack?.forEach(img => {
  queryClient.prefetchQuery({
    queryKey: ['portfolioImage', img],
    queryFn: () => getPortfolioImage(img),
    staleTime: 1000 * 60 * 60 * 24 * 14, // 14 days
  });
});
```

**Optimization**: Prefetch project data + first image on carousel card HOVER (before click), so modal opens instantly.

---

## Personal Info & Social Links

Constants file (NOT in Supabase — these are structural, not translatable):

```typescript
export const PERSONAL_INFO = {
  name: 'Amitay Keisar',
  email: 'amiteyk3@gmail.com',
  phone: '+972-526-471-797',
  whatsapp: 'https://wa.me/972526471797',
  github: 'https://github.com/amitayks',
  linkedin: 'https://linkedin.com/in/amitaykeisar',
  instagram: 'https://instagram.com/amitay.ks',
  x: 'https://x.com/AmKeisar',
} as const;

export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_vtxkxkm',
  TEMPLATE_ID: 'template_1eehme9',
  USER_ID: 'fI7maFmjNQrrkKrV3',
} as const;
```

---

## Analytics

Reuse Umami analytics from old site. Track:
- Page load
- Carousel interactions (scroll, card click)
- Modal opens (with SKU + title)
- Contact form submit (success/failure)
- External link clicks (GitHub, live site, social)
- Language toggle
- Resume download

---

## Loading States — Liquid Glass Skeletons

Every section that depends on Supabase data shows a skeleton while loading:

```
Skeleton style:
- liquid-glass background
- Animated shimmer: a gradient that slides left-to-right
  background: linear-gradient(90deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.03) 50%,
    rgba(255,255,255,0) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

- Shape matches content:
  - Text: rounded-full bars at ~60-80% width
  - Images: aspect-square rounded-2xl blocks
  - Cards: full card shape with inner skeleton elements
```

This looks intentional on the black background — glass shapes pulsing before content materializes.

---

## File Structure

```
new-site/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── biome.json
├── public/
│   ├── fonts/                    (if self-hosting fonts)
│   └── Amitay_Keisar_Resume.pdf  (resume download)
├── src/
│   ├── main.tsx                  (entry point)
│   ├── App.tsx                   (QueryClient + LanguageProvider + main layout)
│   ├── index.css                 (CSS variables, liquid-glass, Google Fonts import)
│   ├── lib/
│   │   ├── utils.ts              (cn() helper, clsx + tailwind-merge)
│   │   └── queryClient.ts        (React Query client + persister config)
│   ├── services/
│   │   ├── supabase.ts           (Supabase client init)
│   │   ├── apiPortfolio.ts       (getPortfolio, getPortfolioById)
│   │   ├── apiImages.ts          (getSiteImage, getPortfolioImage)
│   │   └── apiContent.ts         (fetchSiteContent → site_content table)
│   ├── hooks/
│   │   ├── useSiteText.ts        (t() function backed by Supabase)
│   │   ├── useLanguage.ts        (language context hook)
│   │   ├── usePortfolioItems.ts  (portfolio query hook with lang filter)
│   │   ├── usePortfolioImage.ts  (image signed URL hook)
│   │   └── useAnalytics.ts       (Umami event tracking)
│   ├── contexts/
│   │   └── LanguageContext.tsx    (lang state + dir + localStorage persist)
│   ├── components/
│   │   ├── ui/                   (shadcn/ui components: button, input, textarea, dialog, etc.)
│   │   ├── BlurText.tsx          (word-by-word blur animation — from template)
│   │   ├── HlsVideo.tsx         (HLS video player with Safari fallback)
│   │   ├── SectionBadge.tsx      (reusable liquid-glass badge)
│   │   ├── SectionHeading.tsx    (reusable section heading)
│   │   ├── LiquidSkeleton.tsx    (shimmer skeleton component)
│   │   ├── InfiniteCarousel.tsx  (the core carousel engine — shared by both carousels)
│   │   ├── CarouselCard.tsx      (1:1 image card for carousel)
│   │   ├── ProjectModal.tsx      (full-screen overlay modal)
│   │   ├── ProjectImageGallery.tsx (main image + thumbnails inside modal)
│   │   ├── ContactForm.tsx       (React Hook Form + Zod + EmailJS)
│   │   ├── LanguageToggle.tsx    (en/he switcher)
│   │   ├── SocialLinks.tsx       (icon buttons row)
│   │   └── Navbar.tsx            (fixed navbar with glass pill)
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── ProductsBar.tsx
│   │   ├── CodeCarousel.tsx      (uses InfiniteCarousel with direction="right")
│   │   ├── About.tsx
│   │   ├── SkillsGrid.tsx
│   │   ├── Stats.tsx
│   │   ├── WoodCarousel.tsx      (uses InfiniteCarousel with direction="left")
│   │   ├── Testimonials.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── types/
│   │   ├── portfolio.ts          (PortfolioItem interface — updated with lang)
│   │   └── content.ts            (SiteContent types)
│   └── constants/
│       └── personal.ts           (PERSONAL_INFO, EMAILJS_CONFIG, SOCIAL_LINKS)
└── openspec/
    └── ...
```

---

## Portfolio Type Definition (updated)

```typescript
export interface PortfolioItem {
  id: string;
  SKU: string;
  lang: 'en' | 'he';           // NEW — language of this row
  title: string;
  image: string;                // Main image filename in Supabase Storage
  imagePack: string[];          // Additional image filenames
  featured: boolean;
  description: string;          // Short (for carousel card)
  longDescription: string;      // Full (for modal, markdown)
  technologies: string[];
  settings: {
    imageAspect: 'squere';      // Always 1:1 (keeping the typo for backward compat)
  };
  projectType: 'Wood-Working' | 'Web-Development' | 'Design' | 'Other';
  additionalInfo: Array<{
    label: string;
    value: string;
  }>;
  priority?: number;
  completionDate?: string;
  liveSite?: {
    label?: string;
    link: string;
    subHeader: string;
    previewImage?: { dark: string; light: string };
  };
  github?: {
    label?: string;
    link: string;
    subHeader: string;
    previewImage?: { dark: string; light: string };
  };
  status?: 'completed' | 'in-progress' | 'concept';
  publish: boolean;
}
```

Note: `settings.dir` is REMOVED. Direction is now derived from `lang`: `lang === 'he' ? 'rtl' : 'ltr'`.

---

## Accessibility Requirements

- Semantic HTML throughout (nav, main, section, article, footer, h1-h3)
- ARIA labels on all interactive elements (carousel cards, modal, form inputs, social links)
- Keyboard navigation: Tab through nav → carousel cards → form fields
- Escape key closes modal
- `prefers-reduced-motion`: Disable carousel auto-scroll, disable BlurText animation, use simple fade-in instead
- Focus trap inside open modal
- Form validation errors announced to screen readers
- Color contrast: White text on black background meets AAA standards
- Language attribute: `<html lang={currentLang} dir={dir}>`

---

## Performance Considerations

- **Images**: Lazy load all except first 6 visible carousel items
- **Videos**: HLS streams (adaptive bitrate), only load when section is near viewport
- **Fonts**: Google Fonts with `display=swap` to prevent FOIT
- **Bundle**: Code-split modal component (dynamic import, loaded on first card click)
- **Cache**: Aggressive React Query caching with IndexedDB persistence
- **Prefetch**: On carousel card hover, prefetch project data + first image
- **Carousel**: Use `will-change: transform` for GPU-accelerated scrolling
- **Skeleton**: Immediate skeleton render (no layout shift when data arrives)

---

## Migration Tasks Summary

### Supabase Changes Required
1. Create `site_content` table with all keys for en + he
2. Add `lang` column to `portfolio` table
3. Duplicate existing portfolio rows for Hebrew translations
4. Update RLS policies if needed
5. Get current portfolio data from user for review/editing

### From Old Site — Carry Over
- Supabase connection (URL + anon key)
- EmailJS config (service ID, template ID, user ID)
- Portfolio data (projects, images) — already in Supabase
- Umami analytics setup
- Personal info / social links

### From Old Site — Do NOT Carry Over
- React Router (no routing)
- i18next (replaced by Supabase-driven approach)
- Component designs/layouts (completely new)
- Color system (replaced by dark/liquid-glass)
- Page structure (single page vs multi-page)
- Any visual design decisions
