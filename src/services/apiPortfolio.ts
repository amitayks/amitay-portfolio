import supabase from "./supabase";
import { getPublicProfiles } from "./apiProfile";
import type { PortfolioItem, ProjectStatus } from "@/types/portfolio";

// Project columns we expose to the public site. Excludes `developers`
// and `assigned_manager` for list queries — devs are loaded separately
// only when a case study is opened, and attribution is enforced then.
const LIST_COLUMNS = `
  id, "SKU", lang, title, image, "imagePack", featured, description,
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
  how_it_works, result, lang, publish,
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
    whatIBuilt: row.what_i_built as string | undefined,
    howItWorks: row.how_it_works as string | undefined,
    status,
    companyName: clientVisibility === "hidden" ? null : ((row.company_name as string | null) ?? null),
    duration: (row.duration as string | null) ?? null,
    developers: (row.developers as string[] | undefined) ?? [],
    assignedManager: (row.assigned_manager as string | null) ?? null,
    clientVisibility,
    devAttribution,
    startedAt: (row.started_at as string | null) ?? null,
    finishedAt: (row.finished_at as string | null) ?? null,
  };
}

export async function getProjects(
  lang: string,
  opts: GetProjectsOpts = {}
): Promise<PortfolioItem[]> {
  let query = supabase
    .from("projects")
    .select(LIST_COLUMNS)
    .eq("publish", true)
    .eq("lang", lang);

  if (opts.projectType && opts.projectType !== "all") {
    query = query.eq("projectType", opts.projectType);
  }
  if (opts.status) {
    query = query.eq("status", opts.status);
  }

  // Ordering depends on status; without a status filter we fall back
  // to priority + id (matches the previous default).
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

export async function getProjectBySku(
  SKU: string,
  lang: string
): Promise<PortfolioItem | null> {
  const { data, error } = await supabase
    .from("projects")
    .select(DETAIL_COLUMNS)
    .eq("SKU", SKU)
    .eq("lang", lang)
    .eq("publish", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const item = mapRow(data as Record<string, unknown>);

  // Hydrate developer profiles when attribution allows it.
  if (item.devAttribution !== "hidden" && item.developers && item.developers.length > 0) {
    try {
      const profiles = await getPublicProfiles(item.developers);
      // Preserve the order from `developers[]` (lead first)
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

  return item;
}

// Backwards-compatible aliases for the previous API surface.
export const getPortfolio = (lang: string, projectType?: string) =>
  getProjects(lang, { projectType });
export const getPortfolioById = (SKU: string, lang: string) => getProjectBySku(SKU, lang);
