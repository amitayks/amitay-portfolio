import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check your .env file."
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabaseUrl };
export default supabase;

const SITE_ORIGIN =
  typeof window !== "undefined" ? window.location.origin : "https://keisar.club";

export const signInWithGoogle = async (redirectPath = "/") => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${SITE_ORIGIN}${redirectPath}` },
  });
  if (error) throw error;
};

export const signInWithGitHub = async (redirectPath = "/") => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: { redirectTo: `${SITE_ORIGIN}${redirectPath}` },
  });
  if (error) throw error;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
