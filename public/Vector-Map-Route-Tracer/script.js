console.log("Pathfinder OS Initialized");

/* ──────────────────────────────
   CITY GRAPH DATA
────────────────────────────── */

const cities = {
  DEL: { name: "Delhi", x: 380, y: 120 },
  AMR: { name: "Amritsar", x: 180, y: 90 },
  JAI: { name: "Jaipur", x: 260, y: 240 },
  LKO: { name: "Lucknow", x: 520, y: 180 },
  PAT: { name: "Patna", x: 700, y: 200 },
  KOL: { name: "Kolkata", x: 780, y: 420 },
  BHO: { name: "Bhopal", x: 380, y: 430 },
  NGP: { name: "Nagpur", x: 520, y: 520 },
  HYD: { name: "Hyderabad", x: 500, y: 720 },
  MUM: { name: "Mumbai", x: 220, y: 620 },
  PUN: { name: "Pune", x: 340, y: 760 },
  BAN: { name: "Bengaluru", x: 430, y: 920 },
  CHE: { name: "Chennai", x: 640, y: 960 },
  VIZ: { name: "Vizag", x: 720, y: 660 },
  AHM: { name: "Ahmedabad", x: 110, y: 520 },
  SUR: { name: "Surat", x: 160, y: 700 }
};

const graph = {
  DEL: { AMR: 450, JAI: 280, LKO: 500, BHO: 580 },
  AMR: { DEL: 450, JAI: 550 },
  JAI: { DEL: 280, AMR: 550, BHO: 480, AHM: 520 },
  LKO: { DEL: 500, PAT: 420, KOL: 900 },
  PAT: { LKO: 420, KOL: 530 },
  KOL: { PAT: 530, VIZ: 680, NGP: 720, LKO: 900 },
  BHO: { DEL: 580, JAI: 480, NGP: 350, MUM: 650 },
  NGP: { BHO: 350, KOL: 720, VIZ: 620, HYD: 500 },
  HYD: { NGP: 500, VIZ: 420, BAN: 380, PUN: 560 },
  MUM: { BHO: 650, SUR: 260, PUN: 150 },
  PUN: { MUM: 150, HYD: 560, BAN: 840 },
  BAN: { HYD: 380, PUN: 840, CHE: 350 },
  CHE: { BAN: 350, VIZ: 800 },
  VIZ: { HYD: 420, NGP: 620, CHE: 800, KOL: 680 },
  AHM: { JAI: 520, SUR: 330 },
  SUR: { AHM: 330, MUM: 260 }
};

/* ──────────────────────────────
   GLOBAL STATE
────────────────────────────── */

let source = null;
let destination = null;
let currentAlgorithm = "dijkstra";
let currentPath = [];

/* ──────────────────────────────
   DOM REFERENCES
────────────────────────────── */

const cityList = document.getElementById("city-list");
const nodesLayer = document.getElementById("nodes-layer");
const edgesLayer = document.getElementById("edges-layer");

const distEl = document.getElementById("m-dist");
const nodesEl = document.getElementById("m-nodes");
const edgesEl = document.getElementById("m-edges");
const timeEl = document.getElementById("m-time");
const pathEl = document.getElementById("path-seq");

const statusEl = document.getElementById("algo-status");

/* ──────────────────────────────
   CREATE CITY LIST
────────────────────────────── */

function renderCityList() {

  cityList.innerHTML = "";

  Object.keys(cities).forEach(code => {

    const div = document.createElement("div");

    div.className = "city-item";

    div.dataset.code = code;

    div.innerHTML = `
      ${cities[code].name}
    `;

    div.onclick = () => selectCity(code);

    cityList.appendChild(div);
  });
}

/* ──────────────────────────────
   DRAW EDGES
────────────────────────────── */

function drawEdges() {

  edgesLayer.innerHTML = "";

  Object.keys(graph).forEach(from => {

    Object.keys(graph[from]).forEach(to => {

      if (from < to) {

        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );

        line.setAttribute("x1", cities[from].x);
        line.setAttribute("y1", cities[from].y);

        line.setAttribute("x2", cities[to].x);
        line.setAttribute("y2", cities[to].y);

        line.setAttribute("class", "edge");

        line.dataset.from = from;
        line.dataset.to = to;

        edgesLayer.appendChild(line);

        /* DISTANCE LABEL */

        const midX = (cities[from].x + cities[to].x) / 2;
        const midY = (cities[from].y + cities[to].y) / 2;

        const text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );

        text.setAttribute("x", midX);
        text.setAttribute("y", midY);

        text.setAttribute("fill", "#335");

        text.setAttribute("font-size", "12");

        text.textContent = `${graph[from][to]}km`;

        edgesLayer.appendChild(text);
      }
    });
  });
}

/* ──────────────────────────────
   DRAW NODES
────────────────────────────── */

