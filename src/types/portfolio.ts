import type { PublicProfile } from "./profile";

export type ProjectStatus = "upcoming" | "ongoing" | "finished";
export type ClientVisibility = "public" | "logo_only" | "hidden";
export type DevAttribution = "named" | "anonymized" | "hidden";

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
    imageAspect: "squere" | "square";
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
  publish: boolean;
  // Keisar Club v1 — agency fields
  status?: ProjectStatus;
  companyName?: string | null;
  duration?: string | null;
  developers?: string[];
  assignedManager?: string | null;
  clientVisibility?: ClientVisibility;
  devAttribution?: DevAttribution;
  startedAt?: string | null;
  finishedAt?: string | null;
  // Populated by the API layer when fetching a single project
  developerProfiles?: PublicProfile[];
}
