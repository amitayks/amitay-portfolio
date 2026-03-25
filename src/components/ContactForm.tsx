import { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import emailjs from "@emailjs/browser";
import { ArrowUpRight, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSiteText } from "@/hooks/useSiteText";
import { useLanguage } from "@/hooks/useLanguage";
import { EMAILJS_CONFIG } from "@/constants/personal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LanguageTransition } from "@/components/LanguageTransition";

const HEIGHT_TRANSITION = "height 0.35s cubic-bezier(0.16, 1, 0.3, 1)";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const { t } = useSiteText();
  const { dir } = useLanguage();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setContentHeight(el.offsetHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setStatus("submitting");
    try {
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        {
          from_name: data.name,
          from_email: data.email,
          subject: data.subject,
          message: data.message,
        },
        EMAILJS_CONFIG.USER_ID
      );
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div
      className="liquid-glass-strong rounded-2xl overflow-hidden max-w-xl mx-auto"
      style={{
        height: contentHeight ?? "auto",
        transition: contentHeight !== null ? HEIGHT_TRANSITION : "none",
      }}
    >
      <div ref={contentRef} className="p-8">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-12 text-center"
            >
              <CheckCircle2 className="w-12 h-12 text-green-400 mb-4" />
              <p className="text-white font-body text-lg">
                {t("contact.form.success", "Message sent! I'll get back to you soon.")}
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              exit={{ opacity: 0 }}
            >
              <LanguageTransition>
                <div dir={dir} className="space-y-4">
                  <div>
                    <Input
                      placeholder={t("contact.form.name.placeholder", "Your name")}
                      {...register("name", { required: true, minLength: 2 })}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1">Name is required (min 2 characters)</p>
                    )}
                  </div>

                  <div>
                    <Input
                      type="email"
                      placeholder={t("contact.form.email.placeholder", "your@email.com")}
                      {...register("email", { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">Valid email is required</p>
                    )}
                  </div>

                  <div>
                    <Input
                      placeholder={t("contact.form.subject.placeholder", "What's this about?")}
                      {...register("subject", { required: true, minLength: 2 })}
                    />
                    {errors.subject && (
                      <p className="text-red-400 text-xs mt-1">Subject is required</p>
                    )}
                  </div>

                  <div>
                    <Textarea
                      placeholder={t(
                        "contact.form.message.placeholder",
                        "Tell me about your project..."
                      )}
                      {...register("message", { required: true, minLength: 10 })}
                    />
                    {errors.message && (
                      <p className="text-red-400 text-xs mt-1">
                        Message is required (min 10 characters)
                      </p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={status === "submitting"}>
                    {status === "submitting" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        {t("contact.cta", "Send Message")}
                        <ArrowUpRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>

                  {status === "error" && (
                    <p className="text-red-400 text-sm text-center">
                      {t("contact.form.error", "Something went wrong. Please try again.")}
                    </p>
                  )}
                </div>
              </LanguageTransition>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
