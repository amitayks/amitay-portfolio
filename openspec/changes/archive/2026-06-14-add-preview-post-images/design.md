## Context

`storyboard/preview/index.html` is a single-file previewer that renders a post `.json` as two LinkedIn-style cards (English LTR, Hebrew RTL). It loads posts via three paths: `fetch` (over http, the documented `serve.py` path), the File System Access picker (`fsa`), and drag-drop/paste. All three converge on `renderPost(data)` (index.html:942), which builds both cards via `renderCard(...)`. Every post `.json` carries a stable `id` equal to its basename (e.g. `linkedin-agentmesh-3`). A new `storyboard/images/` folder will hold images named to match that id. `serve.py` already serves the repo root over GET, so `../images/...` is fetchable with no server change; its only mutating verb (PUT) stays locked to `posts/`.

## Goals / Non-Goals

**Goals:**
- Show a post's matching image inline in both language cards, in LinkedIn feed position (below text/hashtags, above the action bar).
- Resolve the image by convention from the post `id` with zero per-post configuration.
- Degrade silently: a missing image, or a non-http origin, renders exactly as today.
- Require no server, build, or live-site changes.

**Non-Goals:**
- Multi-image carousels (`<id>-1.png`, `<id>-2.png`). Single image only for now.
- Per-language image variants (`<id>.he.png`). Shared image across both cards for now; the id-based key leaves room to add a `.{lang}` override later.
- Editing, uploading, or writing images from the previewer. Images are read-only assets.
- Directory enumeration of `storyboard/images/` (arbitrary filenames/extensions).

## Decisions

### Decision: Key off `data.id`, not the load URL
The image lookup uses `data.id` as the basename. This is available on every load path (including paste), so the feature isn't tied to the `fetch` path's URL. Alternative — deriving from the loaded file URL — was rejected because it breaks for FSA/paste and duplicates info already in the JSON.

### Decision: Probe by extension with an `<img>` element, not `fetch`
Resolution sets `img.src = ../images/<id>.<ext>` and races `onload`/`onerror` through the ordered extension list (`png, jpg, jpeg, webp, gif, avif`); first `onload` wins, all `onerror` exhausted = no image. This avoids extra `fetch`/CORS handling, gives a free silent miss (no broken-image icon since we only attach the element after a successful load), and reuses the browser's own image cache. Alternative — scraping the `../images/` directory HTML index (as `refreshFetchList` does for posts at index.html:1424) — was rejected for v1: more code, and it depends on the server emitting a parseable index. The fixed extension set covers the realistic formats; an unusual extension simply won't match (documented behavior).

### Decision: Resolve once in `renderPost`, inject into both cards
`renderCard` builds each card and returns its wrapper. After both are appended in `renderPost`, a single probe runs; on success the resolved image is inserted into each card's `.post` just before `.post-foot`. Resolving once (not per-card) avoids a double probe. The image element sits as a sibling after hashtags/counter and outside `bodyEl`, so the existing "…see more" fold (which only rewrites `bodyEl`) never hides or duplicates it.

### Decision: Gate on http origin
Image resolution runs only when the page origin is http(s) (the existing `IS_HTTP` flag already used to gate the fetch loader). On `file://`, `../images/` can't resolve, so we skip the probe entirely rather than flashing failed image loads.

## Risks / Trade-offs

- **Extension not in the probe set** (e.g. `.JPG` uppercase, `.heic`) → image silently won't show. Mitigation: probe order covers common web formats; README documents the supported set and the lowercase-extension convention.
- **`id` mismatch with filename** (post `id` edited away from its basename) → no image found. Mitigation: convention is documented; silent miss is acceptable and matches today's no-image behavior.
- **Sequential probe latency** (up to 6 failed loads before concluding "none") → negligible for a local previewer; failed image loads are fast and cached. Acceptable trade-off vs. a directory-listing round trip.
- **Caching a stale image** after replacing a file with the same name → browser may serve the cached image. Mitigation: hard-refresh; optional future cache-bust query param if it becomes a nuisance (out of scope now).
