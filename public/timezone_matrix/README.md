# 🌐 TimeZone Matrix — Global Meeting Sync Coordinator

A sleek, utility-focused frontend dashboard engineered for distributed remote teams to seamlessly coordinate synchronous meeting windows across international borders. 

Instead of dealing with confusing manual offset calculations, **TimeZone Matrix** maps out global locations on an intuitive horizontal grid, automatically calculating time conversions and instantly highlighting optimal "Golden Sync Windows" (9:00 AM – 6:00 PM) where all team members are active during normal business hours.

---

## 🚀 Core Features

* **Multi-Region Pinning Engine:** Add and track multiple international team hubs simultaneously using standard IANA timezone identifiers (e.g., IST, EST, GMT, PST, JST).
* **Dynamic Synchronization Track:** Move a single master base-slider to instantaneously recalculate corresponding hours across all active locations in real-time.
* **Golden Zone Visualizer:** Uses predictive color-coding to highlight overlapping working hours, helping teams easily detect optimal working blocks.
* **Zero-Dependency Local Architecture:** Completely lightweight application driven by pure native APIs without relying on large chronological wrapper frameworks like Moment.js or Day.js.
* **Fully Responsive Workspace:** Designed using CSS Grid and Flexbox rules to scale smoothly from wide ultra-wide desktop dashboards down to mobile screens.

---

## 📂 Project Architecture

The workspace is organized as a modular, lightweight static asset block under the main repository structure:

```text
public/timezone_matrix/
├── index.html       # Structural layout and control-panel components
├── style.css        # Professional dark-theme matrix grid configuration rules
└── app.js           # Chronological matrix calculations and interface update pipeline