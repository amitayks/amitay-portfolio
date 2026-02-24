import { useQuery } from "@tanstack/react-query";
import { getPortfolioImage } from "../services/apiImages";
import { queryKeys } from "../lib/queryKeys";

const usePortfolioImage = (imageName: string) => {
  const {
    data: image,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.portfolioImage(imageName),
    queryFn: () => getPortfolioImage(imageName),
  });

  return { image, isLoading, error };
};

export { usePortfolioImage };
