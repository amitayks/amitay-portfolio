## Purpose

The site's internationalization layer: `site_content` and `projects` tables hold bilingual `{en, he}` JSONB; `useSiteText` and `useTranslated` hooks resolve the active language with EN fallback; `LanguageContext` persists the choice; no i18next dependency.

## Requirements

### Requirement: site_content table
A `site_content` table SHALL exist in Supabase with columns: `id` (serial primary key), `key` (text, not null), `value` (jsonb, not null), `created_at` (timestamptz, default now()). The `value` column SHALL conform to the shape `{ "en": string | null, "he": string | null }`. A unique constraint SHALL exist on `(key)`. The `lang` column SHALL NOT exist. RLS SHALL be enabled with a public read policy.

#### Scenario: Table schema
- **WHEN** the `site_content` table is queried
- **THEN** it returns rows with `key` and `value` columns, where `value` is a JSONB object containing `en` and `he` keys

#### Scenario: One row per key
- **WHEN** an insert attempts to create a row with a `key` that already exists
- **THEN** the insert fails with a unique constraint violation

#### Scenario: Missing locale stored as null
- **WHEN** an admin saves a `site_content` row with only the EN value filled in
- **THEN** the stored JSONB is `{ "en": "...", "he": null }` and the unique constraint on `(key)` is still satisfied

### Requirement: Projects table bilingual JSONB
The `projects` table SHALL hold **one row per SKU**. Translatable text columns (`title`, `description`, `longDescription`, `problem`, `what_i_built`, `how_it_works`, `result`, `company_name`, `duration`) SHALL be stored as JSONB of shape `{ "en": string | null, "he": string | null }`. JSONB columns that contain translatable substrings (`additionalInfo[*].label`, `additionalInfo[*].value`, `liveSite.label`, `liveSite.subHeader`, `github.label`, `github.subHeader`) SHALL carry the same `{en, he}` shape at the translatable leaf. The `lang` column SHALL NOT exist. A unique constraint SHALL exist on `(SKU)`.

#### Scenario: Single project row per SKU
- **WHEN** the `projects` table is queried for rows with `SKU = 'WEB-ADDIT-APP'`
- **THEN** exactly one row is returned, containing a JSONB `title` of shape `{ "en": "Addit V1 — AI Call Assistant…", "he": "Addit V1 — עוזר שיחות AI…" }`

#### Scenario: Non-translatable fields remain scalar
- **WHEN** the `projects` table is queried for a row
- **THEN** scalar fields (`priority`, `featured`, `status`, `started_at`, `finished_at`, `developers`, `assigned_manager`, `client_visibility`, `dev_attribution`, `image`, `imagePack`, `projectType`, `technologies`, `publish`, `settings`) remain in their original (non-JSONB) types

#### Scenario: SKU uniqueness enforced
- **WHEN** an insert attempts to create a second row with an existing `SKU`
- **THEN** the insert fails with a unique constraint violation

### Requirement: useSiteText hook
A `useSiteText()` hook SHALL fetch all `site_content` rows in a single query (no `lang` argument), returning a `t(key, fallback?)` function. The query SHALL have a `staleTime` of 24 hours. The returned `t` function SHALL resolve to a string by reading `value[currentLang] ?? value.en ?? fallback ?? key`.

#### Scenario: Translation lookup in active language
- **WHEN** a component calls `t('hero.heading.line1')` while the language is 'he'
- **THEN** it returns the value at `value.he` for the row where `key='hero.heading.line1'`

#### Scenario: EN fallback when active locale value is null
- **WHEN** a component calls `t('contact.subtext')` while the language is 'he' and the row's `value.he` is null
- **THEN** it returns `value.en` for that row

#### Scenario: Fallback when key missing
- **WHEN** a component calls `t('nonexistent.key', 'Fallback Text')`
- **THEN** it returns 'Fallback Text'

#### Scenario: Fallback when no fallback provided
- **WHEN** a component calls `t('nonexistent.key')` without fallback
- **THEN** it returns the key string itself: 'nonexistent.key'

#### Scenario: Single fetch serves both languages
- **WHEN** `useSiteText()` mounts on a page
- **THEN** exactly one Supabase query is issued for `site_content` (not one per language), and toggling the language does NOT trigger a refetch

### Requirement: useTranslated helper
A `useTranslated(value)` hook (or equivalent `pickLang(value, lang)` helper) SHALL accept a value of shape `{ en, he }` and return the string for the active language, falling back to `en` when the active locale is null or empty, and finally to `null` when both are missing.

#### Scenario: Active language has value
- **WHEN** `useTranslated({ en: "Hello", he: "שלום" })` is called while the language is 'he'
- **THEN** it returns "שלום"

#### Scenario: Active language is null — EN fallback
- **WHEN** `useTranslated({ en: "Hello", he: null })` is called while the language is 'he'
- **THEN** it returns "Hello"

#### Scenario: Both null — returns null
- **WHEN** `useTranslated({ en: null, he: null })` is called
- **THEN** it returns `null` and components rendering it MUST handle `null` gracefully (omit the element)

#### Scenario: Plain string passthrough
- **WHEN** `useTranslated("some legacy plain string")` is called
- **THEN** it returns the string unchanged (defensive — keeps the hook safe to call on mixed shapes during migration)

