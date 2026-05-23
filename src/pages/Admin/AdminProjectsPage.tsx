import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { adminListProjects, type AdminProjectRow } from "@/services/apiAdmin";
import type { ProjectStatus } from "@/types/portfolio";
import type { Translated } from "@/types/content";

const STATUS_BADGE: Record<ProjectStatus, string> = {
  upcoming: "bg-blue-400/15 text-blue-300 border-blue-400/30",
  ongoing: "bg-amber-400/15 text-amber-300 border-amber-400/30",
  finished: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
};

const TRANSLATABLE_FIELDS: Array<keyof AdminProjectRow> = [
  "title",
  "description",
  "longDescription",
  "problem",
  "what_i_built",
  "how_it_works",
  "result",
  "company_name",
  "duration",
];

function isFilled(v: string | null | undefined): boolean {
  return typeof v === "string" && v.trim().length > 0;
}

function completeness(p: AdminProjectRow): { en: boolean; he: boolean } {
  let enAny = false;
  let heAny = false;
  let enAll = true;
  let heAll = true;
  for (const field of TRANSLATABLE_FIELDS) {
    const val = p[field] as Translated | null | undefined;
    if (val && typeof val === "object" && ("en" in val || "he" in val)) {
      const hasEn = isFilled(val.en);
      const hasHe = isFilled(val.he);
      if (hasEn || hasHe) {
        enAny = enAny || hasEn;
        heAny = heAny || hasHe;
        if (!hasEn) enAll = false;
        if (!hasHe) heAll = false;
      }
    }
  }
  // If neither side has any content at all, treat as "no translations yet" not "missing".
  if (!enAny && !heAny) return { en: false, he: false };
  return { en: enAll, he: heAll };
}

export function AdminProjectsPage() {
  const [projects, setProjects] = useState<AdminProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | ProjectStatus>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setProjects(await adminListProjects());
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load projects.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (q) {
        const titleEn = p.title?.en ?? "";
        const titleHe = p.title?.he ?? "";
        const companyEn = p.company_name?.en ?? "";
        const companyHe = p.company_name?.he ?? "";
        const blob = `${titleEn} ${titleHe} ${p.SKU ?? ""} ${companyEn} ${companyHe}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [projects, search, statusFilter]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-xl font-medium">Projects</h1>
        <Link
          to="/admin/projects/new"
          className="rounded-md bg-white text-black hover:bg-white/90 px-3 py-2 text-sm font-medium"
        >
          New project
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="search"
          placeholder="Search by title, SKU, or company…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[240px] rounded-md bg-white/5 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/30"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded-md bg-white/5 border border-white/15 px-3 py-2 text-sm text-white"
        >
          <option value="all">All statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="finished">Finished</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
      {loading && <p className="text-sm text-white/50">Loading…</p>}
      {!loading && filtered.length === 0 && (
        <p className="text-sm text-white/50">No projects match these filters.</p>
      )}

      <ul className="divide-y divide-white/10 border border-white/10 rounded-xl overflow-hidden">
        {filtered.map((p) => {
          const c = completeness(p);
          const titleDisplay = p.title?.en || p.title?.he || "Untitled";
          const companyDisplay =
            p.company_name && p.client_visibility !== "hidden"
              ? p.company_name.en || p.company_name.he || null
              : null;
          return (
            <li key={p.id}>
              <Link
                to={`/admin/projects/${p.id}`}
                className="flex items-center gap-4 px-4 py-3 hover:bg-white/5"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white truncate">{titleDisplay}</span>
                    {!p.publish && (
                      <span className="text-[10px] uppercase tracking-wider text-white/40 border border-white/20 rounded-full px-1.5 py-0.5">
                        Draft
                      </span>
                    )}
                    <span className="text-[10px] uppercase tracking-wider text-white/50 font-mono">
                      EN {c.en ? "✓" : "—"} HE {c.he ? "✓" : "—"}
                    </span>
                  </div>
                  <div className="text-xs text-white/40 flex gap-3 mt-0.5">
                    <span>{p.SKU}</span>
                    <span>{p.projectType}</span>
                    {companyDisplay && <span>{companyDisplay}</span>}
                  </div>
                </div>
                <span
                  className={`text-[10px] uppercase tracking-wider border rounded-full px-2 py-0.5 ${
                    STATUS_BADGE[p.status]
                  }`}
                >
                  {p.status}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
