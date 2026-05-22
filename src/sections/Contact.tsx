import { useSiteText } from "@/hooks/useSiteText";
import { ShaderBackground } from "@/components/ShaderBackground";
import { VideoFades } from "@/components/HlsVideo";
import { SectionHeading } from "@/components/SectionHeading";
import { ContactForm } from "@/components/ContactForm";
import { SocialLinks } from "@/components/SocialLinks";
import { LanguageTransition } from "@/components/LanguageTransition";

export function Contact() {
  const { t } = useSiteText();

  return (
    <section id="contact" className="relative py-32 px-6 md:px-16 lg:px-24">
      <ShaderBackground variant="contact" />
      <VideoFades />

      <div className="relative z-10 text-center">
        <SectionHeading className="text-5xl md:text-6xl lg:text-7xl">
          <LanguageTransition inline>
            {t("contact.heading", "Let's build something.")}
          </LanguageTransition>
        </SectionHeading>
        <p className="text-white/60 font-body font-light text-sm md:text-base mt-4 mb-12">
          <LanguageTransition inline>
            {t("contact.subtext", "Have a project in mind? Tell me about it and I'll get back to you within 24 hours.")}
          </LanguageTransition>
        </p>

        <ContactForm />
        <SocialLinks />
      </div>
    </section>
  );
}
