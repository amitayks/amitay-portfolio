import { Button } from "@/components/ui/button";
import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  PhoneCall,
  Twitter,
  Youtube,
} from "lucide-react";
import { motion } from "framer-motion";

// Social link type definition
export interface SocialLink {
  label: string;
  value: string;
  ariaLabel?: string;
}

// Component props interface
interface SocialLinksComponentProps {
  socialLinks: SocialLink[];
  variant?: "outline" | "filled" | "default" | "ghost";
  size?: "sm" | "md" | "lg";
  orientation?: "horizontal" | "vertical";
  className?: string;
  showLabels?: boolean;
  iconClassName?: string;
  linkClassName?: string;
}

// Icon mapping for different social platforms
const getSocialIcon = (label: string, className: string = "w-5 h-5") => {
  const normalizedLabel = label.toLowerCase().trim();

  switch (normalizedLabel) {
    case "github":
      return <Github className={className} />;
    case "linkedin":
      return <Linkedin className={className} />;
    case "facebook":
      return <Facebook className={className} />;
    case "instagram":
      return <Instagram className={className} />;
    case "twitter":
    case "x":
      return <Twitter className={className} />;
    case "youtube":
      return <Youtube className={className} />;
    case "email":
    case "mail":
      return <Mail className={className} />;
    case "whatsapp":
      return <MessageCircle className={className} />;
    case "phone":
      return <PhoneCall className={className} />;
    case "tel":
    case "telephone":
      return <Phone className={className} />;
    case "location":
    case "address":
      return <MapPin className={className} />;
    default:
      return <Mail className={className} />; // Default fallback
  }
};

// Helper function to format href based on label
const formatHref = (label: string, value: string): string => {
  const normalizedLabel = label.toLowerCase().trim();

  // If value already contains protocol, return as is
  if (value.startsWith("http") || value.startsWith("mailto:") || value.startsWith("tel:")) {
    return value;
  }

  switch (normalizedLabel) {
    case "email":
    case "mail":
      return `mailto:${value}`;
    case "phone":
    case "tel":
    case "telephone":
      return `tel:${value}`;
    case "whatsapp":
      // Extract number if it's a full URL, otherwise format as WhatsApp link
      if (value.includes("wa.me")) return value;
      return `https://wa.me/${value.replace(/\D/g, "")}`; // Remove non-digits
    default:
      return value;
  }
};

const SocialLinksComponent = ({
  socialLinks,
  variant = "outline",
  size = "md",
  orientation = "horizontal",
  className = "",
  showLabels = false,
  iconClassName,
  linkClassName,
}: SocialLinksComponentProps) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      container: "gap-2",
      icon: "w-4 h-4",
      buttonSize: "icon" as const,
      text: "text-xs",
    },
    md: {
      container: "gap-3",
      icon: "w-4 h-4",
      buttonSize: "icon" as const,
      text: "text-sm",
    },
    lg: {
      container: "gap-4",
      icon: "w-6 h-6",
      buttonSize: "icon" as const,
      text: "text-base",
    },
  };

  const config = sizeConfig[size];

  // Container classes based on orientation
  const containerClasses = `
    flex ${orientation === "horizontal" ? "flex-row" : "flex-col"}
    ${config.container}
    ${orientation === "horizontal" ? "justify-center" : "items-center"}
    ${className}
  `.trim();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      className={containerClasses}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {socialLinks.map((link) => {
        const href = formatHref(link.label, link.value);
        const isExternal = href.startsWith("http");
        const iconSize = iconClassName || config.icon;

        return (
          <motion.div
            key={link.value}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant={variant as any}
              size={showLabels ? "default" : config.buttonSize}
              asChild
              className={linkClassName}
            >
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                aria-label={link.ariaLabel || `${link.label} link`}
                title={link.ariaLabel || link.label}
              >
                <motion.div
                  className={`flex items-center ${
                    showLabels && orientation === "horizontal" ? "gap-2" : ""
                  } ${orientation === "vertical" ? "flex-col gap-1" : ""}`}
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {getSocialIcon(link.label, iconSize)}
                  {showLabels && (
                    <span className={`${config.text} font-medium capitalize`}>
                      {link.label}
                    </span>
                  )}
                </motion.div>
              </a>
            </Button>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default SocialLinksComponent;
