import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

export function SectionHeading({ children, className, as: Tag = "h2" }: SectionHeadingProps) {
  return (
    <Tag
      className={cn(
        "text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-[0.9]",
        className
      )}
    >
      {children}
    </Tag>
  );
}
