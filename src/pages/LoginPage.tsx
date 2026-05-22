import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function LoginPage() {
  const { session, signInWithGoogle, signInWithGitHub, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [busy, setBusy] = useState<"google" | "github" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect") || "/";

  useEffect(() => {
    if (!isLoading && session) navigate(redirect, { replace: true });
  }, [isLoading, session, redirect, navigate]);

  const handle = async (provider: "google" | "github") => {
    try {
      setBusy(provider);
      setError(null);
      if (provider === "google") await signInWithGoogle(redirect);
      else await signInWithGitHub(redirect);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign-in failed");
      setBusy(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="text-white/60 text-sm hover:text-white">
          ← Keisar Club
        </Link>
        <h1 className="mt-8 text-2xl font-medium">Sign in</h1>
        <p className="mt-2 text-sm text-white/60">
          Use the provider tied to your invite email.
        </p>

        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={() => handle("github")}
            disabled={busy !== null}
            className="w-full rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 disabled:opacity-50 px-4 py-3 text-sm font-medium transition-colors"
          >
            {busy === "github" ? "Redirecting…" : "Continue with GitHub"}
          </button>
          <button
            type="button"
            onClick={() => handle("google")}
            disabled={busy !== null}
            className="w-full rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 disabled:opacity-50 px-4 py-3 text-sm font-medium transition-colors"
          >
            {busy === "google" ? "Redirecting…" : "Continue with Google"}
          </button>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <p className="mt-8 text-xs text-white/40">
          By signing in you agree to our{" "}
          <Link to="/legal/terms" className="underline hover:text-white/70">
            Terms
          </Link>{" "}
          and{" "}
          <Link to="/legal/privacy" className="underline hover:text-white/70">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
