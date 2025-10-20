import { useTheme } from "@/hooks/useTheme";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SKILLS } from "../utils/constants";

function Skills({ style, aboutButton }: { style?: string; aboutButton: boolean }) {
  const colors = useTheme();

  const getLevelColor = (level: string) => {
    switch (level) {
      case "expert":
        return colors.success;
      case "advanced":
        return colors.info;
      case "intermediate":
        return colors.warning;
      default:
        return colors.textTertiary;
    }
  };

  return (
    <section style={{ backgroundColor: colors.background }} className={`py-20  ${style}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            style={{ color: colors.primary }}
            className="text-3xl lg:text-4xl font-bold mb-4"
          >
            {`< Skills & Expertise />`}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SKILLS.map((skillCategory) => (
            <div
              key={skillCategory.category}
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
              className="rounded-2xl p-8 mx-10 md:mx-5 lg:mx-0 shadow-sm hover:shadow-lg transition-all duration-200 border flex flex-col h-full"
            >
              <h3
                style={{ color: colors.primary }}
                className="text-xl font-semibold mb-4"
              >
                {skillCategory.category}
              </h3>

              <div className="space-y-2 flex-grow">
                {skillCategory.skills.map((skill, i) => (
                  <div key={skillCategory.skills[i]} className="flex items-center justify-between">
                    <span style={{ color: colors.textSecondary }}>{skill}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-1 ">
                  <span
                    style={{ color: colors.textTertiary }}
                    className="text-sm capitalize"
                  >
                    {skillCategory.level}
                  </span>
                </div>
                <div
                  style={{ backgroundColor: colors.surfaceSecondary }}
                  className="w-full rounded-full h-2 "
                >
                  <div
                    style={{
                      backgroundColor: getLevelColor(skillCategory.level),
                      width:
                        skillCategory.level === "expert"
                          ? "100%"
                          : skillCategory.level === "advanced"
                          ? "80%"
                          : skillCategory.level === "intermediate"
                          ? "60%"
                          : "40%",
                    }}
                    className={`h-2 rounded-full transition-all duration-500`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        {aboutButton && (
          <div className="flex items-center justify-center mt-10">
            <Link
              to="/about"
              style={{ backgroundColor: colors.accent, color: colors.textInverse }}
              className="inline-flex items-center px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl group"
            >
              Learn More About Me
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default Skills;
