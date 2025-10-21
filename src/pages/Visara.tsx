
import { useTheme } from "@/hooks/useTheme";
import React from 'react';

import EarlyAccessSection from '../components/visara/EarlyAccessSection';
import FeaturesSection from '../components/visara/FeaturesSection';
import HeroSection from '../components/visara/HeroSection';
import OnboardingSection from '../components/visara/OnboardingSection';

const VisaraPage: React.FC = () => {
  const colors = useTheme();

  return (
    <div style={{ backgroundColor: colors.background, color: colors.text }} className="min-h-screen">
      <HeroSection />
      <OnboardingSection />
      <FeaturesSection />
      <EarlyAccessSection />
    </div>
  );
};

export default VisaraPage;
