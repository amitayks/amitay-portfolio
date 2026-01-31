-- Portfolio Projects Insert Script
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/qjyybkgqqadjedgelakf/sql
-- Generated: 2026-01-31

-- ============================================================================
-- INSERT 11 NEW DEV PROJECTS
-- ============================================================================

INSERT INTO portfolio ("SKU", title, description, "longDescription", technologies, "projectType", image, "imagePack", featured, settings, priority, publish, "liveSite", github, "additionalInfo")
VALUES
-- 1. WEB-WEATHERMAN
(
  'WEB-WEATHERMAN',
  'WeatherMan - AI Weather Social Bot',
  'Automated social media bot that generates stunning isometric 3D city weather visualizations using AI and posts them across Instagram, X, and TikTok.',
  'WeatherMan is an automated social media bot that creates beautiful isometric 3D city weather images using Google''s Gemini AI and real-time weather data. The bot automatically posts to Instagram, X (Twitter), and TikTok with timezone-aware scheduling. Features include multi-city configuration via YAML, modular platform architecture, and GitHub Actions automation for hands-free operation at minimal cost.',
  ARRAY['Python', 'Gemini AI', 'GitHub Actions', 'OpenWeatherMap'],
  'Web-Development',
  '',
  ARRAY[]::text[],
  false,
  '{"imageAspect": "squere", "dir": "ltr"}'::jsonb,
  10,
  true,
  '{"link": "https://amitayks.github.io/weatherMan/", "subHeader": "WeatherMan Docs"}'::jsonb,
  '{"link": "https://github.com/amitayks/weatherMan", "subHeader": "amitayks/weatherMan"}'::jsonb,
  '[{"label": "Language", "value": "Python"}, {"label": "AI Model", "value": "Google Gemini 2.5 Flash"}, {"label": "Platforms", "value": "Instagram, X, TikTok"}, {"label": "Automation", "value": "GitHub Actions"}]'::jsonb
),

