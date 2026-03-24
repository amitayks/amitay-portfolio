import { cn } from "@/lib/utils";

interface SectionBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionBadge({ children, className }: SectionBadgeProps) {
  return (
    <span
      className={cn(
        "liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body inline-block mb-4",
        className
      )}
    >
      {children}
    </span>
  );
}
