import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface RandomFontTextProps {
  text: string;
  className?: string;
  baseColor?: string;
  accentColor?: string;
  accentStartIndex?: number;
  accentEndIndex?: number;
}

// Four fonts for ripple effect - Latin/English
// Each ripple cycle uses ONE of these fonts for all characters
const LATIN_RIPPLE_FONTS = [
  "Futura, sans-serif", // Font 1: Modern Sans-Serif
  "Garamond, serif", // Font 2: Classic Serif
  "Impact, sans-serif", // Font 3: Bold Display
  "Didot, serif", // Font 4: Elegant
];

// Four fonts for ripple effect - Hebrew
// Each ripple cycle uses ONE of these fonts for all characters
const HEBREW_RIPPLE_FONTS = [
  "Arial Hebrew, sans-serif", // Font 1: Clean Modern
  "Guttman Calligraphic, cursive", // Font 2: Decorative Calligraphic
  "David, serif", // Font 3: Traditional
  "Guttman Yad-Brush, fantasy", // Font 4: Unique Style
];

// Full array of all fonts for hover interaction (includes core fonts + extra crazy fonts)
const LATIN_FONT_FAMILIES = [
  // Core Modern Sans-Serif
  "Futura, sans-serif",
  "Avenir, sans-serif",
  "Century Gothic, sans-serif",
  "Arial, sans-serif",
  "Helvetica, sans-serif",
  "Verdana, sans-serif",
  "Tahoma, sans-serif",
  "Trebuchet MS, sans-serif",
  "Gill Sans, sans-serif",
  "Segoe UI, sans-serif",
  "Roboto, sans-serif",
  "Oxygen, sans-serif",
  "Ubuntu, sans-serif",
  "Cantarell, sans-serif",
  "Fira Sans, sans-serif",
  "Droid Sans, sans-serif",
  "Helvetica Neue, sans-serif",
  "Optima, sans-serif",

  // Core Classic Serif
  "Garamond, serif",
  "Baskerville, serif",
  "Didot, serif",
  "Times New Roman, serif",
  "Georgia, serif",
  "Palatino, serif",
  "Bodoni MT, serif",
  "Cambria, serif",
  "Book Antiqua, serif",
  "Rockwell, serif",
  "Hoefler Text, serif",
  "Perpetua, serif",
  "Cochin, serif",
  "Big Caslon, serif",
  "American Typewriter, serif",

  // Core Display/Bold
  "Impact, sans-serif",
  "Arial Black, sans-serif",
  "Franklin Gothic Medium, sans-serif",

  // Extra Crazy Fonts for Hover
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
  "Courier New, monospace",
  "Courier, monospace",
  "Monaco, monospace",
  "Consolas, monospace",
  "Lucida Console, monospace",
  "Andale Mono, monospace",
  // Additional crazy decorative fonts
  "Zapfino, cursive",
  "Snell Roundhand, cursive",
  "Party LET, fantasy",
  "Stencil, fantasy",
  "Jazz LET, fantasy",
  "Herculanum, fantasy",
  "Phosphate, fantasy",
  "Charcoal, fantasy",
  "Impact, fantasy",
  "Wide Latin, fantasy",
  "Curlz MT, fantasy",
  "Freestyle Script, cursive",
  "French Script MT, cursive",
];

