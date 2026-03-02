import supabase from "./supabase";

interface filter {
  field: string;
  value: string | boolean;
}

export const getPortfolio = async ({ filter }: { filter: filter | null }) => {
  let query = supabase.from("portfolio").select("*").eq("publish", true);

  if (filter) query = query.eq(filter.field, filter.value);

  query = query.order("priority", { ascending: false }).order("id", { ascending: true });

  const { data, error } = await query;

  if (error) throw error;

  return data;
};

export const getPortfolioById = async (SKU: string) => {
  const { data, error } = await supabase
    .from("portfolio")
    .select(
      "id, SKU, title, description, longDescription, technologies, projectType, image, imagePack, additionalInfo, featured, settings, priority, liveSite, github"
    )
    .eq("SKU", SKU)
    .eq("publish", true)
    .single();
  if (error) throw error;
  return data;
};
