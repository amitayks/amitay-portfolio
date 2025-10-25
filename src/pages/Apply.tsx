import emailjs from "@emailjs/browser";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { Colors } from "../../colors";
import { AnimatedText } from "@/components/AnimatedText";
import { RandomFontText } from "@/components/RandomFontText";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { setTheme } from "@/hooks/darkTheme";
import { EMAILJS_CONFIG } from "@/utils/constants";

const createFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(2, {
      message: t("validation.nameMin"),
    }),
    email: z.string().email({
      message: t("validation.emailInvalid"),
    }),
    project: z.string().min(10, {
      message: t("validation.projectMin"),
    }),
    phone: z.string().optional(),
  });

const Apply = () => {
  const { t, i18n } = useTranslation("apply");
  // Force light mode for this page only
  const colors = Colors.light;
  const isRTL = i18n.language === "he";
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Force light mode when this page mounts and restore previous theme on unmount
  useEffect(() => {
    // Save current theme state
    const wasDarkMode = document.documentElement.classList.contains("dark");

    // Force light mode
    setTheme(false);

    // Watch for theme changes and force back to light mode if user tries to switch
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      if (isDark) {
        // User tried to switch to dark mode, force it back to light
        setTheme(false);
      }
    });

    // Observe changes to the document element's class attribute
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Restore previous theme when leaving the page
    return () => {
      observer.disconnect();
      setTheme(wasDarkMode);
    };
  }, []);

  const formSchema = createFormSchema(t);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      project: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const templateParams = {
        from_name: values.name,
        from_email: values.email,
        project: values.project,
        phone: values.phone || "Not provided",
      };

      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.USER_ID
      );

      setFormStatus({
        submitted: true,
        success: true,
      });

      form.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      setFormStatus({
        submitted: true,
        success: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: colors.background,
        color: colors.text,
      }}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Headline with Random Font Animation */}
            <AnimatePresence mode="wait">
              <RandomFontText
                key={i18n.language}
                text={`${t("hero.headline")} ${t("hero.headlineAccent")}`}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight my-12"
                baseColor={colors.primary}
                accentColor={colors.accent}
                accentStartIndex={t("hero.headline").length + 1}
                hoverInterval={100}
              />
            </AnimatePresence>

            {/* <motion.h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8"
              style={{ color: colors.primary }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {t("hero.subHeadline")}
            </motion.h2> */}

            {/* Sub-headline */}
            {/* <motion.p
              className="text-lg sm:text-xl lg:text-2xl leading-relaxed mb-10 max-w-3xl mx-auto"
              style={{ color: colors.textSecondary }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {t("hero.description")}
            </motion.p> */}

            {/* CTA Button */}
            {/* <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={scrollToForm}
                  size="lg"
                  style={{
                    backgroundColor: colors.accent,
                    color: colors.textInverse,
                  }}
                  className="text-lg px-8 py-6 shadow-2xl hover:shadow-3xl group"
                >
                  {t("hero.cta")}
                  <ArrowRight
                    className={`h-6 w-6 group-hover:translate-x-1 transition-transform ${isRTL ? "mr-2 rotate-180" : "ml-2"}`}
                  />
                </Button>
              </motion.div>
            </motion.div> */}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      {/* <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
              style={{ color: colors.primary }}
            >
              {t("howItWorks.title")}
            </h2>
            <p className="text-lg sm:text-xl" style={{ color: colors.textSecondary }}>
              {t("howItWorks.subtitle")}
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={itemVariants}>
              <Card
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }}
                className="p-8 h-full hover:shadow-xl transition-shadow duration-300"
              >
                <motion.div
                  className="flex justify-center mb-6"
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.surfaceSecondary }}
                  >
                    <Lightbulb className="w-10 h-10" style={{ color: colors.accent }} />
                  </div>
                </motion.div>
                <h3
                  className="text-2xl font-bold text-center mb-4"
                  style={{ color: colors.primary }}
                >
                  {t("howItWorks.step1.title")}
                </h3>
                <p className="text-center leading-relaxed" style={{ color: colors.textSecondary }}>
                  {t("howItWorks.step1.description")}
                </p>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }}
                className="p-8 h-full hover:shadow-xl transition-shadow duration-300"
              >
                <motion.div
                  className="flex justify-center mb-6"
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.surfaceSecondary }}
                  >
                    <Sparkles className="w-10 h-10" style={{ color: colors.info }} />
                  </div>
                </motion.div>
                <h3
                  className="text-2xl font-bold text-center mb-4"
                  style={{ color: colors.primary }}
                >
                  {t("howItWorks.step2.title")}
                </h3>
                <p className="text-center leading-relaxed" style={{ color: colors.textSecondary }}>
                  {t("howItWorks.step2.description")}
                </p>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }}
                className="p-8 h-full hover:shadow-xl transition-shadow duration-300"
              >
                <motion.div
                  className="flex justify-center mb-6"
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.surfaceSecondary }}
                  >
                    <Rocket className="w-10 h-10" style={{ color: colors.success }} />
                  </div>
                </motion.div>
                <h3
                  className="text-2xl font-bold text-center mb-4"
                  style={{ color: colors.primary }}
                >
                  {t("howItWorks.step3.title")}
                </h3>
                <p className="text-center leading-relaxed" style={{ color: colors.textSecondary }}>
                  {t("howItWorks.step3.description")}
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section> */}

      {/* Contact Form Section */}
      <section id="contact-form">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
              className="p-8 sm:p-12 shadow-2xl"
            >
              {formStatus.submitted && formStatus.success ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="flex justify-center mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <div
                      className="w-24 h-24 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.surfaceSecondary }}
                    >
                      <CheckCircle2 className="w-16 h-16" style={{ color: colors.success }} />
                    </div>
                  </motion.div>
                  <AnimatedText
                    as="h3"
                    className="text-3xl font-bold mb-4"
                    style={{ color: colors.primary }}
                    variant="scale"
                  >
                    {t("contactForm.success.title")}
                  </AnimatedText>
                  <AnimatedText
                    as="p"
                    className="text-xl mb-2"
                    style={{ color: colors.textSecondary }}
                    variant="fade"
                  >
                    {t("contactForm.success.message")}
                  </AnimatedText>
                  <AnimatedText
                    as="p"
                    className="text-lg"
                    style={{ color: colors.textTertiary }}
                    variant="fade"
                  >
                    {t("contactForm.success.emailMessage")}
                  </AnimatedText>
                  <motion.div
                    className="mt-8"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => {
                        setFormStatus({ submitted: false, success: false });
                        form.reset();
                      }}
                      variant="outline"
                      style={{
                        borderColor: colors.border,
                        color: colors.primary,
                      }}
                    >
                      <AnimatedText as="span" variant="fade">
                        {t("contactForm.buttons.submitAnother")}
                      </AnimatedText>
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    {/* <h2
                      className="text-3xl sm:text-4xl font-bold mb-4"
                      style={{ color: colors.primary }}
                    >
                      {t("contactForm.title")}
                    </h2> */}
                    <AnimatedText
                      as="h2"
                      className="text-lg font-bold"
                      style={{ color: colors.primary }}
                      variant="fade"
                    >
                      {t("contactForm.subtitle")}
                    </AnimatedText>
                  </div>

                  {formStatus.submitted && !formStatus.success && (
                    <motion.div
                      className="mb-6 p-4 rounded-lg"
                      style={{
                        backgroundColor: `${colors.error}20`,
                        borderColor: colors.error,
                      }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AnimatedText
                        as="p"
                        style={{ color: colors.error }}
                        className="text-center"
                        variant="fade"
                      >
                        {t("contactForm.error.message")}
                      </AnimatedText>
                    </motion.div>
                  )}

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel style={{ color: colors.textSecondary }}>
                              <AnimatedText as="span" variant="fade">
                                {t("contactForm.labels.name")}
                              </AnimatedText>{" "}
                              <span style={{ color: colors.error }}>*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("contactForm.placeholders.name")}
                                {...field}
                                disabled={isSubmitting}
                                style={{
                                  backgroundColor: colors.surfaceSecondary,
                                  color: colors.text,
                                  borderColor: colors.border,
                                }}
                                className="text-base py-6"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel style={{ color: colors.textSecondary }}>
                              <AnimatedText as="span" variant="fade">
                                {t("contactForm.labels.email")}
                              </AnimatedText>{" "}
                              <span style={{ color: colors.error }}>*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("contactForm.placeholders.email")}
                                type="email"
                                {...field}
                                disabled={isSubmitting}
                                style={{
                                  backgroundColor: colors.surfaceSecondary,
                                  color: colors.text,
                                  borderColor: colors.border,
                                }}
                                className="text-base py-6"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="project"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel style={{ color: colors.textSecondary }}>
                              <AnimatedText as="span" variant="fade">
                                {t("contactForm.labels.project")}
                              </AnimatedText>{" "}
                              <span style={{ color: colors.error }}>*</span>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={t("contactForm.placeholders.project")}
                                {...field}
                                disabled={isSubmitting}
                                rows={6}
                                style={{
                                  backgroundColor: colors.surfaceSecondary,
                                  color: colors.text,
                                  borderColor: colors.border,
                                }}
                                className="text-base resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel style={{ color: colors.textSecondary }}>
                              <AnimatedText as="span" variant="fade">
                                {t("contactForm.labels.phone")}
                              </AnimatedText>{" "}
                              <span style={{ color: colors.textTertiary }}>
                                <AnimatedText as="span" variant="fade">
                                  {t("contactForm.labels.optional")}
                                </AnimatedText>
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("contactForm.placeholders.phone")}
                                type="tel"
                                {...field}
                                disabled={isSubmitting}
                                style={{
                                  backgroundColor: colors.surfaceSecondary,
                                  color: colors.text,
                                  borderColor: colors.border,
                                }}
                                className="text-base py-6"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          className="w-full text-lg py-6 shadow-lg hover:shadow-xl"
                          disabled={isSubmitting}
                          style={{
                            backgroundColor: colors.accent,
                            color: colors.textInverse,
                          }}
                        >
                          {isSubmitting ? (
                            <motion.span
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                            >
                              <AnimatedText as="span" variant="fade">
                                {t("contactForm.buttons.submitting")}
                              </AnimatedText>
                            </motion.span>
                          ) : (
                            <>
                              <AnimatedText as="span" variant="fade">
                                {t("contactForm.buttons.submit")}
                              </AnimatedText>
                              <ArrowRight
                                className={`h-5 w-5 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`}
                              />
                            </>
                          )}
                        </Button>
                      </motion.div>

                      <p
                        className="text-sm text-center mt-4"
                        style={{ color: colors.textTertiary }}
                      >
                        <span style={{ color: colors.error }}>*</span>{" "}
                        <AnimatedText as="span" variant="fade">
                          {t("contactForm.labels.required")}
                        </AnimatedText>
                      </p>
                    </form>
                  </Form>
                </>
              )}
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Apply;
