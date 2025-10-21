import { useTheme } from "@/hooks/useTheme";
import BannerSection from "../components/BannerSection";
import FeaturedProjectsSection from "../components/FeaturedProjectsSection";
import Skills from "../components/Skills";

function Home() {
  const colors = useTheme();

  return (
    <div style={{ backgroundColor: colors.background }} className="min-h-screen">
      <BannerSection />

      <FeaturedProjectsSection />
      <Skills aboutButton={true} />
    </div>
  );
}

export default Home;
