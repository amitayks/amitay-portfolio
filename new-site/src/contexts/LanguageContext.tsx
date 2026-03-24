import { createContext, useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import type { Language } from "@/types/content";

type TransitionPhase = "idle" | "out" | "in";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  dir: "ltr" | "rtl";
  isTransitioning: boolean;
  transitionPhase: TransitionPhase;
}

export const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  dir: "ltr",
  isTransitioning: false,
  transitionPhase: "idle",
});

const STORAGE_KEY = "portfolio-lang";
const DISSOLVE_MS = 400;
const ASSEMBLE_MS = 450;

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "he" ? "he" : "en";
  });
  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const dir = lang === "he" ? "rtl" : "ltr";
  const isTransitioning = transitionPhase !== "idle";

  const setLang = useCallback(
    (newLang: Language) => {
      if (newLang === lang || isTransitioning) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setLangState(newLang);
        localStorage.setItem(STORAGE_KEY, newLang);
        return;
      }

      // Phase 1: Dissolve out
      setTransitionPhase("out");

      timerRef.current = setTimeout(() => {
        // Phase 2: Swap language
        // Both languages are always loaded by useSiteText, so the swap is instant
        setLangState(newLang);
        localStorage.setItem(STORAGE_KEY, newLang);

        // Phase 3: Double rAF so React re-renders before unblur
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTransitionPhase("in");

            timerRef.current = setTimeout(() => {
              // Phase 4: Done
              setTransitionPhase("idle");
            }, ASSEMBLE_MS);
          });
        });
      }, DISSOLVE_MS);
    },
    [lang, isTransitioning]
  );

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <LanguageContext.Provider
      value={{ lang, setLang, dir, isTransitioning, transitionPhase }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
