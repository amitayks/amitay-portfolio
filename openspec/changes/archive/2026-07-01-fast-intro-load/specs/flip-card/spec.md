## MODIFIED Requirements

### Requirement: Back face renders profile photo
The back face SHALL display a profile photo fetched from Supabase's `site-image` storage bucket via `useSiteImage()`, but the photo SHALL NOT be fetched or rendered during the intro. While the intro is running (`introPhase !== "done"`) the back face SHALL display only the liquid-glass surface — no photo — so that no heavy image is on the first-load critical path. After the intro completes, the photo SHALL be available for the navbar interactions: it is a 1:1 aspect ratio image, and when shown on the 1:1 navbar icon it SHALL fill the circular icon without cropping (`object-fit: cover`, `object-position: center`, clipped via `border-radius: 9999px` and `overflow: hidden`); when shown on the expanded 2:3 card it SHALL fill the face using `object-fit: cover`, cropped symmetrically.

#### Scenario: Back face is glass (no photo) during the intro
- **WHEN** the FlipCard's back face rotates into view during the intro flight (before `introPhase === "done"`)
- **THEN** the back face SHALL show only the liquid-glass surface
- **AND** no profile photo SHALL be fetched or displayed

#### Scenario: Profile photo in 1:1 navbar icon (post-intro)
- **WHEN** the intro has completed and the FlipCard is in its navbar state (48×48px, 1:1 aspect ratio)
- **AND** the card is flipped to show the back face (e.g., on hover)
- **THEN** the 1:1 profile photo SHALL fill the circular icon without cropping
- **AND** the photo SHALL be clipped to the circular shape via `border-radius: 9999px` and `overflow: hidden`

#### Scenario: Profile photo on expanded card (post-intro)
- **WHEN** the intro has completed and the card is expanded to its large 2:3 state showing the back face
- **THEN** the 1:1 profile photo SHALL fill the card face using `object-fit: cover`
- **AND** the photo SHALL be cropped symmetrically (top and bottom trimmed) to fit the taller ratio

#### Scenario: Photo not yet loaded post-intro
- **WHEN** the back face would be visible after the intro but the lazily-fetched photo has not finished downloading
- **THEN** a liquid-glass fallback surface SHALL be displayed instead (matching the card's glass styling)
- **AND** when the image finishes loading, it SHALL fade in with a brief opacity transition (~300ms)

## REMOVED Requirements

### Requirement: Profile image preloading
**Reason**: The eager on-mount fetch put a 437.8 KB JPEG (plus a Supabase signed-URL round-trip) on the first-load critical path, competing for bandwidth and main-thread time with the logo assembly on fresh/uncached visits. The photo is not needed during the intro at all.
**Migration**: Replaced by the "Deferred profile image loading" requirement below — the image is fetched only after the intro completes, so it no longer affects first paint or the assembly. The navbar hover/expand interaction still shows the photo (lazily loaded).

## ADDED Requirements

### Requirement: Deferred profile image loading
The FlipCard SHALL NOT fetch the profile image URL or download the image while the intro is running. The fetch (`useSiteImage()` and the subsequent image download) SHALL be deferred until after the intro has completed (`introPhase === "done"`), or until the back face is first needed by a navbar interaction, whichever the implementation finds cleaner. The goal is that a fresh/uncached first load incurs zero bytes and zero Supabase round-trips for the profile photo until the intro is over.

#### Scenario: No image fetch during the intro
- **WHEN** the FlipCard mounts and the intro is playing (`introPhase !== "done"`)
- **THEN** no request for the profile image URL or the image file SHALL be issued
- **AND** the first-load network and main thread SHALL be free of the profile photo

#### Scenario: Image fetched after the intro completes
- **WHEN** `introPhase` becomes `"done"`
- **THEN** the profile image fetch SHALL begin
- **AND** once loaded, the photo SHALL be shown on the navbar back face for hover/expand interactions
