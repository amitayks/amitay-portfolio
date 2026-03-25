## ADDED Requirements

### Requirement: Form fields
The contact form SHALL have four fields: Name (text, required, min 2 chars), Email (email, required, valid email format), Subject (text, required, min 2 chars), Message (textarea, required, min 10 chars). There SHALL be no project type selector.

#### Scenario: Valid form submission
- **WHEN** user fills all fields with valid data and submits
- **THEN** the form submits successfully via EmailJS

#### Scenario: Invalid email format
- **WHEN** user enters "not-an-email" in the email field and submits
- **THEN** a validation error appears below the email field

#### Scenario: Empty required field
- **WHEN** user leaves the Name field empty and submits
- **THEN** a validation error appears below the Name field

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
