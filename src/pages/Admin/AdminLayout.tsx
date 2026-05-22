import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function AdminLayout() {
  const { signOut, profile } = useAuth();
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-sm text-white/60 hover:text-white">
          ← Keisar Club
        </Link>
        <nav className="flex gap-6 text-sm">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? "text-white" : "text-white/50 hover:text-white"
            }
          >
            Profiles
          </NavLink>
          <NavLink
            to="/admin/invites"
            className={({ isActive }) =>
              isActive ? "text-white" : "text-white/50 hover:text-white"
            }
          >
            Invites
          </NavLink>
          <NavLink
            to="/admin/projects"
            className={({ isActive }) =>
              isActive ? "text-white" : "text-white/50 hover:text-white"
            }
          >
            Projects
          </NavLink>
        </nav>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-white/50">{profile?.display_name}</span>
          <button
            type="button"
            onClick={() => signOut()}
            className="text-white/60 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="px-6 py-8">
        <Outlet />
      </main>
      <footer className="mt-12 border-t border-white/10 px-6 py-6 flex gap-6 text-xs text-white/40">
        <Link to="/legal/terms" className="hover:text-white/70">
          Terms
        </Link>
        <Link to="/legal/privacy" className="hover:text-white/70">
          Privacy
        </Link>
      </footer>
    </div>
  );
}
