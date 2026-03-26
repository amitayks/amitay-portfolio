import supabase from "./supabase";

export const getPortfolio = async (lang: string, projectType?: string) => {
  let query = supabase.from("portfolio").select("*").eq("publish", true).eq("lang", lang);

  if (projectType && projectType !== "all") {
    query = query.eq("projectType", projectType);
  }

  query = query.order("priority", { ascending: false }).order("id", { ascending: true });

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getPortfolioById = async (SKU: string, lang: string) => {
  const { data, error } = await supabase
    .from("portfolio")
    .select(
      "id, SKU, title, description, longDescription, technologies, projectType, image, imagePack, additionalInfo, featured, settings, priority, liveSite, github, problem, what_i_built, how_it_works, result"
    )
    .eq("SKU", SKU)
    .eq("lang", lang)
    .eq("publish", true)
    .single();

  if (error) throw error;
  if (!data) return data;
  return {
    ...data,
    whatIBuilt: (data as Record<string, unknown>).what_i_built as string | undefined,
    howItWorks: (data as Record<string, unknown>).how_it_works as string | undefined,
  };
};
