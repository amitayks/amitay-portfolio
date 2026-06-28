## Why

In the project detail modal, the developer attribution (small avatar pills, near the top) and the GitHub/Live links (big preview-image cards, at the bottom) are two disconnected pieces. At the same time, the area beside the main image is a six-thumbnail project-image browser. Combining the developer + links into a single **side column beside the main image** — replacing those thumbnails — makes "who built this and where to see it" one compact, prominent unit at the top of the modal.

## What Changes

- Add a **credits side column** to the right of the main image (taking over the former thumbnail area), ordered top→bottom: **developer slot**, **GitHub**, **Live**.
- **Developer slot adapts to count**: 1 → image beside name + description (bio); 2 → image+name pair (two columns); 3–6 → image-only thumbnails (two rows). Honors `named` / `anonymized` / `hidden` attribution.
- **GitHub/Live become compact icon-and-label buttons** (no preview image, no 9:16 grid, no `usePortfolioImage`, no blur overlay).
- **BREAKING** Remove the project-image thumbnail browser: the main image is now **static** (single image); `imagePack` is no longer shown in the modal.
- Remove the old top developer-attribution pills and the bottom link-cards grid; both are absorbed into the side column.
- Column degrades gracefully: links-only, developers-only, or omitted entirely (main image full-width) when there's no credits content.

## Capabilities

### New Capabilities
- `project-modal-credits`: The credits side column beside the main image — developer slot (count-adaptive) plus GitHub/Live buttons, including attribution modes and graceful degradation.

### Modified Capabilities
- `project-modal-link-cards`: GitHub/Live links become compact icon-and-label buttons (no preview image, no grid, no `usePortfolioImage`), rendered in the credits side column.
- `project-modal-gallery`: The 40% thumbnail grid is removed and replaced by the credits side column; the main image is static (no click-to-swap); `imagePack` is no longer rendered.

## Impact

- **Code**: `src/components/ProjectModal.tsx` (new `DevSlot`, `DevAvatar`, `ProjectSideColumn`; icon-and-label `ProjectLinkCard`; two-column top layout; removed credits row & developer pills) and `src/components/ProjectImageGallery.tsx` (simplified to a static main image).
- **Specs**: new `project-modal-credits`; modified `project-modal-link-cards` and `project-modal-gallery`.
- **Orphaned (harmless)**: `imagePack`, `LinkCard.previewImage`, and `usePortfolioImage` usage for the gallery thumbnails / links.
- **RTL** (`project-modal-rtl`): verify the image|column split reads correctly mirrored.
- **No** API, routing, or data-model changes.
