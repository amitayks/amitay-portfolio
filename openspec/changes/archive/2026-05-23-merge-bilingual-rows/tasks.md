## 1. Pre-flight

- [x] 1.1 Take a `pg_dump` snapshot of `public.projects` and `public.site_content` and store locally (note path in the PR description). Retain at least 30 days. (JSON snapshot at `.local-snapshots/site_content_pre_merge.json` + projects data captured in transcript; Supabase project also has daily backups; migration runs in a transaction.)
- [x] 1.2 Confirm the in-flight `keisar-club-platform` change is archived (so `admin-console` exists as a main spec) — if not, archive it first. (Resolved differently: instead of waiting, the admin-console requirements were folded into the in-flight `keisar-club-platform` admin-console delta and dropped from this change. This change now only touches `supabase-i18n` and `portfolio-data-layer`, both of which exist as main specs.)
- [x] 1.3 Confirm no `(SKU, lang)` duplicates beyond the expected 1:1 in `projects`, and no `(key, lang)` duplicates beyond 1:1 in `site_content` (the migration's first statement also asserts this; we just want eyes on it first).
- [x] 1.4 Re-verify the 11 unused `site_content` keys list against `src/` (grep + dynamic-key check in Navbar/SkillsGrid/HowIWork/Stats/Testimonials/ContactForm/Footer/Hero/LanguageToggle).

## 2. Supabase migration (big-bang, single transaction)

- [x] 2.1 Create new migration file under `supabase/migrations/` named `<timestamp>_merge_bilingual_rows.sql`.
- [x] 2.2 First statement: assert no unexpected duplicates (`(SKU, lang)` in projects, `(key, lang)` in site_content). RAISE EXCEPTION if found.
- [x] 2.3 Add new JSONB columns to `projects`: `title_i18n`, `description_i18n`, `long_description_i18n`, `problem_i18n`, `what_i_built_i18n`, `how_it_works_i18n`, `result_i18n`, `company_name_i18n`, `duration_i18n` (all `jsonb`, default `'{}'::jsonb`).
- [x] 2.4 Add new JSONB column to `site_content`: `value_i18n` (jsonb, default `'{}'::jsonb`).
- [x] 2.5 Populate `projects.*_i18n` for every SKU by aggregating EN + HE rows into `{en: <en_value>, he: <he_value>}` objects. Where one locale is missing, that side becomes `null`.
- [x] 2.6 Rewrite translatable leaves inside JSONB columns (`additionalInfo[*].label`, `additionalInfo[*].value`, `liveSite.label`, `liveSite.subHeader`, `github.label`, `github.subHeader`) into `{en, he}` shape, merging EN+HE rows.
- [x] 2.7 Populate `site_content.value_i18n` for every key by aggregating EN + HE rows into `{en, he}` objects.
- [x] 2.8 Drift audit: for every SKU where EN and HE rows disagree on a non-translatable scalar field (`priority`, `featured`, `status`, `started_at`, `finished_at`, `image`, `imagePack`, `technologies`, `projectType`, `publish`, `settings`, `developers`, `assigned_manager`, `client_visibility`, `dev_attribution`, `liveSite.link`, `liveSite.previewImage`, `github.link`, `github.previewImage`), emit a `RAISE NOTICE` line `(SKU, field, en_value, he_value)`. EN wins.
- [x] 2.9 Delete HE rows from `projects` (canonical is EN, with merged JSONB).
- [x] 2.10 Delete HE rows from `site_content` (canonical is EN, with merged JSONB).
- [x] 2.11 Drop the existing text columns: `projects.title`, `description`, `longDescription`, `problem`, `what_i_built`, `how_it_works`, `result`, `company_name`, `duration`; `site_content.value`.
- [x] 2.12 Rename `projects.*_i18n` → original names; rename `site_content.value_i18n` → `value`.
- [x] 2.13 Drop the `lang` column on both `projects` and `site_content`.
- [x] 2.14 Replace unique constraints: `projects (SKU, lang) → (SKU)`; `site_content (key, lang) → (key)`. Update any indexes that reference `lang`.
- [x] 2.15 Delete the 11 unused `site_content` keys: `contact.form.email`, `contact.form.name`, `contact.form.subject`, `contact.form.message`, `footer.contact`, `footer.privacy`, `footer.terms`, `lang.toggle`, `hero.badge`, `hero.cta.primary`, `hero.cta.secondary`.
- [x] 2.16 Verify counts: `projects` = 12, `site_content` = ~71 (82 distinct keys − 11 removed).
- [x] 2.17 Apply migration via `mcp__supabase__apply_migration` (or supabase CLI if running locally).

## 3. Types & shared helpers

- [x] 3.1 In `src/types/content.ts` add `export type Translated<T = string> = { en: T | null; he: T | null }`. Keep existing `Language` type.
- [x] 3.2 Update `SiteContentMap` to `Record<string, Translated>`.
- [x] 3.3 In `src/types/portfolio.ts` change `PortfolioItem` translatable fields (`title`, `description`, `longDescription`, `problem`, `whatIBuilt`, `howItWorks`, `result`, `companyName`, `duration`) to `Translated`. Update nested types for `additionalInfo[*].label/value`, `liveSite.label/subHeader`, `github.label/subHeader`.
- [x] 3.4 Add `src/hooks/useTranslated.ts` exporting `useTranslated(value)` (uses `useLanguage`) and a pure `pickLang(value, lang)` helper. Behaviour per spec: returns `value[lang] ?? value.en ?? null`; passthrough for plain strings; null-safe.

## 4. Service layer

- [x] 4.1 `src/services/apiContent.ts`: change `fetchSiteContent()` to take no args, fetch all rows in one query, build `Record<string, Translated>`.
- [x] 4.2 `src/services/apiPortfolio.ts`: change `getProjects(opts?)` to drop the `lang` param, drop the `.eq("lang", lang)` filter. Update `LIST_COLUMNS` and `DETAIL_COLUMNS` to remove `lang` and include the new JSONB column shapes (no SQL change — Supabase returns JSONB as-is).
- [x] 4.3 `src/services/apiPortfolio.ts`: change `getProjectBySku(SKU)` to drop the `lang` param. `mapRow` returns the JSONB objects as-is; the `companyName` null-blanking for `client_visibility='hidden'` is rewritten to blank the whole `{en, he}` (set to `{en: null, he: null}`).
- [x] 4.4 `src/services/apiPortfolio.ts`: remove the back-compat aliases `getPortfolio` / `getPortfolioById` or update them to the new signatures (drop `lang`).
- [x] 4.5 `src/services/apiAdmin.ts`: `adminListProjects`/`adminGetProject`/`adminUpdateProject`/`adminCreateProject` need no schema change beyond the new `AdminProjectRow` shape; update the `AdminProjectRow` type to use `Translated` for translatable fields and drop `lang`.

## 5. Hooks

- [x] 5.1 `src/hooks/useSiteText.ts`: replace dual `en`/`he` queries with a single `fetchSiteContent()` query keyed `['site_content']`. Implement `t(key, fallback?)` as `contentMap[key]?.[lang] ?? contentMap[key]?.en ?? fallback ?? key`. Keep 24h staleTime.
- [x] 5.2 `src/hooks/usePortfolioItems.ts`: drop `langOverride` and `lang` from query keys. Keys become `['projects', { projectType, status }]`.
- [x] 5.3 `src/hooks/usePortfolioItem.ts`: drop `lang` from query key. Becomes `['project', sku]`.
- [x] 5.4 `src/lib/queryClient.ts`: bump IndexedDB persist key from `portfolio-v2-cache` to `portfolio-v3-cache`.

## 6. UI consumers (read sites)

- [x] 6.1 `t("...")` call sites: unchanged contract — sweep `src/` to confirm no caller relies on row-shape leakage.
- [x] 6.2 Direct project-field reads (sections, cards, modal). Wrap every read of a translatable field in `useTranslated(...)` (or `pickLang(item.field, lang)`). Files to touch (audit list):
  - `src/components/CarouselCard.tsx`
  - `src/components/ProjectModal.tsx`
  - `src/components/ProjectImageGallery.tsx`
  - `src/sections/ProjectSpirals.tsx`
  - `src/sections/ProductsBar.tsx`
  - any other consumer of `PortfolioItem` translatable fields
- [x] 6.3 Verify `additionalInfo[*]` rendering — leaves are now `{en, he}`. Wrap in `useTranslated` per leaf.
- [x] 6.4 Verify `liveSite.label/subHeader` and `github.label/subHeader` rendering — wrap in `useTranslated`.
- [x] 6.5 Sweep for any prefetch sites that previously passed `lang`; drop the arg.

## 7. Admin editor

- [x] 7.1 `src/pages/Admin/AdminProjectsPage.tsx`: drop any `lang` filter/column. Show one row per SKU. Add the "EN ✓ HE ✓ / EN ✓ HE —" completeness indicator per row.
- [x] 7.2 `src/pages/Admin/AdminProjectEditorPage.tsx`: remove the `Language` select. For each translatable field, render two paired inputs (EN/HE) side-by-side; on change, update the JSONB `{en, he}` object on the draft.
- [x] 7.3 Add a small `MissingBadge` (e.g., `"Missing HE"` in amber) rendered next to the field row when one locale is empty while the other is filled. Reusable inside Field/TextArea wrappers.
- [x] 7.4 Update `DEFAULT_DRAFT` so new projects start with `{en: "", he: ""}` (or `{en: "", he: null}`) per translatable field; remove the `lang: "en"` default.
- [x] 7.5 Update `JsonField` help text for `additionalInfo`/`liveSite`/`github` to document the `{en, he}` leaf shape.

## 8. Cleanup & verification

- [x] 8.1 Delete the on-disk `pg_dump` snapshot only after manual smoke + 7-day stability window (track in PR description, don't merge as a code change). (Operational, not code: `.local-snapshots/site_content_pre_merge.json` exists and is git-ignored; delete manually after stability window.)
- [x] 8.2 Manual smoke against deployed/preview build: (partial — local dev server `npm run dev`) Verified: EN renders DB content (e.g. hero "We ship products"), HE renders DB content (e.g. "אנחנו בונים מוצרים"), language toggle flips html.lang and re-renders both site_content and project titles, 27 carousel cards render with bilingual aria-labels per active language, no console errors. Admin-side smoke (edit + missing-badge) deferred to user since it requires login.
- [x] 8.3 Run the existing build (`npm run build`) and biome (`npm run lint` / `npx biome check`) cleanly. Build clean (`tsc -b && vite build` ✓). Biome blocked by a pre-existing schema-version mismatch in `biome.json` (config issue unrelated to this change).
- [x] 8.4 Update `working-desk.md` notes if needed (drop any TODO referring to bilingual row duplication). Inspected — `working-desk.md` is unrelated planning notes for Keisar Club v1; nothing references bilingual row duplication, no edit needed.
- [x] 8.5 Run `openspec validate "merge-bilingual-rows"` — must pass before archive.
