function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem('neuralforge_theme') || 'dark';
  setTheme(savedTheme);
}

function setTheme(theme) {
  const html = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  
  if (theme === 'light') {
    html.classList.add('light-theme');
    if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun text-orange-400"></i>';
    localStorage.setItem('neuralforge_theme', 'light');
  } else {
    html.classList.remove('light-theme');
    if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-moon text-yellow-400"></i>';
    localStorage.setItem('neuralforge_theme', 'dark');
  }
}

function toggleTheme() {
  const html = document.documentElement;
  const isLight = html.classList.contains('light-theme');
  setTheme(isLight ? 'dark' : 'light');
}

// Architectural Variable State Tracker
let selectedArch = "npu";
let activeDesignData = null;

// Initialize Workspace Assets on Document Mounting
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  renderSavedProjectsList();
  renderComparisonTable();
});

function selectArch(btn) {
  document.querySelectorAll('.arch-btn').forEach(b => {
    b.classList.remove('bg-blue-600', 'text-white', 'border-blue-500');
    b.classList.add('bg-gray-800', 'border-gray-700/50');
  });
  btn.classList.remove('bg-gray-800', 'border-gray-700/50');
  btn.classList.add('bg-blue-600', 'text-white', 'border-blue-500');
  selectedArch = btn.dataset.arch;
}

/**
 * Advanced Power/Area Analytical Estimator Engine
 * Formulates real physical parameters based on traditional semiconductor scaling profiles
 */
function calculatePPA(goal, nodeValue, cores, freq) {
  const n = parseFloat(nodeValue); // e.g., 3, 5, 7, 10
  
  // Base Transistor parameters reference normalized to a single generic processing block
  // Vdd operating voltage voltage scaling profile per node selection rules
  let vdd = 0.75; 
  if (n === 10) vdd = 0.95;
  else if (n === 7) vdd = 0.85;
  else if (n === 5) vdd = 0.75;
  else if (n === 3) vdd = 0.68;

  // Standard architectural adjustments
  let baseCapacitanceFactor = 0.045; // Farads proxy per core scalar
  let activityFactor = 0.25; // Alpha parameter tracking active gate toggles
  
  if (goal === "performance" || goal === "ai") activityFactor = 0.40;
  if (goal === "power") activityFactor = 0.12;

  // 1. Dynamic Switching Power Formula: P = Alpha * C * V^2 * f
  let dynamicPowerPerCore = activityFactor * baseCapacitanceFactor * Math.pow(vdd, 2) * freq;
  let dynamicPowerTotal = dynamicPowerPerCore * cores;

  // 2. Leakage (Static) Power calculation with respect to thermal/process factors
  let baseLeakagePerCore = 0.025; // Watts baseline
  // Older process nodes leak more absolute current; smaller sub-5nm nodes suffer channel leakage phenomena
  let leakageFactor = (12 - n) * 0.45;
  let staticPowerTotal = baseLeakagePerCore * leakageFactor * cores;
  
  if (goal === "power") staticPowerTotal *= 0.5; // Power gated configuration profile

  let totalPower = dynamicPowerTotal + staticPowerTotal;

  // 3. Physical Silicon Die Area Formulation (Base technology unit mapped to mm^2 layout frames)
  // Scaling rules map quadratically following traditional node shrink metrics
  let areaFactorPerCore = 1.15; // normalized area constant
  if (selectedArch === "gpu") areaFactorPerCore = 1.85;
  if (selectedArch === "asic") areaFactorPerCore = 0.65;

  // Scaling Factor approximation formula relative to 10nm baseline floor
  let scalingFactorNode = Math.pow((n / 10), 2);
  let coreAreaTotal = cores * areaFactorPerCore * scalingFactorNode;
  
  // Un-core/Peripheral baseline infrastructure addition (Memory Controllers, Crossbar Bus, NOC Area)
  let uncoreArea = 22.5 * scalingFactorNode;
  let totalArea = coreAreaTotal + uncoreArea;

  // 4. TOPS Performance Score metrics mapped out mathematically
  let topsPerGHzPerCore = 0.5;
  if (selectedArch === "npu") topsPerGHzPerCore = 2.5; // Highly optimized MAC matrix array dense configuration
  if (selectedArch === "gpu") topsPerGHzPerCore = 1.2;
  
  let totalTops = cores * freq * topsPerGHzPerCore;
  if (goal === "power") totalTops *= 0.85; // Under-volted pipeline logic tracking adjustments

  // Calculate efficiency coefficient profiles
  let topsPerWatt = totalTops / totalPower;

  return {
    power: totalPower.toFixed(2),
    dynamicPower: dynamicPowerTotal.toFixed(2),
    staticPower: staticPowerTotal.toFixed(2),
    area: totalArea.toFixed(2),
    uncoreArea: uncoreArea.toFixed(2),
    coreArea: coreAreaTotal.toFixed(2),
    tops: totalTops.toFixed(1),
    efficiency: topsPerWatt.toFixed(2),
    vdd: vdd
  };
}

