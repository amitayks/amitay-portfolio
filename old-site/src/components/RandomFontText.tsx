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

// Custom Keisar Club fonts for ripple effect
// Each ripple cycle uses ONE of these fonts for all characters
const LATIN_RIPPLE_FONTS = [
  "English1, sans-serif",
  "English2, sans-serif",
  "English3, sans-serif",
];

const HEBREW_RIPPLE_FONTS = [
  "Hebrew1, sans-serif",
  "Hebrew2, sans-serif",
  "Hebrew3, sans-serif",
];

// Emoji font for language transition
const EMOJI_TRANSITION_FONT = "Emojis, sans-serif";

// All Keisar Club fonts for hover interaction (use only custom fonts)
const LATIN_FONT_FAMILIES = [
  "English1, sans-serif",
  "English2, sans-serif",
  "English3, sans-serif",
];

const HEBREW_FONT_FAMILIES = [
  "Hebrew1, sans-serif",
  "Hebrew2, sans-serif",
  "Hebrew3, sans-serif",
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
  const getRippleFontStable = (char: string, cycleIndex: number, useEmoji: boolean = false): string => {
    // If emoji transition, return emoji font for all characters
    if (useEmoji) {
      return EMOJI_TRANSITION_FONT;
    }

    const isHebrew = isHebrewChar(char);
    const rippleFonts = isHebrew ? HEBREW_RIPPLE_FONTS : LATIN_RIPPLE_FONTS;

    // Use modulo 3 since we have 3 fonts per language
    const selectedFont = rippleFonts[cycleIndex % 3];

    return selectedFont ?? "English1, sans-serif";
  };

  // Change character font with debounce (allow change only after delay)
  const changeCharacterFont = useCallback(
    (index: number, char: string) => {
      const now = Date.now();
      const lastChangeTime = lastChangeTimeRef.current.get(index) || 0;

      // Check if enough time has passed since last change (debounce)
      if (now - lastChangeTime < DEBOUNCE_DELAY) {
        return; // Skip change if within debounce period
      }

      // Update the last change time for this character
      lastChangeTimeRef.current.set(index, now);

      // Mark that user hovered this character
      userHoveredIndicesRef.current.add(index);

      // Change font to a random font
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

  // Track last change time for each character (for debouncing)
  const lastChangeTimeRef = useRef<Map<number, number>>(new Map());
  const DEBOUNCE_DELAY = 500; // milliseconds between allowed changes

  // Track mouse movement to detect new hovers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      // Extended hover area padding (in pixels)
      const HOVER_PADDING = 30;

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

      // If hovering a new character, trigger font change (debounced)
      if (currentHoveredIndex !== -1 && currentHoveredIndex !== lastHoveredRef.current) {
        lastHoveredRef.current = currentHoveredIndex;

        const char = charactersRef.current[currentHoveredIndex];
        if (char && char !== " ") {
          changeCharacterFont(currentHoveredIndex, char);
        }
      } else if (currentHoveredIndex === -1) {
        // Reset when not hovering any character
        lastHoveredRef.current = -1;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || e.touches.length === 0) return;

      const HOVER_PADDING = 30;

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

      // If touching a new character, trigger font change (debounced)
      if (currentHoveredIndex !== -1 && currentHoveredIndex !== lastHoveredRef.current) {
        lastHoveredRef.current = currentHoveredIndex;

        const char = charactersRef.current[currentHoveredIndex];
        if (char && char !== " ") {
          changeCharacterFont(currentHoveredIndex, char);
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

  // Track text changes to detect language switches
  const previousTextRef = useRef(text);
  const [triggerEmojiRipple, setTriggerEmojiRipple] = useState(false);

  // Detect language change
  useEffect(() => {
    if (previousTextRef.current !== text) {
      // Text changed - trigger emoji ripple
      setTriggerEmojiRipple(true);
      previousTextRef.current = text;
    }
  }, [text]);

  // Ripple effect - cycles through three font sets
  useEffect(() => {
    let currentCycle = 0;
    let isActive = true; // Flag to prevent updates after cleanup
    let isEmojiTransition = triggerEmojiRipple;

    const startRipple = (useEmoji: boolean = false) => {
      if (!isActive) return;

      // Ripple through each character at 100ms per character
      const rippleCharacter = (charIndex: number) => {
        if (!isActive) return;

        const currentChars = charactersRef.current;

        if (charIndex >= currentChars.length) {
          // Ripple complete
          if (useEmoji) {
            // Emoji ripple done - immediately start normal font cycle (no wait)
            setTriggerEmojiRipple(false);
            isEmojiTransition = false;
            currentCycle = 0; // Start from first font
            startRipple(false);
          } else {
            // Normal ripple - wait 1 second before next cycle
            displayTimeoutRef.current = setTimeout(() => {
              if (!isActive) return;

              // Move to next font cycle (use modulo 3 for 3 fonts)
              currentCycle = (currentCycle + 1) % 3;
              // Start next ripple
              startRipple(false);
            }, 1000); // 1 second idle time
          }
          return;
        }

        const char = currentChars[charIndex];
        if (char && char !== " ") {
          // Update this character's font to the current cycle's ripple font
          setCharacterFonts((prev) => {
            const newFonts = [...prev];
            newFonts[charIndex] = getRippleFontStable(char, currentCycle, useEmoji);
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

    // If emoji transition is triggered, start emoji ripple immediately
    if (isEmojiTransition) {
      startRipple(true);
    } else {
      // Start initial ripple on mount
      startRipple(false);
    }

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
  }, [triggerEmojiRipple]); // Re-run when emoji transition is triggered

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
