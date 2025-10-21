import BannerSection from "../components/BannerSection";
import CTASection from "../components/CTASection";
import ExperienceSection from "../components/ExperienceSection";
import Skills from "../components/Skills";
import { PERSONAL_INFO } from "../utils/constants";

const About = () => {
  return (
    <div>
      <BannerSection imageKey={PERSONAL_INFO.profileImage} showAvailabilityBadge={false} />

      <Skills aboutButton={false} />

      <ExperienceSection />

      <CTASection />
    </div>
  );
};

export default About;
