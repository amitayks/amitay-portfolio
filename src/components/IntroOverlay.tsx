import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useIntro } from "@/contexts/IntroContext";

const OVERLAY_FADE_MS = 400;

export function IntroOverlay() {
  const { introPhase, advancePhase } = useIntro();
  const [mounted, setMounted] = useState(true);

  const shouldShow = introPhase !== "done";

  // Scroll lock
  useEffect(() => {
    if (!shouldShow) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [shouldShow]);

  // Unmount after fade-out completes
  useEffect(() => {
    if (introPhase === "overlay-fadeout") {
      const t = setTimeout(() => {
        setMounted(false);
        advancePhase(); // → final-flip
      }, OVERLAY_FADE_MS + 1000);
      return () => clearTimeout(t);
    }
  }, [introPhase, advancePhase]);

  if (!mounted || !shouldShow) return null;

  const isFadingOut = introPhase === "overlay-fadeout";

  return (
    <AnimatePresence>
      {mounted && (
        <motion.div
          className="fixed inset-0 z-[60]"
          style={{ background: "#000000" }}
          initial={{ opacity: 1 }}
          animate={{ opacity: isFadingOut ? 0 : 1 }}
          transition={{ duration: isFadingOut ? OVERLAY_FADE_MS / 1000 : 0 }}
        />
      )}
    </AnimatePresence>
  );
}
