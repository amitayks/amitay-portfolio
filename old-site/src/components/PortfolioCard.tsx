import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useReducedMotion } from "@/hooks/useReducedMotion";
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
  const prefersReducedMotion = useReducedMotion();

  // Organic variation: each card gets slightly different timing based on index
  // This creates the "out of sync" floating effect like leaves on water
  const baseDuration = 5;
  const durationVariation = (_index % 5) * 0.4; // 0, 0.4, 0.8, 1.2, 1.6s variation
  const duration = baseDuration + durationVariation;

  // Stagger delay so cards don't all start at the same phase
  const delay = (_index * 1.3) % duration;

  // Subtle movement variation per card
  const yOffset = 3 + (_index % 3); // 3-5px range
  const xOffset = 1 + (_index % 2) * 0.5; // 1-1.5px range

  // Prefetch portfolio item details on hover for instant navigation
  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.portfolioItem(portfolioItem.SKU),
      queryFn: () => getPortfolioById(portfolioItem.SKU),
    });

    if (portfolioItem.image) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.portfolioImage(portfolioItem.image),
        queryFn: () => getPortfolioImage(portfolioItem.image),
        staleTime: 1000 * 60 * 60 * 24 * 14, // 14 days - prevent image flicker
      });
    }
  };

  // Floating animation config - only applied when reduced motion is not preferred
  const floatingAnimation = prefersReducedMotion
    ? { opacity: 1 }
    : {
        y: [-yOffset / 2, -yOffset, -yOffset / 2],
        x: [-xOffset / 2, xOffset / 2, -xOffset / 2],
        rotate: [-0.3, 0.3, -0.3],
        opacity: [1, 0.7, 1],
      };

  const floatingTransition = prefersReducedMotion
    ? {}
    : {
        duration,
        repeat: Infinity,
        repeatType: "mirror" as const,
        ease: "easeInOut",
        delay,
      };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={handleMouseEnter}
      className={className}
    >
      <motion.div
        animate={floatingAnimation}
        transition={floatingTransition}
      >
      <Card
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
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
                width={400}
                height={400}
                loading={_index < 4 ? "eager" : "lazy"}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: "easeOut" }}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
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
              aria-label={`View ${portfolioItem.title} on GitHub`}
              style={{ backgroundColor: colors.surface }}
              className="p-2 rounded-lg shadow-lg backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.1, rotate: 5 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Github style={{ color: colors.text }} className="w-5 h-5" aria-hidden="true" />
            </motion.a>
          )}
        </motion.div>
        <motion.div
          className="absolute bottom-4 left-4 flex flex-col gap-2 z-20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {portfolioItem.liveSite && (
            <motion.a
              href={portfolioItem.liveSite.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${portfolioItem.title} live site`}
              style={{ backgroundColor: colors.surface }}
              className="p-2 rounded-lg shadow-lg backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.1, rotate: -5 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <ExternalLink style={{ color: colors.text }} className="w-5 h-5" aria-hidden="true" />
            </motion.a>
          )}
        </motion.div>
      </Card>
      </motion.div>
    </motion.div>
  );
};

export default PortfolioCard;
