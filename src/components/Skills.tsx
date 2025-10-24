import { useTheme } from "@/hooks/useTheme";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SKILLS } from "../utils/constants";

function Skills({ style, aboutButton }: { style?: string; aboutButton: boolean }) {
  const { t } = useTranslation("about");
  const { colors } = useTheme();

  const getLevelColor = (level: string) => {
    switch (level) {
      case "expert":
        return colors.success;
      case "advanced":
        return colors.info;
      case "intermediate":
        return colors.warning;
      default:
        return colors.textTertiary;
    }
  };

  const getLevelValue = (level: string) => {
    switch (level) {
      case "expert":
        return 100;
      case "advanced":
        return 80;
      case "intermediate":
        return 60;
      default:
        return 40;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className={`py-20 ${style}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2
            style={{ color: colors.primary }}
            className="text-3xl lg:text-4xl font-bold mb-4"
          >
            {t("skills.title")}
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {SKILLS.map((skillCategory, index) => (
            <motion.div
              key={skillCategory.category}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="mx-10 md:mx-5 lg:mx-0"
            >
              <Card
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }}
                className="shadow-sm hover:shadow-xl transition-shadow duration-300 border h-full flex flex-col"
              >
                <CardHeader>
                  <CardTitle
                    style={{ color: colors.primary }}
                    className="text-xl font-semibold"
                  >
                    {skillCategory.category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <motion.div
                    className="space-y-2 mb-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                  >
                    {skillCategory.skills.map((skill, i) => (
                      <motion.div
                        key={skill}
                        className="flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.1 * i, duration: 0.3 }}
                      >
                        <span
                          style={{ color: colors.textSecondary }}
                          className="text-sm"
                        >
                          • {skill}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: getLevelColor(skillCategory.level),
                          color: colors.textInverse,
                        }}
                        className="capitalize"
                      >
                        {t(`skills.levels.${skillCategory.level}`)}
                      </Badge>
                      <motion.span
                        style={{ color: colors.textTertiary }}
                        className="text-sm font-medium"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
                      >
                        {getLevelValue(skillCategory.level)}%
                      </motion.span>
                    </div>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{
                        delay: index * 0.1 + 0.4,
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                      style={{ transformOrigin: "left" }}
                    >
                      <Progress
                        value={getLevelValue(skillCategory.level)}
                        className="h-2"
                        style={{
                          backgroundColor: colors.surfaceSecondary,
                        }}
                      />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {aboutButton && (
          <motion.div
            className="flex items-center justify-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/about"
                style={{ backgroundColor: colors.accent, color: colors.textInverse }}
                className="inline-flex items-center px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl group"
              >
                {t("skills.learnMore")}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default Skills;
