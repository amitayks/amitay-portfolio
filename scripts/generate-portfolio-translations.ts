import { createClient } from "@supabase/supabase-js";
import * as fs from "node:fs";
import * as path from "node:path";

// Supabase configuration (from src/services/supabase.ts)
const supabaseUrl = "https://qjyybkgqqadjedgelakf.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqeXlia2dxcWFkamVkZ2VsYWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MTE0NDUsImV4cCI6MjA1NzE4NzQ0NX0.c5nEfh7VNoA6w8bYYoBmoYgAtO721_4h1tQgrNWNFEY";

const supabase = createClient(supabaseUrl, supabaseKey);

interface PortfolioItem {
  id: string;
  SKU: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  settings: {
    imageAspect: string;
    dir: "rtl" | "ltr";
  };
  projectType: string;
  additionalInfo?: Array<{
    label: string;
    value: string;
  }>;
  github?: {
    link: string;
    subHeader: string;
  };
  liveSite?: {
    link: string;
    subHeader: string;
  };
}

interface TranslationStructure {
  title: string;
  description: string;
  longDescription: string;
  aboutProject: string;
  readMore: string;
  github?: {
    label: string;
    subHeader: string;
  };
  liveSite?: {
    label: string;
    subHeader: string;
  };
  additionalInfo?: {
    [key: string]: {
      label: string;
      value: string;
    };
  };
}

