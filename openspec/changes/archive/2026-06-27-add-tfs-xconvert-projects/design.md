## Context

keisar.club renders its portfolio from a single Supabase `projects` table. Rows carry bilingual (`{ en, he }`) JSONB narrative fields, a non-translatable identity/media set, and "agency" fields (`status`, `client_visibility`, `dev_attribution`, dates). The home page's code carousel queries `getProjects({ projectType: 'Web-Development', status })` per spiral; the project modal reads a single row via `getProjectBySku`. Images are signed URLs from the `products-image` bucket.

There are 12 existing rows (9 published, 3 unpublished drafts). Adding a project is therefore a **data + media** operation, not a code change — the existing data layer and modal already render any published `Web-Development` row that satisfies the established shape.

Two projects are ready to add:
- **ThreeFingerSwitcher** — macOS menu-bar gesture app. Deep source material: `storyboard/project-overview/ThreeFingerSwitcher/` (overview, journal, README) plus 5 drafted LinkedIn posts. Icon at `Resources/Branding/AppIcon-256.png`. Repo: `github.com/amitayks/ThreeFingerSwitcher` (GPL-3.0, notarized DMG releases).
- **Xconvert** — macOS drop-to-convert video utility. **No storyboard record**; copy must be authored from the repo (`README.md`, `CLAUDE.md`, `openspec/specs/`). Icon at `Resources/AppIcon.icns`. Repo: `github.com/amitayks/Xconvert`.

The established row shape (confirmed against `WEB-VISARA`, `WEB-AGENTMESH`, `WEB-GLOBAL-WEATHER`):
- `settings`: `{ "dir": "ltr", "imageAspect": "square" }`
- `additionalInfo`: array of `{ "label": { en, he }, "value": { en, he } }` (≈6 spec rows shown in the modal)
- `liveSite` / `github`: `{ link, label: {en,he}, subHeader: {en,he}, previewImage: { dark, light } }`
- `technologies`: `text[]`
- `imagePack`: `text[]` of `products-image` object keys (may be empty)

## Goals / Non-Goals

**Goals:**
- Two complete, accurate, bilingual published entries that render identically in quality to the existing web projects.
- Xconvert copy authored from its repo (no storyboard dependency).
- All referenced media present in `products-image` and resolving to signed URLs.
- A clean publish gate: nothing goes live half-built.

**Non-Goals:**
- No changes to keisar.club application code, the data layer, the modal, build, or any existing row.
- No new storyboard records or LinkedIn posts (separate pipeline; out of scope here).
- No Isotopia/DOSE entry (explicitly deferred by the user this session).
- No image *design* beyond preparing/exporting usable assets from each app's existing icon plus screenshots.

## Decisions

### D1 — One change, one new capability spec, two entries
Both entries share the same publish contract, so they live under a single capability (`portfolio-entries-tfs-xconvert`) with a shared contract requirement plus a per-project requirement. Alternative (a capability per project) was rejected as sprawl for two rows that ship together.

### D2 — `projectType = 'Web-Development'` for both
The code carousel filters on `Web-Development`. Existing native-app rows (Addit Android, Visara) already use `Web-Development` rather than a platform-specific type, so these native macOS apps follow the same convention. Inventing a `macOS`/`Desktop` type would require carousel changes (out of scope).

### D3 — Status, featured, priority
- **ThreeFingerSwitcher → `status = 'ongoing'`, `featured = true`.** Pre-1.0 (v0.x tags through v0.11.0) and under active development (commits through Jun 14), so it sits in the Ongoing spiral alongside AgentMesh/Addit. It's the flagship of the two → featured. Priority **13** (just below the ongoing Addit cluster at 14–15, above the floor). *This is the main judgment call — see Open Questions; trivially switchable to `finished` if preferred.*
- **Xconvert → `status = 'finished'`, `featured = false`.** Small, stable, single-purpose utility; works and is done. `finished_at = 2026-06-15` (last commit). Priority **5** (a minor utility; below the finished cluster at 8–10). Not featured.

