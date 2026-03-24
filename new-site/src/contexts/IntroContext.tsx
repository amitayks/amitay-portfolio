import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  "final-flip",
  "done",
];

const IntroContext = createContext<IntroContextType>({
  introPhase: "done",
  isIntroComplete: true,
  navbarIconRef: { current: null },
  advancePhase: () => {},
});

export function IntroProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const navbarIconRef = useRef<HTMLDivElement>(null);

  const [introPhase, setIntroPhase] = useState<IntroPhase>(() =>
    reducedMotion ? "done" : "card-fadein"
  );

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
      value={{ introPhase, isIntroComplete, navbarIconRef, advancePhase }}
    >
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  return useContext(IntroContext);
}
