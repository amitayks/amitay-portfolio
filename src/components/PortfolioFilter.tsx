import { useTheme } from "@/hooks/useTheme";
import { Filter } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { PROJECT_TYPES } from "../utils/constants";

function PortfolioFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get("type") || PROJECT_TYPES?.[0]?.value;
  const colors = useTheme();

  function handleFilterChange(value: string) {
    searchParams.set("type", value);
    setSearchParams(searchParams);
  }

  return (
    <div
      style={{
        background: `linear-gradient(to bottom right, ${colors.surface}, ${colors.surfaceSecondary})`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <Filter style={{ color: colors.textTertiary }} className="h-5 w-5 flex-shrink-0" />
            <div className="flex gap-2 ">
              {PROJECT_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleFilterChange(type.value)}
                  style={{
                    backgroundColor: currentFilter === type.value ? colors.accent : colors.surface,
                    color: currentFilter === type.value ? colors.textInverse : colors.text,
                  }}
                  className={`px-4 py-2 text-sm rounded-lg whitespace-nowrap transition-colors font-medium`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PortfolioFilter;
