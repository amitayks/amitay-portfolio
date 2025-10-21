import { useTheme } from "@/hooks/useTheme";
import { Link } from "react-router-dom";

function CTASection() {
  const colors = useTheme();

  return (
    <section
      style={{
        background: `linear-gradient(to bottom left, ${colors.surfaceSecondary}, ${colors.surface})`,
      }}
      className="py-20"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          style={{ color: colors.primary }}
          className="text-3xl lg:text-4xl font-bold mb-6"
        >
          Let's Create Something Amazing Together
        </h2>
        <p style={{ color: colors.textSecondary }} className="text-xl mb-8 max-w-3xl mx-auto">
          Whether you have a project in mind or just want to connect, I'm always open to discussing
          new opportunities and collaborations.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/portfolio"
            style={{ backgroundColor: colors.accent, color: colors.textInverse }}
            className="inline-flex items-center px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            View My Portfolio
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
    </section>
  );
}

export default CTASection;
