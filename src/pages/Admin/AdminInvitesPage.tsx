import { useEffect, useState } from "react";
import { createInvite, listInvites } from "@/services/apiInvites";
import type { DevInvite } from "@/types/profile";

export function AdminInvitesPage() {
  const [invites, setInvites] = useState<DevInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState<{ url: string; email: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const rows = await listInvites();
      setInvites(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load invites.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const { rawToken, invite } = await createInvite(email.trim());
      const url = `${window.location.origin}/onboard?token=${rawToken}`;
      setGenerated({ url, email: invite.email });
      setEmail("");
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create invite.");
    } finally {
      setCreating(false);
    }
  };

  const dismissGenerated = () => {
    setGenerated(null);
    setCopied(false);
  };

  return (
    <div>
      <h1 className="text-xl font-medium mb-6">Invites</h1>

      <form
        onSubmit={onCreate}
        className="flex flex-wrap gap-3 items-end mb-8 border border-white/10 rounded-xl p-4"
      >
        <label className="block flex-1 min-w-[240px]">
          <span className="block text-xs uppercase tracking-wide text-white/50 mb-1.5">
            Invite email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="dev@example.com"
            className="w-full rounded-md bg-white/5 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/30"
          />
        </label>
        <button
          type="submit"
          disabled={creating}
          className="rounded-md bg-white text-black hover:bg-white/90 disabled:opacity-40 px-4 py-2 text-sm font-medium"
        >
          {creating ? "Generating…" : "Generate invite"}
        </button>
      </form>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      {generated && (
        <div className="mb-8 border border-amber-400/40 bg-amber-400/5 rounded-xl p-4 space-y-3">
          <p className="text-xs uppercase tracking-wider text-amber-300">
            Copy this URL now — it's shown only once
          </p>
          <p className="text-sm text-white/70">
            Invite for{" "}
            <span className="text-white font-medium">{generated.email}</span>
          </p>
          <div className="flex gap-2">
            <input
              readOnly
              value={generated.url}
              onFocus={(e) => e.currentTarget.select()}
              className="flex-1 rounded-md bg-black/40 border border-white/15 px-3 py-2 text-xs text-white font-mono"
            />
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(generated.url);
                setCopied(true);
              }}
              className="rounded-md border border-white/15 px-3 py-2 text-xs hover:bg-white/10"
            >
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              onClick={dismissGenerated}
              className="rounded-md border border-white/15 px-3 py-2 text-xs hover:bg-white/10"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <h2 className="text-sm uppercase tracking-wider text-white/50 mb-3">
        Existing invites
      </h2>

      {loading && <p className="text-sm text-white/50">Loading…</p>}
      {!loading && invites.length === 0 && (
        <p className="text-sm text-white/50">No invites yet.</p>
      )}

      <ul className="divide-y divide-white/10 border border-white/10 rounded-xl overflow-hidden">
        {invites.map((inv) => {
          const status = inv.used_at
            ? { label: "Used", color: "text-white/50" }
            : new Date(inv.expires_at) < new Date()
            ? { label: "Expired", color: "text-red-400" }
            : { label: "Pending", color: "text-emerald-400" };
          return (
            <li key={inv.id} className="flex items-center gap-4 px-4 py-3 hover:bg-white/5">
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white truncate">{inv.email}</div>
                <div className="text-xs text-white/40 flex gap-3 mt-0.5">
                  <span>Created {new Date(inv.created_at).toLocaleDateString()}</span>
                  <span>Expires {new Date(inv.expires_at).toLocaleDateString()}</span>
                  {inv.used_at && (
                    <span>Used {new Date(inv.used_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <span className={`text-xs uppercase tracking-wider ${status.color}`}>
                {status.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
