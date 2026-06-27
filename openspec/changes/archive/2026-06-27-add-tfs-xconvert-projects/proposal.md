## Why

Two finished/active projects — **ThreeFingerSwitcher** (a macOS menu-bar gesture app) and **Xconvert** (a macOS drop-to-convert video utility) — are built and public on GitHub but are not yet on keisar.club. The portfolio is the primary place these ship to an audience, and both are ready to go live. This change adds them as published `projects` rows with complete bilingual content and media, so they render in the code carousel and project modal exactly like the existing web projects.

No application code changes are required: the data layer (`portfolio-data-layer`), the code carousel, and the project modal already render any published `Web-Development` row. This is a content + media change against Supabase.

## What Changes

- Add a **ThreeFingerSwitcher** project row (`SKU = WEB-THREEFINGERSWITCHER`, `projectType = Web-Development`), featured, with full bilingual (EN/HE) narrative content distilled from its storyboard record (`storyboard/project-overview/ThreeFingerSwitcher/`) and repo README.
- Add an **Xconvert** project row (`SKU = WEB-XCONVERT`, `projectType = Web-Development`) with full bilingual (EN/HE) content authored from its repo (`README.md`, `CLAUDE.md`, `openspec/specs/`) — Xconvert has **no** storyboard record yet, so its copy is written from source.
- Upload each project's **icon, gallery (`imagePack`), and dark/light link-card preview images** to the `products-image` storage bucket (new folders `threeFingerSwitcher/` and `xconvert/`), and reference them on the rows.
- Populate each row's **`liveSite` / `github` link cards**, `technologies[]`, `additionalInfo`, `settings`, `status`, `priority`, `featured`, `client_visibility`, and `dev_attribution` to match the established row shape.
- Flip `publish = true` on both rows only after content + media are complete and verified in the live modal.

No projects are removed; no existing rows are modified.

## Capabilities

### New Capabilities
- `portfolio-entries-tfs-xconvert`: The published-portfolio-entry contract for the two new projects — required bilingual fields, media in the `products-image` bucket, link cards, ordering/visibility metadata, and the publish gate — such that each entry renders completely and correctly in the code carousel and project modal.

### Modified Capabilities
<!-- None. Adding published Web-Development rows uses the existing portfolio-data-layer query/order contract and the existing project-modal rendering; no requirement-level behavior of any existing capability changes. -->

## Impact

- **Supabase `projects` table** — 2 new rows (`WEB-THREEFINGERSWITCHER`, `WEB-XCONVERT`).
- **Supabase `products-image` storage bucket** — 2 new asset folders (`threeFingerSwitcher/`, `xconvert/`): icon, gallery, and dark/light preview images.
- **Source material (read-only)** — `storyboard/project-overview/ThreeFingerSwitcher/`; the Xconvert repo at `/Users/amkeisar/Keisar/Projects/Xconvert` (README, CLAUDE.md, openspec specs); the TFS repo README + `Resources/Branding/`.
- **No changes** to keisar.club application code, build, the data layer, or any existing row.
