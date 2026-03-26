export interface PortfolioItem {
  id: string;
  SKU: string;
  lang: "en" | "he";
  title: string;
  image: string;
  imagePack: string[];
  featured: boolean;
  description: string;
  longDescription: string;
  technologies: string[];
  settings: {
    imageAspect: "squere";
  };
  projectType: "Wood-Working" | "Web-Development" | "Design" | "Other";
  additionalInfo: Array<{
    label: string;
    value: string;
  }>;
  problem?: string;
  whatIBuilt?: string;
  howItWorks?: string;
  result?: string;
  priority?: number;
  completionDate?: string;
  liveSite?: {
    label?: string;
    link: string;
    subHeader: string;
    previewImage?: { dark: string; light: string };
  };
  github?: {
    label?: string;
    link: string;
    subHeader: string;
    previewImage?: { dark: string; light: string };
  };
  status?: "completed" | "in-progress" | "concept";
  publish: boolean;
}
