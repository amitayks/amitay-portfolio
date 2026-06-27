import { useEffect, useRef, useState, type ReactNode } from "react";
import { NeuroNoise, GodRays, Water } from "@paper-design/shaders-react";
import { cn } from "@/lib/utils";
import { usePageVisibility } from "@/hooks/usePageVisibility";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { WarpStarfield } from "@/components/WarpStarfield";

interface ShaderBackgroundProps {
  variant: "hero" | "about" | "stats" | "contact";
  className?: string;
}

// --- CSS gradient fallbacks (shown when shader isn't mounted or crashes) ---
const FALLBACK_GRADIENTS: Record<ShaderBackgroundProps["variant"], string> = {
  hero: "radial-gradient(ellipse at 50% 42%, #0a1430 0%, #060a1c 35%, #02030a 70%, #000 100%)",
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
  children: (isVisible: boolean) => ReactNode;
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
        <div className="absolute inset-0" style={{ willChange: "transform" }}>
          {children(isVisible)}
        </div>
      )}
    </div>
  );
}

// --- Configured speeds per WebGL shader variant (hero uses the canvas WarpStarfield) ---
const SHADER_SPEEDS: Record<Exclude<ShaderBackgroundProps["variant"], "hero">, number> = {
  about: 0.3,
  stats: 0.15,
  contact: 0.15,
};

// --- Main component ---

export function ShaderBackground({ variant, className }: ShaderBackgroundProps) {
  const pageVisible = usePageVisibility();
  const { maxPixelCount } = useDeviceTier();

  const getSpeed = (isVisible: boolean) =>
    isVisible && pageVisible && variant !== "hero" ? SHADER_SPEEDS[variant] : 0;

  return (
    <div className={cn("absolute inset-0 z-0 overflow-hidden", className)}>
      <LazyShader fallback={FALLBACK_GRADIENTS[variant]}>
        {(isVisible) => (
          <>
            {variant === "hero" && <WarpStarfield isVisible={isVisible} />}

            {variant === "about" && (
              <NeuroNoise
                colorFront="#ffffff"
                colorMid="#1a3a5c"
                colorBack="#000000"
                brightness={0.03}
                contrast={0.25}
                speed={getSpeed(isVisible)}
                maxPixelCount={maxPixelCount}
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
                speed={getSpeed(isVisible)}
                maxPixelCount={maxPixelCount}
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
                speed={getSpeed(isVisible)}
                maxPixelCount={maxPixelCount}
                scale={1.2}
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </>
        )}
      </LazyShader>
    </div>
  );
}
