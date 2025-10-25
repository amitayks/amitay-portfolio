import { motion } from "framer-motion";
import { AnimatedText } from "@/components/AnimatedText";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/useTheme";
import { PERSONAL_INFO, SOCIAL_LINKS } from "../utils/constants";
import Logo from "./Logo";
import SocialLinksComponent from "./SocialLinksComponent";

const Footer = () => {
  const { colors } = useTheme();

  return (
    <footer
      style={{
        backgroundColor: "transparent",
      }}
      className="pb-5 pt-20 flex items-center justify-center"
    >
      <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex items-center justify-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <Logo width={32} height={32} fill={colors.primary} style={{ transform: "scaleX(-1)" }} />
          {/* </motion.div> */}
          <motion.span
            className="ml-3 text-xl font-bold"
            style={{ color: colors.primary }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {PERSONAL_INFO.name}
          </motion.span>
        </motion.div>

        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <SocialLinksComponent socialLinks={SOCIAL_LINKS} variant="outline" />
        </motion.div>

        <motion.div
          className="mb-4 max-w-md leading-relaxed text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <AnimatedText as="p" style={{ color: colors.textSecondary }} variant="fade">
            {PERSONAL_INFO.tagline}
          </AnimatedText>
        </motion.div>

        <Separator className="mb-4" style={{ backgroundColor: colors.border }} />

        <motion.div
          className="w-full flex justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <AnimatedText as="p" style={{ color: colors.textSecondary }} className="text-sm" variant="fade">
            &copy; {new Date().getFullYear()} {PERSONAL_INFO.name}. All rights reserved.
          </AnimatedText>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