async function fetchPortfolioItems(): Promise<PortfolioItem[]> {
  console.log("📡 Fetching portfolio items from Supabase...");

  const { data, error } = await supabase
    .from("portfolio")
    .select(
      "id, SKU, title, description, longDescription, technologies, projectType, additionalInfo, settings, github, liveSite"
    )
    .eq("publish", true)
    .order("priority", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch portfolio items: ${error.message}`);
  }

  console.log(`✅ Fetched ${data.length} portfolio items`);
  return data as PortfolioItem[];
}

function detectLanguage(item: PortfolioItem): "he" | "en" {
  return item.settings.dir === "rtl" ? "he" : "en";
}

function createTranslationEntry(item: PortfolioItem, isSource: boolean): TranslationStructure {
  const entry: TranslationStructure = {
    title: isSource ? item.title : `[TRANSLATE] ${item.title}`,
    description: isSource ? item.description : `[TRANSLATE] ${item.description}`,
    longDescription: isSource ? item.longDescription : `[TRANSLATE] ${item.longDescription}`,
    aboutProject: isSource
      ? item.settings.dir === "rtl"
        ? "על הפרוייקט"
        : "About The Project"
      : item.settings.dir === "rtl"
        ? "[TRANSLATE] על הפרוייקט"
        : "[TRANSLATE] About The Project",
    readMore: isSource
      ? item.settings.dir === "rtl"
        ? "קרא עוד"
        : "Read More"
      : item.settings.dir === "rtl"
        ? "[TRANSLATE] קרא עוד"
        : "[TRANSLATE] Read More",
  };

  if (item.github) {
    entry.github = {
      label: isSource ? "GitHub" : "GitHub", // GitHub is universal
      subHeader: isSource ? item.github.subHeader : `[TRANSLATE] ${item.github.subHeader}`,
    };
  }

  if (item.liveSite) {
    entry.liveSite = {
      label: isSource
        ? item.settings.dir === "rtl"
          ? "אתר חי"
          : "Live Site"
        : item.settings.dir === "rtl"
          ? "[TRANSLATE] אתר חי"
          : "[TRANSLATE] Live Site",
      subHeader: isSource ? item.liveSite.subHeader : `[TRANSLATE] ${item.liveSite.subHeader}`,
    };
  }

  if (item.additionalInfo && item.additionalInfo.length > 0) {
    entry.additionalInfo = {};
    for (const info of item.additionalInfo) {
      const key = info.label.replace(/\s+/g, "_").toLowerCase();
      entry.additionalInfo[key] = {
        label: isSource ? info.label : `[TRANSLATE] ${info.label}`,
        value: isSource ? info.value : `[TRANSLATE] ${info.value}`,
      };
    }
  }

  return entry;
}

function mergeTranslations(
  existing: TranslationStructure,
  newData: TranslationStructure
): TranslationStructure {
  // Merge deeply, preserving existing translations (manual edits)
  const merged: TranslationStructure = {
    ...newData,
    ...existing,
  };

  // Deep merge additionalInfo if exists
  if (newData.additionalInfo || existing.additionalInfo) {
    merged.additionalInfo = {
      ...newData.additionalInfo,
      ...existing.additionalInfo,
    };
  }

  // Deep merge github if exists
  if (newData.github || existing.github) {
    merged.github = {
      ...newData.github,
      ...existing.github,
    };
  }

  // Deep merge liveSite if exists
  if (newData.liveSite || existing.liveSite) {
    merged.liveSite = {
      ...newData.liveSite,
      ...existing.liveSite,
    };
  }

  return merged;
}

async function generateTranslations() {
  try {
    console.log("🚀 Starting portfolio translation generation (separate files)...\n");

    // Fetch portfolio items
    const items = await fetchPortfolioItems();

    // Define directories
    const localesDir = path.join(process.cwd(), "src", "i18n", "locales");
    const hePortfolioDir = path.join(localesDir, "he", "portfolio");
    const enPortfolioDir = path.join(localesDir, "en", "portfolio");

    // Ensure directories exist
    if (!fs.existsSync(hePortfolioDir)) {
      fs.mkdirSync(hePortfolioDir, { recursive: true });
    }
    if (!fs.existsSync(enPortfolioDir)) {
      fs.mkdirSync(enPortfolioDir, { recursive: true });
    }

    let heNeedsTranslation = 0;
    let enNeedsTranslation = 0;

    // Process each item
    for (const item of items) {
      const sourceLang = detectLanguage(item);
      const isHebrew = sourceLang === "he";
      const sku = item.SKU.trim();

      console.log(
        `📝 Processing: ${item.title} (SKU: ${sku}) - Source: ${isHebrew ? "Hebrew" : "English"}`
      );

      // Create translation entries
      const heTranslation = createTranslationEntry(item, isHebrew);
      const enTranslation = createTranslationEntry(item, !isHebrew);

      // File paths for this SKU
      const heFilePath = path.join(hePortfolioDir, `${sku}.json`);
      const enFilePath = path.join(enPortfolioDir, `${sku}.json`);

      // Load existing translations if they exist
      let existingHe: TranslationStructure | null = null;
      let existingEn: TranslationStructure | null = null;

      if (fs.existsSync(heFilePath)) {
        existingHe = JSON.parse(fs.readFileSync(heFilePath, "utf-8"));
      }

      if (fs.existsSync(enFilePath)) {
        existingEn = JSON.parse(fs.readFileSync(enFilePath, "utf-8"));
      }

      // Merge with existing translations
      const finalHe = existingHe ? mergeTranslations(existingHe, heTranslation) : heTranslation;
      const finalEn = existingEn ? mergeTranslations(existingEn, enTranslation) : enTranslation;

      // Create backups if files exist
      if (existingHe && fs.existsSync(heFilePath)) {
        const backupPath = heFilePath.replace(".json", `.backup-${Date.now()}.json`);
        fs.copyFileSync(heFilePath, backupPath);
      }

      if (existingEn && fs.existsSync(enFilePath)) {
        const backupPath = enFilePath.replace(".json", `.backup-${Date.now()}.json`);
        fs.copyFileSync(enFilePath, backupPath);
      }

      // Write translation files
      fs.writeFileSync(heFilePath, JSON.stringify(finalHe, null, 2), "utf-8");
      fs.writeFileSync(enFilePath, JSON.stringify(finalEn, null, 2), "utf-8");

      // Count translations needed
      heNeedsTranslation += JSON.stringify(finalHe).split("[TRANSLATE]").length - 1;
      enNeedsTranslation += JSON.stringify(finalEn).split("[TRANSLATE]").length - 1;
    }

    console.log("\n✨ Translation files generated successfully!");
    console.log(`📁 Hebrew directory: ${hePortfolioDir}`);
    console.log(`📁 English directory: ${enPortfolioDir}`);

    console.log("\n📊 Translation Status:");
    console.log(
      `   Hebrew: ${items.length} files created (${heNeedsTranslation} translations needed)`
    );
    console.log(
      `   English: ${items.length} files created (${enNeedsTranslation} translations needed)`
    );

    if (enNeedsTranslation > 0 || heNeedsTranslation > 0) {
      console.log("\n⚠️  Next Steps:");
      console.log("   1. Search for '[TRANSLATE]' markers in the generated files");
      console.log("   2. Replace them with actual translations");
      console.log("   3. Commit the translation files to git");
    }

    console.log("\n🎉 Done! Each portfolio item now has its own translation file.");
  } catch (error) {
    console.error("\n❌ Error generating translations:", error);
    process.exit(1);
  }
}

// Run the script
generateTranslations();
