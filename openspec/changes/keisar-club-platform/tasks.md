## 1. Supabase project setup (manual, outside the repo)

- [ ] 1.1 In Supabase Auth → Providers, enable Google OAuth (paste Google Cloud Console client id + secret; set redirect to the site origin)
- [ ] 1.2 In Supabase Auth → Providers, enable GitHub OAuth (paste GitHub Developer Settings client id + secret; set redirect to the site origin)
- [ ] 1.3 In Supabase Auth → URL Configuration, add `https://keisar.club` and `http://localhost:5173` to allowed redirect URLs
- [ ] 1.4 Confirm daily backups are enabled on the Supabase project (or document the manual `pg_dump` schedule)

## 2. Database schema migration

- [x] 2.1 Write SQL migration creating `profiles` table per `design.md` schema (id PK = auth.users.id, role enum, github_handle, full_name, display_name, avatar_url, bio, resume_url, links jsonb, status enum default 'active', invited_by FK, terms_accepted_at, created_at, updated_at)
- [x] 2.2 Write SQL migration creating `profile_audit` table (id bigserial, profile_id FK, field text, old_value text, new_value text, changed_at timestamptz)
- [x] 2.3 Write SQL migration creating `dev_invites` table (id PK, token_hash text unique, email citext, invited_by FK, created_at, expires_at default now()+30d, used_at nullable)
- [x] 2.4 Write SQL migration upgrading `portfolio` table → renamed to `projects` with new fields (company_name, duration, status enum, developers uuid[], assigned_manager FK, client_visibility enum, dev_attribution enum, started_at, finished_at)
- [x] 2.5 Migrate existing 56 portfolio rows into `projects` mapping `status` text → enum (`completed`→`finished`, `in-progress`→`ongoing`); defaults `client_visibility='hidden'`, `dev_attribution='named'`, `developers=[]`; `finished_at` defaulted to created_at::date for finished rows. Real Amitay-attribution backfill deferred to task 2.10b after his profile exists.
- [x] 2.6 Write SQL migration creating `profiles_public` view (security_invoker=true, column-level grants for anon)
- [x] 2.7 Write SQL migration creating the audit trigger on `profiles` UPDATE that inserts one `profile_audit` row per changed editable field
- [x] 2.8 Write SQL migration creating RLS policies per design.md table: profiles (self + admin write, self full read, anon column-level), profile_audit (self + admin read, trigger-only write), dev_invites (admin only), projects (anon read where publish=true, admin write)
- [x] 2.9 Applied migrations to Supabase via MCP; verified 50 finished + 6 ongoing = 56 rows preserved; all security advisor ERRORs resolved
- [ ] 2.10 Seed Amitay's `profiles` row with `role='admin'` after his first GitHub OAuth login (requires `auth.users.id` that does not exist yet)
- [ ] 2.10b Backfill `developers=[amitay_id]`, `assigned_manager=amitay_id` on the 56 migrated projects after 2.10

## 3. Service layer changes

- [ ] 3.1 Update `src/services/supabase.ts` to export auth helpers (`signInWithGoogle`, `signInWithGitHub`, `signOut`)
- [ ] 3.2 Rename/refactor `src/services/apiPortfolio.ts` exports to `getProjects(lang, opts?)` and `getProjectBySku(SKU, lang)` per `specs/portfolio-data-layer/spec.md` MODIFIED requirements; preserve old export names as thin aliases during the transition only if needed
- [ ] 3.3 Implement `getProjects` ordering rules per status (`finished` by finished_at DESC + priority; `ongoing` by started_at DESC + priority; `upcoming` by priority DESC + created_at ASC)
- [ ] 3.4 Implement `getProjectBySku` joining `developers[]` and `assigned_manager` to `profiles_public`, preserving array order
- [ ] 3.5 Implement `getProjectBySku` enforcement that when `client_visibility='hidden'`, `companyName` is returned as null even if present in the row
- [ ] 3.6 Add `src/services/apiProfile.ts` with `getProfile(userId)`, `getPublicProfile(userId)`, and `updateProfile(userId, patch)` per spec
- [x] 3.7 Add `src/services/apiInvites.ts` with `validateInvite(rawToken)` (returns `{ email, expiresAt }` or null), `redeemInvite(rawToken, payload)`, and admin-only `createInvite(email)` / `listInvites()`
- [x] 3.8 Hash tokens server-side using Postgres RPC `validate_invite` / `redeem_invite` with `encode(extensions.digest(p_token,'sha256'),'hex')`; raw token never accepted hashed from client
- [x] 3.9 Update React Query keys throughout the app to the new shapes (`['projects', lang, opts]`, `['project', SKU, lang]`, `['profile', userId]`, `['profile_public', userId]`)
- [x] 3.10 Update prefetch-on-hover to use the new `['project', SKU, lang]` key

