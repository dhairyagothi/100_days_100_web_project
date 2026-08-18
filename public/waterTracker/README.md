```
    ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
         💧  W A T E R   T R A C K E R  💧
    ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
              sip · track · thrive
```

> *A glass-half-full kind of app.*  
> One page. Zero backends. Your hydration, remembered.

---

## ✨ What is this?

A calm, interactive dashboard for your daily water goal—built with **HTML**, **CSS**, and **vanilla JavaScript**.  
Set a target, tap to log sips, watch the glass rise, and pick up tomorrow where your habits left off.

```
     ┌─────────────┐
     │  ~ ~ ~ ~ ~  │  ← waves when you drink
     │ ~~~~~~~~~~~ │
     │▓▓▓▓▓▓▓▓▓▓▓▓▓│  ← fill grows with every ml
     │▓▓▓▓▓▓▓▓▓▓▓▓▓│
     └─────────────┘
        750 / 2000 ml
```

---

## 🌊 Features

| | |
|---|---|
| 🎯 | **Goal setting** — Daily target in ml (default **2000**) |
| ⚡ | **Quick-add** — Cup · Bottle · Large · Pitcher |
| 🧪 | **Custom pour** — Log any amount you like |
| 🌊 | **Living glass** — Wave animation + fill that breathes with progress |
| ↩️ | **Undo** — Oops? Roll back your last entry |
| 🔄 | **Reset** — Clear today and start fresh |
| 💾 | **Memory** — `localStorage` keeps your streak across refreshes |
| 🌅 | **New day** — Progress resets at midnight; your goal stays |

---

## 🛠️ Tech Stack

```
   HTML5  ─── structure & semantics
   CSS3   ─── flex · grid · keyframes · waves
   JS     ─── state · events · localStorage
```

No npm. No build step. No server. Just open and drink (water).

---

## 🚀 Getting Started

```text
  1. Download this folder
  2. Open index.html
  3. Pour responsibly 💧
```

That’s it—you’re hydrated and hacking.

---

## 📁 Project Map

```
waterTracker/
│
├── index.html    ← the vessel
├── style.css     ← the tide
├── script.js     ← the current
└── README.md     ← you are here
```

---

## 🔮 Under the Hood

Your progress lives in the browser under the key **`waterTracker`**:

```json
{
  "goal": 2000,
  "consumed": 750,
  "date": "2026-06-01",
  "history": [250, 500]
}
```

| Field | Meaning |
|-------|---------|
| `goal` | How much you aim to drink (ml) |
| `consumed` | What you’ve logged today |
| `date` | Today’s stamp — when the calendar turns, intake clears |
| `history` | Each pour, in order — fuels **Undo** |

When `date` ≠ today → consumed & history wash away. Your goal remains, like a lighthouse.

---

## 📚 For Curious Builders

A small sandbox for learning:

- **State** without frameworks  
- **Events** that feel instant  
- **localStorage** as a tiny time capsule  
- **CSS** that moves like water (`--fill`, keyframes, reduced-motion respect)

---

## 🌐 Browsers

Chrome · Firefox · Safari · Edge — anywhere `localStorage` and modern CSS feel at home.

---

<p align="center">
  <sub>made with clear code and clearer water</sub><br>
  <sub>stay thirsty for knowledge · stay hydrated for life</sub>
</p>
