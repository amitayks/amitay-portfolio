import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useIntro, type IntroPhase } from "@/contexts/IntroContext";
import { usePageVisibility } from "@/hooks/usePageVisibility";
import { useDeviceTier } from "@/hooks/useDeviceTier";

/**
 * Canvas-2D warp starfield for the hero background.
 *
 * Stars travel toward the camera (z decreases) and project out from a vanishing
 * point; streak length is proportional to the current travel speed. The speed
 * is eased toward a per-intro-phase target, so the field enters at max warp and
 * decelerates into a calm cruise as the headline lands.
 */

// --- Travel speed (z units consumed per 60fps frame) ---
const MAX_WARP = 0.045;
const MID_WARP = 0.012;
const CRUISE = 0.0022;
const SPEED_EASE = 0.025; // per-60fps-frame smoothing toward the target speed

// --- Projection / field model (z in (0, 1], 1 = far, ~0 = at camera) ---
const Z_NEAR = 0.04; // recycle once a star passes this depth
const SPEED_AT_FREEZE_DT_MS = 50; // clamp dt so a hidden-tab gap can't cause a jump

// --- Device-tier cost levers ---
const TIER_SETTINGS: Record<
  ReturnType<typeof useDeviceTier>["tier"],
  { starCount: number; dprCap: number }
> = {
  desktop: { starCount: 700, dprCap: 2 },
  mobile: { starCount: 350, dprCap: 1.5 },
  "low-end": { starCount: 180, dprCap: 1 },
};

interface Star {
  x: number; // world x in [-1, 1]
  y: number; // world y in [-1, 1]
  z: number; // depth in (0, 1]
  hue: number; // cyan→blue hue
  sat: number; // saturation (some stars whiter)
  px: number; // previous projected x (CSS px), NaN until first projection
  py: number; // previous projected y (CSS px)
}

function targetSpeedFor(phase: IntroPhase): number {
  switch (phase) {
    case "overlay-fadeout":
      return MID_WARP;
    case "final-flip":
      return MID_WARP * 0.5;
    case "done":
      return CRUISE;
    default:
      // landing (and any earlier phase) → full warp entry
      return MAX_WARP;
  }
}

function seedStar(star: Star, atFar: boolean) {
  star.x = Math.random() * 2 - 1;
  star.y = Math.random() * 2 - 1;
  star.z = atFar ? 1 : Z_NEAR + Math.random() * (1 - Z_NEAR);
  star.hue = 195 + Math.random() * 35; // cyan (195) → blue (230)
  star.sat = 30 + Math.random() * 50;
  star.px = Number.NaN;
  star.py = Number.NaN;
}

export function WarpStarfield({ isVisible }: { isVisible: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();
  const pageVisible = usePageVisibility();
  const { tier } = useDeviceTier();
  const { introPhase } = useIntro();

  // Live values read by the rAF loop without restarting it.
  const phaseRef = useRef(introPhase);
  const isVisibleRef = useRef(isVisible);
  const pageVisibleRef = useRef(pageVisible);
  phaseRef.current = introPhase;
  isVisibleRef.current = isVisible;
  pageVisibleRef.current = pageVisible;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { starCount, dprCap } = TIER_SETTINGS[tier];
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap);

    // Geometry recomputed on resize; the field (normalized stars) is preserved.
    let width = 0;
    let height = 0;
    let vx = 0; // vanishing point x (CSS px)
    let vy = 0; // vanishing point y (CSS px)
    let spread = 0; // far-plane projection radius (CSS px)

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      if (width === 0 || height === 0) return;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // draw in CSS pixels
      vx = width / 2; // centered horizontally
      vy = height * 0.42; // slightly above mid → behind the headline
      spread = Math.hypot(width, height) * 0.5;
    };

    // Seed the field.
    const stars: Star[] = Array.from({ length: starCount }, () => {
      const s: Star = { x: 0, y: 0, z: 0, hue: 0, sat: 0, px: NaN, py: NaN };
      seedStar(s, false);
      return s;
    });

    const drawBloom = () => {
      const r = Math.min(width, height) * 0.55;
      const g = ctx.createRadialGradient(vx, vy, 0, vx, vy, r);
      g.addColorStop(0, "rgba(120, 180, 255, 0.10)");
      g.addColorStop(0.4, "rgba(140, 110, 230, 0.05)");
      g.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
    };

    const projectAndStore = (s: Star) => {
      const k = spread / s.z;
      const sx = vx + s.x * k;
      const sy = vy + s.y * k;
      return { sx, sy };
    };

    // --- Reduced motion: one static frame of points, no loop. ---
    if (reducedMotion) {
      const renderStatic = () => {
        resize();
        if (width === 0) return;
        ctx.fillStyle = "#02030a";
        ctx.fillRect(0, 0, width, height);
        drawBloom();
        for (const s of stars) {
          const { sx, sy } = projectAndStore(s);
          if (sx < 0 || sx > width || sy < 0 || sy > height) continue;
          ctx.fillStyle = `hsla(${s.hue}, ${s.sat}%, 88%, ${0.3 + (1 - s.z) * 0.6})`;
          ctx.fillRect(sx, sy, 1.4, 1.4);
        }
      };
      renderStatic();
      const ro = new ResizeObserver(renderStatic);
      ro.observe(canvas);
      return () => ro.disconnect();
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // --- Animated warp. ---
    // Seed at max warp on every mount so the warp entry replays each time the hero
    // scrolls back into view (LazyShader remounts us), as well as on initial load.
    // The per-phase target then drives the deceleration: held at warp through
    // `landing`, easing to cruise by `done`. On a re-entry (intro already `done`)
    // the target is cruise, so the seeded max warp decays straight down to it.
    let speed = MAX_WARP;
    let raf = 0;
    let prevTs: number | null = null;

    const frame = (ts: number) => {
      raf = requestAnimationFrame(frame);

      const active = isVisibleRef.current && pageVisibleRef.current;
      if (!active) {
        prevTs = null; // drop the gap so resume doesn't leap
        return;
      }
      if (width === 0 || height === 0) return;

      const dtMs = prevTs === null ? 16.667 : Math.min(ts - prevTs, SPEED_AT_FREEZE_DT_MS);
      prevTs = ts;
      const dt = dtMs / 16.667; // frames elapsed, normalized to 60fps

      // Ease speed toward the phase target.
      const target = targetSpeedFor(phaseRef.current);
      speed += (target - speed) * Math.min(SPEED_EASE * dt, 1);

      // Fade-clear: short trails sharpen the warp without smearing the cruise.
      ctx.fillStyle = "rgba(2, 3, 10, 0.25)";
      ctx.fillRect(0, 0, width, height);
      drawBloom();

      ctx.lineCap = "round";
      for (const s of stars) {
        // Previous projected position is the streak tail.
        const tailValid = !Number.isNaN(s.px);
        const tailX = s.px;
        const tailY = s.py;

        s.z -= speed * dt;
        if (s.z <= Z_NEAR) {
          seedStar(s, true);
          continue;
        }

        const { sx, sy } = projectAndStore(s);
        const nearness = 1 - s.z;
        const alpha = 0.2 + nearness * 0.8;
        ctx.strokeStyle = `hsla(${s.hue}, ${s.sat}%, 86%, ${alpha})`;
        ctx.lineWidth = 0.6 + nearness * 1.6;
        ctx.beginPath();
        if (tailValid) {
          ctx.moveTo(tailX, tailY);
        } else {
          ctx.moveTo(sx, sy);
        }
        ctx.lineTo(sx, sy);
        ctx.stroke();

        s.px = sx;
        s.py = sy;
      }
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [tier, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
