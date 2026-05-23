import supabase from "./supabase";
import type { PortfolioItem, ProjectStatus, ClientVisibility, DevAttribution } from "@/types/portfolio";
import type { Translated } from "@/types/content";
import type { Profile } from "@/types/profile";

// Full project row for the admin editor (all columns, unpublished included).
export async function adminListProjects(): Promise<AdminProjectRow[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("status", { ascending: true })
    .order("priority", { ascending: false })
    .order("id", { ascending: true });
  if (error) throw error;
  return (data ?? []) as AdminProjectRow[];
}

export async function adminGetProject(id: string): Promise<AdminProjectRow | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as AdminProjectRow | null) ?? null;
}

export async function adminUpdateProject(
  id: string,
  patch: Partial<AdminProjectRow>
): Promise<AdminProjectRow> {
  const { data, error } = await supabase
    .from("projects")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as AdminProjectRow;
}

export async function adminCreateProject(
  payload: Partial<AdminProjectRow>
): Promise<AdminProjectRow> {
  const { data, error } = await supabase
    .from("projects")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return data as AdminProjectRow;
}

export async function adminDeleteProject(id: string): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

export async function adminListAssignableDevs(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .in("role", ["dev", "manager", "admin"])
    .eq("status", "active")
    .order("display_name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Profile[];
}

export async function adminListManagers(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .in("role", ["admin", "manager"])
    .eq("status", "active")
    .order("display_name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Profile[];
}

// Raw DB row shape: one row per SKU, with snake_case columns for the v1
// agency fields and JSONB {en, he} for translatable text fields.
export interface AdminProjectRow
  extends Omit<
    PortfolioItem,
    | "developerProfiles"
    | "status"
    | "companyName"
    | "duration"
    | "developers"
    | "assignedManager"
    | "clientVisibility"
    | "devAttribution"
    | "startedAt"
    | "finishedAt"
    | "whatIBuilt"
    | "howItWorks"
    | "problem"
    | "result"
  > {
  status: ProjectStatus;
  company_name: Translated | null;
  duration: Translated | null;
  developers: string[];
  assigned_manager: string | null;
  client_visibility: ClientVisibility;
  dev_attribution: DevAttribution;
  started_at: string | null;
  finished_at: string | null;
  what_i_built: Translated | null;
  how_it_works: Translated | null;
  problem: Translated | null;
  result: Translated | null;
}
