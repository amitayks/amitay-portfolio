import { useTheme } from "@/hooks/useTheme";
import BannerSection from "../components/BannerSection";
import FeaturedProjectsSection from "../components/FeaturedProjectsSection";
import Skills from "../components/Skills";

function Home() {
  const colors = useTheme();

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">
      <BannerSection />

      <FeaturedProjectsSection style="bg-gradient-to-tr from-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />
      <Skills aboutButton={true} />
    </div>
  );
}

export default Home;
