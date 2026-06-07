## Why

The current contact form (name / email / subject / message) gets generic project pitches. We want to filter for serious, well-considered inquiries and start every conversation with the substance already on the table. Leading with three discovery questions — **biggest challenge**, **what you've tried**, **why now** — forces self-qualification and gives the first reply room to be specific instead of "thanks, tell me more."

## What Changes

- **Reorder + extend the form fields.** Three new required textareas SHALL appear *before* the existing identity fields, in this order:
  1. *What is the biggest challenge you're trying to solve right now?*
  2. *What have you already tried?*
  3. *Why is now the right time to address this?*
- **Keep name and email** as required fields after the three questions so replies are possible.
- **Drop the standalone `subject` field.** Q1 already names the topic; a separate subject is redundant. The email subject line SHALL be derived (e.g., "New inquiry — <name>").
- **Drop the freeform `message` field.** The three questions cover what `message` used to capture. Removing it avoids asking the same thing twice.
- **Update the EmailJS template** (`template_1eehme9`) to carry three new variables — `challenge`, `tried`, `why_now` — in addition to the kept `from_name` and `from_email`. **BREAKING** for the existing template payload: `subject` and `message` keys are removed.
- **Refresh the section heading and subtext** in `Contact.tsx` to match the discovery framing. The current copy ("Make dream come true." / "Have a project in mind?…") pitches a project; the new copy SHALL invite a conversation about a problem worth solving. Bilingual (en + he).
- **Add new i18n keys** to `public.site_content` for the three questions (label + placeholder + validation error, en + he) and for the refreshed heading/subtext. No schema change — same `{en, he}` shape.
- **Retune validation.** Q1 minLength stricter (~30 chars), Q2 moderate (~20), Q3 looser (~15). Name min 2, email valid email.
- **Privacy page review.** Confirm `src/pages/Legal/PrivacyPage.tsx` already covers free-text submissions; update only if it doesn't.

Not in scope: storing submissions in Supabase, moving off EmailJS, multi-step wizard UI, spam protection (Turnstile/honeypot).

## Capabilities

### New Capabilities
*(none)*

### Modified Capabilities
- `contact-form`: form field set changes from 4 fields (name, email, subject, message) to 5 fields (challenge, tried, why_now, name, email); EmailJS payload shape changes; validation rules per new field; new i18n keys
- `supabase-i18n`: new `site_content` keys added for the discovery questions and refreshed section copy (data-only addition, no schema change)

## Impact

- **Code**
  - `src/components/ContactForm.tsx` — Zod schema, field set, `register` calls, EmailJS payload, error messages
  - `src/sections/Contact.tsx` — heading + subtext copy keys
- **Data (Supabase)**
  - `public.site_content` rows added: `contact.form.challenge.{label,placeholder,error}`, `contact.form.tried.{label,placeholder,error}`, `contact.form.whyNow.{label,placeholder,error}`, and updated `contact.heading` + `contact.subtext` values
  - Removed/orphaned rows: `contact.form.subject.placeholder`, `contact.form.message.placeholder` (safe to leave for now; cleanup tracked separately)
- **External (EmailJS)**
  - Template `template_1eehme9` must be edited in the EmailJS dashboard to add `{{challenge}}`, `{{tried}}`, `{{why_now}}` and remove `{{subject}}` / `{{message}}`. Without this edit, the email Amitay receives will be missing the new content. Tracked as a manual task (Chrome MCP, or by hand).
- **Risk**
  - Higher friction = lower submission volume (intentional).
  - Form gets visually taller; existing `ResizeObserver`-driven height animation handles it but needs a visual sanity check.
  - Bilingual copy review needed — the discovery framing needs to read naturally in Hebrew, not as a translation.
- **Out of scope / no impact**
  - No new dependencies. No new database tables. No edge functions. No changes to `LanguageContext` or `useSiteText`.
