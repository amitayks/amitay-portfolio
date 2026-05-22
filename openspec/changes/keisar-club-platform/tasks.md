## 1. Supabase project setup (manual, outside the repo)

- [ ] 1.1 In Supabase Auth → Providers, enable Google OAuth (paste Google Cloud Console client id + secret; set redirect to the site origin)
- [ ] 1.2 In Supabase Auth → Providers, enable GitHub OAuth (paste GitHub Developer Settings client id + secret; set redirect to the site origin)
- [ ] 1.3 In Supabase Auth → URL Configuration, add `https://keisar.club` and `http://localhost:5173` to allowed redirect URLs
- [ ] 1.4 Confirm daily backups are enabled on the Supabase project (or document the manual `pg_dump` schedule)

## 2. Database schema migration

- [ ] 2.1 Write SQL migration creating `profiles` table per `design.md` schema (id PK = auth.users.id, role enum, github_handle, full_name, display_name, avatar_url, bio, resume_url, links jsonb, status enum default 'active', invited_by FK, terms_accepted_at, created_at, updated_at)
- [ ] 2.2 Write SQL migration creating `profile_audit` table (id bigserial, profile_id FK, field text, old_value text, new_value text, changed_at timestamptz)
- [ ] 2.3 Write SQL migration creating `dev_invites` table (id PK, token_hash text unique, email citext, invited_by FK, created_at, expires_at default now()+30d, used_at nullable)
- [ ] 2.4 Write SQL migration creating `projects` table with all existing portfolio fields + new fields (company_name, duration, status enum, developers uuid[], assigned_manager FK, client_visibility enum, dev_attribution enum, started_at, finished_at)
- [ ] 2.5 Write SQL migration copying every row from existing `portfolio_items` (or equivalent current source) into `projects` with `status='finished'`, `developers=[amitay_id]`, `assigned_manager=amitay_id`, `client_visibility='hidden'`, `dev_attribution='named'`, `finished_at=completion_date`
- [ ] 2.6 Write SQL migration creating `profiles_public` view exposing only id, display_name, avatar_url, github_handle, bio, links for `status='active'` rows
- [ ] 2.7 Write SQL migration creating the audit trigger on `profiles` UPDATE that inserts one `profile_audit` row per changed editable field
- [ ] 2.8 Write SQL migration creating RLS policies per design.md table: profiles (self + admin write, self full read, anon nothing), profile_audit (self + admin read, trigger-only write), dev_invites (admin only), projects (anon read where publish=true, admin write)
- [ ] 2.9 Apply migrations to Supabase via the dashboard SQL editor or `supabase db push`; verify row counts and that the existing site still renders Finished projects after migration
- [ ] 2.10 Seed Amitay's `profiles` row with `role='admin'` (manual INSERT against his auth.users.id)

## 3. Service layer changes

- [ ] 3.1 Update `src/services/supabase.ts` to export auth helpers (`signInWithGoogle`, `signInWithGitHub`, `signOut`)
- [ ] 3.2 Rename/refactor `src/services/apiPortfolio.ts` exports to `getProjects(lang, opts?)` and `getProjectBySku(SKU, lang)` per `specs/portfolio-data-layer/spec.md` MODIFIED requirements; preserve old export names as thin aliases during the transition only if needed
- [ ] 3.3 Implement `getProjects` ordering rules per status (`finished` by finished_at DESC + priority; `ongoing` by started_at DESC + priority; `upcoming` by priority DESC + created_at ASC)
- [ ] 3.4 Implement `getProjectBySku` joining `developers[]` and `assigned_manager` to `profiles_public`, preserving array order
- [ ] 3.5 Implement `getProjectBySku` enforcement that when `client_visibility='hidden'`, `companyName` is returned as null even if present in the row
- [ ] 3.6 Add `src/services/apiProfile.ts` with `getProfile(userId)`, `getPublicProfile(userId)`, and `updateProfile(userId, patch)` per spec
- [ ] 3.7 Add `src/services/apiInvites.ts` with `validateInvite(rawToken)` (returns `{ email, expiresAt }` or null), `redeemInvite(rawToken, payload)`, and admin-only `createInvite(email)` / `listInvites()`
- [ ] 3.8 Hash tokens server-side using a Postgres function (`encode(sha256(token::bytea), 'hex')`) or an Edge Function; never accept a pre-hashed token from the client
- [ ] 3.9 Update React Query keys throughout the app to the new shapes (`['projects', lang, opts]`, `['project', SKU, lang]`, `['profile', userId]`, `['profile_public', userId]`)
- [ ] 3.10 Update prefetch-on-hover to use the new `['project', SKU, lang]` key

