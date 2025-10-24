import { Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { PROJECT_TYPES } from "../utils/constants";

function PortfolioFilter() {
  const { t } = useTranslation("common");
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get("type") || PROJECT_TYPES?.[0]?.value;
  const { colors } = useTheme();

  function handleFilterChange(value: string) {
    searchParams.set("type", value);
    setSearchParams(searchParams);
  }

  return (
    <div dir="ltr">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <Filter style={{ color: colors.textTertiary }} className="h-5 w-5 flex-shrink-0" />
            <div className="flex gap-2 ">
              {PROJECT_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant={currentFilter === type.value ? "default" : "secondary"}
                  onClick={() => handleFilterChange(type.value)}
                >
                  {t(type.translationKey)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortfolioFilter;
