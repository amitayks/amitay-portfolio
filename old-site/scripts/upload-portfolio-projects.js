/**
 * Script to upload new dev projects to Supabase portfolio table
 *
 * Usage:
 *   npm run portfolio:upload              # Upload all new projects
 *   npm run portfolio:upload -- --dry-run # Preview without uploading
 *   npm run portfolio:upload -- --single=WEB-WEATHERMAN # Upload specific project
 */

import { createClient } from "@supabase/supabase-js";

// Supabase config
const supabaseUrl = "https://qjyybkgqqadjedgelakf.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqeXlia2dxcWFkamVkZ2VsYWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MTE0NDUsImV4cCI6MjA1NzE4NzQ0NX0.c5nEfh7VNoA6w8bYYoBmoYgAtO721_4h1tQgrNWNFEY";

const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================================================
// PROJECT DATA - 11 New Dev Projects
// ============================================================================

const projects = [
  {
    SKU: "WEB-WEATHERMAN",
    title: "WeatherMan - AI Weather Social Bot",
    description:
      "Automated social media bot that generates stunning isometric 3D city weather visualizations using AI and posts them across Instagram, X, and TikTok.",
    longDescription:
      "WeatherMan is an automated social media bot that creates beautiful isometric 3D city weather images using Google's Gemini AI and real-time weather data. The bot automatically posts to Instagram, X (Twitter), and TikTok with timezone-aware scheduling. Features include multi-city configuration via YAML, modular platform architecture, and GitHub Actions automation for hands-free operation at minimal cost.",
    technologies: ["Python", "Gemini AI", "GitHub Actions", "OpenWeatherMap"],
    projectType: "Web-Development",
    image: "",
    imagePack: [],
    featured: false,
    settings: { imageAspect: "squere", dir: "ltr" },
    priority: 10,
    publish: true,
    liveSite: {
      link: "https://amitayks.github.io/weatherMan/",
      subHeader: "WeatherMan Docs",
    },
    github: {
      link: "https://github.com/amitayks/weatherMan",
      subHeader: "amitayks/weatherMan",
    },
    additionalInfo: [
      { label: "Language", value: "Python" },
      { label: "AI Model", value: "Google Gemini 2.5 Flash" },
      { label: "Platforms", value: "Instagram, X, TikTok" },
      { label: "Automation", value: "GitHub Actions" },
    ],
  },
  {
    SKU: "WEB-ADDIT-DEV",
    title: "Addit - AI Call Recording Landing Page",
    description:
      "Modern marketing website for Addit, an AI-powered application for call recording and transcription, built with React and TypeScript.",
    longDescription:
      "A sleek, responsive marketing website for Addit - an AI-powered call recording and transcription application. Built with React 18 and TypeScript, featuring a modern landing page, features showcase, and legal documentation pages. The site uses hash-based routing for GitHub Pages compatibility and is styled with Tailwind CSS for a polished, professional appearance.",
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    projectType: "Web-Development",
    image: "",
    imagePack: [],
    featured: false,
    settings: { imageAspect: "squere", dir: "ltr" },
    priority: 10,
    publish: true,
    liveSite: {
      link: "https://addit.dev",
      subHeader: "addit.dev",
    },
    github: {
      link: "https://github.com/amitayks/addit.dev",
      subHeader: "amitayks/addit.dev",
    },
    additionalInfo: [
      { label: "Framework", value: "React 18 + TypeScript" },
      { label: "Build Tool", value: "Vite" },
      { label: "Styling", value: "Tailwind CSS" },
      { label: "Deployment", value: "GitHub Pages" },
    ],
  },
  {
    SKU: "WEB-ADDIT-APP",
    title: "Addit - AI Call Recording & Transcription App",
    description:
      "Privacy-first mobile app that automatically records, transcribes, and extracts actionable insights from phone calls and voice recordings - all processed locally on device.",
    longDescription:
      "A privacy-first React Native mobile app that captures and organizes your conversations intelligently. Features automatic call recording in background, AI-powered transcription in 90+ languages with speaker diarization, and smart extraction of calendar events, tasks, reminders, and follow-ups. Everything stays on your device with 100% local storage - you provide your own API keys for AI services. Available on both iOS App Store and Google Play.",
    technologies: [
      "React Native",
      "TypeScript",
      "Deepgram",
      "OpenAI",
      "MMKV",
      "SQLite",
    ],
    projectType: "Web-Development",
    image: "",
    imagePack: [],
    featured: false,
    settings: { imageAspect: "squere", dir: "ltr" },
    priority: 15,
    publish: true,
    liveSite: {
      link: "https://addit.dev",
      subHeader: "addit.dev",
    },
    github: null,
    additionalInfo: [
      { label: "Framework", value: "React Native 0.81" },
      { label: "AI Services", value: "Deepgram, Gladia, OpenAI" },
      { label: "Storage", value: "MMKV + SQLite (Local)" },
      { label: "Platforms", value: "iOS + Android" },
    ],
  },
  {
    SKU: "WEB-COMMIT-CONTENT-CREATOR",
    title: "Commit Content Tracker - AI Social Media Automation",
    description:
      "AI-powered system that transforms GitHub commits and PRs into engaging X (Twitter) threads, managed through a Telegram bot interface.",
    longDescription:
      "An intelligent automation system that bridges development activity with social media content distribution. The tool monitors GitHub repositories for commits and merged PRs, uses Grok AI to generate contextual and engaging content with auto-generated images, and allows review and approval through a Telegram bot before publishing to X (Twitter). Features per-repository customization, draft approval workflow, and enterprise-grade security measures.",
    technologies: [
      "TypeScript",
      "Cloudflare Workers",
      "Cloudflare D1",
      "Grok AI",
      "Telegram Bot",
    ],
    projectType: "Web-Development",
    image: "",
    imagePack: [],
    featured: false,
    settings: { imageAspect: "squere", dir: "ltr" },
    priority: 10,
    publish: true,
    liveSite: null,
    github: {
      link: "https://github.com/amitayks/commit-content-creatore",
      subHeader: "amitayks/commit-content-creatore",
    },
    additionalInfo: [
      { label: "Runtime", value: "Cloudflare Workers" },
      { label: "Database", value: "Cloudflare D1 (SQLite)" },
      { label: "AI Model", value: "Grok API" },
      { label: "Integrations", value: "GitHub, X, Telegram" },
    ],
  },
  {
    SKU: "WEB-BITBUCKET-PR-REVIEWER",
    title: "Bitbucket PR Reviewer - AI Code Review Automation",
    description:
      "AI-powered automated code review system for Bitbucket Cloud pull requests using Claude AI, with webhook-driven architecture and queue-based processing.",
    longDescription:
      "An intelligent code review automation system that analyzes Bitbucket Cloud pull requests using Claude AI. Features a webhook-driven architecture that eliminates polling, queue-based processing with Redis for scalability, and dual commenting system with both inline and summary reviews. Includes configurable review guidelines, enterprise-grade security with signature verification and rate limiting, and distributed locking to prevent race conditions.",
    technologies: [
      "TypeScript",
      "Node.js",
      "Express",
      "Redis",
      "Bull",
      "Claude AI",
    ],
    projectType: "Web-Development",
    image: "",
    imagePack: [],
    featured: false,
    settings: { imageAspect: "squere", dir: "ltr" },
    priority: 10,
    publish: true,
    liveSite: null,
    github: {
      link: "https://github.com/amitayks/bitbucket-pr-reviewer",
      subHeader: "amitayks/bitbucket-pr-reviewer",
    },
    additionalInfo: [
      { label: "Runtime", value: "Node.js 18+ TypeScript" },
      { label: "Framework", value: "Express.js" },
      { label: "AI Model", value: "Claude Sonnet 4" },
      { label: "Queue System", value: "Bull + Redis" },
    ],
  },
  {
    SKU: "WEB-NATIVE-CC-SKILL",
    title: "Native App Builder - Claude Code Skill",
    description:
      "Comprehensive Claude Code skill for building high-quality native applications across iOS, Android, macOS, Windows, Linux, and React Native with 60-120fps animations.",
    longDescription:
      "An educational skill designed for Claude Code that teaches developers how to build Telegram-quality native applications with smooth animations and scalable architectures. Covers iOS (SwiftUI/UIKit), Android (Jetpack Compose), React Native (TurboModules/Reanimated 3), macOS, Windows (WinUI 3), and Linux (GTK 4/Qt 6). Includes 50+ animation patterns, profiling guides, Clean Architecture patterns, and a structured 6-week learning path from foundations to advanced techniques.",
    technologies: [
      "Claude Code Skill",
      "SwiftUI",
      "Jetpack Compose",
      "React Native",
    ],
    projectType: "Web-Development",
    image: "",
    imagePack: [],
    featured: false,
    settings: { imageAspect: "squere", dir: "ltr" },
    priority: 10,
    publish: true,
    liveSite: null,
    github: {
      link: "https://github.com/amitayks/Native-CC-skill",
      subHeader: "amitayks/Native-CC-skill",
    },
    additionalInfo: [
      { label: "Type", value: "Claude Code Skill" },
      { label: "Platforms", value: "iOS, Android, RN, Desktop" },
      { label: "Focus", value: "60-120fps Animations" },
      { label: "Content", value: "50+ animation patterns" },
    ],
  },
  {
    SKU: "WEB-REACT-NATIVE-TEMPLATE",
    title: "React Native Template - Production-Ready Starter",
    description:
      "Production-ready React Native template with atomic design system, WatermelonDB, clean architecture, and AI-assisted customization via OpenSpec.",
    longDescription:
      "A comprehensive React Native application template designed to accelerate mobile app development. Built with React Native 0.81 New Architecture (JSI), TypeScript strict mode, WatermelonDB for reactive local database, and React Reanimated for animations. Features atomic design methodology with complete UI component library, light/dark theme system, bottom-tab navigation, multi-step onboarding, and OpenSpec integration for AI-guided customization. Production-ready with Android release signing setup and security guidelines.",
    technologies: [
      "React Native",
      "TypeScript",
      "WatermelonDB",
      "React Reanimated",
      "OpenSpec",
    ],
    projectType: "Web-Development",
    image: "",
    imagePack: [],
    featured: false,
    settings: { imageAspect: "squere", dir: "ltr" },
    priority: 10,
    publish: true,
    liveSite: null,
    github: {
      link: "https://github.com/amitayks/react-native-template",
      subHeader: "amitayks/react-native-template",
    },
    additionalInfo: [
      { label: "Framework", value: "React Native 0.81 (New Arch)" },
      { label: "Database", value: "WatermelonDB" },
      { label: "Design System", value: "Atomic Design" },
      { label: "Animations", value: "React Reanimated 3" },
    ],
  },
  {
    SKU: "WEB-AI-PROMPT-BUILDER",
    title: "Visual Content Studio - AI Prompt Builder Skill",
    description:
      "Claude Code skill that transforms descriptions into professional, structured prompts for AI image and video generation tools like DALL-E, Midjourney, and Veo.",
    longDescription:
      "A Claude Code skill that streamlines the creation of professional visual prompts for AI image and video generation. Functions as a creative collaborator with four operating modes: new character creation, reference-based imaging, video creation (Veo 3.1 format), and video transitions. Emphasizes mood over mechanics - users specify emotional tone and aesthetic references rather than exact measurements. Maintains character consistency across multiple scenes with master character definitions and organized project structures.",
    technologies: ["Claude Code Skill", "DALL-E", "Midjourney", "Veo"],
    projectType: "Web-Development",
    image: "",
    imagePack: [],
    featured: false,
    settings: { imageAspect: "squere", dir: "ltr" },
    priority: 10,
    publish: true,
    liveSite: null,
    github: {
      link: "https://github.com/amitayks/AI-Prompt-Builder",
      subHeader: "amitayks/AI-Prompt-Builder",
    },
    additionalInfo: [
      { label: "Type", value: "Claude Code Skill" },
      { label: "Output", value: "Image + Video Prompts" },
      { label: "AI Tools", value: "DALL-E, Midjourney, Veo" },
      { label: "Modes", value: "Character, Scene, Video" },
    ],
  },
  {
    SKU: "WEB-OPEN-LAMPLIGHTER",
    title: "OpenLamplighter - Privacy-First Transcription Tool",
    description:
      "Privacy-centric transcription application that converts audio and video to text using OpenAI Whisper API or offline local processing.",
    longDescription:
      "A privacy-focused transcription tool that converts audio and video recordings into text. Supports dual transcription engines: OpenAI Whisper API for speed or local Whisper for complete privacy with offline processing. Handles multiple formats including MP3, M4A, WAV, MP4 and more. Features automatic cleanup of temporary files, Google Drive integration, and multiple model sizes from tiny to large for local processing. Includes Claude Code skill for IDE integration.",
    technologies: ["Python", "OpenAI Whisper", "Google Drive API"],
    projectType: "Web-Development",
    image: "",
    imagePack: [],
    featured: false,
    settings: { imageAspect: "squere", dir: "ltr" },
    priority: 10,
    publish: true,
    liveSite: null,
    github: {
      link: "https://github.com/amitayks/OpenLamplighter",
      subHeader: "amitayks/OpenLamplighter",
    },
    additionalInfo: [
      { label: "Language", value: "Python" },
      { label: "AI Model", value: "OpenAI Whisper" },
      { label: "Modes", value: "Cloud API + Offline Local" },
      { label: "Formats", value: "MP3, M4A, WAV, MP4, WEBM" },
    ],
  },
  {
    SKU: "WEB-VISARA",
    title: "Visara - Intelligent Document Scanner App",
    description:
      "React Native mobile app that automatically detects documents in photo galleries and extracts text using multi-engine OCR with smart classification.",
    longDescription:
      "An intelligent document scanner mobile application built with React Native and TypeScript. Automatically scans photo galleries for documents, receipts, and text-based images using background processing. Features multi-engine OCR (MLKit, Tesseract, VisionCamera) with confidence-based engine selection, smart document classification, full-text and semantic search capabilities, and automatic metadata extraction. Optimized for performance with memory-efficient processing, battery-aware scanning, and smooth animations with dark/light theme support.",
    technologies: [
      "React Native",
      "TypeScript",
      "WatermelonDB",
      "MLKit",
      "Tesseract",
    ],
    projectType: "Web-Development",
    image: "",
    imagePack: [],
    featured: false,
    settings: { imageAspect: "squere", dir: "ltr" },
    priority: 10,
    publish: true,
    liveSite: null,
    github: {
      link: "https://github.com/amitayks/visara",
      subHeader: "amitayks/visara",
    },
    additionalInfo: [
      { label: "Framework", value: "React Native + TypeScript" },
      { label: "Database", value: "WatermelonDB" },
      { label: "OCR Engines", value: "MLKit, Tesseract, Vision" },
      { label: "Search", value: "Full-text + Semantic" },
    ],
  },
  {
    SKU: "WEB-KEISAR-CLUB-APP",
    title: "Keisar Club App - Mobile Portfolio",
    description:
      "React Native Expo portfolio application showcasing creative projects with iOS-style UI, smooth animations, and Supabase backend integration.",
    longDescription:
      "A React Native Expo portfolio mobile application showcasing creative projects across web development, woodworking, and design. Features an interactive gallery system with grid-based portfolio display and iOS-style wheel picker for filtering, horizontal scrolling image carousels with lazy loading, built-in contact form with EmailJS integration, and haptic feedback for enhanced interactions. Built with TypeScript, Supabase backend, React Query for data management, and React Native Reanimated for smooth animations.",
    technologies: [
      "React Native",
      "Expo",
      "TypeScript",
      "Supabase",
      "React Query",
    ],
    projectType: "Web-Development",
    image: "",
    imagePack: [],
    featured: false,
    settings: { imageAspect: "squere", dir: "ltr" },
    priority: 10,
    publish: true,
    liveSite: null,
    github: {
      link: "https://github.com/amitayks/keisar-club-app",
      subHeader: "amitayks/keisar-club-app",
    },
    additionalInfo: [
      { label: "Framework", value: "React Native + Expo" },
      { label: "Backend", value: "Supabase" },
      { label: "Data Management", value: "React Query" },
      { label: "Animations", value: "React Native Reanimated" },
    ],
  },
];

