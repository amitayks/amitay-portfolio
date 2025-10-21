import { useTheme } from "@/hooks/useTheme";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import NavigationBar from "./NavigationBar";

function AppLayout() {
  const colors = useTheme();

  return (
    <div
      className="flex flex-col min-h-screen transition-colors duration-200"
      style={{
        backgroundColor: colors.background,
      }}
    >
      <NavigationBar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
