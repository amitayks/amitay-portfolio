export interface portfolioItemSettings {
  imageAspect: "squere";
  dir: "rtl" | "ltr";
}
export interface PortfolioItem {
  id: string;
  SKU: string;
  title: string;
  image: string;
  imagePack: string[];
  featured: boolean;
  description: string;
  longDescription: string;
  technologies: string[];
  settings: portfolioItemSettings;
  projectType: "Wood-Working" | "Web-Development" | "Design" | "Other";
  additionalInfo: Array<{
    label: string;
    value: string;
  }>;
  priority?: number;
  completionDate?: string;
  liveSite?: {
    label?: string;
    link: string;
    subHeader: string;
    previewImage?: {
      dark: string;
      light: string;
    };
  };
  github?: {
    label?: string;
    link: string;
    subHeader: string;
    previewImage?: {
      dark: string;
      light: string;
    };
  };
  status?: "completed" | "in-progress" | "concept";
}
