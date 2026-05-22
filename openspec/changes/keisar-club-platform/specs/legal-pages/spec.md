## ADDED Requirements

### Requirement: Terms of service route
The system SHALL expose a public route at `/legal/terms` that renders the Keisar Club Terms of Service supplied by the legal workstream. The page MUST be reachable without authentication.

#### Scenario: Anonymous visitor reads terms
- **WHEN** an anonymous visitor navigates to `/legal/terms`
- **THEN** the terms content renders and no login prompt appears

### Requirement: Privacy policy route
The system SHALL expose a public route at `/legal/privacy` that renders the Keisar Club Privacy Policy supplied by the legal workstream. The page MUST be reachable without authentication.

#### Scenario: Anonymous visitor reads privacy policy
- **WHEN** an anonymous visitor navigates to `/legal/privacy`
- **THEN** the privacy policy content renders and no login prompt appears

### Requirement: Footer links to legal pages
The site footer SHALL link to both `/legal/terms` and `/legal/privacy` from every page in the application.

#### Scenario: Footer present on home
- **WHEN** the home page renders
- **THEN** the footer contains visible links labeled "Terms" and "Privacy" pointing at `/legal/terms` and `/legal/privacy` respectively

#### Scenario: Footer present on admin
- **WHEN** an admin renders `/admin`
- **THEN** the footer still contains the two legal links

### Requirement: Onboarding consent
The onboarding form at `/onboard` SHALL include a required checkbox stating "I have read and agree to the Terms of Service and Privacy Policy" with inline links to both pages. Registration MUST be blocked until the checkbox is checked.

#### Scenario: Submit blocked without consent
- **WHEN** a developer fills the onboarding form but does not check the consent box
- **THEN** the Submit button is disabled and the form cannot be submitted

#### Scenario: Consent timestamp recorded
- **WHEN** a developer submits the onboarding form with consent checked
- **THEN** a `terms_accepted_at` timestamp is recorded on the `profiles` row equal to the submission time
