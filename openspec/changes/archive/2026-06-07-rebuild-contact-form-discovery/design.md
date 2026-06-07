## Context

The contact form (`src/components/ContactForm.tsx`) is a single-step react-hook-form with four fields submitted to EmailJS. i18n is served from `public.site_content` via `useSiteText()`. The form lives inside a height-animated `liquid-glass-strong` container driven by a `ResizeObserver`. The site is bilingual (en + he, RTL handled by `LanguageTransition` + `dir`).

This change reshapes the form's information architecture — substituting two generic fields (`subject`, `message`) for three pointed discovery questions placed **before** the identity fields — without changing the delivery mechanism (still EmailJS, browser-side) or the data layer (Supabase still i18n-only).

## Goals / Non-Goals

**Goals:**
- Three required discovery textareas (`challenge`, `tried`, `whyNow`) lead the form, followed by `name` + `email`.
- EmailJS payload reshaped to carry the new fields; subject line is derived, not entered.
- Per-question validation calibrated to thoughtful answers (not single words, not essays).
- Bilingual copy that reads naturally in Hebrew, not as a literal translation of the English.
- Section heading + subtext refreshed to match the discovery framing while keeping the site's confident, direct voice.

**Non-Goals:**
- No multi-step wizard. The three questions render together on one screen.
- No submission storage. No Supabase `contact_submissions` table. No edge function.
- No move off EmailJS. The Resend / Cloudflare Email path is explicitly deferred.
- No spam protection in this change (Turnstile, honeypot, rate limiting).
- No `name`/`email` removal. Replies need a destination.

## Decisions

### D1 — Field order: discovery first, identity last
**Decision:** Render in this order: `challenge` → `tried` → `whyNow` → `name` → `email`.

**Rationale:** Asking for identity first frames the form as "fill out your details." Asking for the challenge first frames it as "tell me what's wrong." The second framing is the entire point of the redesign. Identity comes last because by that point the user is invested.

**Alternatives considered:**
- *Multi-step wizard.* Higher perceived effort, deeper drop-off, more code. Not worth it for a contact form on a portfolio.
- *Identity first, then questions.* Defeats the framing change.

### D2 — Drop `subject` and `message`
**Decision:** Remove both. The email subject line is auto-derived as `"New inquiry — {name}"`.

**Rationale:** `subject` overlaps with Q1 (challenge names the topic). `message` overlaps with all three questions — keeping it asks the same thing a fourth time and signals the questions are optional. Both removals also keep the form from getting visually overwhelming with five long fields.

**Alternatives considered:**
- *Keep `message` as optional.* Tempting, but optional fields below required ones usually get skipped — the field would carry no signal and add visual weight.
- *Keep `subject`, drop `message`.* Subject becomes redundant once Q1 exists.

### D3 — Validation thresholds per question
**Decision:** Use Zod with these `min` lengths:

| Field | Min chars | Rationale |
|---|---|---|
| `challenge` | 30 | Forces a real sentence. "Need a website" (15) fails; "Our checkout flow is losing users at the payment step" (53) passes. |
| `tried` | 20 | Lower bar — "Tried Stripe Checkout, didn't fit" is fine. |
| `whyNow` | 15 | Lowest bar — "Investor demo in 6 weeks" (24) passes; even "Q3 launch deadline" (19) passes. |
| `name` | 2 | Unchanged from current. |
| `email` | valid email | Unchanged from current. |

Validation behavior matches existing form: runs on submit, then on blur after first submit (react-hook-form default with `mode: 'onTouched'` if explicitly set; current uses default mode + manual). No change to validation timing or display style.

**Alternatives considered:**
- *Uniform 50-char minimum.* Too punishing on Q3 (urgency often expressed in 3-4 words).
- *Word count instead of char count.* Char count is simpler; Hebrew characters carry more meaning per char so a Hebrew "Q1 too short" trigger at 30 chars is still reasonable.

### D4 — i18n keys: nested per question with sub-keys
**Decision:** New `site_content` keys, all in shape `{en, he}`:

```
contact.form.challenge.label
contact.form.challenge.placeholder
contact.form.challenge.error
contact.form.tried.label
contact.form.tried.placeholder
contact.form.tried.error
contact.form.whyNow.label
contact.form.whyNow.placeholder
contact.form.whyNow.error
contact.heading                    (updated value)
contact.subtext                    (updated value)
contact.email.subjectPrefix        (NEW — for derived email subject)
```

Existing keys to leave in place (orphaned but harmless): `contact.form.subject.placeholder`, `contact.form.message.placeholder`. Cleanup deferred.

**Alternatives considered:**
- *Flat keys (`contact.form.challenge_label`).* Inconsistent with existing nesting style.
- *Single `contact.form.challenge` value carrying `{label, placeholder, error}`.* The `useSiteText` `t()` function returns a string, not an object — would require a new helper or shape.

### D5 — Section heading + subtext copy (DNA-fitting)

Current: *"Make dream come true."* / *"Have a project in mind? Tell me about it and I'll get back to you within 24 hours."*

