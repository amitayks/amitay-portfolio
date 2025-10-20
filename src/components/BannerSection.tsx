import { useTheme } from "@/hooks/useTheme";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteImage } from "../hooks/useSiteImages";
import { PERSONAL_INFO, SOCIAL_LINKS } from "../utils/constants";
import SocialLinksComponent from "./SocialLinksComponent";

function BannerSection() {
  const { image } = useSiteImage(PERSONAL_INFO.profileImage2);
  const colors = useTheme();

  return (
    <section
      style={{
        background: `linear-gradient(to bottom right, ${colors.surfaceSecondary}, ${colors.surface})`,
      }}
      className="relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left px-6">
            <div
              style={{ backgroundColor: colors.surfaceSecondary, color: colors.accent }}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <span
                style={{ backgroundColor: colors.success }}
                className="w-2 h-2 rounded-full mr-2 animate-pulse"
              />
              Available for new projects
            </div>

            <h1
              style={{ color: colors.primary }}
              className="text-4xl lg:text-4xl font-bold mb-2 leading-tight"
            >
              Hi, I'm{" "}
            </h1>
            <h1
              style={{ color: colors.primary }}
              className="text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              <span
                style={{
                  background: `linear-gradient(to right, ${colors.accent}, ${colors.info})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {PERSONAL_INFO.name}
              </span>
            </h1>

            <p
              style={{ color: colors.textSecondary }}
              className="text-xl lg:text-2xl font-medium mb-4"
            >
              {PERSONAL_INFO.title}
            </p>

            <p
              style={{ color: colors.textTertiary }}
              className="text-lg leading-relaxed max-w-2xl mb-8"
            >
              {PERSONAL_INFO.bio}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/portfolio"
                style={{ backgroundColor: colors.accent, color: colors.textInverse }}
                className="inline-flex items-center px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl group"
              >
                View My Work
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                style={{
                  backgroundColor: colors.surface,
                  color: colors.primary,
                  borderColor: colors.border,
                }}
                className="inline-flex items-center px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl border"
              >
                Get In Touch
              </Link>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative w-80 h-80 lg:w-96 lg:h-96">
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
                alt={PERSONAL_INFO.name}
                className="relative w-full h-full object-cover rounded-3xl shadow-2xl inset-0"
                onLoad={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.opacity = "1";
                }}
                style={{ opacity: 0, transition: "opacity 0.3s ease-in-out" }}
              />
            </div>

            <div className="absolute -right-[-3rem] top-1/2 -translate-y-1/2 md:-right-[-10rem] lg:-right-[-4rem] ">
              <div className="md:hidden">
                <SocialLinksComponent
                  socialLinks={SOCIAL_LINKS}
                  variant="filled"
                  orientation="vertical"
                  size="md"
                  className="flex flex-col gap-2"
                />
              </div>

              <div className="hidden md:block">
                <SocialLinksComponent
                  socialLinks={SOCIAL_LINKS}
                  variant="filled"
                  orientation="vertical"
                  size="lg"
                  className="flex flex-col gap-4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BannerSection;
