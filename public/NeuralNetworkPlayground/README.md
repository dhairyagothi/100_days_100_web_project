# Neural Network Playground

An interactive neural network visualizer built with vanilla JavaScript and HTML5 Canvas. Design custom network architectures, train on toy datasets, and watch decision boundaries evolve in real-time.

## Features

- **Live Training Visualization** — Watch backpropagation animate through the network
- **Decision Boundary Heatmap** — See how the network classifies 2D space in real-time
- **5 Toy Datasets** — Circle, XOR, Spiral, Gaussian, Moons
- **Configurable Architecture** — Add/remove hidden layers, adjust neuron counts (1–12 per layer)
- **Hyperparameter Controls** — Learning rate, activation function (ReLU, Sigmoid, Tanh, Leaky ReLU), batch size
- **Network Graph** — Visual representation with weight-colored connections
- **Loss Chart** — Live training loss curve
- **Fully Responsive** — Works on desktop, tablet, and mobile

## Technologies Used

- HTML5
- CSS3 (Custom Properties, Grid, Flexbox)
- JavaScript ES6+ (Canvas API, requestAnimationFrame)
- No external libraries for the neural network engine

## How to Run

1. Open `index.html` in any modern web browser
2. Select a dataset (Circle, XOR, Spiral, etc.)
3. Configure hidden layers and hyperparameters
4. Click **Train** and watch the magic happen!

## Screenshots

### Decision Boundary + Network Architecture

The left canvas shows the decision boundary heatmap (blue = class 0, red = class 1) with data points overlaid. The right canvas visualizes the network graph with weight-colored connections.

## How It Works

1. **Forward Pass**: Input coordinates flow through weighted connections and activation functions
2. **Loss Calculation**: Binary cross-entropy measures prediction error
3. **Backpropagation**: Gradients flow backward, computing how each weight contributed to the error
4. **Weight Update**: Weights are adjusted using gradient descent to reduce loss

## Author

Contributed as part of 100 Days 100 Web Projects
