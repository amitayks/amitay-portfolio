import { CSSProperties } from "react";
import { cn } from "../utils/helpers";

export function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return <div className={cn("animate-pulse bg-gray-200 rounded-md", className)} style={style} />;
}
