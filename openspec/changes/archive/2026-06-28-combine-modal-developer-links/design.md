## Context

`ProjectModal.tsx` rendered a vertical column with: a `ProjectImageGallery` (main image + 6-thumbnail browser) at the top, developer attribution pills after the description, and big preview-image GitHub/Live cards at the bottom. This change merges the developer + links into a single **side column beside the main image**, taking over the thumbnail area.

## Goals / Non-Goals

**Goals:**
- A credits side column right of the main image: developer slot (top), GitHub, Live.
- Count-adaptive developer slot (1 / 2 / 3–6), honoring attribution modes.
- Compact icon-and-label link buttons (no preview images).
- Static main image; graceful degradation when content is missing.

**Non-Goals:**
- Keeping the project-image thumbnail browser (intentionally removed).
- Making the developer informational card a link (informational only).
- Deleting orphaned data (`imagePack`, `previewImage`).
- Data-model / API changes.

## Decisions

### 1. Components in `ProjectModal.tsx`
- `DevAvatar({ url, className })` — a square box (`relative rounded-xl overflow-hidden`) with the image/icon absolutely filling it, so `aspect-square` holds reliably whether the caller sizes it by width or height. `User` placeholder when no url.
- `DevSlot({ project })` — a glass container with a header ("Developer" / "Built by") and count-adaptive content via `devList(project)`:
  - **1**: a height-responsive centered square image (`h-full max-h-[200px] aspect-square` inside a `flex-1 min-h-0` area, so it shrinks to fit) with the name centered below as a title (`text-xl font-semibold`) + optional `bio` (`line-clamp-3`).
  - **2**: `grid-cols-2` → each cell image-above-name, centered.
  - **3–6**: `grid-cols-3 grid-rows-2` image-only thumbnails (`slice(0,6)`).
  - The container is `flex-[2]` so it takes a larger share of the column height than the links container.
- `ProjectLinkCard({ link, label, type })` — a `motion.a` button (icon + label, `aria-label`, new tab, hover-scale) with a light `bg-white/5` style (it nests inside the glass links container). `flex-1 min-h-0` with compact `py-3` so the buttons shrink to fit the links container.
- `ProjectLinksCard({ project })` — a glass container with a "Links" header holding the GitHub/Live buttons; `flex-1`; renders only when a link exists. Computes labels via `useLanguage` + `pickLang`.
- `ProjectSideColumn({ project })` — `flex-1 flex flex-col gap-3`: `DevSlot` then `ProjectLinksCard`.
- `devList()` / `hasCreditsContent()` helpers centralize attribution-mode logic (named/anonymized/hidden, bio, generated names).

### 2. Top layout (in the modal body)
Responsive split:
- **Desktop (`md+`)**: a `relative` wrapper holds the main image in flow at `w-[60%]` (its `aspect-square` defines the wrapper height), and `<ProjectSideColumn>` is **absolutely positioned** at `inset-y-0 right-0 w-[38%]` so it is exactly the image's height. Flex stretch was unreliable here (circular height resolution let the column push the row taller than the image); absolute positioning makes the image the sole height anchor. Inside, `DevSlot` (`flex-[2]`) and `ProjectLinksCard` (`flex-1`) divide that fixed height, with `overflow-hidden` clipping any excess.
- **Mobile (`< md`)**: the main image renders full-width, followed by `<ProjectCreditsTabs>` — three uniform `CreditTab`s (developer name only / GitHub / Live). No developer photo; the developer tab is a `<button>` (future: opens a dev-info window). The two layouts are toggled with `hidden md:block` / `md:hidden`.

When there is no credits content, the image renders full-width with no column or tabs.

`CreditTab` is the shared tab style (icon + label) rendered as a `motion.a` for links or a `motion.button` for the developer tab.

### 3. `ProjectImageGallery` simplified
Reduced to a single static main image with skeleton (drops `imagePack`, the 2×3 thumbnail grid, `selectedImage` state, and click-to-swap).

### 4. Removals
The after-description credits row, the bottom link-cards grid, the developer-attribution pills, and the unused `hasLinks`/label/`lang` locals are all removed.

### 5. Attribution modes / thresholds
| devs | layout |
|---|---|
| 0 / hidden | no slot |
| 1 | image + name + bio |
| 2 | image+name pair |
| 3–6 | image-only thumbnails (2 rows) |
| >6 | first 6 thumbnails |

`anonymized` → placeholder image + "Developer A/B…", no bio.

## Risks / Trade-offs

- **Losing the project-image browser** is intended; `imagePack` is no longer reachable in the modal (data retained).
- **Tall single-dev card**: with `DevSlot` as `flex-1`, one developer sits in a tall card; content is vertically centered. Acceptable; tune via fixed heights if it reads sparse.
- **Mobile (375px)**: the image|column split stays side-by-side (as the gallery always did) and gets tight; `truncate`/`line-clamp` contain overflow. Flag for visual check.
- **RTL**: the flex row mirrors automatically; verify the image-left / column-right reads acceptably mirrored.

## Migration Plan

1. Simplify `ProjectImageGallery` to a static main image.
2. Add `DevAvatar`/`DevSlot`/`ProjectSideColumn` + icon-and-label `ProjectLinkCard`; build the two-column top layout; remove old pieces.
3. Verify counts (0/1/2/3–6/>6), modes, links-only, devs-only, neither; mobile + RTL.
4. **Rollback:** revert both component files; no data migration.