function drawNodes() {

  nodesLayer.innerHTML = "";

  Object.keys(cities).forEach(code => {

    const g = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );

    g.setAttribute("class", "node-group");

    g.setAttribute(
      "transform",
      `translate(${cities[code].x}, ${cities[code].y})`
    );

    /* OUTER */

    const outer = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

    outer.setAttribute("r", 26);

    outer.setAttribute("fill", "transparent");

    outer.setAttribute("stroke", "#00e5ff");

    outer.setAttribute("stroke-width", "2");

    /* INNER */

    const inner = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

    inner.setAttribute("r", 14);

    inner.setAttribute("fill", "#07101d");

    inner.setAttribute("stroke", "#00e5ff");

    inner.setAttribute("stroke-width", "2");

    /* CODE */

    const label = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );

    label.setAttribute("text-anchor", "middle");

    label.setAttribute("dy", "5");

    label.setAttribute("fill", "#00e5ff");

    label.setAttribute("font-size", "12");

    label.textContent = code;

    /* CITY NAME */

    const cityName = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );

    cityName.setAttribute("text-anchor", "middle");

    cityName.setAttribute("y", "45");

    cityName.setAttribute("fill", "#88a");

    cityName.setAttribute("font-size", "14");

    cityName.textContent = cities[code].name;

    g.appendChild(outer);
    g.appendChild(inner);
    g.appendChild(label);
    g.appendChild(cityName);

    nodesLayer.appendChild(g);
  });
}

/* ──────────────────────────────
   CITY SELECTION
────────────────────────────── */

function selectCity(code) {

  if (!source) {

    source = code;

    updateStatus(`SOURCE SELECTED: ${cities[code].name}`);

  } else if (!destination && code !== source) {

    destination = code;

    updateStatus(`DESTINATION SELECTED: ${cities[code].name}`);

    computeAndAnimate();

  } else {

    resetAll();

    source = code;

    updateStatus(`SOURCE RESET: ${cities[code].name}`);
  }

  updateCityUI();
}

/* ──────────────────────────────
   UPDATE CITY UI
────────────────────────────── */

function updateCityUI() {

  document.querySelectorAll(".city-item")
    .forEach(item => {

      item.classList.remove(
        "source",
        "dest",
        "on-path"
      );

      const code = item.dataset.code;

      if (code === source)
        item.classList.add("source");

      if (code === destination)
        item.classList.add("dest");

      if (currentPath.includes(code))
        item.classList.add("on-path");
    });
}

/* ──────────────────────────────
   DIJKSTRA
────────────────────────────── */

function dijkstra(start, end) {

  const distances = {};
  const previous = {};
  const visited = new Set();

  Object.keys(graph).forEach(node => {
    distances[node] = Infinity;
  });

  distances[start] = 0;

  while (visited.size < Object.keys(graph).length) {

    let current = null;

    Object.keys(distances).forEach(node => {

      if (
        !visited.has(node) &&
        (
          current === null ||
          distances[node] < distances[current]
        )
      ) {
        current = node;
      }
    });

    if (current === end) break;

    visited.add(current);

    Object.keys(graph[current]).forEach(neighbor => {

      const alt =
        distances[current] +
        graph[current][neighbor];

      if (alt < distances[neighbor]) {

        distances[neighbor] = alt;

        previous[neighbor] = current;
      }
    });
  }

  const path = [];

  let u = end;

  while (u) {

    path.unshift(u);

    u = previous[u];
  }

  return {
    path,
    distance: distances[end],
    visited: visited.size
  };
}

/* ──────────────────────────────
   COMPUTE PATH
────────────────────────────── */

function computeAndAnimate() {

  const startTime = performance.now();

  let result = dijkstra(source, destination);

  currentPath = result.path;

  document.getElementById("map-container")
    .scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  highlightPath();

  const endTime = performance.now();

  distEl.textContent =
    `${result.distance} km`;

  nodesEl.textContent =
    result.visited;

  edgesEl.textContent =
    result.path.length - 1;

  timeEl.textContent =
    `${(endTime - startTime).toFixed(2)} ms`;

  pathEl.textContent =
    result.path
      .map(code => cities[code].name)
      .join(" → ");

  updateCityUI();

  updateStatus("ROUTE GENERATED SUCCESSFULLY");
}

/* ──────────────────────────────
   HIGHLIGHT PATH
────────────────────────────── */

function highlightPath() {

  document.querySelectorAll(".edge")
    .forEach(edge => {

      edge.classList.remove("on-path");

      const from = edge.dataset.from;
      const to = edge.dataset.to;

      for (let i = 0; i < currentPath.length - 1; i++) {

        const a = currentPath[i];
        const b = currentPath[i + 1];

        if (
          (a === from && b === to) ||
          (a === to && b === from)
        ) {

          edge.classList.add("on-path");
        }
      }
    });
}

/* ──────────────────────────────
   RESET
────────────────────────────── */

function resetAll(){

source = null;
destination = null;

currentPath = [];

document.querySelectorAll(".edge")
.forEach(edge=>{
edge.classList.remove("on-path");
});

distEl.textContent = "—";
nodesEl.textContent = "—";
edgesEl.textContent = "—";
timeEl.textContent = "—";

pathEl.textContent =
"Select source and destination...";

updateCityUI();

updateStatus("SYSTEM RESET SUCCESSFULLY");

document.getElementById("map-container")
.scrollTo({
top:0,
behavior:"smooth"
});

}

/* ──────────────────────────────
   STATUS
────────────────────────────── */

function updateStatus(message) {

  statusEl.textContent = message;
}

/* ──────────────────────────────
   ALGORITHM BUTTONS
────────────────────────────── */

document.querySelectorAll(".algo-btn")
  .forEach(btn => {

    btn.onclick = () => {

      document.querySelectorAll(".algo-btn")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");

      currentAlgorithm = btn.dataset.algo;

      updateStatus(
        `${currentAlgorithm.toUpperCase()} MODE ACTIVATED`
      );
    };
  });

/* ──────────────────────────────
   INITIALIZE
────────────────────────────── */

renderCityList();

drawEdges();

drawNodes();

updateStatus("READY");