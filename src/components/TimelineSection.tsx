import { useTheme } from "@/hooks/useTheme";
import { Briefcase, Calendar, GraduationCap } from "lucide-react";
import { TimelineSectionProps } from "../types/Timeline";

const TimelineSection = ({
  title,
  icon,
  items,
  type = "education",
}: TimelineSectionProps) => {
  const colors = useTheme();

  const getIconComponent = () => {
    const iconColor = type === "education" ? colors.info : colors.accent;
    switch (icon) {
      case "graduation":
        return <GraduationCap style={{ color: iconColor }} className={`w-8 h-8 mr-3`} />;
      case "briefcase":
        return <Briefcase style={{ color: iconColor }} className={`w-8 h-8 mr-3`} />;
      default:
        return <GraduationCap style={{ color: iconColor }} className={`w-8 h-8 mr-3`} />;
    }
  };

  const getTimelineColor = () => {
    return type === "education" ? colors.info : colors.accent;
  };

  return (
    <div>
      <div className="flex items-center md:justify-normal justify-center mb-8">
        {getIconComponent()}
        <h2 style={{ color: colors.primary }} className="text-3xl font-bold">
          {title}
        </h2>
      </div>

      <div className="space-y-8">
        {items.map((item, index) => (
          <div
            key={index}
            style={{ borderLeft: `2px solid ${colors.border}` }}
            className="relative pl-8"
          >
            <div
              style={{ backgroundColor: getTimelineColor() }}
              className={`absolute w-4 h-4 rounded-full -left-2.5 top-0`}
            />
            <div style={{ backgroundColor: colors.surface }} className="rounded-lg p-6">
              <h3 style={{ color: colors.primary }} className="text-xl font-semibold mb-1">
                {item.title}
              </h3>
              <div
                style={{ color: colors.textSecondary }}
                className="flex items-center gap-4 mb-3"
              >
                <span className="font-medium">{item.subtitle}</span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {item.period}
                </span>
              </div>
              <p style={{ color: colors.textSecondary }} className="leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineSection;
