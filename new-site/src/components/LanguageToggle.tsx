import { Languages } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export function LanguageToggle() {
  const { lang, setLang, isTransitioning } = useLanguage();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "he" : "en")}
      disabled={isTransitioning}
      className="liquid-glass-strong rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={lang === "en" ? "Switch to Hebrew" : "Switch to English"}
    >
      <Languages className="w-4 h-4 text-white/70" />
    </button>
  );
}
