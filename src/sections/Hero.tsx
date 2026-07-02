import { Github, Linkedin, Mail } from "lucide-react";
import { PERSONAL_INFO } from "@/constants/personal";
import { useSiteText } from "@/hooks/useSiteText";
import { useIntro } from "@/contexts/IntroContext";
import { WarpIn } from "@/components/WarpIn";
import { Button } from "@/components/ui/button";
import { LanguageTransition } from "@/components/LanguageTransition";

export function Hero() {
  const { t } = useSiteText();
  const { introPhase } = useIntro();

  // Hero warps in just after the spinning logo lands — a quick, snappy entrance
  // that flies in while the warp stars are still streaming (landing → done).
  const canAnimate =
    introPhase === "landing" ||
    introPhase === "overlay-fadeout" ||
    introPhase === "final-flip" ||
    introPhase === "done";

  return (
    <section id="home" className="relative overflow-visible h-[850px]">

      {/* Content */}
      <LanguageTransition className="relative z-10 flex flex-col items-center justify-center text-center h-full px-6">
        {/* Heading — warps in from the starfield's vanishing point toward the viewer */}
        <WarpIn
          show={canAnimate}
          duration={0.6}
          fromScale={0.18}
          className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-foreground leading-[0.8] tracking-[-4px] max-w-4xl text-center"
        >
          {t("hero.heading.line1", "I ship products,")}
          <br />
          {t("hero.heading.line2", "not prototypes.")}
        </WarpIn>

        {/* Subtext */}
        <WarpIn show={canAnimate} duration={0.6} delay={0.3} fromScale={0.3} className="mt-14">
          <p className="text-white/60 font-body font-light text-sm md:text-base max-w-xl">
            {t(
              "hero.subtext",
              "I take projects from idea to production. Mobile apps, AI products, backend systems, infrastructure — one developer, full ownership, no handoffs."
            )}
          </p>
        </WarpIn>

        {/* CTA buttons */}
        <WarpIn show={canAnimate} duration={0.6} delay={0.5} fromScale={0.3} className="mt-8">
          <div className="flex gap-3">
            <Button variant="glass" size="icon" asChild>
              <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="glass" size="icon" asChild>
              <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </Button>
            <Button
              variant="glass"
              size="icon"
              aria-label="Contact"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Mail className="w-4 h-4" />
            </Button>
          </div>
        </WarpIn>

      </LanguageTransition>
    </section>
  );
}
