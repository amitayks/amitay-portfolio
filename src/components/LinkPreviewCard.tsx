import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface LinkPreviewCardProps {
  title: string;
  subtitle: string;
  previewImage?: {
    dark: string;
    light: string;
  };
  link: string;
  type: "github" | "live";
  index?: number;
}

const LinkPreviewCard = ({ title, subtitle, previewImage, link, type, index = 0 }: LinkPreviewCardProps) => {
  const { colors, isDark } = useTheme();

  const handleClick = () => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const Icon = type === "github" ? Github : ExternalLink;
  const imageUrl = previewImage ? (isDark ? previewImage.dark : previewImage.light) : null;

  return (
    <motion.div
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
      role="button"
      tabIndex={0}
      style={{
        borderColor: colors.border,
      }}
      className="group cursor-pointer rounded-xl border overflow-hidden relative h-[420px] md:h-[400px] lg:h-[550px]"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        y: -8,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Full Image */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${title} preview`}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: colors.surface }}
          >
            <Icon
              className="w-24 h-24 opacity-20 transition-all duration-500 group-hover:scale-110"
              style={{ color: colors.primary }}
            />
          </div>
        )}
      </div>

      {/* Blur overlay from bottom (40% height) - entire section fades together */}
      <div
        className="absolute inset-x-0 bottom-0 h-[40%] pointer-events-none transition-opacity duration-300 group-hover:opacity-0"
        style={{
          maskImage: "linear-gradient(to top, black 0%, black 40%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, black 40%, transparent 100%)",
        }}
      >
        {/* Blurred background layer */}
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        />

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.893) 10%, rgba(0, 0, 0, 0.466) 50%, transparent 100%)",
          }}
        />

        {/* Text content - positioned closer to bottom */}
        <div className="absolute inset-0 flex flex-col justify-end pb-6 px-6">
          <div className="flex items-center gap-3 mb-2">
            <Icon className="w-5 h-5 flex-shrink-0 text-white drop-shadow-lg" />
            <h3 className="text-lg font-semibold tracking-tight text-white drop-shadow-lg">
              {title}
            </h3>
          </div>
          <p className="text-sm font-medium truncate text-white/90 drop-shadow-lg">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default LinkPreviewCard;
