## 1. Static main image

- [x] 1.1 Simplify `ProjectImageGallery` to a single static main image with skeleton (drop `imagePack`, the 2×3 thumbnail grid, `selectedImage` state, click-to-swap)

## 2. Developer slot

- [x] 2.1 Add `DevAvatar` (square `rounded-xl` image; `User` placeholder when no avatar)
- [x] 2.2 Add `DevSlot` with count-adaptive layout: 1 → image + name + bio; 2 → image+name pair; 3–6 → image-only thumbnails (2 rows); cap at 6
- [x] 2.3 Attribution modes via `devList()`: `named` (avatar + display_name + bio), `anonymized` (placeholder + "Developer A/B…", no bio), `hidden` (no slot)

## 3. Icon-and-label link buttons

- [x] 3.1 Rewrite `ProjectLinkCard` to a compact icon-and-label `motion.a` button (icon + label text, glass, hover-lift, new tab, `aria-label`); remove `usePortfolioImage`/`previewImage`/overlay/9:16

## 4. Side column + wiring

- [x] 4.1 Add `ProjectSideColumn` (`flex-1 flex flex-col gap-3`): `DevSlot` (top), GitHub, Live
- [x] 4.2 Top layout: `flex gap-3` → main image `w-[60%]` (or `w-full` when no credits) + `ProjectSideColumn`; `hasCreditsContent()` guard
- [x] 4.3 Remove the after-description credits row, the bottom 2-col link grid, the old developer pills, and unused `hasLinks`/label/`lang` locals
- [x] 4.4 Update the loading skeleton to match (main image + dev slot + 2 button skeletons)

## 6. Mobile tabs

- [x] 6.1 Add `CreditTab` (shared icon+label tab; `motion.a` for links, `motion.button` for the dev tab)
- [x] 6.2 Add `ProjectCreditsTabs` (mobile): three uniform tabs — developer name only (no photo), GitHub, Live
- [x] 6.3 Make the top section responsive: desktop (`md+`) keeps the image + side column; mobile (`< md`) shows full-width image + tabs
- [x] 6.4 Developer tab is a button stub (future: opens a dev-info window)

## 5. Verify

- [x] 5.1 `tsc --noEmit`, `eslint`, and `vite build` pass
- [ ] 5.2 Visual: 1 dev (image+name+bio); 2 devs; 3–6 (thumbnails); anonymized; hidden (links only); no links (devs only); neither (image full-width) — **needs your eyes**
- [ ] 5.3 Mobile (375px): image|column split stays readable; text truncates/clamps
- [ ] 5.4 RTL: mirrored image|column reads correctly
- [x] 5.5 Run `openspec validate combine-modal-developer-links`
