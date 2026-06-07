## Purpose

The Supabase + React Query data layer for portfolio content: client init, list/single/site-content queries, signed image URLs, per-query stale times, IndexedDB persistence, query-key conventions, and prefetch on carousel-card hover.

## Requirements

### Requirement: Supabase client initialization
A Supabase client SHALL be initialized with the existing project URL (`https://qjyybkgqqadjedgelakf.supabase.co`) and anon key. The client SHALL be exported from `src/services/supabase.ts`.

#### Scenario: Client connects to Supabase
- **WHEN** the application starts
- **THEN** the Supabase client is initialized and ready for queries

### Requirement: Portfolio list query
A `getProjects(opts?)` function SHALL fetch all rows from the `projects` table where `publish=true`, optionally filtered by `projectType` and/or `status`. It SHALL NOT take a `lang` argument; rows are returned with bilingual JSONB fields intact. Results SHALL be ordered as follows: when `status='finished'`, by `finished_at` DESC then `priority` DESC; when `status='ongoing'`, by `started_at` DESC then `priority` DESC; when `status='upcoming'`, by `priority` DESC then `created_at` ASC; when no status filter is supplied, by `priority` DESC then `id` ASC.

#### Scenario: Fetch finished web projects
- **WHEN** `getProjects({ projectType: 'Web-Development', status: 'finished' })` is called
- **THEN** it returns all published Web-Development projects with `status='finished'`, each row carrying `title`, `description`, etc. as `{ en, he }` JSONB objects, ordered by `finished_at` DESC then `priority` DESC

#### Scenario: Fetch ongoing projects (no type filter)
- **WHEN** `getProjects({ status: 'ongoing' })` is called
- **THEN** it returns all published projects with `status='ongoing'`, ordered by `started_at` DESC then `priority` DESC

#### Scenario: Fetch upcoming projects
- **WHEN** `getProjects({ status: 'upcoming' })` is called
- **THEN** it returns all published projects with `status='upcoming'`, ordered by `priority` DESC then `created_at` ASC

#### Scenario: Fetch all projects (no filters)
- **WHEN** `getProjects()` is called with no opts
- **THEN** it returns all published projects regardless of type or status, ordered by `priority` DESC then `id` ASC

### Requirement: Portfolio single item query
A `getProjectBySku(SKU)` function SHALL fetch a single row from `projects` matching `SKU` and `publish=true`. It SHALL NOT take a `lang` argument. The returned row SHALL include all bilingual JSONB fields (`title`, `description`, `longDescription`, `problem`, `what_i_built`, `how_it_works`, `result`, `company_name`, `duration`, plus the translatable leaves inside `additionalInfo`, `liveSite`, `github`), all non-translatable fields (id, SKU, image, imagePack, technologies, projectType, settings, featured, priority, publish), and the v1 agency fields: `status`, `developers` (as `profiles_public` rows joined by id, preserving array order), `assigned_manager` (as `profiles_public` row), `client_visibility`, `dev_attribution`, `started_at`, `finished_at`.

#### Scenario: Fetch single project returns bilingual fields
- **WHEN** `getProjectBySku('WEB-ADDIT-APP')` is called
- **THEN** the returned object includes `title`, `description`, etc. as `{ en, he }` objects, plus all non-translatable and agency fields

#### Scenario: Hidden client returned with null companyName
- **WHEN** `getProjectBySku('WEB-FOO')` is called for a project with `client_visibility='hidden'`
- **THEN** the response returns `companyName` as `null` regardless of the underlying stored `{ en, he }` value, so that the UI cannot accidentally render it

### Requirement: Site content query
A `fetchSiteContent()` function SHALL fetch all rows from `site_content` in a single query (no `lang` argument) and return them as a map of key → `{ en, he }` JSONB value.

#### Scenario: Fetch site content
- **WHEN** `fetchSiteContent()` is called
- **THEN** it returns an object like `{ 'hero.heading.line1': { en: 'I ship products,', he: 'אנחנו בונים מוצרים' }, ... }`

