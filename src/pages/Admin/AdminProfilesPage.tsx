import { useEffect, useMemo, useState } from "react";
import {
  hasNameFlipWarning,
  listAllProfiles,
  setProfileStatus,
} from "@/services/apiProfile";
import type { Profile, ProfileStatus, UserRole } from "@/types/profile";

export function AdminProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [flips, setFlips] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ProfileStatus>("all");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const rows = await listAllProfiles();
      setProfiles(rows);
      // Compute flip warnings in parallel
      const flipResults = await Promise.all(rows.map((p) => hasNameFlipWarning(p.id)));
      setFlips(Object.fromEntries(rows.map((p, i) => [p.id, flipResults[i]])));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load profiles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return profiles.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (roleFilter !== "all" && p.role !== roleFilter) return false;
      if (q) {
        const blob = `${p.display_name ?? ""} ${p.full_name ?? ""} ${p.github_handle ?? ""}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [profiles, search, statusFilter, roleFilter]);

  const toggleSuspend = async (p: Profile) => {
    const next = p.status === "active" ? "suspended" : "active";
    try {
      await setProfileStatus(p.id, next);
      setProfiles((prev) =>
        prev.map((row) => (row.id === p.id ? { ...row, status: next } : row))
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : "Update failed");
    }
  };

  return (
    <div>
      <h1 className="text-xl font-medium mb-6">Profiles</h1>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="search"
          placeholder="Search by name or handle…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[220px] rounded-md bg-white/5 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/30"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded-md bg-white/5 border border-white/15 px-3 py-2 text-sm text-white"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
          className="rounded-md bg-white/5 border border-white/15 px-3 py-2 text-sm text-white"
        >
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="dev">Dev</option>
          <option value="client">Client</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
      {loading && <p className="text-sm text-white/50">Loading…</p>}
      {!loading && filtered.length === 0 && (
        <p className="text-sm text-white/50">No profiles match these filters.</p>
      )}

      <ul className="divide-y divide-white/10 border border-white/10 rounded-lg overflow-hidden">
        {filtered.map((p) => (
          <li key={p.id} className="flex items-center gap-4 px-4 py-3 hover:bg-white/5">
            {p.avatar_url ? (
              <img src={p.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/10" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white truncate">
                  {p.display_name || p.full_name || "Unnamed"}
                </span>
                {flips[p.id] && (
                  <span
                    title="Full name changed more than once"
                    className="text-[10px] uppercase tracking-wider text-amber-400 border border-amber-400/40 rounded-full px-1.5 py-0.5"
                  >
                    Name flipped
                  </span>
                )}
              </div>
              <div className="text-xs text-white/40 flex gap-3 mt-0.5">
                <span>{p.role}</span>
                <span>{p.status}</span>
                {p.github_handle && <span>@{p.github_handle}</span>}
                <span>{new Date(p.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleSuspend(p)}
              className={`text-xs uppercase tracking-wider px-3 py-1.5 rounded-md border ${
                p.status === "active"
                  ? "border-white/15 text-white/80 hover:bg-white/10"
                  : "border-emerald-400/40 text-emerald-400 hover:bg-emerald-400/10"
              }`}
            >
              {p.status === "active" ? "Suspend" : "Reactivate"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
