import supabase from "./supabase";
import type { SiteContentMap, Translated } from "@/types/content";

export const fetchSiteContent = async (): Promise<SiteContentMap> => {
  const { data, error } = await supabase
    .from("site_content")
    .select("key, value");

  if (error) throw error;

  const contentMap: SiteContentMap = {};
  for (const row of data ?? []) {
    contentMap[row.key] = row.value as Translated;
  }
  return contentMap;
};
