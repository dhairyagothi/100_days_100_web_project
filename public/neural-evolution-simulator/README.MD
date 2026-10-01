# 🧠 Neural Network Evolution Simulator Engine

A futuristic AI-inspired simulation that demonstrates **neural networks, genetic algorithms, and evolutionary behavior** inside a dynamic virtual ecosystem. Autonomous agents use simple neural networks to locate food, survive, evolve across generations, and adapt through mutation and natural selection.

Built with **HTML5 Canvas, modern JavaScript (ES Modules), and genetic evolution principles**, this project provides an interactive visualization of artificial life and machine learning concepts.

---

## 🚀 Features

### 🧬 Neural Network Powered Agents

* Each agent contains a lightweight neural network brain.
* Uses a feed-forward architecture with:

  * Input layer (food direction vectors)
  * Hidden layer for decision processing
  * Output layer for movement vectors
* Uses `tanh` activation functions to produce smooth movement.

---

### 🌱 Evolutionary Algorithm System

The simulation implements fundamental genetic algorithm concepts:

* **Selection** — The highest fitness agent is selected as the parent of the next generation.
* **Cloning** — The best neural network is copied into new agents.
* **Mutation** — Neural weights are randomly modified based on a configurable mutation rate.
* **Elitism** — The strongest agent is preserved without mutation.

Agents continuously improve their ability to find food and survive across generations.

---

### 🎮 Interactive Simulation Controls

Control the evolution process using:

* **Initiate Evolution Matrix**

  * Creates the first generation of AI agents.
  * Randomly initializes neural network weights.

* **Mutation Rate Slider**

  * Adjusts the probability of genetic mutations.
  * Allows experimentation with different evolution strategies.

* **Trigger Cataclysm Vector**

  * Removes a large portion of the active population.
  * Tests how the ecosystem recovers after catastrophic events.

---

### 🌎 Virtual Ecosystem

The environment contains:

* AI agents that move and consume resources.
* Food clusters randomly distributed across the biome.
* Energy-based lifespans.
* Fitness scoring based on food collected.
* Automatic generation transitions when all agents expire.

---

### 📡 Live Telemetry Dashboard

Monitor the simulation in real time:

* Current generation number.
* Active population count.
* Remaining food clusters.
* Best fitness score.
* Evolution terminal logs.

---

### 🎨 Futuristic User Interface

* Cyberpunk-inspired neon design.
* Responsive dashboard layout.
* Real-time canvas rendering.
* Matrix-style terminal activity stream.
* Animated AI ecosystem visualization.

---

## 🛠️ Technologies Used

* HTML5
* CSS3
* JavaScript (ES6+)
* JavaScript Modules
* HTML5 Canvas API
* Genetic Algorithms
* Artificial Neural Networks

---

## 📂 Project Structure

```text
Neural-Network-Evolution-Simulator/
│
├── index.html          # Main dashboard and simulation UI
├── app.js              # Evolution engine and ecosystem logic
├── aiKernel.js         # Neural network implementation
├── image.png           # Custom favicon
└── README.md           # Project documentation
```

---

## ▶️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/100_days_100_project.git
```

### 2. Navigate to the Project Folder

```bash
cd neural-network-evolution-simulator
```

### 3. Run the Project

Open `index.html` in a modern web browser.

Because the project uses JavaScript ES Modules (`type="module"`), it is recommended to run it using a local development server.

Examples:

Using VS Code Live Server:

```text
Right click index.html → Open with Live Server
```

Using Python:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

---

## ⚙️ Simulation Workflow

1. Click **Initiate Evolution Matrix** to create the initial AI population.
2. Agents begin searching for nearby food sources.
3. Each agent uses its neural network to decide movement direction.
4. Agents gain fitness by consuming food and lose energy over time.
5. When all agents die, the strongest neural network is selected.
6. A new generation is created using cloning and mutation.
7. Evolution continues automatically across generations.

---

## 🔬 Learning Concepts Demonstrated

This project is useful for understanding:

* Artificial Neural Networks (ANN)
* Feed-forward computation
* Activation functions
* Genetic algorithms
* Natural selection
* Mutation and inheritance
* Agent-based simulations
* Emergent artificial intelligence

---

## 🔮 Future Enhancements

Potential improvements:

* Multiple neural network layers.
* Cross-over between parent agents.
* Predator and prey ecosystems.
* Different food types with varied rewards.
* Evolution graphs and statistical charts.
* Save and load neural populations.
* Adjustable simulation speed.
* GPU-accelerated rendering.
* Advanced reinforcement learning models.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature-name
```

3. Commit your changes:

```bash
git commit -m "Add your feature"
```

4. Push your branch:

```bash
git push origin feature-name
```

5. Open a Pull Request.

---

## 📄 License

This project is open-source and available under the **MIT License**.

---

## ⭐ Acknowledgements

* Inspired by artificial life simulations and genetic algorithms.
* HTML5 Canvas for real-time graphical rendering.
* Neural network concepts inspired by foundational machine learning principles.
* Evolutionary computation techniques used in modern AI research.

---

### ⭐ If you enjoy this project, consider giving it a star on GitHub!