// Full array of all Hebrew fonts for hover interaction
const HEBREW_FONT_FAMILIES = [
  // Core Clean Modern
  "Arial Hebrew, sans-serif",
  "Gisha, sans-serif",
  "Segoe UI, sans-serif",
  "Tahoma, sans-serif",
  "Levenim MT, sans-serif",

  // Core Decorative/Calligraphic
  "Guttman Calligraphic, cursive",
  "Guttman Yad-Brush, fantasy",
  "Guttman Mantova, fantasy",
  "Guttman Yad, cursive",
  "Guttman Stam, fantasy",
  "Guttman Hodes, fantasy",
  "Guttman Vilna, fantasy",
  "Guttman Aram, fantasy",
  "Guttman Kav, fantasy",
  "Guttman Ketubah, cursive",
  "Guttman Yad-Light, cursive",
  "Guttman Fliga, fantasy",
  "Corsiva Hebrew, cursive",

  // Core Traditional
  "David, serif",
  "Miriam, serif",
  "Narkisim, serif",
  "Rod, serif",
  "FrankRuehl, serif",

  // Extra Crazy Decorative Hebrew Fonts for Hover
  "Guttman Rashi, cursive",
  "Guttman Aharoni, fantasy",
  "Guttman Drogolin, fantasy",
  "Guttman Frank, fantasy",
  "Guttman Haim, fantasy",
  "Guttman Kav-Light, fantasy",
  "Guttman Logo, fantasy",
  "Guttman Miryam, fantasy",
  "Guttman Myamfix, fantasy",
  "Guttman Soncino, fantasy",
  "Guttman Soncino-Light, fantasy",
  "Guttman Toledo, fantasy",
  "Shuneet, fantasy",
  "Shuneet Light, fantasy",
  "Ezra SIL, serif",
  "Adobe Hebrew, serif",
  "New Peninim MT, fantasy",
  "Raanana, fantasy",
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
}: RandomFontTextProps) => {
  // Memoize characters array to prevent recreation on every render
  const characters = useMemo(() => Array.from(text), [text]);

  // Initialize character fonts with useMemo to prevent recreation
  const initialFonts = useMemo(
    () =>
      characters.map((char) => {
        const isHebrew = isHebrewChar(char);
        const rippleFonts = isHebrew ? HEBREW_RIPPLE_FONTS : LATIN_RIPPLE_FONTS;
        const firstFont = rippleFonts[0];
        return firstFont ?? "Arial, sans-serif";
      }),
    [characters]
  );

  // State for storing actual font family strings for each character
  const [characterFonts, setCharacterFonts] = useState<string[]>(initialFonts);

  // Track user-hovered characters
  const userHoveredIndicesRef = useRef<Set<number>>(new Set());

  // Refs for DOM elements
  const spanRefs = useRef<(HTMLSpanElement | null)[]>(
    characters.map(() => null)
  );
  const containerRef = useRef<HTMLHeadingElement>(null);

  // Ripple timing refs
  const rippleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const displayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Store characters in ref to access in ripple effect without triggering re-runs
  const charactersRef = useRef(characters);

  // Update ref when characters change
  useEffect(() => {
    charactersRef.current = characters;
  }, [characters]);

  // Get random font from full font array (for hover interaction)
  const getRandomFont = useCallback((char: string): string => {
    const isHebrew = isHebrewChar(char);
    const fontList = isHebrew ? HEBREW_FONT_FAMILIES : LATIN_FONT_FAMILIES;
    const randomIndex = Math.floor(Math.random() * fontList.length);
    const selectedFont = fontList[randomIndex];
    return selectedFont ?? (isHebrew ? "Arial Hebrew, sans-serif" : "Arial, sans-serif");
  }, []);

  // Get ripple font for a character based on current cycle
  // Returns ONE font for the entire ripple cycle
  const getRippleFontStable = (char: string, cycleIndex: number): string => {
    const isHebrew = isHebrewChar(char);
    const rippleFonts = isHebrew ? HEBREW_RIPPLE_FONTS : LATIN_RIPPLE_FONTS;

    // Use modulo 4 since we now have 4 fonts
    const selectedFont = rippleFonts[cycleIndex % 4];

    return selectedFont ?? (isHebrew ? "Arial Hebrew, sans-serif" : "Arial, sans-serif");
  };

  // Change character font once when hovered
  const changeCharacterFont = useCallback(
    (index: number, char: string) => {
      // Mark that user hovered this character
      userHoveredIndicesRef.current.add(index);

      // Change font once to a random font
      setCharacterFonts((prev) => {
        const newFonts = [...prev];
        newFonts[index] = getRandomFont(char);
        return newFonts;
      });
    },
    [getRandomFont]
  );

  const handleMouseEnter = useCallback(
    (index: number, char: string) => {
      if (char !== " ") {
        changeCharacterFont(index, char);
      }
    },
    [changeCharacterFont]
  );

  const handleTouchStart = useCallback(
    (index: number, char: string) => {
      if (char !== " ") {
        changeCharacterFont(index, char);
      }
    },
    [changeCharacterFont]
  );

  // Track which character was last hovered to avoid re-triggering
  const lastHoveredRef = useRef<number>(-1);

  // Track mouse movement to detect new hovers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      // Extended hover area padding (in pixels)
      const HOVER_PADDING = 30;
      // Number of neighboring characters to affect on each side
      const NEIGHBOR_RANGE = 2;

      let currentHoveredIndex = -1;

      // Find which character is currently being hovered
      for (let index = 0; index < spanRefs.current.length; index++) {
        const span = spanRefs.current[index];
        if (!span) continue;

        const rect = span.getBoundingClientRect();
        const isOver =
          e.clientX >= rect.left - HOVER_PADDING &&
          e.clientX <= rect.right + HOVER_PADDING &&
          e.clientY >= rect.top - HOVER_PADDING &&
          e.clientY <= rect.bottom + HOVER_PADDING;

        if (isOver) {
          currentHoveredIndex = index;
          break;
        }
      }

      // If hovering a new character, trigger font change
      if (currentHoveredIndex !== -1 && currentHoveredIndex !== lastHoveredRef.current) {
        lastHoveredRef.current = currentHoveredIndex;

        const char = charactersRef.current[currentHoveredIndex];
        if (char && char !== " ") {
          changeCharacterFont(currentHoveredIndex, char);

          // Also change neighboring characters
          for (let offset = -NEIGHBOR_RANGE; offset <= NEIGHBOR_RANGE; offset++) {
            if (offset === 0) continue;

            const neighborIndex = currentHoveredIndex + offset;
            if (neighborIndex >= 0 && neighborIndex < charactersRef.current.length) {
              const neighborChar = charactersRef.current[neighborIndex];
              if (neighborChar && neighborChar !== " ") {
                changeCharacterFont(neighborIndex, neighborChar);
              }
            }
          }
        }
      } else if (currentHoveredIndex === -1) {
        // Reset when not hovering any character
        lastHoveredRef.current = -1;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length === 0) return;

      const HOVER_PADDING = 30;
      const NEIGHBOR_RANGE = 2;

      const touch = e.touches[0];
      if (!touch) return;

      let currentHoveredIndex = -1;

      // Find which character is being touched
      for (let index = 0; index < spanRefs.current.length; index++) {
        const span = spanRefs.current[index];
        if (!span) continue;

        const rect = span.getBoundingClientRect();
        const isOver =
          touch.clientX >= rect.left - HOVER_PADDING &&
          touch.clientX <= rect.right + HOVER_PADDING &&
          touch.clientY >= rect.top - HOVER_PADDING &&
          touch.clientY <= rect.bottom + HOVER_PADDING;

        if (isOver) {
          currentHoveredIndex = index;
          break;
        }
      }

      // If touching a new character, trigger font change
      if (currentHoveredIndex !== -1 && currentHoveredIndex !== lastHoveredRef.current) {
        lastHoveredRef.current = currentHoveredIndex;

        const char = charactersRef.current[currentHoveredIndex];
        if (char && char !== " ") {
          changeCharacterFont(currentHoveredIndex, char);

          // Also change neighboring characters
          for (let offset = -NEIGHBOR_RANGE; offset <= NEIGHBOR_RANGE; offset++) {
            if (offset === 0) continue;

            const neighborIndex = currentHoveredIndex + offset;
            if (neighborIndex >= 0 && neighborIndex < charactersRef.current.length) {
              const neighborChar = charactersRef.current[neighborIndex];
              if (neighborChar && neighborChar !== " ") {
                changeCharacterFont(neighborIndex, neighborChar);
              }
            }
          }
        }
      } else if (currentHoveredIndex === -1) {
        lastHoveredRef.current = -1;
      }
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
    };
  }, [changeCharacterFont]);

  // Ripple effect - cycles through three font sets
  useEffect(() => {
    let currentCycle = 0;
    let isActive = true; // Flag to prevent updates after cleanup

    const startRipple = () => {
      if (!isActive) return;

      // Ripple through each character at 100ms per character
      const rippleCharacter = (charIndex: number) => {
        if (!isActive) return;

        const currentChars = charactersRef.current;

        if (charIndex >= currentChars.length) {
          // Ripple complete - wait 3 seconds (display time) then immediately start next cycle
          displayTimeoutRef.current = setTimeout(() => {
            if (!isActive) return;

            // Move to next font cycle (use modulo 4 for 4 fonts)
            currentCycle = (currentCycle + 1) % 4;
            // Immediately start next ripple (no pause)
            startRipple();
          }, 3000); // 3 second display time
          return;
        }

        const char = currentChars[charIndex];
        if (char && char !== " ") {
          // Update this character's font to the current cycle's ripple font
          setCharacterFonts((prev) => {
            const newFonts = [...prev];
            newFonts[charIndex] = getRippleFontStable(char, currentCycle);
            return newFonts;
          });

          // If this character was hovered by user, remove it from the hovered set
          // so it returns to the ripple font
          userHoveredIndicesRef.current.delete(charIndex);
        }

        // Move to next character after 100ms
        rippleTimeoutRef.current = setTimeout(() => {
          rippleCharacter(charIndex + 1);
        }, 100);
      };

      // Start rippling from first character
      rippleCharacter(0);
    };

    // Start initial ripple on mount
    startRipple();

    return () => {
      // Set flag to prevent further updates
      isActive = false;

      // Cleanup timeouts
      if (rippleTimeoutRef.current) {
        clearTimeout(rippleTimeoutRef.current);
      }
      if (displayTimeoutRef.current) {
        clearTimeout(displayTimeoutRef.current);
      }
    };
  }, []); // Empty dependencies - only run once on mount

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
        const fontFamily = characterFonts[index];
        const color = getCharacterColor(index);

        return (
          <span
            key={`${char}-${index}`}
            ref={(el) => (spanRefs.current[index] = el)}
            onMouseEnter={() => handleMouseEnter(index, char)}
            onTouchStart={() => handleTouchStart(index, char)}
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
