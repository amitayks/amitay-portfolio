import { useLanguage } from "./useLanguage";
import type { Language, Translated } from "@/types/content";

export function pickLang<T>(
  value: Translated<T> | T | null | undefined,
  lang: Language
): T | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "object" && value !== null && ("en" in value || "he" in value)) {
    const t = value as Translated<T>;
    return t[lang] ?? t.en ?? null;
  }
  return value as T;
}

export function useTranslated<T = string>(
  value: Translated<T> | T | null | undefined
): T | null {
  const { lang } = useLanguage();
  return pickLang(value, lang);
}
