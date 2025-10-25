import { Link, useLocation } from "react-router-dom";
import { AnimatedText } from "@/components/AnimatedText";
import { useTheme } from "@/hooks/useTheme";

function HeaderTab({
  to,
  input,
  className,
  onClick,
  icon: Icon,
}: {
  to: string;
  input?: string;
  className: "default" | "mobile";
  onClick?: () => void;
  icon?: React.ElementType;
}) {
  const location = useLocation();
  const { colors } = useTheme();
  const isActive = location.pathname === to || (to !== "/" && location.pathname.startsWith(to));

  const baseStyles = "px-3 py-2 rounded-lg font-medium transition-all duration-200";
  const mobileStyles =
    "px-20 py-4 rounded-lg font-medium transition-all duration-200 block flex justify-center";

  return (
    <Link
      to={to}
      className={`${className === "default" ? baseStyles : mobileStyles} relative`}
      style={{
        color: isActive ? colors.accent : colors.textSecondary,
        // backgroundColor: className === "mobile" && isActive ? colors.surface : "transparent",
      }}
      onMouseEnter={(e) => {
        if (isActive) {
          e.currentTarget.style.color = colors.info;
        }
        if (!isActive) {
          e.currentTarget.style.color = colors.primary;
        }
      }}
      onMouseLeave={(e) => {
        if (isActive) {
          e.currentTarget.style.color = colors.accent;
        }
        if (!isActive) {
          e.currentTarget.style.color = colors.textSecondary;
        }
      }}
      onClick={onClick}
    >
      <div className="flex items-center">
        {Icon && <Icon className="h-5 w-5 mr-3" />}
        <AnimatedText as="span" variant="fade">
          {input}
        </AnimatedText>
      </div>
    </Link>
  );
}

export default HeaderTab;
