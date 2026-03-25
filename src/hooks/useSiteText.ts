import { useQuery } from "@tanstack/react-query";
import { fetchSiteContent } from "@/services/apiContent";
import { useLanguage } from "./useLanguage";

const TWENTY_FOUR_HOURS = 1000 * 60 * 60 * 24;

export function useSiteText() {
  const { lang } = useLanguage();

  const en = useQuery({
    queryKey: ["site_content", "en"],
    queryFn: () => fetchSiteContent("en"),
    staleTime: TWENTY_FOUR_HOURS,
  });

  const he = useQuery({
    queryKey: ["site_content", "he"],
    queryFn: () => fetchSiteContent("he"),
    staleTime: TWENTY_FOUR_HOURS,
  });

  const contentMap = lang === "en" ? en.data : he.data;
  const isLoading = lang === "en" ? en.isLoading : he.isLoading;

  const t = (key: string, fallback?: string): string => {
    return contentMap?.[key] ?? fallback ?? key;
  };

  return { t, isLoading };
}
