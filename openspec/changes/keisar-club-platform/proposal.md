## Why

`keisar.club` is currently a single-tenant freelance portfolio with no auth, no users, and no transactions. Amitay is pivoting the site to be the public face of **Keisar Club** — an agency where he signs all client contracts directly and engages other developers as per-project freelancers to deliver the work. The site must become the agency's public showroom (case studies with developer attribution) and the private intake pipe for invited talent (self-serve onboarding) so that new devs can be added in one sitting and projects can be presented as the agency pipeline (Upcoming / Ongoing / Finished) rather than a personal portfolio.

This proposal covers **v1 only** — the minimum needed to reposition the site, onboard the first cohort of invited devs, and publish the new project model. Dev-side dashboards, public dev directory, client login, interest expression, automated triage, and self-serve visibility controls are deferred to v2 (see `design-v2.md`). Cloudflare migration and on-platform payments/messaging are out of scope entirely.

## What Changes

- **Add** OAuth login via Supabase Auth with two providers: Google and GitHub. No passwords, no Apple Sign-In.
- **Add** invite-only developer registration. Admin generates a single-use, email-bound, 30-day-expiring token URL; dev follows it to self-onboard.
- **Add** developer profile entity (legal name, display name, avatar, bio, links, optional resume) with append-only audit log of changes for soft name-flip detection.
- **Add** admin console (`/admin`) for: profile list with suspend toggle, invite generator, full project CRUD with all new fields.
- **Add** dev profile editor (`/me`) for the dev's own profile fields.
- **Add** three project spirals on the home page (Finished → Ongoing → Upcoming), each driven by `projects.status`. Spirals with zero items are hidden.
- **Add** static legal pages: `/legal/terms`, `/legal/privacy`.
- **Add** Row-Level Security policies and a `profiles_public` view so anonymous clients can only read non-sensitive profile columns.
- **Modify** the project data shape: rename/migrate `portfolio_items` to `projects` and add `companyName`, `duration`, `status` enum (upcoming/ongoing/finished), `developers[]` (ordered, lead first), `assignedManager`, `clientVisibility` enum, `devAttribution` enum, `startedAt`, `finishedAt`. **BREAKING** at the data layer; all existing items are migrated with `status='finished'`, `developers=[amitay_id]`, `assignedManager=amitay_id`, `clientVisibility='hidden'`, `devAttribution='named'`.
- **Modify** project case study rendering to respect `clientVisibility` and `devAttribution` when showing client name/logo and developer credits.

## Capabilities

### New Capabilities

- `auth-oauth`: Supabase Auth integration with Google and GitHub OAuth providers; session handling; React auth context; sign-in and sign-out flows; no password or email-link auth.
- `dev-onboarding`: Invite token generation (admin) and redemption (dev). Token storage as SHA-256 hash, email binding, single-use, 30-day expiry, mismatch handling when GitHub email differs from invited email.
- `dev-profile`: Developer profile entity (`profiles` table), self-edit page at `/me`, audit trigger that writes every field change to `profile_audit`, soft name-flip detection (visible only to admin).
- `admin-console`: Private `/admin` routes gated by `role='admin'`. Profile list with suspend, invite generator, project CRUD UI exposing every new field including `developers[]`, `assignedManager`, `clientVisibility`, `devAttribution`.
- `project-pipeline`: The agency project model — `status` enum, attribution flags, manager assignment, ordered `developers[]`. RLS rules limiting public reads to `publish=true`, admin-only writes. Defines default values when admin creates a project.
- `home-spirals`: Three labeled, status-driven spirals on the home page (Finished, Ongoing, Upcoming), each reusing the existing `InfiniteCarousel` + `CarouselCard` pattern; empty-state hide rule; fixed visual direction per spiral.
- `legal-pages`: Static routes `/legal/terms` and `/legal/privacy` rendering content supplied via the non-code-tasks legal workstream; required for OAuth provider verification and GDPR/Israeli privacy law.

### Modified Capabilities

- `portfolio-data-layer`: The schema and fetching layer changes from `portfolio_items` to `projects`, adds the seven new fields above, and updates the fetch hooks to filter/sort by `status` for the three home spirals. Backwards-compatible at the React component level (existing carousels keep rendering finished work), breaking at the database/service layer.
- `supabase-i18n`: No requirement change today, but listed because the new tables must follow the same bilingual `lang` convention as existing portfolio rows. Flagging it so the spec-sync step verifies no implicit assumptions are broken; if no spec text needs updating, no delta will be written.

## Impact

- **Affected code**:
  - `src/services/supabase.ts` — auth helpers added.
  - `src/services/apiPortfolio.ts` — replaced by/extended to query `projects` instead of `portfolio_items`.
  - `src/hooks/usePortfolioItems.ts` — fetches by `status` per spiral.
  - `src/sections/WoodCarousel.tsx`, `src/sections/CodeCarousel.tsx`, `src/sections/ProductsBar.tsx` — extended or replaced by status-driven spirals.
  - `src/components/ProjectModal.tsx` — respects visibility/attribution flags.
  - `src/types/portfolio.ts` — new `Project` type alongside or replacing `PortfolioItem`.
  - New: `src/contexts/AuthContext.tsx`, `src/pages/Login.tsx`, `src/pages/Onboard.tsx`, `src/pages/Me.tsx`, `src/pages/Admin/*`, `src/pages/Legal/*`.
- **Affected Supabase schema**: new tables `profiles`, `profile_audit`, `dev_invites`, `projects` (or rename of `portfolio_items`); new view `profiles_public`; new RLS policies; new audit trigger.
- **Dependencies**: no new npm packages required for v1 (Supabase client already installed). React Router required if not already present.
- **External systems**: Google OAuth client (created in Google Cloud Console), GitHub OAuth app (created in GitHub Developer Settings). Both must be wired into the Supabase Auth dashboard.
- **Out of scope / not impacted**: shader pipeline, intro overlay, contact form, infinite carousel rendering primitives, liquid glass design system, slalom timeline. All visual systems remain.
