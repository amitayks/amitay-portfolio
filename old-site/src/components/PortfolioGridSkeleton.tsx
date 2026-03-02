import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTheme } from "@/hooks/useTheme";

interface PortfolioGridSkeletonProps {
  count?: number;
}

export const PortfolioGridSkeleton = ({ count = 12 }: PortfolioGridSkeletonProps) => {
  const { colors } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8" dir="rtl">
      {Array(count)
        .fill(0)
        .map((_, index) => {
          // Match the floating animation timing from PortfolioCard
          const baseDuration = 5;
          const durationVariation = (index % 5) * 0.4;
          const duration = baseDuration + durationVariation;
          const delay = (index * 1.3) % duration;
          const yOffset = 3 + (index % 3);
          const xOffset = 1 + (index % 2) * 0.5;

          const floatingAnimation = prefersReducedMotion
            ? { opacity: 1 }
            : {
                y: [-yOffset / 2, -yOffset, -yOffset / 2],
                x: [-xOffset / 2, xOffset / 2, -xOffset / 2],
                rotate: [-0.3, 0.3, -0.3],
                opacity: [1, 0.7, 1],
              };

          const floatingTransition = prefersReducedMotion
            ? {}
            : {
                duration,
                repeat: Infinity,
                repeatType: "mirror" as const,
                ease: "easeInOut",
                delay,
              };

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <motion.div animate={floatingAnimation} transition={floatingTransition}>
                <Card
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  }}
                  className="group relative overflow-hidden border hover:shadow-2xl transition-shadow duration-700"
                >
                  {/* Image area skeleton */}
                  <div className="aspect-square w-full relative overflow-hidden">
                    <div
                      style={{ backgroundColor: colors.surfaceSecondary }}
                      className="aspect-square absolute inset-0 animate-pulse"
                    />
                  </div>

                  {/* GitHub button skeleton - top right */}
                  <div className="absolute top-4 right-4 z-20">
                    <div
                      style={{ backgroundColor: colors.surface }}
                      className="p-2 rounded-lg shadow-lg backdrop-blur-sm"
                    >
                      <div
                        style={{ backgroundColor: colors.surfaceSecondary }}
                        className="w-5 h-5 rounded animate-pulse"
                      />
                    </div>
                  </div>

                  {/* LiveSite button skeleton - bottom left */}
                  <div className="absolute bottom-4 left-4 z-20">
                    <div
                      style={{ backgroundColor: colors.surface }}
                      className="p-2 rounded-lg shadow-lg backdrop-blur-sm"
                    >
                      <div
                        style={{ backgroundColor: colors.surfaceSecondary }}
                        className="w-5 h-5 rounded animate-pulse"
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          );
        })}
    </div>
  );
};
