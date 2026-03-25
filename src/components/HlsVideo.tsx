import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { cn } from "@/lib/utils";

interface HlsVideoProps {
  src: string;
  className?: string;
  desaturate?: boolean | number;
}

export function HlsVideo({ src, className, desaturate }: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }
  }, [src]);

  const saturation =
    desaturate === true ? 0 : typeof desaturate === "number" ? desaturate : undefined;

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      className={cn("absolute inset-0 w-full h-full object-cover z-0", className)}
      style={saturation !== undefined ? { filter: `saturate(${saturation})` } : undefined}
    />
  );
}

export function VideoFades() {
  return (
    <>
      <div
        className="absolute top-0 left-0 right-0 z-[1] h-[200px]"
        style={{ background: "linear-gradient(to bottom, black, transparent)" }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 z-[1] h-[200px]"
        style={{ background: "linear-gradient(to top, black, transparent)" }}
      />
    </>
  );
}
