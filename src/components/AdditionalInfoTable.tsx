import { motion } from "framer-motion";
import { Table, TableBody, TableCell } from "@/components/ui/table";
import { useTheme } from "@/hooks/useTheme";
import { PortfolioItem } from "../types/portfolio";

interface AdditionalInfoTableProps {
  additionalInfo: PortfolioItem["additionalInfo"];
}

function AdditionalInfoTable({ additionalInfo }: AdditionalInfoTableProps) {
  const { colors } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <Table>
        <TableBody>
          {additionalInfo.map((info, index) => (
            <motion.tr
              key={index}
              variants={rowVariants}
              whileHover={{ x: 4, backgroundColor: colors.surface + "80" }}
              transition={{ duration: 0.2 }}
              // style={{ borderBottom: `1px solid ${colors.buttonDisabled}` }}
            >
              <TableCell style={{ color: colors.textSecondary }} className="font-medium py-4 ">
                {info.label}
              </TableCell>
              <TableCell style={{ color: colors.text }} className="text-right py-4 font-medium">
                {info.value}
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}

export default AdditionalInfoTable;
