import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface AnimatedTextProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: "fade" | "slide" | "scale";
  as?: "div" | "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const animationVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  slide: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.4 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
    transition: { duration: 0.35 },
  },
};

export const AnimatedText = ({
  children,
  className,
  style,
  variant = "slide",
  as = "div",
}: AnimatedTextProps) => {
  const { i18n } = useTranslation();
  const animation = animationVariants[variant];
  const MotionComponent = motion[as];

  // Track the direction for the current animation
  const [animatingDir, setAnimatingDir] = useState<"rtl" | "ltr">(
    i18n.language === "he" ? "rtl" : "ltr"
  );

  // Delay direction change until after the exit animation
  useEffect(() => {
    const newDir = i18n.language === "he" ? "rtl" : "ltr";

    // If direction is changing, wait for exit animation to complete
    if (newDir !== animatingDir) {
      const timeout = setTimeout(() => {
        setAnimatingDir(newDir);
      }, animation.transition.duration * 1000); // Convert to milliseconds

      return () => clearTimeout(timeout);
    }

    return undefined;
  }, [i18n.language, animatingDir, animation.transition.duration]);

  return (
    <AnimatePresence mode="wait">
      <MotionComponent
        key={i18n.language}
        initial={animation.initial}
        animate={animation.animate}
        exit={animation.exit}
        transition={animation.transition}
        className={className}
        style={{ ...style, direction: animatingDir }}
      >
        {children}
      </MotionComponent>
    </AnimatePresence>
  );
};
