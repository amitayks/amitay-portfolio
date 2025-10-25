import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

interface LanguageSwitcherProps {
  variant?: "default" | "mobile";
}

const LanguageSwitcher = ({ variant = "default" }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const { colors } = useTheme();
  const currentLang = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLang === "en" ? "he" : "en";
    i18n.changeLanguage(newLang);
  };

  // Update document language attribute (but not dir, that's handled per content area)
  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  if (variant === "mobile") {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={toggleLanguage}
          variant="ghost"
          className="flex items-center px-6 py-3 rounded-lg transition-all duration-200"
          style={{
            // backgroundColor: colors.surface,
            color: colors.textSecondary,
          }}
        >
          <Globe className="h-5 w-5" />
          {/* <span className="font-medium">{currentLang === "en" ? "עב" : "EN"}</span> */}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        onClick={toggleLanguage}
        variant="ghost"
        size="sm"
        style={{
          // backgroundColor: colors.surfaceSecondary,
          color: colors.textSecondary,
        }}
        className="relative overflow-hidden font-medium"
      >
        <motion.div
          className="flex items-center gap-2"
          initial={false}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Globe className="h-4 w-4" />
          {/* <span className="text-sm font-semibold">{currentLang === "en" ? "EN" : "עב"}</span> */}
        </motion.div>
      </Button>
    </motion.div>
  );
};

export default LanguageSwitcher;
