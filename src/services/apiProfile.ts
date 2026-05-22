import supabase from "./supabase";
import type { Profile, ProfileEditable, PublicProfile } from "@/types/profile";

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data as Profile | null) ?? null;
}

export async function getPublicProfile(userId: string): Promise<PublicProfile | null> {
  const { data, error } = await supabase
    .from("profiles_public")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data as PublicProfile | null) ?? null;
}

export async function getPublicProfiles(userIds: string[]): Promise<PublicProfile[]> {
  if (userIds.length === 0) return [];
  const { data, error } = await supabase
    .from("profiles_public")
    .select("*")
    .in("id", userIds);
  if (error) throw error;
  return (data ?? []) as PublicProfile[];
}

export async function updateProfile(
  userId: string,
  patch: ProfileEditable
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", userId)
    .select("*")
    .single();
  if (error) throw error;
  return data as Profile;
}

// First-login upsert: pulls defaults from the OAuth metadata
// (GitHub handle / Google name + picture) but never overwrites
// fields the user has already edited.
export async function upsertProfileFromAuth(params: {
  userId: string;
  fullName?: string | null;
  displayName?: string | null;
  avatarUrl?: string | null;
  githubHandle?: string | null;
  invitedBy?: string | null;
  termsAcceptedAt?: string;
}): Promise<Profile> {
  const existing = await getProfile(params.userId);
  if (existing) {
    // Only refresh github_handle on returning login (cheap, stable identifier).
    if (params.githubHandle && params.githubHandle !== existing.github_handle) {
      const { data, error } = await supabase
        .from("profiles")
        .update({ github_handle: params.githubHandle })
        .eq("id", params.userId)
        .select("*")
        .single();
      if (error) throw error;
      return data as Profile;
    }
    return existing;
  }
  const insert = {
    id: params.userId,
    full_name: params.fullName ?? null,
    display_name: params.displayName ?? params.fullName ?? null,
    avatar_url: params.avatarUrl ?? null,
    github_handle: params.githubHandle ?? null,
    invited_by: params.invitedBy ?? null,
    terms_accepted_at: params.termsAcceptedAt ?? null,
  };
  const { data, error } = await supabase
    .from("profiles")
    .insert(insert)
    .select("*")
    .single();
  if (error) throw error;
  return data as Profile;
}

export async function listAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Profile[];
}

export async function setProfileStatus(
  userId: string,
  status: "active" | "suspended"
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ status })
    .eq("id", userId);
  if (error) throw error;
}

// Returns true if the profile has >1 historical full_name changes
// (used by admin UI to surface a "name flipped" warning badge).
export async function hasNameFlipWarning(userId: string): Promise<boolean> {
  const { count, error } = await supabase
    .from("profile_audit")
    .select("id", { count: "exact", head: true })
    .eq("profile_id", userId)
    .eq("field", "full_name");
  if (error) throw error;
  return (count ?? 0) > 1;
}
