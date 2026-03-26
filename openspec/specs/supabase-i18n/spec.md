## ADDED Requirements

### Requirement: site_content table
A `site_content` table SHALL exist in Supabase with columns: `id` (serial primary key), `key` (text, not null), `lang` (text, not null — 'en' or 'he'), `value` (text, not null), `created_at` (timestamptz, default now()). A unique constraint SHALL exist on `(key, lang)`. RLS SHALL be enabled with a public read policy.

#### Scenario: Table schema
- **WHEN** the `site_content` table is queried
- **THEN** it returns rows with `key`, `lang`, and `value` columns

#### Scenario: Unique constraint prevents duplicates
- **WHEN** an insert attempts to create a duplicate `(key, lang)` pair
- **THEN** the insert fails with a unique constraint violation

### Requirement: Portfolio table lang column
The `portfolio` table SHALL have a `lang` column (text, not null, default 'en'). A unique constraint SHALL exist on `(SKU, lang)`. Each project SHALL have one row per supported language.

#### Scenario: Bilingual portfolio item
- **WHEN** a project with SKU "WEB-ADDIT" exists
- **THEN** there are two rows: one with `lang='en'` and one with `lang='he'`, each with translated content

### Requirement: useSiteText hook
A `useSiteText()` hook SHALL fetch all `site_content` rows for the current language in a single query, returning a `t(key, fallback?)` function. The query SHALL have a `staleTime` of 24 hours.

#### Scenario: Translation lookup
- **WHEN** a component calls `t('hero.heading.line1')`
- **THEN** it returns the value from `site_content` where `key='hero.heading.line1'` and `lang=currentLang`

#### Scenario: Fallback when key missing
- **WHEN** a component calls `t('nonexistent.key', 'Fallback Text')`
- **THEN** it returns 'Fallback Text'

#### Scenario: Fallback when no fallback provided
- **WHEN** a component calls `t('nonexistent.key')` without fallback
- **THEN** it returns the key string itself: 'nonexistent.key'

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
When language changes, React Query queries keyed by `lang` SHALL either serve from cache (if previously fetched) or fetch from Supabase. The transition SHALL be seamless — no full page reload.

#### Scenario: Switch to previously loaded language
- **WHEN** user switches from English to Hebrew after having visited Hebrew before
- **THEN** Hebrew content loads instantly from React Query cache

#### Scenario: Switch to never-loaded language
- **WHEN** user switches to Hebrew for the first time (no cache)
- **THEN** skeleton loading states appear briefly while data is fetched, then content renders

### Requirement: No i18next dependency
The site SHALL NOT use i18next, react-i18next, or i18next-browser-languagedetector. All internationalization SHALL be handled via the `useSiteText` hook backed by Supabase + React Query.

#### Scenario: No i18next in bundle
- **WHEN** the production bundle is built
- **THEN** no i18next-related packages are included
