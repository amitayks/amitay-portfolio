import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";
import { usePortfolioImage } from "../hooks/usePortfolioImage";
import { queryKeys } from "../lib/queryKeys";
import { getPortfolioImage } from "../services/apiImages";
import { getPortfolioById } from "../services/apiPortfolio";
import { PortfolioItem } from "../types/portfolio";

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
      animate={{
        y: [-12, -6, -12],
        scale: [1.02, 1.01, 1.02],
        rotateX: [2, 1, 2],
        rotateZ: [0.5, -0.5, 0.5],
      }}
      transition={{
        y: {
          duration: 2.5,
          ease: [0.45, 0.05, 0.55, 0.95],
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        },
        scale: {
          duration: 3,
          ease: [0.45, 0.05, 0.55, 0.95],
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        },
        rotateX: {
          duration: 3.5,
          ease: [0.45, 0.05, 0.55, 0.95],
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        },
        rotateZ: {
          duration: 4,
          ease: [0.45, 0.05, 0.55, 0.95],
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        },
      }}
      whileHover={{
        y: 0,
        scale: 1,
        rotateX: 0,
        rotateZ: 0,
        transition: {
          duration: 0.6,
          ease: [0.34, 1.56, 0.64, 1],
        },
      }}
      onMouseEnter={handleMouseEnter}
      className={className}
      style={{ perspective: "1000px" }}
    >
      <Card
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          transformStyle: "preserve-3d",
        }}
        className="group relative overflow-hidden border hover:shadow-2xl transition-shadow duration-700"
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
              <Github style={{ color: colors.text }} className="w-6 h-6" />
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
              <ExternalLink style={{ color: colors.text }} className="w-6 h-6" />
            </motion.a>
          )}
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default PortfolioCard;
