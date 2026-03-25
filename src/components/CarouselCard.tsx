import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePortfolioImage } from "@/hooks/usePortfolioImage";
import { useLanguage } from "@/hooks/useLanguage";
import { getPortfolioById } from "@/services/apiPortfolio";
import { getPortfolioImage } from "@/services/apiImages";
import { LiquidSkeleton } from "@/components/LiquidSkeleton";
import type { PortfolioItem } from "@/types/portfolio";

interface CarouselCardProps {
  item?: PortfolioItem;
  index: number;
  onClick?: (sku: string) => void;
}

export function CarouselCard({ item, index, onClick }: CarouselCardProps) {
  const { data: imageUrl } = usePortfolioImage(item?.image ?? null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const queryClient = useQueryClient();
  const { lang } = useLanguage();

  const handlePrefetch = useCallback(() => {
    if (!item) return;
    queryClient.prefetchQuery({
      queryKey: ["portfolio", item.SKU, lang],
      queryFn: () => getPortfolioById(item.SKU, lang),
      staleTime: 1000 * 60 * 60,
    });
    if (item.image) {
      queryClient.prefetchQuery({
        queryKey: ["portfolioImage", item.image],
        queryFn: () => getPortfolioImage(item.image),
        staleTime: 1000 * 60 * 60 * 24 * 14,
      });
    }
  }, [queryClient, item, lang]);

  return (
    <button
      onClick={(e) => {
        if (!item || !onClick) return;
        e.stopPropagation();
        onClick(item.SKU);
      }}
      onMouseEnter={handlePrefetch}
      className="liquid-glass rounded-2xl w-[180px] sm:w-[220px] lg:w-[300px] flex-shrink-0 text-left group"
      aria-label={item ? `View project: ${item.title}` : "Loading project"}
    >
      <div className="aspect-square w-full relative overflow-hidden rounded-2xl">
        {!imageLoaded && <LiquidSkeleton variant="image" className="absolute inset-0" />}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={item?.title ?? ""}
            loading={index < 6 ? "eager" : "lazy"}
            onLoad={() => setImageLoaded(true)}
            className="w-full h-full object-cover transition-opacity duration-300"
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
        )}
      </div>
    </button>
  );
}
