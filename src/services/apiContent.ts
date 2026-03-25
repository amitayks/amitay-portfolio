import supabase from "./supabase";

export const fetchSiteContent = async (lang: string): Promise<Record<string, string>> => {
  const { data, error } = await supabase
    .from("site_content")
    .select("key, value")
    .eq("lang", lang);

  if (error) throw error;

  const contentMap: Record<string, string> = {};
  for (const row of data ?? []) {
    contentMap[row.key] = row.value;
  }
  return contentMap;
};
