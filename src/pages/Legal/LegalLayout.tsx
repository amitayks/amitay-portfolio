import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="text-white/60 text-sm hover:text-white">
          ← Keisar Club
        </Link>
        <h1 className="mt-8 text-3xl font-medium">{title}</h1>
        <div
          className="mt-8 space-y-4 text-sm text-white/75 leading-relaxed
            [&_h2]:text-white [&_h2]:text-base [&_h2]:font-medium [&_h2]:mt-8 [&_h2]:mb-2
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1
            [&_a]:underline [&_a]:hover:text-white"
        >
          {children}
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 text-xs text-white/40 flex gap-6">
          <Link to="/legal/terms" className="hover:text-white/70">Terms</Link>
          <Link to="/legal/privacy" className="hover:text-white/70">Privacy</Link>
        </div>
      </div>
    </div>
  );
}
