import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";

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
  const { colors } = useTheme();

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

  // Split remaining text into words for smoother animation
  const words = remainingText.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.015, // Delay between each word
        delayChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 5,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.1,
      },
    },
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
        className="p-6 hover:shadow-lg transition-shadow duration-300"
      >
        <div className="relative">
          <p style={{ color: colors.textSecondary }} className="leading-relaxed text-lg">
            {truncatedText}
            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.span
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{ display: "inline" }}
                >
                  {words.map((word, index) => (
                    <motion.span
                      key={index}
                      variants={wordVariants}
                      style={{ display: "inline-block", marginRight: "0.25em" }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.span>
              )}
            </AnimatePresence>
            {!isExpanded && <span>...</span>}
          </p>

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
                    <ChevronUp className="w-4 h-4 " />
                  </>
                ) : (
                  <>
                    {readMoreText}
                    <ChevronDown className="w-4 h-4 " />
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
