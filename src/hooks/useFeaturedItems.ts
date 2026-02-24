import { useQuery } from "@tanstack/react-query";
import { getPortfolio } from "../services/apiPortfolio";
import { queryKeys } from "../lib/queryKeys";
import { PortfolioItem } from "../types/portfolio";

export default function useFeaturdItems(featured: boolean) {
  const {
    data: portfolioItems = [],
    error: portfolioError,
    isLoading,
  } = useQuery<PortfolioItem[], Error>({
    queryKey: queryKeys.portfolioItems(null), // Use same key as usePortfolioItems() with no filter
    queryFn: () => getPortfolio({ filter: null }), // Fetch all items
    select: (data) => data.filter((item) => item.featured === featured), // Filter in memory
  });

  return { portfolioError, portfolioItems, isLoading };
}
