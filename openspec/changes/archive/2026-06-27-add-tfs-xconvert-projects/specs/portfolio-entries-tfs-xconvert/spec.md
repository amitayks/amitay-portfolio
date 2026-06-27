## ADDED Requirements

### Requirement: Publishable portfolio-entry contract
Each new entry SHALL be a `projects` row that satisfies the existing `portfolio-data-layer` and project-modal rendering contract before `publish` is set to `true`. Specifically, a publishable entry SHALL have: `projectType = 'Web-Development'`; a unique `SKU`; non-empty bilingual (`{ en, he }`) values for `title`, `description`, `longDescription`, `problem`, `what_i_built`, `how_it_works`, and `result`; a populated `technologies` text array; a populated `additionalInfo` array of `{ label: { en, he }, value: { en, he } }` entries; a `settings` object; an `image` (icon) path that resolves in the `products-image` bucket; and `client_visibility` / `dev_attribution` set. Hebrew SHALL be a natural adaptation of the English, not a literal machine translation.

#### Scenario: Entry renders completely in the modal
- **WHEN** a published new entry is opened in the project modal in either language
- **THEN** the title, description, long description, and the problem / what-I-built / how-it-works / result sections all render with non-empty text in the active language, with no missing-field gaps

#### Scenario: Entry appears in the code carousel
- **WHEN** the home page loads and `getProjects({ projectType: 'Web-Development', status })` runs for the entry's status
- **THEN** the entry appears as a card in the corresponding spiral, ordered by the data-layer's rules for that status

#### Scenario: Icon resolves
- **WHEN** the carousel card or modal requests the entry's `image` via `getPortfolioImage(image)`
- **THEN** a signed URL is returned from the `products-image` bucket and the icon renders (no broken image)

### Requirement: ThreeFingerSwitcher entry
A `projects` row SHALL exist with `SKU = 'WEB-THREEFINGERSWITCHER'`, `projectType = 'Web-Development'`, `featured = true`, `client_visibility = 'hidden'`, and `dev_attribution = 'named'`. Its bilingual content SHALL describe a macOS menu-bar app that recreates the Windows Precision Touchpad three-finger window-switcher gesture via passive reads of the private `MultitouchSupport.framework`, plus its optional four-finger launcher, clipboard/files bands, Dock-window previews, on-device (MLX / Gemma) AI command band, and per-app/per-site keyboard language. Its `github` link card SHALL point to `https://github.com/amitayks/ThreeFingerSwitcher`. Content SHALL be accurate to the project (spec-first build, passive multitouch architecture, Developer-ID-signed notarized DMG, GPL-3.0) and SHALL be distilled from `storyboard/project-overview/ThreeFingerSwitcher/` and the repo README.

#### Scenario: ThreeFingerSwitcher identity and links
- **WHEN** the `WEB-THREEFINGERSWITCHER` row is fetched via `getProjectBySku('WEB-THREEFINGERSWITCHER')`
- **THEN** it returns `projectType = 'Web-Development'`, `featured = true`, a `github` card linking to `github.com/amitayks/ThreeFingerSwitcher`, and bilingual narrative fields describing the gesture app

#### Scenario: ThreeFingerSwitcher download/live card
- **WHEN** the entry is rendered and a `liveSite` card is present
- **THEN** it points to the project's release/download surface (`github.com/amitayks/ThreeFingerSwitcher/releases/latest`) rather than to an unrelated URL

### Requirement: Xconvert entry
A `projects` row SHALL exist with `SKU = 'WEB-XCONVERT'`, `projectType = 'Web-Development'`, `status = 'finished'`, `client_visibility = 'hidden'`, and `dev_attribution = 'named'`. Its bilingual content SHALL describe a fully-local macOS SwiftUI utility that converts any video into an X (Twitter)-ready MP4 (`≤1280` longest edge, 30 fps, H.264 High + AAC, `yuv420p`, `+faststart`), using AVFoundation to inspect the source and a bundled `ffmpeg` to transcode, with inspection-driven branches for missing-audio and HDR→SDR. Its `github` link card SHALL point to `https://github.com/amitayks/Xconvert`. Because Xconvert has no storyboard record, its copy SHALL be authored from the repo (`README.md`, `CLAUDE.md`, `openspec/specs/`) and SHALL be technically accurate (no network/API/telemetry; SwiftPM-built `.app`; arm64 / macOS 13+).

#### Scenario: Xconvert identity and links
- **WHEN** the `WEB-XCONVERT` row is fetched via `getProjectBySku('WEB-XCONVERT')`
- **THEN** it returns `projectType = 'Web-Development'`, `status = 'finished'`, a `github` card linking to `github.com/amitayks/Xconvert`, and bilingual narrative fields describing the video converter

#### Scenario: Xconvert is GitHub-only
- **WHEN** the Xconvert entry is rendered
- **THEN** no `liveSite` card claims a hosted/live URL (it is a local personal tool); only the `github` card is present

### Requirement: Media assets in storage
Each entry's images SHALL be uploaded to the `products-image` bucket under a per-project folder (`threeFingerSwitcher/` and `xconvert/`). At minimum each entry SHALL have an icon referenced by `image`. Where a gallery (`imagePack`) and/or link-card `previewImage` (`{ dark, light }`) are referenced by the row, the referenced object keys SHALL exist in the bucket and resolve to signed URLs. No row SHALL reference an image path that does not exist in storage.

#### Scenario: Referenced images exist
- **WHEN** any `image`, `imagePack` entry, or `liveSite`/`github` `previewImage` value on a new row is requested
- **THEN** the corresponding object exists in the `products-image` bucket and a signed URL is returned (no 404 / null)

#### Scenario: Icons sourced from the apps
- **WHEN** the icons are prepared
- **THEN** ThreeFingerSwitcher's icon derives from `Resources/Branding/AppIcon-256.png` and Xconvert's from `Resources/AppIcon.icns`, exported to a web-served raster in the bucket

### Requirement: Publish gating
Neither row SHALL have `publish = true` until its content and media are complete per the publishable-entry contract and verified to render in the live project modal. The rows MAY be created with `publish = false` first and flipped to `true` as the final step.

#### Scenario: No premature publish
- **WHEN** a row is missing any required bilingual field or references an image not yet uploaded
- **THEN** `publish` remains `false` and the entry does not appear on the public site

#### Scenario: Publish after verification
- **WHEN** all required fields are present, all referenced images resolve, and the modal has been visually verified in both languages
- **THEN** `publish` is set to `true` and the entry goes live in the carousel and modal
