import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useIntro } from "@/contexts/IntroContext";
import { AnimatedLogo } from "@/components/AnimatedLogo";
import { useSiteImage } from "@/hooks/useSiteImage";

// --- Constants ---

const PROFILE_IMAGE_KEY = "profile-image-banner-3.jpg";

// Intro card dimensions
const CARD_WIDTH_DESKTOP = 240;
const CARD_WIDTH_MOBILE = 180;
const CARD_ASPECT = 1.5; // 2:3 → height = width * 1.5

// Navbar icon
const NAVBAR_SIZE = 48;

// Flight animation (shared by intro flight + expand/dismiss)
const FLIGHT_DURATION = 1.5;
const FLIGHT_ROTATIONS = 1;
const FLIGHT_ARC_PEAK = 20;

// Landing
const LANDING_HOLD_MS = 400;
const FINAL_FLIP_DURATION = 0.5;

// Hover
const HOVER_FLIP_DURATION = 0.6;

export function FlipCard() {
  const { introPhase, isIntroComplete, navbarIconRef, advancePhase } =
    useIntro();
  const reducedMotion = useReducedMotion();

  // --- Profile image preloading ---
  const { data: profileUrl } = useSiteImage(PROFILE_IMAGE_KEY);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!profileUrl) return;
    const img = new Image();
    img.src = profileUrl;
    img.onload = () => setImageLoaded(true);
  }, [profileUrl]);

  // --- Viewport / responsive ---
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 640
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const introCardWidth = isMobile ? CARD_WIDTH_MOBILE : CARD_WIDTH_DESKTOP;
  const introCardHeight = introCardWidth * CARD_ASPECT;
  const introLogoSize = Math.round(introCardWidth / 3);

  // --- Navbar position tracking ---
  const [navbarRect, setNavbarRect] = useState<DOMRect | null>(null);

  const measureNavbar = useCallback(() => {
    const el = navbarIconRef.current;
    if (el) setNavbarRect(el.getBoundingClientRect());
  }, [navbarIconRef]);

  useEffect(() => {
    if (!isIntroComplete) return;
    measureNavbar();
    window.addEventListener("resize", measureNavbar);
    return () => window.removeEventListener("resize", measureNavbar);
  }, [isIntroComplete, measureNavbar]);

  // Measure at flight start
  useEffect(() => {
    if (introPhase === "flight") measureNavbar();
  }, [introPhase, measureNavbar]);

  // --- Interaction state ---
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // Escape key to dismiss
  useEffect(() => {
    if (!isExpanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isExpanded]);

  // --- Phase-driven timers ---
  useEffect(() => {
    if (introPhase !== "logo-assembly") return;
    const t = setTimeout(advancePhase, 6 * 70 + 500);
    return () => clearTimeout(t);
  }, [introPhase, advancePhase]);

  // Breath pause — moment to appreciate the logo before the flight
  useEffect(() => {
    if (introPhase !== "breath") return;
    const t = setTimeout(() => {
      // Strong haptic right before the flip launches
      navigator.vibrate?.([40, 20, 60]);
      advancePhase();
    }, 400);
    return () => clearTimeout(t);
  }, [introPhase, advancePhase]);

  useEffect(() => {
    if (introPhase !== "landing") return;
    const t = setTimeout(advancePhase, LANDING_HOLD_MS);
    return () => clearTimeout(t);
  }, [introPhase, advancePhase]);

  // Guard against double-advance from onAnimationComplete
  const lastAdvancedPhase = useRef("");

  const safeAdvance = useCallback(() => {
    if (lastAdvancedPhase.current === introPhase) return;
    lastAdvancedPhase.current = introPhase;
    advancePhase();
  }, [introPhase, advancePhase]);

  // --- Compute viewport center & expanded size ---
  const viewportCenter = useMemo(
    () => ({
      x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
      y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [introPhase, isExpanded]
  );

  const expandedSize =
    typeof window !== "undefined"
      ? Math.min(window.innerWidth * 0.8, 400)
      : 400;

  // --- Rotation accumulator ---
  // Rotations always go forward to avoid backward spinning.
  // Start from the intro's final rotation so there's no jump at "done".
  const [rotationBase, setRotationBase] = useState(0);
  const introSynced = useRef(false);
  const prevExpanded = useRef(false);

  // Sync rotationBase to intro's final value when intro completes
  useEffect(() => {
    if (isIntroComplete && !introSynced.current) {
      introSynced.current = true;
      setRotationBase((FLIGHT_ROTATIONS + 1) * 360);
    }
  }, [isIntroComplete]);

  useEffect(() => {
    if (!isIntroComplete) return;
    if (isExpanded && !prevExpanded.current) {
      // Expanding: spin forward to land on profile (180° = back face)
      setRotationBase((b) => b + FLIGHT_ROTATIONS * 360 + 180);
    } else if (!isExpanded && prevExpanded.current) {
      // Dismissing: spin forward to land on logo (another 180° forward = 360° = front)
      setRotationBase((b) => b + FLIGHT_ROTATIONS * 360 + 180);
    }
    prevExpanded.current = isExpanded;
  }, [isExpanded, isIntroComplete]);

  // --- Determine current animation state ---

  const isCentered =
    introPhase === "card-fadein" ||
    introPhase === "logo-assembly" ||
    introPhase === "breath";
  const isFlying = introPhase === "flight";

  // Rotation target (Y-axis — right-to-left flip like a coin)
  let targetRotateY = 0;
  if (introPhase === "flight") {
    targetRotateY = FLIGHT_ROTATIONS * 360 + 180;
  } else if (introPhase === "landing" || introPhase === "overlay-fadeout") {
    // Hold on profile face while overlay fades
    targetRotateY = FLIGHT_ROTATIONS * 360 + 180;
  } else if (introPhase === "final-flip") {
    targetRotateY = (FLIGHT_ROTATIONS + 1) * 360;
  } else if (isIntroComplete) {
    // Post-intro: use accumulated rotation base + hover offset
    const hoverOffset = isHovered && !isTouchDevice && !isExpanded ? 180 : 0;
    targetRotateY = rotationBase + hoverOffset;
  }

  // Position & size target
  let targetX: number;
  let targetY: number;
  let targetWidth: number;
  let targetHeight: number;
  let targetBorderRadius: number;

  if (isExpanded && isIntroComplete) {
    targetX = viewportCenter.x - expandedSize / 2;
    targetY = viewportCenter.y - expandedSize / 2;
    targetWidth = expandedSize;
    targetHeight = expandedSize;
    targetBorderRadius = 24;
  } else if (isCentered) {
    targetX = viewportCenter.x - introCardWidth / 2;
    targetY = viewportCenter.y - introCardHeight / 2;
    targetWidth = introCardWidth;
    targetHeight = introCardHeight;
    targetBorderRadius = 16;
  } else if (navbarRect) {
    targetX = navbarRect.left;
    targetY = navbarRect.top;
    targetWidth = NAVBAR_SIZE;
    targetHeight = NAVBAR_SIZE;
    targetBorderRadius = 9999;
  } else {
    targetX = 16;
    targetY = 16;
    targetWidth = NAVBAR_SIZE;
    targetHeight = NAVBAR_SIZE;
    targetBorderRadius = 9999;
  }

  // --- Transition per phase ---
  let transition: Record<string, unknown>;

  if (reducedMotion) {
    transition = { duration: 0 };
  } else if (introPhase === "card-fadein") {
    transition = { duration: 0.45, ease: [0.16, 1, 0.3, 1] };
  } else if (isFlying) {
    transition = {
      duration: FLIGHT_DURATION,
      ease: [0.4, 0, 0.2, 1],
      rotateY: { duration: FLIGHT_DURATION, ease: [0.2, 0.8, 0.3, 1] },
      y: { duration: FLIGHT_DURATION, times: [0, 0.3, 1], ease: [0.4, 0, 0.2, 1] },
    };
  } else if (introPhase === "final-flip") {
    transition = { duration: FINAL_FLIP_DURATION, ease: [0.4, 0, 0.6, 1] };
  } else if (isExpanded || prevExpanded.current) {
    // Expand or dismiss — same motion as intro flight
    transition = {
      duration: FLIGHT_DURATION,
      ease: [0.4, 0, 0.2, 1],
      rotateY: { duration: FLIGHT_DURATION, ease: [0.2, 0.8, 0.3, 1] },
      y: { duration: FLIGHT_DURATION, times: [0, 0.3, 1], ease: [0.4, 0, 0.2, 1] },
    };
  } else if (isIntroComplete) {
    // Hover flip
    transition = { duration: HOVER_FLIP_DURATION, ease: [0.4, 0, 0.6, 1] };
  } else {
    transition = { duration: 0.3, ease: [0.16, 1, 0.3, 1] };
  }

  // Y keyframes for flight arc — used by intro flight, expand, and dismiss
  const arcMidY = navbarRect
    ? Math.max(viewportCenter.y, navbarRect.top) + FLIGHT_ARC_PEAK
    : viewportCenter.y + FLIGHT_ARC_PEAK;

  let animateY: number | number[];
  if (isFlying && navbarRect) {
    // Intro: center → arc peak → navbar
    animateY = [
      viewportCenter.y - introCardHeight / 2,
      arcMidY,
      navbarRect.top,
    ];
  } else if (isExpanded && isIntroComplete && navbarRect) {
    // Expand: navbar → arc peak → center
    animateY = [
      navbarRect.top,
      arcMidY,
      viewportCenter.y - expandedSize / 2,
    ];
  } else if (!isExpanded && prevExpanded.current && navbarRect) {
    // Dismiss: center → arc peak → navbar
    animateY = [
      viewportCenter.y - expandedSize / 2,
      arcMidY,
      navbarRect.top,
    ];
  } else {
    animateY = targetY;
  }

  // --- Handlers ---
  const handleClick = () => {
    if (!isIntroComplete) return;
    setIsExpanded((prev) => !prev);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    if (!isIntroComplete || isTouchDevice || isExpanded) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!isIntroComplete || isTouchDevice || isExpanded) return;
    setIsHovered(false);
  };

  // Determine the logo size based on current state
  // Switch to small once the card is at navbar size (landing onward)
  const atNavbarSize =
    introPhase === "landing" ||
    introPhase === "final-flip" ||
    introPhase === "overlay-fadeout" ||
    isIntroComplete;
  const currentLogoSize =
    atNavbarSize && !isExpanded ? 16 : introLogoSize;

  return (
    <>
      {/* Backdrop for expanded state */}
      {isExpanded && (
        <motion.div
          className="fixed inset-0 z-[59] bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Fixed layer — covers full viewport, no pointer events */}
      <div
        className="fixed z-[61] pointer-events-none"
        style={{ inset: 0 }}
      >
        {/* Animated card — perspective on the card itself for symmetric flips */}
        <motion.div
          className="absolute pointer-events-auto cursor-pointer"
          style={{ transformStyle: "preserve-3d", transformPerspective: 1200 }}
          initial={
            reducedMotion
              ? {
                  x: navbarRect?.left ?? 16,
                  y: navbarRect?.top ?? 16,
                  width: NAVBAR_SIZE,
                  height: NAVBAR_SIZE,
                  borderRadius: 9999,
                  rotateY: 0,
                  opacity: 1,
                }
              : {
                  x: viewportCenter.x - introCardWidth / 2,
                  y: viewportCenter.y - introCardHeight / 2,
                  width: introCardWidth,
                  height: introCardHeight,
                  borderRadius: 16,
                  rotateY: 0,
                  opacity: 0,
                  scale: 0.95,
                }
          }
          animate={{
            x: targetX,
            y: animateY,
            width: targetWidth,
            height: targetHeight,
            borderRadius: targetBorderRadius,
            rotateY: targetRotateY,
            opacity: 1,
            scale: 1,
          }}
          transition={transition}
          onAnimationComplete={() => {
            if (
              introPhase === "card-fadein" ||
              introPhase === "flight" ||
              introPhase === "final-flip"
            ) {
              safeAdvance();
            }
          }}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          role="button"
          tabIndex={isIntroComplete ? 0 : -1}
          aria-label="View profile photo"
          onKeyDown={(e) => {
            if (isIntroComplete && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          {/* Front face — Logo + Shader */}
          <div
            className="absolute inset-0 liquid-glass-strong rounded-[inherit] flex items-center justify-center !overflow-visible"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {/* Don't mount AnimatedLogo during card-fadein — the glass card fades in empty,
                then AnimatedLogo mounts fresh at logo-assembly start with animate=true */}
            {introPhase !== "card-fadein" && (
              <AnimatedLogo
                size={currentLogoSize}
                animate={introPhase === "logo-assembly"}
              />
            )}
          </div>

          {/* Back face — Profile photo */}
          <div
            className="absolute inset-0 liquid-glass-strong rounded-[inherit] overflow-hidden"

            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {profileUrl && imageLoaded ? (
              <img
                src={profileUrl}
                alt="Amitay Keisar"
                className="w-full h-full"
                style={{
                  objectFit: isExpanded ? "contain" : "cover",
                  objectPosition: "center",
                }}
              />
            ) : (
              <div className="w-full h-full liquid-glass" />
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
