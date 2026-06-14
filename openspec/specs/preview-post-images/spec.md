## Purpose

The storyboard post previewer resolves and renders a post's matching image from `storyboard/images/` (basename equal to the post `id`) inside its LinkedIn-style language cards, so a draft can be reviewed as text plus its attached visual.

## Requirements

### Requirement: Match an image to a post by id

The previewer SHALL resolve a post's image by treating the post `id` as the image basename under `storyboard/images/`, probing a fixed ordered set of extensions (`png`, `jpg`, `jpeg`, `webp`, `gif`, `avif`) and using the first candidate that loads successfully.

#### Scenario: Image exists for the post

- **WHEN** a post with `id` `linkedin-agentmesh-3` is loaded and `storyboard/images/linkedin-agentmesh-3.png` exists
- **THEN** the previewer resolves that file as the post's image

#### Scenario: First matching extension wins

- **WHEN** more than one candidate extension exists for the same post id
- **THEN** the previewer uses the first one in the probe order (`png` before `jpg`, etc.) and ignores the rest

#### Scenario: No image exists for the post

- **WHEN** no file under `storyboard/images/` matches the post id for any probed extension
- **THEN** the previewer renders the post exactly as it does without image support, showing no broken-image icon and no error

### Requirement: Render the matched image inside each language card

The previewer SHALL display the matched image inside every rendered language card, positioned below the post text and hashtags and above the action bar, mirroring the LinkedIn feed layout. The image SHALL remain visible regardless of the body "…see more" collapsed/expanded state.

#### Scenario: Image shown in both language cards

- **WHEN** a post with a matching image is loaded
- **THEN** the image appears in both the English (LTR) and Hebrew (RTL) cards, below the text/hashtags and above the action bar

#### Scenario: Image stays visible when body is collapsed

- **WHEN** a card's body is long enough to be collapsed behind "…see more"
- **THEN** the matched image remains visible and is not folded away with the text

#### Scenario: No layout change when image is absent

- **WHEN** a post has no matching image
- **THEN** the card layout is unchanged from the pre-feature rendering

### Requirement: Image resolution is gated on an http origin

The previewer SHALL only attempt image resolution when the page is served over an http(s) origin, so that the `storyboard/images/` path resolves. On a non-http origin (e.g. `file://`) it SHALL skip image resolution silently.

#### Scenario: Served over http via serve.py

- **WHEN** the previewer is opened over `http://` (e.g. through `serve.py`) and a matching image exists
- **THEN** the image is resolved and rendered

#### Scenario: Opened directly from the filesystem

- **WHEN** the previewer page is opened from a `file://` origin
- **THEN** image resolution is skipped silently and the post renders without an image
