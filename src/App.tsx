import { useState } from "react";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { queryClient, persistOptions } from "@/lib/queryClient";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { IntroProvider } from "@/contexts/IntroContext";
import { FlipCard } from "@/components/FlipCard";
import { IntroOverlay } from "@/components/IntroOverlay";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/sections/Hero";
import { ProductsBar } from "@/sections/ProductsBar";
import { CodeCarousel } from "@/sections/CodeCarousel";
import { About } from "@/sections/About";
import { SkillsGrid } from "@/sections/SkillsGrid";
import { Stats } from "@/sections/Stats";
import { HowIWork } from "@/sections/HowIWork";
import { Testimonials } from "@/sections/Testimonials";
import { Contact } from "@/sections/Contact";
import { Footer } from "@/sections/Footer";
import { ProjectModal } from "@/components/ProjectModal";
import { ShaderBackground } from "@/components/ShaderBackground";
import { VideoFades } from "@/components/HlsVideo";

function AppContent() {
  const [selectedSku, setSelectedSku] = useState<string | null>(null);

  return (
    <div className="bg-black overflow-visible">
      <Navbar />
      <main>
        <Hero />
        <SkillsGrid />
        <div id="work" className="scroll-mt-20">
          <ProductsBar />
          <CodeCarousel onProjectClick={setSelectedSku} />
        </div>
        <HowIWork />
        <div className="relative">
          <ShaderBackground variant="about" />
          <VideoFades />
          <About />
          <Stats />
        </div>
        <CodeCarousel onProjectClick={setSelectedSku} direction="left" />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <ProjectModal sku={selectedSku} onClose={() => setSelectedSku(null)} />
    </div>
  );
}

export default function App() {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
      <LanguageProvider>
        <IntroProvider>
          <AppContent />
          <FlipCard />
          <IntroOverlay />
        </IntroProvider>
      </LanguageProvider>
    </PersistQueryClientProvider>
  );
}
