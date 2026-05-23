import supabase from "./supabase";
import { getPublicProfiles } from "./apiProfile";
import type { PortfolioItem, ProjectStatus } from "@/types/portfolio";

// Translatable fields are stored as JSONB { en, he }. Non-translatable
// fields are scalar. There is one row per SKU.
const LIST_COLUMNS = `
  id, "SKU", title, image, "imagePack", featured, description,
  "longDescription", technologies, settings, "projectType",
  "additionalInfo", problem, what_i_built, how_it_works, result,
  priority, "liveSite", github, publish,
  company_name, duration, status, client_visibility, dev_attribution,
  started_at, finished_at
`;

const DETAIL_COLUMNS = `
  id, "SKU", title, description, "longDescription", technologies,
  "projectType", image, "imagePack", "additionalInfo", featured,
  settings, priority, "liveSite", github, problem, what_i_built,
  how_it_works, result, publish,
  company_name, duration, status, developers, assigned_manager,
  client_visibility, dev_attribution, started_at, finished_at
`;

export interface GetProjectsOpts {
  projectType?: string;
  status?: ProjectStatus;
}

function mapRow(row: Record<string, unknown>): PortfolioItem {
  const status = row.status as ProjectStatus | undefined;
  const clientVisibility = (row.client_visibility as PortfolioItem["clientVisibility"]) ?? "hidden";
  const devAttribution = (row.dev_attribution as PortfolioItem["devAttribution"]) ?? "named";
  return {
    ...(row as unknown as PortfolioItem),
    whatIBuilt: row.what_i_built as PortfolioItem["whatIBuilt"],
    howItWorks: row.how_it_works as PortfolioItem["howItWorks"],
    status,
    companyName:
      clientVisibility === "hidden"
        ? null
        : ((row.company_name as PortfolioItem["companyName"]) ?? null),
    duration: (row.duration as PortfolioItem["duration"]) ?? null,
    developers: (row.developers as string[] | undefined) ?? [],
    assignedManager: (row.assigned_manager as string | null) ?? null,
    clientVisibility,
    devAttribution,
    startedAt: (row.started_at as string | null) ?? null,
    finishedAt: (row.finished_at as string | null) ?? null,
  };
}

export async function getProjects(opts: GetProjectsOpts = {}): Promise<PortfolioItem[]> {
  let query = supabase
    .from("projects")
    .select(LIST_COLUMNS)
    .eq("publish", true);

  if (opts.projectType && opts.projectType !== "all") {
    query = query.eq("projectType", opts.projectType);
  }
  if (opts.status) {
    query = query.eq("status", opts.status);
  }

  if (opts.status === "finished") {
    query = query
      .order("finished_at", { ascending: false, nullsFirst: false })
      .order("priority", { ascending: false });
  } else if (opts.status === "ongoing") {
    query = query
      .order("started_at", { ascending: false, nullsFirst: false })
      .order("priority", { ascending: false });
  } else if (opts.status === "upcoming") {
    query = query
      .order("priority", { ascending: false })
      .order("created_at", { ascending: true });
  } else {
    query = query
      .order("priority", { ascending: false })
      .order("id", { ascending: true });
  }

  const { data, error } = await query;
  if (error) throw error;
  return ((data as Record<string, unknown>[] | null) ?? []).map(mapRow);
}

export async function getProjectBySku(SKU: string): Promise<PortfolioItem | null> {
  const { data, error } = await supabase
    .from("projects")
    .select(DETAIL_COLUMNS)
    .eq("SKU", SKU)
    .eq("publish", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const item = mapRow(data as Record<string, unknown>);

  if (item.devAttribution !== "hidden" && item.developers && item.developers.length > 0) {
    try {
      const profiles = await getPublicProfiles(item.developers);
      const byId = new Map(profiles.map((p) => [p.id, p]));
      item.developerProfiles = item.developers
        .map((id) => byId.get(id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p));
    } catch {
      item.developerProfiles = [];
    }
  } else {
    item.developerProfiles = [];
  }

  // Hidden client: blank companyName regardless of stored value
  if (item.clientVisibility === "hidden") {
    item.companyName = null;
  }

  return item;
}

export const getPortfolio = (projectType?: string) => getProjects({ projectType });
export const getPortfolioById = (SKU: string) => getProjectBySku(SKU);
