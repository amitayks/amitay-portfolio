import { useProjectsByStatus } from "@/hooks/usePortfolioItems";
import { useSiteText } from "@/hooks/useSiteText";
import { InfiniteCarousel } from "@/components/InfiniteCarousel";
import { CarouselCard } from "@/components/CarouselCard";
import { SectionBadge } from "@/components/SectionBadge";
import { SectionHeading } from "@/components/SectionHeading";
import type { PortfolioItem, ProjectStatus } from "@/types/portfolio";

interface SpiralProps {
  status: ProjectStatus;
  badge: string;
  heading: string;
  direction: "left" | "right";
  onProjectClick: (sku: string) => void;
}

const PLACEHOLDERS: undefined[] = Array.from({ length: 8 });

function Spiral({ status, badge, heading, direction, onProjectClick }: SpiralProps) {
  const { data: projects, isLoading } = useProjectsByStatus(status);

  // Empty-state hide rule: spiral disappears entirely when the
  // filtered query returns zero published projects.
  if (!isLoading && (!projects || projects.length === 0)) return null;

  const items: (PortfolioItem | undefined)[] = projects?.length ? projects : PLACEHOLDERS;

  return (
    <section className="py-10">
      <div className="flex flex-col items-center pb-4">
        <SectionBadge>{badge}</SectionBadge>
        <SectionHeading>{heading}</SectionHeading>
      </div>
      <InfiniteCarousel
        items={items}
        direction={direction}
        renderCard={(item: PortfolioItem | undefined, index: number) => (
          <CarouselCard
            item={item || undefined}
            index={index}
            onClick={item ? onProjectClick : undefined}
          />
        )}
      />
    </section>
  );
}

interface ProjectSpiralsProps {
  onProjectClick: (sku: string) => void;
}

export function ProjectSpirals({ onProjectClick }: ProjectSpiralsProps) {
  const { t } = useSiteText();
  return (
    <>
      <Spiral
        status="finished"
        badge={t("spirals.finished.badge", "Finished")}
        heading={t("spirals.finished.heading", "What we've shipped.")}
        direction="left"
        onProjectClick={onProjectClick}
      />
      <Spiral
        status="ongoing"
        badge={t("spirals.ongoing.badge", "Ongoing")}
        heading={t("spirals.ongoing.heading", "What we're building now.")}
        direction="right"
        onProjectClick={onProjectClick}
      />
      <Spiral
        status="upcoming"
        badge={t("spirals.upcoming.badge", "Upcoming")}
        heading={t("spirals.upcoming.heading", "What's next on the bench.")}
        direction="left"
        onProjectClick={onProjectClick}
      />
    </>
  );
}
