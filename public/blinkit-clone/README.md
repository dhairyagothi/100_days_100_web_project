# Blinkit Quick-Commerce Clone

A high-fidelity, interactive, and premium clone of the popular Indian quick-commerce service **Blinkit** (formerly Grofers). Built using **Vite + React** and styled entirely with **Vanilla CSS** to deliver a responsive, performant, and visual experience.

## 🚀 Key Features

1. **Header Navigation & Location Picker**:
   - **Typewriter search placeholder**: Dynamically types search suggestions (e.g. *onion, milk, chips, cold drinks*) in real time.
   - **Lucknow Location Selector**: Configured to default to Lucknow localities (Gomti Nagar, Hazratganj, Mahanagar, etc.). Supports manual address searches or "Detect Location" GPS simulation.

2. **Simulated OTP Login Modal**:
   - Simulated mobile authentication. Type any 10-digit mobile number, receive a 4-digit OTP, track a 30-second resend cooldown timer, and log in securely.
   - Successful logins replace the "Login" button with a custom profile badge displaying the user's phone prefix.

3. **Browse & Category Filter**:
   - Full grid navigation showcasing circular product category icons.
   - Left-sidebar category selector alongside dynamic item counters.
   - Real-time product search suggestions.

4. **Product Modals & Add-to-Cart**:
   - **ADD Counters**: Buttons transition smoothly from a simple "ADD" block into +/- quantity adjusters upon click.
   - **Detailed Product Modals**: Click on any product card to see its brand, pack sizes, description, shelf life, and key specifications.

5. **Slide-out Cart Drawer**:
   - Sliding right-side drawer summarizing items, prices, and quantities.
   - **Partner Tipping**: Include tips for delivery partners (₹10, ₹20, ₹30, ₹50).
   - **Coupons**: Apply code **`BLINKIT50`** to get flat ₹50 OFF on orders above ₹150.
   - **Dynamic Bills**: Detailed receipt compiling Subtotal, Delivery Fee (Free above ₹200), Handling Fee (₹4), Tips, and Coupon Discounts.

6. **Animated Order Delivery Simulator**:
   - Interactive tracking page launched upon checkout.
   - **Live Countdown Timer**: Starts at `08:00` and ticks down to `00:00` in real time.
   - **Moving Biker Animation**: Visual path representing a delivery biker (🚴) riding from the local warehouse (🏪) to the user's home (🏠).
   - **Web Audio Chimes**: Synthesizes custom retro sounds (beeps for step transitions and ascending chimes on completion).
   - **Confetti Celebration**: Triggers beautiful falling confetti particles on successful delivery.

---

## SCREENSHOTS
<img width="1883" height="902" alt="Screenshot 2026-06-13 094841" src="https://github.com/user-attachments/assets/607ecb2c-7263-43b6-9be5-084667115b0f" />

<img width="1887" height="911" alt="Screenshot 2026-06-13 095000" src="https://github.com/user-attachments/assets/b201f97b-dc06-4efe-b771-76bf1a3c18e9" />


## 🛠️ Technology Stack

- **Framework**: [React 18](https://react.dev/)
- **Bundler**: [Vite 5](https://vitejs.dev/)
- **Styling**: Vanilla CSS (Custom design tokens, variables, and responsive layout keyframes)
- **Audio**: Web Audio API (Synthesized oscillator soundscapes)
- **Icons**: Custom SVG graphics & Emojis

---

## 📂 Project Structure

```text
blinkit-clone/
├── index.html              # Document wrapper & Google Fonts imports
├── package.json            # Scripts & project dependencies
├── vite.config.js          # Vite config
├── README.md               # Project documentation
└── src/
    ├── main.jsx            # Entry point for rendering DOM
    ├── App.jsx             # Main container & state manager
    ├── index.css           # Global CSS stylesheet & design tokens
    ├── data/
    │   └── products.js     # Mock product database & Lucknow metadata
    └── components/
        ├── Header.jsx           # Nav, search typing & suggestions
        ├── BannerCarousel.jsx   # Sliding deal advertisements
        ├── CategoriesGrid.jsx   # Top visual category triggers
        ├── ProductCard.jsx      # Product card with ADD button counter
        ├── ProductModal.jsx     # Detailed nutritional & spec info popover
        ├── LocationModal.jsx    # Lucknow area selector & GPS simulator
        ├── LoginModal.jsx       # Mobile number OTP credentials simulator
        ├── CartDrawer.jsx       # Checkout summary with coupons & receipts
        └── OrderTracker.jsx     # Live tracking map & audio chimes
```

---

## 💻 How to Run Locally

### 1. Prerequisite
Ensure you have **Node.js** (v18 or higher) and **npm** installed on your machine.

### 2. Install Dependencies
Navigate into the project directory and install the packages:
```bash
cd blinkit-clone
npm install
```

### 3. Run the Development Server
Launch the local dev environment:
```bash
npm run dev
```
Open the local URI displayed in your terminal (typically `http://localhost:5173`) in your browser to experience the application.

### 4. Build for Production
To package the app for production deployment:
```bash
npm run build
```
The static bundles will be compiled inside the `dist/` directory.
