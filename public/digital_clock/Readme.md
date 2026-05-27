# 🕐 Digital Clock

A modern, accessible digital clock web application with a vibrant light theme, world clocks dashboard, and a full-featured alarm system — all built with vanilla HTML, CSS, and JavaScript.

---

## ✨ Features

### 🕰️ Live Clock
- Real-time digital clock updating every second
- Displays current day of the week and full date
- 12-hour format with AM/PM indicator
- Support for custom primary timezone

### 🎨 4 Theme Modes
| Theme     | Accent Color | Preview                  |
|-----------|-------------|--------------------------|
| Classic   | Coral Orange (#f97316) |
| Modern    | Blue (#3b82f6)         |
| Cyber     | Pink (#ec4899)         |
| Nebula    | Purple (#8b5cf6)       |

Each theme updates the accent color across all UI elements — buttons, toggle switches, badges, borders, and highlights.

### 🌍 World Clocks Dashboard
- Add clocks for any country worldwide
- Data fetched live from [REST Countries API](https://restcountries.com)
- Searchable country modal with flag icons
- Each card shows country flag, name, UTC offset, and live time
- Time calculations based on UTC offset
- Clocks tick in real-time alongside the main clock

### ⏰ Alarm System
- **Add alarms** with custom time, label, tone, and snooze interval
- **Enable/disable** alarms with a toggle switch
- **Delete** individual alarms or clear all
- **Snooze** feature — dismiss an alarm and it re-triggers after the chosen interval
- **Alarm ringing overlay** — full-screen popup with snooze/stop buttons
- **Audio tones** via Web Audio API oscillator + MP3 fallback
- **History logs** — records every triggered alarm with timestamps

### 🎯 Accessibility
- Semantic HTML5 elements (`<article>`, `<section>`, `<header>`, `<footer>`, `<nav>`, `<form>`)
- ARIA roles and attributes (`role="dialog"`, `aria-label`, `aria-live`, etc.)
- Keyboard-friendly controls
- Screen reader compatible

### 📱 Responsive Design
- Mobile-first layout
- Tablet/Desktop: 2-column dashboard grid
- Smooth breakpoints at 480px, 768px, and 1024px
- Touch-friendly controls

### 💾 Data Persistence
All user data is saved to `localStorage`:
- Active theme
- Primary timezone selection
- Alarms list (with enable/disable state & snooze info)
- World clocks list
- Alarm history logs (capped at 50 entries)

---

## 🗂️ File Structure

```
digital_clock/
├── digitalclock.html      # Main HTML — semantic structure
├── digitalclock.css       # Styles — light theme, custom properties, responsive
├── digitalclock.js        # Logic — clock, alarms, world clocks, themes
├── alarm.mp3             # Fallback alarm audio file
└── Readme.md             # This file
```

---

## 🚀 How to Use

### 1. Open the App
Open `digitalclock.html` in any modern browser. No build tools or server required.

```bash
open digitalclock.html
```


### 2. Change Theme
Click any of the 4 color swatches in the **Theme** section to switch themes instantly. The accent color updates across the entire UI.

### 3. Set Timezone
Click the **Timezone** trigger to open the dropdown. Search for a city/region or select from the list. The clock will display the time for that timezone.

### 4. Add World Clocks
Click **"+ Add"** in the World Clocks card. A modal opens with a searchable list of all countries. Click any country to add its clock to the dashboard.

### 5. Manage Alarms
1. Click **"Manage"** to expand the alarm section
2. Fill in the alarm time, label, tone, and snooze interval
3. Click **"Add Alarm"**
4. Toggle alarms on/off with the switch
5. Delete with the &times; button
6. Click **"Clear All"** to remove all alarms

When an alarm triggers:
- A full-screen popup appears
- An audio tone plays
- Click **Snooze** to dismiss temporarily, or **Stop Alarm** to turn it off
- The event is logged in the alarm history

---

## 🛠️ Tech Stack

- **HTML5** — Semantic markup with ARIA accessibility
- **CSS3** — Custom properties (theming), CSS Grid, Flexbox, transitions, animations, responsive media queries
- **Vanilla JavaScript** — ES6+, DOM manipulation, Web Audio API, `localStorage` persistence
- **REST Countries API** — Live country data for world clocks
- **Google Fonts** — Poppins, Plus Jakarta Sans, JetBrains Mono, Orbitron, Share Tech Mono, Audiowide, Syncopate

---

## 📸 Screenshots

*(Add screenshots here)*

| View | Description |
|------|-------------|
| Main Clock | Time, date, status, info tags |
| World Clocks | Country cards with live times |
| Alarm Controls | Form, alarm list, toggle switches |
| Alarm Popup | Ringing overlay with snooze/stop |

---

## 🌐 Browser Support

| Browser | Support |
|---------|---------|
| Chrome  | ✅ Full |
| Firefox | ✅ Full |
| Safari  | ✅ Full |
| Edge    | ✅ Full |
| Opera   | ✅ Full |

---

## 📄 License

This project is part of the [100 Days 100 Web Projects](https://github.com/Dipayan-max/100_days_100_web_project) initiative. See the main project license for details.

---

*Built with ❤️ using vanilla HTML, CSS, and JavaScript.*