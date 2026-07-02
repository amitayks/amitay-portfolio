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
        advancePhase(); // → done
      }, OVERLAY_FADE_MS + 600);
      return () => clearTimeout(t);
    }
  }, [introPhase, advancePhase]);

  if (!mounted || !shouldShow) return null;

  // Reveal the warp starfield the instant the card starts its flight (slip + flip),
  // not after it lands. The warp is already running at full speed behind the overlay
  // (HomePage mounts it at "breath"; WarpStarfield holds MAX_WARP through "landing"),
  // so fading the overlay here exposes the extra max-warp travel across flight +
  // landing without moving the deceleration timeline. Phase progression and the
  // overlay's unmount/advance stay keyed to "overlay-fadeout" (above). The navbar
  // and hero warp in from "landing" (see Navbar/Hero) — a quick entrance just
  // after the spinning logo touches down, while the warp stars still stream.
  const isRevealed =
    introPhase === "flight" ||
    introPhase === "landing" ||
    introPhase === "overlay-fadeout";

  return (
    <AnimatePresence>
      {mounted && (
        <motion.div
          className="fixed inset-0 z-[60]"
          style={{ background: "#000000" }}
          initial={{ opacity: 1 }}
          animate={{ opacity: isRevealed ? 0 : 1 }}
          transition={{ duration: isRevealed ? OVERLAY_FADE_MS / 1000 : 0 }}
        />
      )}
    </AnimatePresence>
  );
}