function generateDesign() {
  const name = escapeHTML(
    document.getElementById('projectName').value.trim() || 'Unnamed_Design'
  );

  const goal = document.getElementById('goal').value;
  const node = document.getElementById('node').value;
  const cores = parseInt(document.getElementById('cores').value);
  const freq = parseFloat(document.getElementById('frequency').value);

  const ppa = calculatePPA(goal, node, cores, freq);

  let title = "";
  let description = "";

  switch(goal) {
    case "performance":
      title = "High-Performance Compute Accelerator";
      description = `Max-throughput microarchitecture implementation targeting extreme workloads on an advanced ${node}nm layout stack.`;
      break;
    case "power":
      title = "Ultra-Low Power Edge Silicon";
      description = `Aggressively power-gated, sub-watt runtime tracking logic targeting long-endurance remote deployments.`;
      break;
    case "ai":
      title = "Dense Systolic Tensor Network Array";
      description = `Massively parallel matrix processing engine optimized for multi-billion parameter model evaluation parameters.`;
      break;
    case "mobile":
      title = "Heterogeneous Mobile Core SoC";
      description = `Balanced efficiency floorplan featuring asymmetrical power domains for smart device profiles.`;
      break;
    default:
      title = "Balanced General-Purpose AI Processor";
      description = `Adaptable, uniform compute matrix balance profile suited for assorted inference execution runtimes.`;
  }

  activeDesignData = {
    id: 'proj_' + Date.now(),
    name: name,
    title: title,
    description: description,
    goal: goal,
    node: node,
    cores: cores,
    frequency: freq,
    architecture: selectedArch.toUpperCase(),
    metrics: ppa
  };

  renderDesignOutput();
  setTimeout(() => drawCircuitDiagram(cores, selectedArch), 50);
}

