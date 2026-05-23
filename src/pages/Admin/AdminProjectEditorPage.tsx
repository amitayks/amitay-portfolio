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
import type { Translated } from "@/types/content";
import type { Profile } from "@/types/profile";

const EMPTY_TRANSLATED: Translated = { en: "", he: "" };

const DEFAULT_DRAFT = (currentAdminId: string | null): Partial<AdminProjectRow> => ({
  SKU: "",
  title: { ...EMPTY_TRANSLATED },
  description: { ...EMPTY_TRANSLATED },
  longDescription: { ...EMPTY_TRANSLATED },
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

  const setTranslated = (
    key: keyof AdminProjectRow,
    locale: "en" | "he",
    value: string
  ) => {
    setDraft((prev) => {
      const current = (prev[key] as Translated | null | undefined) ?? { en: null, he: null };
      return {
        ...prev,
        [key]: { ...current, [locale]: value },
      };
    });
  };

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

  const title = draft.title?.en || draft.title?.he || "Untitled";

  return (
    <div className="max-w-3xl">
      <Link to="/admin/projects" className="text-xs text-white/50 hover:text-white">
        ← Back to projects
      </Link>
      <h1 className="mt-4 text-xl font-medium">{isNew ? "New project" : title}</h1>

      <form onSubmit={onSave} className="mt-8 space-y-5">
        <TranslatedField
          label="Title"
          value={(draft.title as Translated | undefined) ?? EMPTY_TRANSLATED}
          onChange={(loc, v) => setTranslated("title", loc, v)}
          required
        />
        <Row>
          <Field label="SKU" value={draft.SKU ?? ""} onChange={(v) => set("SKU", v)} required />
          <Select
            label="Project type"
            value={draft.projectType ?? "Web-Development"}
            onChange={(v) =>
              set("projectType", v as AdminProjectRow["projectType"])
            }
            options={[
              { value: "Web-Development", label: "Web Development" },
              { value: "Design", label: "Design" },
              { value: "Other", label: "Other" },
            ]}
          />
        </Row>

        <TranslatedTextArea
          label="Short description"
          value={(draft.description as Translated | undefined) ?? EMPTY_TRANSLATED}
          onChange={(loc, v) => setTranslated("description", loc, v)}
        />
        <TranslatedTextArea
          label="Long description (markdown)"
          rows={5}
          value={(draft.longDescription as Translated | undefined) ?? EMPTY_TRANSLATED}
          onChange={(loc, v) => setTranslated("longDescription", loc, v)}
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
          <div />
        </Row>
        <TranslatedField
          label="Duration"
          value={(draft.duration as Translated | null) ?? EMPTY_TRANSLATED}
          onChange={(loc, v) =>
            setTranslated("duration", loc, v)
          }
          placeholder='e.g. "3 months" / "3 חודשים"'
        />
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
          <div />
        </Row>
        <TranslatedField
          label="Client company name"
          value={(draft.company_name as Translated | null) ?? EMPTY_TRANSLATED}
          onChange={(loc, v) => setTranslated("company_name", loc, v)}
        />

        <h2 className="text-xs uppercase tracking-wider text-white/40 pt-4 border-t border-white/10">
          Case study
        </h2>

        <TranslatedTextArea
          label="Problem"
          rows={4}
          value={(draft.problem as Translated | null) ?? EMPTY_TRANSLATED}
          onChange={(loc, v) => setTranslated("problem", loc, v)}
        />
        <TranslatedTextArea
          label="What I built"
          rows={4}
          value={(draft.what_i_built as Translated | null) ?? EMPTY_TRANSLATED}
          onChange={(loc, v) => setTranslated("what_i_built", loc, v)}
        />
        <TranslatedTextArea
          label="How it works"
          rows={4}
          value={(draft.how_it_works as Translated | null) ?? EMPTY_TRANSLATED}
          onChange={(loc, v) => setTranslated("how_it_works", loc, v)}
        />
        <TranslatedTextArea
          label="Result"
          rows={4}
          value={(draft.result as Translated | null) ?? EMPTY_TRANSLATED}
          onChange={(loc, v) => setTranslated("result", loc, v)}
        />

        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={Boolean(draft.featured)}
            onChange={(e) => set("featured", e.target.checked)}
            className="accent-white"
          />
          Featured (highlight on home / case-study lists)
        </label>

        <JsonField
          label="Live site (JSON)"
          help='Shape: { label?: { en, he }, link, subHeader: { en, he }, previewImage?: { dark, light } }'
          value={draft.liveSite}
          onChange={(v) => set("liveSite", v as AdminProjectRow["liveSite"])}
        />
        <JsonField
          label="GitHub (JSON)"
          help='Shape: { label?: { en, he }, link, subHeader: { en, he }, previewImage?: { dark, light } }'
          value={draft.github}
          onChange={(v) => set("github", v as AdminProjectRow["github"])}
        />
        <JsonField
          label="Additional info (JSON)"
          help='Array of { label: { en, he }, value: { en, he } }'
          value={draft.additionalInfo}
          onChange={(v) =>
            set("additionalInfo", v as AdminProjectRow["additionalInfo"])
          }
        />
        <JsonField
          label="Settings (JSON)"
          help='Shape: { imageAspect: "square" }'
          value={draft.settings}
          onChange={(v) => set("settings", v as AdminProjectRow["settings"])}
        />

        <h2 className="text-xs uppercase tracking-wider text-white/40 pt-4 border-t border-white/10">
          Assignment
        </h2>

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
                    className="flex items-center gap-3 border border-white/10 rounded-xl px-3 py-2"
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

              <details className="border border-white/10 rounded-xl">
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

// Returns a "Missing EN" / "Missing HE" badge when exactly one locale is empty.
// Both-empty fields don't trigger the badge (treated as "not authored yet").
function missingLocale(v: Translated): "en" | "he" | null {
  const enFilled = (v.en ?? "").trim().length > 0;
  const heFilled = (v.he ?? "").trim().length > 0;
  if (enFilled && !heFilled) return "he";
  if (heFilled && !enFilled) return "en";
  return null;
}

function MissingBadge({ locale }: { locale: "en" | "he" }) {
  return (
    <span className="text-[10px] uppercase tracking-wider text-amber-300 border border-amber-300/40 bg-amber-300/10 rounded-full px-1.5 py-0.5">
      Missing {locale.toUpperCase()}
    </span>
  );
}

function TranslatedField(props: {
  label: string;
  value: Translated;
  onChange: (locale: "en" | "he", value: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  const missing = missingLocale(props.value);
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="block text-xs uppercase tracking-wide text-white/50">
          {props.label}
        </span>
        {missing && <MissingBadge locale={missing} />}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          dir="ltr"
          aria-label={`${props.label} (EN)`}
          value={props.value.en ?? ""}
          required={props.required}
          placeholder={props.placeholder ? `${props.placeholder} (EN)` : "EN"}
          onChange={(e) => props.onChange("en", e.target.value)}
          className="w-full rounded-md bg-white/5 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/30"
        />
        <input
          type="text"
          dir="rtl"
          aria-label={`${props.label} (HE)`}
          value={props.value.he ?? ""}
          placeholder={props.placeholder ? `${props.placeholder} (HE)` : "HE"}
          onChange={(e) => props.onChange("he", e.target.value)}
          className="w-full rounded-md bg-white/5 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/30"
        />
      </div>
    </div>
  );
}

function TranslatedTextArea(props: {
  label: string;
  value: Translated;
  onChange: (locale: "en" | "he", value: string) => void;
  rows?: number;
}) {
  const missing = missingLocale(props.value);
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="block text-xs uppercase tracking-wide text-white/50">
          {props.label}
        </span>
        {missing && <MissingBadge locale={missing} />}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <textarea
          dir="ltr"
          aria-label={`${props.label} (EN)`}
          value={props.value.en ?? ""}
          onChange={(e) => props.onChange("en", e.target.value)}
          rows={props.rows ?? 3}
          className="w-full rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-sm text-white resize-y"
        />
        <textarea
          dir="rtl"
          aria-label={`${props.label} (HE)`}
          value={props.value.he ?? ""}
          onChange={(e) => props.onChange("he", e.target.value)}
          rows={props.rows ?? 3}
          className="w-full rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-sm text-white resize-y"
        />
      </div>
    </div>
  );
}

// JsonField renders a JSON-shaped value as pretty-printed text in a
// textarea. Local text state lets the user type freely without us
// re-stringifying mid-edit. On blur we attempt to parse and either
// commit the parsed value upward or surface an inline error.
function JsonField(props: {
  label: string;
  value: unknown;
  onChange: (v: unknown) => void;
  help?: string;
}) {
  const stringify = (v: unknown) =>
    v === undefined || v === null ? "" : JSON.stringify(v, null, 2);
  const [text, setText] = useState(() => stringify(props.value));
  const [parseError, setParseError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) {
      setText(stringify(props.value));
      setParseError(null);
    }
  }, [props.value, focused]);

  const commit = () => {
    setFocused(false);
    if (text.trim() === "") {
      setParseError(null);
      props.onChange(null);
      return;
    }
    try {
      const parsed = JSON.parse(text);
      setParseError(null);
      props.onChange(parsed);
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wide text-white/50 mb-1.5">
        {props.label}
      </span>
      <textarea
        value={text}
        onFocus={() => setFocused(true)}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        rows={4}
        spellCheck={false}
        className="w-full rounded-xl bg-white/5 border border-white/15 px-3 py-2 text-xs text-white font-mono resize-y"
      />
      {props.help && (
        <span className="block text-[10px] text-white/40 mt-1">{props.help}</span>
      )}
      {parseError && (
        <span className="block text-[11px] text-red-400 mt-1">
          Invalid JSON — {parseError}
        </span>
      )}
    </label>
  );
}
