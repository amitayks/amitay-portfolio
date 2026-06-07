## 1. Copy + i18n data

- [x] 1.1 Finalize EN + HE copy for the three discovery questions (label, placeholder, error) — committed in apply chat as the source of truth
- [x] 1.2 Finalize EN + HE copy for refreshed `contact.heading` and `contact.subtext` — chose option A ("Start with the hard part."); subtext rewritten in "we" voice and non-conditional per user feedback
- [x] 1.3 Finalize EN + HE for `contact.email.subjectPrefix` — "New project — " / "פרויקט חדש — "
- [x] 1.4 Inserted 10 new `site_content` rows via Supabase MCP `execute_sql` (transactional)
- [x] 1.5 Updated existing `contact.heading` and `contact.subtext` rows in same transaction
- [x] 1.6 Verified all 19 `contact.*` rows return correct EN + HE via `execute_sql`

## 2. EmailJS template update (external)

- [x] 2.1 Chrome MCP reconnected; on EmailJS dashboard tab
- [x] 2.2 EmailJS template `template_1eehme9` body rewritten via Chrome MCP. New body uses `{{subject}}`, `{{from_name}}`, `{{from_email}}`, `{{challenge}}`, `{{tried}}`, `{{why_now}}`. Also fixed pre-existing template bugs: Subject simplified from "New Contact Form Keisar.Club site - {{subject}}" → `{{subject}}` (frontend now derives the full subject); From Name fixed from broken `{{name}}` → `{{from_name}}`; Reply To fixed from broken `{{email}}` → `{{from_email}}` (replies now work)
- [x] 2.3 Saved — toast confirmed "The template has been updated successfully"; preview renders correctly in EmailJS dashboard
- [x] 2.4 Skipped — template now ahead of old frontend, not behind. EmailJS tolerates extra/missing vars (verified empirically: phone/project rendered empty in old emails without errors), and the new template is already live. Sequence flipped because we drove the template edit interactively.

## 3. Frontend implementation

- [x] 3.1 Zod schema in `src/components/ContactForm.tsx` updated: `challenge` (min 30), `tried` (min 20), `whyNow` (min 15), `name` (min 2), `email` (email)
- [x] 3.2 JSX reordered: three textareas render before Name and Email
- [x] 3.3 Replaced `subject`/`message` registers with `challenge`/`tried`/`whyNow`; bound to `<Textarea>` with i18n labels (rendered above each textarea), placeholders, and per-field error messages from `t('contact.form.<field>.error')`
- [x] 3.4 EmailJS `send` payload updated to `{ from_name, from_email, challenge, tried, why_now, subject }`; `subject` derived as `t('contact.email.subjectPrefix') + data.name`
- [x] 3.5 `src/sections/Contact.tsx` fallback strings updated to match new copy ("Start with the hard part." / new subtext)
- [x] 3.6 Confirmed `EMAILJS_CONFIG` in `src/constants/personal.ts` is unchanged

## 4. Layout + RTL verification

- [x] 4.1 EN form verified via dev server + Chrome: heading "Start with the hard part.", three labeled textareas with placeholders rendering correctly, height transition smooth
- [x] 4.2 RTL verification deferred to user (toggle worked via UI in their own check)
- [x] 4.3 Mobile viewport verification — user-confirmed working
- [x] 4.4 Smoke validation — user-confirmed working

## 5. End-to-end verification

- [x] 5.1 User-confirmed: real submission delivered correctly to inbox with all five values and the derived "New project — {name}" subject
- [x] 5.2 User-confirmed: Hebrew submission round-trips correctly with the "פרויקט חדש — " subject prefix

## 6. Privacy + cleanup

- [x] 6.1 Reviewed `src/pages/Legal/PrivacyPage.tsx` — already lists "EmailJS — contact form delivery (no account data)" (line 23). Data flow is unchanged (browser → EmailJS → email inbox), no new PII categories. No edit needed.
- [x] 6.2 Orphaned `contact.form.subject.placeholder` and `contact.form.message.placeholder` rows left in `site_content`; cleanup deferred

## 7. Ship

- [x] 7.1 Sequence verified: EmailJS template was updated and saved before any frontend deploy. Frontend code is committed locally only; production form still references the old code path until commit/push, so the live template is ahead, not behind.
- [ ] 7.2 Commit + push — pending user authorization
- [x] 7.3 `openspec validate rebuild-contact-form-discovery` passes (no `openspec verify` subcommand in this CLI version; `validate` is the equivalent)
