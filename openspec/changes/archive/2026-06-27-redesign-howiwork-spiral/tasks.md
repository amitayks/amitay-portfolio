## 1. Path & node geometry

- [x] 1.1 Add a `buildSinePath(cx, amplitude, wavelength, halfPeriods, y0, samplesPerHalf)` helper in `HowIWork.tsx` that returns an SVG path string for `x(y) = cx − amplitude · cos(2π·(y − y0)/wavelength)`
- [x] 1.2 Add a `buildNodes()` helper that places 5 nodes at the alternating extremes using the same sine math (so coords stay on-curve), returning `{ key, fallback, x, y }[]`
- [x] 1.3 Replace `SLALOM_PATH` with the generated sine path and `NODES` with the 5 generated nodes; set geometry constants `cx=300, amplitude=210, wavelength=640, y0=120, H=320`
- [x] 1.4 Update `VIEWBOX` to `"0 0 600 1520"`

## 2. Labels & rendering

- [x] 2.1 Replace the "bulb above / label below" block with "bulb centered on the curve point"
- [x] 2.2 Implement alternating-side label placement: `node.x < cx` → label left of bulb, else right; vertically centered, offset into the open space
- [x] 2.3 Keep `isFinal` handling for the last node (larger golden bulb)
- [x] 2.4 Confirm label responsive sizing stays (`text-[8px] md:text-xs`) and add container horizontal padding so side labels don't clip on mobile
- [x] 2.5 Move the bulb off the curve into a bulb+label group on the outer side (bulb nearest the line via `flex-row-reverse` for left bumps)
- [x] 2.6 Render bulbs behind the line (`svg z-10`, overlay `z-0`)
- [x] 2.7 Pop bulbs into existence on activation: hidden (scale 0) until lit, then spring scale-up + slide outward; labels fade in alongside

## 3. Reuse verification

- [x] 3.1 Confirm the scroll-draw (`dashOffset`), node-fraction `getPointAtLength` sampling, `useMotionValueEvent` states, gradient, and background track all work unchanged against the new path/nodes

## 4. Content / i18n

- [x] 4.1 Update in-code node fallbacks to: First Contact, Scope & Proposal, Build, Iterate, Your Product, Live
- [x] 4.2 Update Supabase `site_content` `journey.node1`–`node5` EN values to match
- [x] 4.3 Add/Update Supabase `journey.node1`–`node5` HE values (draft Hebrew; flag for user to wordsmith)

## 5. Verify

- [x] 5.1 Verify smooth scroll-draw with no visible corners on desktop — sine polyline is corner-free by construction; `tsc` + `vite build` pass. (Visual sign-off pending at localhost:5173)
- [ ] 5.2 Verify on a 375px viewport: serpentine structure intact, labels readable, no clipping — **needs your eyes** (label-clipping is the one real risk)
- [x] 5.3 Verify EN↔HE language switch updates all 5 labels and side placement still reads correctly — `t()`+`LanguageTransition` unchanged, HE values present in DB, side logic is geometric (lang-independent). (Visual sign-off pending)
- [x] 5.4 Run `openspec validate redesign-howiwork-spiral`
