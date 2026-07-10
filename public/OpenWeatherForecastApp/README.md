# Weather Forecast App

A sleek, highly responsive web application that provides real-time comprehensive atmospheric conditions, wind metrics, and solar schedules. The app features a modern glassmorphic interface built with smooth animations and dynamic layouts.

## Security Architecture

To prevent API key exposure and eliminate unauthorized usage risks, this application implements a secure backend proxy server architecture:
* **Hidden Credentials:** Sensitive OpenWeatherMap API tokens are kept entirely server-side.
* **Network Privacy:** Clients communicate with local API routes rather than exposing query params to browser tracking logs.
* **Isolated Configurations:** Local credentials reside in a dedicated config file excluded from version control systems.

---

## Getting Started

Follow these step-by-step instructions to initialize and run the ecosystem on your local machine.

### Prerequisites

Ensure you have the following engine components pre-installed:
* [Node.js](https://nodejs.org/) (v16.x or higher recommended)
* [npm](https://www.npmjs.com/) (bundled directly with Node.js installations)

### Installation & Environment Setup

1. **Clone the project repository** down to your workstation environment:
   ```bash
   git clone [https://github.com/your-username/weather-app.git](https://github.com/your-username/weather-app.git)
   cd weather-app
   ```

2. **Install the package dependencies** specified within the build configuration:
   ```bash
   npm install
   ```

3. **Initialize the local configuration file** within the root project workspace:
   ```bash
   touch .env
   ```

4. **Populate the environmental keys** inside your newly generated .env container:
   ```bash
    PORT=3000
    OPENWEATHER_API_KEY=your_actual_openweather_api_key_here
   ```

### Running the Application

2. **Launch the Node.js production server execution utility** from the root repository terminal branch:

```bash
npm start
```
You should receive a terminal confirmation notice: `Server running on http://localhost:3000`

Access the operational interface by navigating to the address loop link inside your web browser engine:

```text
http://localhost:3000
```

## Repository Layout

```text
weather-app/
├── public/                 # Static frontend structural assets
│   ├── index.html          # Semantic HTML structure elements
│   ├── style.css           # Glassmorphic grid layout system
│   └── script.js           # Client-side endpoint fetch utility
├── .env                    # Private local security variables
├── .gitignore              # Version control system exclusion file
├── package.json            # Target version registry configuration
└── server.js               # Express security proxy interface core
```