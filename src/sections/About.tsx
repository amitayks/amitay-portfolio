import { useRef, useEffect, useState } from "react";
import { Download, Linkedin } from "lucide-react";
import { SOCIAL_LINKS } from "@/constants/personal";
import { useSiteText } from "@/hooks/useSiteText";
import { SectionBadge } from "@/components/SectionBadge";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { LanguageTransition } from "@/components/LanguageTransition";

const HEIGHT_TRANSITION = "height 0.4s cubic-bezier(0.16, 1, 0.3, 1)";

export function About() {
  const { t } = useSiteText();
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const maxHeightRef = useRef(0);
  const [spacerHeight, setSpacerHeight] = useState(0);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const h = el.offsetHeight;
      if (h > maxHeightRef.current) maxHeightRef.current = h;
      setContentHeight(h);
      setSpacerHeight(maxHeightRef.current - h);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const bodyText = t(
    "about.body",
    "4 years ago I opened a code editor for the first time. No bootcamp. No CS degree. Just documentation, source code, and a need to build things that actually work.\n\nToday I ship full products across mobile, web, backend, and infrastructure. Every project you see here was built from nothing — designed, architected, coded, deployed, and maintained end-to-end.\n\nPreviously, I served as Head of Logistics in IDF Unit 8200, managing operations for a 1,000+ soldier technology center."
  );

  return (
    <section
      id="about"
      className="relative min-h-[700px] py-32 px-6 md:px-16 lg:px-24 flex flex-col items-center justify-center text-center"
    >
      <div className="relative z-10 max-w-2xl flex flex-col items-center">
        <SectionBadge>
          <LanguageTransition inline>{t("about.badge", "About")}</LanguageTransition>
        </SectionBadge>

        <div
          className="liquid-glass-strong rounded-2xl overflow-hidden"
          style={{
            height: contentHeight ?? "auto",
            transition: contentHeight !== null ? HEIGHT_TRANSITION : "none",
          }}
        >
          <div ref={contentRef} className="p-8 md:p-12">
            <LanguageTransition>
              <SectionHeading>
                {t("about.heading.line1", "Self-taught.")}
                <br />
                {t("about.heading.line2", "Ship-obsessed.")}
              </SectionHeading>

              <div className="mt-8 space-y-4">
                {bodyText.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-white/60 font-body font-light md:text-base">
                    {paragraph}
                  </p>
                ))}
              </div>
            </LanguageTransition>
          </div>
        </div>

        {/* Compensating spacer — same transition, browser keeps them in lockstep */}
        <div
          style={{
            height: spacerHeight,
            transition: HEIGHT_TRANSITION,
          }}
        />

        <div className="mt-8 flex gap-3">
          <Button variant="glass" asChild>
            <a href="/Amitay_Keisar_Resume.pdf" download>
              <LanguageTransition inline>
                {t("about.cta", "Download Resume")}
              </LanguageTransition>
              <Download className="w-4 h-4" />
            </a>
          </Button>
          <Button variant="glass" asChild>
            <a
              href={SOCIAL_LINKS.find((l) => l.label === "linkedin")?.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LanguageTransition inline>
                {t("about.linkedin", "View LinkedIn")}
              </LanguageTransition>
              <Linkedin className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
