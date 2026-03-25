## Context

The `ProjectModal` component is a bottom-sheet overlay that replaced the old site's full-page `PortfolioDetail`. The current implementation works but has structural issues: sections feel disconnected, the close button scrolls away, the image gallery underutilizes space (4 thumbnails in a 2x2 grid), and the GitHub/LiveSite links lost their visual impact (reduced to plain text buttons from the old site's tall image cards).

Key files:
- `src/components/ProjectModal.tsx` — The modal shell and content layout
- `src/components/ProjectImageGallery.tsx` — Main image + thumbnail grid
- `src/hooks/usePortfolioItem.ts` — Fetches project data (does NOT fetch preview images yet)
- `src/hooks/usePortfolioImage.ts` — Fetches a single image by name from storage
- `src/types/portfolio.ts` — Already has `previewImage?: { dark: string; light: string }` on github/liveSite

The new site uses a dark liquid-glass aesthetic with Tailwind CSS and framer-motion.

## Goals / Non-Goals

**Goals:**
- Full-screen overlay that feels like one cohesive piece, not assembled from parts
- Image gallery with 6-slot 2x3 thumbnail grid that visually matches main image height
- Image-as-button link cards for GitHub/LiveSite (9:16 aspect, blur overlay)
- Fixed close button that stays in viewport corner during scroll
- RTL-aware layout for Hebrew content (additional info, content direction)
- All content immediately present — no scroll-triggered appear/disappear animations

**Non-Goals:**
- Reworking the modal entry/exit animation (slide-up spring) — keep as-is for now
- Dark/light theme switching for link preview images — dark only for now
- Lightbox/zoom on gallery images
- Mobile-specific layout breakpoints beyond basic responsiveness

## Decisions

### 1. Full-screen overlay instead of constrained width

**Decision**: Remove `max-w-4xl`, `rounded-t-3xl`, and bottom-anchoring. The modal covers the full viewport.

**Rationale**: The user explicitly wants screen-wide coverage. The current `max-w-4xl` constrains the link preview cards and gallery unnecessarily. Full-screen also simplifies the close button positioning (fixed to viewport).

**Structure**:
```
┌─────────────────────────────────────────────────────────┐
│  Backdrop (fixed, z-60, blur)                           │
│  ┌───────────────────────────────────────────────[X]──┐ │
│  │  Modal panel (fixed inset-0, z-70, overflow-y-auto)│ │
│  │                                                     │ │
│  │    ┌─ Content container (max-w-5xl mx-auto) ─────┐ │ │
│  │    │  Gallery                                     │ │ │
│  │    │  Title / Description / Long desc             │ │ │
│  │    │  Tags (centered)                             │ │ │
│  │    │  Additional info (dir-aware)                 │ │ │
│  │    │  Link preview cards (9:16)                   │ │ │
│  │    └──────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

The content inside uses `max-w-5xl mx-auto` with padding so it doesn't stretch edge-to-edge on ultrawide screens, but the glass background covers the full viewport.

### 2. Image gallery — 60/40 split with 2-column × 3-row thumbnails

**Decision**: Main image takes ~60% width, thumbnail area takes ~40%, with thumbnails in a 2-col × 3-row grid.

**Math**: With 1:1 thumbnails — each thumbnail width = 40%/2 = 20%. Height of 3 rows = 3 × 20% = 60%. Main image (1:1 at 60% width) height = 60%. Heights match.

**Alternative considered**: 3-col × 2-row (wider thumbnails). Rejected because it would make thumbnails disproportionately wide relative to their height and the main image would need to be taller to match.

**Empty slots**: When fewer than 6 thumbnails exist, empty grid cells remain — showing a subtle `liquid-glass` background or transparent placeholder to maintain the grid structure.

### 3. Fixed close button outside scrollable area

**Decision**: The X button is a sibling of the modal panel, positioned `fixed` at top-right of viewport with `z-[80]` (above the modal's z-70).

**Rationale**: Keeping it as a child of the scrollable panel with `absolute` positioning means it scrolls away. Making it `fixed` and a separate element from the scroll container solves this cleanly.

### 4. Link preview cards — reuse concept from old site's LinkPreviewCard

**Decision**: Create a new `ProjectLinkCard` component within the modal. It's a 9:16 aspect ratio card where the preview image fills the entire card. A blur + gradient overlay at the bottom shows the title and an icon. The whole card is clickable.

**Data flow**: The `previewImage.dark` field on `github`/`liveSite` contains an image filename. We use the existing `usePortfolioImage` hook to resolve it to a URL. If no image exists, show a centered fallback icon (GitHub icon or ExternalLink icon) on a subtle glass background. If no `github`/`liveSite` data exists at all, don't render the card.

**Alternative considered**: Extending `usePortfolioItem` hook to prefetch preview images. Rejected — the modal already handles async image loading via `usePortfolioImage`, keeping it consistent with the gallery pattern.

### 5. Unified content flow — no nested glass panels

**Decision**: Remove the `liquid-glass rounded-xl p-4` wrapper from additional info. All content sits directly inside the modal with consistent spacing (`space-y-6` or similar). The only glass effect is on the modal shell itself.

**Rationale**: Nested glass panels create visual fragmentation. A single glass surface with flowing content feels more cohesive.

### 6. No scroll-triggered content animations

**Decision**: Remove all `whileInView`, `AnimatePresence` on inner content, and viewport-triggered motion. Content is simply rendered. The modal itself retains its slide-up entry animation.

**Rationale**: In a scrollable overlay, viewport-based animations cause content to vanish and re-enter on scroll, which is jarring and broken UX.

### 7. RTL support via `dir` prop

**Decision**: Pass `dir` from `useLanguage()` to additional info rows. Use `flex` with `justify-between` — the natural flex behavior with `dir="rtl"` automatically places the label on the right and value on the left.

## Risks / Trade-offs

- **[Risk] Preview images not populated in data** → Some projects may not have `previewImage` set on github/liveSite. Mitigated by icon fallback and hiding cards entirely when no link data exists.
- **[Risk] Full-screen overlay on small screens** → Could feel overwhelming. Mitigated by centering content with max-width, and the existing backdrop blur provides visual grounding.
- **[Trade-off] Dark-only preview images** → Simpler implementation but won't adapt if we add light mode later. Acceptable for current dark-only design; easy to extend later.
- **[Trade-off] No entry animations on content** → Slightly less "wow factor" on open, but eliminates the scroll-triggered disappear/reappear bug entirely. The modal slide-up itself provides sufficient entrance visual interest.
