import { useSiteText } from "@/hooks/useSiteText";
import { SectionBadge } from "@/components/SectionBadge";
import { LanguageTransition } from "@/components/LanguageTransition";

export function ProductsBar() {
  const { t } = useSiteText();

  const products = t("products.items", "Addit,Muse,AgentMesh,Visara").split(",");

  return (
    <section className="py-8 flex flex-col items-center">
      <LanguageTransition className="flex flex-col items-center">
        <SectionBadge>
          {t("products.badge", "Currently shipping")}
        </SectionBadge>
        <div className="flex items-center gap-12 flex-wrap justify-center mt-4">
          {products.map((name) => (
            <span
              key={name}
              className="text-2xl md:text-3xl font-heading italic text-white"
            >
              {name.trim()}
            </span>
          ))}
        </div>
      </LanguageTransition>
    </section>
  );
}
