import { useEffect, useRef, useState, type ReactNode } from "react";
import { NeuroNoise, GodRays, Water } from "@paper-design/shaders-react";
import { cn } from "@/lib/utils";

interface ShaderBackgroundProps {
  variant: "hero" | "about" | "stats" | "contact";
  className?: string;
}

// --- CSS gradient fallbacks (shown when shader isn't mounted or crashes) ---
const FALLBACK_GRADIENTS: Record<ShaderBackgroundProps["variant"], string> = {
  hero: "radial-gradient(ellipse at 80% 20%, #1c1510 0%, #12171a 30%, #060504 70%, #000 100%)",
  about: "radial-gradient(ellipse at 50% 50%, #0a1520 0%, #000 100%)",
  stats: "radial-gradient(ellipse at 50% 50%, #0a1628 0%, #000 100%)",
  contact: "radial-gradient(ellipse at 50% 60%, #0a1218 0%, #040608 40%, #000 100%)",
};

// --- Lazy shader wrapper: only mounts when in viewport ---
function LazyShader({
  children,
  fallback,
  className,
}: {
  children: ReactNode;
  fallback: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "200px" } // mount 200px before entering viewport
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Listen for WebGL context loss on any canvas child
  useEffect(() => {
    if (!isVisible || hasError) return;
    const el = ref.current;
    if (!el) return;

    const onContextLost = () => setHasError(true);

    // MutationObserver to catch canvas elements added by shaders
    const mo = new MutationObserver(() => {
      const canvas = el.querySelector("canvas");
      if (canvas) {
        canvas.addEventListener("webglcontextlost", onContextLost);
      }
    });
    mo.observe(el, { childList: true, subtree: true });

    // Also check if canvas already exists
    const canvas = el.querySelector("canvas");
    if (canvas) {
      canvas.addEventListener("webglcontextlost", onContextLost);
    }

    return () => {
      mo.disconnect();
      const c = el.querySelector("canvas");
      if (c) c.removeEventListener("webglcontextlost", onContextLost);
    };
  }, [isVisible, hasError]);

  return (
    <div ref={ref} className={cn("absolute inset-0", className)}>
      {/* CSS fallback always present */}
      <div className="absolute inset-0" style={{ background: fallback }} />
      {/* Shader mounts on top when visible and not crashed */}
      {isVisible && !hasError && (
        <div className="absolute inset-0">{children}</div>
      )}
    </div>
  );
}

// --- Color animation for hero rays ---

const HERO_RAY_COLORS_HSL: [number, number, number][] = [
  [28, 40, 22],
  [200, 20, 18],
  [205, 15, 20],
  [80, 15, 12],
  [25, 30, 16],
];

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100;
  const ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = ln - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function useAnimatedRayColors(baseColors: [number, number, number][], speed = 0.3) {
  const [colors, setColors] = useState(() =>
    baseColors.map(([h, s, l]) => hslToHex(h, s, l))
  );

  useEffect(() => {
    let frame: number;
    let start: number | null = null;

    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = (now - start) / 1000;

      setColors(
        baseColors.map(([h, s, l], i) => {
          const drift = Math.sin(elapsed * speed + i * 1.3) * 18;
          const satDrift = Math.sin(elapsed * speed * 0.7 + i * 0.9) * 8;
          return hslToHex(
            (h + drift + 360) % 360,
            Math.max(10, Math.min(70, s + satDrift)),
            l
          );
        })
      );

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [baseColors, speed]);

  return colors;
}

// --- Main component ---

export function ShaderBackground({ variant, className }: ShaderBackgroundProps) {
  const heroColors = useAnimatedRayColors(HERO_RAY_COLORS_HSL, 0.8);

  return (
    <div className={cn("absolute inset-0 z-0 overflow-hidden", className)}>
      <LazyShader fallback={FALLBACK_GRADIENTS[variant]}>
        {variant === "hero" && (
          <GodRays
            colors={heroColors}
            colorBack="#060504"
            colorBloom="#3a2810"
            bloom={0.35}
            intensity={0.55}
            density={0.45}
            spotty={0.2}
            midSize={0.2}
            midIntensity={0.15}
            speed={0.15}
            offsetX={0.5}
            offsetY={-0.4}
            rotation={25}
            scale={1.4}
            style={{ width: "100%", height: "100%" }}
          />
        )}

        {variant === "about" && (
          <NeuroNoise
            colorFront="#ffffff"
            colorMid="#1a3a5c"
            colorBack="#000000"
            brightness={0.03}
            contrast={0.25}
            speed={0.3}
            scale={1.5}
            style={{ width: "100%", height: "100%" }}
          />
        )}

        {variant === "stats" && (
          <GodRays
            colors={["#0a1628", "#1a2d4a", "#0d1f3c", "#162b4d", "#091322"]}
            colorBack="#000000"
            colorBloom="#0a1a2f"
            bloom={0.3}
            intensity={0.4}
            density={0.5}
            spotty={0.3}
            midSize={0.3}
            midIntensity={0.15}
            speed={0.15}
            style={{ width: "100%", height: "100%" }}
          />
        )}

        {variant === "contact" && (
          <Water
            colorBack="#040608"
            colorHighlight="#1a2a35"
            highlights={0.4}
            layering={0.5}
            edges={0.2}
            caustic={0.6}
            waves={0.3}
            size={1.5}
            speed={0.15}
            scale={1.2}
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </LazyShader>
    </div>
  );
}
