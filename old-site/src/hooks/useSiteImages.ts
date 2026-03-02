import { useQuery } from "@tanstack/react-query";
import { getSiteImage } from "../services/apiImages";
import { queryKeys } from "../lib/queryKeys";

const useSiteImage = (imageName: string) => {
  const {
    data: image,
    error,
    isLoading,
  } = useQuery({
    queryKey: queryKeys.siteImage(imageName),
    queryFn: () => getSiteImage(imageName),
    staleTime: 1000 * 60 * 60 * 24 * 14, // 14 days - prevent image flicker on navigate
  });

  return { image, error, isLoading };
};

export { useSiteImage };
