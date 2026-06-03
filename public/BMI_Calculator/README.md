# Advanced Interactive BMI & Body Fat Calculator

A modular, dependency-free clinical utility dashboard built using vanilla frontend architecture. The application calculates Body Mass Index (BMI), cross-references outcomes against standard health guidelines, computes real-time biometric estimates, and maintains a persistent localized performance history matrix.

---

## 🚀 Key Features

- **Dual-Unit Computational Interface:** Supports seamless hot-swapping between Metric (`kg`/`cm`) and Imperial systems (`lbs`/`ft-in`), dynamically restructuring the form layout without layout shifting.
- **Dynamic Context Highlighting:** Automates instant styling filters on the global Reference Table to isolate the user's current health tier immediately following execution.
- **Biometric Estimation Engine:** Employs empirical modeling algorithms (the _Deurenberg Equation_) to calculate an estimated body fat percentage alongside a responsive SVG gauge display.
- **Persistent LocalStorage Logging:** Records historical data points natively on the client device. Includes a dedicated asynchronous clear routine that resets both the tracking log and trend charts simultaneously.
- **Asynchronous Trend Mapping:** Embedded Chart.js engine automatically captures transaction streams to draw continuous telemetry lines across operations.
- **Adaptive Clinical Interface (Dark Mode):** Optimized contrast settings automatically handle custom state overrides based on device settings, with smooth transition animations.

---

## 📸 Screenshots

### Light Mode Dashboard

![alt text](image.png)

### Dark Mode Analytics

## ![alt text](image-1.png)

## 🧮 Theoretical Background & Core Formulas

The underlying engine relies on standard biophysical equations to calculate health index variables:

### 1. Body Mass Index (BMI)

Calculates raw weight distribution ratios across height variables:

- **Metric System Math:**
  $$\text{BMI} = \frac{\text{Weight (kg)}}{\text{Height (m)}^2}$$

- **Imperial System Math:**
  $$\text{BMI} = \frac{\text{Weight (lbs)}}{\text{Height (in)}^2} \times 703$$

### 2. Body Fat Percentage Estimation

Estimates lean mass offsets using the **Deurenberg et al. Formula** derived from continuous BMI correlation arrays:

$$\text{Body Fat \%} = (1.20 \times \text{BMI}) + (0.23 \times \text{Age}) - (10.8 \times \text{Gender Factor}) - 5.4$$

> _Where **Gender Factor** resolves to `1` for biological males, and `0` for biological females._

---

## 🛠️ Technical Architecture

The workspace is intentionally written without runtime frameworks, utilizing a modern, decoupled architecture:

- **Structure (`index.html`):** Semantic HTML5 structures embedded with targeted ID anchors, built inside an optimized CSS Grid layout context.
- **Presentational Layer (`style.css`):** Employs the _Warm Clinical_ theme token model using CSS custom properties. Implements hardware-accelerated transforms for focus-scaling, layout reflow boundaries, and micro-interactions.
- **Logic Pipeline (`script.js`):** Modular JavaScript written using an Immediately Invoked Function Expression (IIFE) for theme encapsulation, functional array mapping (`Array.prototype.find`, `.map`), and synchronized local cache management.
- **Visual Telemetry:** Bound to the Chart.js (v4.4.1) canvas execution engine via an unbundled script delivery network (CDN).

---

## 📂 Project Directory Structure

```text
public/BMI_Calculator/
├── index.html     # Structural markup with dual-unit form wrappers
├── style.css      # Warm Clinical layout definitions and dark mode tokens
├── script.js      # Biometric calculation pipelines and storage drivers
└── README.md      # Project documentation framework

```

---

## 📦 Local Deployment & Verification

To run this sub-project locally on your machine for feature verification:

- Clone the repository and navigate to the project directory:

```bash
cd 100_days_100_web_project/public/BMI_Calculator/
```

- Open index.html inside your browser of choice.

- Alternatively, deploy it using a development server like the Live Server extension in VS Code:

- Right-click index.html in the file explorer sidebar.

- Select Open with Live Server.

- Test operations across different unit profiles to ensure state tracking routines persist upon refresh.

---

## 🤝 Contributors

This sub-project has been upgraded and maintained through open-source contributions under GSSoC '26 (GirlScript Summer of Code 2026).

---

<br>

**Feature Upgrades:** Implemented custom state management (Reset button functionality), conditional height form interface toggles, active database row context highlighting, and persistent multi-session localStorage analytical tracking.
