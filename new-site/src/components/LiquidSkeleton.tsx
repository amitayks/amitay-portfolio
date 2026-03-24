import { cn } from "@/lib/utils";

interface LiquidSkeletonProps {
  variant?: "text" | "image" | "card" | "circle";
  className?: string;
}

export function LiquidSkeleton({ variant = "text", className }: LiquidSkeletonProps) {
  return (
    <div
      className={cn(
        "liquid-glass animate-shimmer",
        {
          "h-4 w-3/4 rounded-full": variant === "text",
          "aspect-square w-full rounded-2xl": variant === "image",
          "h-48 w-full rounded-2xl": variant === "card",
          "h-10 w-10 rounded-full": variant === "circle",
        },
        className
      )}
      style={{
        background:
          "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0) 100%)",
        backgroundSize: "200% 100%",
      }}
    />
  );
}
