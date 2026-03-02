import { useTranslation } from "react-i18next";
import type { PortfolioItem } from "../types/portfolio";

interface TranslatedPortfolioContent {
  title: string;
  description: string;
  longDescription: string;
  aboutProject: string;
  readMore: string;
  getAdditionalInfoLabel: (key: string) => string;
  getAdditionalInfoValue: (key: string) => string;
}

/**
 * Hook to get translated portfolio content with fallback to server data
 * @param portfolioItem - The portfolio item from the server (can be null/undefined)
 * @returns Translated content with fallback to original server data, or null if no portfolio item
 */
export const usePortfolioTranslation = (
  portfolioItem: PortfolioItem | null | undefined
): TranslatedPortfolioContent | null => {
  const { t } = useTranslation("portfolio");

  // If no portfolio item, return null but still call the hook unconditionally
  if (!portfolioItem) {
    return null;
  }

  const sku = portfolioItem.SKU.trim();

  // Helper to get translation with fallback to server data
  const getTranslation = (key: string, fallback: string): string => {
    const translation = t(`${sku}.${key}`, { defaultValue: "" });

    // If translation is empty or still has [TRANSLATE] marker, use fallback
    if (!translation || translation.includes("[TRANSLATE]")) {
      return fallback;
    }

    return translation;
  };

  return {
    title: getTranslation("title", portfolioItem.title),
    description: getTranslation("description", portfolioItem.description),
    longDescription: getTranslation("longDescription", portfolioItem.longDescription),
    aboutProject: getTranslation(
      "aboutProject",
      portfolioItem.settings.dir === "rtl" ? "על הפרוייקט" : "About The Project"
    ),
    readMore: getTranslation(
      "readMore",
      portfolioItem.settings.dir === "rtl" ? "קרא עוד" : "Read More"
    ),
    getAdditionalInfoLabel: (key: string) => {
      const label = portfolioItem.additionalInfo?.find((info) =>
        info.label.replace(/\s+/g, "_").toLowerCase() === key
      )?.label;
      return getTranslation(`additionalInfo.${key}.label`, label || key);
    },
    getAdditionalInfoValue: (key: string) => {
      const value = portfolioItem.additionalInfo?.find((info) =>
        info.label.replace(/\s+/g, "_").toLowerCase() === key
      )?.value;
      return getTranslation(`additionalInfo.${key}.value`, value || "");
    },
  };
};