## 4. Auth context and routing

- [x] 4.1 Add React Router (installed `react-router-dom@7`) with routes for `/`, `/login`, `/onboard`, `/me`, `/admin`, `/admin/invites`, `/admin/projects`, `/admin/projects/:id`, `/legal/terms`, `/legal/privacy`, and a fallback 404
- [x] 4.2 Create `src/contexts/AuthContext.tsx` exposing `{ session, user, profile, isLoading, signInWithGoogle, signInWithGitHub, signOut, refreshProfile }`; hydrates from `supabase.auth.getSession()` and subscribes to `onAuthStateChange`
- [x] 4.3 Wrap the app in `<AuthProvider>` inside `<BrowserRouter>` in `src/App.tsx`
- [x] 4.4 Create `<RequireAuth>` route guard that redirects to `/login?redirect=<path>` when no session
- [x] 4.5 Create `<RequireRole role="admin">` route guard that renders a 403 page when the profile's `role` is not the required value
- [x] 4.6 Wire `/me` behind `<RequireAuth>` and all `/admin/*` behind `<RequireRole role="admin">`

## 5. Login page

- [x] 5.1 Create `src/pages/LoginPage.tsx` with two buttons: "Continue with Google" and "Continue with GitHub"
- [x] 5.2 Each button calls the corresponding `signIn` helper; on success, redirect to `redirect` query param or `/`
- [x] 5.3 Styled with the project's dark/minimalist surface treatment (liquid-glass borders)
- [x] 5.4 No password input or `signInWithPassword` reference exists anywhere in the bundle

## 6. Onboarding flow

- [x] 6.1 Create `src/pages/OnboardPage.tsx` that reads the `token` query parameter
- [x] 6.2 On mount, call `validateInvite(token)`; renders "Invite required" if missing, "Invalid or expired invite" if rejected
- [x] 6.3 If the visitor is not yet logged in, prompts them to log in with Google or GitHub before the form renders
- [x] 6.4 After login, compares the OAuth email to the invite email (case-insensitive); blocks with a clear error if they differ
- [x] 6.5 Renders registration form fields: legal full name (required), display name, bio (max 500 chars), links (github, linkedin, website, twitter). Resume upload deferred — needs Supabase Storage policy work first
- [x] 6.6 Required Terms + Privacy consent checkbox with inline links; disabled Submit until checked
- [x] 6.7 On submit, calls `redeemInvite(rawToken)`, then `upsertProfileFromAuth(...)` + `updateProfile(bio, links)`
- [x] 6.8 On success, redirects to `/me`

## 7. Dev profile editor

- [x] 7.1 Create `src/pages/MePage.tsx` that uses the AuthContext's profile (already fetched)
- [x] 7.2 Renders editable form for `full_name`, `display_name`, `bio`, `links` (avatar/resume upload deferred to v2)
- [x] 7.3 Save calls `updateProfile`; shows inline error and success indicator
- [x] 7.4 Role/status/invited_by are not editable in the form and not in the request payload
- [x] 7.5 RLS + the `profile_protect_admin_fields` trigger reset role/status/invited_by even if forged in a direct fetch

## 8. Admin console

- [x] 8.1 Create `src/pages/Admin/AdminLayout.tsx` with sub-navigation: Profiles, Invites, Projects
- [x] 8.2 Create `src/pages/Admin/AdminProfilesPage.tsx` listing all profiles with search (display_name, full_name, github_handle), filter by status and role, suspend/unsuspend toggle, and a name-flip warning badge
- [x] 8.3 Create `src/pages/Admin/AdminInvitesPage.tsx` with a "Generate invite" form; displays the raw URL once with copy-to-clipboard, dismissed on navigation
- [x] 8.4 Same page renders invite list: email, created, expires, used, status (never raw token or hash)
- [x] 8.5 Create `src/pages/Admin/AdminProjectsPage.tsx` listing all projects (including unpublished) with status filter and a "New project" button
- [x] 8.6 Create `src/pages/Admin/AdminProjectEditorPage.tsx` exposing every column: title, SKU, lang, image, image pack, description fields, technologies, projectType, publish, status, company_name, duration, developers (multi-select, ordered with up/down), assigned_manager (defaults to current admin), client_visibility (default `logo_only`), dev_attribution (default `named`), started_at, finished_at, priority
- [x] 8.7 Save calls insert/update against `projects` through `adminCreateProject` / `adminUpdateProject`; RLS allows the write only for admin

## 9. Home page spirals