### Requirement: LanguageContext provider
A `LanguageContext` SHALL provide `lang` ('en' | 'he'), `setLang(lang)`, and `dir` ('ltr' | 'rtl') to all components. The selected language SHALL persist in localStorage under key `'portfolio-lang'`. Default language SHALL be 'en'.

#### Scenario: Language persists across sessions
- **WHEN** user selects Hebrew and refreshes the page
- **THEN** the site loads in Hebrew (read from localStorage)

#### Scenario: RTL direction for Hebrew
- **WHEN** language is set to 'he'
- **THEN** `dir` returns 'rtl' and the document `<html>` element has `dir="rtl"` and `lang="he"`

#### Scenario: LTR direction for English
- **WHEN** language is set to 'en'
- **THEN** `dir` returns 'ltr' and `<html>` has `dir="ltr"` and `lang="en"`

### Requirement: Language toggle component
A `LanguageToggle` component SHALL allow switching between English and Hebrew. It SHALL appear in the navbar. When toggled, it SHALL update the language context, triggering React Query to serve cached content for the new language or fetch if not cached.

#### Scenario: Toggle language
- **WHEN** user clicks the language toggle while viewing in English
- **THEN** language switches to Hebrew, all site text updates, and the toggle reflects the new state

### Requirement: Content refetch on language change
When language changes, all translated values SHALL be served from the already-cached query results without any additional Supabase round-trip. The transition SHALL be seamless — no full page reload.

#### Scenario: Switch language uses cached row
- **WHEN** user toggles language from 'en' to 'he' after initial load
- **THEN** no `site_content` or `projects` query is re-issued; the existing cached rows are read with the new active language and `t(...)` / `useTranslated(...)` return the HE values

#### Scenario: First load fetches once
- **WHEN** the site loads for the first time
- **THEN** `site_content` is fetched in a single query and remains in cache for both subsequent language toggles

### Requirement: No i18next dependency
The site SHALL NOT use i18next, react-i18next, or i18next-browser-languagedetector. All internationalization SHALL be handled via the `useSiteText` hook backed by Supabase + React Query.

#### Scenario: No i18next in bundle
- **WHEN** the production bundle is built
- **THEN** no i18next-related packages are included

### Requirement: Contact form discovery i18n keys
The `site_content` table SHALL contain the following keys, each with a `value` JSONB of shape `{ "en": string, "he": string }`, to support the discovery-style contact form: `contact.form.challenge.label`, `contact.form.challenge.placeholder`, `contact.form.challenge.error`, `contact.form.tried.label`, `contact.form.tried.placeholder`, `contact.form.tried.error`, `contact.form.whyNow.label`, `contact.form.whyNow.placeholder`, `contact.form.whyNow.error`, `contact.form.name.error`, `contact.form.email.error`, and `contact.email.subjectPrefix`. All keys SHALL have both `en` and `he` values populated (no nulls). Combined with the pre-existing `contact.form.name.placeholder`, `contact.form.email.placeholder`, `contact.form.success`, `contact.form.error`, `contact.cta`, `contact.heading`, and `contact.subtext` keys, every visible string on the contact form SHALL resolve through `useSiteText()` — no rendered text in `ContactForm.tsx` or `Contact.tsx` is hardcoded as the primary source.

#### Scenario: All discovery keys present in EN and HE
- **WHEN** the `site_content` table is queried for all keys starting with `contact.form.challenge.`, `contact.form.tried.`, `contact.form.whyNow.`, the validation-error keys `contact.form.name.error` and `contact.form.email.error`, and the key `contact.email.subjectPrefix`
- **THEN** twelve rows are returned, each with both `value->>'en'` and `value->>'he'` populated

#### Scenario: Lookup via useSiteText
- **WHEN** a component calls `t('contact.form.challenge.label')` while the language is Hebrew
- **THEN** it returns the Hebrew label string for the Challenge field

#### Scenario: Hebrew validation errors for identity fields
- **WHEN** the language is Hebrew and the Name or Email field fails validation
- **THEN** the displayed error is the Hebrew value of `contact.form.name.error` / `contact.form.email.error`, not English fallback text

### Requirement: Updated contact section copy
The `site_content` rows for `contact.heading` and `contact.subtext` SHALL reflect the discovery framing (not project-pitch framing). Both `en` and `he` values SHALL be populated; the Hebrew SHALL read naturally, not as a literal translation of the English. Current values: heading EN "Start with the hard part." / HE "נתחיל מהחלק הקשה."; subtext EN "Three honest questions. We'll get back to you within 24 hours." / HE "שלוש שאלות כנות. נחזור אליכם תוך 24 שעות."

#### Scenario: Discovery-framed heading copy
- **WHEN** `t('contact.heading')` is called
- **THEN** it returns the discovery-framed heading (e.g., "Start with the hard part." in EN, "נתחיל מהחלק הקשה." in HE), not a project-pitch heading

#### Scenario: Subtext promises a reply to everyone
- **WHEN** `t('contact.subtext')` is called
- **THEN** it returns subtext referencing the three questions and a 24-hour response window, phrased as an unconditional promise (no "if your answers are good enough" implication)
