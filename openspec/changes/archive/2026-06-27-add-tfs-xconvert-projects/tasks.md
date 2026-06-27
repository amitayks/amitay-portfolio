## 1. Author content — ThreeFingerSwitcher

- [x] 1.1 Read `storyboard/project-overview/ThreeFingerSwitcher/` (overview, journal) and the repo README; extract the facts (passive multitouch, launcher/bands, Dock previews, on-device MLX/Gemma AI, keyboard-language, spec-first build, notarized DMG, GPL-3.0)
- [x] 1.2 Write English `title`, `description` (short), `longDescription`, `problem`, `what_i_built`, `how_it_works`, `result` — faithful, non-overclaiming
- [x] 1.3 Adapt natural Hebrew for each of the above (not literal translation); keep technical terms readable in RTL
- [x] 1.4 Compose `technologies[]` (Swift, SwiftUI, AppKit, MultitouchSupport, CGS / SkyLight, MLX, Gemma, OpenSpec) and `additionalInfo` (6 `{label,value}` bilingual rows: Platform, Architecture, On-Device AI, Tests, Distribution, License)

## 2. Author content — Xconvert (from repo, no storyboard)

- [x] 2.1 Read `/Users/amkeisar/Keisar/Projects/Xconvert` `README.md`, `CLAUDE.md`, and `openspec/specs/` to extract the conversion contract and architecture
- [x] 2.2 Write English `title`, `description`, `longDescription`, `problem`, `what_i_built`, `how_it_works`, `result` (X tweet-video spec, AVFoundation inspect + bundled ffmpeg, no-audio/HDR branches, fully local)
- [x] 2.3 Adapt natural Hebrew for each of the above
- [x] 2.4 Compose `technologies[]` (Swift, SwiftUI, AVFoundation, FFmpeg, SwiftPM) and `additionalInfo` (5 bilingual rows: Platform, Engine, Output, Privacy, Build)

## 3. Prepare and upload media

- [x] 3.1 Verify `settings.imageAspect` value against the gallery code — resolved: `ProjectImageGallery`/`ProjectModal` always render `aspect-square` (value is cosmetic), so `"square"` is used on both rows
- [x] 3.2 Export TFS icon from `Resources/Branding/AppIcon-256.png` (256², staged at `scratchpad/icons/threeFingerSwitcher-icon.png`) — **upload to `products-image/threeFingerSwitcher/threeFingerSwitcher-icon.png` pending (human step)**
- [x] 3.3 Export Xconvert icon from `Resources/AppIcon.icns` (512² PNG, staged at `scratchpad/icons/xconvert-icon.png`) — **upload to `products-image/xconvert/xconvert-icon.png` pending (human step)**
- [ ] 3.4 Capture gallery screenshots — TFS (switcher / launcher / Hub) and Xconvert (drop-zone / converted result); upload to each folder; add object keys to `imagePack` (icon-only is acceptable to ship — rows currently have empty `imagePack`)
- [ ] 3.5 (Optional) Prepare dark/light link-card `previewImage`s; upload — otherwise `previewImage` stays `{ "dark": "", "light": "" }`
- [x] 3.6 Confirmed both icon objects exist in `products-image` (`TFS/TFS-icon.png`, `xconvert/xconvert-icon.png`); TFS `image` path repointed to the as-uploaded `TFS/TFS-icon.png`; no dangling paths

## 4. Create the rows (publish = false)

- [x] 4.1 Insert `WEB-THREEFINGERSWITCHER` (id 78) — `Web-Development` / `ongoing` / `featured` / `priority 13` / `hidden` / `named`, full bilingual fields, techs, additionalInfo, settings, image path, `github` + `liveSite` (releases/latest), `publish=false`
- [x] 4.2 Insert `WEB-XCONVERT` (id 79) — `Web-Development` / `finished` (`finished_at 2026-06-15`) / `priority 5` / `hidden` / `named`, full bilingual fields, techs, additionalInfo, settings, image path, `github`, `liveSite=null`, `publish=false`
- [x] 4.3 Sanity-check both rows — all 7 bilingual narrative fields non-empty (en+he), additionalInfo parsed, Hebrew renders, links + image paths set

## 5. Verify in the live modal

- [x] 5.1 Data-verified: all 7 narrative sections non-empty (EN), icons exist + referenced, `github`/`liveSite` links correct (final visual pass folded into 6.2)
- [x] 5.2 Data-verified: HE present for every field, `settings.dir=ltr` + modal RTL handling apply, links/SKUs are LTR tokens (final visual pass folded into 6.2)
- [x] 5.3 Placement is deterministic from `status`: TFS (`ongoing`) → Ongoing spiral, Xconvert (`finished`) → Finished spiral

## 6. Publish and finalize

- [x] 6.1 `UPDATE projects SET publish = true` for both SKUs — both now live (icons verified present)
- [ ] 6.2 Re-load the live site and confirm both cards appear in their spirals and open correctly (your eyeball)
- [ ] 6.3 `openspec sync` delta specs to main specs, then archive the change (`openspec archive add-tfs-xconvert-projects`)
