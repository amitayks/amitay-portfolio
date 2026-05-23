import { useQuery } from "@tanstack/react-query";
import { getProjects, type GetProjectsOpts } from "@/services/apiPortfolio";
import type { PortfolioItem, ProjectStatus } from "@/types/portfolio";

export function usePortfolioItems(projectType?: string) {
  return useQuery<PortfolioItem[]>({
    queryKey: ["projects", { projectType: projectType ?? "all" }],
    queryFn: () => getProjects({ projectType }),
    staleTime: 0,
  });
}

export function useProjects(opts: GetProjectsOpts = {}) {
  return useQuery<PortfolioItem[]>({
    queryKey: ["projects", opts],
    queryFn: () => getProjects(opts),
    staleTime: 0,
  });
}

export function useProjectsByStatus(status: ProjectStatus) {
  return useProjects({ status });
}
