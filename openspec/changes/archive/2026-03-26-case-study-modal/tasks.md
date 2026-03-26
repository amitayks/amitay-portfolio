## Case Study Modal — Tasks

Restructure the project detail overlay to follow a case study format.
Keep the image gallery and link cards as-is. Only the info section changes.
All Supabase content updates need EN + HE.

---

## 1. Database Schema — Add New Columns

- [x] 1.1 Add `problem` (text, nullable) column to `portfolio` table
- [x] 1.2 Add `what_i_built` (text, nullable) column to `portfolio` table
- [x] 1.3 Add `how_it_works` (text, nullable) column to `portfolio` table
- [x] 1.4 Add `result` (text, nullable) column to `portfolio` table

---

## 2. TypeScript Types

- [x] 2.1 Update `src/types/portfolio.ts` — add `problem`, `whatIBuilt`, `howItWorks`, `result` (all optional strings) to `PortfolioItem`

---

## 3. Modal Component — Case Study Layout

- [x] 3.1 Update `src/components/ProjectModal.tsx` — replace the description → longDescription → additionalInfo section with the case study layout
- [x] 3.2 Style section headers — small uppercase label (`text-xs uppercase tracking-widest text-white/40 font-body`)
- [x] 3.3 Hide empty sections gracefully — fallback to longDescription for unmigrated products
- [x] 3.4 Keep the link cards (github/liveSite) at the bottom, unchanged
- [x] 3.5 Update `src/services/apiPortfolio.ts` — add new columns to select, map snake_case to camelCase

---

## 4. Product Content — Addit Marketing Site (WEB-ADDIT-DEV)

- [x] 4.1 Write EN content: problem, what_i_built, how_it_works, result
- [x] 4.2 Write HE content: problem, what_i_built, how_it_works, result
- [x] 4.3 Update both rows in Supabase

---

## 5. Product Content — Addit V1 React Native (WEB-ADDIT-APP)

- [x] 5.1 Write EN content: problem, what_i_built, how_it_works, result
- [x] 5.2 Write HE content: problem, what_i_built, how_it_works, result
- [x] 5.3 Update both rows in Supabase

---

## 6. Product Content — Addit V2 Android Native (WEB-ADDIT-ANDROID)

- [x] 6.1 Write EN content: problem, what_i_built, how_it_works, result
- [x] 6.2 Write HE content: problem, what_i_built, how_it_works, result
- [x] 6.3 Update both rows in Supabase

---

## 7. Product Content — Addit Server (WEB-ADDIT-SERVER)

- [x] 7.1 Write EN content: problem, what_i_built, how_it_works, result
- [x] 7.2 Write HE content: problem, what_i_built, how_it_works, result
- [x] 7.3 Update both rows in Supabase

---

## 8. Product Content — Muse (WEB-MUSE)

- [x] 8.1 Write EN content: problem, what_i_built, how_it_works, result
- [x] 8.2 Write HE content: problem, what_i_built, how_it_works, result
- [x] 8.3 Update both rows in Supabase

---

## 9. Product Content — AgentMesh (WEB-AGENTMESH)

- [x] 9.1 Write EN content: problem, what_i_built, how_it_works, result
- [x] 9.2 Write HE content: problem, what_i_built, how_it_works, result
- [x] 9.3 Update both rows in Supabase

---

## 10. Product Content — Visara (WEB-VISARA)

- [x] 10.1 Write EN content: problem, what_i_built, how_it_works, result
- [x] 10.2 Write HE content: problem, what_i_built, how_it_works, result
- [x] 10.3 Update both rows in Supabase

---

## 11. Product Content — GlobalWeather (WEB-GLOBAL-WEATHER)

- [x] 11.1 Write EN content: problem, what_i_built, how_it_works, result
- [x] 11.2 Write HE content: problem, what_i_built, how_it_works, result
- [x] 11.3 Update both rows in Supabase

---

## 12. Product Content — Native App Builder Skill (WEB-NATIVE-CC-SKILL)

- [x] 12.1 Write EN content: problem, what_i_built, how_it_works, result
- [x] 12.2 Write HE content: problem, what_i_built, how_it_works, result
- [x] 12.3 Update both rows in Supabase

---

## 13. i18n — Section Headers

- [x] 13.1 Add Supabase keys for section headers (EN): `modal.section.problem` = "The Problem", `modal.section.whatIBuilt` = "What I Built", `modal.section.howItWorks` = "How It Works", `modal.section.techStack` = "Tech Stack", `modal.section.result` = "Result"
- [x] 13.2 Add Supabase keys for section headers (HE): Hebrew translations
- [x] 13.3 Use `useSiteText` for all section headers in the modal component
