import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { useReducedMotion } from "motion/react";

export type IntroPhase =
  | "card-fadein"
  | "logo-assembly"
  | "breath"
  | "flight"
  | "landing"
  | "final-flip"
  | "overlay-fadeout"
  | "done";

interface IntroContextType {
  introPhase: IntroPhase;
  isIntroComplete: boolean;
  /** True when the inline index.html skeleton painted the card and React handed
   *  off to it (so the card is already on screen and should not re-fade). */
  handedOff: boolean;
  navbarIconRef: RefObject<HTMLDivElement | null>;
  advancePhase: () => void;
}

const PHASE_ORDER: IntroPhase[] = [
  "card-fadein",
  "logo-assembly",
  "breath",
  "flight",
  "landing",
  "overlay-fadeout",
  "done",
];

const IntroContext = createContext<IntroContextType>({
  introPhase: "done",
  isIntroComplete: true,
  handedOff: false,
  navbarIconRef: { current: null },
  advancePhase: () => {},
});

export function IntroProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const navbarIconRef = useRef<HTMLDivElement>(null);

  // Did the inline index.html skeleton already paint the card? If so, hand off:
  // skip the empty card-fadein and assemble the logo immediately on a card that
  // is already on screen. (The node exists for reduced-motion users too — hidden
  // via CSS — but they go straight to "done", so this only affects the animated
  // path.) Captured once at first render, before the layout effect removes it.
  const [handedOff] = useState(
    () =>
      typeof document !== "undefined" &&
      !!document.getElementById("intro-skeleton")
  );

  const [introPhase, setIntroPhase] = useState<IntroPhase>(() =>
    reducedMotion ? "done" : handedOff ? "logo-assembly" : "card-fadein"
  );

  // Remove the inline skeleton before first paint so the React card replaces it
  // seamlessly — no flash, no double-card.
  useLayoutEffect(() => {
    document.getElementById("intro-skeleton")?.remove();
  }, []);

  // Skip intro immediately if reduced motion preference changes
  useEffect(() => {
    if (reducedMotion) {
      setIntroPhase("done");
    }
  }, [reducedMotion]);

  const advancePhase = useCallback(() => {
    setIntroPhase((current) => {
      const idx = PHASE_ORDER.indexOf(current);
      if (idx < 0 || idx >= PHASE_ORDER.length - 1) return current;
      return PHASE_ORDER[idx + 1];
    });
  }, []);

  const isIntroComplete = introPhase === "done";

  return (
    <IntroContext.Provider
      value={{ introPhase, isIntroComplete, handedOff, navbarIconRef, advancePhase }}
    >
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  return useContext(IntroContext);
}
