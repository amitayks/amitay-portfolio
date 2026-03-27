import { useMemo } from "react";

interface DeviceTier {
  tier: "desktop" | "mobile" | "low-end";
  maxPixelCount: number;
}

const TIERS = {
  desktop: 2048 * 1200,   // ~2.4M pixels
  mobile: 960 * 600,      // ~576K pixels
  "low-end": 640 * 400,   // ~256K pixels
} as const;

function detectTier(): DeviceTier {
  const hasTouch = navigator.maxTouchPoints > 0;
  const isNarrow = window.innerWidth <= 1024;
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 8;

  if (cores <= 4 || memory <= 4) {
    return { tier: "low-end", maxPixelCount: TIERS["low-end"] };
  }

  if (hasTouch && isNarrow) {
    return { tier: "mobile", maxPixelCount: TIERS.mobile };
  }

  return { tier: "desktop", maxPixelCount: TIERS.desktop };
}

export function useDeviceTier(): DeviceTier {
  return useMemo(detectTier, []);
}
