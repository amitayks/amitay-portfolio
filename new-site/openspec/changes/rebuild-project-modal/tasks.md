## 1. Modal Layout — Full Screen & Structure

- [x] 1.1 Change modal panel from bottom-sheet (`inset-x-0 bottom-0 max-w-4xl rounded-t-3xl`) to full-screen (`inset-0`) with no rounded corners
- [x] 1.2 Move close button outside the scrollable panel — make it a fixed-position sibling element at `z-[80]` in the viewport top-right
- [x] 1.3 Add an inner content container with `max-w-5xl mx-auto` and padding for centered content within the full-screen shell
- [x] 1.4 Remove all `whileInView`, per-section `AnimatePresence`, and staggered-entry animations from inner content — keep only the modal slide-up entry/exit

## 2. Image Gallery — 2×3 Grid

- [x] 2.1 Change `ProjectImageGallery` to accept up to 6 thumbnails (from `imagePack.slice(0, 6)` instead of `slice(0, 4)`)
- [x] 2.2 Update gallery layout to ~60% main image / ~40% thumbnail area
- [x] 2.3 Change thumbnail grid from `grid-cols-2` (2×2) to `grid-cols-2 grid-rows-3` (2×3)
- [x] 2.4 Render all 6 grid slots always — empty slots show a subtle placeholder (transparent or faint glass background) to maintain grid structure
- [x] 2.5 Ensure thumbnails use 1:1 square aspect ratio with `rounded-md` (no circles)

## 3. Content Flow & Tags

- [x] 3.1 Remove the `liquid-glass rounded-xl p-4` wrapper from the additional info section — render rows inline in the content flow
- [x] 3.2 Center the technology tags container (`justify-center` on the flex wrapper)
- [x] 3.3 Ensure consistent spacing between all content sections (title, description, long desc, tags, info, link cards) using uniform gap/margin

## 4. RTL Support for Additional Info

- [x] 4.1 Add `dir={dir}` attribute to additional info row containers
- [x] 4.2 Verify that `flex justify-between` with `dir="rtl"` correctly places label on right and value on left

## 5. Link Preview Cards

- [x] 5.1 Create a `ProjectLinkCard` component (or inline in modal) with 9:16 aspect ratio, full-bleed image, blur+gradient overlay at bottom with icon and title
- [x] 5.2 Use `usePortfolioImage(previewImage.dark)` to fetch the preview image URL
- [x] 5.3 Implement fallback: show centered icon (Github/ExternalLink) on glass background when no preview image exists or image fails to load
- [x] 5.4 Make entire card clickable — opens link in new tab with `noopener,noreferrer`
- [x] 5.5 Render cards in a 2-column grid when both github and liveSite exist, single card when only one exists, hidden when neither exists
- [x] 5.6 Add hover effect on cards (subtle scale or lift, consistent with old site's `whileHover` pattern)

## 6. Verification

- [ ] 6.1 Test with a project that has 6+ images in imagePack — verify grid looks correct
- [ ] 6.2 Test with a project that has 0-2 images — verify empty slots maintain structure
- [ ] 6.3 Test with Hebrew language — verify additional info rows flip correctly
- [ ] 6.4 Test scroll behavior — verify close button stays fixed, no content disappear/reappear
- [ ] 6.5 Test with and without github/liveSite data — verify cards show/hide correctly
- [ ] 6.6 Test with and without preview images — verify fallback icon appears
