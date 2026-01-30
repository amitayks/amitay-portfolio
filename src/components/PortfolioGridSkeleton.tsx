import { Card } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";

interface PortfolioGridSkeletonProps {
  count?: number;
}

export const PortfolioGridSkeleton = ({ count = 12 }: PortfolioGridSkeletonProps) => {
  const { colors } = useTheme();

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8" dir="rtl">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="animate-pulse">
            <Card
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
              className="group relative overflow-hidden border hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-square w-full relative overflow-hidden">
                <div
                  style={{ backgroundColor: colors.surfaceSecondary }}
                  className="aspect-square absolute inset-0"
                />
              </div>

              {/* Action buttons skeleton */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                <div
                  style={{ backgroundColor: colors.surface }}
                  className="p-2 rounded-lg shadow-lg backdrop-blur-sm w-8 h-8"
                >
                  <div
                    style={{ backgroundColor: colors.surfaceSecondary }}
                    className="w-4 h-4 rounded"
                  />
                </div>
                <div
                  style={{ backgroundColor: colors.surface }}
                  className="p-2 rounded-lg shadow-lg backdrop-blur-sm w-8 h-8"
                >
                  <div
                    style={{ backgroundColor: colors.surfaceSecondary }}
                    className="w-4 h-4 rounded"
                  />
                </div>
              </div>
            </Card>
          </div>
        ))}
    </div>
  );
};
