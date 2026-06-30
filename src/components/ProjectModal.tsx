import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Github, ExternalLink, User, type LucideIcon } from "lucide-react";
import { marked } from "marked";
import { usePortfolioItem } from "@/hooks/usePortfolioItem";
import { useLanguage } from "@/hooks/useLanguage";
import { useSiteText } from "@/hooks/useSiteText";
import { useTranslated, pickLang } from "@/hooks/useTranslated";
import { ProjectImageGallery } from "@/components/ProjectImageGallery";
import { LiquidSkeleton } from "@/components/LiquidSkeleton";
import { DevProfilePopup, type DevProfile } from "@/components/DevProfilePopup";
import type { PortfolioItem } from "@/types/portfolio";

interface ProjectModalProps {
  sku: string | null;
  onClose: () => void;
}

function ProjectLinkCard({
  link,
  label,
  type,
}: {
  link: string;
  label: string;
  type: "github" | "live";
}) {
  const Icon = type === "github" ? Github : ExternalLink;

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="rounded-xl flex-1 min-h-0 px-5 py-3 flex items-center justify-center gap-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/5 text-white/70 hover:text-white transition-colors cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
      <span className="text-base font-medium">{label}</span>
    </motion.a>
  );
}

// Square developer image (placeholder when no avatar). Renders as a square box
// with the image/icon absolutely filling it, so `aspect-square` holds reliably
// whether sized by width or height.
function DevAvatar({ url, className }: { url?: string | null; className?: string }) {
  return (
    <div className={`relative rounded-xl overflow-hidden ${className ?? ""}`}>
      {url ? (
        <img src={url} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
          <User className="w-1/3 h-1/3 text-white/40" />
        </div>
      )}
    </div>
  );
}

function ProjectMetaRow({ project }: { project: PortfolioItem }) {
  const { lang } = useLanguage();
  const statusLabel =
    project.status === "ongoing"
      ? "In progress"
      : project.status === "upcoming"
      ? "Coming soon"
      : project.status === "finished"
      ? "Shipped"
      : null;

  const companyName = pickLang(project.companyName, lang);
  const duration = pickLang(project.duration, lang);
  const clientLabel =
    project.clientVisibility === "hidden"
      ? "Confidential client"
      : companyName || null;

  const items: string[] = [];
  if (clientLabel) items.push(clientLabel);
  if (duration) items.push(duration);
  if (statusLabel) items.push(statusLabel);

  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs uppercase tracking-wider text-white/50">
      {items.map((it, i) => (
        <span key={it} className="flex items-center gap-3">
          {i > 0 && <span className="text-white/20">·</span>}
          {it}
        </span>
      ))}
    </div>
  );
}

function devList(project: PortfolioItem): DevProfile[] {
  const profiles =
    project.devAttribution === "hidden" ? [] : project.developerProfiles ?? [];
  const isAnon = project.devAttribution === "anonymized";
  return profiles.map((p, idx) => ({
    id: p.id,
    name: isAnon ? `Developer ${String.fromCharCode(65 + idx)}` : p.display_name || "—",
    avatarUrl: isAnon ? null : p.avatar_url,
    bio: isAnon ? null : p.bio,
    headline: isAnon ? null : p.headline,
    skills: isAnon ? [] : p.skills ?? [],
    availability: isAnon ? null : p.availability,
    githubHandle: isAnon ? null : p.github_handle,
    links: isAnon ? {} : p.links ?? {},
    resumeUrl: isAnon ? null : p.resume_url,
  }));
}

// A developer cell becomes an interactive trigger only when `onSelect` is
// provided (i.e. attribution is `named`); otherwise it renders inert.
function DevCell({
  dev,
  onSelect,
  className,
  children,
}: {
  dev: DevProfile;
  onSelect?: (dev: DevProfile) => void;
  className?: string;
  children: React.ReactNode;
}) {
  if (!onSelect) return <div className={className}>{children}</div>;
  return (
    <button
      type="button"
      onClick={() => onSelect(dev)}
      aria-label={`View ${dev.name}'s profile`}
      className={`${className ?? ""} cursor-pointer transition-opacity hover:opacity-80`}
    >
      {children}
    </button>
  );
}