### D4 — Link cards
- **TFS:** `github` → `github.com/amitayks/ThreeFingerSwitcher`; `liveSite` → `.../releases/latest` as the "download the DMG" surface (the README leads with this). Both cards get dark/light `previewImage`s, or `previewImage` left as `{ "": "" }` if no screenshot is prepared (matches existing rows that ship without previews).
- **Xconvert:** `github` → `github.com/amitayks/Xconvert`; **`liveSite = null`** (local personal tool, no hosted URL).

### D5 — Image pipeline
Per project: export the app icon to a web raster (PNG/JPG) → upload to `products-image/<folder>/`; capture a small gallery of screenshots (TFS: switcher/launcher/Hub; Xconvert: the drop-zone + a converted-result state) → upload and reference in `imagePack`; optionally prepare dark/light link-card previews. `image` (icon) is mandatory; `imagePack` and `previewImage` are best-effort and only referenced if the object was actually uploaded (per the "no dangling image paths" requirement). Folders: `threeFingerSwitcher/`, `xconvert/`. Source icons: TFS `Resources/Branding/AppIcon-256.png`; Xconvert `Resources/AppIcon.icns` (export a 256–512px PNG from the `.icns`).

### D6 — `settings.imageAspect` value
The column default is `"square"`, but existing seeded rows carry a typo `"squere"`. Use the correct `"square"` **only after** confirming `ProjectImageGallery` / modal-gallery code does not key specifically off the misspelling; if the renderer matches `"squere"`, match the existing data to avoid a layout regression. Resolve during implementation by reading the gallery component. Default `settings = { "dir": "ltr", "imageAspect": <verified> }`.

### D7 — Content sourcing & accuracy
- **TFS:** distill (don't copy) the storyboard overview/README into ~tight modal copy; keep claims true (passive multitouch, spec-first 29 capabilities / 848 tests, notarized DMG, GPL-3.0, MLX/Gemma on Apple Silicon).
- **Xconvert:** author from the repo; preserve the conversion contract facts and the "fully local, no network/API/telemetry" framing. Both: write English first, then adapt natural Hebrew.

### D8 — Apply via Supabase MCP, publish last
Create both rows with `publish = false` (insert via `execute_sql` / `apply_migration`), upload media, wire image paths, verify the modal in both languages, then a final `UPDATE ... SET publish = true`. Rollback is a single `UPDATE publish = false` (or `DELETE` of the two SKUs) — no app deploy involved.

## Risks / Trade-offs

- **[Hebrew quality]** Literal translation reads poorly and violates the contract → author EN first, then adapt HE naturally; spot-check RTL rendering in the modal (the modal has RTL handling already).
- **[Dangling image paths]** A row referencing an unuploaded key shows broken images → only reference keys after upload; verify every referenced key resolves to a signed URL before publish.
- **[`imageAspect` typo]** Using `"square"` where the renderer expects `"squere"` (or vice-versa) could change gallery layout → verify against `ProjectImageGallery` before committing the value (D6).
- **[Wrong spiral]** Mis-setting `status` puts a card in the wrong spiral (ongoing vs finished) → confirm D3 status choices, especially TFS, before publish.
- **[Accuracy/NDA]** Both are the author's own public projects (no NDA), but technical overclaiming is still a risk → keep copy faithful to repo/README facts.

## Migration Plan

1. Prepare and upload media to `products-image/threeFingerSwitcher/` and `products-image/xconvert/` (icons mandatory; gallery/previews best-effort).
2. Insert both rows with `publish = false`, full bilingual content, links, `technologies`, `additionalInfo`, `settings`, status/priority/featured/visibility, and verified image paths.
3. Verify each entry in the live project modal in EN and HE (all sections populated, icon + any gallery resolve, links correct).
4. `UPDATE projects SET publish = true` for both SKUs.
5. **Rollback:** `UPDATE projects SET publish = false` (instant hide) or `DELETE FROM projects WHERE "SKU" IN (...)` plus removing the uploaded folders.

## Open Questions

- **TFS status** — `ongoing` (default, D3) vs `finished`? Decides which spiral it lands in. Easy to flip.
- **TFS `liveSite`** — include the releases/download card (D4) or GitHub-only like Xconvert?
- **Priorities** — `13` (TFS) and `5` (Xconvert) are reasonable defaults relative to the existing rows; adjust if a different ordering is wanted.
- **Gallery depth** — how many screenshots per project for `imagePack` (or icon-only to start)?
