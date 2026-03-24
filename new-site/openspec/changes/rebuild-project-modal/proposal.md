## Why

The current `ProjectModal` overlay was a quick conversion from the old site's full-page `PortfolioDetail` view. It works but feels disjointed — sections are visually separated, the close button scrolls away, the image gallery doesn't maximize its potential, and key design concepts from the old site (image-as-button link cards, proper RTL support) were lost in translation. This rebuild brings the overlay up to the design quality of the old site while adapting it properly to the modal/overlay context.

## What Changes

- **Image gallery grid**: Expand thumbnail grid from 2x2 (4 images) to 2x3 (6 images) with a 60/40 width split so thumbnails match main image height. Empty slots maintain grid structure.
- **Thumbnail shape**: Keep 1:1 square aspect ratio (remove any circular styling).
- **Full-screen overlay**: Modal covers the full viewport (no top gap, full width) instead of `max-w-4xl` with rounded top corners.
- **Fixed close button**: X button stays fixed in viewport corner, doesn't scroll with content.
- **Unified flow**: Remove nested glass panels and section-based visual breaks. Content flows as one continuous piece inside the single outer shell.
- **Remove scroll-triggered animations on inner content**: All modal content is immediately present once the modal opens — no `whileInView` or staggered entry animations that cause content to disappear/reappear on scroll.
- **Centered tags**: Technology tags centered instead of left-aligned.
- **RTL-aware additional info**: Additional info rows accept `dir` parameter so label/value order flips correctly for Hebrew.
- **Image-button link cards**: Replace plain glass buttons for GitHub/LiveSite with old-site-style `LinkPreviewCard` — tall 9:16 image cards where the preview image IS the button, with a blur overlay and title at the bottom. Uses dark image variant only. Falls back to icon if no image. Hidden entirely if no github/liveSite data.

## Capabilities

### New Capabilities
- `project-modal-gallery`: Image gallery layout with 60/40 split, 2x3 thumbnail grid, and placeholder slots
- `project-modal-layout`: Full-screen overlay structure, fixed close button, unified content flow without section breaks
- `project-modal-link-cards`: 9:16 image-as-button cards for GitHub/LiveSite links with blur overlay, dark-image-only, icon fallback
- `project-modal-rtl`: RTL support for additional info rows and content direction

### Modified Capabilities

## Impact

- `src/components/ProjectModal.tsx` — Major rewrite of layout, structure, and styling
- `src/components/ProjectImageGallery.tsx` — Expand to 6-thumbnail 2x3 grid with 60/40 split
- `src/hooks/usePortfolioItem.ts` — May need to fetch `previewImage` URLs for link cards (currently not fetched)
- `src/hooks/usePortfolioImage.ts` — Used by gallery, may be reused for link card images
- `src/types/portfolio.ts` — Already has `previewImage` in type, no changes needed
