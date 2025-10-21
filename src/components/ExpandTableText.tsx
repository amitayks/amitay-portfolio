import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";

interface ExpandTableTextProps {
  maxLength?: number;
  children: string;
  className?: string;
  readMoreText?: string;
}

const ExpandTableText = ({
  children,
  maxLength = 200,
  className = "",
  readMoreText = "Read More",
}: ExpandTableTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const colors = useTheme();

  if (typeof children !== "string") {
    return <div className={className}>{children}</div>;
  }

  const shouldTruncate = children.length > maxLength;

  if (!shouldTruncate) {
    return (
      <div
        style={{
          borderColor: colors.border,
          background: `linear-gradient(to right, ${colors.surface}, ${colors.surfaceSecondary})`,
        }}
        className={`p-4 rounded-lg border-2 ${className}`}
      >
        <p style={{ color: colors.text }} className="leading-relaxed">
          {children}
        </p>
      </div>
    );
  }

  const truncatedText = children.slice(0, maxLength);
  const remainingText = children.slice(maxLength);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        borderColor: colors.border,
        background: `linear-gradient(to top right, ${colors.surface}, ${colors.surfaceSecondary})`,
      }}
      className={`
        cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 transform 
        hover:shadow-md
        ${className}
      `}
    >
      <div className="relative">
        <p style={{ color: colors.textSecondary }} className="leading-relaxed text-lg">
          {truncatedText}
          <span
            className={`transition-all duration-500 ease-in-out ${
              isExpanded ? "opacity-100 max-h-full" : "opacity-0 max-h-0 overflow-hidden"
            }`}
            style={{
              display: isExpanded ? "inline" : "none",
            }}
          >
            {remainingText}
          </span>
          {!isExpanded && (
            <>
              <span>... </span>
              <span style={{ color: colors.accent }} className="font-medium">
                {readMoreText}
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default ExpandTableText;
