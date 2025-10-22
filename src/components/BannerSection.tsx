import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useSiteImage } from "../hooks/useSiteImages";
import { PERSONAL_INFO, SOCIAL_LINKS } from "../utils/constants";
import SocialLinksComponent from "./SocialLinksComponent";

interface BannerSectionProps {
  imageKey?: string;
  showAvailabilityBadge?: boolean;
}

function BannerSection({ imageKey, showAvailabilityBadge = true }: BannerSectionProps = {}) {
  const { image, isLoading: isLoadingImage } = useSiteImage(
    imageKey || PERSONAL_INFO.profileImage2
  );
  const colors = useTheme();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left px-6">
            {showAvailabilityBadge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge
                  variant="secondary"
                  style={{ backgroundColor: colors.surfaceSecondary, color: colors.accent }}
                  className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6"
                >
                  <motion.span
                    style={{ backgroundColor: colors.success }}
                    className="w-2 h-2 rounded-full mr-2"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }}
                  />
                  Available for new projects
                </Badge>
              </motion.div>
            )}

            <motion.h1
              style={{ color: colors.primary }}
              className="text-4xl lg:text-4xl font-bold mb-2 leading-tight"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Hi, I'm{" "}
            </motion.h1>

            <motion.h1
              style={{ color: colors.primary }}
              className="text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <span
                className="bg-gradient-to-r bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, ${colors.accent}, ${colors.info})`,
                }}
              >
                {PERSONAL_INFO.name}
              </span>
            </motion.h1>

            <motion.p
              style={{ color: colors.textSecondary }}
              className="text-xl lg:text-2xl font-medium mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {PERSONAL_INFO.title}
            </motion.p>

            <motion.p
              style={{ color: colors.textTertiary }}
              className="text-lg leading-relaxed max-w-2xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {PERSONAL_INFO.bio}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  size="lg"
                  style={{ backgroundColor: colors.accent, color: colors.textInverse }}
                  className="shadow-lg hover:shadow-xl group"
                >
                  <Link to="/portfolio">
                    View My Work
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  style={{
                    backgroundColor: colors.surface,
                    color: colors.primary,
                    borderColor: colors.border,
                  }}
                  className="shadow-lg hover:shadow-xl"
                >
                  <Link to="/contact">Get In Touch</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Image Section */}
          <motion.div
            className="relative flex items-center justify-end"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
          >
            <div className="relative w-80 h-80 lg:w-96 lg:h-96">
              {/* Animated background gradients */}
              <motion.div
                style={{
                  background: `linear-gradient(to top right, ${colors.accent}, ${colors.info})`,
                  opacity: 0.3,
                }}
                className="absolute inset-0 rounded-3xl"
                animate={{
                  rotate: [6, 8, 6],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
              />
              <motion.div
                style={{
                  background: `linear-gradient(to bottom right, ${colors.info}, ${colors.success})`,
                  opacity: 0.3,
                }}
                className="absolute inset-0 rounded-3xl"
                animate={{
                  rotate: [-6, -8, -6],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  delay: 0.5,
                }}
              />

              <AnimatePresence>
                {(isLoadingImage || !imageLoaded) && (
                  <motion.div
                    key="skeleton"
                    style={{ backgroundColor: colors.surfaceSecondary }}
                    className="absolute inset-0 w-full h-full rounded-3xl shadow-2xl animate-pulse flex items-center justify-center z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="w-24 h-24 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.surface }}
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "loop",
                      }}
                    >
                      <svg
                        className="w-12 h-12"
                        style={{ color: colors.textTertiary }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isLoadingImage && (
                <motion.img
                  src={image}
                  alt={PERSONAL_INFO.name}
                  className="absolute inset-0 w-full h-full object-cover rounded-3xl shadow-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: imageLoaded ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  onLoad={() => setImageLoaded(true)}
                />
              )}
            </div>

            {/* Social Links */}
            <motion.div
              className="absolute -right-[-3rem] top-1/5 -translate-y-1/2 md:-right-[-10rem] lg:-left-[25rem]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="md:hidden">
                <SocialLinksComponent
                  socialLinks={SOCIAL_LINKS}
                  variant="filled"
                  orientation="vertical"
                  size="md"
                  className="flex flex-col gap-2"
                />
              </div>

              <div className="hidden md:block">
                <SocialLinksComponent
                  socialLinks={SOCIAL_LINKS}
                  variant="filled"
                  orientation="vertical"
                  size="lg"
                  className="flex flex-col gap-4"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default BannerSection;
