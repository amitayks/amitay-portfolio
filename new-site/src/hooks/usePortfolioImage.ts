import { useQuery } from "@tanstack/react-query";
import { getPortfolioImage } from "@/services/apiImages";

const FOURTEEN_DAYS = 1000 * 60 * 60 * 24 * 14;

export function usePortfolioImage(imageName: string | null) {
  return useQuery({
    queryKey: ["portfolioImage", imageName],
    queryFn: () => getPortfolioImage(imageName!),
    enabled: !!imageName,
    staleTime: FOURTEEN_DAYS,
  });
}
