export interface TimelineItem {
  title: string;
  subtitle: string;
  period: string;
  description: string;
}

export type IconType = "graduation" | "briefcase";
export type TimelineType = "education" | "experience";

export interface TimelineSectionProps {
  title: string;
  icon: IconType;
  items: TimelineItem[];
  type?: TimelineType;
}