// ============================================================================
// UPLOAD LOGIC
// ============================================================================

async function checkExisting() {
  const { data, error } = await supabase
    .from("portfolio")
    .select("SKU")
    .in(
      "SKU",
      projects.map((p) => p.SKU)
    );

  if (error) {
    console.error("Error checking existing:", error);
    return [];
  }
  return data?.map((d) => d.SKU) || [];
}

async function uploadProjects(dryRun = false, singleSku = null) {
  console.log("\n📦 Portfolio Projects Upload Script\n");
  console.log("=".repeat(50));

  // Filter to single project if specified
  let projectsToUpload = singleSku
    ? projects.filter((p) => p.SKU === singleSku)
    : projects;

  if (singleSku && projectsToUpload.length === 0) {
    console.error(`❌ No project found with SKU: ${singleSku}`);
    console.log("\nAvailable SKUs:");
    projects.forEach((p) => console.log(`  - ${p.SKU}`));
    process.exit(1);
  }

  // Check for existing
  const existing = await checkExisting();
  const newProjects = projectsToUpload.filter((p) => !existing.includes(p.SKU));
  const skipped = projectsToUpload.filter((p) => existing.includes(p.SKU));

  console.log(`\n📊 Summary:`);
  console.log(`   Total projects: ${projectsToUpload.length}`);
  console.log(`   Already exist: ${skipped.length}`);
  console.log(`   To upload: ${newProjects.length}`);

  if (skipped.length > 0) {
    console.log(`\n⏭️  Skipping (already exist):`);
    skipped.forEach((p) => console.log(`   - ${p.SKU}`));
  }

  if (newProjects.length === 0) {
    console.log("\n✅ Nothing to upload - all projects already exist!");
    return;
  }

  console.log(`\n📤 Projects to upload:`);
  newProjects.forEach((p) => {
    console.log(`   - ${p.SKU}: ${p.title}`);
  });

  if (dryRun) {
    console.log("\n🔍 DRY RUN - No data will be uploaded");
    console.log("\nProject data preview:");
    newProjects.forEach((p) => {
      console.log(`\n--- ${p.SKU} ---`);
      console.log(JSON.stringify(p, null, 2));
    });
    return;
  }

  // Upload
  console.log("\n⬆️  Uploading...\n");

  for (const project of newProjects) {
    process.stdout.write(`   ${project.SKU}... `);

    const { error } = await supabase.from("portfolio").insert(project);

    if (error) {
      console.log(`❌ Error: ${error.message}`);
    } else {
      console.log("✅");
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("✅ Upload complete!");
}

// ============================================================================
// CLI
// ============================================================================

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const singleArg = args.find((a) => a.startsWith("--single="));
const singleSku = singleArg ? singleArg.split("=")[1] : null;

if (args.includes("--help")) {
  console.log(`
Portfolio Upload Script

Usage:
  node scripts/upload-portfolio-projects.js [options]

Options:
  --dry-run        Preview data without uploading
  --single=SKU     Upload only a specific project
  --help           Show this help

Available SKUs:
${projects.map((p) => `  - ${p.SKU}`).join("\n")}
`);
  process.exit(0);
}

uploadProjects(dryRun, singleSku).catch(console.error);
