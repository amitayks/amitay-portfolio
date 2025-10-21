import { useTheme } from "@/hooks/useTheme";
import CTASection from "../components/CTASection";
import ExperienceSection from "../components/ExperienceSection";
import Skills from "../components/Skills";
import SocialLinksComponent from "../components/SocialLinksComponent";
import { useSiteImage } from "../hooks/useSiteImages";
import { PERSONAL_INFO, SOCIAL_LINKS } from "../utils/constants";

const About = () => {
  const { image } = useSiteImage(PERSONAL_INFO.profileImage);
  const colors = useTheme();

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col">
              <h1
                style={{ color: colors.primary }}
                className=" flex justify-center text-4xl text-center lg:text-5xl font-bold mb-6"
              >
                About {PERSONAL_INFO.name}
              </h1>

              <div className="md:block hidden">
                <SocialLinksComponent
                  socialLinks={SOCIAL_LINKS}
                  variant="filled"
                  showLabels
                  size="sm"
                />
              </div>
              <div className="md:hidden">
                <SocialLinksComponent socialLinks={SOCIAL_LINKS} variant="filled" size="md" />
              </div>
            </div>

            <div className="relative">
              <div className="relative w-80 h-80 mx-auto lg:w-96 lg:h-96">
                <div
                  style={{
                    background: `linear-gradient(to top right, ${colors.accent}, ${colors.info})`,
                  }}
                  className="absolute inset-0 rounded-3xl rotate-6 animate-pulse-20"
                />
                <div
                  style={{
                    background: `linear-gradient(to bottom right, ${colors.info}, ${colors.success})`,
                  }}
                  className="absolute inset-0 rounded-3xl -rotate-6 animate-pulse-20 "
                />
                <img
                  src={image}
                  alt={image}
                  className="relative w-full h-full object-cover rounded-3xl shadow-2xl inset-0"
                  onLoad={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.opacity = "1";
                  }}
                  style={{ opacity: 0, transition: "opacity 0.3s ease-in-out" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Skills aboutButton={false} />

      <ExperienceSection />

      <CTASection />
    </div>
  );
};

export default About;
