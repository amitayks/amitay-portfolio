## Context

The project modal credits (`project-modal-credits`) render developer attribution beside the main image (desktop `DevSlot`) or as uniform tabs below it (mobile). The mobile developer tab was intentionally shipped as a no-op button (`onClick={() => {}}`) with the spec noting "behavior added later"; desktop avatars are non-interactive. Public developer data flows `ProjectModal → item.developerProfiles (PublicProfile[]) → apiProfile.getPublicProfiles → SELECT * FROM profiles_public`. The `profiles_public` view currently exposes only `id, display_name, avatar_url, github_handle, bio, links` and gates on `status = 'active'`. `resume_url` exists on `profiles` but is private. The profile self-edit surface lives in `MePage.tsx` (the broader profile/account capability is still in the in-progress `keisar-club-platform` change, not in main specs).

This change is the "later" — a developer profile popup — plus the few extra public properties worth showing in it.

## Goals / Non-Goals

**Goals:**
- A minimalist developer profile popup with crucial info only, opened from the credits on both mobile (dev tab) and desktop (avatars/names).
- Three new public profile properties — `headline`, `skills`, `availability` — plus making `resume_url` public.
- A self-edit surface so developers can populate the new fields.
- Honor `dev_attribution`: the popup is reachable only for `named` developers.

**Non-Goals:**
- A standalone developer page or route (popup only).
- Editing developer profiles from the admin project editor (devs edit their own profile).
- Backfilling existing rows (all new fields nullable / defaulted).
- Changing how developers are joined onto a project (`portfolio-data-layer` references `profiles_public` generically and is unchanged).

## Decisions

### 1. Data model — three columns + one enum
```sql
create type availability_status as enum ('available', 'open_to_work', 'busy');
alter table profiles
  add column headline   text,
  add column skills     text[] not null default '{}',
  add column availability availability_status;   -- nullable → null hides the badge
```
- **`availability` as enum, nullable** over a boolean "open to work": three states (actively available / open to offers / busy) read better as a status pill, and `null` cleanly means "don't show a badge." Trade-off: adding a state later needs an `ALTER TYPE`.
- **`skills` as `text[]`** over jsonb: Postgres-native, ordered, trivially mapped to chips; no nested shape needed. `not null default '{}'` so consumers never branch on null.
- **`headline` as plain `text`**: it is not translated (the rest of the profile — name/bio — isn't either).

### 2. Public exposure — recreate `profiles_public`
```sql
create or replace view profiles_public as
select id, display_name, avatar_url, github_handle, bio, links,
       headline, skills, availability, resume_url
from profiles where status = 'active';
```
The view stays the single public gate. `resume_url` becomes public **by design** (the user opted in) — it is a link the developer chose to host, and the view still only surfaces `active` profiles. `apiProfile.getPublicProfiles` already does `select('*')` on the view, so **no query change** is needed — exposure is view-driven.

### 3. Types
- New `export type AvailabilityStatus = "available" | "open_to_work" | "busy";`
- `PublicProfile` gains `headline: string | null`, `skills: string[]`, `availability: AvailabilityStatus | null`, `resume_url: string | null`.
- `Profile` gains the same three columns (it is `select *`).
- `ProfileEditable` gains `headline`, `skills`, `availability` so the editor can patch them.

### 4. `DevProfilePopup` component (new file)
A nested modal layered over the open `ProjectModal`, reusing the existing framer-motion / `liquid-glass` patterns. Content, top→bottom, minimalist:
- Large square avatar (reuse `DevAvatar`).
- Name + availability badge on one line (badge: colored dot + label; hidden when `availability` is null).
- Headline (one line, muted).
- Bio (clamped).
- Skills as wrapping chips (capped to a sane count to protect the minimalist layout; overflow shown as "+N").
- A links row: GitHub (`github_handle` → `github.com/<handle>`), plus `links.linkedin / links.website / links.twitter`, plus a Resume button when `resume_url` is set. Each is an icon (+ optional label), opening in a new tab.
- **Alternatives considered:** a routed `/dev/:id` page (rejected — heavier, leaves the modal context); an inline expansion of `DevSlot` (rejected — cramped, no room for the full field set).

### 5. Trigger wiring (`ProjectModal.tsx`)
- Expand `DevInfo` and `devList()` to carry the full public field set (currently only `{id, name, avatarUrl, bio}`), so a selected dev can be rendered without a refetch.
- Hold `selectedDev` state in `ProjectModal`; render `<DevProfilePopup dev={selectedDev} onClose={…}/>` when set.
- Mobile: the dev `CreditTab` `onClick` opens the popup for that developer (replaces `() => {}`).
- Desktop: wrap each `DevSlot` avatar/name in a button that opens the popup for that developer.
- **Attribution gating:** `devList()` already nulls identity for `anonymized` and returns `[]` for `hidden`. The triggers SHALL be inert unless `dev_attribution === 'named'`, so anonymized/hidden credits never open a popup (nothing real to show).

### 6. Self-edit surface (`MePage.tsx`)
Add inputs for the three new fields to the existing profile editor: a text input (`headline`), a tag/comma input mapped to `string[]` (`skills`), and a select (`availability`, including a "—" / none option). Saved through the existing `updateProfile(userId, patch: ProfileEditable)` path.

### 7. Layering / dismissal
The popup sits above the project modal. Escape and backdrop click close the **popup only** (project modal stays open); the popup stops click propagation so interactions inside it don't reach the modal backdrop.

## Risks / Trade-offs

- **`resume_url` now public** → Mitigation: dev-controlled, only `active` profiles exposed, opt-in decision; no other private columns join the view.
- **Nested-modal interaction conflicts** (escape / backdrop / scroll-lock double-handling) → Mitigation: popup handles its own escape/backdrop and stops propagation; project modal close is unaffected.
- **Skills overflow / long headline breaking the minimalist card** → Mitigation: chip cap with "+N", line-clamp on bio, truncate headline.
- **Empty popup** (named dev with no headline/skills/links) → Mitigation: every field renders conditionally; avatar + name always present, so the card is never blank.
- **RTL** (`project-modal-rtl`) → the popup must mirror like the rest of the modal; verify on a HE render.
- **Type generation drift** → after the migration, `Profile`/`PublicProfile` are hand-edited; optionally regenerate Supabase types to confirm alignment.

## Migration Plan

1. Apply the migration (new enum + three columns) via Supabase, then recreate `profiles_public`.
2. Update types (`profile.ts`) and confirm `apiProfile` compiles (no query change).
3. Build `DevProfilePopup`; expand `DevInfo`/`devList`; wire mobile + desktop triggers.
4. Add the three inputs to `MePage.tsx`.
5. Verify: named (1/2/3+) opens popup; anonymized/hidden inert; links/resume/skills/availability render and degrade; mobile + desktop + RTL.
6. **Rollback:** restore the prior `profiles_public` definition, `drop column` the three fields, `drop type availability_status`; revert the component/type/editor changes. No data migration to reverse.

## Open Questions

- Max number of skill chips to show before "+N" (default proposal: ~6) — tune during implementation.
- Whether the desktop single-developer `DevSlot`, which already shows name + bio, also needs a distinct "view profile" affordance or whether making the avatar/name clickable is enough (lean: clickable is enough).
