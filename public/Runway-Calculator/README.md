**Startup Runway Calculator**

A clean, mobile-friendly web application that helps estimate how long a business can operate based on available cash and monthly expenses.

**🖇️Live Demo**

https://divyasharma-21.github.io/Runway-Calculator/


**📌 Project Overview**

In early-stage startups, managing cash flow is critical.  
This tool provides a quick way to understand:

- Total cash available  
- Monthly burn rate  
- Remaining runway in months  
- Approximate days until funds run out  
- Overall financial condition through visual indicators  

The focus of this project is not just calculation, but presenting financial data in a simple and meaningful way.

**✨ Features**

Core Functionality

- Input fields for:
  - Total Cash on Hand  
  - Monthly Burn Rate  

- Runway calculation:
  - Months remaining  
  - Days to zero  

- Visual status indicators:
  - 🟢 Safe  
  - 🟡 Warning
  - 🔴 Danger

**Enhancements**

- Currency formatting for better readability  
- Option to switch between ₹, $, €  
- Days-to-zero breakdown for more insight  
- Separate landing page and calculator page  
- Subtle neon UI styling for better visual appeal  

**🎨 UI & Design**

The interface is designed to be simple but expressive:

- Dark theme for better contrast  
- Subtle neon glow for a modern look  
- Color-based feedback to indicate financial health  
- Minimal layout to keep focus on results  

Color meaning:
- Green : Safe  
- Yellow : Needs attention  
- Red : Danger

The goal is to help users understand their situation instantly without overanalyzing numbers.

**💻 Technical Approach**

Tech Stack

- HTML  
- CSS  
- JavaScript (Vanilla)  

Why Vanilla JS?

- Keeps the project lightweight  
- Demonstrates core JavaScript skills  
- Allows full control over UI behavior  

**📊 Calculation Logic**

- Runway (Months) = Cash ÷ Burn Rate  
- Days ≈ Months × 30  

**📱 Responsiveness**

The application is designed to work across devices:

- Flexible layout using percentage widths  
- Media queries for smaller screens  
- Readable font scaling  
- Touch-friendly inputs and buttons  

**🚀 Extra Efforts**

Special focus was given to small but important details:

- Currency formatting using locale-based display  
- Consistent spacing and alignment  
- Clear visual hierarchy (months, days, status)  
- Status colors that reflect urgency  
- Smooth hover and interaction feedback  

**💡 Design Intent**

The aim was to make a simple calculator feel more like a useful product.

Instead of just displaying numbers, the app provides:
- Context through color and status  
- Readability through formatting  
- Clarity through layout  

This helps users quickly understand their financial position without extra effort.

**📂 Project Structure**

```bash
runway-calculator/
│
├── index.html
├── calculator.html
├── styles.css
├── script.js
├── bg.jpg
└── README.md
```