## 4. Auth context and routing

- [ ] 4.1 Add React Router (or confirm it is already present) with routes for `/`, `/login`, `/onboard`, `/me`, `/admin`, `/admin/invites`, `/admin/projects`, `/admin/projects/:id`, `/legal/terms`, `/legal/privacy`, and a fallback 404
- [ ] 4.2 Create `src/contexts/AuthContext.tsx` exposing `{ session, profile, signIn, signOut, isLoading }`; hydrate from `supabase.auth.getSession()` and subscribe to `onAuthStateChange`
- [ ] 4.3 Wrap the app in `<AuthProvider>` in `src/main.tsx`
- [ ] 4.4 Create `<RequireAuth>` route guard that redirects to `/login?redirect=<path>` when no session
- [ ] 4.5 Create `<RequireRole role="admin">` route guard that renders a 403 page when the profile's `role` is not the required value
- [ ] 4.6 Wire `/me` behind `<RequireAuth>` and all `/admin/*` behind `<RequireRole role="admin">`

## 5. Login page

- [ ] 5.1 Create `src/pages/Login.tsx` with two buttons: "Continue with Google" and "Continue with GitHub"
- [ ] 5.2 Each button calls the corresponding `signIn` helper; on success, redirect to `redirect` query param or `/`
- [ ] 5.3 Style the page consistently with the existing design system (liquid glass, shader background reuse)
- [ ] 5.4 Verify in the browser source that no password input or `signInWithPassword` call exists anywhere in the bundle

## 6. Onboarding flow

- [ ] 6.1 Create `src/pages/Onboard.tsx` that reads the `token` query parameter
- [ ] 6.2 On mount, call `validateInvite(token)`; render an "Invite required" message if missing, "Invalid or expired invite" if rejected
- [ ] 6.3 If the visitor is not yet logged in, prompt them to log in with Google or GitHub before the form renders
- [ ] 6.4 After login, compare the OAuth email to the invite email (case-insensitive); block with a clear error if they differ
- [ ] 6.5 Render registration form fields: legal full name (required), display name (optional), avatar (preview OAuth avatar, optional upload), bio (textarea, 500 chars), resume (optional PDF/DOCX upload, 5MB cap), links (github, linkedin, website, twitter)
- [ ] 6.6 Add the required Terms + Privacy consent checkbox with inline links; disable Submit until checked
- [ ] 6.7 On submit, upload resume to Supabase Storage if provided, then call `redeemInvite(rawToken, payload)`
- [ ] 6.8 On success, redirect to `/me` with a "Welcome to Keisar Club" toast

## 7. Dev profile editor

- [ ] 7.1 Create `src/pages/Me.tsx` that fetches the current user's full profile via `getProfile`
- [ ] 7.2 Render an editable form for `full_name`, `display_name`, `avatar_url`, `bio`, `resume_url`, `links`
- [ ] 7.3 Save calls `updateProfile`; show inline validation errors and success toast
- [ ] 7.4 Confirm role/status/invited_by are not editable in the form and not in the request payload
- [ ] 7.5 Verify in dev tools that an attempt to PATCH `role` via a direct fetch is rejected by RLS

## 8. Admin console

