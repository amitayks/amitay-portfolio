import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card
          style={{
            borderColor: colors.border,
            background: `linear-gradient(to right, ${colors.surface}, ${colors.surfaceSecondary})`,
          }}
          className={`p-4 border-2 ${className}`}
        >
          <p style={{ color: colors.text }} className="leading-relaxed">
            {children}
          </p>
        </Card>
      </motion.div>
    );
  }

  const truncatedText = children.slice(0, maxLength);
  const remainingText = children.slice(maxLength);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        style={{
          borderColor: colors.border,
          background: `linear-gradient(to top right, ${colors.surface}, ${colors.surfaceSecondary})`,
        }}
        className="p-6 border-2 hover:shadow-lg transition-shadow duration-300"
      >
        <div className="relative">
          <motion.p
            style={{ color: colors.textSecondary }}
            className="leading-relaxed text-lg"
            layout
          >
            {truncatedText}
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {remainingText}
                </motion.span>
              )}
            </AnimatePresence>
            {!isExpanded && <span>...</span>}
          </motion.p>

          <motion.div
            className="mt-4 flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClick}
              style={{ color: colors.accent }}
              className="group"
            >
              <motion.div
                className="flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isExpanded ? (
                  <>
                    Show Less
                    <ChevronUp className="w-4 h-4 group-hover:animate-bounce" />
                  </>
                ) : (
                  <>
                    {readMoreText}
                    <ChevronDown className="w-4 h-4 group-hover:animate-bounce" />
                  </>
                )}
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ExpandTableText;
