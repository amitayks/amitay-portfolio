import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  adminCreateProject,
  adminDeleteProject,
  adminGetProject,
  adminListAssignableDevs,
  adminListManagers,
  adminUpdateProject,
  type AdminProjectRow,
} from "@/services/apiAdmin";
import type {
  ClientVisibility,
  DevAttribution,
  ProjectStatus,
} from "@/types/portfolio";
import type { Profile } from "@/types/profile";

const DEFAULT_DRAFT = (currentAdminId: string | null): Partial<AdminProjectRow> => ({
  SKU: "",
  lang: "en",
  title: "",
  description: "",
  longDescription: "",
  image: "",
  imagePack: [],
  technologies: [],
  projectType: "Web-Development",
  publish: false,
  status: "upcoming",
  client_visibility: "logo_only",
  dev_attribution: "named",
  developers: [],
  assigned_manager: currentAdminId,
});

export function AdminProjectEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const isNew = !id || id === "new";

  const [draft, setDraft] = useState<Partial<AdminProjectRow>>(
    DEFAULT_DRAFT(profile?.id ?? null)
  );
  const [devs, setDevs] = useState<Profile[]>([]);
  const [managers, setManagers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [devRows, mgrRows] = await Promise.all([
          adminListAssignableDevs(),
          adminListManagers(),
        ]);
        setDevs(devRows);
        setManagers(mgrRows);
        if (!isNew && id) {
          const row = await adminGetProject(id);
          if (row) setDraft(row);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew]);

  const set = <K extends keyof AdminProjectRow>(key: K, value: AdminProjectRow[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (isNew) {
        const created = await adminCreateProject(draft);
        navigate(`/admin/projects/${created.id}`, { replace: true });
      } else if (id) {
        await adminUpdateProject(id, draft);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!id || isNew) return;
    if (!confirm("Delete this project? This cannot be undone.")) return;
    try {
      await adminDeleteProject(id);
      navigate("/admin/projects", { replace: true });
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const toggleDev = (devId: string) => {
    const current = draft.developers ?? [];
    if (current.includes(devId)) {
      set("developers", current.filter((d) => d !== devId));
    } else {
      set("developers", [...current, devId]);
    }
  };

  const moveDev = (devId: string, dir: -1 | 1) => {
    const current = [...(draft.developers ?? [])];
    const idx = current.indexOf(devId);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= current.length) return;
    [current[idx], current[target]] = [current[target], current[idx]];
    set("developers", current);
  };

  if (loading) {
    return <p className="text-sm text-white/50">Loading…</p>;
  }

  return (
    <div className="max-w-3xl">
      <Link to="/admin/projects" className="text-xs text-white/50 hover:text-white">
        ← Back to projects
      </Link>
      <h1 className="mt-4 text-xl font-medium">
        {isNew ? "New project" : draft.title || "Untitled"}
      </h1>

      <form onSubmit={onSave} className="mt-8 space-y-5">
        <Row>
          <Field label="Title" value={draft.title ?? ""} onChange={(v) => set("title", v)} required />
          <Field label="SKU" value={draft.SKU ?? ""} onChange={(v) => set("SKU", v)} required />
        </Row>
        <Row>
          <Select
            label="Language"
            value={draft.lang ?? "en"}
            onChange={(v) => set("lang", v as "en" | "he")}
            options={[
              { value: "en", label: "English" },
              { value: "he", label: "Hebrew" },
            ]}
          />
          <Select
            label="Project type"
            value={draft.projectType ?? "Web-Development"}
            onChange={(v) =>
              set("projectType", v as AdminProjectRow["projectType"])
            }
            options={[
              { value: "Web-Development", label: "Web Development" },
              { value: "Wood-Working", label: "Wood Working" },
              { value: "Design", label: "Design" },
              { value: "Other", label: "Other" },
            ]}
          />
        </Row>

        <TextArea
          label="Short description"
          value={draft.description ?? ""}
          onChange={(v) => set("description", v)}
        />
        <TextArea
          label="Long description (markdown)"
          rows={5}
          value={draft.longDescription ?? ""}
          onChange={(v) => set("longDescription", v)}
        />

        <Row>
          <Field
            label="Main image filename"
            value={draft.image ?? ""}
            onChange={(v) => set("image", v)}
          />
          <Field
            label="Priority"
            type="number"
            value={String(draft.priority ?? 0)}
            onChange={(v) => set("priority", v === "" ? undefined : Number(v))}
          />
        </Row>

        <Field
          label="Image pack (comma separated filenames)"
          value={(draft.imagePack ?? []).join(", ")}
          onChange={(v) =>
            set(
              "imagePack",
              v.split(",").map((s) => s.trim()).filter(Boolean)
            )
          }
        />
        <Field
          label="Technologies (comma separated)"
          value={(draft.technologies ?? []).join(", ")}
          onChange={(v) =>
            set(
              "technologies",
              v.split(",").map((s) => s.trim()).filter(Boolean)
            )
          }
        />

        <h2 className="text-xs uppercase tracking-wider text-white/40 pt-4 border-t border-white/10">
          Agency fields
        </h2>

        <Row>
          <Select
            label="Status"
            value={draft.status ?? "upcoming"}
            onChange={(v) => set("status", v as ProjectStatus)}
            options={[
              { value: "upcoming", label: "Upcoming" },
              { value: "ongoing", label: "Ongoing" },
              { value: "finished", label: "Finished" },
            ]}
          />
          <Field
            label="Duration"
            value={draft.duration ?? ""}
            onChange={(v) => set("duration", v || null)}
            placeholder="e.g. 3 months"
          />
        </Row>
        <Row>
          <Field
            label="Started"
            type="date"
            value={draft.started_at ?? ""}
            onChange={(v) => set("started_at", v || null)}
          />
          <Field
            label="Finished"
            type="date"
            value={draft.finished_at ?? ""}
            onChange={(v) => set("finished_at", v || null)}
          />
        </Row>
        <Row>
          <Field
            label="Client company name"
            value={draft.company_name ?? ""}
            onChange={(v) => set("company_name", v || null)}
          />
          <Select
            label="Client visibility"
            value={draft.client_visibility ?? "logo_only"}
            onChange={(v) => set("client_visibility", v as ClientVisibility)}
            options={[
              { value: "public", label: "Public — show name & logo" },
              { value: "logo_only", label: "Logo only" },
              { value: "hidden", label: "Hidden — show as confidential" },
            ]}
          />
        </Row>

        <Select
          label="Assigned manager"
          value={draft.assigned_manager ?? ""}
          onChange={(v) => set("assigned_manager", v || null)}
          options={[
            { value: "", label: "— None —" },
            ...managers.map((m) => ({
              value: m.id,
              label: `${m.display_name || m.full_name || m.id} (${m.role})`,
            })),
          ]}
        />

        <Select
          label="Developer attribution"
          value={draft.dev_attribution ?? "named"}
          onChange={(v) => set("dev_attribution", v as DevAttribution)}
          options={[
            { value: "named", label: "Named — show display name + avatar" },
            { value: "anonymized", label: "Anonymized — Developer A, B, …" },
            { value: "hidden", label: "Hidden — no developer block" },
          ]}
        />

        <div>
          <span className="block text-xs uppercase tracking-wide text-white/50 mb-2">
            Developers (ordered, lead first)
          </span>
          {devs.length === 0 ? (
            <p className="text-xs text-white/40">
              No active dev profiles yet. Invite some via the Invites tab.
            </p>
          ) : (
            <div className="space-y-3">
              {(draft.developers ?? []).map((devId, idx) => {
                const d = devs.find((x) => x.id === devId);
                return (
                  <div
                    key={devId}
                    className="flex items-center gap-3 border border-white/10 rounded-md px-3 py-2"
                  >
                    <span className="text-xs text-white/40 w-12">
                      {idx === 0 ? "Lead" : `#${idx + 1}`}
                    </span>
                    <span className="flex-1 text-sm text-white">
                      {d?.display_name || d?.full_name || devId}
                    </span>
                    <button
                      type="button"
                      onClick={() => moveDev(devId, -1)}
                      disabled={idx === 0}
                      className="text-xs px-2 py-1 border border-white/15 rounded disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDev(devId, 1)}
                      disabled={idx === (draft.developers?.length ?? 0) - 1}
                      className="text-xs px-2 py-1 border border-white/15 rounded disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleDev(devId)}
                      className="text-xs px-2 py-1 border border-red-400/40 text-red-400 rounded"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}

              <details className="border border-white/10 rounded-md">
                <summary className="cursor-pointer text-xs uppercase tracking-wider text-white/50 px-3 py-2">
                  Add developer
                </summary>
                <ul className="max-h-60 overflow-y-auto divide-y divide-white/5">
                  {devs
                    .filter((d) => !(draft.developers ?? []).includes(d.id))
                    .map((d) => (
                      <li key={d.id}>
                        <button
                          type="button"
                          onClick={() => toggleDev(d.id)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 flex items-center justify-between"
                        >
                          <span>{d.display_name || d.full_name || d.id}</span>
                          <span className="text-xs text-white/40">{d.role}</span>
                        </button>
                      </li>
                    ))}
                </ul>
              </details>
            </div>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-white/70 pt-4 border-t border-white/10">
          <input
            type="checkbox"
            checked={Boolean(draft.publish)}
            onChange={(e) => set("publish", e.target.checked)}
            className="accent-white"
          />
          Publish (visible on the public site)
        </label>

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-white text-black hover:bg-white/90 disabled:opacity-40 px-5 py-2.5 text-sm font-medium"
          >
            {saving ? "Saving…" : isNew ? "Create project" : "Save changes"}
          </button>
          {!isNew && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-md border border-red-400/40 text-red-400 hover:bg-red-400/10 px-4 py-2.5 text-sm"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wide text-white/50 mb-1.5">
        {props.label}
      </span>
      <input
        type={props.type ?? "text"}
        value={props.value}
        required={props.required}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full rounded-md bg-white/5 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/30"
      />
    </label>
  );
}

function TextArea(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wide text-white/50 mb-1.5">
        {props.label}
      </span>
      <textarea
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        rows={props.rows ?? 3}
        className="w-full rounded-md bg-white/5 border border-white/15 px-3 py-2 text-sm text-white resize-y"
      />
    </label>
  );
}

function Select(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wide text-white/50 mb-1.5">
        {props.label}
      </span>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full rounded-md bg-white/5 border border-white/15 px-3 py-2 text-sm text-white"
      >
        {props.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
