## Why

The storyboard post previewer renders a LinkedIn-style card from a post's `.json`, but a real feed post is usually text **plus an image**. Reviewers can't judge how a draft will actually land without seeing the attached visual. A new `storyboard/images/` folder now holds images named to match each post, so the previewer should surface the matching image inline.

## What Changes

- When a post is loaded in the previewer, derive its `id` and look for a matching image in `storyboard/images/` (basename equals the post id, e.g. `linkedin-agentmesh-3.png`).
- If a matching image is found, render it inside each language card — below the text/hashtags, above the action bar — mirroring LinkedIn's feed layout.
- Probe for the image by trying a fixed set of extensions (`png`, `jpg`, `jpeg`, `webp`, `gif`, `avif`); the first that loads wins. A missing image renders exactly as today (no broken-image icon, no error).
- Image resolution keys off `data.id` and is gated on an http origin, so it works on every load path (fetch / FSA picker / paste) **when** the page is served over http (e.g. `serve.py`); it silently no-ops on `file://`.
- No `serve.py` change required: it already serves the repo root over GET, so `../images/...` is fetchable. PUT stays locked to `posts/` (images are read-only here).

## Capabilities

### New Capabilities
- `preview-post-images`: Resolving and rendering a post's matching image from `storyboard/images/` inside the previewer's language cards.

### Modified Capabilities
<!-- None — the storyboard previewer has no existing OpenSpec capability; this introduces the first one scoped to image support. -->

## Impact

- `storyboard/preview/index.html` — image probe + injection into the card render path (`renderPost` / `renderCard`).
- `storyboard/images/` — new read-only asset folder consumed by the previewer.
- `storyboard/preview/README.md` — document the naming convention and behavior.
- No server, build, or runtime-site impact; this is local previewer-only tooling.