function renderDesignOutput() {
  if (!activeDesignData) return;

  const d = activeDesignData;
  const m = d.metrics;

  // Normalized scoring profiles for GUI progress bar representations
  let perfScore = Math.min(100, Math.round(m.tops / 4));
  let powerScore = Math.min(100, Math.round(100 - (m.power * 1.5)));
  if (powerScore < 5) powerScore = 12; // visual lower bounds constraint
  let areaScore = Math.min(100, Math.round(100 - (m.area / 3)));
  if (areaScore < 5) areaScore = 19;

  const html = `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs uppercase tracking-wider bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-md font-mono border border-blue-500/20">${d.architecture} Block Variant</span>
            <span class="text-xs uppercase tracking-wider bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-md font-mono border border-purple-500/20">${d.frequency.toFixed(2)} GHz</span>
          </div>
          <h2 class="text-2xl lg:text-3xl font-bold text-white tracking-tight">${d.title} <span class="text-gray-500 font-mono text-lg font-normal">(${d.name})</span></h2>
          <p class="text-gray-400 text-sm mt-1 max-w-2xl">${d.description}</p>
        </div>
        <div class="bg-gray-800/80 border border-gray-700 rounded-2xl p-3 text-center min-w-[100px] shadow-inner font-mono">
          <div class="text-[10px] text-gray-500 uppercase tracking-wider">Process Node</div>
          <div class="text-xl font-bold text-blue-400">${d.node}nm</div>
          <div class="text-[9px] text-gray-400 mt-0.5">${m.vdd}V Core Vdd</div>
        </div>
      </div>

      <div class="bg-gray-950 border border-gray-800 rounded-2xl p-4 flex flex-col items-center">
        <div class="w-full flex justify-between items-center text-xs text-gray-500 font-mono mb-2 px-1">
          <span><i class="fas fa-project-diagram mr-1"></i> Dynamically Generated Floorplan Layout Blueprint</span>
          <span class="text-blue-400">${d.cores} Core Modules mapped</span>
        </div>
        <canvas id="circuitCanvas" width="600" height="240" class="w-full bg-gray-950 rounded-xl border border-gray-900/60 shadow-inner"></canvas>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div class="bg-gray-800/30 border border-gray-800/80 rounded-2xl p-4 relative overflow-hidden group hover:border-gray-700 transition">
          <div class="text-xs text-gray-400 uppercase tracking-wider mb-1">Calculated Power (TDP)</div>
          <div class="text-3xl font-bold text-cyan-400">${m.power}<span class="text-xs text-gray-500 font-normal ml-0.5">W</span></div>
          <div class="text-[10px] text-gray-500 mt-2 space-y-0.5">
            <div>Dyn: ${m.dynamicPower}W <span class="text-[9px] text-gray-600">(&alpha;&middot;C&middot;V²&middot;f)</span></div>
            <div>Stat: ${m.staticPower}W <span class="text-[9px] text-gray-600">(Leakage Factor)</span></div>
          </div>
        </div>
        <div class="bg-gray-800/30 border border-gray-800/80 rounded-2xl p-4 relative overflow-hidden group hover:border-gray-700 transition">
          <div class="text-xs text-gray-400 uppercase tracking-wider mb-1">Estimated Die Area</div>
          <div class="text-3xl font-bold text-amber-400">${m.area}<span class="text-xs text-gray-500 font-normal ml-0.5">mm²</span></div>
          <div class="text-[10px] text-gray-500 mt-2 space-y-0.5">
            <div>Cores: ${m.coreArea}mm² <span class="text-[9px] text-gray-600">(Gate Footprint)</span></div>
            <div>Uncore: ${m.uncoreArea}mm² <span class="text-[9px] text-gray-600">(NOC + Interconnect)</span></div>
          </div>
        </div>
        <div class="bg-gray-800/30 border border-gray-800/80 rounded-2xl p-4 relative overflow-hidden group hover:border-gray-700 transition">
          <div class="text-xs text-gray-400 uppercase tracking-wider mb-1">Synthesized Throughput</div>
          <div class="text-3xl font-bold text-purple-400">${m.tops}<span class="text-xs text-gray-500 font-normal ml-0.5">TOPS</span></div>
          <div class="text-[10px] text-gray-500 mt-2 space-y-0.5">
            <div class="text-emerald-400 font-bold">Efficiency: ${m.efficiency} TOPS/W</div>
            <div class="text-[9px] text-gray-600">Density Scaled Inference Engine</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-800/20 border border-gray-800 p-4 rounded-2xl">
        <div>
          <div class="flex justify-between text-xs font-medium mb-1.5"><span class="text-gray-400">Compute Index</span><span class="text-gray-200 font-mono">${perfScore}/100</span></div>
          <div class="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div class="bar h-full bg-gradient-to-r from-blue-500 to-purple-500" style="width: ${perfScore}%"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between text-xs font-medium mb-1.5"><span class="text-gray-400">Thermal Safety Buffer</span><span class="text-gray-200 font-mono">${powerScore}/100</span></div>
          <div class="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div class="bar h-full bg-gradient-to-r from-emerald-400 to-cyan-500" style="width: ${powerScore}%"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between text-xs font-medium mb-1.5"><span class="text-gray-400">Wafer Allocation Score</span><span class="text-gray-200 font-mono">${areaScore}/100</span></div>
          <div class="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div class="bar h-full bg-gradient-to-r from-amber-400 to-orange-500" style="width: ${areaScore}%"></div>
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 pt-2">
        <button onclick="exportDesignToJSON()" class="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium py-3.5 px-4 rounded-xl transition border border-gray-700 text-sm flex items-center justify-center gap-2">
          <i class="fas fa-file-code"></i> Export Design JSON
        </button>
        <button onclick="saveActiveProject()" class="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3.5 px-4 rounded-xl transition shadow-md shadow-pink-900/10 text-sm flex items-center justify-center gap-2">
          <i class="fas fa-cloud-upload-alt"></i> Commit to Local Project Vault
        </button>
      </div>
    </div>
  `;

  document.getElementById('welcome').style.display = 'none';

  const outNode = document.getElementById('designResults');
  outNode.replaceChildren();

  const wrapper = document.createElement("div");
  wrapper.innerHTML = html; // static template only
  outNode.appendChild(wrapper);

  outNode.classList.remove('hidden');
}

/**
 * Procedural Dynamic Circuit / Silicon Floorplan Modeler
 */
