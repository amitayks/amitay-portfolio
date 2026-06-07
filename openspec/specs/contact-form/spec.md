## ADDED Requirements

### Requirement: Form fields
The contact form SHALL have five required fields in this order: (1) **Challenge** (textarea, required, min 30 chars) — the answer to "What is the biggest challenge you're trying to solve right now?"; (2) **Tried** (textarea, required, min 20 chars) — the answer to "What have you already tried?"; (3) **Why Now** (textarea, required, min 15 chars) — the answer to "Why is now the right time to address this?"; (4) **Name** (text, required, min 2 chars); (5) **Email** (email, required, valid email format). There SHALL be no standalone Subject field, no freeform Message field, and no project type selector.

#### Scenario: Valid form submission
- **WHEN** user fills all five fields with valid data and submits
- **THEN** the form submits successfully via EmailJS

#### Scenario: Invalid email format
- **WHEN** user enters "not-an-email" in the email field and submits
- **THEN** a validation error appears below the email field

#### Scenario: Empty required field
- **WHEN** user leaves the Name field empty and submits
- **THEN** a validation error appears below the Name field

#### Scenario: Challenge field too short
- **WHEN** user enters "need a website" (15 chars) in the Challenge field and submits
- **THEN** a validation error appears below the Challenge field and the form does not submit

#### Scenario: Why Now field meets the minimum
- **WHEN** user enters "Q3 launch deadline" (18 chars) in the Why Now field and the other fields are valid
- **THEN** validation passes for the Why Now field

### Requirement: Form validation with Zod
The form SHALL use React Hook Form with Zod validation via `@hookform/resolvers`. Validation SHALL run on submit and on blur after first submission attempt.

#### Scenario: Validation on blur after first attempt
- **WHEN** user has submitted once (triggering validation) and then changes a field
- **THEN** validation runs on blur for that field, showing/clearing errors in real-time

### Requirement: EmailJS submission
The form SHALL submit via EmailJS using the existing configuration: SERVICE_ID `'service_vtxkxkm'`, TEMPLATE_ID `'template_1eehme9'`, USER_ID `'fI7maFmjNQrrkKrV3'`.

#### Scenario: Email sent successfully
- **WHEN** EmailJS returns a success response
- **THEN** the form transitions to a success state

#### Scenario: Email fails to send
- **WHEN** EmailJS returns an error
- **THEN** an error message appears below the form

### Requirement: Form success state
On successful submission, the form SHALL fade out and be replaced by an animated checkmark icon with a success message. The success state SHALL use a liquid-glass card with a subtle green-tinted glow.

#### Scenario: Success animation
- **WHEN** the form submits successfully
- **THEN** the form fades out, a checkmark animates in, and a success message appears

### Requirement: Form error state
On submission failure, an inline error message SHALL appear below the submit button. The error message text SHALL be red-tinted.

#### Scenario: Error message display
- **WHEN** EmailJS submission fails
- **THEN** an error message appears below the submit button without clearing the form data

### Requirement: Dark themed inputs
All form inputs SHALL have dark styling: liquid-glass background, white text, `text-white/30` placeholder text. Inputs SHALL have `rounded-xl` corners and appropriate padding.

#### Scenario: Input styling
- **WHEN** the contact form renders
- **THEN** inputs have dark glass backgrounds with white text and subtle placeholder text

### Requirement: Submit button
The submit button SHALL be `bg-white text-black rounded-full` with the text from `t('contact.cta')` ("Send Message") and an ArrowUpRight icon. It SHALL show a loading spinner during submission.

#### Scenario: Loading state during submission
- **WHEN** the form is submitting
- **THEN** the submit button shows a spinner and is disabled

### Requirement: Translatable form labels
All form labels, placeholders, validation messages, success message, and error message SHALL be sourced from `useSiteText()` with the `contact.form.*` keys.

#### Scenario: Hebrew form
- **WHEN** the site language is Hebrew
- **THEN** all form labels, placeholders, and messages appear in Hebrew

### Requirement: Discovery questions precede identity fields
The three discovery textareas (Challenge, Tried, Why Now) SHALL render before the identity fields (Name, Email) in the form's DOM order and visual order. This ordering applies in both LTR (English) and RTL (Hebrew) layouts; only the per-field horizontal direction changes, not the question-then-identity sequence.

#### Scenario: English layout order
- **WHEN** the form renders in English
- **THEN** the visual order top-to-bottom is: Challenge, Tried, Why Now, Name, Email, Submit

#### Scenario: Hebrew layout order
- **WHEN** the form renders in Hebrew
- **THEN** the visual order top-to-bottom is: Challenge, Tried, Why Now, Name, Email, Submit (each field internally RTL-aligned)

### Requirement: EmailJS payload shape
The form SHALL send the following payload to EmailJS on submit: `from_name` (Name field), `from_email` (Email field), `challenge` (Challenge field), `tried` (Tried field), `why_now` (Why Now field), and `subject` (derived per the "Derived email subject" requirement). The legacy `message` key SHALL NOT be included.

#### Scenario: Payload contains all five user-entered values
- **WHEN** the form submits
- **THEN** the EmailJS `send` call receives an object containing `from_name`, `from_email`, `challenge`, `tried`, `why_now`, and `subject` — and no `message` key

### Requirement: Derived email subject
The email subject sent to EmailJS SHALL be derived as `"{contact.email.subjectPrefix}{name}"` where `subjectPrefix` is the localized prefix from `site_content` (currently "New project — " in English, "פרויקט חדש — " in Hebrew) and `name` is the value of the Name field at submit time. No standalone Subject input SHALL be rendered. The EmailJS template's Subject field SHALL be `{{subject}}` (no static prefix) so the derived value is used as-is.

#### Scenario: English subject derivation
- **WHEN** the language is English and the Name field contains "Dana Cohen"
- **THEN** the EmailJS payload `subject` is "New project — Dana Cohen"

#### Scenario: Hebrew subject derivation
- **WHEN** the language is Hebrew and the Name field contains "דנה כהן"
- **THEN** the EmailJS payload `subject` is "פרויקט חדש — דנה כהן"

### Requirement: Encouraging validation copy
Validation error messages for the three discovery questions SHALL be phrased to encourage a fuller answer rather than report a length failure (e.g., "Give us a sentence or two — what's the actual problem?" not "Minimum 30 characters"). Each question's error message text SHALL be localized via `site_content` keys `contact.form.challenge.error`, `contact.form.tried.error`, `contact.form.whyNow.error`.

#### Scenario: Encouraging error on too-short challenge
- **WHEN** user submits with a 10-character Challenge answer
- **THEN** the error message displayed is the localized `contact.form.challenge.error` value, phrased as an invitation to elaborate (not a numeric character count)
