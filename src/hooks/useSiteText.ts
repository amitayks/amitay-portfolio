import { useQuery } from "@tanstack/react-query";
import { fetchSiteContent } from "@/services/apiContent";
import { useLanguage } from "./useLanguage";

const TWENTY_FOUR_HOURS = 1000 * 60 * 60 * 24;

export function useSiteText() {
  const { lang } = useLanguage();

  const { data, isLoading } = useQuery({
    queryKey: ["site_content"],
    queryFn: fetchSiteContent,
    staleTime: TWENTY_FOUR_HOURS,
  });

  const t = (key: string, fallback?: string): string => {
    const entry = data?.[key];
    return entry?.[lang] ?? entry?.en ?? fallback ?? key;
  };

  return { t, isLoading };
}
