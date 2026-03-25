import { useQuery } from "@tanstack/react-query";
import { getPortfolio } from "@/services/apiPortfolio";
import { useLanguage } from "./useLanguage";
import type { PortfolioItem } from "@/types/portfolio";

export function usePortfolioItems(projectType?: string, langOverride?: string) {
  const { lang } = useLanguage();
  const effectiveLang = langOverride ?? lang;

  return useQuery<PortfolioItem[]>({
    queryKey: ["portfolio", effectiveLang, projectType ?? "all"],
    queryFn: () => getPortfolio(effectiveLang, projectType),
    staleTime: 0,
  });
}
