import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatedText } from "@/components/AnimatedText";
import { WindProvider } from "@/contexts";
import { useTheme } from "@/hooks/useTheme";
import PortfolioCard from "../components/PortfolioCard";
import PortfolioFilter from "../components/PortfolioFilter";
import { PortfolioGridSkeleton } from "../components/PortfolioGridSkeleton";
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" dir="rtl">
        {isInitialLoad || isLoading ? (
          <PortfolioGridSkeleton />
        ) : portfolioItems.length === 0 ? (
          <NoProjectsFound />
        ) : (
          <WindProvider>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItems.map((portfolioItem: PortfolioItem, index) => (
                <PortfolioCard key={portfolioItem.id} portfolioItem={portfolioItem} index={index} />
              ))}
            </div>
          </WindProvider>
        )}
      </div>
    </div>
  );
}

const NoProjectsFound = () => {
  const { colors } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
      <div
        style={{ backgroundColor: colors.surfaceSecondary }}
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
      >
        <Search style={{ color: colors.textTertiary }} className="w-12 h-12" />
      </div>
      <AnimatedText
        as="h3"
        style={{ color: colors.primary }}
        className="text-xl font-semibold mb-3"
        variant="slide"
      >
        No projects found
      </AnimatedText>
      <AnimatedText as="p" style={{ color: colors.textSecondary }} className="mb-6" variant="fade">
        Try adjusting your search terms or filters to find what you're looking for.
      </AnimatedText>
    </div>
  );
};

export default Portfolio;
