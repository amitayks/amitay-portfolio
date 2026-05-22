## ADDED Requirements

### Requirement: OAuth providers limited to Google and GitHub
The system SHALL support exactly two authentication providers: Google and GitHub, configured through Supabase Auth. The system MUST NOT expose password login, email-link login, or Apple Sign-In in v1.

#### Scenario: Login page shows two providers
- **WHEN** an anonymous visitor navigates to `/login`
- **THEN** the page renders two buttons labeled "Continue with Google" and "Continue with GitHub" and no other authentication option

#### Scenario: Password endpoints are not exposed
- **WHEN** the front-end source is inspected
- **THEN** no UI or call site invokes `signInWithPassword`, `signUp`, or `resetPasswordForEmail`

### Requirement: OAuth sign-in flow
Each provider button SHALL invoke `supabase.auth.signInWithOAuth({ provider })` with a redirect back to the application origin. On successful callback the system SHALL create or update the user's `profiles` row.

#### Scenario: First-time Google login creates a profile
- **WHEN** a user clicks "Continue with Google" and completes the Google consent flow with a Google account that has no existing `profiles` row
- **THEN** a new `profiles` row is created keyed to `auth.users.id` with `avatar_url` and `full_name` seeded from the Google identity payload and `role='dev'` by default

#### Scenario: Returning GitHub login does not overwrite edited fields
- **WHEN** a user who has previously edited their `display_name` and `avatar_url` signs in again with GitHub
- **THEN** the existing `display_name` and `avatar_url` are preserved and only `github_handle` and `updated_at` are refreshed from the OAuth payload

### Requirement: Auth context available to React tree
An auth context SHALL be exposed to the React application providing: current session, current `profiles` row, `signIn(provider)`, `signOut()`, and a loading flag. The provider SHALL hydrate from `supabase.auth.getSession()` on mount and subscribe to `onAuthStateChange`.

#### Scenario: Components read auth state via hook
- **WHEN** any component calls `useAuth()`
- **THEN** it receives `{ session, profile, signIn, signOut, isLoading }` and re-renders when the session changes

#### Scenario: Sign out clears session
- **WHEN** a logged-in user calls `signOut()`
- **THEN** `supabase.auth.signOut()` is invoked, the context's session becomes `null`, and the user is redirected to `/`

### Requirement: Role-gated routes
Routes SHALL be gated by the authenticated user's `profiles.role`. Unauthenticated users SHALL be redirected to `/login`. Authenticated users without the required role SHALL receive a 403 page.

#### Scenario: Anonymous user blocked from /me
- **WHEN** an anonymous visitor navigates to `/me`
- **THEN** they are redirected to `/login` with a `redirect=/me` query parameter

#### Scenario: Non-admin blocked from /admin
- **WHEN** a logged-in user whose `profiles.role` is `'dev'` navigates to `/admin`
- **THEN** they see a 403 "Not authorized" page and the admin UI is not loaded

### Requirement: OAuth tokens never persisted client-side
OAuth provider tokens (Google or GitHub access tokens) MUST NOT be persisted to local storage, IndexedDB, or any client-side store beyond what Supabase Auth manages internally for the session.

#### Scenario: No raw tokens in storage
- **WHEN** the browser storage is inspected after login
- **THEN** no key contains the raw OAuth provider access token; only the Supabase-managed session token is present
