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
  challenge: z.string().min(30),
  tried: z.string().min(20),
  whyNow: z.string().min(15),
  name: z.string().min(2),
  email: z.string().email(),
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
          challenge: data.challenge,
          tried: data.tried,
          why_now: data.whyNow,
          subject: `${t("contact.email.subjectPrefix", "New project — ")}${data.name}`,
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
                {t("contact.form.success", "Message sent! We'll get back to you soon.")}
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              exit={{ opacity: 0 }}
            >
              <LanguageTransition>
                <div dir={dir} className="space-y-5 text-start">
                  <div>
                    <label className="block text-white/80 font-body text-sm mb-2">
                      {t(
                        "contact.form.challenge.label",
                        "What's the biggest challenge you're trying to solve right now?"
                      )}
                    </label>
                    <Textarea
                      placeholder={t(
                        "contact.form.challenge.placeholder",
                        "The real problem, in your words…"
                      )}
                      {...register("challenge", { required: true, minLength: 30 })}
                    />
                    {errors.challenge && (
                      <p className="text-red-400 text-xs mt-1">
                        {t(
                          "contact.form.challenge.error",
                          "Give us a sentence or two — what's actually in the way?"
                        )}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/80 font-body text-sm mb-2">
                      {t("contact.form.tried.label", "What have you already tried?")}
                    </label>
                    <Textarea
                      placeholder={t(
                        "contact.form.tried.placeholder",
                        "What you've already explored or built…"
                      )}
                      {...register("tried", { required: true, minLength: 20 })}
                    />
                    {errors.tried && (
                      <p className="text-red-400 text-xs mt-1">
                        {t(
                          "contact.form.tried.error",
                          "A line or two on what you've tried helps a lot."
                        )}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/80 font-body text-sm mb-2">
                      {t("contact.form.whyNow.label", "Why is now the right time to address this?")}
                    </label>
                    <Textarea
                      placeholder={t(
                        "contact.form.whyNow.placeholder",
                        "The deadline, opportunity, or breaking point…"
                      )}
                      {...register("whyNow", { required: true, minLength: 15 })}
                    />
                    {errors.whyNow && (
                      <p className="text-red-400 text-xs mt-1">
                        {t(
                          "contact.form.whyNow.error",
                          "Even a short reason helps us prioritize."
                        )}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      placeholder={t("contact.form.name.placeholder", "Your name")}
                      {...register("name", { required: true, minLength: 2 })}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1">
                        {t("contact.form.name.error", "Tell us your name.")}
                      </p>
                    )}
                  </div>

                  <div>
                    <Input
                      type="email"
                      placeholder={t("contact.form.email.placeholder", "your@email.com")}
                      {...register("email", { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">
                        {t("contact.form.email.error", "We need a valid email to reply.")}
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
