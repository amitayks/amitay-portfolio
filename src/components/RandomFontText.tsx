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
      // If already animating, just mark it as active and continue
      if (intervalsRef.current[index]) {
        activeCharsRef.current.add(index);
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

  const handleTouchStart = useCallback(
    (index: number, char: string) => {
      startAnimation(index, char);
    },
    [startAnimation]
  );

  const handleTouchEnd = useCallback(
    (index: number) => {
      stopAnimation(index);
    },
    [stopAnimation]
  );

  // Track mouse movement to catch fast movements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      // Extended hover area padding (in pixels)
      const HOVER_PADDING = 30;
      // Number of neighboring characters to affect on each side
      const NEIGHBOR_RANGE = 2;

      // Check each character span to see if mouse is over it (with extended area)
      spanRefs.current.forEach((span, index) => {
        if (!span) return;

        const rect = span.getBoundingClientRect();
        // Expand the detection area with padding
        const isOver =
          e.clientX >= rect.left - HOVER_PADDING &&
          e.clientX <= rect.right + HOVER_PADDING &&
          e.clientY >= rect.top - HOVER_PADDING &&
          e.clientY <= rect.bottom + HOVER_PADDING;

        if (isOver) {
          // Trigger animation for the hovered character
          const char = characters[index];
          if (char && char !== " ") {
            startAnimation(index, char);
          }

          // Also trigger animation for neighboring characters
          for (let offset = -NEIGHBOR_RANGE; offset <= NEIGHBOR_RANGE; offset++) {
            if (offset === 0) continue; // Skip the main character (already handled)

            const neighborIndex = index + offset;
            if (neighborIndex >= 0 && neighborIndex < characters.length) {
              const neighborChar = characters[neighborIndex];
              if (neighborChar && neighborChar !== " ") {
                startAnimation(neighborIndex, neighborChar);
              }
            }
          }
        } else if (!isOver && activeCharsRef.current.has(index)) {
          // Only stop animation if mouse is completely outside the extended area
          // and no neighboring characters are being hovered
          let shouldStop = true;
          for (let offset = -NEIGHBOR_RANGE; offset <= NEIGHBOR_RANGE; offset++) {
            const neighborIndex = index + offset;
            if (neighborIndex >= 0 && neighborIndex < spanRefs.current.length) {
              const neighborSpan = spanRefs.current[neighborIndex];
              if (neighborSpan) {
                const neighborRect = neighborSpan.getBoundingClientRect();
                const isNearNeighbor =
                  e.clientX >= neighborRect.left - HOVER_PADDING &&
                  e.clientX <= neighborRect.right + HOVER_PADDING &&
                  e.clientY >= neighborRect.top - HOVER_PADDING &&
                  e.clientY <= neighborRect.bottom + HOVER_PADDING;
                if (isNearNeighbor) {
                  shouldStop = false;
                  break;
                }
              }
            }
          }
          if (shouldStop) {
            stopAnimation(index);
          }
        }
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length === 0) return;

      // Extended hover area padding (in pixels)
      const HOVER_PADDING = 30;
      // Number of neighboring characters to affect on each side
      const NEIGHBOR_RANGE = 2;

      // Get the first touch point
      const touch = e.touches[0];
      if (!touch) return;

      // Check each character span to see if touch is over it (with extended area)
      spanRefs.current.forEach((span, index) => {
        if (!span) return;

        const rect = span.getBoundingClientRect();
        // Expand the detection area with padding
        const isOver =
          touch.clientX >= rect.left - HOVER_PADDING &&
          touch.clientX <= rect.right + HOVER_PADDING &&
          touch.clientY >= rect.top - HOVER_PADDING &&
          touch.clientY <= rect.bottom + HOVER_PADDING;

        if (isOver) {
          // Trigger animation for the touched character
          const char = characters[index];
          if (char && char !== " ") {
            startAnimation(index, char);
          }

          // Also trigger animation for neighboring characters
          for (let offset = -NEIGHBOR_RANGE; offset <= NEIGHBOR_RANGE; offset++) {
            if (offset === 0) continue; // Skip the main character (already handled)

            const neighborIndex = index + offset;
            if (neighborIndex >= 0 && neighborIndex < characters.length) {
              const neighborChar = characters[neighborIndex];
              if (neighborChar && neighborChar !== " ") {
                startAnimation(neighborIndex, neighborChar);
              }
            }
          }
        } else if (!isOver && activeCharsRef.current.has(index)) {
          // Only stop animation if touch is completely outside the extended area
          // and no neighboring characters are being touched
          let shouldStop = true;
          for (let offset = -NEIGHBOR_RANGE; offset <= NEIGHBOR_RANGE; offset++) {
            const neighborIndex = index + offset;
            if (neighborIndex >= 0 && neighborIndex < spanRefs.current.length) {
              const neighborSpan = spanRefs.current[neighborIndex];
              if (neighborSpan) {
                const neighborRect = neighborSpan.getBoundingClientRect();
                const isNearNeighbor =
                  touch.clientX >= neighborRect.left - HOVER_PADDING &&
                  touch.clientX <= neighborRect.right + HOVER_PADDING &&
                  touch.clientY >= neighborRect.top - HOVER_PADDING &&
                  touch.clientY <= neighborRect.bottom + HOVER_PADDING;
                if (isNearNeighbor) {
                  shouldStop = false;
                  break;
                }
              }
            }
          }
          if (shouldStop) {
            stopAnimation(index);
          }
        }
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("touchmove", handleTouchMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("touchmove", handleTouchMove);
      }
      // Clean up all intervals
      intervalsRef.current.forEach((interval) => {
        if (interval) clearInterval(interval);
      });
    };
  }, [startAnimation, stopAnimation, characters]);

  // Automatic random character font changes
  useEffect(() => {
    const autoChangeInterval = setInterval(() => {
      // Pick a random character index (excluding spaces)
      const nonSpaceIndices = characters
        .map((char, index) => (char !== " " ? index : -1))
        .filter((index) => index !== -1);

      if (nonSpaceIndices.length === 0) return;

      // Randomly decide how many characters to change (1 to 5 characters)
      const numCharsToChange = Math.floor(Math.random() * 5) + 1;

      // Shuffle the indices and pick the first N
      const shuffled = [...nonSpaceIndices].sort(() => Math.random() - 0.5);
      const selectedIndices = shuffled.slice(0, Math.min(numCharsToChange, nonSpaceIndices.length));

      // Change fonts for all selected characters at once
      setFontIndices((prev) => {
        const newIndices = [...prev];
        selectedIndices.forEach((randomIndex) => {
          const char = characters[randomIndex];
          if (char) {
            newIndices[randomIndex] = getRandomFontIndex(char);
          }
        });
        return newIndices;
      });
    }, 500);

    return () => {
      clearInterval(autoChangeInterval);
    };
  }, [characters, getRandomFontIndex]);

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
      exit={{ opacity: 0, y: -20 }}
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
            onTouchStart={() => handleTouchStart(index, char)}
            onTouchEnd={() => handleTouchEnd(index)}
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
