import { Link, useLocation } from "react-router-dom";
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
  const colors = useTheme();
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
        backgroundColor:
          className === "mobile" && isActive ? colors.surfaceSecondary : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = colors.primary;
        }
        if (className === "mobile") {
          e.currentTarget.style.backgroundColor = colors.surfaceSecondary;
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = colors.textSecondary;
        }
        if (className === "mobile" && !isActive) {
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
      onClick={onClick}
    >
      <div className="flex items-center">
        {Icon && <Icon className="h-5 w-5 mr-3" />}
        {input}
      </div>
      {/* {isActive && className === "default" && (
        <div
          className="absolute left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
          style={{ backgroundColor: colors.accent, bottom: "4px" }}
        />
      )} */}
    </Link>
  );
}

export default HeaderTab;
