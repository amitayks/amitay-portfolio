import { useTheme } from "@/hooks/useTheme";
import { PERSONAL_INFO, SOCIAL_LINKS } from "../utils/constants";
import Logo from "./Logo";
import SocialLinksComponent from "./SocialLinksComponent";

const Footer = () => {
  const colors = useTheme();

  return (
    <footer
      style={{
        backgroundColor: colors.surface,
        borderTop: `1px solid ${colors.border}`,
      }}
      className="py-20 flex items-center justify-center"
    >
      <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center mb-6">
          <Logo
            width={32}
            height={32}
            fill={colors.primary}
            style={{ transform: "scaleX(-1)" }}
          />
          <span
            className="ml-3 text-xl font-bold aspect-"
            style={{ color: colors.primary }}
          >
            {PERSONAL_INFO.name}
          </span>
        </div>

        <p style={{ color: colors.textSecondary }} className="mb-8 max-w-md leading-relaxed text-center">
          {PERSONAL_INFO.tagline}
        </p>

        <div className="mb-8">
          <SocialLinksComponent socialLinks={SOCIAL_LINKS} variant="outline" />
        </div>

        <div
          style={{ borderTop: `1px solid ${colors.border}` }}
          className="pt-8 w-full flex justify-center"
        >
          <p style={{ color: colors.textSecondary }} className="text-sm">
            &copy; {new Date().getFullYear()} {PERSONAL_INFO.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
