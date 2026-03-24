import { useEffect, useState } from "react";
import { NeuroNoise, GodRays, Water } from "@paper-design/shaders-react";
import { cn } from "@/lib/utils";

interface ShaderBackgroundProps {
  variant: "hero" | "about" | "stats" | "contact";
  className?: string;
}

// Base colors in HSL for easy manipulation
// [hue, saturation, lightness]
const HERO_RAY_COLORS_HSL: [number, number, number][] = [
  [28, 40, 22],   // warm sunset undertone
  [200, 20, 18],  // blue-black (sky dark corner)
  [205, 15, 20],  // mountain shadow
  [80, 15, 12],   // earthy green
  [25, 30, 16],   // warm earth
];

const CONTACT_COLORS_HSL: [number, number, number][] = [
  [210, 25, 14],  // steel blue dark
  [190, 22, 12],  // cold teal
  [220, 20, 16],  // slate blue
  [180, 18, 10],  // dark cyan
  [200, 28, 14],  // mountain blue
  [170, 15, 8],   // deep cold green
  [230, 18, 12],  // twilight blue
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

/** Slowly drifts ray colors by shifting hue over time */
function useAnimatedRayColors(baseColors: [number, number, number][], speed = 0.3) {
  const [colors, setColors] = useState(() =>
    baseColors.map(([h, s, l]) => hslToHex(h, s, l))
  );

  useEffect(() => {
    let frame: number;
    let start: number | null = null;

    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = (now - start) / 1000; // seconds

      setColors(
        baseColors.map(([h, s, l], i) => {
          // Each ray drifts at a slightly different rate and phase
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

export function ShaderBackground({ variant, className }: ShaderBackgroundProps) {
  const heroColors = useAnimatedRayColors(HERO_RAY_COLORS_HSL, 0.8);
  const contactColors = useAnimatedRayColors(CONTACT_COLORS_HSL, 0.8);

  return (
    <div className={cn("absolute inset-0 z-0 overflow-hidden", className)}>
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
    </div>
  );
}
