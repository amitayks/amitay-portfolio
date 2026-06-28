import { useState } from "react";
import { usePortfolioImage } from "@/hooks/usePortfolioImage";
import { LiquidSkeleton } from "@/components/LiquidSkeleton";

interface ProjectImageGalleryProps {
  mainImage: string;
}

export function ProjectImageGallery({ mainImage }: ProjectImageGalleryProps) {
  const { data: url } = usePortfolioImage(mainImage);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden aspect-square rounded-2xl">
      {!loaded && <LiquidSkeleton variant="image" className="absolute inset-0" />}
      {url && (
        <img
          src={url}
          alt="Project main image"
          onLoad={() => setLoaded(true)}
          className="w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: loaded ? 1 : 0 }}
        />
      )}
    </div>
  );
}
