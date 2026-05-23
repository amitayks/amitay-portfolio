import type { PublicProfile } from "./profile";
import type { Translated } from "./content";

export type ProjectStatus = "upcoming" | "ongoing" | "finished";
export type ClientVisibility = "public" | "logo_only" | "hidden";
export type DevAttribution = "named" | "anonymized" | "hidden";

export interface AdditionalInfoItem {
  label: Translated;
  value: Translated;
}

export interface LinkCard {
  label?: Translated;
  link: string;
  subHeader: Translated;
  previewImage?: { dark: string; light: string };
}

export interface PortfolioItem {
  id: string;
  SKU: string;
  title: Translated;
  image: string;
  imagePack: string[];
  featured: boolean;
  description: Translated;
  longDescription: Translated;
  technologies: string[];
  settings: {
    imageAspect: "squere" | "square";
  };
  projectType: "Wood-Working" | "Web-Development" | "Design" | "Other";
  additionalInfo: AdditionalInfoItem[];
  problem?: Translated;
  whatIBuilt?: Translated;
  howItWorks?: Translated;
  result?: Translated;
  priority?: number;
  completionDate?: string;
  liveSite?: LinkCard;
  github?: LinkCard;
  publish: boolean;
  status?: ProjectStatus;
  companyName?: Translated | null;
  duration?: Translated | null;
  developers?: string[];
  assignedManager?: string | null;
  clientVisibility?: ClientVisibility;
  devAttribution?: DevAttribution;
  startedAt?: string | null;
  finishedAt?: string | null;
  developerProfiles?: PublicProfile[];
}
