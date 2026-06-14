## 1. Image resolution

- [x] 1.1 Add an extension-probe helper that, given a post `id`, tries `../images/<id>.<ext>` for `png, jpg, jpeg, webp, gif, avif` in order via an `<img>` `onload`/`onerror` race and resolves with the first loaded URL (or none)
- [x] 1.2 Gate the probe on the existing `IS_HTTP` origin check so it is skipped on `file://`
- [x] 1.3 URL-encode the `id` for the path while preserving the `.<ext>` suffix

## 2. Render integration

- [x] 2.1 In `renderCard`, give each card a stable hook (return the `.post` element / class) so the resolved image can be inserted before `.post-foot`
- [x] 2.2 In `renderPost`, after both cards are appended, run the probe once and inject the resolved image into each card below hashtags/counter and above the action bar
- [x] 2.3 Ensure the image element is a sibling outside `bodyEl` so the "…see more" fold never hides or duplicates it
- [x] 2.4 Add minimal CSS for the in-card image (full-width, rounded to match the card, no overflow)

## 3. Graceful degradation

- [x] 3.1 Confirm a post with no matching image renders identically to today (no broken-image icon, no error, no layout shift)
- [x] 3.2 Confirm `file://` and non-matching ids skip cleanly

## 4. Verification & docs

- [x] 4.1 Drop a test image named after an existing post into `storyboard/images/`, serve via `serve.py`, and verify it appears in both EN and HE cards in feed position
- [x] 4.2 Verify the image persists across "…see more" expand/collapse and across edit mode
- [x] 4.3 Update `storyboard/preview/README.md` with the naming convention, supported extensions, and http-origin requirement
