import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
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
          {portfolioItem.githubLink && (
            <motion.a
              href={portfolioItem.githubLink}
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
          {portfolioItem.liveLink && (
            <motion.a
              href={portfolioItem.liveLink}
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