function hasCreditsContent(project: PortfolioItem): boolean {
  return devList(project).length > 0 || !!project.github || !!project.liveSite;
}

// Developer slot — adapts to dev count:
//   1   → image | name / description
//   2   → image + name pair (two columns)
//   3–6 → image-only thumbnails (3 cols × 2 rows)
function DevSlot({
  project,
  onSelectDev,
}: {
  project: PortfolioItem;
  onSelectDev?: (dev: DevProfile) => void;
}) {
  const devs = devList(project);
  if (devs.length === 0) return null;
  const header = devs.length > 1 ? "Built by" : "Developer";

  return (
    <div className="liquid-glass rounded-2xl flex-[2] min-h-0 p-4 flex flex-col gap-3">
      <h3 className="text-xs uppercase tracking-widest text-white/40 font-body">
        {header}
      </h3>

      {devs.length === 1 ? (
        <DevCell
          dev={devs[0]}
          onSelect={onSelectDev}
          className="flex-1 min-h-0 w-full flex flex-col items-center justify-center gap-3 text-center"
        >
          <div className="flex-1 min-h-0 w-full flex items-center justify-center">
            <DevAvatar
              url={devs[0].avatarUrl}
              className="h-full max-h-[200px] aspect-square"
            />
          </div>
          <div className="min-w-0 max-w-full shrink-0">
            <div className="text-xl font-semibold text-white truncate">{devs[0].name}</div>
            {devs[0].bio && (
              <p className="mt-1 text-xs text-white/50 leading-snug line-clamp-3">
                {devs[0].bio}
              </p>
            )}
          </div>
        </DevCell>
      ) : devs.length === 2 ? (
        <div className="flex-1 min-h-0 grid grid-cols-2 gap-4 content-center">
          {devs.map((d) => (
            <DevCell
              key={d.id}
              dev={d}
              onSelect={onSelectDev}
              className="min-w-0 flex flex-col items-center gap-2 text-center"
            >
              <DevAvatar url={d.avatarUrl} className="w-2/3 max-w-[120px] aspect-square" />
              <span className="text-sm font-medium text-white/90 truncate max-w-full">
                {d.name}
              </span>
            </DevCell>
          ))}
        </div>
      ) : (
        <div className="flex-1 min-h-0 grid grid-cols-3 grid-rows-2 gap-2">
          {devs.slice(0, 6).map((d) => (
            <DevCell key={d.id} dev={d} onSelect={onSelectDev} className="w-full h-full">
              <DevAvatar url={d.avatarUrl} className="w-full h-full" />
            </DevCell>
          ))}
        </div>
      )}
    </div>
  );
}

// Links container — header + GitHub/Live buttons. Renders only when a link exists.
function ProjectLinksCard({ project }: { project: PortfolioItem }) {
  const { lang } = useLanguage();
  if (!project.github && !project.liveSite) return null;
  const githubLabel = pickLang(project.github?.label, lang) ?? "GitHub";
  const liveSiteLabel = pickLang(project.liveSite?.label, lang) ?? "Live Site";

  return (
    <div className="liquid-glass rounded-2xl flex-1 min-h-0 p-4 flex flex-col gap-3">
      <h3 className="text-xs uppercase tracking-widest text-white/40 font-body">Links</h3>
      <div className="flex-1 min-h-0 flex flex-col gap-2">
        {project.github && (
          <ProjectLinkCard link={project.github.link} label={githubLabel} type="github" />
        )}
        {project.liveSite && (
          <ProjectLinkCard link={project.liveSite.link} label={liveSiteLabel} type="live" />
        )}
      </div>
    </div>
  );
}

// Side column beside the main image. Absolutely positioned to exactly the main
// image's height (inset-y-0) so it can never push the row taller than the image;
// its containers divide that fixed height and overflow is clipped.
function ProjectSideColumn({
  project,
  onSelectDev,
}: {
  project: PortfolioItem;
  onSelectDev?: (dev: DevProfile) => void;
}) {
  return (
    <div className="absolute inset-y-0 right-0 w-[38%] flex flex-col gap-3 overflow-hidden">
      <DevSlot project={project} onSelectDev={onSelectDev} />
      <ProjectLinksCard project={project} />
    </div>
  );
}

