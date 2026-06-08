# 🔍 100 Days 100 Web Projects — Full Audit Report

> **Total projects listed in `index.js`**: 166 entries (Days 1–166)
> **Total project folders in `/public`**: 210 directories

---

## 🚨 CRITICAL: Broken Paths in `index.js` (Demo Links Won't Work)

These projects have a **mismatch between the path in `index.js` and the actual folder name on disk**. The demo button will 404 or fail.

| Day | Project | Path in `index.js` | Actual Folder | Fix Needed |
|-----|---------|---------------------|---------------|------------|
| **11** | Serve Website Using Express | `./public/index.html` | `public/Express Server/` | Change path to `./public/Express%20Server/` (or add a proper landing page) |
| **50** | Recipe Genie | `./public/Recipe Genie/index.html` | `public/Recipe Genie/` *(empty - no files!)* | Folder exists but is **empty** — content needs to be added |
| **87** | Breakout Game | `./public/Breakout game/index.html` | `public/Breakout-game/` | Fix path: `./public/Breakout-game/index.html` |
| **98** | Virtual Piano | `./public/Virtual Piano/index.html` | `public/Virtual_Piano/` | Fix path: `./public/Virtual_Piano/index.html` |
| **118** | Particle Effect | `./public/particle-effect/index.html` | `public/image-particle-engine/` | Fix path: `./public/image-particle-engine/index.html` |
| **129** | YouTube Clone | `./public/youtube clone/index.html` | `public/youtube_clone/` | Fix path: `./public/youtube_clone/index.html` |
| **166** | Boredom Buster | `./public/BoredomBuster/index.html` | `public/BordemBuster/` *(typo in folder name!)* | Fix folder name to `BoredomBuster` OR fix path in `index.js` |
| **166** | Color Sort Puzzle | `./public/colorsort/index.html` | `public/color sort puzzle/` | Fix path: `./public/color%20sort%20puzzle/index.html` |

> [!CAUTION]
> Day 166 has **two projects** assigned to the same day number. This is a data integrity issue.

---

## ⚠️ Backend-Only Projects (No Live Demo — GitHub Links Only)

These projects are backend/full-stack and intentionally link to GitHub. They are "complete" as backend projects but have **no browser-accessible demo**:

| Day | Project | Tech | Status |
|-----|---------|------|--------|
| 12 | Gmail Nodemailer | Node.js, Nodemailer | Backend only — no frontend demo |
| 13 | MERN Login Form | MongoDB, Express, React, Node | Links to GitHub (no local demo path works) |
| 20 | EveSparks | JavaScript | Links to external Render.com URL (may go offline) |
| 49 | URL Shortener | Node.js, Express | Backend — `url_shortener/frontend/public/index.html` exists but needs a running server |
| 56 | Pastebin (Svelte) | Svelte | Path `./public/pastebin/src/app.html` — needs build step, not directly loadable |
| 66 | Flask Auth App | Python, Flask | Backend — `explain.html` exists but the app itself requires Python |
| 72 | Contact Book | Node.js, Express | Links to GitHub |
| 91 | Voting App Backend | Node.js, Express | Links to GitHub |
| 93 | TextUtils | React | Path `./public/Textutils/public/index.html` — React project, needs build |
| 95 | TodoList React TS | React, TypeScript | Path `./public/TodoList-React-TS-Tailwind/index.html` — needs build |
| 115 | Event Registration | API, JS | Links to external Render.com URL (may go offline) |

> [!WARNING]
> Days 49, 56, 66, 93, 95 have local paths but the projects **require build steps or a running server** to function. Raw HTML file opens will not work.

---

## ⚡ Projects Needing Improvement

### Duplicate Day Numbers
| Days | Projects |
|------|---------|
| Day 4 | Appears **twice** in README (different demo links — `/dropdown_navbar` and `/dropdown_navbar/index.html`) |
| Day 16 | Appears **twice** in README (Custom Scroll Bar and Scroll Game Dark Run — different projects!) |
| Day 166 | Appears **twice** in `index.js` — "Boredom Buster" and "Color Sort Puzzle" both tagged as Day 166 |

### Missing Index Files (Incomplete Projects)
| Day | Project | Issue |
|-----|---------|-------|
| 50 | Recipe Genie | Folder `Recipe Genie/` is **completely empty** — no HTML, CSS, or JS files |
| 119 | Virtual Playground | References `./playground.html` at root — file **does not exist** |

