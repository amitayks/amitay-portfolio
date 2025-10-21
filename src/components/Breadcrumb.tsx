import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PortfolioItem } from "../types/portfolio";

interface BreadcrumbProps {
  projectType: PortfolioItem["projectType"];
  status: PortfolioItem["status"];
}

function Breadcrumb({ projectType }: BreadcrumbProps) {
  const navigate = useNavigate();
  const colors = useTheme();

  return (
    <div
      style={{
        backgroundColor: colors.surfaceSecondary,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>
          <div className="">
            <span
              style={{
                backgroundColor: colors.surface,
                color: colors.text,
              }}
              className={`px-3 py-2 rounded-full text-sm font-medium`}
            >
              {projectType?.replace("-", " ")}
            </span>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Breadcrumb;
