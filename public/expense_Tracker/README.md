# 💰 Expense Tracker

**Your money, kept simple.**

A clean, dark-themed expense tracker web app that helps you log your income and expenses, track your balance in real time, and visualize your spending habits across categories.

---

## 📋 Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## 📝 Introduction

Expense Tracker is a simple yet powerful personal finance tool that allows users to record their daily income and expenses, view a real-time summary of their financial health, and understand where their money is going through category-wise breakdowns. The app features a sleek, modern dark UI designed for clarity and ease of use.

---

## ✨ Features

- ➕ **Add New Entry** — Log transactions with amount, date, type (Income/Expense), and description
- 💳 **Transaction Type Toggle** — Quickly switch between "Expense (Spent)" and "Income (Earned)"
- 📊 **Real-Time Summary Dashboard**
  - Current Balance
  - Total Earned
  - Total Spent
  - Average Entry
  - Savings Rate
- 🥧 **Category-Wise Breakdown** — Visual progress bars for:
  - Food & Dining
  - Travel & Fuel
  - Shopping & Clothes
  - Bills & Rent
  - Others
- 🔵 **Circular Indicator** — Highlights your top spending category with a percentage ring
- 🌙 **Dark Mode UI** — Modern, easy-on-the-eyes interface
- 📑 **Multiple Views** — Transactions, Dashboard, and History Log tabs
- 💾 **Backup & Clear All** — Manage and reset your transaction data easily
- 📱 **Responsive Design** — Works smoothly across desktop, tablet, and mobile

---

## 🛠️ Technologies Used

- **HTML5** — Page structure
- **CSS3** — Styling, dark theme, gradients, and responsive layout
- **JavaScript (Vanilla JS)** — App logic, calculations, and DOM manipulation
- **LocalStorage** — Client-side data persistence for transactions

---

## 📂 Project Structure

```text
expense_Tracker/
│
├── index.html          # Main HTML structure (Transactions, Dashboard, History Log)
├── style.css            # Dark theme styling and layout
├── script.js             # App logic - add entry, calculations, charts, backup/clear
└── README.md            # Project documentation
```

---

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sanyogitasinghbgm-spec/100_days_100_web_project.git
   ```

2. **Navigate to the project folder**
   ```bash
   cd 100_days_100_web_project/public/expense_Tracker
   ```

3. **Open the app**
   Simply open `index.html` in your browser, or use a live server extension (recommended for the best experience):
   ```bash
   # If using VS Code Live Server extension
   Right-click index.html → "Open with Live Server"
   ```

No additional dependencies or build steps are required — it's a lightweight, plug-and-play app.

---

## 🚀 Usage

1. Open the app in your browser.
2. Under **Add New Entry**, fill in:
   - **Amount (₹)**
   - **Date**
   - **Transaction Type** — Expense or Income
   - **Description**
3. Click **Add to My List** to save the entry.
4. View your updated stats instantly under **Your Summary**:
   - Current Balance, Total Earned, Total Spent, Average Entry, and Savings Rate
5. Check the **category breakdown** section to see where most of your money is going.
6. Use the top navigation bar to switch between **Transactions**, **Dashboard**, and **History Log**.
7. Use **Backup** to save your data, or **Clear All** to reset everything.

---

## 🔮 Future Enhancements

- 📈 Add interactive charts (bar/line graphs) for monthly trends
- 🔍 Search and filter transactions by date, category, or type
- 🌗 Light mode toggle alongside dark mode
- 📤 Export transactions as CSV/PDF
- ☁️ Cloud sync / backend integration for cross-device access
- 🔔 Budget limit alerts and notifications

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit
   ```bash
   git commit -m "feat: add your feature"
   ```
4. Push to your branch
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request

Please make sure your changes follow the existing code style and don't break any existing functionality.

---

## 📄 License

This project is part of the **100 Days 100 Web Projects** challenge and is open-sourced under the [MIT License](LICENSE).

---

### 👩‍💻 Author

App Developemnt and Documentation : **Sanyogita Singh**
