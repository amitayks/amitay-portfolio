export type Language = "en" | "he";

export type Translated<T = string> = {
  en: T | null;
  he: T | null;
};

export type SiteContentMap = Record<string, Translated>;
