import { motion } from "motion/react";
import { useSiteText } from "@/hooks/useSiteText";
import { useIntro } from "@/contexts/IntroContext";
import { BlurText } from "@/components/BlurText";
import { ShaderBackground } from "@/components/ShaderBackground";
import { LanguageTransition } from "@/components/LanguageTransition";

export function Hero() {
  const { t } = useSiteText();
  const { introPhase } = useIntro();

  // Hero animations start when overlay begins fading out (and stay on through final-flip → done)
  const canAnimate =
    introPhase === "overlay-fadeout" ||
    introPhase === "final-flip" ||
    introPhase === "done";

  // Mount shader earlier so WebGL has time to initialize behind the opaque overlay
  const mountShader =
    introPhase === "landing" ||
    introPhase === "final-flip" ||
    canAnimate;

  return (
    <section id="home" className="relative overflow-visible h-[850px] bg-black">
      {mountShader && <ShaderBackground variant="hero" />}
      <div
        className="absolute bottom-0 left-0 right-0 z-[1] h-[300px]"
        style={{ background: "linear-gradient(to bottom, transparent, black)" }}
      />

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
            "Full-stack developer across TypeScript, Kotlin, Rust & Python. I build complete products — from mobile apps to encrypted protocols to production infrastructure."
          )}
        </motion.p>

      </LanguageTransition>
    </section>
  );
}
