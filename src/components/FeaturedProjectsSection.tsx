import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import useFeaturdItems from "../hooks/useFeaturedItems";
import PortfolioCard from "./PortfolioCard";

function FeaturedProjectsSection() {
  const { portfolioItems: featuredProjects } = useFeaturdItems(true);
  const colors = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 style={{ color: colors.primary }} className="text-3xl lg:text-4xl font-bold mb-4">
            {"< KEISAR CLUB />"}
          </h2>
        </motion.div>

        {featuredProjects.length > 0 ? (
          <>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
              dir="rtl"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {featuredProjects.map((featuredItem, i) => {
                // if (i >= 6) return null;
                return (
                  <PortfolioCard
                    key={featuredItem.id}
                    portfolioItem={featuredItem}
                    // className={`${i >= 4 ? "hidden md:block" : ""}`}
                  />
                );
              })}
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  size="lg"
                  style={{ backgroundColor: colors.accent, color: colors.textInverse }}
                  className="shadow-lg hover:shadow-xl group"
                >
                  <Link to="/portfolio">
                    View All Projects
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              style={{ backgroundColor: colors.surfaceSecondary }}
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            >
              <ExternalLink style={{ color: colors.textTertiary }} className="w-12 h-12" />
            </motion.div>
            <h3 style={{ color: colors.primary }} className="text-xl font-semibold mb-3">
              Projects Coming Soon
            </h3>
            <p style={{ color: colors.textSecondary }} className="mb-6">
              I'm currently working on some exciting projects. Check back soon!
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProjectsSection;