- [ ] 8.1 Create `src/pages/Admin/Layout.tsx` with sub-navigation: Profiles, Invites, Projects
- [ ] 8.2 Create `src/pages/Admin/Profiles.tsx` listing all profiles with search (display_name, full_name, github_handle), filter by status and role, suspend/unsuspend toggle, and a name-flip warning badge
- [ ] 8.3 Create `src/pages/Admin/Invites.tsx` with a "Generate invite" form (email input → calls `createInvite`); display the raw URL once with copy-to-clipboard, then unmount on navigation
- [ ] 8.4 Create `src/pages/Admin/Invites.tsx` invite list section: email, created, expires, used, invited_by (never raw token or hash)
- [ ] 8.5 Create `src/pages/Admin/Projects.tsx` listing all projects (including unpublished) with status filter and a "New project" button
- [ ] 8.6 Create `src/pages/Admin/ProjectEditor.tsx` exposing every column: title, SKU, lang, image/imagePack uploaders, description fields, technologies, projectType, additional info, liveSite, github, publish, status, company_name, duration, developers (multi-select of active devs from `profiles_public`, ordered, lead-first), assigned_manager (single-select of admin/manager profiles, defaults to current admin), client_visibility (default `logo_only`), dev_attribution (default `named`), started_at, finished_at, priority, completion_date
- [ ] 8.7 Save calls UPSERT against `projects`; verify RLS allows the write for admin only

## 9. Home page spirals

- [ ] 9.1 Create or extend `src/sections/ProjectSpirals.tsx` (or three separate section files) that fetches three lists via `getProjects(lang, { status })` for finished, ongoing, upcoming
- [ ] 9.2 Render in fixed order on the home page: Finished → Ongoing → Upcoming
- [ ] 9.3 Hide a spiral entirely (no heading, no DOM) when its list is empty; verify Upcoming and Ongoing are absent at launch if no rows exist
- [ ] 9.4 Reuse `InfiniteCarousel` + `CarouselCard` for each spiral; pass `direction='left'` for Finished and Upcoming, `direction='right'` for Ongoing
- [ ] 9.5 Add a status-derived badge to `CarouselCard`: "In progress" for ongoing, "Coming soon" for upcoming, none for finished
- [ ] 9.6 Replace or coexist with the current `WoodCarousel` / `CodeCarousel` / `ProductsBar` on the home page per design.md (decision: subsume code-project carousels into the Finished spiral; keep Wood-Working as a separate `project_type` filtered section if it should remain)
- [ ] 9.7 Confirm click handler still opens the existing project modal route for every spiral card

## 10. Case study rendering updates

- [ ] 10.1 Update `ProjectModal.tsx` (and any case-study page) to render `companyName` only when `clientVisibility !== 'hidden'`; render "Confidential client" when hidden
- [ ] 10.2 Render `duration` and `status` labels in the case study header
- [ ] 10.3 Render attributed developers per `dev_attribution`: `named` shows display_name + avatar; `anonymized` shows "Developer A", "Developer B"… with silhouette; `hidden` omits the block entirely
- [ ] 10.4 Ensure the order of developers matches the `developers[]` array order (lead first)

## 11. Legal pages

- [ ] 11.1 Create `src/pages/Legal/Terms.tsx` rendering placeholder copy with a "Final text pending legal review" notice until the lawyer-supplied text is available
- [ ] 11.2 Create `src/pages/Legal/Privacy.tsx` rendering placeholder copy with the same notice
- [ ] 11.3 Add footer links labeled "Terms" and "Privacy" pointing at `/legal/terms` and `/legal/privacy`; ensure the footer is present on home, admin, and onboarding pages
- [ ] 11.4 Replace placeholder copy with lawyer-supplied final text before launch (gated on non-code-tasks L5 + L6)

## 12. Brand transition and copy

- [ ] 12.1 Update site title, OG image, and meta description to "Keisar Club"
- [ ] 12.2 Update hero copy from first-person Amitay framing to "Keisar Club" framing where the agency is the subject; preserve first-person where Amitay genuinely speaks
- [ ] 12.3 Update footer to "© Keisar Club" with a "Founded by Amitay Keisar" line
- [ ] 12.4 Verify logo placement; if a wordmark variant is needed, add it (decision deferred to non-code-tasks B1)

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
