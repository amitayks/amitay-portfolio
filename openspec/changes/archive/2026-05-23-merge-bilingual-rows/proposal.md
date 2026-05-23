## Why

Today every translatable row in Supabase exists twice — once with `lang='en'`, once with `lang='he'`. That covers 12 projects (24 rows) and ~82 site-content keys (164 rows). Editing anything means opening two records and keeping them in sync, and drift has already started: 8 projects have different `finished_at` between their EN and HE rows, and other non-translatable fields can silently diverge too. Collapsing to one row per logical entity, with translatable fields stored as JSONB `{ en, he }`, makes drift structurally impossible and turns the admin into a single side-by-side form.

## What Changes

- **BREAKING — `projects` schema:** translatable text columns (`title`, `description`, `longDescription`, `problem`, `what_i_built`, `how_it_works`, `result`, `company_name`, `duration`) become JSONB of shape `{ en: string|null, he: string|null }`. JSONB columns that contain translatable substrings (`additionalInfo[*].label/value`, `liveSite.label/subHeader`, `github.label/subHeader`) carry the same `{en, he}` shape at the leaf. The `lang` column and the per-lang row duplication are removed; the table holds **one row per SKU**.
- **BREAKING — `site_content` schema:** `value` becomes JSONB `{ en, he }`. The `lang` column is removed. Unique constraint moves from `(key, lang)` to `(key)`. The table holds **one row per key**.
- **BREAKING — service layer:** `getProjects` / `getProjectBySku` / `fetchSiteContent` stop taking a `lang` argument; they return rows with `{en, he}` fields. A single `useTranslated(value)` helper picks the active language at render time, with **EN fallback** when the active locale is empty/null.
- **Admin editor:** project and site-content forms render every translatable field as a paired EN/HE input. A small "missing translation" badge surfaces fields where one locale is empty so they're visible at a glance.
- **React Query keys:** drop `lang` from `['projects', …]`, `['project', SKU, …]`, and `['site_content', …]` keys, since a single fetch now serves both languages. `LanguageContext` already preloads both — after this change, the same becomes true for projects too, with no refetch on toggle.
- **Cleanup:** drop unused `site_content` keys identified by a manual audit of `t("…")` references (including dynamically-built keys).
- **Big-bang migration:** a single Supabase migration creates the JSONB columns, copies/merges the existing EN+HE rows into one row each, then drops the old columns. Where EN-and-HE diverge on a non-translatable field, the EN row wins. Where only EN data exists, HE is left null (and falls back to EN at render time).

## Capabilities

### New Capabilities
_(none — every concern fits an existing capability)_

### Modified Capabilities
- `supabase-i18n`: row-per-lang model removed; values become JSONB `{en, he}`; `useSiteText` fetches once; new `useTranslated` helper governs picking + fallback.
- `portfolio-data-layer`: `projects` and `site_content` queries lose their `lang` argument and `lang` query-key dimension; rows return with `{en, he}` shape; per-query stale times unchanged.

Note: the matching admin-console requirements (paired EN/HE inputs, missing-translation badge, completeness indicator) are folded directly into the still-in-flight `keisar-club-platform` change's `admin-console` delta, since `admin-console` is not yet a main spec. The code for those requirements ships with this change.

## Impact

- **Database:** one big-bang migration on `public.projects` and `public.site_content`. Drops `lang` column on both. Drops unused `site_content` keys. Existing data is merged into the new shape inside the same migration (no data loss).
- **Service layer:** `apiPortfolio.ts`, `apiContent.ts`, `apiAdmin.ts` reshape their queries and return types.
- **Hooks:** `useSiteText`, `usePortfolioItems`, `usePortfolioItem`, `usePortfolioImage`/`useSiteImage` (key shape only). New `useTranslated` (or equivalent) helper.
- **Types:** `PortfolioItem`, `AdminProjectRow`, `SiteContentMap`, `Language` types updated. New `Translated<T>` helper type.
- **Components consuming `t(...)` and project fields:** no API change for `t(key)` calls (still string in, string out), but all places that read project fields directly (sections, cards, modal) wrap their reads in `useTranslated(...)` or read `.en`/`.he` based on context.
- **Admin UX:** the project editor stops exposing a `lang` selector; instead every translatable field becomes a paired input. A "missing translation" badge highlights gaps.
- **No backwards-compatibility window** — site code and DB ship together. The site is small enough (24 projects, 164 content rows, one admin) that big-bang is safer than a dual-write path.
