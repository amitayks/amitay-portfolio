import { useSiteText } from "@/hooks/useSiteText";
import { SOCIAL_LINKS } from "@/constants/personal";
import { LanguageTransition } from "@/components/LanguageTransition";

const FOOTER_LINKS = SOCIAL_LINKS.filter((l) =>
  ["github", "linkedin", "email"].includes(l.label)
);

export function Footer() {
  const { t } = useSiteText();

  return (
    <footer className="mt-32 pt-8 border-t border-white/10 px-6 md:px-16 lg:px-24 pb-8">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 font-body text-xs capitalize hover:text-white/60 transition-colors"
            >
              {link.label === "email" ? "Email" : link.label.charAt(0).toUpperCase() + link.label.slice(1)}
            </a>
          ))}
        </div>
        <LanguageTransition className="flex items-center justify-center">
          <span className="text-white/40 font-body text-xs">
            {t("footer.copyright", "\u00A9 2026 Amitay Keisar. All rights reserved.")}
          </span>
        </LanguageTransition>
      </div>
    </footer>
  );
}
