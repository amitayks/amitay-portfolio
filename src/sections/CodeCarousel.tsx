import { usePortfolioItems } from "@/hooks/usePortfolioItems";
import { InfiniteCarousel } from "@/components/InfiniteCarousel";
import { CarouselCard } from "@/components/CarouselCard";
import type { PortfolioItem } from "@/types/portfolio";

interface CodeCarouselProps {
  onProjectClick: (sku: string) => void;
}

// Stable placeholder array — same length, same keys, never recreated
const PLACEHOLDERS: undefined[] = Array.from({ length: 8 });

export function CodeCarousel({ onProjectClick }: CodeCarouselProps) {
  const { data: projects } = usePortfolioItems("Web-Development", "en");

  // Always render the carousel — use placeholders until data arrives
  const items: (PortfolioItem | undefined)[] = projects?.length ? projects : PLACEHOLDERS;

  return (
    <section>
      <InfiniteCarousel
        items={items}
        direction="right"
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
