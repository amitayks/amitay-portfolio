import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile, upsertProfileFromAuth } from "@/services/apiProfile";
import {
  redeemInvite,
  validateInvite,
  InviteEmailMismatchError,
  InviteInvalidError,
} from "@/services/apiInvites";
import type { InviteValidationResult } from "@/services/apiInvites";

type Phase = "checking" | "no_token" | "invalid" | "need_login" | "email_mismatch" | "ready" | "submitting" | "done";

export function OnboardPage() {
  const { session, user, isLoading, signInWithGoogle, signInWithGitHub, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const rawToken = params.get("token");

  const [phase, setPhase] = useState<Phase>("checking");
  const [invite, setInvite] = useState<InviteValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    if (!rawToken) {
      setPhase("no_token");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const result = await validateInvite(rawToken);
        if (cancelled) return;
        if (!result) {
          setPhase("invalid");
          return;
        }
        setInvite(result);
        if (isLoading) return;
        if (!session) {
          setPhase("need_login");
          return;
        }
        const userEmail = (user?.email ?? "").toLowerCase();
        if (userEmail !== result.email.toLowerCase()) {
          setPhase("email_mismatch");
          return;
        }
        // Pre-fill from OAuth metadata
        const meta = (user?.user_metadata ?? {}) as Record<string, unknown>;
        const seedName =
          (meta.full_name as string | undefined) ??
          (meta.name as string | undefined) ??
          "";
        const ghUser = meta.user_name as string | undefined;
        if (!fullName) setFullName(seedName);
        if (!displayName) setDisplayName(seedName);
        if (ghUser && !github) setGithub(`https://github.com/${ghUser}`);
        setPhase("ready");
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Unable to validate invite.");
        setPhase("invalid");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [rawToken, isLoading, session, user, fullName, displayName, github]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawToken || !user || !consent || !fullName.trim()) return;
    setPhase("submitting");
    setError(null);
    try {
      const invitedBy = await redeemInvite(rawToken);
      const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
      const avatarUrl =
        (meta.avatar_url as string | undefined) ??
        (meta.picture as string | undefined) ??
        null;
      const ghUser = meta.user_name as string | undefined;
      const links = Object.fromEntries(
        Object.entries({
          github: github.trim() || (ghUser ? `https://github.com/${ghUser}` : ""),
          linkedin: linkedin.trim(),
          website: website.trim(),
          twitter: twitter.trim(),
        }).filter(([, v]) => v)
      );
      await upsertProfileFromAuth({
        userId: user.id,
        fullName: fullName.trim(),
        displayName: displayName.trim() || fullName.trim(),
        avatarUrl,
        githubHandle: ghUser ?? null,
        invitedBy: invitedBy ?? null,
        termsAcceptedAt: new Date().toISOString(),
      });
      // Apply bio + links via update (upsertProfileFromAuth doesn't set them)
      await updateProfile(user.id, {
        bio: bio.trim() || null,
        links,
      });
      await refreshProfile();
      setPhase("done");
      navigate("/me", { replace: true });
    } catch (e) {
      if (e instanceof InviteEmailMismatchError) {
        setPhase("email_mismatch");
      } else if (e instanceof InviteInvalidError) {
        setPhase("invalid");
      } else {
        setError(e instanceof Error ? e.message : "Submission failed.");
        setPhase("ready");
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-lg mx-auto">
        <Link to="/" className="text-white/60 text-sm hover:text-white">
          ← Keisar Club
        </Link>
        <h1 className="mt-8 text-2xl font-medium">Welcome to Keisar Club</h1>

        {phase === "checking" && (
          <p className="mt-6 text-white/60 text-sm">Validating your invite…</p>
        )}

        {phase === "no_token" && (
          <p className="mt-6 text-white/60 text-sm">
            Invite required. Please use the link you received by email.
          </p>
        )}

        {phase === "invalid" && (
          <p className="mt-6 text-red-400 text-sm">
            {error || "Invalid or expired invite. Please contact us for a new one."}
          </p>
        )}

        {phase === "need_login" && invite && (
          <div className="mt-6 space-y-4">
            <p className="text-white/70 text-sm">
              Invite for <span className="text-white font-medium">{invite.email}</span>.
              Sign in with the matching account to continue.
            </p>
            <button
              type="button"
              onClick={() => signInWithGitHub(`/onboard?token=${rawToken}`)}
              className="w-full rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 px-4 py-3 text-sm font-medium transition-colors"
            >
              Continue with GitHub
            </button>
            <button
              type="button"
              onClick={() => signInWithGoogle(`/onboard?token=${rawToken}`)}
              className="w-full rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 px-4 py-3 text-sm font-medium transition-colors"
            >
              Continue with Google
            </button>
          </div>
        )}

        {phase === "email_mismatch" && invite && (
          <p className="mt-6 text-red-400 text-sm">
            This invite is for <span className="text-white">{invite.email}</span>, but
            you're signed in as{" "}
            <span className="text-white">{user?.email ?? "another account"}</span>.{" "}
            Please sign out and use the matching account, or contact us to reissue the invite.
          </p>
        )}

        {(phase === "ready" || phase === "submitting") && (
          <form className="mt-6 space-y-5" onSubmit={onSubmit}>
            <Field
              label="Legal full name *"
              value={fullName}
              onChange={setFullName}
              required
            />
            <Field
              label="Display name"
              value={displayName}
              onChange={setDisplayName}
              placeholder="Defaults to your legal name"
            />
            <TextArea
              label="Short bio"
              value={bio}
              onChange={setBio}
              maxLength={500}
              placeholder="A line or two about you (max 500 chars)"
            />
            <Field label="GitHub URL" value={github} onChange={setGithub} type="url" />
            <Field label="LinkedIn URL" value={linkedin} onChange={setLinkedin} type="url" />
            <Field label="Personal website" value={website} onChange={setWebsite} type="url" />
            <Field label="Twitter / X URL" value={twitter} onChange={setTwitter} type="url" />

            <label className="flex items-start gap-3 text-sm text-white/70">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 accent-white"
              />
              <span>
                I have read and agree to the{" "}
                <Link to="/legal/terms" target="_blank" className="underline hover:text-white">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/legal/privacy" target="_blank" className="underline hover:text-white">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            {error && (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!consent || !fullName.trim() || phase === "submitting"}
              className="w-full rounded-lg bg-white text-black hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-3 text-sm font-medium transition-colors"
            >
              {phase === "submitting" ? "Creating your profile…" : "Create my profile"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
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
        placeholder={props.placeholder}
        required={props.required}
        className="w-full rounded-md bg-white/5 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40"
      />
    </label>
  );
}

function TextArea(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
  placeholder?: string;
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
        placeholder={props.placeholder}
        rows={3}
        className="w-full rounded-md bg-white/5 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 resize-y"
      />
    </label>
  );
}
