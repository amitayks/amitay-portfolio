## 1. Database & view

- [x] 1.1 Create migration: `create type availability_status as enum ('available','open_to_work','busy')`
- [x] 1.2 Same migration: `alter table profiles add column headline text, add column skills text[] not null default '{}', add column availability availability_status`
- [x] 1.3 Recreate `profiles_public` view to also select `headline, skills, availability, resume_url` (keep the `status = 'active'` filter)
- [x] 1.4 Apply the migration and verify columns + view via a `select` against `profiles_public`

## 2. Types & data layer

- [x] 2.1 Add `AvailabilityStatus` type to `src/types/profile.ts`
- [x] 2.2 Add `headline`, `skills`, `availability`, `resume_url` to `PublicProfile`
- [x] 2.3 Add `headline`, `skills`, `availability` to `Profile` and `ProfileEditable`
- [x] 2.4 Confirm `apiProfile` (`getPublicProfile(s)` via `select('*')` on `profiles_public`) compiles and returns the new fields — no query change expected

## 3. DevProfilePopup component

- [x] 3.1 Create `src/components/DevProfilePopup.tsx` taking a single public developer + `onClose`
- [x] 3.2 Layout (minimalist, top→bottom): avatar, name + availability badge, headline, bio, skills chips, links row
- [x] 3.3 Availability badge: colored dot + label per status; hidden when availability is unset
- [x] 3.4 Skills as wrapping chips with a visible cap and a "+N" overflow indicator
- [x] 3.5 Links row: GitHub (handle → `github.com/<handle>`), `links.linkedin/website/twitter`, Resume (`resume_url`); each opens in a new tab; absent links omitted
- [x] 3.6 Conditional rendering so a sparse developer (name + avatar only) shows no empty sections
- [x] 3.7 Dismissal: Escape and backdrop click close the popup only; stop click propagation so the project modal stays open; reuse framer-motion / `liquid-glass` patterns and ensure it layers above the modal

## 4. Wire triggers in ProjectModal

- [x] 4.1 Expand `DevInfo` and `devList()` to carry `headline`, `skills`, `availability`, `resume_url`, `github_handle`, and `links`
- [x] 4.2 Add `selectedDev` state and render `<DevProfilePopup>` when set
- [x] 4.3 Mobile: replace the developer `CreditTab` `onClick={() => {}}` with one that opens the popup for that developer
- [x] 4.4 Desktop: make `DevSlot` avatars/names interactive triggers that open the popup
- [x] 4.5 Gate all triggers on `dev_attribution === 'named'` (anonymized/hidden stay inert)

## 5. Self-edit surface (MePage)

- [x] 5.1 Add a `headline` text input to the profile editor in `src/pages/MePage.tsx`
- [x] 5.2 Add a `skills` tag/comma input mapped to `string[]`
- [x] 5.3 Add an `availability` select including a "none" option that clears the value
- [x] 5.4 Persist via the existing `updateProfile(userId, patch: ProfileEditable)` path

## 6. Verify

<!-- Verified via `tsc -b` (exit 0) + `vite build` (exit 0) + code-path tracing.
     No live click-through: this DB has 0 project rows and no populated dev
     fields, so a manual smoke test is recommended once seed data exists. -->
- [x] 6.1 Named developer (1 / 2 / 3+) opens the popup from desktop avatars and the mobile tab — wired: `openDev` set only when `named`; DevCell→button, mobile tab→`openDev(devs[0])`
- [x] 6.2 Anonymized and hidden attribution open no popup and expose no trigger — `hidden`→empty devList; `anonymized`→`openDev` undefined so DevCell renders inert `<div>` and the tab onClick is undefined
- [x] 6.3 Fully-populated vs sparse developer render correctly (badge, headline, bio, skills cap, links/resume) with no empty sections — every section in `DevProfilePopup` renders conditionally
- [x] 6.4 Popup Escape/backdrop closes only the popup; project modal stays open — capture-phase Escape + `stopImmediatePropagation`; backdrop `onClose` with card `stopPropagation`; popup at `z-[90]` above the modal
- [x] 6.5 Editing fields on MePage persists and the values appear in the popup — saved via `updateProfile(ProfileEditable)`, read back through `profiles_public`→`devList`
- [x] 6.6 Check mobile, desktop, and RTL (`project-modal-rtl`) renders — `md:hidden`/`md:block` split preserved; popup card takes `dir` from `useLanguage`