### Projects in `public/` Folder NOT Listed in `index.js`
These folders exist but are not showcased on the website:

| Folder Name | Notes |
|-------------|-------|
| `AmazonClone` | Different from `Amazon_Clone` — duplicate? |
| `BordemBuster` | Exists but path wrong in `index.js` (BoredomBuster) |
| `ButtonsUIPage` | Not in `index.js` |
| `Calculator` | Not in `index.js` (separate from Vanilla JS Calculator) |
| `ColorPaletteArtGenerator` | Exists in `index.js` Day 162 ✓ |
| `Connect4` | Not in `index.js` |
| `CountDown Timer` | Not in `index.js` |
| `Country Quiz Game` | Not in `index.js` |
| `Cryptocurrency-Calculator` | Not in `index.js` |
| `Custom Scroll Bar` | Not listed (Day 16 path issue) |
| `Dental Care Services` | Not in `index.js` |
| `Developer portfolio` | Not in `index.js` |
| `Discord project` | Not in `index.js` |
| `Habit_Tracker` | Different from `Habit-Tracker-Web-App`? |
| `image-particle-engine` | Listed as Day 118 "Particle Effect" but wrong path |
| `Mini_Calendar` | Not in `index.js` |
| `New-AmazonClone` | Not in `index.js` |
| `Personal_website` | Not in `index.js` |
| `Plant` / `Plant Website` | Multiple plant folders — unclear which is official |
| `RandomJokeGenerator` | Not in `index.js` |
| `Razorpay` | Not in `index.js` |
| `Self-Improvement` | Not in `index.js` |
| `SpendSense` | Not in `index.js` |
| `StudentCommandCenter` | Not in `index.js` |
| `TENZI-GAME` | Not in `index.js` |
| `TheLastTab` | Not in `index.js` |
| `Travelling_Breakthroughs` | Not in `index.js` |
| `Unit-Converter` | Listed as Day 161 ✓ |
| `WebsitePersonalizer` | Listed as Day 160 ✓ |
| `Word_dictionary` | Not in `index.js` |
| `ZEN_TIMER` | Not in `index.js` |
| `color-palette-generator` | Different from `ColorPaletteArtGenerator`? |
| `currency_converter` | Not in `index.js` |
| `event-registration-system` | Different from `Event-Registration-System`? |
| `jokes_site` | Not in `index.js` |
| `music_website` | Different from `Music App`? |
| `pig_game` | Not in `index.js` |
| `story` | Not in `index.js` |
| `swiggy` | Not in `index.js` |

---

## ✅ Projects That Are Complete & Working

All other projects (Days 1–10, 15, 17–19, 21–48, 51–55, 57–65, 67–71, 73–86, 88–92, 94, 96–97, 99–114, 116–117, 120–128, 130–165) have:
- Correct paths in `index.js`
- Actual files on disk
- Browser-loadable HTML

---

## 📋 Quick Fix Summary

### Fix in `index.js` (Path Corrections)

```js
// Day 87 - Fix folder name typo
['Day 87', 'Breakout game', './public/Breakout-game/index.html', ...]

// Day 98 - Fix folder name spacing
['Day 98', 'Virtual Piano', './public/Virtual_Piano/index.html', ...]

// Day 118 - Fix folder name
['Day 118', 'Particle Effect', './public/image-particle-engine/index.html', ...]

// Day 129 - Fix folder name underscore
['Day 129', 'YouTube Clone', './public/youtube_clone/index.html', ...]

// Day 166 Color Sort - Fix path  
['Day 166', 'Color Sort Puzzle game', './public/color%20sort%20puzzle/index.html', ...]
```

### Fix Day Numbering
- Renumber Day 166 (Color Sort Puzzle) → **Day 167**
- Add **Day 119** `playground.html` at root if it's part of the project

### Content Needed
- **Day 50 (Recipe Genie)**: Folder is empty — project needs to be implemented
- **Day 11 (Express Server)**: Needs a proper frontend or path fix

---

## 📊 Summary Statistics

| Category | Count |
|----------|-------|
| Total entries in `index.js` | 166 |
| Broken demo paths (wrong folder name) | 6 |
| Missing/empty project folders | 2 |
| Backend-only (no live demo) | 11 |
| Duplicate day numbers | 3 instances |
| Unlisted folders in `/public` | ~30+ |
| External URL dependencies (risk of going offline) | 2 |
