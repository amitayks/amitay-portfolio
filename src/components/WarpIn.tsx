import { motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";

interface WarpInProps {
  children: ReactNode;
  /** Gate the entrance (e.g. Hero's canAnimate / Navbar's showNavContent). */
  show: boolean;
  /** Stagger offset in seconds. */
  delay?: number;
  /** Entrance duration in seconds. */
  duration?: number;
  /** Initial scale — smaller reads as further away in the starfield. */
  fromScale?: number;
  className?: string;
}

/**
 * "Warp in toward you" entrance. The element starts tiny and tilted back —
 * emerging from deep space near the starfield's vanishing point — then flies
 * forward, un-tilts, and settles flat and readable. Its outward growth matches
 * the warp stars streaming toward the viewer in the background.
 *
 * Once the entrance finishes it renders a plain <div> with NO transform, because
 * an ancestor transform breaks `backdrop-filter` — which would otherwise leave
 * any frosted-glass child (the navbar pill, glass buttons) permanently
 * see-through. Reduced motion skips the entrance entirely.
 */
export function WarpIn({
  children,
  show,
  delay = 0,
  duration = 1.0,
  fromScale = 0.25,
  className,
}: WarpInProps) {
  const reducedMotion = useReducedMotion();
  const [settled, setSettled] = useState(false);

  // Plain, transform-free wrapper: reduced motion, or once the entrance is done.
  if (reducedMotion || settled) {
    return <div className={className}>{children}</div>;
  }

  const hidden = {
    opacity: 0,
    scale: fromScale,
    rotateX: 35,
    filter: "blur(6px)",
  };
  const shown = { opacity: 1, scale: 1, rotateX: 0, filter: "blur(0px)" };

  return (
    <motion.div
      className={className}
      style={{ transformPerspective: 800, transformOrigin: "center center" }}
      initial={hidden}
      animate={show ? shown : hidden}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => {
        // Drop the transform once shown so backdrop-filter (frost) works again.
        if (show) setSettled(true);
      }}
    >
      {children}
    </motion.div>
  );
}
