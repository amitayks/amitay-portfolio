import { Smartphone, Server, Brain, Rocket } from "lucide-react";
import { useSiteText } from "@/hooks/useSiteText";
import { SectionBadge } from "@/components/SectionBadge";
import { SectionHeading } from "@/components/SectionHeading";
import { LanguageTransition } from "@/components/LanguageTransition";

const SKILL_ICONS = [Smartphone, Server, Brain, Rocket];

export function SkillsGrid() {
  const { t } = useSiteText();

  const cards = [
    {
      icon: SKILL_ICONS[0],
      title: t("skills.card1.title", "Mobile Apps"),
      description: t(
        "skills.card1.description",
        "Native and cross-platform. From first commit to App Store submission. iOS, Android, or both."
      ),
    },
    {
      icon: SKILL_ICONS[1],
      title: t("skills.card2.title", "Backend & Infrastructure"),
      description: t(
        "skills.card2.description",
        "APIs, databases, cloud deployment, CI/CD. Systems built to scale and run without babysitting."
      ),
    },
    {
      icon: SKILL_ICONS[2],
      title: t("skills.card3.title", "AI-Powered Products"),
      description: t(
        "skills.card3.description",
        "Voice agents, content automation, intelligent workflows. AI that solves real problems, not demos."
      ),
    },
    {
      icon: SKILL_ICONS[3],
      title: t("skills.card4.title", "Full Product Builds"),
      description: t(
        "skills.card4.description",
        "You bring the idea. I handle architecture, development, deployment, and maintenance. One point of contact, start to finish."
      ),
    },
  ];

  return (
    <section id="skills" className="relative z-10 py-24 px-6 md:px-16 lg:px-24">
      <div className="text-center mb-12">
        <SectionBadge>
          <LanguageTransition inline>{t("skills.badge", "What I Build")}</LanguageTransition>
        </SectionBadge>
        <SectionHeading>
          <LanguageTransition inline>{t("skills.heading", "End-to-end. From architecture to App Store.")}</LanguageTransition>
        </SectionHeading>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto ">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="liquid-glass-strong rounded-2xl p-6 text-center flex flex-col items-center">
              <div className="liquid-glass-strong rounded-full w-10 h-10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <LanguageTransition>
                <h3 className="text-lg font-heading italic text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-white/60 font-body font-light text-sm">
                  {card.description}
                </p>
              </LanguageTransition>
            </div>
          );
        })}
      </div>
    </section>
  );
}
