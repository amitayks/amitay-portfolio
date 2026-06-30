import { useEffect } from "react";
import { motion } from "motion/react";
import {
  Github,
  Linkedin,
  Twitter,
  Globe,
  FileText,
  User,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import type { AvailabilityStatus, ProfileLinks } from "@/types/profile";

// The resolved, display-ready developer the popup renders. Produced by
// `devList()` in ProjectModal so anonymized handling stays in one place.
export interface DevProfile {
  id: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  headline: string | null;
  skills: string[];
  availability: AvailabilityStatus | null;
  githubHandle: string | null;
  links: ProfileLinks;
  resumeUrl: string | null;
}

const MAX_SKILLS = 6;

const AVAILABILITY: Record<AvailabilityStatus, { label: string; dot: string }> = {
  available: { label: "Available", dot: "bg-emerald-400" },
  open_to_work: { label: "Open to work", dot: "bg-sky-400" },
  busy: { label: "Busy", dot: "bg-amber-400" },
};

interface DevLink {
  icon: LucideIcon;
  label: string;
  href: string;
}

function buildLinks(dev: DevProfile): DevLink[] {
  const githubHref = dev.githubHandle
    ? `https://github.com/${dev.githubHandle}`
    : dev.links.github;
  const links: DevLink[] = [];
  if (githubHref) links.push({ icon: Github, label: "GitHub", href: githubHref });
  if (dev.links.linkedin)
    links.push({ icon: Linkedin, label: "LinkedIn", href: dev.links.linkedin });
  if (dev.links.website)
    links.push({ icon: Globe, label: "Website", href: dev.links.website });
  if (dev.links.twitter)
    links.push({ icon: Twitter, label: "Twitter", href: dev.links.twitter });
  if (dev.resumeUrl)
    links.push({ icon: FileText, label: "Resume", href: dev.resumeUrl });
  return links;
}

// A minimalist developer profile card, layered above the project modal.
// Opened from the credits (mobile dev tab / desktop avatars). Escape and a
// backdrop click dismiss only this popup, leaving the project modal open.
export function DevProfilePopup({
  dev,
  onClose,
}: {
  dev: DevProfile | null;
  onClose: () => void;
}) {
  const { dir } = useLanguage();

  // Capture-phase Escape so we can stop the project modal's own Escape
  // handler (registered later, in the bubble phase) from also firing.
  useEffect(() => {
    if (!dev) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [dev, onClose]);

  if (!dev) return null;

  const availability = dev.availability ? AVAILABILITY[dev.availability] : null;
  const skills = dev.skills.slice(0, MAX_SKILLS);
  const extraSkills = dev.skills.length - skills.length;
  const links = buildLinks(dev);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[90] flex items-center justify-center p-6 bg-black/50 backdrop-blur-[6px]"
      onClick={onClose}
    >
      <motion.div
        dir={dir}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="liquid-glass rounded-3xl w-full max-w-sm p-7 flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={dev.name}
      >
        {/* Avatar */}
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden">
          {dev.avatarUrl ? (
            <img
              src={dev.avatarUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
              <User className="w-1/3 h-1/3 text-white/40" />
            </div>
          )}
        </div>

        {/* Name + availability badge */}
        <div className="mt-4 flex items-center gap-2.5 flex-wrap justify-center">
          <h2 className="text-xl font-semibold text-white">{dev.name}</h2>
          {availability && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] border border-white/10 px-2.5 py-0.5 text-xs text-white/70">
              <span className={`w-1.5 h-1.5 rounded-full ${availability.dot}`} />
              {availability.label}
            </span>
          )}
        </div>

        {/* Headline */}
        {dev.headline && (
          <p className="mt-1 text-sm text-white/50 font-body">{dev.headline}</p>
        )}

        {/* Bio */}
        {dev.bio && (
          <p className="mt-4 text-sm text-white/70 font-body font-light leading-relaxed line-clamp-4">
            {dev.bio}
          </p>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-white/[0.06] border border-white/10 px-3 py-1 text-xs text-white/80 font-body"
              >
                {skill}
              </span>
            ))}
            {extraSkills > 0 && (
              <span className="rounded-full px-3 py-1 text-xs text-white/40 font-body">
                +{extraSkills}
              </span>
            )}
          </div>
        )}

        {/* Links */}
        {links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {links.map(({ icon: Icon, label, href }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex items-center gap-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/5 px-3.5 py-2 text-sm text-white/70 hover:text-white transition-colors"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                {label}
              </motion.a>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
