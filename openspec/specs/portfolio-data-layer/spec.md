## ADDED Requirements

### Requirement: Supabase client initialization
A Supabase client SHALL be initialized with the existing project URL (`https://qjyybkgqqadjedgelakf.supabase.co`) and anon key. The client SHALL be exported from `src/services/supabase.ts`.

#### Scenario: Client connects to Supabase
- **WHEN** the application starts
- **THEN** the Supabase client is initialized and ready for queries

### Requirement: Portfolio list query
A `getPortfolio(lang, projectType?)` function SHALL fetch all rows from `portfolio` where `publish=true` and `lang=currentLang`, optionally filtered by `projectType`. Results SHALL be ordered by `priority` (descending) then `id` (ascending).

#### Scenario: Fetch all code projects in English
- **WHEN** `getPortfolio('en', 'Web-Development')` is called
- **THEN** it returns all published English web development projects ordered by priority

#### Scenario: Fetch all projects (no type filter)
- **WHEN** `getPortfolio('en')` is called with no projectType
- **THEN** it returns all published English projects regardless of type

### Requirement: Portfolio single item query
A `getPortfolioById(SKU, lang)` function SHALL fetch a single row from `portfolio` matching `SKU`, `lang`, and `publish=true`. It SHALL select: id, SKU, title, description, longDescription, technologies, projectType, image, imagePack, additionalInfo, featured, settings, priority, liveSite, github.

#### Scenario: Fetch single project
- **WHEN** `getPortfolioById('WEB-ADDIT', 'en')` is called
- **THEN** it returns the full English data for the Addit project

### Requirement: Site content query
A `fetchSiteContent(lang)` function SHALL fetch all rows from `site_content` where `lang=currentLang` and return them as a key-value map (`Record<string, string>`).

#### Scenario: Fetch English site content
- **WHEN** `fetchSiteContent('en')` is called
- **THEN** it returns an object like `{ 'hero.heading.line1': 'I ship products,', ... }`

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
React Query state SHALL be persisted to IndexedDB using `idb-keyval` with key `'portfolio-v2-cache'`. Max cache age SHALL be 30 days. On app startup, the persisted cache SHALL be restored before any network requests.

#### Scenario: Return visit instant render
- **WHEN** a user revisits the site after previously loading it
- **THEN** the IndexedDB cache is restored and content renders immediately before any Supabase calls

#### Scenario: Cache expires after 30 days
- **WHEN** a user revisits after 31 days
- **THEN** the stale cache is discarded and fresh data is fetched from Supabase

### Requirement: Query key structure
Query keys SHALL follow the pattern: `['site_content', lang]`, `['portfolio', lang, projectType?]`, `['portfolio', SKU, lang]`, `['portfolioImage', imageName]`, `['siteImage', imageName]`.

#### Scenario: Language change invalidates content queries
- **WHEN** the language changes from 'en' to 'he'
- **THEN** queries with the new lang key are fetched (or served from cache if previously fetched)

### Requirement: Prefetch on carousel card hover
When a user hovers over a carousel card, `queryClient.prefetchQuery` SHALL be called for the project detail query and the main image query for that project.

#### Scenario: Hover triggers prefetch
- **WHEN** user hovers over a card with SKU "WEB-MUSE" for 200ms+
- **THEN** `queryClient.prefetchQuery` is called for `['portfolio', 'WEB-MUSE', lang]` and `['portfolioImage', mainImageName]`