-- 2. WEB-ADDIT-DEV
(
  'WEB-ADDIT-DEV',
  'Addit - AI Call Recording Landing Page',
  'Modern marketing website for Addit, an AI-powered application for call recording and transcription, built with React and TypeScript.',
  'A sleek, responsive marketing website for Addit - an AI-powered call recording and transcription application. Built with React 18 and TypeScript, featuring a modern landing page, features showcase, and legal documentation pages. The site uses hash-based routing for GitHub Pages compatibility and is styled with Tailwind CSS for a polished, professional appearance.',
  ARRAY['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
  'Web-Development',
  '',
  ARRAY[]::text[],
  false,
  '{"imageAspect": "squere", "dir": "ltr"}'::jsonb,
  10,
  true,
  '{"link": "https://addit.dev", "subHeader": "addit.dev"}'::jsonb,
  '{"link": "https://github.com/amitayks/addit.dev", "subHeader": "amitayks/addit.dev"}'::jsonb,
  '[{"label": "Framework", "value": "React 18 + TypeScript"}, {"label": "Build Tool", "value": "Vite"}, {"label": "Styling", "value": "Tailwind CSS"}, {"label": "Deployment", "value": "GitHub Pages"}]'::jsonb
),

-- 3. WEB-ADDIT-APP
(
  'WEB-ADDIT-APP',
  'Addit - AI Call Recording & Transcription App',
  'Privacy-first mobile app that automatically records, transcribes, and extracts actionable insights from phone calls and voice recordings - all processed locally on device.',
  'A privacy-first React Native mobile app that captures and organizes your conversations intelligently. Features automatic call recording in background, AI-powered transcription in 90+ languages with speaker diarization, and smart extraction of calendar events, tasks, reminders, and follow-ups. Everything stays on your device with 100% local storage - you provide your own API keys for AI services. Available on both iOS App Store and Google Play.',
  ARRAY['React Native', 'TypeScript', 'Deepgram', 'OpenAI', 'MMKV', 'SQLite'],
  'Web-Development',
  '',
  ARRAY[]::text[],
  false,
  '{"imageAspect": "squere", "dir": "ltr"}'::jsonb,
  15,
  true,
  '{"link": "https://addit.dev", "subHeader": "addit.dev"}'::jsonb,
  NULL,
  '[{"label": "Framework", "value": "React Native 0.81"}, {"label": "AI Services", "value": "Deepgram, Gladia, OpenAI"}, {"label": "Storage", "value": "MMKV + SQLite (Local)"}, {"label": "Platforms", "value": "iOS + Android"}]'::jsonb
),

-- 4. WEB-COMMIT-CONTENT-CREATOR
(
  'WEB-COMMIT-CONTENT-CREATOR',
  'Commit Content Tracker - AI Social Media Automation',
  'AI-powered system that transforms GitHub commits and PRs into engaging X (Twitter) threads, managed through a Telegram bot interface.',
  'An intelligent automation system that bridges development activity with social media content distribution. The tool monitors GitHub repositories for commits and merged PRs, uses Grok AI to generate contextual and engaging content with auto-generated images, and allows review and approval through a Telegram bot before publishing to X (Twitter). Features per-repository customization, draft approval workflow, and enterprise-grade security measures.',
  ARRAY['TypeScript', 'Cloudflare Workers', 'Cloudflare D1', 'Grok AI', 'Telegram Bot'],
  'Web-Development',
  '',
  ARRAY[]::text[],
  false,
  '{"imageAspect": "squere", "dir": "ltr"}'::jsonb,
  10,
  true,
  NULL,
  '{"link": "https://github.com/amitayks/commit-content-creatore", "subHeader": "amitayks/commit-content-creatore"}'::jsonb,
  '[{"label": "Runtime", "value": "Cloudflare Workers"}, {"label": "Database", "value": "Cloudflare D1 (SQLite)"}, {"label": "AI Model", "value": "Grok API"}, {"label": "Integrations", "value": "GitHub, X, Telegram"}]'::jsonb
),

-- 5. WEB-BITBUCKET-PR-REVIEWER
(
  'WEB-BITBUCKET-PR-REVIEWER',
  'Bitbucket PR Reviewer - AI Code Review Automation',
  'AI-powered automated code review system for Bitbucket Cloud pull requests using Claude AI, with webhook-driven architecture and queue-based processing.',
  'An intelligent code review automation system that analyzes Bitbucket Cloud pull requests using Claude AI. Features a webhook-driven architecture that eliminates polling, queue-based processing with Redis for scalability, and dual commenting system with both inline and summary reviews. Includes configurable review guidelines, enterprise-grade security with signature verification and rate limiting, and distributed locking to prevent race conditions.',
  ARRAY['TypeScript', 'Node.js', 'Express', 'Redis', 'Bull', 'Claude AI'],
  'Web-Development',
  '',
  ARRAY[]::text[],
  false,
  '{"imageAspect": "squere", "dir": "ltr"}'::jsonb,
  10,
  true,
  NULL,
  '{"link": "https://github.com/amitayks/bitbucket-pr-reviewer", "subHeader": "amitayks/bitbucket-pr-reviewer"}'::jsonb,
  '[{"label": "Runtime", "value": "Node.js 18+ TypeScript"}, {"label": "Framework", "value": "Express.js"}, {"label": "AI Model", "value": "Claude Sonnet 4"}, {"label": "Queue System", "value": "Bull + Redis"}]'::jsonb
),

-- 6. WEB-NATIVE-CC-SKILL
(
  'WEB-NATIVE-CC-SKILL',
  'Native App Builder - Claude Code Skill',
  'Comprehensive Claude Code skill for building high-quality native applications across iOS, Android, macOS, Windows, Linux, and React Native with 60-120fps animations.',
  'An educational skill designed for Claude Code that teaches developers how to build Telegram-quality native applications with smooth animations and scalable architectures. Covers iOS (SwiftUI/UIKit), Android (Jetpack Compose), React Native (TurboModules/Reanimated 3), macOS, Windows (WinUI 3), and Linux (GTK 4/Qt 6). Includes 50+ animation patterns, profiling guides, Clean Architecture patterns, and a structured 6-week learning path from foundations to advanced techniques.',
  ARRAY['Claude Code Skill', 'SwiftUI', 'Jetpack Compose', 'React Native'],
  'Web-Development',
  '',
  ARRAY[]::text[],
  false,
  '{"imageAspect": "squere", "dir": "ltr"}'::jsonb,
  10,
  true,
  NULL,
  '{"link": "https://github.com/amitayks/Native-CC-skill", "subHeader": "amitayks/Native-CC-skill"}'::jsonb,
  '[{"label": "Type", "value": "Claude Code Skill"}, {"label": "Platforms", "value": "iOS, Android, RN, Desktop"}, {"label": "Focus", "value": "60-120fps Animations"}, {"label": "Content", "value": "50+ animation patterns"}]'::jsonb
),

-- 7. WEB-REACT-NATIVE-TEMPLATE
(
  'WEB-REACT-NATIVE-TEMPLATE',
  'React Native Template - Production-Ready Starter',
  'Production-ready React Native template with atomic design system, WatermelonDB, clean architecture, and AI-assisted customization via OpenSpec.',
  'A comprehensive React Native application template designed to accelerate mobile app development. Built with React Native 0.81 New Architecture (JSI), TypeScript strict mode, WatermelonDB for reactive local database, and React Reanimated for animations. Features atomic design methodology with complete UI component library, light/dark theme system, bottom-tab navigation, multi-step onboarding, and OpenSpec integration for AI-guided customization. Production-ready with Android release signing setup and security guidelines.',
  ARRAY['React Native', 'TypeScript', 'WatermelonDB', 'React Reanimated', 'OpenSpec'],
  'Web-Development',
  '',
  ARRAY[]::text[],
  false,
  '{"imageAspect": "squere", "dir": "ltr"}'::jsonb,
  10,
  true,
  NULL,
  '{"link": "https://github.com/amitayks/react-native-template", "subHeader": "amitayks/react-native-template"}'::jsonb,
  '[{"label": "Framework", "value": "React Native 0.81 (New Arch)"}, {"label": "Database", "value": "WatermelonDB"}, {"label": "Design System", "value": "Atomic Design"}, {"label": "Animations", "value": "React Reanimated 3"}]'::jsonb
),

-- 8. WEB-AI-PROMPT-BUILDER
(
  'WEB-AI-PROMPT-BUILDER',
  'Visual Content Studio - AI Prompt Builder Skill',
  'Claude Code skill that transforms descriptions into professional, structured prompts for AI image and video generation tools like DALL-E, Midjourney, and Veo.',
  'A Claude Code skill that streamlines the creation of professional visual prompts for AI image and video generation. Functions as a creative collaborator with four operating modes: new character creation, reference-based imaging, video creation (Veo 3.1 format), and video transitions. Emphasizes mood over mechanics - users specify emotional tone and aesthetic references rather than exact measurements. Maintains character consistency across multiple scenes with master character definitions and organized project structures.',
  ARRAY['Claude Code Skill', 'DALL-E', 'Midjourney', 'Veo'],
  'Web-Development',
  '',
  ARRAY[]::text[],
  false,
  '{"imageAspect": "squere", "dir": "ltr"}'::jsonb,
  10,
  true,
  NULL,
  '{"link": "https://github.com/amitayks/AI-Prompt-Builder", "subHeader": "amitayks/AI-Prompt-Builder"}'::jsonb,
  '[{"label": "Type", "value": "Claude Code Skill"}, {"label": "Output", "value": "Image + Video Prompts"}, {"label": "AI Tools", "value": "DALL-E, Midjourney, Veo"}, {"label": "Modes", "value": "Character, Scene, Video"}]'::jsonb
),

-- 9. WEB-OPEN-LAMPLIGHTER
(
  'WEB-OPEN-LAMPLIGHTER',
  'OpenLamplighter - Privacy-First Transcription Tool',
  'Privacy-centric transcription application that converts audio and video to text using OpenAI Whisper API or offline local processing.',
  'A privacy-focused transcription tool that converts audio and video recordings into text. Supports dual transcription engines: OpenAI Whisper API for speed or local Whisper for complete privacy with offline processing. Handles multiple formats including MP3, M4A, WAV, MP4 and more. Features automatic cleanup of temporary files, Google Drive integration, and multiple model sizes from tiny to large for local processing. Includes Claude Code skill for IDE integration.',
  ARRAY['Python', 'OpenAI Whisper', 'Google Drive API'],
  'Web-Development',
  '',
  ARRAY[]::text[],
  false,
  '{"imageAspect": "squere", "dir": "ltr"}'::jsonb,
  10,
  true,
  NULL,
  '{"link": "https://github.com/amitayks/OpenLamplighter", "subHeader": "amitayks/OpenLamplighter"}'::jsonb,
  '[{"label": "Language", "value": "Python"}, {"label": "AI Model", "value": "OpenAI Whisper"}, {"label": "Modes", "value": "Cloud API + Offline Local"}, {"label": "Formats", "value": "MP3, M4A, WAV, MP4, WEBM"}]'::jsonb
),

-- 10. WEB-VISARA
(
  'WEB-VISARA',
  'Visara - Intelligent Document Scanner App',
  'React Native mobile app that automatically detects documents in photo galleries and extracts text using multi-engine OCR with smart classification.',
  'An intelligent document scanner mobile application built with React Native and TypeScript. Automatically scans photo galleries for documents, receipts, and text-based images using background processing. Features multi-engine OCR (MLKit, Tesseract, VisionCamera) with confidence-based engine selection, smart document classification, full-text and semantic search capabilities, and automatic metadata extraction. Optimized for performance with memory-efficient processing, battery-aware scanning, and smooth animations with dark/light theme support.',
  ARRAY['React Native', 'TypeScript', 'WatermelonDB', 'MLKit', 'Tesseract'],
  'Web-Development',
  '',
  ARRAY[]::text[],
  false,
  '{"imageAspect": "squere", "dir": "ltr"}'::jsonb,
  10,
  true,
  NULL,
  '{"link": "https://github.com/amitayks/visara", "subHeader": "amitayks/visara"}'::jsonb,
  '[{"label": "Framework", "value": "React Native + TypeScript"}, {"label": "Database", "value": "WatermelonDB"}, {"label": "OCR Engines", "value": "MLKit, Tesseract, Vision"}, {"label": "Search", "value": "Full-text + Semantic"}]'::jsonb
),

-- 11. WEB-KEISAR-CLUB-APP
(
  'WEB-KEISAR-CLUB-APP',
  'Keisar Club App - Mobile Portfolio',
  'React Native Expo portfolio application showcasing creative projects with iOS-style UI, smooth animations, and Supabase backend integration.',
  'A React Native Expo portfolio mobile application showcasing creative projects across web development, woodworking, and design. Features an interactive gallery system with grid-based portfolio display and iOS-style wheel picker for filtering, horizontal scrolling image carousels with lazy loading, built-in contact form with EmailJS integration, and haptic feedback for enhanced interactions. Built with TypeScript, Supabase backend, React Query for data management, and React Native Reanimated for smooth animations.',
  ARRAY['React Native', 'Expo', 'TypeScript', 'Supabase', 'React Query'],
  'Web-Development',
  '',
  ARRAY[]::text[],
  false,
  '{"imageAspect": "squere", "dir": "ltr"}'::jsonb,
  10,
  true,
  NULL,
  '{"link": "https://github.com/amitayks/keisar-club-app", "subHeader": "amitayks/keisar-club-app"}'::jsonb,
  '[{"label": "Framework", "value": "React Native + Expo"}, {"label": "Backend", "value": "Supabase"}, {"label": "Data Management", "value": "React Query"}, {"label": "Animations", "value": "React Native Reanimated"}]'::jsonb
);

-- ============================================================================
-- VERIFY INSERT
-- ============================================================================
SELECT "SKU", title, publish FROM portfolio WHERE "SKU" LIKE 'WEB-%' ORDER BY "SKU";
