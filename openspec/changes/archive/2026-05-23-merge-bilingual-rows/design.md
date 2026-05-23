## Context

The site is a single-author portfolio with bilingual content (English + Hebrew). Today every translatable row in Supabase lives twice — once per language. There are two tables affected:

- **`public.projects`** — 12 SKUs × 2 langs = 24 rows. The `lang` column and a partial `(SKU, lang)` uniqueness pattern model the duplication.
- **`public.site_content`** — ~82 keys × 2 langs = 164 rows. `UNIQUE(key, lang)` enforces the pair.

`LanguageContext` already preloads both languages for site content (see `useSiteText.ts` and the `// Both languages are always loaded by useSiteText` comment in `LanguageContext.tsx:52`). Projects do not — they refetch on each language toggle.

Drift is already visible: 8 SKUs have different `finished_at` between their EN/HE rows. Non-translatable fields (`priority`, `featured`, `developers[]`, dates) being stored twice has no upside and silent drift downside. Only one author edits this data, so editing twice per change is pure friction.

Constraints:

- Single live site, single admin. Acceptable downtime for migration: minutes.
- No external consumers of the schema — no migration coordination beyond this repo.
- Code that reads `t(key)` should keep working with a thin shim (string in, string out) so we don't have to touch every consumer in lockstep with the schema change.

## Goals / Non-Goals

**Goals:**

- One row per project; one row per content key. Drift becomes structurally impossible.
- Translatable text stored as JSONB `{ en, he }`. Non-translatable fields stay scalar / typed as before.
- Active language is picked at render time, with **EN-fallback** when the active locale's value is empty or null.
- Admin editor shows paired EN/HE inputs for every translatable field, plus a small "missing translation" badge per field where one locale is empty.
- Migration is one big-bang Supabase migration that merges existing rows, drops `lang`/old columns, and ships with the matching code change.
- Drop site-content keys that are not referenced anywhere in `src/` (11 keys × 2 langs = 22 rows).

**Non-Goals:**

- Adding a third locale. The shape supports it, but no consumer or admin UI work targets it now.
- Auto-translation. Missing HE strings fall back to EN; the admin fills them in manually over time.
- Dual-write backwards-compatibility window. Big-bang is fine at this scale.
- Reworking how the language toggle's dissolve/assemble transition works. The transition stays; only what it transitions over changes.
- Replacing `t(key)` consumers' string-in/string-out contract. Sections, cards, modal, etc. continue calling `t("hero.subtext")` and get a string back.

## Decisions

### Decision 1: JSONB `{en, he}` over per-locale columns

**Choice:** Translatable text columns become JSONB of shape `{ "en": string | null, "he": string | null }`. JSONB columns that already exist (`additionalInfo`, `liveSite`, `github`) keep their outer shape; their translatable string leaves (`label`, `subHeader`, `value`) take the `{en, he}` shape at the leaf.

**Why over dual columns (`title_en`, `title_he`, …):**

- Adding a third locale later is a single per-row data edit, not a schema migration on every translatable column.
- Mirrors the existing JSONB pattern already used by `additionalInfo`, `liveSite`, `github`, `settings`.
- Keeps the column list short — the projects table already has ~30 columns.
- TypeScript can express the shape with one `Translated<T>` helper.

**Trade-off:** querying "show me all titles in HE" becomes `title->>'he'` instead of `title_he`. The site never does this query; the admin lists by id/SKU.

### Decision 2: EN-fallback at the render boundary (not at the query boundary)

**Choice:** Queries return the full `{ en, he }` object. A small `useTranslated(value)` hook (or `pickLang(value, lang)` helper) picks the active language at render time, returning `value[lang] ?? value.en ?? null`.

**Why:**

- Keeps the cache shape language-agnostic — one row in cache serves both languages with zero refetch on toggle.
- The dissolve/assemble transition in `LanguageContext` already assumes both languages are instantly available; this aligns projects with that mental model.
- Fallback policy lives in one place and is easy to change.

**Alternative considered:** flatten at query time into a per-lang object. Rejected — defeats the "fetch once, serve both" property and would force `lang` back into the React Query key.

### Decision 3: `t(key)` keeps its string-in/string-out contract

