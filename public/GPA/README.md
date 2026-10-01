# 🎓 CGPA Goal Planner

> *"What SGPA do I actually need?"* — Every student, at 2 AM, before exams.

Turn academic anxiety into a clear roadmap. **CGPA Goal Planner** tells you exactly what average SGPA you need in your remaining semesters to hit your target CGPA — then lets you play *what-if* games when reality (or optimism) kicks in.

No frameworks. No installs. No login. Just you, your grades, and a little math that finally makes sense.

---

## ✨ Why This Exists

CGPA isn't magic. It's math. But most students are stuck guessing:

- *"Can I still reach 8.5?"*
- *"If I score 9 in Sem 5, what happens to Sem 6–8?"*
- *"Is this dream dead or just difficult?"*

This tool answers all three — with a glassmorphism UI that doesn't look like it was built in 2003.

---

## 🚀 Quick Start

```bash
# Clone or download, then:
cd GPA
start index.html        # Windows
open index.html         # macOS
xdg-open index.html     # Linux
```

That's it. Double-click works too. No `npm install`. No build step. No suffering.

> **Note:** The CGPA chart uses [Chart.js](https://www.chartjs.org/) via CDN — you'll need internet for that one feature.

---

## 🧮 The Brain Behind It

When all semesters carry equal weight:

```
Required Avg SGPA = ((Target CGPA × Total Semesters) − (Current CGPA × Completed Semesters)) ÷ Remaining Semesters
```

### Real Example

| Input | Value |
|-------|-------|
| Current CGPA | 7.2 |
| Completed Semesters | 4 |
| Target CGPA | 8.5 |
| Remaining Semesters | 4 |
| **Total Semesters** | **8** |

```
= ((8.5 × 8) − (7.2 × 4)) ÷ 4
= (68 − 28.8) ÷ 4
= 9.8
```

**Verdict:** You need an average SGPA of **9.8** across your next 4 semesters.

*(Yes, that's ambitious. The app will tell you that too.)*

---

## 🎯 Features

### Core Planner
- 📊 Input your current CGPA, completed semesters, and target
- 🎯 Get required average SGPA instantly
- 📅 Semester-wise SGPA target table
- ⚖️ Optional credit-weighted calculations

### Feasibility Meter
Because hope needs a reality check:

| Signal | Meaning |
|--------|---------|
| 🟢 **Easily achievable** | Required SGPA ≤ 8.0 |
| 🟡 **Challenging** | Required SGPA 8.0 – 9.5 |
| 🔴 **Nearly impossible** | Required SGPA > 9.5 or above the 10-point cap |

### What-If Analysis
Scored **9.0** in Sem 5 and **9.5** in Sem 6? Plug them in. Watch the required SGPA for Sem 7 & 8 recalculate live. Plan smarter, panic less.

### Extras That Actually Help
- 📈 **Progress bar** — how close you are to your target
- 📉 **CGPA projection chart** — visual path semester by semester
- 🌙 **Dark / Light mode** — your eyes, your rules
- 💾 **Save plans** — stored in `localStorage`, survives refresh
- 🔢 **Grade → CGPA converter** — O, A+, A, B+… on a 10-point scale
- 🧪 **Quick SGPA calculator** — add course grades, get semester average

---

## 🗂️ Project Structure

```
GPA/
├── index.html      # The stage
├── styles.css      # The glass, the glow, the vibes
├── app.js          # The math, the logic, the what-ifs
└── README.md       # You are here
```

---

## 🛠️ Tech Stack

| Layer | Tools |
|-------|-------|
| Structure | HTML5 |
| Style | CSS3 — Glassmorphism, CSS variables, responsive grid |
| Logic | Vanilla JavaScript |
| Charts | Chart.js (CDN) |
| Storage | `localStorage` |
| Dependencies | Zero. Zilch. Nada. |

Built for students who want something that **works offline** (except the chart) and **opens in any browser**.

---

## 📱 Responsive & Accessible

- Works on phone, tablet, and laptop
- Sticky header, fluid grids, touch-friendly inputs
- Theme preference persists across sessions
- Form validation with clear error feedback

---

## 💡 Pro Tips

1. **Start honest.** Garbage in, garbage out. Your current CGPA should be real, not aspirational.
2. **Use What-If early.** Enter expected scores *before* results drop to see if your target still holds.
3. **Save multiple plans.** "Realistic 8.0" and "Stretch 8.5" — compare without retyping everything.
4. **Check feasibility before burnout.** A 🔴 isn't a failure — it's a signal to adjust the target or strategy.

---

## 🌟 Future Ideas (Maybe)

- [ ] Custom credit per semester (not just uniform)
- [ ] Export plan as PDF
- [ ] Import transcript data
- [ ] Multi-curve grading scale presets

Got ideas? Fork it. Break it. Make it yours.

---

## 📜 License

Free to use, modify, and share. Built for students, by someone who probably also stressed about CGPA at 2 AM.

---

<p align="center">
  <strong>Plan the grade. Own the semester. 🎓</strong><br>
  <sub>Made with HTML, CSS, JavaScript — and a healthy respect for GPAs.</sub>
</p>
