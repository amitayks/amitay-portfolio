## ADDED Requirements

### Requirement: Device tier detection
The system SHALL detect the device capability tier and provide appropriate rendering quality settings. Detection SHALL use `navigator.maxTouchPoints`, viewport width, `navigator.hardwareConcurrency`, and `navigator.deviceMemory` (when available).

#### Scenario: Desktop device detected
- **WHEN** the device has no touch points or viewport width exceeds 1024px
- **THEN** the device tier is "desktop" with `maxPixelCount` of approximately 2,457,600 (2048 x 1200)

#### Scenario: Mobile device detected
- **WHEN** the device has touch points and viewport width is 1024px or less
- **THEN** the device tier is "mobile" with `maxPixelCount` of approximately 576,000 (960 x 600)

#### Scenario: Low-end device detected
- **WHEN** `navigator.hardwareConcurrency` is 4 or fewer OR `navigator.deviceMemory` is 4GB or less
- **THEN** the device tier is "low-end" with `maxPixelCount` of approximately 256,000 (640 x 400)

### Requirement: Shader pixel count capping
All shader components SHALL receive a `maxPixelCount` prop value based on the detected device tier. The `maxPixelCount` SHALL limit the total number of pixels the WebGL shader renders regardless of canvas display size.

#### Scenario: Shader renders at capped resolution
- **WHEN** a shader mounts on a mobile device
- **THEN** the shader's internal canvas resolution is limited to the mobile tier's `maxPixelCount`, even if the CSS display size is larger

#### Scenario: Desktop renders at higher resolution
- **WHEN** a shader mounts on a desktop device
- **THEN** the shader renders at up to the desktop tier's `maxPixelCount`, providing higher quality on capable hardware

### Requirement: Shader canvas GPU layer promotion
The shader canvas wrapper div SHALL have `will-change: transform` applied to promote it to its own compositor layer. This SHALL prevent shader canvas repaints from triggering repaints on sibling DOM elements.

#### Scenario: Shader wrapper is GPU-accelerated
- **WHEN** a shader canvas wrapper renders
- **THEN** it has `will-change: transform` set, creating a separate compositor layer

### Requirement: usePageVisibility hook
A `usePageVisibility` hook SHALL return `true` when the page is visible and `false` when hidden. It SHALL listen to the `visibilitychange` event on `document`.

#### Scenario: Hook returns visibility state
- **WHEN** a component calls `usePageVisibility()`
- **THEN** it receives the current page visibility as a boolean

#### Scenario: Hook updates on tab switch
- **WHEN** the user switches away from the tab and back
- **THEN** the hook's return value updates from `true` to `false` and back to `true`

### Requirement: useDeviceTier hook
A `useDeviceTier` hook SHALL return an object containing the device tier name ("desktop", "mobile", or "low-end") and the corresponding `maxPixelCount` value. The tier SHALL be computed once on mount and remain stable for the session.

#### Scenario: Hook returns device settings
- **WHEN** a component calls `useDeviceTier()`
- **THEN** it receives an object with `tier` (string) and `maxPixelCount` (number)
