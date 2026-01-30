import { useQueryClient } from "@tanstack/react-query";
import { motion, useAnimate } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { useEffect, useRef } from "react";
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
  const [scope, animate] = useAnimate();
  const animationRef = useRef<AbortController | null>(null);

  // Sequential wave effect - each card responds slightly after the previous
  const staggerDelay = _index * 0.08; // 80ms between cards creates a gentle wave

  // Prefetch portfolio item details on hover for instant navigation
  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.portfolioItem(portfolioItem.SKU),
      queryFn: () => getPortfolioById(portfolioItem.SKU),
      staleTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    if (portfolioItem.image) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.portfolioImage(portfolioItem.image),
        queryFn: () => getPortfolioImage(portfolioItem.image),
        staleTime: 1000 * 60 * 60 * 24 * 14, // 14 days
      });
    }
  };

  // Spring-based continuous animation - smoothly transitions when wind state changes
  useEffect(() => {
    // Cancel previous animation
    if (animationRef.current) {
      animationRef.current.abort();
    }

    const controller = new AbortController();
    animationRef.current = controller;

    const runAnimation = async () => {
      // Springs only support 2 keyframes, so we create a sequence
      // Animate down/right, then up/left, continuously for organic motion
      const transitionConfig = isWindActive
        ? {
            type: "spring" as const,
            stiffness: 60, // More energetic for wind
            damping: 15,
            mass: 1,
            delay: staggerDelay,
          }
        : {
            type: "spring" as const,
            stiffness: 100, // Gentle and calm
            damping: 25,
            mass: 1,
          };

      try {
        while (!controller.signal.aborted) {
          // Phase 1: Move to peak position
          await animate(
            scope.current,
            {
              y: isWindActive ? -16 : -3,
              x: isWindActive ? 12 : 0,
              scale: isWindActive ? 1.02 : 1.005,
              rotateX: isWindActive ? 2.2 : 0.5,
              rotateZ: isWindActive ? 1.8 : -0.3,
            },
            transitionConfig
          );

          // Phase 2: Return to base position
          await animate(
            scope.current,
            {
              y: isWindActive ? -10 : -6,
              x: 0,
              scale: 1.01,
              rotateX: 1,
              rotateZ: 0.3,
            },
            transitionConfig
          );
        }
      } catch (error) {
        // Animation was cancelled, which is expected
      }
    };

    runAnimation();

    return () => {
      controller.abort();
      animationRef.current = null;
    };
  }, [isWindActive, animate, staggerDelay]);

  return (
    <motion.div
      ref={scope}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
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
              <Github style={{ color: colors.text }} className="w-5 h-5" />
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
              style={{ backgroundColor: colors.surface }}
              className="p-2 rounded-lg shadow-lg backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <ExternalLink style={{ color: colors.text }} className="w-5 h-5" />
            </motion.a>
          )}
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default PortfolioCard;
