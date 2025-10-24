import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";
import { usePortfolioImage } from "../hooks/usePortfolioImage";
import { PortfolioItem } from "../types/portfolio";
import { getPortfolioById } from "../services/apiPortfolio";
import { getPortfolioImage } from "../services/apiImages";
import { queryKeys } from "../lib/queryKeys";

const PortfolioCard = ({
  portfolioItem,
  className,
}: {
  portfolioItem: PortfolioItem;
  className?: string;
}) => {
  const { image, isLoading: imageLoading } = usePortfolioImage(portfolioItem.image);
  const { colors } = useTheme();
  const queryClient = useQueryClient();

  // Prefetch portfolio item details on hover for instant navigation
  const handleMouseEnter = () => {
    // Prefetch portfolio item data
    queryClient.prefetchQuery({
      queryKey: queryKeys.portfolioItem(portfolioItem.SKU),
      queryFn: () => getPortfolioById(portfolioItem.SKU),
      staleTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    // Prefetch main image if not already cached
    if (portfolioItem.image) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.portfolioImage(portfolioItem.image),
        queryFn: () => getPortfolioImage(portfolioItem.image),
        staleTime: 1000 * 60 * 60 * 24 * 14, // 14 days
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      onMouseEnter={handleMouseEnter}
      className={className}
    >
      <Card
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
        className="group relative overflow-hidden border hover:shadow-xl transition-shadow duration-300"
      >
        <Link to={`/portfolio/${portfolioItem.SKU}`} className="block">
          <div className="aspect-square w-full relative overflow-hidden">
            <motion.div
              style={{ backgroundColor: colors.surfaceSecondary }}
              className="aspect-square absolute inset-0"
              initial={{ opacity: 1 }}
              animate={{ opacity: imageLoading ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
            {!imageLoading && image && (
              <motion.img
                src={image}
                alt={portfolioItem.title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
              />
            )}
          </div>
        </Link>

        {/* Action buttons */}
        <motion.div
          className="absolute top-4 right-4 flex flex-col gap-2 z-20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {portfolioItem.github && (
            <motion.a
              href={portfolioItem.github.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: colors.surface }}
              className="p-2 rounded-lg shadow-lg backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Github style={{ color: colors.text }} className="w-4 h-4" />
            </motion.a>
          )}
          {portfolioItem.liveSite && (
            <motion.a
              href={portfolioItem.liveSite.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: colors.surface }}
              className="p-2 rounded-lg shadow-lg backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <ExternalLink style={{ color: colors.text }} className="w-4 h-4" />
            </motion.a>
          )}
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default PortfolioCard;
