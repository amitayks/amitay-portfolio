import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import enApply from "./locales/en/apply.json";
import enCommon from "./locales/en/common.json";
import enHome from "./locales/en/home.json";
import heApply from "./locales/he/apply.json";
import heCommon from "./locales/he/common.json";
import heHome from "./locales/he/home.json";

const resources = {
  en: {
    common: enCommon,
    home: enHome,
    apply: enApply,
  },
  he: {
    common: heCommon,
    home: heHome,
    apply: heApply,
  },
};

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources,
    fallbackLng: "en", // Fallback language if detection fails
    supportedLngs: ["en", "he"], // Supported languages

    detection: {
      // Order of language detection methods
      order: ["localStorage", "navigator"],
      // Cache user language in localStorage
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // Default namespace
    defaultNS: "common",

    react: {
      useSuspense: false, // Disable suspense mode for better control
    },
  });

export default i18n;
