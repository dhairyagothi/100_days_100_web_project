let currentProcesses = [];
let currentTimeline = [];
let currentAlgorithm = "";

// ----------------------------------------------------------
// DOM Elements
// ----------------------------------------------------------
const elements = {
  algorithm: document.getElementById("algorithm"),
  numProcesses: document.getElementById("numProcesses"),
  timeQuantum: document.getElementById("timeQuantum"),
  timeQuantumDiv: document.getElementById("timeQuantumDiv"),
  processForm: document.getElementById("processForm"),
  processFormContainer: document.getElementById("processFormContainer"),
  sampleBtn: document.getElementById("sampleBtn"),
  runSimulation: document.getElementById("runSimulation"),

  errorMessage: document.getElementById("errorMessage"),
  errorText: document.getElementById("errorText"),

  results: document.getElementById("results"),
  outputTable: document.getElementById("outputTable"),
  ganttChart: document.getElementById("ganttChart"),
  processLegend: document.getElementById("processLegend"),
  metricsPanel: document.getElementById("metricsPanel"),
  analysisContent: document.getElementById("analysisContent"),

  algorithmDescription: document.getElementById("algorithmDescription"),

  buttonText: document.getElementById("buttonText"),
  loadingSpinner: document.getElementById("loadingSpinner"),
  ganttTooltip: document.getElementById("ganttTooltip"),
};

// ----------------------------------------------------------
// Algorithm Information
// ----------------------------------------------------------
const algorithmInfo = {
  fcfs: {
    name: "First Come First Serve",
    description:
      "Processes execute in order of arrival. Simple and fair, but may suffer from convoy effect.",
  },
  sjf: {
    name: "Shortest Job First",
    description:
      "Chooses the process with the smallest burst time. Minimizes average waiting time.",
  },
  srtf: {
    name: "Shortest Remaining Time First",
    description:
      "Preemptive version of SJF. Always selects the process with the least remaining time.",
  },
  rr: {
    name: "Round Robin",
    description:
      "Each process receives CPU for a fixed time quantum. Ideal for time-sharing systems.",
  },
  priority: {
    name: "Priority Scheduling (Non-Preemptive)",
    description:
      "Processes are executed based on priority. Lower number means higher priority.",
  },
  priority_preemptive: {
    name: "Priority Scheduling (Preemptive)",
    description:
      "Higher-priority arriving processes can interrupt currently running ones.",
  },
  hrrn: {
    name: "Highest Response Ratio Next",
    description:
      "Selects process with highest response ratio to reduce starvation.",
  },
  multilevel: {
    name: "Multilevel Queue Scheduling",
    description: "Processes are assigned to queues based on priority classes.",
  },
};

// ----------------------------------------------------------
// Fields Required by Algorithm
// ----------------------------------------------------------
const algorithmFields = {
  fcfs: ["arrival", "burst"],
  sjf: ["arrival", "burst"],
  srtf: ["arrival", "burst"],
  rr: ["arrival", "burst"],
  priority: ["arrival", "burst", "priority"],
  priority_preemptive: ["arrival", "burst", "priority"],
  hrrn: ["arrival", "burst"],
  multilevel: ["arrival", "burst", "priority"],
};

const fieldLabels = {
  arrival: "Arrival Time",
  burst: "Burst Time",
  priority: "Priority (Lower = Higher Priority)",
};

// ----------------------------------------------------------
// Event Listeners
// ----------------------------------------------------------
elements.algorithm.addEventListener("change", () => {
  updateAlgorithmInfo();
  updateUIForAlgorithm();
  generateProcessForm();
});

elements.numProcesses.addEventListener("input", () => {
  generateProcessForm();
});

elements.sampleBtn.addEventListener("click", loadSampleData);
elements.runSimulation.addEventListener("click", runSimulation);

// ----------------------------------------------------------
// Initialization
// ----------------------------------------------------------
updateAlgorithmInfo();
updateUIForAlgorithm();
generateProcessForm();

// ==========================================================
// UI Functions
// ==========================================================
function updateAlgorithmInfo() {
  const algorithm = elements.algorithm.value;
  elements.algorithmDescription.textContent =
    algorithmInfo[algorithm].description;
}

function updateUIForAlgorithm() {
  const algorithm = elements.algorithm.value;

  if (algorithm === "rr") {
    elements.timeQuantumDiv.classList.remove("hidden");
  } else {
    elements.timeQuantumDiv.classList.add("hidden");
  }
}

