# ⚡ Reactive State Core & Stream Matrix

A futuristic web-based demonstration of a **centralized reactive state management architecture** built with modern JavaScript. This project showcases how a lightweight state store can manage immutable state updates and notify independent observer components through a subscription-based reactive stream system.

## 🚀 Overview

Reactive State Core & Stream Matrix simulates the architecture behind popular state management solutions like Redux and other reactive data systems.

The application consists of:

* **State Command Center** — Dispatches immutable state updates.
* **Reactive State Kernel** — Stores application state and manages observer subscriptions.
* **Observer Nodes** — Independent components that listen to specific state channels and react to updates in real time.
* **Live Stream Terminal** — Displays dispatch events, observer notifications, and execution latency.

---

## ✨ Features

* 🔄 Centralized state management
* 📡 Channel-based observer subscription system
* ⚡ Real-time reactive UI updates
* 🧩 Immutable state dispatch pattern
* 🎯 Selective listener notification
* ⏱️ Dispatch latency monitoring
* 🌌 Cyberpunk-inspired futuristic interface
* 📱 Fully responsive dashboard layout
* 🧠 Modern JavaScript class architecture using private fields

---

## 📁 Project Structure

```plaintext
Reactive-State-Core-Matrix/
│
├── index.html          # Dashboard user interface
├── app.js              # UI interactions and state dispatch logic
├── stateKernel.js      # Central reactive state store engine
├── favicon.png         # Custom cyberpunk project icon
└── README.md           # Project documentation
```

---

## ⚙️ How It Works

### 1. Creating the State Store

The `ReactiveStateStore` acts as the single source of truth:

```javascript
const store = new ReactiveStateStore();
```

---

### 2. Subscribing Observer Nodes

Components subscribe to specific data channels:

```javascript
store.subscribe("leadPipeline", callback);
```

Only observers listening to that channel receive updates.

---

### 3. Dispatching State Updates

New immutable state snapshots are created whenever data changes:

```javascript
store.dispatch("leadPipeline", "$45,200");
```

The state kernel then notifies all registered observers.

---

## 🖥️ Running the Project

1. Clone the repository:

```bash
git clone https://github.com/100_days_100_project.git
```

2. Open the project folder:

```bash
cd reactive-state-engine
```

3. Launch `index.html` using a browser or a local development server.

Example:

```bash
# Using VS Code Live Server
Right Click index.html → Open with Live Server
```

---

## 🧪 Example Workflow

1. Enter a **State Channel Key**

```
leadPipeline
```

2. Enter a **Transaction Value**

```
$45,200
```

3. Click **Commit Immutable State Dispatch**

4. Observe:

* Observer Node Alpha updates instantly.
* Observer Node Beta receives the same stream independently.
* The system terminal logs the dispatch event and processing latency.

---

## 🛠️ Technologies Used

* HTML5
* CSS3
* Vanilla JavaScript (ES6+)
* JavaScript Modules
* Reactive Programming Concepts

---

## 📚 Core Concepts Demonstrated

* Centralized state architecture
* Publish–subscribe pattern
* Observer pattern
* Immutable data updates
* Event-driven programming
* Component decoupling

---

## 🔮 Future Enhancements

* Add state history and time-travel debugging
* Implement asynchronous action handling
* Add dynamic observer registration from the UI
* Visualize state graphs and data flow
* Persist state using local storage
* Add custom middleware support

---

## 📸 Preview

The dashboard features a futuristic cyberpunk UI with glowing observer nodes, a real-time stream terminal, and a centralized command panel.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add amazing feature"
```

4. Push to your branch and open a Pull Request.

---

## 📄 License

This project is open-source and available under the **MIT License**.

---

### ⚡ "One state. Multiple observers. Infinite reactive possibilities."
