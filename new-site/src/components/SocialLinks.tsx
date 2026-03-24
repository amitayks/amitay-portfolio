import { Github, Linkedin, Twitter, Instagram, MessageCircle, Mail } from "lucide-react";
import { SOCIAL_LINKS } from "@/constants/personal";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  x: Twitter,
  instagram: Instagram,
  whatsapp: MessageCircle,
  email: Mail,
};

export function SocialLinks() {
  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      {SOCIAL_LINKS.map((link) => {
        const Icon = ICON_MAP[link.label];
        if (!Icon) return null;
        return (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass-strong rounded-[10px] w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            aria-label={link.label}
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
    </div>
  );
}