// A uniform credits tab (mobile): icon + label, either a link (github/live) or a
// button (the developer tab — future: opens a dev-info window).
function CreditTab({
  icon: Icon,
  label,
  href,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
}) {
  const className =
    "rounded-xl px-5 py-4 flex items-center justify-center gap-2.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/5 text-white/70 hover:text-white transition-colors cursor-pointer";
  const inner = (
    <>
      <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
      <span className="text-base font-medium truncate">{label}</span>
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={className}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3 }}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={className}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      {inner}
    </motion.button>
  );
}

// Mobile credits: three uniform tabs (developer name, GitHub, Live). No photo —
// the developer tab opens the developer profile popup (named attribution only).
function ProjectCreditsTabs({
  project,
  onSelectDev,
}: {
  project: PortfolioItem;
  onSelectDev?: (dev: DevProfile) => void;
}) {
  const { lang } = useLanguage();
  const devs = devList(project);
  const githubLabel = pickLang(project.github?.label, lang) ?? "GitHub";
  const liveSiteLabel = pickLang(project.liveSite?.label, lang) ?? "Live Site";
  const devLabel =
    devs.length === 0
      ? null
      : devs.length === 1
        ? devs[0].name
        : `${devs[0].name} +${devs.length - 1}`;

  return (
    <div className="flex flex-col gap-3">
      {devLabel && (
        <CreditTab
          icon={User}
          label={devLabel}
          onClick={onSelectDev ? () => onSelectDev(devs[0]) : undefined}
        />
      )}
      {project.github && (
        <CreditTab icon={Github} label={githubLabel} href={project.github.link} />
      )}
      {project.liveSite && (
        <CreditTab icon={ExternalLink} label={liveSiteLabel} href={project.liveSite.link} />
      )}
    </div>
  );
}

