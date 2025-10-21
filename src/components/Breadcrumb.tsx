import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/hooks/useTheme";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PortfolioItem } from "../types/portfolio";

interface BreadcrumbProps {
  projectType: PortfolioItem["projectType"];
  status: PortfolioItem["status"];
}

function Breadcrumb({ projectType }: BreadcrumbProps) {
  const navigate = useNavigate();
  const colors = useTheme();

  return (
    <motion.div
      style={{
        backgroundColor: colors.surfaceSecondary,
        borderBottom: `1px solid ${colors.border}`,
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="group"
            >
              <motion.div
                className="flex items-center"
                whileHover={{ x: -4 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Go Back
              </motion.div>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4, type: "spring", stiffness: 200 }}
          >
            <Badge
              variant="secondary"
              style={{
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border,
              }}
              className="px-4 py-2 text-sm font-medium capitalize border"
            >
              {projectType?.replace("-", " ")}
            </Badge>
          </motion.div>
        </nav>
      </div>
    </motion.div>
  );
}

export default Breadcrumb;