function generateProcessForm() {
  const algorithm = elements.algorithm.value;
  const numProcesses = parseInt(elements.numProcesses.value) || 0;
  const fields = algorithmFields[algorithm];

  if (numProcesses < 1 || numProcesses > 20) {
    elements.processForm.innerHTML = "";
    return;
  }

  elements.processForm.innerHTML = "";

  for (let i = 1; i <= numProcesses; i++) {
    const card = document.createElement("div");
    card.className = "process-card";

    let fieldsHTML = "";

    fields.forEach((field) => {
      const min = field === "burst" ? 1 : 0;

      fieldsHTML += `
                <div>
                    <label class="block text-xs font-semibold text-slate-400 mb-2 uppercase">
                        ${fieldLabels[field]}
                    </label>
                    <input
                        type="number"
                        name="${field}"
                        min="${min}"
                        class="input-small"
                        placeholder="${fieldLabels[field]}"
                    />
                </div>
            `;
    });

    card.innerHTML = `
            <h3>Process P${i}</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
                ${fieldsHTML}
            </div>
        `;

    elements.processForm.appendChild(card);
  }

  hideError();
}

function showError(message) {
  elements.errorText.textContent = message;
  elements.errorMessage.classList.remove("hidden");
}

function hideError() {
  elements.errorMessage.classList.add("hidden");
}

function setLoading(isLoading) {
  elements.runSimulation.disabled = isLoading;

  if (isLoading) {
    elements.buttonText.textContent = "Running Simulation...";
    elements.loadingSpinner.classList.remove("hidden");
  } else {
    elements.buttonText.textContent = "🚀 Run Simulation";
    elements.loadingSpinner.classList.add("hidden");
  }
}

// ==========================================================
// Data Collection
// ==========================================================
function collectInputData() {
  const algorithm = elements.algorithm.value;
  const numProcesses = parseInt(elements.numProcesses.value);

  if (!numProcesses || numProcesses < 1 || numProcesses > 20) {
    showError("Please set the number of processes between 1 and 20.");
    return null;
  }

  const processes = [];
  const cards = elements.processForm.querySelectorAll(".process-card");

  for (let i = 0; i < cards.length; i++) {
    const process = {
      pid: `P${i + 1}`,
    };

    for (const field of algorithmFields[algorithm]) {
      const input = cards[i].querySelector(`[name="${field}"]`);

      const value = parseInt(input.value);

      if (isNaN(value)) {
        showError(`Please fill all required fields for Process P${i + 1}.`);
        return null;
      }

      if (field === "burst" && value < 1) {
        showError(`Burst time for Process P${i + 1} must be at least 1.`);
        return null;
      }

      process[field] = value;
    }

    process.remainingTime = process.burst;
    process.completionTime = 0;
    process.turnaroundTime = 0;
    process.waitingTime = 0;
    process.responseTime = -1;

    processes.push(process);
  }

  let timeQuantum = 0;
  if (algorithm === "rr") {
    timeQuantum = parseInt(elements.timeQuantum.value);

    if (!timeQuantum || timeQuantum < 1) {
      showError("Time quantum must be a positive number for Round Robin scheduling.");
      return null;
    }
  }

  return {
    algorithm,
    processes,
    timeQuantum,
  };
}

// ==========================================================
// Simulation Controller
// ==========================================================
async function runSimulation() {
  hideError();
  setLoading(true);

  try {
    const input = collectInputData();
    if (!input) {
      setLoading(false);
      return;
    }

    const result = simulate(input);

    displayResults(result);

    elements.results.classList.remove("hidden");
    elements.results.scrollIntoView({
      behavior: "smooth",
    });
  } catch (error) {
    showError(error.message);
  } finally {
    setLoading(false);
  }
}

// ==========================================================
// Core Simulation
// ==========================================================
function simulate({ algorithm, processes, timeQuantum }) {
  currentAlgorithm = algorithm;
  currentProcesses = structuredClone(processes);

  const timeline = [];
  let currentTime = 0;
  let completed = 0;
  let currentProcess = null;
  let quantumRemaining = timeQuantum;

  while (completed < currentProcesses.length) {
    const ready = currentProcesses.filter(
      (p) => p.arrival <= currentTime && p.remainingTime > 0,
    );

    const next = selectProcess(
      algorithm,
      ready,
      currentProcess,
      currentTime,
      quantumRemaining,
    );

    if (!next) {
      timeline.push({
        time: currentTime,
        process: "IDLE",
      });
      currentTime++;
      continue;
    }

    // Round Robin queue handling
    if (algorithm === "rr" && currentProcess !== next) {
      quantumRemaining = timeQuantum;
    }

    currentProcess = next;

    if (currentProcess.responseTime === -1) {
      currentProcess.responseTime = currentTime - currentProcess.arrival;
    }

    // Execute one unit
    timeline.push({
      time: currentTime,
      process: currentProcess.pid,
    });

    currentProcess.remainingTime--;
    currentTime++;

    if (algorithm === "rr") {
      quantumRemaining--;
    }

    // Completion
    if (currentProcess.remainingTime === 0) {
      currentProcess.completionTime = currentTime;
      currentProcess.turnaroundTime = currentTime - currentProcess.arrival;
      currentProcess.waitingTime =
        currentProcess.turnaroundTime - currentProcess.burst;

      completed++;
      currentProcess = null;
      quantumRemaining = timeQuantum;
    }
    // Round Robin quantum expiration
    else if (algorithm === "rr" && quantumRemaining === 0) {
      currentProcess = null;
    }
  }

  currentTimeline = timeline;

  return {
    algorithm,
    processes: currentProcesses,
    timeline,
    metrics: calculateMetrics(currentProcesses, currentTime),
  };
}

