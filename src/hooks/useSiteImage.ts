import { useQuery } from "@tanstack/react-query";
import { getSiteImage } from "@/services/apiImages";

const FOURTEEN_DAYS = 1000 * 60 * 60 * 24 * 14;

export function useSiteImage(imageName: string | null) {
  return useQuery({
    queryKey: ["siteImage", imageName],
    queryFn: () => getSiteImage(imageName!),
    enabled: !!imageName,
    staleTime: FOURTEEN_DAYS,
  });
}
