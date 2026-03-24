import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Github, ExternalLink } from "lucide-react";
import { marked } from "marked";
import { usePortfolioItem } from "@/hooks/usePortfolioItem";
import { usePortfolioImage } from "@/hooks/usePortfolioImage";
import { useLanguage } from "@/hooks/useLanguage";
import { ProjectImageGallery } from "@/components/ProjectImageGallery";
import { LiquidSkeleton } from "@/components/LiquidSkeleton";

interface ProjectModalProps {
  sku: string | null;
  onClose: () => void;
}

function ProjectLinkCard({
  link,
  label,
  previewImageName,
  type,
}: {
  link: string;
  label: string;
  previewImageName?: string;
  type: "github" | "live";
}) {
  const { data: imageUrl } = usePortfolioImage(previewImageName ?? null);
  const [imgFailed, setImgFailed] = useState(false);
  const Icon = type === "github" ? Github : ExternalLink;
  const showFallback = !previewImageName || !imageUrl || imgFailed;

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl overflow-hidden relative aspect-[9/16] cursor-pointer"
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image or fallback */}
      <div className="absolute inset-0">
        {showFallback ? (
          <div className="w-full h-full liquid-glass flex items-center justify-center">
            <Icon className="w-16 h-16 text-white/20" />
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={`${label} preview`}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            onError={() => setImgFailed(true)}
          />
        )}
      </div>

      {/* Blur overlay at bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-[40%] pointer-events-none"
        style={{
          maskImage: "linear-gradient(to top, black 0%, black 40%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, black 40%, transparent 100%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.85) 10%, rgba(0,0,0,0.4) 50%, transparent 100%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-end pb-5 px-5">
          <div className="flex items-center gap-2.5">
            <Icon className="w-5 h-5 flex-shrink-0 text-white drop-shadow-lg" />
            <span className="text-base font-semibold text-white drop-shadow-lg truncate">
              {label}
            </span>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

export function ProjectModal({ sku, onClose }: ProjectModalProps) {
  const { data: project, isLoading } = usePortfolioItem(sku);
  const { dir } = useLanguage();

  // Body scroll lock
  useEffect(() => {
    if (sku) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sku]);

  // Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (sku) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [sku, onClose]);

  // Browser back button closes modal
  useEffect(() => {
    if (!sku) return;
    history.pushState({ modal: true }, "");
    const handlePopState = () => {
      onClose();
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [sku, onClose]);

  const hasLinks = project?.github || project?.liveSite;

  return (
    <AnimatePresence>
      {sku && (
        <>
          {/* Backdrop — extended beyond viewport to cover overscroll */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed z-[60] bg-black/60 backdrop-blur-[20px]"
            style={{ inset: "-50vh -50vw", width: "200vw", height: "200vh" }}
            onClick={onClose}
          />

          {/* Close button — fixed to viewport */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed top-4 right-4 z-[80] liquid-glass rounded-full w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </motion.button>

          {/* Modal panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[70] overflow-y-auto scrollbar-none overscroll-contain"
            style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(50px)", WebkitBackdropFilter: "blur(50px)", minHeight: "100dvh" }}
            role="dialog"
            aria-modal="true"
            aria-label={project?.title ?? "Project details"}
          >
            {isLoading ? (
              <div className="max-w-5xl mx-auto p-8 md:p-12 space-y-6">
                {/* Gallery skeleton — matches real 60/40 layout */}
                <div className="flex gap-3">
                  <div className="w-[60%] flex-shrink-0">
                    <LiquidSkeleton variant="image" className="aspect-square rounded-2xl w-full" />
                  </div>
                  <div className="flex-1 grid grid-cols-2 grid-rows-3 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <LiquidSkeleton key={i} variant="image" className="aspect-square rounded-[8px] w-full" />
                    ))}
                  </div>
                </div>
                <LiquidSkeleton variant="text" className="w-1/2 h-8" />
                <LiquidSkeleton variant="text" />
                <LiquidSkeleton variant="text" className="w-5/6" />
              </div>
            ) : project ? (
              <div className="max-w-5xl mx-auto p-8 md:p-12 space-y-6">
                {/* Image gallery */}
                <ProjectImageGallery
                  mainImage={project.image}
                  imagePack={project.imagePack ?? []}
                />

                {/* Title */}
                <h2 dir={dir} className="font-heading italic text-3xl text-white">
                  {project.title}
                </h2>

                {/* Description */}
                <p dir={dir} className="text-white/60 font-body font-light text-sm">
                  {project.description}
                </p>

                {/* Long description (markdown) */}
                {project.longDescription && (
                  <div
                    dir={dir}
                    className="text-white/70 font-body font-light text-sm prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: marked(project.longDescription) as string,
                    }}
                  />
                )}

                {/* Technologies — centered */}
                {project.technologies?.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {project.technologies.map((tech: string) => (
                      <span
                        key={tech}
                        className="liquid-glass rounded-full px-3 py-1 text-xs text-white/80 font-body"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Additional info — RTL-aware, no glass wrapper */}
                {project.additionalInfo?.length > 0 && (
                  <div className="space-y-0">
                    {project.additionalInfo.map((info: { label: string; value: string }) => (
                      <div
                        key={info.label}
                        dir={dir}
                        className="flex justify-between py-2 border-b border-white/5 last:border-0"
                      >
                        <span className="text-white/50 font-body text-sm">{info.label}</span>
                        <span className="text-white font-body text-sm">{info.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Link preview cards */}
                {hasLinks && (
                  <div className="grid grid-cols-2 gap-4">
                    {project.github && (
                      <ProjectLinkCard
                        link={project.github.link}
                        label={project.github.label ?? "GitHub"}
                        previewImageName={project.github.previewImage?.dark}
                        type="github"
                      />
                    )}
                    {project.liveSite && (
                      <ProjectLinkCard
                        link={project.liveSite.link}
                        label={project.liveSite.label ?? "Live Site"}
                        previewImageName={project.liveSite.previewImage?.dark}
                        type="live"
                      />
                    )}
                  </div>
                )}
              </div>
            ) : null}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
