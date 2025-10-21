import { motion } from "framer-motion";
import { Briefcase, Calendar, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/hooks/useTheme";
import { TimelineSectionProps } from "../types/Timeline";

const TimelineSection = ({ title, icon, items, type = "education" }: TimelineSectionProps) => {
  const colors = useTheme();

  const getIconComponent = () => {
    const iconColor = type === "education" ? colors.info : colors.accent;
    switch (icon) {
      case "graduation":
        return <GraduationCap style={{ color: iconColor }} className="w-8 h-8 mr-3" />;
      case "briefcase":
        return <Briefcase style={{ color: iconColor }} className="w-8 h-8 mr-3" />;
      default:
        return <GraduationCap style={{ color: iconColor }} className="w-8 h-8 mr-3" />;
    }
  };

  const getTimelineColor = () => {
    return type === "education" ? colors.info : colors.accent;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div>
      <motion.div
        className="flex items-center md:justify-normal justify-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          {getIconComponent()}
        </motion.div>
        <h2 style={{ color: colors.primary }} className="text-3xl font-bold">
          {title}
        </h2>
      </motion.div>

      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="relative pl-8"
            style={{ borderLeft: `2px solid ${colors.border}` }}
          >
            {/* Timeline dot with pulse animation */}
            <motion.div
              style={{ backgroundColor: getTimelineColor() }}
              className="absolute w-4 h-4 rounded-full -left-2.5 top-0"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.3 }}
            >
              <motion.div
                style={{ backgroundColor: getTimelineColor() }}
                className="absolute inset-0 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 0, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.02, x: 5 }} transition={{ duration: 0.2 }}>
              <Card
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }}
                className="shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <CardTitle style={{ color: colors.primary }} className="text-xl font-semibold">
                      {item.title}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: getTimelineColor(),
                        color: getTimelineColor(),
                      }}
                      className="flex items-center gap-1"
                    >
                      <Calendar className="w-3 h-3" />
                      {item.period}
                    </Badge>
                  </div>
                  <CardDescription
                    style={{ color: colors.textSecondary }}
                    className="font-medium text-base"
                  >
                    {item.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.p
                    style={{ color: colors.textSecondary }}
                    className="leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
                  >
                    {item.description}
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default TimelineSection;
