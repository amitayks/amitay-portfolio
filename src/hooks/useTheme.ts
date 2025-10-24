import { useEffect, useState } from "react";
import { Colors, ThemeResult } from "../../colors";

export const useTheme = (): ThemeResult => {
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains("dark"));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const colors = isDarkMode ? Colors.dark : Colors.light;

  return { colors, isDark: isDarkMode };
};
