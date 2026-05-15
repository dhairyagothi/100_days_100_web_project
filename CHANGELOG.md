# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-05-15

### Added
- **Next.js 15 Migration**: Entire project transitioned from Vanilla HTML/CSS/JS to Next.js 15 App Router.
- **TypeScript Implementation**: Introduced strong typing, including the `src/data/projects.ts` interface.
- **Tailwind CSS v4**: Completely replaced legacy `style.css` with Tailwind CSS utility classes.
- **shadcn/ui Integration**: Added accessible, reusable UI components (`button`, `command`, `card`, `scroll-area`).
- **Command Palette (`Cmd+K`)**: Global search implemented allowing users to instantly navigate between projects and pages.
- **Progress Tracking**: LocalStorage-based favoriting system to track favorite projects.
- **Timeline View**: Chronological view of projects utilizing Framer Motion scroll animations.
- **Taste Standard UI**: Replaced standard themes with Atelier-style minimalist design (Geist font, Canvas White/Charcoal Ink palette, glassmorphism).

### Changed
- Refactored `index.js` data structure into a modular TypeScript array (`projects.ts`).
- Updated `CONTRIBUTING.md` and `README.md` to reflect the Next.js stack.
- Redesigned `index.html` into a Next.js Bento-Grid `page.tsx` layout.

### Removed
- Removed monolithic `index.js` file managing all DOM manipulations.
- Deprecated static HTML files in root directory (moved to `/legacy` or Next public route mappings).