**Choice:** `useSiteText()` still returns `t(key, fallback?) → string`. Internally it reads `contentMap[key]?.[lang] ?? contentMap[key]?.en ?? fallback ?? key`.

**Why:** ~80 call sites would otherwise need to change in lockstep with the schema. Keeping the contract means consumers don't move and the change stays focused on the data-layer and admin.

### Decision 4: Drop the `lang` column entirely (no soft-deprecation)

**Choice:** The migration drops `lang` from both `projects` and `site_content` in the same transaction that introduces the JSONB columns.

**Why:**

- Big-bang already commits to ship-together; keeping `lang` around adds zero value once code stops reading it.
- `(SKU, lang)` and `(key, lang)` uniqueness constraints get replaced by `(SKU)` and `(key)` uniqueness, which is the structural guarantee we want.

### Decision 5: Non-translatable drift resolved as "EN wins"

**Choice:** Where the EN and HE rows of the same SKU disagree on a non-translatable field (`priority`, `featured`, `status`, `started_at`, `finished_at`, `developers[]`, `assigned_manager`, `client_visibility`, `dev_attribution`, `image`, `imagePack`, `technologies`, `projectType`, `publish`, `settings`, `liveSite.link`, `liveSite.previewImage`, `github.link`, `github.previewImage`), the EN row's value is kept.

**Why:** The user explicitly said "just merge, no translation needed, copy existing." EN is the canonical write surface in the admin today (the editor defaults to `lang='en'`). Picking a deterministic rule lets the migration run unattended; user confirms the resulting state after.

**Audit trail:** the migration logs (via `RAISE NOTICE` / temp table) which SKUs had a drift and on which field, so the admin can sanity-check after.

### Decision 6: SKU-only rows; EN-only rows kept with `he = null`

**Choice:** If a SKU has only an EN row (no HE counterpart), the merged row holds the EN values in the JSONB `en` slot and `null` in the `he` slot. Same applies in reverse. Render-time fallback covers the UI.

**Why:** Aligns with Decision 2. No data is lost.

**Note:** Inspection of current data shows every SKU has both EN and HE rows, but the rule covers any drift introduced before the migration runs and is the natural extension of the JSONB shape.

### Decision 7: Drop 11 confirmed-unused `site_content` keys

**Choice:** The following keys (verified by grep of `t("…")` in `src/`, including dynamic-key patterns in Navbar/SkillsGrid/ContactForm/Footer/Hero/HowIWork/Stats/Testimonials) are removed in the migration:

```
contact.form.email           contact.form.name
contact.form.subject         contact.form.message
footer.contact               footer.privacy
footer.terms                 lang.toggle
hero.badge                   hero.cta.primary
hero.cta.secondary
```

That's 11 keys × 2 langs = 22 rows.

**Why:** The text columns in `Footer.tsx` are hardcoded English ("Terms", "Privacy", "Email"), the `LanguageToggle` is hardcoded with no `useSiteText` import, `Hero` has no badge or text CTA, and `ContactForm` uses only the `.placeholder` variants of its form-field keys (labels are hardcoded). They cost a row each and confuse future editors.

**Trade-off:** if the admin ever wants to re-translate one of these UI elements, the row needs to be re-added. Acceptable — adding a row is a 30-second admin task.

### Decision 8: Admin editor goes from "two rows" to "one form with paired inputs"

**Choice:** The admin project editor and (future) site-content editor render every translatable field as two side-by-side inputs, labeled `EN` and `HE`. The `lang` selector is removed. A small badge ("Missing HE" / "Missing EN") appears on the field row when one side is empty.

**Why:** Mirrors the new schema directly. Eliminates the "did I update both rows?" cognitive load.

### Decision 9: Big-bang ship — DB migration + code change in one commit

**Choice:** A single Supabase migration creates JSONB columns, copies/merges data, drops `lang` + old text columns, removes unused content keys — all in one transaction. The matching code change ships in the same commit. Apply order: migration first via `mcp__supabase__apply_migration`, then push code.

**Why:** No external consumers, one admin, 24 + 164 rows of data. Coordinating a dual-write window costs more than it saves.

