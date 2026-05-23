import { useQuery } from "@tanstack/react-query";
import { getProjectBySku } from "@/services/apiPortfolio";

const ONE_HOUR = 1000 * 60 * 60;

export function usePortfolioItem(sku: string | null) {
  return useQuery({
    queryKey: ["project", sku],
    queryFn: () => getProjectBySku(sku!),
    enabled: !!sku,
    staleTime: ONE_HOUR,
  });
}
