import { useTheme } from "@/hooks/useTheme";
import { useEffect, useState } from "react";
import { PortfolioItem } from "../types/portfolio";
import { Skeleton } from "./Skeleton";

interface ImagePackItem {
  url: string | null;
  isLoading?: boolean | null;
}

interface ImageProps {
  title: PortfolioItem["title"];
  image: PortfolioItem["image"] | null;
  imagePack: ImagePackItem[];
  imageAspect: string;
  isLoadingImage: boolean;
  isLoadingImagePack: boolean;
}

function PortfolioImage({
  title,
  image,
  imagePack,
  imageAspect,
  isLoadingImage,
  isLoadingImagePack,
}: ImageProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { colors } = useTheme();

  useEffect(() => {
    if (image) {
      setSelectedImage(image);
    }
  }, [image]);

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className={`aspect-${imageAspect} w-full relative overflow-hidden rounded-lg mb-4`}>
        {isLoadingImage && <Skeleton className="absolute inset-0 w-full h-full " />}
        {!isLoadingImage && selectedImage && (
          <img
            src={selectedImage}
            alt={title}
            width={800}
            height={800}
            className="w-full h-full object-cover absolute inset-0 z-10"
            onLoad={(e) => {
              const target = e.target as HTMLElement;
              target.style.opacity = "1";
            }}
            style={{ opacity: 0, transition: "opacity 0.3s ease-in-out" }}
          />
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {isLoadingImagePack
          ? Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={`skeleton-${i + 1}`} className="aspect-square rounded-md overflow-hidden">
                  <Skeleton className="w-full h-full" />
                </div>
              ))
          : imagePack &&
            imagePack.map((imageItem, i) => {
              if (!imageItem.url) {
                return (
                  <div
                    key={`${i + 1}-skeleton`}
                    className="aspect-square rounded-md overflow-hidden"
                  >
                    <Skeleton className=" w-full h-full" />
                  </div>
                );
              }

              return (
                <button
                  type="button"
                  key={imageItem.url}
                  style={{
                    outlineColor: selectedImage === imageItem.url ? colors.accent : "transparent",
                    outlineWidth: "2px",
                    outlineStyle: "solid",
                  }}
                  className={`aspect-square cursor-pointer rounded-md overflow-hidden focus-visible:ring-2 focus-visible:ring-offset-2`}
                  onClick={() => imageItem.url && setSelectedImage(imageItem.url)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      imageItem.url && setSelectedImage(imageItem.url);
                    }
                  }}
                  aria-label={`View image ${i + 1} of ${title}`}
                  aria-pressed={selectedImage === imageItem.url}
                >
                  {imageItem.isLoading ? (
                    <Skeleton className="absolute inset-0 w-full h-full" />
                  ) : (
                    <img
                      src={imageItem.url}
                      alt={`${title} thumbnail ${i + 1}`}
                      width={200}
                      height={200}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onLoad={(e) => {
                        const target = e.target as HTMLElement;
                        target.style.opacity = "1";
                      }}
                      style={{
                        opacity: 0,
                        transition: "opacity 0.3s ease-in-out",
                      }}
                    />
                  )}
                </button>
              );
            })}
      </div>
    </div>
  );
}

export default PortfolioImage;
