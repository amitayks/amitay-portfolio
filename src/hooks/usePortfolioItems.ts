import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getPortfolio } from "../services/apiPortfolio";
import { queryKeys } from "../lib/queryKeys";
import { PortfolioItem } from "../types/portfolio";

export default function usePortfolioItems() {
  const [searchParams] = useSearchParams();

  const filterValue = searchParams.get("type");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : {
          field: "projectType",
          value: filterValue,
        };

  const {
    data: portfolioItems = [],
    error: portfolioError,
    isLoading,
  } = useQuery<PortfolioItem[], Error>({
    queryKey: queryKeys.portfolioItems(filterValue),
    queryFn: () => getPortfolio({ filter }),
    staleTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  return { portfolioError, portfolioItems, isLoading };
}
