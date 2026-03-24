import { useSiteText } from "@/hooks/useSiteText";
import { LanguageTransition } from "@/components/LanguageTransition";

export function Stats() {
  const { t } = useSiteText();

  const stats = [
    {
      value: t("stats.stat1.value", "4+"),
      label: t("stats.stat1.label", "Products in production"),
    },
    {
      value: t("stats.stat2.value", "5"),
      label: t("stats.stat2.label", "Languages"),
    },
    {
      value: t("stats.stat3.value", "1,000+"),
      label: t("stats.stat3.label", "Soldiers supported (8200)"),
    },
    {
      value: t("stats.stat4.value", "0"),
      label: t("stats.stat4.label", "Runtime dependencies (Muse)"),
    },
  ];

  return (
    <section id="stats" className="relative py-24 px-6 md:px-16 lg:px-24">
      <div className="relative z-10 liquid-glass-strong rounded-3xl p-12 md:p-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white">
                <LanguageTransition inline>{stat.value}</LanguageTransition>
              </div>
              <div className="text-white/60 font-body font-light text-sm mt-2">
                <LanguageTransition inline>{stat.label}</LanguageTransition>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