// ==========================================================
// Process Selection Logic
// ==========================================================
function selectProcess(
  algorithm,
  ready,
  currentProcess,
  currentTime,
  quantumRemaining,
) {
  // Continue current process for non-preemptive algorithms
  const nonPreemptive = ["fcfs", "sjf", "priority", "hrrn", "multilevel"];

  if (currentProcess && currentProcess.remainingTime > 0) {
    if (nonPreemptive.includes(algorithm)) {
      return currentProcess;
    }

    if (algorithm === "rr" && quantumRemaining > 0) {
      return currentProcess;
    }
  }

  if (ready.length === 0) return null;

  switch (algorithm) {
    case "fcfs":
      return [...ready].sort(
        (a, b) => a.arrival - b.arrival || a.pid.localeCompare(b.pid),
      )[0];

    case "sjf":
      return [...ready].sort(
        (a, b) => a.burst - b.burst || a.arrival - b.arrival,
      )[0];

    case "srtf":
      return [...ready].sort(
        (a, b) => a.remainingTime - b.remainingTime || a.arrival - b.arrival,
      )[0];

    case "rr":
      return [...ready].sort(
        (a, b) => a.arrival - b.arrival || a.pid.localeCompare(b.pid),
      )[0];

    case "priority":
    case "priority_preemptive":
    case "multilevel":
      return [...ready].sort(
        (a, b) => a.priority - b.priority || a.arrival - b.arrival,
      )[0];

    case "hrrn":
      return ready.reduce((best, p) => {
        const ratio = (currentTime - p.arrival + p.burst) / p.burst;

        const bestRatio =
          (currentTime - best.arrival + best.burst) / best.burst;

        return ratio > bestRatio ? p : best;
      });

    default:
      return ready[0];
  }
}

// ==========================================================
// Metrics Calculation
// ==========================================================
function calculateMetrics(processes, totalTime) {
  const n = processes.length;

  const totalTurnaround = processes.reduce(
    (sum, p) => sum + p.turnaroundTime,
    0,
  );

  const totalWaiting = processes.reduce((sum, p) => sum + p.waitingTime, 0);

  const totalResponse = processes.reduce((sum, p) => sum + p.responseTime, 0);

  const totalBurst = processes.reduce((sum, p) => sum + p.burst, 0);

  return {
    averageTurnaroundTime: totalTurnaround / n,
    averageWaitingTime: totalWaiting / n,
    averageResponseTime: totalResponse / n,
    cpuUtilization: (totalBurst / totalTime) * 100,
    throughput: n / totalTime,
    totalTime,
  };
}

// ==========================================================
// Display Results
// ==========================================================
function displayResults(result) {
  displayMetrics(result.metrics);
  displayResultsTable(result.processes);
  displayGanttChart(result.timeline);
  displayAnalysis(result);
}

// ----------------------------------------------------------
// Metrics
// ----------------------------------------------------------
function displayMetrics(metrics) {
  const cards = [
    {
      label: "Avg Turnaround",
      value: metrics.averageTurnaroundTime.toFixed(2),
    },
    {
      label: "Avg Waiting",
      value: metrics.averageWaitingTime.toFixed(2),
    },
    {
      label: "Avg Response",
      value: metrics.averageResponseTime.toFixed(2),
    },
    {
      label: "CPU Utilization",
      value: metrics.cpuUtilization.toFixed(1) + "%",
    },
  ];

  elements.metricsPanel.innerHTML = cards
    .map(
      (card) => `
            <div class="metric-card p-6 text-center">
                <div class="text-3xl font-bold text-white mb-2">
                    ${card.value}
                </div>
                <div class="text-sm text-slate-400 font-semibold uppercase tracking-wide">
                    ${card.label}
                </div>
            </div>
        `,
    )
    .join("");
}

