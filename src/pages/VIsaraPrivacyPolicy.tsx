import { useTheme } from "@/hooks/useTheme";
import { marked } from "marked";
import { useEffect } from "react";
import { privacyPolicy } from "../../constants/VISARA_PRIVACY_POLICY";

function VIsaraPrivacyPolicy() {
  const colors = useTheme();

  useEffect(() => {
    document.title = "Visara Privacy Policy | Keisar Club";
  }, []);

  return (
    <div
      style={{ backgroundColor: colors.background }}
      className="min-h-screen flex flex-col items-center px-2 sm:px-6 py-10"
    >
      <div
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
        }}
        className="w-full max-w-3xl rounded-2xl shadow-lg p-6 sm:p-10 border"
      >
        <h1
          style={{ color: colors.primary }}
          className="text-3xl sm:text-4xl font-bold text-center mb-6"
        >
          Visara Privacy Policy
        </h1>
        <div
          style={{ color: colors.text }}
          className="portfolio-content text-base sm:text-lg"
          dangerouslySetInnerHTML={{ __html: marked.parse(privacyPolicy) }}
        />
      </div>
    </div>
  );
}

export default VIsaraPrivacyPolicy;
