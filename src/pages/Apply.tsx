import emailjs from "@emailjs/browser";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Lightbulb, Rocket, Wand2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { useTheme } from "@/hooks/useTheme";
import { EMAILJS_CONFIG } from "@/utils/constants";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  project: z.string().min(10, {
    message: "Project description must be at least 10 characters.",
  }),
  phone: z.string().optional(),
});

const Apply = () => {
  const colors = useTheme();
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setFormStatus({
      submitted: true,
      success: false,
      message: "Sending your application...",
    });

    try {
      const templateParams = {
        from_name: values.name,
        from_email: values.email,
        project: values.project,
        phone: values.phone,
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
        message: "Thank you for your application! We'll get back to you within 24 hours.",
      });

      form.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      setFormStatus({
        submitted: true,
        success: false,
        message:
          "Sorry, there was an error sending your application. Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const scrollToForm = () => {
    const formElement = document.getElementById("contact-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      style={{
        backgroundColor: colors.background,
        color: colors.text,
      }}
    >
      {/* Hero Section */}
      <motion.section
        className="flex flex-col items-center justify-center text-center min-h-screen"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-bold" style={{ color: colors.primary }}>
          High-End Apps Without the High-End Price Tag.
        </h1>
        <p className="mt-4 text-xl" style={{ color: colors.textSecondary }}>
          We help businesses like yours launch powerful, custom applications faster and more
          affordably by leveraging the latest in artificial intelligence.
        </p>
        <Button
          onClick={scrollToForm}
          className="mt-8"
          style={{
            backgroundColor: colors.accent,
            color: colors.textInverse,
          }}
        >
          Start Your Project
        </Button>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold">How It Works</h2>
          <div className="flex justify-center gap-16 mt-12">
            <div className="flex flex-col items-center">
              <Lightbulb size={48} style={{ color: colors.accent }} />
              <h3 className="mt-4 text-2xl font-semibold">Step 1: Share Your Vision</h3>
              <p className="mt-2" style={{ color: colors.textSecondary }}>
                Tell us about the app you want to build. What problems will it solve? Who is it for?
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Wand2 size={48} style={{ color: colors.accent }} />
              <h3 className="mt-4 text-2xl font-semibold">Step 2: AI-Powered Development</h3>
              <p className="mt-2" style={{ color: colors.textSecondary }}>
                Our expert team, assisted by powerful AI tools, builds, tests, and refines your
                application with incredible speed and precision.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Rocket size={48} style={{ color: colors.accent }} />
              <h3 className="mt-4 text-2.xl font-semibold">Step 3: Launch & Impress</h3>
              <p className="mt-2" style={{ color: colors.textSecondary }}>
                Receive a polished, high-quality app that's ready to wow your customers, streamline
                your operations, and grow your business.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Contact Form Section */}
      <motion.section
        id="contact-form"
        className="py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-4xl font-bold text-center">Ready to Build Something Amazing?</h2>
          {formStatus.success ? (
            <div
              className={`mt-12 p-4 rounded-lg ${
                formStatus.success
                  ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                  : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
              }`}
            >
              <p className="flex items-center justify-center text-2xl">{formStatus.message}</p>
            </div>
          ) : (
            <>
              {formStatus.submitted && !formStatus.success && (
                <div
                  className={`mt-6 mb-6 p-4 rounded-lg ${
                    formStatus.success
                      ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                      : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                  }`}
                >
                  <p className="flex items-center">{formStatus.message}</p>
                </div>
              )}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-12">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your Name"
                            {...field}
                            disabled={isSubmitting}
                            style={{
                              backgroundColor: colors.surface,
                              color: colors.text,
                              borderColor: colors.border,
                            }}
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your.email@example.com"
                            {...field}
                            disabled={isSubmitting}
                            style={{
                              backgroundColor: colors.surface,
                              color: colors.text,
                              borderColor: colors.border,
                            }}
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
                        <FormLabel>Tell us about your project</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your app idea..."
                            {...field}
                            disabled={isSubmitting}
                            style={{
                              backgroundColor: colors.surface,
                              color: colors.text,
                              borderColor: colors.border,
                            }}
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
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your Phone Number"
                            {...field}
                            disabled={isSubmitting}
                            style={{
                              backgroundColor: colors.surface,
                              color: colors.text,
                              borderColor: colors.border,
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: colors.accent,
                      color: colors.textInverse,
                    }}
                  >
                    {isSubmitting ? "Sending..." : "Get My Free Proposal"}
                  </Button>
                </form>
              </Form>
            </>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default Apply;
