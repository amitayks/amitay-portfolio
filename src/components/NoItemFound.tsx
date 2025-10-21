import { useTheme } from "@/hooks/useTheme";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function NoItemFound() {
  const navigate = useNavigate();
  const colors = useTheme();

  return (
    <div
      style={{ backgroundColor: colors.background }}
      className="min-h-screen flex items-center justify-center"
    >
      <div className="text-center">
        <h1 style={{ color: colors.primary }} className="text-2xl font-bold mb-4">
          Project Not Found
        </h1>
        <p style={{ color: colors.textSecondary }} className="mb-6">
          The project you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/portfolio")}
          style={{ backgroundColor: colors.accent, color: colors.textInverse }}
          className="inline-flex items-center px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Portfolio
        </button>
      </div>
    </div>
  );
}

export default NoItemFound;