**Rollback:** the migration is wrapped in a transaction; failure rolls back automatically. If a code-side bug surfaces post-deploy, `git revert` brings back the old code, but the DB cannot be unmigrated trivially. Mitigation: take a `pg_dump` of both affected tables immediately before applying the migration and keep it for at least 30 days.

## Risks / Trade-offs

- **Hardcoded paths break silently if `value->>'en'` returns null.** → `useTranslated` and `t()` always fall back to EN then to fallback then to key; renders never crash on null.
- **Migration could mis-merge if a SKU has unexpected duplicates (e.g., two EN rows).** → Migration starts with an assertion: `SELECT SKU, lang, count(*) FROM projects GROUP BY 1,2 HAVING count(*) > 1`; fails loudly if any row exists.
- **Drift resolution silently drops the HE row's non-translatable value.** → Migration writes a `RAISE NOTICE` (or stages a temp table) per drift it resolves, so the post-migration check is explicit, not hidden.
- **Dropping site-content keys removes recoverable data.** → All 22 rows are preserved in the migration's pre-snapshot (`pg_dump`) and the keys are documented in `tasks.md`; re-adding is one row each via the admin.
- **`additionalInfo` is editor-defined JSON — admins might paste shapes that don't match `{en, he}` at the leaves.** → The admin's `JsonField` for `additionalInfo` (and `liveSite`/`github`) gets a documented shape in `help=`; the migration converts existing string leaves to `{en: <value>, he: null}`.
- **React Query cache shape changes.** → Bump the IndexedDB persist key from `portfolio-v2-cache` to `portfolio-v3-cache` so existing visitors don't get a stale-shape error on first load after deploy.

## Migration Plan

1. **Snapshot.** `pg_dump` of `public.projects` and `public.site_content`, stored locally and noted in tasks.md.
2. **Pre-flight assertion.** Migration's first statement: assert no `(SKU, lang)` or `(key, lang)` duplicates beyond the expected 1:1.
3. **Add JSONB columns.** `projects`: `title_i18n`, `description_i18n`, `long_description_i18n`, `problem_i18n`, `what_i_built_i18n`, `how_it_works_i18n`, `result_i18n`, `company_name_i18n`, `duration_i18n`. `site_content`: `value_i18n`.
4. **Populate JSONB.** For each SKU/key, merge the EN and HE rows into a single object per field. For JSONB columns with translatable leaves (`additionalInfo`, `liveSite`, `github`), rewrite leaf strings as `{en, he}` shapes.
5. **Collapse rows.** For projects: keep the EN row as canonical, delete the HE row; rename `*_i18n` columns to the original names; drop `lang`. For site_content: same pattern. Drop the `(SKU, lang)` / `(key, lang)` unique constraints; add `(SKU)` / `(key)` unique.
6. **Drop unused content keys** (Decision 7).
7. **Verify.** Migration ends with: `SELECT count(*) FROM projects` (expect 12), `SELECT count(*) FROM site_content` (expect ~71), `SELECT count(*) FROM projects WHERE title->>'en' IS NULL OR title->>'he' IS NULL` (expect rows match drift audit).
8. **Bump query cache key** in `src/lib/queryClient.ts` from `portfolio-v2-cache` to `portfolio-v3-cache`.
9. **Ship code.** Service layer, hooks, types, admin editor, all consuming sections.
10. **Manual smoke** — load HE, load EN, toggle, open every spiral, open a case study, edit a project, save, observe no console errors.

**Rollback:** restore from snapshot, `git revert` the code commit. There is no in-flight dual-write path to unwind.

## Open Questions

- Should `technologies[]` be translatable? Today it renders as-is in both langs (e.g., "React Native"). **Tentative: no** — leave as `text[]`. Reopen if the admin wants Hebrew transliterations.
- Should `duration` ("3 months") be translatable? It's not currently localized but reads as English-ish. **Tentative: yes** — include in the JSONB set, since Hebrew typography reads better with native phrasing.
- Future site-content admin UI lives in this change or follows separately? **Tentative: follows separately** — this change updates the schema so a future admin page can be built against `{en, he}` directly. Today site-content is edited by hand in Supabase.
