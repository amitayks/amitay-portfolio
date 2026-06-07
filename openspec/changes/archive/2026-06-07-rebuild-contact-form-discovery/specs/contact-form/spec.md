## MODIFIED Requirements

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

## ADDED Requirements

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
The email subject sent to EmailJS SHALL be derived as `"{contact.email.subjectPrefix}{name}"` where `subjectPrefix` is the localized prefix from `site_content` (e.g., "New inquiry — " in English, "פנייה חדשה — " in Hebrew) and `name` is the value of the Name field at submit time. No standalone Subject input SHALL be rendered.

#### Scenario: English subject derivation
- **WHEN** the language is English and the Name field contains "Dana Cohen"
- **THEN** the EmailJS payload `subject` is "New inquiry — Dana Cohen"

#### Scenario: Hebrew subject derivation
- **WHEN** the language is Hebrew and the Name field contains "דנה כהן"
- **THEN** the EmailJS payload `subject` is "פנייה חדשה — דנה כהן"

### Requirement: Encouraging validation copy
Validation error messages for the three discovery questions SHALL be phrased to encourage a fuller answer rather than report a length failure (e.g., "Give us a sentence or two — what's the actual problem?" not "Minimum 30 characters"). Each question's error message text SHALL be localized via `site_content` keys `contact.form.challenge.error`, `contact.form.tried.error`, `contact.form.whyNow.error`.

#### Scenario: Encouraging error on too-short challenge
- **WHEN** user submits with a 10-character Challenge answer
- **THEN** the error message displayed is the localized `contact.form.challenge.error` value, phrased as an invitation to elaborate (not a numeric character count)
