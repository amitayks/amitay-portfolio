import { useSiteText } from "@/hooks/useSiteText";
import { SectionBadge } from "@/components/SectionBadge";
import { SectionHeading } from "@/components/SectionHeading";

export function Testimonials() {
  const { t } = useSiteText();

  // Conditionally rendered — only show if testimonials data exists
  // For now, return null until user provides quotes
  const hasTestimonials = false;

  if (!hasTestimonials) return null;

  return (
    <section className="py-24 px-6 md:px-16 lg:px-24">
      <div className="text-center mb-12">
        <SectionBadge>{t("testimonials.badge", "What They Say")}</SectionBadge>
        <SectionHeading>
          {t("testimonials.heading", "Don't take our word for it.")}
        </SectionHeading>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Testimonial cards will go here when data is provided */}
      </div>
    </section>
  );
}
