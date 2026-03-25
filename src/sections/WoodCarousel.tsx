import { usePortfolioItems } from "@/hooks/usePortfolioItems";
import { InfiniteCarousel } from "@/components/InfiniteCarousel";
import { CarouselCard } from "@/components/CarouselCard";
import type { PortfolioItem } from "@/types/portfolio";

interface WoodCarouselProps {
  onProjectClick: (sku: string) => void;
}

const PLACEHOLDERS: undefined[] = Array.from({ length: 8 });

export function WoodCarousel({ onProjectClick }: WoodCarouselProps) {
  const { data: projects } = usePortfolioItems("Wood-Working", "en");

  const items: (PortfolioItem | undefined)[] = projects?.length ? projects : PLACEHOLDERS;

  return (
    <section>
      <InfiniteCarousel
        items={items}
        direction="left"
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
