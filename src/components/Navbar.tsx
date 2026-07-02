import { useEffect, useRef, useState } from "react";
import { useSiteText } from "@/hooks/useSiteText";
import { useLanguage } from "@/hooks/useLanguage";
import { useIntro } from "@/contexts/IntroContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { LanguageTransition } from "@/components/LanguageTransition";
import { WarpIn } from "@/components/WarpIn";

const NAV_ITEMS = [
  { id: "home", key: "nav.home", fallback: "Home" },
  { id: "work", key: "nav.work", fallback: "Work" },
  { id: "about", key: "nav.about", fallback: "About" },
  { id: "contact", key: "nav.contact", fallback: "Contact" },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function Navbar() {
  const { t } = useSiteText();
  const { lang } = useLanguage();
  const { navbarIconRef, isIntroComplete, introPhase } = useIntro();
  const [activeSection, setActiveSection] = useState("home");
  const navRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  // Warp the nav content in just after the spinning logo lands — a quick,
  // snappy entrance that flies in while the warp stars are still streaming.
  const showNavContent =
    isIntroComplete ||
    introPhase === "landing" ||
    introPhase === "overlay-fadeout" ||
    introPhase === "final-flip";

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    for (const section of sections) {
      if (section) observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  // Update indicator position when active section or language changes
  useEffect(() => {
    const update = () => {
      const nav = navRef.current;
      if (!nav) return;
      const activeBtn = nav.querySelector(`[data-section="${activeSection}"]`) as HTMLElement | null;
      if (!activeBtn) return;
      setIndicator({ left: activeBtn.offsetLeft, width: activeBtn.offsetWidth });
    };

    // rAF to ensure DOM has updated with new text sizes after lang change
    const id = requestAnimationFrame(update);

    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", update);
    };
  }, [activeSection, lang, showNavContent]);

  return (
    <nav
      className="fixed top-4 left-0 right-0 z-50 flex items-center justify-center px-4"
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-2 md:gap-4 w-full max-w-5xl">
        {/* Logo placeholder — FlipCard overlays this position */}
        <div
          ref={navbarIconRef}
          className="rounded-full w-12 h-12 flex-shrink-0"
        />

        {/* Nav links pill — warps in from the vanishing point toward the viewer */}
        <WarpIn show={showNavContent} fromScale={0.5} duration={0.6} className="flex-1">
          <div
            ref={navRef}
            className="liquid-glass-strong rounded-[20px] px-2 py-2.5 flex items-center justify-evenly w-full relative"
          >
            {/* Animated indicator */}
            <div
              className="absolute top-1.5 bottom-1.5 rounded-full bg-white/10 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ left: indicator.left, width: indicator.width }}
            />

            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                data-section={item.id}
                onClick={() => scrollTo(item.id)}
                className={`relative z-10 px-2.5 md:px-6 py-1.5 rounded-full text-xs md:text-sm font-bold font-heading italic transition-colors ${
                  activeSection === item.id
                    ? "text-white"
                    : "text-foreground/70 hover:text-foreground/90"
                }`}
              >
                <LanguageTransition inline>
                  {t(item.key, item.fallback)}
                </LanguageTransition>
              </button>
            ))}
          </div>
        </WarpIn>

        {/* Right side */}
        <WarpIn show={showNavContent} fromScale={0.5} duration={0.6} delay={0.1} className="flex-shrink-0">
          <div className="flex items-center gap-2">
            <LanguageToggle />
          </div>
        </WarpIn>
      </div>
    </nav>
  );
}
