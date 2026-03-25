import { useState } from "react";
import { usePortfolioImage } from "@/hooks/usePortfolioImage";
import { LiquidSkeleton } from "@/components/LiquidSkeleton";

interface ProjectImageGalleryProps {
  mainImage: string;
  imagePack: string[];
}

function GalleryImage({
  imageName,
  alt,
  className,
  onClick,
}: {
  imageName: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}) {
  const { data: url } = usePortfolioImage(imageName);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      {!loaded && <LiquidSkeleton variant="image" className="absolute inset-0" />}
      {url && (
        <img
          src={url}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onClick={onClick}
          onKeyDown={(e) => {
            if (onClick && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              onClick();
            }
          }}
          tabIndex={onClick ? 0 : undefined}
          role={onClick ? "button" : undefined}
          className="w-full h-full object-cover transition-opacity duration-300 cursor-pointer"
          style={{ opacity: loaded ? 1 : 0 }}
        />
      )}
    </div>
  );
}

export function ProjectImageGallery({ mainImage, imagePack }: ProjectImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(mainImage);
  const thumbnails = imagePack.slice(0, 6);

  return (
    <div className="flex gap-3">
      {/* Main image — ~60% width */}
      <div className="w-[60%] flex-shrink-0">
        <GalleryImage
          imageName={selectedImage}
          alt="Project main image"
          className="aspect-square rounded-2xl"
        />
      </div>

      {/* Thumbnails — ~40% width, 2 cols × 3 rows */}
      <div className="flex-1 grid grid-cols-2 grid-rows-3 gap-2">
        {thumbnails.map((img) => (
          <GalleryImage
            key={img}
            imageName={img}
            alt={`Project thumbnail`}
            className="aspect-square rounded-[8px]"
            onClick={() => setSelectedImage(img)}
          />
        ))}
      </div>
    </div>
  );
}
