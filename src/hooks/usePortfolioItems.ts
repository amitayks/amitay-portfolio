import { useQuery } from "@tanstack/react-query";
import { getProjects, type GetProjectsOpts } from "@/services/apiPortfolio";
import { useLanguage } from "./useLanguage";
import type { PortfolioItem, ProjectStatus } from "@/types/portfolio";

export function usePortfolioItems(projectType?: string, langOverride?: string) {
  const { lang } = useLanguage();
  const effectiveLang = langOverride ?? lang;

  return useQuery<PortfolioItem[]>({
    queryKey: ["projects", effectiveLang, { projectType: projectType ?? "all" }],
    queryFn: () => getProjects(effectiveLang, { projectType }),
    staleTime: 0,
  });
}

export function useProjects(opts: GetProjectsOpts = {}, langOverride?: string) {
  const { lang } = useLanguage();
  const effectiveLang = langOverride ?? lang;
  return useQuery<PortfolioItem[]>({
    queryKey: ["projects", effectiveLang, opts],
    queryFn: () => getProjects(effectiveLang, opts),
    staleTime: 0,
  });
}

export function useProjectsByStatus(status: ProjectStatus, langOverride?: string) {
  return useProjects({ status }, langOverride);
}
