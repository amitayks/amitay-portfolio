## 1. Remove Wind Context

- [x] 1.1 Remove `WindProvider` wrapper from `src/pages/Portfolio.tsx`
- [x] 1.2 Remove `WindProvider` wrapper from `src/components/FeaturedProjectsSection.tsx`
- [x] 1.3 Delete `src/contexts/WindContext.tsx`
- [x] 1.4 Update `src/contexts/index.ts` to remove Wind exports

## 2. Simplify PortfolioCard Animation

- [x] 2.1 Remove `useWind` import and `isWindActive` usage from PortfolioCard
- [x] 2.2 Remove imperative animation loop (useAnimate, AbortController, animationRef)
- [x] 2.3 Replace with declarative Framer Motion `animate` prop with keyframes
- [x] 2.4 Add organic variation formula based on card index (duration 5-7s range)
- [x] 2.5 Add staggered delay formula based on card index
- [x] 2.6 Configure animation values: y (-2 to -5px), x (-1 to 1px), rotate (-0.3 to 0.3deg)
- [x] 2.7 Use `transition.repeat: Infinity` with `repeatType: "mirror"` for seamless loop
- [x] 2.8 Use `ease: "easeInOut"` for smooth sine-wave motion

## 3. Update Hover Behavior

- [x] 3.1 Remove `whileHover` settle effect that stops floating
- [x] 3.2 Ensure floating continues during hover (no animation interruption)

## 4. Maintain Accessibility

- [x] 4.1 Keep `useReducedMotion` check to disable animation when preference set
- [x] 4.2 Verify animation is completely disabled (not just slowed) when reduced motion enabled

## 5. Cleanup and Verification

- [x] 5.1 Run build to ensure no errors
- [ ] 5.2 Verify animation looks smooth and ambient (not bouncy)
- [ ] 5.3 Verify cards are out of sync with each other (organic feel)
- [ ] 5.4 Test with reduced motion preference enabled
