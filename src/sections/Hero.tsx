import { motion } from "motion/react";
import { Github, Linkedin, Mail } from "lucide-react";
import { PERSONAL_INFO } from "@/constants/personal";
import { useSiteText } from "@/hooks/useSiteText";
import { useIntro } from "@/contexts/IntroContext";
import { BlurText } from "@/components/BlurText";
import { Button } from "@/components/ui/button";
import { LanguageTransition } from "@/components/LanguageTransition";

export function Hero() {
  const { t } = useSiteText();
  const { introPhase } = useIntro();

  // Hero animations start when overlay begins fading out (and stay on through final-flip → done)
  const canAnimate =
    introPhase === "overlay-fadeout" ||
    introPhase === "final-flip" ||
    introPhase === "done";

  return (
    <section id="home" className="relative overflow-visible h-[850px]">

      {/* Content */}
      <LanguageTransition className="relative z-10 flex flex-col items-center justify-center text-center h-full px-6">
        {/* Heading — key forces remount when canAnimate flips, triggering fresh animation */}
        <BlurText
          key={canAnimate ? "animate" : "waiting"}
          text={`${t("hero.heading.line1", "I ship products,")} ${t("hero.heading.line2", "not prototypes.")}`}
          className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-foreground leading-[0.8] tracking-[-4px] max-w-4xl justify-center"
          delay={canAnimate ? 0 : 999}
        />

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={
            canAnimate
              ? { opacity: 1, filter: "blur(0px)" }
              : { opacity: 0, filter: "blur(10px)" }
          }
          transition={{ duration: 0.6, delay: canAnimate ? 0.8 : 0 }}
          className="mt-14 text-white/60 font-body font-light text-sm md:text-base max-w-xl"
        >
          {t(
            "hero.subtext",
            "I take projects from idea to production. Mobile apps, AI products, backend systems, infrastructure — one developer, full ownership, no handoffs."
          )}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={
            canAnimate
              ? { opacity: 1, filter: "blur(0px)" }
              : { opacity: 0, filter: "blur(10px)" }
          }
          transition={{ duration: 0.6, delay: canAnimate ? 1.1 : 0 }}
          className="mt-8 flex gap-3"
        >
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
        </motion.div>

      </LanguageTransition>
    </section>
  );
}
