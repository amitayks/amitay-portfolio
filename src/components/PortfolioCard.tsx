import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useWind } from "@/contexts";
import { useTheme } from "@/hooks/useTheme";
import { usePortfolioImage } from "../hooks/usePortfolioImage";
import { queryKeys } from "../lib/queryKeys";
import { getPortfolioImage } from "../services/apiImages";
import { getPortfolioById } from "../services/apiPortfolio";
import { PortfolioItem } from "../types/portfolio";

const PortfolioCard = ({
  portfolioItem,
  className,
  index: _index = 0,
}: {
  portfolioItem: PortfolioItem;
  className?: string;
  index?: number;
}) => {
  const { image, isLoading: imageLoading } = usePortfolioImage(portfolioItem.image);
  const { colors } = useTheme();
  const queryClient = useQueryClient();
  const { isWindActive } = useWind();

  // Sequential wave effect - each card responds slightly after the previous, like wind through grass
  const staggerDelay = _index * 0.08; // 80ms between cards creates a gentle wave

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

  // Animation variants - gentle and organic, like leaves on a branch
  // IMPORTANT: All animations must start and end at the SAME values to avoid jumps
  const calmFloating = {
    y: [-8, -4, -8], // Starts at -8, loops back to -8
    x: [0, 0, 0], // No horizontal drift during calm
    scale: [1.01, 1.005, 1.01], // Starts at 1.01, loops back to 1.01
    rotateX: [1, 0.5, 1], // Starts at 1, loops back to 1
    rotateZ: [0.3, -0.3, 0.3], // Starts at 0.3, loops back to 0.3
  };

  const gentleBreeze = {
    // Start at calm position [-8, 0, 1.01, 1, 0.3] and return to it at the end
    y: [-8, -12, -15, -10, -8], // Now ends at -8 (matches calm start)
    x: [0, 8, 12, 6, 0], // Ends at 0 (matches calm)
    scale: [1.01, 1.015, 1.02, 1.012, 1.01], // Ends at 1.01 (matches calm start)
    rotateX: [1, 2, 2.5, 1.5, 1], // Ends at 1 (matches calm start)
    rotateZ: [0.3, 1.5, 2, 1, 0.3], // Ends at 0.3 (matches calm start)
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      animate={isWindActive ? gentleBreeze : calmFloating}
      transition={
        isWindActive
          ? {
              // Main gentle breeze motion with sequential wave
              duration: 2.0, // Smooth, relaxed movement
              delay: staggerDelay, // Sequential wave effect
              ease: [0.25, 0.46, 0.45, 0.94], // EaseOutQuad - natural deceleration
            }
          : {
              // Calm floating - very smooth and peaceful infinite loop
              y: {
                duration: 2.5,
                ease: [0.45, 0.05, 0.55, 0.95], // Smooth sine wave
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              },
              x: {
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
            }
      }
      whileHover={{
        y: 0,
        x: 0,
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
