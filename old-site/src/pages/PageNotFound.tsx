import { useTheme } from "@/hooks/useTheme";
import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const navigate = useNavigate();
  const { colors } = useTheme();

  return (
    <div
      style={{ backgroundColor: colors.background, color: colors.text }}
      className="flex flex-col min-h-screen items-center justify-center"
    >
      <main className="flex-grow flex flex-col items-center justify-center text-center">
        <h1 style={{ color: colors.primary }} className="text-6xl font-bold mb-4">
          404
        </h1>
        <p style={{ color: colors.textSecondary }} className="text-xl mb-6">
          Oops! The page you are looking for does not exist.
        </p>
        <button
          onClick={() => navigate(-1)}
          style={{ backgroundColor: colors.accent, color: colors.textInverse }}
          className="px-6 py-3 rounded-lg hover:opacity-90 transition"
        >
          Go Back
        </button>
      </main>
    </div>
  );
}

export default PageNotFound;
