import { Briefcase, Home, Mail, User } from "lucide-react";

export const PAGE_SIZE = 6;

export const HEADER_LINKS = [
  { to: "/", translationKey: "nav.home", icon: Home },
  { to: "/portfolio", translationKey: "nav.portfolio", icon: Briefcase },
  { to: "/about", translationKey: "nav.about", icon: User },
  { to: "/Apply", translationKey: "nav.contact", icon: Mail },
];

export const PROJECT_TYPES = [
  { value: "all", translationKey: "portfolio.filter.all" },
  { value: "Wood-Working", translationKey: "portfolio.filter.woodWorking" },
  { value: "Web-Development", translationKey: "portfolio.filter.webDevelopment" },
  // { value: "Design", translationKey: "portfolio.filter.design" },
];

export const PERSONAL_INFO = {
  name: "Amitay Keisar",
  title: " Developer & Craftsman",
  tagline: "'The balance between the physical and the virtual worlds'",
  bio: "A showcase of my journey through digital and handcrafted creations.",
  profileImage: "profile-image-banner.jpg",
  profileImage2: "profile-image-banner-2.jpg",
  email: "amiteyk3@gmail.com",
  phone: "+972-526-471-797",
  whatsapp: "https://wa.me/972526471797",
  github: "https://github.com/amitayks",
  linkedin: "https://linkedin.com/in/amitaykeisar",
  instagram: "https://instagram.com/amitay.ks",
  facebook: "https://www.facebook.com/profile.php?id=100086721472400&mibextid=ZbWKwL",
  x: "https://x.com/AmKeisar",
} as const;

export const SOCIAL_LINKS = [
  { label: "github", value: "https://github.com/amitayks" },
  { label: "instagram", value: "https://instagram.com/amitay.ks" },
  { label: "x", value: "https://x.com/AmKeisar" },
  { label: "whatsapp", value: "+972-526-471-797" },
  { label: "phone", value: "972526471797" },
  { label: "email", value: "amiteyk3@gmail.com" },
  { label: "linkedin", value: "https://linkedin.com/in/amitaykeisar" },
];

export const SKILLS = [
  {
    category: "Web Development",
    skills: ["React + Redux", "JavaScript", "TypeScript", "Styled components", "Next.js"],
    level: "advanced" as const,
  },
  {
    category: "Wood Working",
    skills: ["Furniture Design", "Wood Turning", "Joinery", "Finishing", "Tool Making"],
    level: "expert" as const,
  },

  {
    category: "Design",
    skills: ["UI/UX Design", "Tailwind CSS", "Figma", "Adobe Creative Suite"],
    level: "intermediate" as const,
  },
  {
    category: "Tools & Technologies",
    skills: ["Git", "VS Code", "Vite", "Supabase", "Vercel"],
    level: "advanced" as const,
  },
];

export const EXPERIENCE = [
  {
    title: "Independent Woodworker & Laser Cutting Specialist",
    subtitle: "Keisar Club - Self-Employed",
    period: "Feb 2023 - Present",
    description:
      "Founded and operate a specialized woodworking business focusing on custom furniture design and precision laser engraving & cutting services. Manage end-to-end project delivery from client consultation to final product completion, combining traditional craftsmanship with modern manufacturing techniques.",
  },
  {
    title: "Intelligence Unit - Office Manager",
    subtitle: "IDF",
    period: "Jan 2021 - Apr 2024",
    description:
      "Served in a specialized Intelligence Unit with responsibilities including office administration, team leadership, and personnel management. Led and supervised multiple soldiers while maintaining operational efficiency and ensuring mission-critical objectives were met.",
  },
  {
    title: "Climbing Wall Instructor",
    subtitle: "Iclimb",
    period: "Nov 2018 – Jun 2020",
    description:
      "Provided professional climbing instruction and safety supervision for climbers of all skill levels. Ensured adherence to safety protocols while fostering skill development and promoting climbing techniques in a dynamic recreational environment.",
  },
];

export const EDUCATION = [
  {
    title: "Full-Stack Web Development - React & TypeScript",
    subtitle: "Udemy",
    period: "2024",
    description:
      "Comprehensive training in modern web development technologies including React, TypeScript, Redux, React Query, and Next.js. Gained proficiency in building scalable, interactive web applications with advanced state management and server-side rendering capabilities.",
  },
  {
    title: "Frontend Web Development - JavaScript & Modern Web Technologies",
    subtitle: "Udemy",
    period: "2023",
    description:
      "Intensive course covering JavaScript fundamentals, CSS advanced techniques, UI/UX design with Figma, and backend integration using Supabase. Developed skills in responsive design, database management, and modern web development workflows.",
  },
  {
    title: "High School",
    subtitle: "High School (תיכון דתי אדר)",
    period: "2016 - 2020",
    description:
      "Completed comprehensive secondary education at Adar Religious High School, developing strong analytical and communication skills while maintaining academic excellence in a structured learning environment.",
  },
];

export const PROJECT_TYPE_COLOR = {
  "Wood-Working": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  "Web-Development": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Design: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

export const EMAILJS_CONFIG = {
  SERVICE_ID: "service_vtxkxkm",
  TEMPLATE_ID: "template_1eehme9", // Replace with your new template ID if you create a new one
  USER_ID: "fI7maFmjNQrrkKrV3",
};
