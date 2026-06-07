## Purpose

Lifecycle management for WebGL shader canvases: pause on viewport exit, pause on tab hide via the Page Visibility API, color-animation throttling, and visibility-state propagation to downstream effects.

## Requirements

### Requirement: Shader viewport pause
When a shader section scrolls out of the viewport, the shader SHALL pause rendering by setting `speed={0}`. When the section scrolls back into viewport range (within 200px rootMargin), the shader SHALL resume its original speed value.

#### Scenario: Shader pauses when scrolled away
- **WHEN** a shader section exits the viewport plus 200px margin
- **THEN** the shader's `speed` prop is set to `0`, halting GPU rendering

#### Scenario: Shader resumes when scrolled into view
- **WHEN** a shader section enters the viewport 200px rootMargin
- **THEN** the shader's `speed` prop is restored to its configured value (e.g., `0.15` for GodRays)

### Requirement: Page visibility pause
All shaders and animation loops SHALL pause when the browser tab is not visible. The system SHALL use the Page Visibility API (`document.visibilitychange` / `document.hidden`) to detect tab visibility.

#### Scenario: Tab becomes hidden
- **WHEN** the user switches to another browser tab
- **THEN** all shader `speed` props are set to `0` and the `useAnimatedRayColors` rAF loop stops updating colors

#### Scenario: Tab becomes visible again
- **WHEN** the user returns to the portfolio tab
- **THEN** shaders resume their configured speed and the color animation loop resumes

### Requirement: Color animation throttling
The `useAnimatedRayColors` hook SHALL throttle color recalculation to every 4th animation frame (~15fps at 60Hz). The rAF loop SHALL continue running but SHALL skip `setColors()` calls on non-update frames.

#### Scenario: Color updates at reduced framerate
- **WHEN** the hero shader is visible and animating
- **THEN** HSL-to-Hex color recalculation occurs approximately every 4 frames, not every frame

#### Scenario: Color animation respects page visibility
- **WHEN** the tab is hidden
- **THEN** the color animation rAF loop skips all updates until the tab becomes visible again

### Requirement: Visibility state propagation
The `LazyShader` component SHALL expose its `isVisible` state to child shader components. Shader variants SHALL receive visibility state to control their `speed` prop.

#### Scenario: LazyShader provides visibility to children
- **WHEN** a shader is rendered inside `LazyShader`
- **THEN** the shader component receives the current visibility state and adjusts its `speed` prop accordingly
