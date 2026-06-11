# 🚀 Pathfinder OS

**Pathfinder OS** is a futuristic graph-visualization web application that demonstrates shortest-path routing between major Indian cities using graph algorithms. The interface is inspired by cyberpunk operating systems and network command consoles, featuring animated SVG maps, real-time metrics, and algorithm visualization.

---

## ✨ Features

### 🌐 Interactive Network Map

* SVG-based visualization of Indian cities.
* Connected weighted graph representing road distances.
* Neon cyberpunk UI with animated node and edge highlighting.

### 🧭 Pathfinding Algorithms

* **Dijkstra's Algorithm** (fully implemented)
* **A* Search Mode** (UI ready for implementation)

### 🎯 Smart City Selection

* Select a source city.
* Select a destination city.
* Automatically compute the optimal route.

### 📊 Real-Time Metrics

Displays:

* Total Distance
* Nodes Visited
* Edges Traversed
* Execution Time

### 🔥 Visual Route Highlighting

* Optimal route glows on the network graph.
* Selected cities are highlighted in the side panel.
* Route sequence displayed in terminal format.

### 💻 Pathfinder Terminal

Provides live system messages such as:

```text
READY
SOURCE SELECTED
DESTINATION SELECTED
ROUTE GENERATED SUCCESSFULLY
SYSTEM RESET SUCCESSFULLY
```

---

## 🏗️ Project Structure

```text
Pathfinder-OS/
│
├── index.html
├── style.css
├── script.js
├── preview.png
├── favicon_pathfinder.png
└── README.md
```

### Files

| File         | Description                                             |
| ------------ | ------------------------------------------------------- |
| `index.html` | Main application UI                                     |
| `style.css`  | Cyberpunk styling and animations                        |
| `script.js`  | Graph data, rendering logic, and pathfinding algorithms |

---

## 📍 City Network

The application currently includes the following cities:

* Delhi
* Amritsar
* Jaipur
* Lucknow
* Patna
* Kolkata
* Bhopal
* Nagpur
* Hyderabad
* Mumbai
* Pune
* Bengaluru
* Chennai
* Vizag
* Ahmedabad
* Surat

Each city acts as a node within a weighted graph.

---

## ⚙️ How It Works

### 1. Graph Representation

Cities are stored as nodes:

```javascript
const cities = {
  DEL: { name: "Delhi", x: 380, y: 120 },
  ...
};
```

Connections are stored as weighted edges:

```javascript
const graph = {
  DEL: {
    AMR: 450,
    JAI: 280,
    LKO: 500
  }
};
```

---

### 2. Dijkstra's Algorithm

The shortest route is computed using Dijkstra's algorithm.

Process:

1. Initialize distances.
2. Visit the nearest unvisited node.
3. Relax neighboring edges.
4. Repeat until destination is reached.
5. Reconstruct the shortest path.

Time Complexity:

```text
O(V²)
```

Where:

* V = Number of vertices (cities)

---

### 3. Route Visualization

After computation:

* Path edges receive the `.on-path` class.
* Metrics panel updates.
* Route sequence is displayed.
* Status terminal reports completion.

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/dhairyagothi/100_days_100_web_project.git
```

### Open Project

Simply open:

```text
index.html
```

in any modern browser.

No build tools or frameworks required.

---

## 🛠️ Technologies Used

* HTML5
* CSS3
* Vanilla JavaScript
* SVG Graphics
* Dijkstra's Algorithm

---

## 🎨 UI Inspiration

Pathfinder OS is designed around:

* Cyberpunk operating systems
* Futuristic network consoles
* Mission-control dashboards
* Sci-fi navigation systems

Fonts Used:

* Orbitron
* Rajdhani
* Share Tech Mono

---

## 🔮 Future Enhancements

* Full A* Search implementation
* Route animation playback
* Zoom and pan controls
* Dynamic graph editing
* Dark/Light themes
* Custom city imports
* Heuristic visualization for A*
* Route comparison mode

---

## 📸 Preview

```text
PATHFINDER OS
SYSTEM ONLINE — GRAPH ENGINE v2.4

[ Select Source ]
        ↓
[ Select Destination ]
        ↓
[ Compute Shortest Path ]
        ↓
[ Visualize Route ]
```

---

## 📜 License

This project is open-source and available under the MIT License.

---

### Built with JavaScript, Graph Theory, and a love for futuristic interfaces.
