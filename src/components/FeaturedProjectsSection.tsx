import { useTheme } from "@/hooks/useTheme";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import useFeaturdItems from "../hooks/useFeaturedItems";
import PortfolioCard from "./PortfolioCard";

function FeaturedProjectsSection() {
  const { portfolioItems: featuredProjects } = useFeaturdItems(true);
  const colors = useTheme();

  return (
    <section
      style={{
        background: `linear-gradient(to top right, ${colors.surfaceSecondary}, ${colors.surface})`,
      }}
      className="py-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            style={{ color: colors.primary }}
            className="text-3xl lg:text-4xl font-bold mb-4"
          >
            {"< My Favorite />"}
          </h2>
        </div>

        {featuredProjects.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12" dir="rtl">
            {featuredProjects.map((featuredItem, i) => {
              if (i >= 6) return;
              return (
                <PortfolioCard
                  key={featuredItem.id}
                  portfolioItem={featuredItem}
                  style={`
                    ${i >= 4 ? "hidden md:block" : ""}
                  `}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div
              style={{ backgroundColor: colors.surfaceSecondary }}
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <ExternalLink style={{ color: colors.textTertiary }} className="w-12 h-12" />
            </div>
            <h3
              style={{ color: colors.primary }}
              className="text-xl font-semibold mb-3"
            >
              Projects Coming Soon
            </h3>
            <p style={{ color: colors.textSecondary }} className="mb-6">
              I'm currently working on some exciting projects. Check back soon!
            </p>
          </div>
        )}

        <div className="text-center">
          <Link
            to="/portfolio"
            style={{ backgroundColor: colors.accent, color: colors.textInverse }}
            className="inline-flex items-center px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl group"
          >
            View All Projects
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProjectsSection;
