import { useQuery } from "@tanstack/react-query";
import { getProjectBySku } from "@/services/apiPortfolio";
import { useLanguage } from "./useLanguage";

const ONE_HOUR = 1000 * 60 * 60;

export function usePortfolioItem(sku: string | null) {
  const { lang } = useLanguage();

  return useQuery({
    queryKey: ["project", sku, lang],
    queryFn: () => getProjectBySku(sku!, lang),
    enabled: !!sku,
    staleTime: ONE_HOUR,
  });
}
