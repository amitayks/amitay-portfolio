import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import NavigationBar from "./NavigationBar";

function AppLayout() {
  const { colors } = useTheme();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "he";

  return (
    <div
      className="flex flex-col min-h-screen transition-colors duration-200"
      style={{
        backgroundColor: colors.background,
      }}
    >
      <NavigationBar />
      <main className="flex-grow" dir={isRTL ? "rtl" : "ltr"}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
