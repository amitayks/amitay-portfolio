import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import supabase, {
  signInWithGitHub as supabaseSignInWithGitHub,
  signInWithGoogle as supabaseSignInWithGoogle,
  signOut as supabaseSignOut,
} from "@/services/supabase";
import { getProfile } from "@/services/apiProfile";
import type { Profile } from "@/types/profile";

export interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isProfileLoading: boolean;
  signInWithGoogle: (redirectPath?: string) => Promise<void>;
  signInWithGitHub: (redirectPath?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Tracked separately from `isLoading` because the profile fetch is
  // scheduled on a fresh task (see below) and resolves after the session
  // is already known. Route guards need this distinction to avoid
  // flashing a 403 between session-ready and profile-ready.
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // IMPORTANT: never call supabase.from/.rpc inside onAuthStateChange or
  // inside the .then of getSession — supabase-js holds an auth lock for
  // the duration of those callbacks and any subsequent client call inside
  // them would deadlock. We schedule profile loads on a fresh task with
  // setTimeout(0) so the lock is released first.
  const loadProfile = (userId: string) => {
    setIsProfileLoading(true);
    setTimeout(async () => {
      try {
        const p = await getProfile(userId);
        setProfile(p);
      } catch {
        setProfile(null);
      } finally {
        setIsProfileLoading(false);
      }
    }, 0);
  };

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session?.user.id) {
        loadProfile(data.session.user.id);
      } else {
        setIsProfileLoading(false);
      }
      setIsLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      if (newSession?.user.id) {
        loadProfile(newSession.user.id);
      } else {
        setProfile(null);
        setIsProfileLoading(false);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      isLoading,
      isProfileLoading,
      signInWithGoogle: supabaseSignInWithGoogle,
      signInWithGitHub: supabaseSignInWithGitHub,
      signOut: supabaseSignOut,
      refreshProfile: async () => {
        if (session?.user.id) {
          setIsProfileLoading(true);
          try {
            const p = await getProfile(session.user.id);
            setProfile(p);
          } finally {
            setIsProfileLoading(false);
          }
        }
      },
    }),
    [session, profile, isLoading, isProfileLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an <AuthProvider>");
  return ctx;
}
