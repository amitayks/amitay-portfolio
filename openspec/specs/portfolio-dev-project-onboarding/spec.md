# Portfolio Dev Project Onboarding Spec

This spec documents the workflow for adding new web development projects to the portfolio.

## Overview

Dev projects are identified by the `WEB-` prefix in their SKU. Each project requires:
1. **i18n files** (EN + HE) in `src/i18n/locales/{lang}/portfolio/`
2. **Supabase row** in the `portfolio` table
3. **Images** (main + optional gallery)

---

## Data Structure

### Supabase Table: `portfolio`

| Field | Type | Description |
|-------|------|-------------|
| `id` | auto | Primary key |
| `SKU` | string | Unique identifier, e.g., `WEB-MOCKINGBIRD` |
| `image` | string | Main image URL |
| `imagePack` | string[] | Gallery image URLs |
| `technologies` | string[] | Tech stack tags |
| `projectType` | enum | `"Web-Development"` for dev projects |
| `featured` | boolean | Show on homepage (default: false) |
| `settings` | object | `{ imageAspect: "squere", dir: "ltr" }` |
| `priority` | number | Sort order (higher = first) |
| `publish` | boolean | Visibility flag |
| `liveSite` | object | `{ link, subHeader }` |
| `github` | object | `{ link, subHeader }` |
| `additionalInfo` | array | `[{ label, value }, ...]` |

### i18n File Structure

Location: `src/i18n/locales/{en|he}/portfolio/{SKU}.json`

```json
{
  "title": "Project Title",
  "description": "Short description (1-2 sentences)",
  "longDescription": "Detailed description (paragraph)",
  "aboutProject": "About The Project",
  "readMore": "Read More",
  "github": {
    "label": "GitHub",
    "subHeader": "username/repo"
  },
  "liveSite": {
    "label": "Live Site",
    "subHeader": "Site Name"
  },
  "additionalInfo": {
    "key_name": {
      "label": "Display Label",
      "value": "Value"
    }
  }
}
```

Common `additionalInfo` keys for dev projects:
- `development_time`
- `framework` / `frontend`
- `backend`
- `database`
- `authentication`
- `deployment`
- `key_features`
- `styling`
- `performance`

---

## Projects Master List

### Already Existing
- `WEB-KEISAR-CLUB` - keisar.club
- `WEB-WILD-OASIS` - the-wild-oasis-website
- `WEB-WILD-OASIS-ADMIN` - the-wild-oasis

### To Add (11 projects)

| # | SKU | Repo | i18n EN | i18n HE | Supabase | Images |
|---|-----|------|---------|---------|----------|--------|
| 1 | `WEB-WEATHERMAN` | weatherMan | DONE | DONE | DONE | TODO |
| 2 | `WEB-ADDIT-DEV` | addit.dev | DONE | DONE | DONE | TODO |
| 3 | `WEB-ADDIT-APP` | addit (private) | DONE | DONE | DONE | TODO |
| 4 | `WEB-COMMIT-CONTENT-CREATOR` | commit-content-creatore | DONE | DONE | DONE | TODO |
| 5 | `WEB-BITBUCKET-PR-REVIEWER` | bitbucket-pr-reviewer | DONE | DONE | DONE | TODO |
| 6 | `WEB-NATIVE-CC-SKILL` | Native-CC-skill | DONE | DONE | DONE | TODO |
| 7 | `WEB-REACT-NATIVE-TEMPLATE` | react-native-template | DONE | DONE | DONE | TODO |
| 8 | `WEB-AI-PROMPT-BUILDER` | AI-Prompt-Builder | DONE | DONE | DONE | TODO |
| 9 | `WEB-OPEN-LAMPLIGHTER` | OpenLamplighter | DONE | DONE | DONE | TODO |
| 10 | `WEB-VISARA` | visara | DONE | DONE | DONE | TODO |
| 11 | `WEB-KEISAR-CLUB-APP` | keisar-club-app | DONE | DONE | DONE | TODO |

### Excluded
- `amitay-portfolio` - this site itself
- `umami` - fork
- `mockingbird` - fork

---

## Workflow Per Project

### Step 1: Gather Info from Repo
- [ ] Read README.md
- [ ] Identify technologies (package.json, requirements.txt)
- [ ] Check if live site exists
- [ ] Note key features

### Step 2: Write i18n Files
- [ ] Create `en/portfolio/WEB-{NAME}.json`
- [ ] Create `he/portfolio/WEB-{NAME}.json`

### Step 3: Define Supabase Data
- [ ] Prepare row data (JSON format ready for upload)

### Step 4: Images (Later Phase)
- [ ] Capture screenshots via Chrome MCP
- [ ] Upload to Supabase storage

### Step 5: Upload to Supabase (Later Phase)
- [ ] Insert row into portfolio table

### Step 6: Verify
- [ ] Check portfolio page
- [ ] Check detail page
- [ ] Check both EN/HE translations

---

## Project Info Template

When analyzing each project, gather:

```
PROJECT: ________________________
SKU: WEB-
Repo: github.com/amitayks/
Live Site: [URL or N/A]

CONTENT:
- Title (EN):
- Title (HE):
- Description (EN):
- Description (HE):
- Long Description (EN):
- Long Description (HE):

TECHNICAL:
- Technologies: []
- Framework:
- Backend:
- Database:
- Key Features:

ASSETS:
- Main Image: [ ] Captured [ ] Uploaded
- Gallery: [ ] Captured [ ] Uploaded

STATUS:
- [ ] i18n EN file
- [ ] i18n HE file
- [ ] Supabase data defined
- [ ] Verified on site
```

---

## Scripts Created

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/upload-portfolio-projects.js` | Upload projects via JS (blocked by RLS) | `npm run portfolio:upload` |
| `scripts/insert-portfolio-projects.sql` | SQL insert for Supabase SQL Editor | Copy/paste into Supabase |

## Current Status

- **i18n files**: ✅ All 22 files created (11 EN + 11 HE)
- **Supabase data**: ✅ All 11 projects inserted via SQL
- **Images**: ⏳ Next step - capture via Chrome MCP

## Next Step: Images

For each project, need to:
1. Navigate to live site or GitHub repo
2. Capture screenshot via Chrome MCP
3. Upload to Supabase storage
4. Update portfolio row with image URL

Projects with live sites (prioritize):
- WEB-WEATHERMAN → https://amitayks.github.io/weatherMan/
- WEB-ADDIT-DEV → https://addit.dev
- WEB-ADDIT-APP → https://addit.dev (or App Store screenshots)

Projects without live sites (use GitHub README):
- WEB-COMMIT-CONTENT-CREATOR
- WEB-BITBUCKET-PR-REVIEWER
- WEB-NATIVE-CC-SKILL
- WEB-REACT-NATIVE-TEMPLATE
- WEB-AI-PROMPT-BUILDER
- WEB-OPEN-LAMPLIGHTER
- WEB-VISARA
- WEB-KEISAR-CLUB-APP

---

## Notes

- All Hebrew translations should be drafted (will be reviewed)
- `featured: false` by default (manual override later)
- Images will be captured after all project content is complete
- SKU naming: `WEB-{REPO-NAME-UPPERCASE}`
