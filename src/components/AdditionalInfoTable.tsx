import { useTheme } from "@/hooks/useTheme";
import { PortfolioItem } from "../types/portfolio";

interface AdditionalInfoTableProps {
  additionalInfo: PortfolioItem["additionalInfo"];
}

function AdditionalInfoTable({ additionalInfo }: AdditionalInfoTableProps) {
  const colors = useTheme();

  return (
    <div>
      <div className="space-y-3">
        {additionalInfo.map((info, index) => (
          <div
            key={index}
            style={{ borderBottom: `1px solid ${colors.border}` }}
            className="flex justify-between py-2"
          >
            <span style={{ color: colors.textSecondary }} className="font-medium">
              {info.label}
            </span>
            <span style={{ color: colors.text }}>{info.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdditionalInfoTable;
