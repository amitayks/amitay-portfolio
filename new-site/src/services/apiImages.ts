import supabase from "./supabase";

export const getSiteImage = async (imageName: string) => {
  const { data, error } = await supabase.storage
    .from("site-image")
    .createSignedUrl(imageName, 100 * 60 * 60 * 24);

  if (error) throw error;
  return data?.signedUrl ?? null;
};

export const getPortfolioImage = async (imageName: string) => {
  const { data, error } = await supabase.storage
    .from("products-image")
    .createSignedUrl(imageName, 100 * 60 * 60 * 24);

  if (error) return null;
  return data?.signedUrl ?? null;
};
