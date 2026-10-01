# 💰 Expense Tracker

## Description
A feature-rich browser-based expense tracking application that helps 
users manage transactions, monitor budgets, and gain financial insights 
— with data persistence via localStorage.

🔗 **Live Demo:** [Click here](https://100-days-100-web-project.vercel.app/public/expense_Tracker/index.html)
## ✨ Features

### 💵 Core Financial Tracking
* **➕ Dynamic Transaction Management:** Add income and expenses instantly with fields for Amount, Description, Category, and Date.
* **🗑️ Instant Ledger Deletion:** Remove any past transaction from the history table with immediate real-time recalculation of all metrics.
* **💰 Live Balance Tracker:** Automatically calculates your net balance ($\text{Income} - \text{Expenses}$), color-coding the text dynamically (green for positive, red for overdrawn/negative).
* **📈 Total Income & Expense Metrics:** Monitors and updates aggregate financial totals using smooth numerical counting animations.
* **📊 Visual Category Breakdown:** Groups and updates your spending into dedicated category cards (🍔 Food, ✈️ Travel, 🛍️ Shopping, 📦 Others).

### 🎯 Smart Budgeting & Insights
* **💸 Interactive Budget Setting:** Configure a custom monthly budget and track your limits through a responsive, color-shifting progress bar.
* **🟢 Dynamic Budget Alert Zones:** The budget tracker automatically scales across four warning phases: Safe Zone (<50%), Caution Zone (50%-79%), Warning Zone (80%-99%), and Exceeded Zone (≥100%).
* **💡 Top Expense Identifier:** Automatically isolates and flags your highest spending category alongside the exact amount spent.
* **🧠 Budget-Aware Smart Suggestions:** Generates context-aware financial tips that dynamically shift depending on whether you are tracking general categories or maintaining a specific budget threshold.
* **🏆 Savings Rate Evaluator:** Calculates your net savings percentage ($\frac{\text{Savings}}{\text{Income}} \times 100$) and scores your overall financial health (Excellent, Good, Low).

### ⚡ Enhanced User Experience (UX)
* **💾 Data Persistence via localStorage:** Transactions, monthly budgets, and preferred visual themes remain safely saved even after refreshing or closing the browser.
* **🌙 Dark / Light Mode Toggle:** Seamlessly switch between dark and light themes using a custom toggle switch that remembers user preferences.
* **🕐 Live Running Clock:** Features an integrated, real-time running clock widget displayed inside the header.
* **🎊 Gamified Celebrations:** Triggers full-screen canvas confetti explosions for financial milestones (achieving an *Excellent* savings rate) and critical budget alerts.
* **🔔 Toast Notifications:** Displays slick, non-intrusive popup alerts confirming additions, deletions, theme updates, or budget modifications.
* **🖱️ Magnetic Button Physics:** Premium micro-interactions that subtly pull the submit and reset buttons toward the user's mouse cursor on hover.
* **🔄 Full Reset Capability:** Clear the entire ledger and local storage configuration instantly with a single button click.

### 📱 Premium Mobile Responsiveness
* **🔋 Device-Agnostic Scaling:** Fluid layout seamlessly adapts across desktop, tablet, and mobile displays down to 480px width.
* **🔄 Table-to-Card Transformation:** To prevent ugly horizontal scroll bugs on small viewports ($<768\text{px}$), standard desktop table layouts cleanly convert into independent, vertically stacked mobile data cards using modern CSS pseudo-elements.


## Technologies Used
- HTML5
- CSS3
- JavaScript ES6+
- Font Awesome 6 (icons)
- Poppins (Google Fonts)
- Canvas Confetti (via CDN)

## Installation/Setup
1. Clone the repository:
```bash
   git clone https://github.com/dhairyagothi/100_days_100_web_project.git
```
2. Navigate to the project:
```bash
   cd 100_days_100_web_project/public/Budget\ Tracker
```
3. Open `index.html` in your browser or use VS Code Live Server.

## Usage
1. **Add a transaction** — enter amount, description, category and date
2. **Set monthly budget** — type in the budget input field
3. **Monitor insights** — view highest spending category and suggestions
4. **Toggle dark/light mode** — use the switch in the header
5. **Reset all data** — click the Reset button to clear everything

## Contributing
Contributions are welcome! Please read the
[Contributing Guidelines](../../CONTRIBUTING.md) before getting started.

## License
MIT License

## Author
This project is part of the
[100 Days 100 Web Projects](https://github.com/dhairyagothi/100_days_100_web_project)
challenge by [@dhairyagothi](https://github.com/dhairyagothi).
