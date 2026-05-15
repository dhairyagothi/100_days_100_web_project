# Architecture Overview

This document outlines the high-level architecture of the modernized **100 Days 100 Web Projects** repository.

## Core Technologies

- **Next.js 15**: The React framework used for server-side rendering, routing, and static generation.
- **App Router**: We utilize the `src/app` directory for file-based routing.
- **TypeScript**: Ensures type safety across components and data models.
- **Tailwind CSS v4**: Utility-first CSS framework for rapid, responsive design.
- **shadcn/ui**: Reusable, accessible components built on top of Radix UI and Tailwind.
- **Framer Motion & GSAP**: Used for fluid animations, micro-interactions, and scroll-triggered effects.

## Directory Structure

```text
.
├── src/
│   ├── app/                # Next.js App Router pages and layouts
│   │   ├── about/          # About page route
│   │   ├── timeline/       # Timeline view route
│   │   ├── globals.css     # Global CSS featuring Taste Standard theme variables
│   │   ├── layout.tsx      # Root layout including Navbar and Footer
│   │   └── page.tsx        # Main entry point (Grid View)
│   ├── components/         # Reusable React components
│   │   ├── layout/         # Structural components (Navbar, Footer)
│   │   ├── ui/             # shadcn/ui components
│   │   └── CommandPalette.tsx # Global search and navigation component
│   ├── data/               # Static data structures
│   │   └── projects.ts     # TypeScript array containing all 100+ project metadata
│   └── hooks/              # Custom React hooks (e.g., useFavorites)
├── public/                 # Static assets and legacy vanilla projects
├── .github/                # GitHub Actions and Issue/PR templates
└── docs/                   # Additional documentation
```

## Design System Integration (Taste Standard)

The repository implements the "Taste Standard" design principles:
1. **Grid-First Philosophy**: Uses asymmetrical bento-grid layouts to present project cards.
2. **Typography**: Strictly uses `Geist` (sans) and `Geist Mono`.
3. **Color Palette**: Dark mode relies on *Charcoal Ink* (`#18181B`), while light mode relies on *Canvas White* (`#F9FAFB`).
4. **No-Line Policy**: Avoids harsh borders (`1px solid #000`), utilizing diffuse shadows and tonal transitions (`bg-muted/50`).

## State Management

State is largely local to components. For specific cross-session features like "Progress Tracking" (favoriting projects), we utilize custom hooks (e.g., `useFavorites`) leveraging `localStorage` to persist user preferences directly in the browser without requiring a backend database.
