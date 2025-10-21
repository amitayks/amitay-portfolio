import { useTheme } from "@/hooks/useTheme";
import { ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { usePortfolioImage } from "../hooks/usePortfolioImage";
import { PortfolioItem } from "../types/portfolio";

const PortfolioCard = ({
  portfolioItem,
  className,
}: {
  portfolioItem: PortfolioItem;
  className?: string;
}) => {
  const { image, isLoading: imageLoading } = usePortfolioImage(portfolioItem.image);
  const colors = useTheme();

  return (
    <article
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
      }}
      className={`group relative rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border ${className}`}
    >
      <Link to={`/portfolio/${portfolioItem.SKU}`} className="block">
        <div className="aspect-square w-full relative overflow-hidden">
          <div
            style={{ backgroundColor: colors.surfaceSecondary }}
            className="aspect-square"
          />
          {!imageLoading && image && (
            <img
              src={image}
              alt={portfolioItem.title}
              className="w-full h-full object-cover absolute inset-0 "
              onLoad={(e) => {
                const target = e.target as HTMLElement;
                target.style.opacity = "1";
              }}
              style={{ opacity: 0, transition: "opacity 0.3s ease-in-out" }}
            />
          )}
        </div>
      </Link>

      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        {portfolioItem.githubLink && (
          <a
            href={portfolioItem?.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: colors.surface, backdropFilter: "blur(4px)" }}
            className="p-2 rounded-lg shadow-lg hover:opacity-90 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Github style={{ color: colors.text }} className="w-4 h-4" />
          </a>
        )}
        {portfolioItem?.liveLink && (
          <a
            href={portfolioItem?.liveLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: colors.surface, backdropFilter: "blur(4px)" }}
            className="p-2 rounded-lg shadow-lg hover:opacity-90 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink style={{ color: colors.text }} className="w-4 h-4" />
          </a>
        )}
      </div>
    </article>
  );
};

export default PortfolioCard;
