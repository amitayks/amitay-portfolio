import { useTheme } from "@/hooks/useTheme";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import PortfolioCard from "../components/PortfolioCard";
import PortfolioFilter from "../components/PortfolioFilter";
import usePortfolioItems from "../hooks/usePortfolioItems";
import { PortfolioItem } from "../types/portfolio";

function Portfolio() {
  const { portfolioItems, isLoading } = usePortfolioItems();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const colors = useTheme();

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
          <article
            key={index}
            style={{ backgroundColor: colors.surface, borderColor: colors.border }}
            className="group relative rounded-2xl shadow-sm overflow-hidden border animate-pulse"
          >
            <div className="aspect-square w-full relative overflow-hidden">
              <div
                style={{ backgroundColor: colors.surfaceSecondary }}
                className="aspect-square"
              />
            </div>

            <div className="px-6 py-6">
              <div className="flex items-center justify-center ">
                <div
                  style={{ backgroundColor: colors.surfaceSecondary }}
                  className="h-6 w-3/4 rounded"
                />
              </div>
            </div>

            <div className="absolute top-4 right-4 flex gap-2 md:opacity-0">
              <div
                style={{ backgroundColor: colors.surface, backdropFilter: "blur(4px)" }}
                className="w-8 h-8 rounded-lg shadow-lg"
              >
                <div
                  style={{ backgroundColor: colors.surfaceSecondary }}
                  className="w-4 h-4 rounded m-2"
                />
              </div>
              <div
                style={{ backgroundColor: colors.surface, backdropFilter: "blur(4px)" }}
                className="w-8 h-8 rounded-lg shadow-lg"
              >
                <div
                  style={{ backgroundColor: colors.surfaceSecondary }}
                  className="w-4 h-4 rounded m-2"
                />
              </div>
            </div>
          </article>
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
