import { useTheme } from "@/hooks/useTheme";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import NavigationBar from "./NavigationBar";

function AppLayout() {
  const { colors } = useTheme();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "he";

  // Delay direction change to allow exit animations to complete
  const [layoutDir, setLayoutDir] = useState<"rtl" | "ltr">(isRTL ? "rtl" : "ltr");

  useEffect(() => {
    const newDir = isRTL ? "rtl" : "ltr";

    if (newDir !== layoutDir) {
      // Wait 400ms for animations to exit before changing direction
      const timeout = setTimeout(() => {
        setLayoutDir(newDir);
      }, 400);

      return () => clearTimeout(timeout);
    }

    return undefined;
  }, [isRTL, layoutDir]);

  return (
    <div
      className="flex flex-col min-h-screen transition-colors duration-200"
      style={{
        backgroundColor: colors.background,
      }}
    >
      <NavigationBar />
      <main className="flex-grow" dir={layoutDir}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
