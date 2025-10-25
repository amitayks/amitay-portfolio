import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";

interface RandomFontTextProps {
  text: string;
  className?: string;
  baseColor?: string;
  accentColor?: string;
  accentStartIndex?: number;
  accentEndIndex?: number;
  hoverInterval?: number;
}

// Array of font families to randomly cycle through
const FONT_FAMILIES = [
  // Modern Sans-Serif
  "Arial, sans-serif",
  "Helvetica, sans-serif",
  "Verdana, sans-serif",
  "Tahoma, sans-serif",
  "Trebuchet MS, sans-serif",
  "Arial Black, sans-serif",
  "Impact, sans-serif",
  "Century Gothic, sans-serif",
  "Futura, sans-serif",
  "Gill Sans, sans-serif",

  // Classic Serif
  "Times New Roman, serif",
  "Georgia, serif",
  "Garamond, serif",
  "Palatino, serif",
  "Baskerville, serif",
  "Didot, serif",
  "Bodoni MT, serif",
  "Cambria, serif",
  "Book Antiqua, serif",
  "Rockwell, serif",

  // Monospace & Typewriter
  "Courier New, monospace",
  "Courier, monospace",
  "Monaco, monospace",
  "Consolas, monospace",
  "Lucida Console, monospace",
  "Andale Mono, monospace",

  // Display & Decorative
  "Copperplate, fantasy",
  "Papyrus, fantasy",
  "Brush Script MT, cursive",
  "Lucida Handwriting, cursive",
  "Comic Sans MS, cursive",
  "Bradley Hand, cursive",
  "Chalkduster, fantasy",
  "Marker Felt, fantasy",
  "Trattatello, fantasy",
  "Luminari, fantasy",

  // Modern Web Fonts (system fonts)
  "Segoe UI, sans-serif",
  "Roboto, sans-serif",
  "Oxygen, sans-serif",
  "Ubuntu, sans-serif",
  "Cantarell, sans-serif",
  "Fira Sans, sans-serif",
  "Droid Sans, sans-serif",
  "Helvetica Neue, sans-serif",
  "Franklin Gothic Medium, sans-serif",

  // Elegant & Stylish
  "Optima, sans-serif",
  "Avenir, sans-serif",
  "Hoefler Text, serif",
  "Perpetua, serif",
  "Cochin, serif",
  "Big Caslon, serif",
  "American Typewriter, serif",
];

export const RandomFontText = ({
  text,
  className = "",
  baseColor,
  accentColor,
  accentStartIndex,
  accentEndIndex,
  hoverInterval = 50,
}: RandomFontTextProps) => {
  const characters = Array.from(text);
  const [fontIndices, setFontIndices] = useState<number[]>(
    characters.map(() => 0) // Start with first font (Arial)
  );
  const intervalsRef = useRef<(NodeJS.Timeout | null)[]>(
    characters.map(() => null)
  );

  const getRandomFontIndex = useCallback(
    () => Math.floor(Math.random() * FONT_FAMILIES.length),
    []
  );

  const handleMouseEnter = useCallback(
    (index: number) => {
      // Clear any existing interval for this character
      if (intervalsRef.current[index]) {
        clearInterval(intervalsRef.current[index]!);
      }

      // Start rapidly cycling fonts for this character
      intervalsRef.current[index] = setInterval(() => {
        setFontIndices((prev) => {
          const newIndices = [...prev];
          newIndices[index] = getRandomFontIndex();
          return newIndices;
        });
      }, hoverInterval);
    },
    [getRandomFontIndex, hoverInterval]
  );

  const handleMouseLeave = useCallback((index: number) => {
    // Stop the interval and keep the current font
    if (intervalsRef.current[index]) {
      clearInterval(intervalsRef.current[index]!);
      intervalsRef.current[index] = null;
    }
  }, []);

  const getCharacterColor = (index: number): string | undefined => {
    if (!accentColor || accentStartIndex === undefined) {
      return baseColor;
    }

    const endIndex = accentEndIndex ?? text.length;
    if (index >= accentStartIndex && index < endIndex) {
      return accentColor;
    }

    return baseColor;
  };

  return (
    <motion.h1
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8 }}
    >
      {characters.map((char, index) => {
        const isSpace = char === " ";
        const fontIndex = fontIndices[index] ?? 0;
        const fontFamily = FONT_FAMILIES[fontIndex];
        const color = getCharacterColor(index);

        return (
          <span
            key={`${char}-${index}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
            style={{
              fontFamily: fontFamily,
              color: color,
              display: "inline-block",
              minWidth: isSpace ? "0.3em" : undefined,
              transition: "none", // No transition for instant font changes
              cursor: isSpace ? "default" : "pointer",
            }}
          >
            {isSpace ? "\u00A0" : char}
          </span>
        );
      })}
    </motion.h1>
  );
};