export function ProjectModal({ sku, onClose }: ProjectModalProps) {
  const { data: project, isLoading } = usePortfolioItem(sku);
  const { dir } = useLanguage();
  const { t } = useSiteText();
  const [selectedDev, setSelectedDev] = useState<DevProfile | null>(null);

  // The popup is reachable only for `named` attribution; otherwise triggers
  // stay inert (anonymized/hidden have no real identity to reveal).
  const openDev =
    project?.devAttribution === "named" ? setSelectedDev : undefined;

  const title = useTranslated(project?.title) ?? "";
  const description = useTranslated(project?.description) ?? "";
  const longDescription = useTranslated(project?.longDescription);
  const problem = useTranslated(project?.problem);
  const whatIBuilt = useTranslated(project?.whatIBuilt);
  const howItWorks = useTranslated(project?.howItWorks);
  const result = useTranslated(project?.result);

  // Reset any open developer popup when the modal switches projects/closes.
  useEffect(() => {
    setSelectedDev(null);
  }, [sku]);

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

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (sku) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [sku, onClose]);

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

  return (
    <AnimatePresence>
      {sku && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed z-[60] bg-black/60 backdrop-blur-[20px]"
            style={{ inset: "-50vh -50vw", width: "200vw", height: "200vh" }}
            onClick={onClose}
          />

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

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[70] overflow-y-auto scrollbar-none overscroll-contain"
            style={{
              background: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(50px)",
              WebkitBackdropFilter: "blur(50px)",
              minHeight: "100dvh",
            }}
            role="dialog"
            aria-modal="true"
            aria-label={title || "Project details"}
          >
            {isLoading ? (
              <div className="max-w-5xl mx-auto p-8 md:p-12 space-y-6">
                {/* Desktop: image + side column */}
                <div className="relative hidden md:block">
                  <div className="w-[60%]">
                    <LiquidSkeleton variant="image" className="aspect-square rounded-2xl w-full" />
                  </div>
                  <div className="absolute inset-y-0 right-0 w-[38%] flex flex-col gap-3">
                    <LiquidSkeleton variant="image" className="flex-[2] rounded-2xl w-full" />
                    <LiquidSkeleton variant="image" className="flex-1 rounded-2xl w-full" />
                  </div>
                </div>
                {/* Mobile: full-width image + three tabs */}
                <div className="md:hidden space-y-3">
                  <LiquidSkeleton variant="image" className="aspect-square rounded-2xl w-full" />
                  <LiquidSkeleton variant="image" className="h-14 rounded-xl w-full" />
                  <LiquidSkeleton variant="image" className="h-14 rounded-xl w-full" />
                  <LiquidSkeleton variant="image" className="h-14 rounded-xl w-full" />
                </div>
                <LiquidSkeleton variant="text" className="w-1/2 h-8" />
                <LiquidSkeleton variant="text" />
                <LiquidSkeleton variant="text" className="w-5/6" />
              </div>
            ) : project ? (
              <div className="max-w-5xl mx-auto p-8 md:p-12 space-y-6">
                {hasCreditsContent(project) ? (
                  <>
                    {/* Desktop: image + side column with the developer photo card */}
                    <div className="relative hidden md:block">
                      <div className="w-[60%]">
                        <ProjectImageGallery mainImage={project.image} />
                      </div>
                      <ProjectSideColumn project={project} onSelectDev={openDev} />
                    </div>
                    {/* Mobile: full-width image, then three uniform tabs (name only) */}
                    <div className="md:hidden space-y-3">
                      <ProjectImageGallery mainImage={project.image} />
                      <ProjectCreditsTabs project={project} onSelectDev={openDev} />
                    </div>
                  </>
                ) : (
                  <ProjectImageGallery mainImage={project.image} />
                )}

                <h2 dir={dir} className="font-heading italic text-3xl text-white">
                  {title}
                </h2>

                <ProjectMetaRow project={project} />

                <p dir={dir} className="text-white/60 font-body font-light text-base">
                  {description}
                </p>

                {problem && (
                  <div dir={dir} className="space-y-2">
                    <h3 className="text-xs uppercase tracking-widest text-white/40 font-body">
                      {t("modal.section.problem", "The Problem")}
                    </h3>
                    <p className="text-white/70 font-body font-light text-sm leading-relaxed">
                      {problem}
                    </p>
                  </div>
                )}

                {whatIBuilt && (
                  <div dir={dir} className="space-y-2">
                    <h3 className="text-xs uppercase tracking-widest text-white/40 font-body">
                      {t("modal.section.whatIBuilt", "What I Built")}
                    </h3>
                    <p className="text-white/70 font-body font-light text-sm leading-relaxed">
                      {whatIBuilt}
                    </p>
                  </div>
                )}

                {howItWorks && (
                  <div dir={dir} className="space-y-2">
                    <h3 className="text-xs uppercase tracking-widest text-white/40 font-body">
                      {t("modal.section.howItWorks", "How It Works")}
                    </h3>
                    <p className="text-white/70 font-body font-light text-sm leading-relaxed">
                      {howItWorks}
                    </p>
                  </div>
                )}

                {project.technologies?.length > 0 && (
                  <div dir={dir} className="space-y-2">
                    <h3 className="text-xs uppercase tracking-widest text-white/40 font-body">
                      {t("modal.section.techStack", "Tech Stack")}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech: string) => (
                        <span
                          key={tech}
                          className="liquid-glass rounded-full px-3 py-1 text-xs text-white/80 font-body"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {result && (
                  <div dir={dir} className="space-y-2">
                    <h3 className="text-xs uppercase tracking-widest text-white/40 font-body">
                      {t("modal.section.result", "Result")}
                    </h3>
                    <p className="text-white/70 font-body font-light text-sm leading-relaxed">
                      {result}
                    </p>
                  </div>
                )}

                {!problem && longDescription && (
                  <div
                    dir={dir}
                    className="text-white/70 font-body font-light text-sm prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: marked(longDescription) as string,
                    }}
                  />
                )}

              </div>
            ) : null}
          </motion.div>

          <AnimatePresence>
            {selectedDev && (
              <DevProfilePopup
                dev={selectedDev}
                onClose={() => setSelectedDev(null)}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