- [x] 9.1 Created `src/sections/ProjectSpirals.tsx` fetching three lists via `useProjectsByStatus`
- [x] 9.2 Renders in fixed order on the home page: Finished → Ongoing → Upcoming
- [x] 9.3 Spiral entirely hidden (no heading, no DOM) when its list is empty
- [x] 9.4 Reuses `InfiniteCarousel` + `CarouselCard`: `direction='left'` for Finished and Upcoming, `direction='right'` for Ongoing
- [x] 9.5 Added status-derived badge to `CarouselCard`: "In progress" for ongoing, "Coming soon" for upcoming, none for finished
- [x] 9.6 Replaced both `CodeCarousel` instances in HomePage with `ProjectSpirals`. (Wood-Working items currently render in Finished alongside Web-Development — separate Wood spiral would require a `projectType` filter overlay; deferred.)
- [x] 9.7 Click handler unchanged — `onProjectClick` still opens the existing project modal

## 10. Case study rendering updates

- [x] 10.1 `ProjectModal.tsx` renders `companyName` only when `clientVisibility !== 'hidden'`; shows "Confidential client" when hidden
- [x] 10.2 Renders `duration` and status label ("Shipped"/"In progress"/"Coming soon") in a meta row under the title
- [x] 10.3 Renders attributed developers per `dev_attribution`: `named` shows display_name + avatar; `anonymized` shows "Developer A", "Developer B"…; `hidden` omits the block
- [x] 10.4 Order of developers matches the `developers[]` array order (lead first), with a "Lead" tag on index 0

## 11. Legal pages

- [x] 11.1 Created `src/pages/Legal/TermsPage.tsx` with placeholder copy + "Draft — final text pending legal review" notice
- [x] 11.2 Created `src/pages/Legal/PrivacyPage.tsx` with placeholder copy + same notice
- [x] 11.3 Added footer Terms/Privacy links — present in `Footer` (rendered on home), `LegalLayout`, `LoginPage`, `OnboardPage`. Admin layout lacks them today; out-of-app routes always have them via LegalLayout when navigated to
- [ ] 11.4 Replace placeholder copy with lawyer-supplied final text before launch (gated on non-code-tasks L5 + L6)

## 12. Brand transition and copy

- [x] 12.1 Updated `index.html`: title → "Keisar Club — Development Agency", description, OG/Twitter tags, JSON-LD changed from Person → Organization
- [ ] 12.2 Hero copy update deferred — current Hero pulls from `site_content` table via i18n keys; a content-only edit (no code) the user can do via Supabase admin or in a later commit
- [x] 12.3 Updated `Footer.tsx` to "© 2026 Keisar Club. Founded by Amitay Keisar." (uses i18n key `footer.copyright` so the row in `site_content` should be updated as well)
- [ ] 12.4 Logo placement / wordmark variant — deferred to non-code-tasks B1

## 13. QA pass before launch

- [ ] 13.1 End-to-end: admin generates an invite for a test email, visitor opens the URL, logs in with the matching Google/GitHub account, completes onboarding, lands on `/me`
- [ ] 13.2 End-to-end: invited email mismatches → registration blocked; reused token → registration blocked; expired token → registration blocked
- [ ] 13.3 End-to-end: dev edits display name twice → admin sees name-flip warning badge
- [ ] 13.4 End-to-end: admin creates a project with `status='ongoing'`, assigns two devs, sets `client_visibility='logo_only'`, `dev_attribution='named'` → project appears in Ongoing spiral, case study shows logo + named devs in order
- [ ] 13.5 End-to-end: admin toggles `status` to `'finished'` → project moves to Finished spiral on next page load
- [ ] 13.6 End-to-end: admin sets `dev_attribution='hidden'` → developer block disappears from case study
- [ ] 13.7 Anonymous Supabase calls verified to deny: `profiles` SELECT (returns 0), `dev_invites` SELECT (returns 0), `projects` UPDATE (denied)
- [ ] 13.8 Visual QA: home page on desktop and mobile with 1 / 2 / many projects per spiral; empty spirals fully hidden
- [ ] 13.9 Accessibility: keyboard navigation through login, onboarding, profile, admin; screen-reader labels on all form fields
- [ ] 13.10 Performance: confirm new pages do not introduce extra shader instances; lazy-load admin bundle so anonymous visitors do not download it

## 14. Launch

- [ ] 14.1 Confirm non-code-tasks legal items L5 (privacy) and L6 (terms) are complete and copy is pasted in
- [ ] 14.2 Confirm at least 1 Finished and at least 1 Ongoing project exist in `projects`
- [ ] 14.3 Confirm Amitay's `profiles` row exists with `role='admin'` and `display_name`, `avatar_url`, `bio` set
- [ ] 14.4 Hand-invite the first 5–10 devs from the non-code-tasks B3 list
- [ ] 14.5 Deploy to production; smoke-test the OAuth callback domain matches Supabase configuration
- [ ] 14.6 Monitor logs for the first 48 hours; triage any failed invite redemptions or OAuth callback errors
