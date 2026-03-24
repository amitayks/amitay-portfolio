import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

interface TextDirProps {
  children: React.ReactNode;
  as?: "p" | "span" | "div" | "h1" | "h2" | "h3" | "label";
  className?: string;
}

/**
 * Wraps text content with the correct `dir` attribute based on current language.
 * Use this on text blocks that should flip reading direction (paragraphs, descriptions, form labels).
 * Do NOT use on layout containers, navbars, grids, or carousels.
 */
export function TextDir({ children, as: Tag = "div", className }: TextDirProps) {
  const { dir } = useLanguage();
  return (
    <Tag dir={dir} className={cn(className)}>
      {children}
    </Tag>
  );
}
