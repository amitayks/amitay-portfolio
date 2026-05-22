import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile } from "@/services/apiProfile";

export function MePage() {
  const { profile, user, refreshProfile, signOut } = useAuth();
  const [fullName, setFullName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name ?? "");
    setDisplayName(profile.display_name ?? "");
    setBio(profile.bio ?? "");
    setGithub(profile.links?.github ?? "");
    setLinkedin(profile.links?.linkedin ?? "");
    setWebsite(profile.links?.website ?? "");
    setTwitter(profile.links?.twitter ?? "");
  }, [profile]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/60 text-sm">
        No profile yet. If you have an invite link, open it to onboard.
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const links = Object.fromEntries(
        Object.entries({
          github: github.trim(),
          linkedin: linkedin.trim(),
          website: website.trim(),
          twitter: twitter.trim(),
        }).filter(([, v]) => v)
      );
      await updateProfile(profile.id, {
        full_name: fullName.trim() || null,
        display_name: displayName.trim() || null,
        bio: bio.trim() || null,
        links,
      });
      await refreshProfile();
      setSavedAt(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-white/60 text-sm hover:text-white">
            ← Keisar Club
          </Link>
          <button
            type="button"
            onClick={() => signOut()}
            className="text-white/60 text-sm hover:text-white"
          >
            Sign out
          </button>
        </div>

        <div className="mt-8 flex items-center gap-4">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
              className="w-16 h-16 rounded-full object-cover border border-white/15"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/10" />
          )}
          <div>
            <h1 className="text-2xl font-medium">
              {profile.display_name || profile.full_name || "Your profile"}
            </h1>
            <p className="text-sm text-white/50">
              {user?.email}
              {profile.github_handle && <> · @{profile.github_handle}</>}
            </p>
          </div>
        </div>

        <form className="mt-10 space-y-5" onSubmit={onSubmit}>
          <Field label="Legal full name" value={fullName} onChange={setFullName} />
          <Field label="Display name" value={displayName} onChange={setDisplayName} />
          <TextArea
            label="Bio"
            value={bio}
            onChange={setBio}
            maxLength={500}
          />
          <Field label="GitHub URL" value={github} onChange={setGithub} type="url" />
          <Field label="LinkedIn URL" value={linkedin} onChange={setLinkedin} type="url" />
          <Field label="Personal website" value={website} onChange={setWebsite} type="url" />
          <Field label="Twitter / X URL" value={twitter} onChange={setTwitter} type="url" />

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          {savedAt && !error && (
            <p className="text-sm text-emerald-400">
              Saved at {savedAt.toLocaleTimeString()}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-white text-black hover:bg-white/90 disabled:opacity-40 px-5 py-2.5 text-sm font-medium transition-colors"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wide text-white/50 mb-1.5">
        {props.label}
      </span>
      <input
        type={props.type ?? "text"}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full rounded-md bg-white/5 border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40"
      />
    </label>
  );
}

function TextArea(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wide text-white/50 mb-1.5">
        {props.label}
      </span>
      <textarea
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        maxLength={props.maxLength}
        rows={3}
        className="w-full rounded-md bg-white/5 border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 resize-y"
      />
    </label>
  );
}
