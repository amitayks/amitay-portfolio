import { motion } from "motion/react";
import { useLanguage } from "@/hooks/useLanguage";

interface LanguageTransitionProps {
  children: React.ReactNode;
  /** Render as inline span (for text) or block div (for containers) */
  inline?: boolean;
  /** Stagger delay in seconds — offsets the animation start */
  delay?: number;
  className?: string;
}

const variants = {
  idle: {
    filter: "blur(0px)",
    opacity: 1,
    y: 0,
  },
  out: {
    filter: "blur(10px)",
    opacity: 0,
    y: -5,
  },
  in: {
    filter: "blur(0px)",
    opacity: 1,
    y: 0,
  },
};

/**
 * Wraps translatable content with a blur dissolve/assemble animation
 * during language transitions. Use on individual text elements for precision.
 *
 * <LanguageTransition inline>
 *   {t("nav.home", "Home")}
 * </LanguageTransition>
 */
export function LanguageTransition({
  children,
  inline = false,
  delay = 0,
  className,
}: LanguageTransitionProps) {
  const { transitionPhase, dir } = useLanguage();

  const Tag = inline ? motion.span : motion.div;

  return (
    <Tag
      animate={transitionPhase}
      variants={variants}
      transition={{
        duration: transitionPhase === "out" ? 0.3 : 0.38,
        delay,
        ease:
          transitionPhase === "out"
            ? [0.4, 0, 1, 1]
            : [0.16, 1, 0.3, 1],
      }}
      dir={dir}
      className={className}
    >
      {children}
    </Tag>
  );
}
