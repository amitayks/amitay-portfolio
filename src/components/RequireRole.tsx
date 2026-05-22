import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/types/profile";

export function RequireRole({
  role,
  children,
}: {
  role: UserRole | UserRole[];
  children: ReactNode;
}) {
  const { session, profile, isLoading, isProfileLoading } = useAuth();
  const location = useLocation();
  const allowed = Array.isArray(role) ? role : [role];

  if (isLoading || (session && isProfileLoading)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/60 text-sm">
        Loading…
      </div>
    );
  }
  if (!session) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  if (!profile || !allowed.includes(profile.role)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-center px-6">
        <div>
          <h1 className="text-2xl font-medium text-white">403 — Not authorized</h1>
          <p className="mt-3 text-white/60 text-sm">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
