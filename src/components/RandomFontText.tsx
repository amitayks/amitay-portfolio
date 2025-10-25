import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

interface RandomFontTextProps {
  text: string;
  className?: string;
  baseColor?: string;
  accentColor?: string;
  accentStartIndex?: number;
  accentEndIndex?: number;
  hoverInterval?: number;
}

// Array of font families to randomly cycle through (Latin/English fonts)
const LATIN_FONT_FAMILIES = [
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

// Hebrew fonts with emphasis on curly/decorative styles
const HEBREW_FONT_FAMILIES = [
  // Curly & Decorative Hebrew Fonts (MOST)
  "Guttman Yad-Brush, fantasy",
  "Guttman Yad, cursive",
  "Guttman Calligraphic, cursive",
  "Guttman Stam, fantasy",
  "Guttman Hodes, fantasy",
  "Guttman Mantova, fantasy",
  "Guttman Vilna, fantasy",
  "Guttman Aram, fantasy",
  "Guttman Kav, fantasy",
  "Guttman Ketubah, cursive",
  "Guttman Yad-Light, cursive",
  "Guttman Fliga, fantasy",
  "Guttman Rashi, cursive",
  "Guttman Aharoni, fantasy",
  "Guttman Drogolin, fantasy",
  "Guttman Frank, fantasy",
  "Guttman Haim, fantasy",
  "Guttman Kav-Light, fantasy",
  "Guttman Logo, fantasy",
  "Guttman Miryam, fantasy",
  "Guttman Myamfix, fantasy",
  "Guttman Rashi, fantasy",
  "Guttman Soncino, fantasy",
  "Guttman Soncino-Light, fantasy",
  "Guttman Toledo, fantasy",
  "Guttman Vilna, fantasy",
  "Shuneet, fantasy",
  "Shuneet Light, fantasy",
  "Corsiva Hebrew, cursive",
  "Ezra SIL, serif",
  "Adobe Hebrew, serif",
  "New Peninim MT, fantasy",
  "Raanana, fantasy",

  // Standard Hebrew Fonts (less presence)
  "Arial Hebrew, sans-serif",
  "David, serif",
  "Tahoma, sans-serif",
  "Miriam, serif",
  "Narkisim, serif",
  "Rod, serif",
  "Gisha, sans-serif",
  "Levenim MT, sans-serif",
  "FrankRuehl, serif",
  "Times New Roman, serif",
  "Courier New, monospace",
];

// Helper function to detect if a character is Hebrew
const isHebrewChar = (char: string): boolean => {
  const code = char.charCodeAt(0);
  return (code >= 0x0590 && code <= 0x05ff) || (code >= 0xfb1d && code <= 0xfb4f);
};

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
  const spanRefs = useRef<(HTMLSpanElement | null)[]>(
    characters.map(() => null)
  );
  const containerRef = useRef<HTMLHeadingElement>(null);
  const activeCharsRef = useRef<Set<number>>(new Set());

  const getRandomFontIndex = useCallback((char: string) => {
    const fontList = isHebrewChar(char) ? HEBREW_FONT_FAMILIES : LATIN_FONT_FAMILIES;
    return Math.floor(Math.random() * fontList.length);
  }, []);

  const startAnimation = useCallback(
    (index: number, char: string) => {
      // Don't start if already animating
      if (intervalsRef.current[index]) {
        return;
      }

      activeCharsRef.current.add(index);

      // Start rapidly cycling fonts for this character
      intervalsRef.current[index] = setInterval(() => {
        setFontIndices((prev) => {
          const newIndices = [...prev];
          newIndices[index] = getRandomFontIndex(char);
          return newIndices;
        });
      }, hoverInterval);
    },
    [getRandomFontIndex, hoverInterval]
  );

  const stopAnimation = useCallback((index: number) => {
    // Stop the interval and keep the current font
    if (intervalsRef.current[index]) {
      clearInterval(intervalsRef.current[index]!);
      intervalsRef.current[index] = null;
      activeCharsRef.current.delete(index);
    }
  }, []);

  const handleMouseEnter = useCallback(
    (index: number, char: string) => {
      startAnimation(index, char);
    },
    [startAnimation]
  );

  const handleMouseLeave = useCallback(
    (index: number) => {
      stopAnimation(index);
    },
    [stopAnimation]
  );

  // Track mouse movement to catch fast movements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      // Check each character span to see if mouse is over it
      spanRefs.current.forEach((span, index) => {
        if (!span) return;

        const rect = span.getBoundingClientRect();
        const isOver =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        if (isOver && !activeCharsRef.current.has(index)) {
          const char = characters[index];
          if (char) {
            startAnimation(index, char);
          }
        } else if (!isOver && activeCharsRef.current.has(index)) {
          stopAnimation(index);
        }
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
      // Clean up all intervals
      intervalsRef.current.forEach((interval) => {
        if (interval) clearInterval(interval);
      });
    };
  }, [startAnimation, stopAnimation, characters]);

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
      ref={containerRef}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8 }}
    >
      {characters.map((char, index) => {
        const isSpace = char === " ";
        const fontIndex = fontIndices[index] ?? 0;
        const isHebrew = isHebrewChar(char);
        const fontList = isHebrew ? HEBREW_FONT_FAMILIES : LATIN_FONT_FAMILIES;
        const fontFamily = fontList[fontIndex];
        const color = getCharacterColor(index);

        return (
          <span
            key={`${char}-${index}`}
            ref={(el) => (spanRefs.current[index] = el)}
            onMouseEnter={() => handleMouseEnter(index, char)}
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