### Requirement: Portfolio image signed URL
A `getPortfolioImage(imageName)` function SHALL generate a signed URL from Supabase Storage bucket `products-image` with 100-day validity. It SHALL return `null` on error.

#### Scenario: Get image URL
- **WHEN** `getPortfolioImage('addit-main.jpg')` is called
- **THEN** it returns a signed URL valid for 100 days

### Requirement: Site image signed URL
A `getSiteImage(imageName)` function SHALL generate a signed URL from Supabase Storage bucket `site-image` with 100-day validity.

#### Scenario: Get site image URL
- **WHEN** `getSiteImage('profile-image-banner.jpg')` is called
- **THEN** it returns a signed URL valid for 100 days

### Requirement: React Query client configuration
The React Query client SHALL be configured with: `retry: 2`, `refetchOnWindowFocus: true`, `refetchOnReconnect: 'always'`, `gcTime: 30 days` (garbage collection).

#### Scenario: Failed query retries
- **WHEN** a Supabase query fails due to network error
- **THEN** React Query retries the query up to 2 times before reporting failure

### Requirement: Per-query stale times
Stale times SHALL be: `site_content` = 24 hours, `portfolio` list = 0 (stale-while-revalidate), `portfolio` single item = 1 hour, `portfolioImage` = 14 days, `siteImage` = 14 days.

#### Scenario: Site content cached aggressively
- **WHEN** site content was fetched 12 hours ago
- **THEN** it is still considered fresh and served from cache without background refetch

#### Scenario: Portfolio list always refetches
- **WHEN** portfolio list is accessed after initial fetch
- **THEN** the cached data is shown immediately AND a background refetch occurs

### Requirement: IndexedDB cache persistence
React Query state SHALL be persisted to IndexedDB using `idb-keyval` with key `'portfolio-v3-cache'`. Max cache age SHALL be 30 days. On app startup, the persisted cache SHALL be restored before any network requests.

#### Scenario: Return visit instant render
- **WHEN** a user revisits the site after previously loading it with the v3 cache shape
- **THEN** the IndexedDB cache is restored and content renders immediately before any Supabase calls

#### Scenario: Stale v2 cache is discarded
- **WHEN** a user revisits with a pre-existing `'portfolio-v2-cache'` entry from before this change
- **THEN** the v2 cache is ignored (different key), fresh data is fetched under `'portfolio-v3-cache'`, and no stale-shape error occurs

### Requirement: Query key structure
Query keys SHALL follow the pattern: `['site_content']`, `['projects', { projectType?, status? }]`, `['project', SKU]`, `['portfolioImage', imageName]`, `['siteImage', imageName]`, `['profile', userId]`, `['profile_public', userId]`. Language is NOT part of any query key — bilingual rows live in the cache language-agnostically and the active language is picked at render time.

#### Scenario: Language toggle does not invalidate caches
- **WHEN** the language changes from 'en' to 'he'
- **THEN** no query key changes; the same cached rows are read with the new active language and consumers re-render with HE values

#### Scenario: Status change refetches correct spiral
- **WHEN** the Finished spiral mounts with `['projects', { status: 'finished' }]` and the Ongoing spiral mounts with `['projects', { status: 'ongoing' }]`
- **THEN** each spiral has its own React Query cache entry and refetches independently

### Requirement: Prefetch on carousel card hover
When a user hovers over a carousel card, `queryClient.prefetchQuery` SHALL be called for the project detail query and the main image query for that project. The detail query SHALL use the new `['project', SKU]` key shape (no lang).

#### Scenario: Hover triggers prefetch
- **WHEN** user hovers over a card with SKU "WEB-MUSE" for 200ms+
- **THEN** `queryClient.prefetchQuery` is called for `['project', 'WEB-MUSE']` and `['portfolioImage', mainImageName]`