That copy pitches the *output* (the project). The new framing needs to invite the *input* (the problem).

**Proposed copy (recommended option):**

| Key | EN | HE |
|---|---|---|
| `contact.heading` | **Start with the hard part.** | **נתחיל מהחלק הקשה.** |
| `contact.subtext` | Three honest questions. Considered answers get a real reply within 24 hours. | שלוש שאלות כנות. תשובות שמושקעות יקבלו מענה אמיתי תוך 24 שעות. |
| `contact.email.subjectPrefix` | New inquiry — | פנייה חדשה — |

Voice match: imperative, short, no exclamation marks, slightly poetic — same register as "Make dream come true." but reframed for discovery. Hebrew version is rewritten for the language, not transliterated.

**Backup options** (in case the recommended doesn't land):

- **B.** EN: *"Tell me what's stuck."* / HE: *"ספר לי מה תקוע."* — more colloquial, lower register
- **C.** EN: *"Skip the pitch."* / HE: *"בלי פיץ'."* — wittier, slightly aggressive

User picks during apply.

### D6 — EmailJS payload shape
**Decision:** Send this payload object:

```ts
{
  from_name: data.name,
  from_email: data.email,
  challenge: data.challenge,
  tried: data.tried,
  why_now: data.whyNow,         // snake_case for EmailJS template var convention
  subject: `${subjectPrefix}${data.name}`,  // derived; EmailJS uses this for the email Subject header
}
```

The EmailJS template `template_1eehme9` must be manually edited in the EmailJS dashboard to:
- Render `{{challenge}}`, `{{tried}}`, `{{why_now}}` in the email body (with labels)
- Remove `{{message}}` reference
- Keep `{{from_name}}`, `{{from_email}}`, `{{subject}}` references

**Sequencing matters.** If we deploy the form change before the template change, the email Amitay receives will be missing the new content (and the old `{{message}}` placeholder will render as empty). Plan: update template *first*, then deploy frontend.

### D7 — Form container height
**Decision:** No change. The existing `ResizeObserver` on `contentRef` handles height transitions and will animate to the larger form size correctly.

**Risk note:** Three textareas plus name + email plus button means the form is noticeably taller. Visual sanity check at mobile breakpoints is part of the task list.

### D8 — Privacy page review
**Decision:** Read `PrivacyPage.tsx`, compare against the new data being collected. If the page already says something like "form submissions are forwarded by email and not stored," no edit needed. If it doesn't, append a short clause.

The user is not creating an account — the data flow is identical to today (browser → EmailJS → email inbox). No new PII categories. Likely no edit needed; verify, don't assume.

## Risks / Trade-offs

- **EmailJS template drift** → Manual step outside code. Mitigation: ordered as Task 1 in tasks.md (do it before deploying frontend). Verify by sending a test submission and inspecting the received email.
- **Lower submission volume** → Intentional; this is the goal. No mitigation needed, but worth watching for a few weeks post-deploy to confirm the *quality* improves and we don't just lose all volume.
- **Hebrew copy quality** → Translations rarely carry the same punch. Mitigation: copy is rewritten in HE (not translated), and the recommended copy is already authored above; review during apply, not after.
- **Mobile layout regression** → Three textareas + identity fields on a small screen could push the submit button below the fold. Mitigation: visual check on iPhone-sized viewport before merging; reduce textarea default rows if needed.
- **Orphaned i18n keys** → `contact.form.subject.placeholder` and `contact.form.message.placeholder` become unused. Mitigation: leave them — they cost nothing in the DB. Track cleanup as a separate trivial change later.
- **Validation feels too strict on first try** → Users might bounce on the 30-char Q1 minimum. Mitigation: the error message phrasing should be encouraging ("Give us a sentence or two") not punitive ("Too short"). Captured in tasks.md.

## Migration Plan

1. **Author EN+HE strings** locally, agreed in this design.
2. **Insert new `site_content` rows** via Supabase MCP (`apply_migration` or `execute_sql`) — additive, no destructive change.
3. **Update EmailJS template** in the EmailJS dashboard (Chrome MCP when reconnected, or by hand). Send a manual test submission against the current frontend before the frontend change ships to confirm the template gracefully ignores extra/missing vars (it should — EmailJS does not error on unknown vars).
4. **Update `ContactForm.tsx` + `Contact.tsx`** locally, run the dev server, smoke-test EN and HE on desktop + mobile widths.
5. **Visual + privacy review.**
6. **Merge.**

**Rollback:** Revert the frontend commit. EmailJS template change can stay (template tolerates extra vars and missing legacy ones render as empty). Orphaned i18n rows are harmless.

## Open Questions

- **Heading/subtext copy** — does the recommended option (D5 option A) feel right, or should we go with B or C? Decided at apply time.
- **Subject line format** — `"New inquiry — {name}"` vs. `"New inquiry — {challenge first 60 chars}"`. The latter is more scannable in an inbox. Default to name-based for safety (no length surprises); revisit if the inbox triage gets noisy.
