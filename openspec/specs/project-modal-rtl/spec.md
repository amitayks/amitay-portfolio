## Purpose

Right-to-left support for the project modal: additional-info rows respect the `dir` prop, sourced from `useLanguage`, so layout flips correctly under Hebrew.

## Requirements

### Requirement: Additional info rows respect dir parameter
The additional info key-value rows SHALL accept and apply the `dir` attribute from the current language context, so that in RTL mode (Hebrew) the label appears on the right and the value on the left.

#### Scenario: LTR mode (English)
- **WHEN** the language is English (`dir="ltr"`)
- **THEN** the label is on the left and the value is on the right

#### Scenario: RTL mode (Hebrew)
- **WHEN** the language is Hebrew (`dir="rtl"`)
- **THEN** the label is on the right and the value is on the left

### Requirement: Dir attribute sourced from useLanguage hook
The `dir` value SHALL be obtained from the `useLanguage()` hook's `dir` property, consistent with how other components in the modal handle directionality.

#### Scenario: Dir propagation
- **WHEN** the modal renders additional info
- **THEN** it uses the same `dir` value from `useLanguage()` that the title and description already use
