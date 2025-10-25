// Auto-load all portfolio translation files
// This uses Vite's glob import feature to load all JSON files in the portfolio directories

const enPortfolioModules = import.meta.glob('./locales/en/portfolio/*.json', { eager: true });
const hePortfolioModules = import.meta.glob('./locales/he/portfolio/*.json', { eager: true });

interface TranslationModule {
  default: Record<string, unknown>;
}

function loadPortfolioTranslations(modules: Record<string, unknown>): Record<string, unknown> {
  const translations: Record<string, unknown> = {};

  for (const [path, module] of Object.entries(modules)) {
    // Extract SKU from filename (e.g., "./locales/en/portfolio/WOOD-CLOCK-WALL.json" -> "WOOD-CLOCK-WALL")
    const sku = path.split('/').pop()?.replace('.json', '') || '';
    if (sku) {
      translations[sku] = (module as TranslationModule).default;
    }
  }

  return translations;
}

export const enPortfolioTranslations = loadPortfolioTranslations(enPortfolioModules);
export const hePortfolioTranslations = loadPortfolioTranslations(hePortfolioModules);
