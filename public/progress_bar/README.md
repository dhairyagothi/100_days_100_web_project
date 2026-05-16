# Contributor Progress Dashboard

A fully redesigned, interactive progress tracker for open-source contributors — built for **GSSoC 2026**.

## ✨ Features

| Feature | Description |
|---|---|
| 📊 **Overall Progress Ring** | Animated SVG ring with gradient stroke showing total completion % |
| 🗂️ **Topic-wise Progress** | 6 domain cards: Frontend, Backend, AI/ML, Documentation, DevOps, Design |
| 📈 **Weekly Activity Timeline** | Animated bar chart showing daily contribution counts |
| 🏆 **Badges & Milestones** | 12 badges — earned ones unlocked, locked ones greyed out |
| 🔍 **Detail Modal** | Click any topic card to open a modal with ring, stats, and recent PRs |
| ⏱️ **Period Switcher** | Toggle between Weekly / Monthly / All Time data |
| 🔢 **Animated Counters** | Count-up animations on all numbers when switching periods |
| ♿ **Accessibility** | Full ARIA labels, keyboard navigation (Enter/Space/Escape), roles |
| 📱 **Responsive** | 3-col → 2-col → 1-col breakpoints for all screen sizes |

## 📂 Files

```
progress_bar/
├── progress_bar.html   # Semantic HTML structure
├── progress_bar.css    # Dark theme with Inter font, CSS variables
└── progress_bar.js     # Data-driven JS: rendering, animations, modal
```

## 🚀 How to Run

Open `progress_bar.html` directly in any modern browser. No build step required.

## 🎨 Design Highlights

- **Dark theme** with `#0d0f1a` background and glassmorphism header
- **Inter** font via Google Fonts
- **Color-coded domains**: purple (Frontend), teal (Backend), orange (AI/ML), red (Docs), blue (DevOps), lavender (Design)
- **CSS custom properties** for easy theming
- **Micro-animations**: card hover lift, bar fill, ring stroke, count-up

## 📌 Issue Reference

Resolves: *Improve Progress Bar — topic-wise domain tracking, badges, visual breakdown, weekly activity*