// ----------------------------------------------------------
// Results Table
// ----------------------------------------------------------
function displayResultsTable(processes) {
  let extraColumn = "";
  let extraHeader = "";

  if (
    ["priority", "priority_preemptive", "multilevel"].includes(currentAlgorithm)
  ) {
    extraHeader = "<th>Priority</th>";
  }

  const rows = processes
    .map((p) => {
      if (
        ["priority", "priority_preemptive", "multilevel"].includes(
          currentAlgorithm,
        )
      ) {
        extraColumn = `<td>${p.priority}</td>`;
      } else {
        extraColumn = "";
      }

      return `
                <tr>
                    <td>${p.pid}</td>
                    <td>${p.arrival}</td>
                    <td>${p.burst}</td>
                    <td>${p.completionTime}</td>
                    <td>${p.turnaroundTime}</td>
                    <td>${p.waitingTime}</td>
                    <td>${p.responseTime}</td>
                    ${extraColumn}
                </tr>
            `;
    })
    .join("");

  elements.outputTable.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Process</th>
                    <th>Arrival</th>
                    <th>Burst</th>
                    <th>Completion</th>
                    <th>Turnaround</th>
                    <th>Waiting</th>
                    <th>Response</th>
                    ${extraHeader}
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    `;
}

// ----------------------------------------------------------
// Gantt Chart
// ----------------------------------------------------------
function displayGanttChart(timeline) {
  if (!timeline.length) return;

  // Consolidate consecutive blocks
  const blocks = [];
  let current = null;

  timeline.forEach((entry) => {
    if (current && current.process === entry.process) {
      current.duration++;
    } else {
      if (current) blocks.push(current);

      current = {
        process: entry.process,
        start: entry.time,
        duration: 1,
      };
    }
  });

  if (current) blocks.push(current);

  const blockMinWidth = 80;

  const ganttHTML = `
        <div style="overflow-x: auto;">
            <div class="gantt-timeline">
                ${blocks
                  .map((block) => {
                    const index = currentProcesses.findIndex(
                      (p) => p.pid === block.process,
                    );

                    const colorClass =
                      block.process === "IDLE"
                        ? "idle-block"
                        : `process-color-${index % 10}`;

                    return `
                            <div
                                class="gantt-block ${colorClass}"
                                style="min-width: ${blockMinWidth}px;"
                                title="${block.process} (${block.start}-${block.start + block.duration})"
                            >
                                <div>${block.process}</div>
                                <div class="gantt-timing">${block.start}-${block.start + block.duration}</div>
                            </div>
                        `;
                  })
                  .join("")}
            </div>
        </div>
    `;

  elements.ganttChart.innerHTML = ganttHTML;

  // Legend
  elements.processLegend.innerHTML =
    currentProcesses
      .map(
        (p, i) => `
                <div class="flex items-center gap-2">
                    <div class="w-4 h-4 rounded process-color-${i % 10}"></div>
                    <span class="text-sm text-slate-300">
                        ${p.pid}
                    </span>
                </div>
            `,
      )
      .join("") +
    `
        <div class="flex items-center gap-2">
            <div class="w-4 h-4 rounded idle-block"></div>
            <span class="text-sm text-slate-300">
                CPU Idle
            </span>
        </div>
    `;
}

// ----------------------------------------------------------
// Analysis
// ----------------------------------------------------------
function displayAnalysis(result) {
  const info = algorithmInfo[result.algorithm];

  elements.analysisContent.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6">
            <div class="p-6">
                <h3 class="text-xl font-bold mb-4">
                    📘 Algorithm Overview
                </h3>
                <p class="text-slate-300 leading-relaxed">
                    ${info.description}
                </p>
            </div>

            <div class="p-6">
                <h3 class="text-xl font-bold mb-4">
                    📊 Performance Summary
                </h3>
                <ul class="space-y-2 text-slate-300">
                    <li>
                        <strong>Total Time:</strong>
                        ${result.metrics.totalTime}
                    </li>
                    <li>
                        <strong>Throughput:</strong>
                        ${result.metrics.throughput.toFixed(3)}
                    </li>
                    <li>
                        <strong>CPU Utilization:</strong>
                        ${result.metrics.cpuUtilization.toFixed(1)}%
                    </li>
                </ul>
            </div>
        </div>
    `;
}

// ==========================================================
// Sample Data
// ==========================================================
function loadSampleData() {
  elements.algorithm.value = "rr";
  elements.numProcesses.value = 4;
  elements.timeQuantum.value = 2;

  updateAlgorithmInfo();
  updateUIForAlgorithm();
  generateProcessForm();

  const sample = [
    { arrival: 0, burst: 5 },
    { arrival: 1, burst: 3 },
    { arrival: 2, burst: 8 },
    { arrival: 3, burst: 6 },
  ];

  const cards = elements.processForm.querySelectorAll(".process-card");

  cards.forEach((card, index) => {
    const inputs = card.querySelectorAll("input");

    inputs[0].value = sample[index].arrival;
    inputs[1].value = sample[index].burst;
  });
}
