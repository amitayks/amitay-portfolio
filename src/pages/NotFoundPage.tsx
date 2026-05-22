import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-center px-6">
      <div>
        <h1 className="text-3xl font-medium text-white">404 — Page not found</h1>
        <p className="mt-3 text-white/60 text-sm">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="mt-6 inline-block text-white/80 underline">
          Back to home
        </Link>
      </div>
    </div>
  );
}
