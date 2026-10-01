# 🚀 Space Exploration Hub

A responsive web application that provides **live International Space Station (ISS) tracking**, displays the **current astronauts aboard the ISS**, and showcases **upcoming space launch schedules** with real-time countdown timers. The project is built using **HTML, CSS, and JavaScript** while integrating live data from public space APIs.

## ✨ Features

* 🛰️ Live ISS latitude and longitude tracking
* 👨‍🚀 Displays astronauts currently aboard the ISS
* 🚀 Upcoming space launch schedule
* ⏳ Real-time launch countdown timers
* 🔄 Automatic ISS location refresh every 5 seconds
* 📱 Responsive and modern dashboard interface

## 🛠️ Technologies Used

* HTML5
* CSS3
* JavaScript (ES6)
* Fetch API
* Public REST APIs

## 🌐 APIs Used

* **Open Notify API**

  * Live ISS Location
  * Current Astronauts in Space

* **The Space Devs Launch Library API**

  * Upcoming Launch Schedule
  * Launch Mission Information

## 📂 Project Structure

```text
Space-Exploration-Hub/
│── index.html
│── style.css
│── script.js
│── image.png
└── README.md
```

## ▶️ How to Run

1. Clone the repository:

```bash
git clone https://github.com/dhairyagothi/100_days_100_web_project.git
```

2. Navigate to the project folder:

```bash
cd Space-tracker
```

3. Open `index.html` in your preferred web browser.

No installation or additional dependencies are required.

## ⚙️ How It Works

### Live ISS Tracker

* Fetches the ISS's current latitude and longitude using the Open Notify API.
* Updates the displayed coordinates automatically every **5 seconds**.

### Astronaut Tracker

* Retrieves the list of astronauts currently in space.
* Filters the data to display only astronauts aboard the **International Space Station (ISS)**.

### Launch Schedule

* Retrieves the next three upcoming launches from the Space Devs Launch Library API.
* Displays:

  * Mission name
  * Rocket name
  * Launch pad location
  * Live countdown timer

### Countdown Engine

* Calculates the remaining time until launch.
* Updates every second.
* Displays **"LIFTOFF / IN FLIGHT"** once the launch time is reached.

## 📸 Preview

The dashboard includes:

* 🛰️ Live ISS Coordinates
* 👨‍🚀 Current ISS Crew Members
* 🚀 Upcoming Launch Feed
* ⏳ Real-Time Countdown Timers

## 🚀 Future Enhancements

* Interactive world map showing the live ISS position
* Orbit path visualization
* Launch history and mission archives
* Weather information for launch sites
* Mission detail pages with spacecraft information
* Dark/Light mode toggle
* Search and filter launches by agency or country

## 📄 License

This project is open-source and available under the MIT License.
