# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run Biome linter
- `npm run lint:fix` - Run Biome linter with auto-fix
- `npm run format` - Check code formatting with Biome
- `npm run format:fix` - Auto-format code with Biome
- `npm run check` - Run all Biome checks (lint + format)
- `npm run check:fix` - Run all Biome checks with auto-fix
- `npm run bnd` - Build and deploy to GitHub Pages
- `npm run deploy` - Deploy to GitHub Pages

## Architecture Overview

This is a React portfolio website built with:

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom animations
- **Data**: Supabase for backend storage
- **State Management**: TanStack Query for server state
- **Routing**: React Router DOM
- **Code Quality**: Biome for linting and formatting
- **Deployment**: GitHub Pages

### Key Architecture Patterns

- **Query-based Data Fetching**: Uses TanStack Query with custom hooks in `/src/hooks/` for all data fetching
- **Component Structure**: Follows atomic design with reusable components in `/src/components/`
- **Type Safety**: Strong TypeScript typing with interfaces in `/src/types/`
- **Service Layer**: API calls abstracted in `/src/services/`
- **Page-based Routing**: Main pages in `/src/pages/` with portfolio detail routes using SKU parameter

### Data Flow

1. Portfolio items are fetched from Supabase using `usePortfolioItems()` hook
2. Individual portfolio details use `usePortfolioItem(SKU)` hook
3. Featured items are filtered using `useFeaturedItems()` hook
4. Images are managed through `usePortfolioImage()` and `useSiteImages()` hooks
5. All queries are cached with 5-minute stale time via TanStack Query

### Routing Structure

- `/` - Home page with featured projects
- `/portfolio` - Portfolio listing with filtering
- `/portfolio/:SKU` - Individual portfolio item details
- `/about` - About page
- `/contact` - Contact page with EmailJS integration

### Custom Hooks

- `useFeaturedItems()` - Filters featured portfolio items
- `usePortfolioItems()` - Fetches all portfolio items
- `usePortfolioItem(SKU)` - Fetches single portfolio item
- `usePortfolioImage()` - Manages portfolio image states
- `useSiteImages()` - Manages site-wide images
- `darkTheme.ts` - Dark/light theme management
- `useLocalStorageState()` - Persistent local state
- `useMediaQuery()` - Responsive breakpoint detection

### Code Style

- Uses Biome for consistent formatting with 2-space indentation
- Double quotes for strings
- Semicolons always
- Line width of 100 characters
- ES5 trailing commas
- Arrow functions with parentheses
