import { useSiteText } from "@/hooks/useSiteText";
import { LanguageTransition } from "@/components/LanguageTransition";

export function Footer() {
  const { t } = useSiteText();

  return (
    <footer className="mt-32 pt-8 border-t border-white/10 px-6 md:px-16 lg:px-24 pb-8">
      <LanguageTransition className="flex items-center justify-center">
        <span className="text-white/40 font-body text-xs">
          {t("footer.copyright", "\u00A9 2026 Amitay Keisar")}
        </span>
      </LanguageTransition>
    </footer>
  );
}
