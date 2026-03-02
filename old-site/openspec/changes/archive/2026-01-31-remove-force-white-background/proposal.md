## Why

The Apply page (`src/pages/Apply.tsx`) forces light mode when mounted, overriding the user's theme preference. This creates an inconsistent experience where navigating to Apply suddenly switches the theme, then reverts when leaving. The page should respect the site-wide theme like all other pages.

## What Changes

- Remove the `useEffect` that forces light mode on Apply page mount (lines 54-70)
- Remove the `setTheme` import since it will no longer be needed
- Apply page will now respect the current site theme like Contact and other pages

## Capabilities

### New Capabilities

None (this is a bug fix / consistency improvement)

### Modified Capabilities

None (no existing specs)

## Impact

- Affected code: `src/pages/Apply.tsx` (lines 23, 54-70)
- Affected systems: Theme behavior on Apply page
- Risk: Low - removing special-case logic to align with standard behavior
- User experience: Apply page will maintain user's chosen theme instead of forcing light mode