function drawCircuitDiagram(cores, architecture) {
  const canvas = document.getElementById('circuitCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Clean canvas area
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Set structural context parameters
  const w = canvas.width;
  const h = canvas.height;
  
  // Draw Background Grid
  ctx.strokeStyle = '#111827';
  ctx.lineWidth = 1;
  const gridSize = 20;
  for(let x=0; x<w; x+=gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for(let y=0; y<h; y+=gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  // Draw Shared L3 Cache / NOC Bus Ring Border Box
  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = 2;
  ctx.fillStyle = '#030712';
  ctx.fillRect(40, 30, w - 80, h - 60);
  ctx.strokeRect(40, 30, w - 80, h - 60);

  // Core drawing optimization boundary
  // Max out visible representations inside bounds nicely grid mapped
  let drawCores = Math.min(cores, 32); 
  let cols = 8;
  let rows = Math.ceil(drawCores / cols);
  
  let paddingX = 15;
  let paddingY = 12;
  let startX = 60;
  let startY = 45;
  let availableWidth = w - 120 - (cols - 1) * paddingX;
  let availableHeight = h - 110 - (rows - 1) * paddingY;
  
  let coreW = Math.max(30, availableWidth / cols);
  let coreH = Math.max(22, availableHeight / rows);

  // Core Matrix Rendering Loop
  for (let i = 0; i < drawCores; i++) {
    let r = Math.floor(i / cols);
    let c = i % cols;
    let cx = startX + c * (coreW + paddingX);
    let cy = startY + r * (coreH + paddingY);

    // Accent variations per structural specification selections
    let coreColor = '#2563eb'; // NPU Royal Blue
    if (architecture === "cpu") coreColor = '#3b82f6';
    if (architecture === "gpu") coreColor = '#9333ea';
    if (architecture === "asic") coreColor = '#db2777';

    // Core body render
    ctx.fillStyle = 'rgba(17, 24, 39, 0.85)';
    ctx.strokeStyle = coreColor;
    ctx.lineWidth = 1.5;
    ctx.fillRect(cx, cy, coreW, coreH);
    ctx.strokeRect(cx, cy, coreW, coreH);

    // Internal execution line visualization
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(cx + coreW*0.3, cy); ctx.lineTo(cx + coreW*0.3, cy + coreH);
    ctx.moveTo(cx + coreW*0.6, cy); ctx.lineTo(cx + coreW*0.6, cy + coreH);
    ctx.stroke();

    // Signal Core label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '8px monospace';
    ctx.fillText(`C${i}`, cx + 4, cy + 12);
  }

  // Draw Shared L3 System Cache Block Strip at the Bottom base
  ctx.fillStyle = 'rgba(31, 41, 55, 0.5)';
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 1.5;
  ctx.fillRect(60, h - 55, w - 120, 16);
  ctx.strokeRect(60, h - 55, w - 120, 16);
  
  ctx.fillStyle = '#eab308';
  ctx.font = '9px monospace';
  ctx.fillText("UNIFIED INTERCONNECT BUS & SHARED HIGH-SPEED L3 CACHE SYSTEM", 140, h - 44);

  // Trace Ring Bus Peripheral Channels (Data Routing Overlay Paths)
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  // Outer peripheral line tracks
  ctx.strokeRect(48, 36, w - 96, h - 72);
  ctx.stroke();

  if(cores > 32) {
    ctx.fillStyle = 'rgba(168, 85, 247, 0.9)';
    ctx.font = '10px sans-serif';
    ctx.fillText(`+ ${cores - 32} Additional Core Modules Clusterized Off-Screen Layer`, 130, h - 68);
  }
}

/**
 * Storage Vault & Structural Comparison Manager Routines
 */
function getStoredProjects() {
  const data = localStorage.getItem('neuralforge_projects');
  return data ? JSON.parse(data) : [];
}

function getComparisonList() {
  const data = localStorage.getItem('neuralforge_comparison');
  return data ? JSON.parse(data) : [];
}

function saveActiveProject() {
  if (!activeDesignData) return;

  // Save to Project History Vault
  let projects = getStoredProjects();
  // Avoid duplicating names inside the storage array
  projects = projects.filter(p => p.name !== activeDesignData.name);
  projects.unshift(activeDesignData);
  localStorage.setItem('neuralforge_projects', JSON.stringify(projects));

  // Auto-append tracking dataset variant to visual Comparison workspace list array
  let compareList = getComparisonList();
  compareList = compareList.filter(c => c.name !== activeDesignData.name);
  compareList.push(activeDesignData);
  localStorage.setItem('neuralforge_comparison', JSON.stringify(compareList));

  // Trigger UI Flash Confirmation Sync Updates
  renderSavedProjectsList();
  renderComparisonTable();

  const status = document.getElementById('storageStatus');
  status.innerText = "Project Saved Successfully!";
  status.className = "text-xs text-purple-400 font-mono animate-bounce";
  setTimeout(() => {
    status.innerText = "LocalStorage Synced";
    status.className = "text-xs text-emerald-400 font-mono";
  }, 2500);
}

function deleteProject(id, event) {
  if(event) event.stopPropagation();
  let projects = getStoredProjects();
  projects = projects.filter(p => p.id !== id);
  localStorage.setItem('neuralforge_projects', JSON.stringify(projects));
  renderSavedProjectsList();
}

function loadSavedProject(id) {
  const projects = getStoredProjects();
  const found = projects.find(p => p.id === id);
  if (found) {
    // Rehydrate control UI states parameter configurations
    document.getElementById('projectName').value = found.name;
    document.getElementById('goal').value = found.goal;
    document.getElementById('node').value = found.node;
    document.getElementById('cores').value = found.cores;
    document.getElementById('coreValue').innerText = found.cores + " Cores";
    if(found.frequency) {
        document.getElementById('frequency').value = found.frequency;
        document.getElementById('freqValue').innerText = found.frequency.toFixed(2) + " GHz";
    }

    // Restore chosen architecture selection styles
    const targetBtn = document.querySelector(`[data-arch="${found.architecture.toLowerCase()}"]`);
    if(targetBtn) selectArch(targetBtn);

    activeDesignData = found;
    renderDesignOutput();
    setTimeout(() => drawCircuitDiagram(found.cores, found.architecture.toLowerCase()), 50);
  }
}

function renderSavedProjectsList() {
  const projects = getStoredProjects();
  const container = document.getElementById('savedProjectsList');
  document.getElementById('savedCount').innerText = projects.length;

  if (projects.length === 0) {
    container.innerHTML = `<p class="text-gray-500 italic text-center py-4">No chips saved in vault yet.</p>`;
    return;
  }

  container.innerHTML = "";

  projects.forEach(p => {
    const card = document.createElement("div");

    card.className =
      "bg-gray-800/40 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 p-2.5 rounded-xl cursor-pointer flex justify-between items-center transition group";

    card.onclick = () => loadSavedProject(p.id);

    const left = document.createElement("div");
    left.className = "truncate mr-2";

    const title = document.createElement("div");
    title.className =
      "font-mono font-bold text-gray-200 text-xs truncate";
    title.textContent = p.name;

    const meta = document.createElement("div");
    meta.className =
      "text-[10px] text-gray-400 truncate";
    meta.textContent =
      `${p.architecture} • ${p.node}nm • ${p.cores} Cores`;

    left.appendChild(title);
    left.appendChild(meta);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "text-gray-500 hover:text-red-400 p-1 rounded opacity-0 group-hover:opacity-100 transition duration-150";
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.onclick = (event) => deleteProject(p.id, event);

    card.appendChild(left);
    card.appendChild(deleteBtn);

    container.appendChild(card);
  });
}

function renderComparisonTable() {
  const list = getComparisonList();
  const tbody = document.getElementById('comparisonBody');

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="p-4 text-center text-gray-500 italic font-sans">No variants staged for comparison matrix yet. Click Save Design below to append configurations.</td>
      </tr>`;
    return;
  }

  tbody.innerHTML = "";

  list.forEach(c => {
    const row = document.createElement("tr");
    row.className = "hover:bg-gray-900/40 border-b border-gray-900 transition";

    row.innerHTML = `
      <td class="p-3 font-sans font-semibold text-white"></td>
      <td class="p-3 text-blue-400"></td>
      <td class="p-3 text-gray-400"></td>
      <td class="p-3 font-bold text-cyan-400"></td>
      <td class="p-3 text-amber-400"></td>
      <td class="p-3 text-purple-400"></td>
      <td class="p-3 text-emerald-400"></td>
    `;

    row.children[0].textContent = c.name;
    row.children[1].textContent = `${c.node}nm`;
    row.children[2].textContent = c.frequency ? `${c.frequency.toFixed(2)} GHz` : "2.50 GHz";
    row.children[3].textContent = `${c.metrics.power} W`;
    row.children[4].textContent = `${c.metrics.area} mm²`;
    row.children[5].textContent = `${c.metrics.tops} TOPS`;
    row.children[6].textContent = `${c.metrics.efficiency} T/W`;

    tbody.appendChild(row);
  });
}

function clearComparison() {
  localStorage.setItem('neuralforge_comparison', JSON.stringify([]));
  renderComparisonTable();
}

function exportDesignToJSON() {
  if (!activeDesignData) return;
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeDesignData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `${activeDesignData.name}_neuralforge_manifest.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
