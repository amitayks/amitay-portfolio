import { useTheme } from "@/hooks/useTheme";
import { AlertTriangle, ArrowLeft, Home, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ErrorComponentProps } from "../types/error";

const ErrorComponent = ({
  message = "Something went wrong",
  details,
  showRetry = false,
  onRetry,
  showNavigation = false,
  actionText,
  onAction,
  size = "md",
  fullPage = false,
}: ErrorComponentProps) => {
  const navigate = useNavigate();
  const colors = useTheme();

  const handleGoHome = () => navigate("/");
  const handleGoBack = () => navigate(-1);

  const sizeConfig = {
    sm: {
      container: "p-4",
      icon: "h-8 w-8",
      title: "text-lg",
      message: "text-sm",
      button: "px-3 py-1.5 text-sm",
    },
    md: {
      container: "p-6",
      icon: "h-12 w-12",
      title: "text-xl",
      message: "text-base",
      button: "px-4 py-2 text-sm",
    },
    lg: {
      container: "p-8",
      icon: "h-16 w-16",
      title: "text-2xl",
      message: "text-lg",
      button: "px-6 py-3 text-base",
    },
  };

  const config = sizeConfig[size];

  const containerClasses = fullPage
    ? `min-h-screen flex items-center justify-center`
    : `flex items-center justify-center ${config.container}`;

  return (
    <div
      style={{ backgroundColor: fullPage ? colors.background : "transparent" }}
      className={containerClasses}
    >
      <div className="text-center max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          <div
            style={{ backgroundColor: colors.error }}
            className="inline-flex items-center justify-center rounded-full p-3"
          >
            <AlertTriangle
              style={{ color: colors.textInverse }}
              className={`${config.icon}`}
              aria-hidden="true"
            />
          </div>
        </div>

        <h3
          style={{ color: colors.primary }}
          className={`${config.title} font-semibold mb-2`}
        >
          Error
        </h3>

        <p style={{ color: colors.textSecondary }} className={`${config.message} mb-4`}>
          {message}
        </p>

        {details && (
          <div
            style={{ backgroundColor: colors.surfaceSecondary, borderColor: colors.border }}
            className="border rounded-md p-3 mb-4"
          >
            <p style={{ color: colors.error }} className="text-sm font-mono">
              {details}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              style={{ backgroundColor: colors.accent, color: colors.textInverse }}
              className={`${config.button} inline-flex items-center justify-center rounded-md font-medium hover:opacity-90 transition-colors`}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
          )}

          {actionText && onAction && (
            <button
              onClick={onAction}
              style={{ backgroundColor: colors.surface, color: colors.primary }}
              className={`${config.button} inline-flex items-center justify-center rounded-md font-medium hover:opacity-90 transition-colors`}
            >
              {actionText}
            </button>
          )}

          {showNavigation && (
            <>
              <button
                onClick={handleGoBack}
                style={{
                  backgroundColor: colors.surface,
                  color: colors.primary,
                  borderColor: colors.border,
                }}
                className={`${config.button} inline-flex items-center justify-center border rounded-md font-medium hover:opacity-90 transition-colors`}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </button>

              <button
                onClick={handleGoHome}
                style={{
                  backgroundColor: colors.surface,
                  color: colors.primary,
                  borderColor: colors.border,
                }}
                className={`${config.button} inline-flex items-center justify-center border rounded-md font-medium hover:opacity-90 transition-colors`}
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </button>
            </>
          )}
        </div>

        {fullPage && (
          <p style={{ color: colors.textSecondary }} className={`mt-6 text-sm`}>
            If this problem persists, please{" "}
            <a
              href="/contact"
              style={{ color: colors.accent }}
              className="font-medium hover:opacity-80"
            >
              contact support
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
};

export default ErrorComponent;
