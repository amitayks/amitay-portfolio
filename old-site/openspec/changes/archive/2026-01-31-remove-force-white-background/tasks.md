## 1. Remove Theme Override Logic

- [x] 1.1 Remove the `setTheme` import from `src/pages/Apply.tsx` (line 23)
- [x] 1.2 Remove the useEffect block that forces light mode (lines 56-70)
- [x] 1.3 Keep the `trackPageVisit` call - move it outside the removed useEffect if needed

## 2. Verification

- [x] 2.1 Run `npm run check` to ensure no linting errors
- [ ] 2.2 Test Apply page in dark mode - verify it stays dark
- [ ] 2.3 Test Apply page in light mode - verify it stays light
- [ ] 2.4 Test navigation to/from Apply page - verify theme doesn't change
