## Why

The project modal credits hint at the people who built each project but never let a visitor learn who they are: on mobile the developer tab is a dead button (`onClick={() => {}}`), on desktop the developer photos are not interactive, and the only public facts we store about a developer are name, avatar, bio, and a links blob. There is no way to surface "who is this person, what do they do, and where can I reach them." This change adds a minimalist developer profile popup and the few extra profile properties worth showing in it.

## What Changes

- **New profile properties** on `profiles`: `headline` (short role tagline), `skills` (tag list), and `availability` (`available` / `open_to_work` / `busy`, nullable → no badge).
- **Expose them publicly**: recreate the `profiles_public` view to include `headline`, `skills`, `availability`, and the already-stored-but-private `resume_url`; carry them through `PublicProfile` and the developer-profile fetch.
- **Self-edit surface**: add headline / skills / availability inputs to the profile editor page so developers can populate the new fields.
- **New developer profile popup**: a minimalist card showing avatar, name, availability badge, headline, bio, skills, social links, and a resume link — opened from the credits.
- **Wire the credits triggers**: the mobile developer tab opens the popup (replacing the no-op), and desktop `DevSlot` avatars/names become interactive triggers.
- The popup honors `dev_attribution`: it only opens for **named** developers; anonymized/hidden credits stay non-interactive (no real identity to reveal).

## Capabilities

### New Capabilities
- `developer-profile-fields`: The public developer profile properties — the new `headline` / `skills` / `availability` columns, their (plus `resume_url`) exposure through `profiles_public` and `PublicProfile`, and the self-edit inputs that let a developer set them.
- `developer-profile-popup`: The minimalist developer profile popup opened from the project modal credits — its content, trigger surfaces (mobile tab + desktop avatars/names), attribution gating, and dismissal.

### Modified Capabilities
- `project-modal-credits`: The mobile developer tab SHALL open the developer profile popup (replacing the placeholder "behavior added later"), and desktop developer avatars/names SHALL become interactive triggers that open it.

## Impact

- **DB**: `profiles` gains `headline text`, `skills text[]`, `availability availability_status` (new enum); `profiles_public` view recreated to expose those plus `resume_url`. No data backfill needed (all nullable / defaulted).
- **Types/API**: `PublicProfile`, `Profile`, `ProfileEditable` gain the new fields; new `AvailabilityStatus` type. `apiProfile` selects them via the existing `profiles_public` query (no query change — view-driven).
- **Code**: new `DevProfilePopup` component; `ProjectModal.tsx` (`DevInfo`/`devList` carry the new fields, wire `onClick` on the mobile tab and desktop avatars); profile editor page (`MePage.tsx`) gains the new inputs.
- **No** routing or query-key changes; `dev_attribution` semantics unchanged.
