import { NeuralNetwork } from './aiKernel.js';

const canvas = document.getElementById('sim-canvas');
const ctx = canvas.getContext('2d');

// Element UI pointers caching
const spawnBtn = document.getElementById('spawn-btn');
const cataclysmBtn = document.getElementById('cataclysm-btn');
const mutationSlider = document.getElementById('mutation-slider');
const mutationLbl = document.getElementById('mutation-lbl');
const logStream = document.getElementById('terminal-stream');

const telGen = document.getElementById('tel-gen');
const telPop = document.getElementById('tel-pop');
const telFood = document.getElementById('tel-food');
const telFitness = document.getElementById('tel-fitness');

// Simulation parameters matrix configurations
const POPULATION_MAX = 15;
let generationCount = 0;
let agents = [];
let foodItems = [];
let mutationRate = 10;
let isRunning = false;

class Agent {
    constructor(brain = null) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.brain = brain ? brain : new NeuralNetwork();
        this.fitness = 0;
        this.energy = 400; // Lifespan ticking engine variable
        this.radius = 6;
    }

    update() {
        this.energy--;
        if (this.energy <= 0) return false;

        // Locating nearest food coordinates vectors
        let closestFood = null;
        let minDist = Infinity;

        foodItems.forEach(food => {
            let d = Math.hypot(food.x - this.x, food.y - this.y);
            if (d < minDist) { minDist = d; closestFood = food; }
        });

        // Compute normalized input tracking vectors for the Neural Brain
        let dx = closestFood ? (closestFood.x - this.x) / canvas.width : 0;
        let dy = closestFood ? (closestFood.y - this.y) / canvas.height : 0;

        // Drive outputs using the brain execution kernel
        const [moveX, moveY] = this.brain.predict([dx, dy]);

        this.x += moveX * 2.5;
        this.y += moveY * 2.5;

        // Clamp positions to canvas boundaries
        this.x = Math.max(0, Math.min(canvas.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height, this.y));

        // Evaluate proximity colliders with target food objects
        if (closestFood && minDist < this.radius + 4) {
            this.fitness += 10;
            this.energy += 120; // Fuel expansion injection
            foodItems = foodItems.filter(f => f !== closestFood);
            spawnFood(1);
        }

        return true;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 243, 255, ${Math.max(0.3, this.energy / 400)})`;
        ctx.fill();
    }
}

function spawnFood(count = 20) {
    for (let i = 0; i < count; i++) {
        foodItems.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height });
    }
}

// Evolutionary Engine Core Selection Layer
function evaluateNextGeneration() {
    generationCount++;
    logStream.textContent += `\n[Generation Alpha Evolved] Initiating cycle #${generationCount}...`;

    // Sort agents by historical accuracy and fitness records
    agents.sort((a, b) => b.fitness - a.fitness);
    const topFitness = agents[0] ? agents[0].fitness : 0;
    const bestBrain = agents[0] ? agents[0].brain : new NeuralNetwork();

    telFitness.textContent = topFitness.toFixed(2);

    // Build replacement generation arrays cloning the optimal configurations
    const nextGeneration = [];
    for (let i = 0; i < POPULATION_MAX; i++) {
        const structuralBrainCopy = bestBrain.clone();
        if (i > 0) structuralBrainCopy.mutate(mutationRate); // First slot is preserved perfectly (Elitism)
        nextGeneration.push(new Agent(structuralBrainCopy));
    }

    agents = nextGeneration;
    foodItems = [];
    spawnFood(25);
}

// Real-Time High-Frequency Simulation Render Thread
function loop() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw active food clusters
    ctx.fillStyle = '#39ff14';
    foodItems.forEach(food => {
        ctx.beginPath();
        ctx.arc(food.x, food.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });

    // Handle agent execution arrays tracking lifespans parameters
    agents = agents.filter(agent => {
        const isAlive = agent.update();
        if (isAlive) agent.draw();
        return isAlive;
    });

    // Telemetry display matrix updating
    telGen.textContent = generationCount;
    telPop.textContent = `${agents.length} / ${POPULATION_MAX}`;
    telFood.textContent = foodItems.length;

    // Environmental trigger check: if all vectors expire, transition the generation instantly
    if (agents.length === 0) {
        evaluateNextGeneration();
    }

    requestAnimationFrame(loop);
}

// Wire form configuration listeners
mutationSlider.addEventListener('input', (e) => {
    mutationRate = parseInt(e.target.value);
    mutationLbl.textContent = `${mutationRate}%`;
});

spawnBtn.addEventListener('click', () => {
    if (isRunning) return;
    isRunning = true;
    logStream.textContent = "[Simulator Matrix] Spawning initial generation vectors. Weights distributed randomly...";

    generationCount = 0;
    agents = Array.from({ length: POPULATION_MAX }, () => new Agent());
    spawnFood(25);
    loop();
});

cataclysmBtn.addEventListener('click', () => {
    if (!isRunning || agents.length <= 1) return;
    logStream.textContent += `\n[ALERT - Cataclysm Vector] Ejecting 60% of current species population...`;

    // Severely prune active arrays down to test high mutation bounce-backs
    agents = agents.slice(0, Math.ceil(agents.length * 0.4));
});