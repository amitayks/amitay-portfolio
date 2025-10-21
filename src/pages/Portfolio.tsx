import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";
import PortfolioCard from "../components/PortfolioCard";
import PortfolioFilter from "../components/PortfolioFilter";
import usePortfolioItems from "../hooks/usePortfolioItems";
import { PortfolioItem } from "../types/portfolio";

function Portfolio() {
  const { portfolioItems, isLoading } = usePortfolioItems();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setIsInitialLoad(false);
    }
  }, [isLoading]);

  return (
    <div className="min-h-screen">
      <PortfolioFilter />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isInitialLoad || isLoading ? (
          <PortfolioGridSkeleton />
        ) : portfolioItems.length === 0 ? (
          <NoProjectsFound />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((portfolioItem: PortfolioItem) => (
              <PortfolioCard key={portfolioItem.id} portfolioItem={portfolioItem} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const PortfolioGridSkeleton = () => {
  const colors = useTheme();

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8" dir="rtl">
      {Array(6)
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

const NoProjectsFound = () => {
  const colors = useTheme();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
      <div
        style={{ backgroundColor: colors.surfaceSecondary }}
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
      >
        <Search style={{ color: colors.textTertiary }} className="w-12 h-12" />
      </div>
      <h3 style={{ color: colors.primary }} className="text-xl font-semibold mb-3">
        No projects found
      </h3>
      <p style={{ color: colors.textSecondary }} className="mb-6">
        Try adjusting your search terms or filters to find what you're looking for.
      </p>
    </div>
  );
};

export default Portfolio;
