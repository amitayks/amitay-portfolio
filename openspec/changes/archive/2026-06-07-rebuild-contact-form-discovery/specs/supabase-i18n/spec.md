## ADDED Requirements

### Requirement: Contact form discovery i18n keys
The `site_content` table SHALL contain the following keys, each with a `value` JSONB of shape `{ "en": string, "he": string }`, to support the discovery-style contact form: `contact.form.challenge.label`, `contact.form.challenge.placeholder`, `contact.form.challenge.error`, `contact.form.tried.label`, `contact.form.tried.placeholder`, `contact.form.tried.error`, `contact.form.whyNow.label`, `contact.form.whyNow.placeholder`, `contact.form.whyNow.error`, `contact.form.name.error`, `contact.form.email.error`, and `contact.email.subjectPrefix`. All keys SHALL have both `en` and `he` values populated (no nulls). Combined with the pre-existing `contact.form.name.placeholder`, `contact.form.email.placeholder`, `contact.form.success`, `contact.form.error`, `contact.cta`, `contact.heading`, and `contact.subtext` keys, every visible string on the contact form SHALL resolve through `useSiteText()` — no rendered text in `ContactForm.tsx` or `Contact.tsx` is hardcoded as the primary source.

#### Scenario: All discovery keys present in EN and HE
- **WHEN** the `site_content` table is queried for all keys starting with `contact.form.challenge.`, `contact.form.tried.`, `contact.form.whyNow.`, the validation-error keys `contact.form.name.error` and `contact.form.email.error`, and the key `contact.email.subjectPrefix`
- **THEN** twelve rows are returned, each with both `value->>'en'` and `value->>'he'` populated

#### Scenario: Lookup via useSiteText
- **WHEN** a component calls `t('contact.form.challenge.label')` while the language is Hebrew
- **THEN** it returns the Hebrew label string for the Challenge field

#### Scenario: Hebrew validation errors for identity fields
- **WHEN** the language is Hebrew and the Name or Email field fails validation
- **THEN** the displayed error is the Hebrew value of `contact.form.name.error` / `contact.form.email.error`, not English fallback text

### Requirement: Updated contact section copy
The existing `site_content` rows for `contact.heading` and `contact.subtext` SHALL be updated in place (same keys, new `value`) to reflect the discovery framing. Both `en` and `he` values SHALL be rewritten — the Hebrew SHALL read naturally, not as a literal translation of the English.

#### Scenario: New heading copy
- **WHEN** `t('contact.heading')` is called
- **THEN** it returns the updated discovery-framed heading (e.g., "Start with the hard part." in EN, "נתחיל מהחלק הקשה." in HE), not the prior project-pitch copy

#### Scenario: New subtext copy
- **WHEN** `t('contact.subtext')` is called
- **THEN** it returns the updated subtext referencing the three questions and a 24-hour response window
