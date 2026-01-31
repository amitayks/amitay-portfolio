## Context

The Apply page currently has special theme handling that forces light mode on mount and restores the previous theme on unmount. This was likely added for design consistency during initial development but creates a jarring user experience when navigating to/from the page.

Current behavior in `src/pages/Apply.tsx` (lines 54-70):
1. On mount: saves current theme state, then forces light mode via `setTheme(false)`
2. On unmount: restores the previously saved theme state

All other pages (Contact, Portfolio, etc.) respect the site-wide theme without override.

## Goals / Non-Goals

**Goals:**
- Remove theme override logic from Apply page
- Apply page respects user's current theme preference
- Consistent theming behavior across all pages

**Non-Goals:**
- Changing the Apply page visual design or layout
- Modifying the global theme system
- Adding new theme options

## Decisions

**Decision: Remove the entire useEffect block**
- Rationale: The cleanest approach is to remove the theme-forcing logic entirely rather than making it conditional
- Alternative considered: Adding a feature flag - rejected as unnecessary complexity for removing unwanted behavior

**Decision: Remove the `setTheme` import**
- Rationale: After removing the useEffect, the import becomes unused and should be cleaned up

## Risks / Trade-offs

**Risk: Apply page may not look as intended in dark mode**
- Mitigation: The page already uses `useTheme()` colors throughout, so it should adapt correctly. Visual review after change is recommended.

**Risk: None significant**
- This is a straightforward removal of special-case logic with no architectural impact.
