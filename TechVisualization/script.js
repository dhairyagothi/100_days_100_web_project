const projects = [
  { name: "Portfolio Website",        tech: "HTML/CSS/JS" },
  { name: "Todo App",                 tech: "React" },
  { name: "Weather App",              tech: "JavaScript" },
  { name: "Blog Platform",            tech: "Node.js" },
  { name: "Data Dashboard",           tech: "React" },
  { name: "REST API Server",          tech: "Node.js" },
  { name: "ML Web App",               tech: "Flask" },
  { name: "TypeScript Calculator",    tech: "TypeScript" },
  { name: "Landing Page",             tech: "HTML/CSS/JS" },
  { name: "Chat Application",         tech: "Node.js" },
  { name: "E-Commerce UI",            tech: "React" },
  { name: "Image Classifier",         tech: "Flask" },
  { name: "Portfolio v2",             tech: "TypeScript" },
  { name: "Markdown Editor",          tech: "JavaScript" },
  { name: "Recipe Finder",            tech: "React" },
];

const techColors = {
  "HTML/CSS/JS": "#e34c26",
  "React":       "#61dafb",
  "JavaScript":  "#f7df1e",
  "Node.js":     "#68a063",
  "Flask":       "#ffffff",
  "TypeScript":  "#007acc",
};

function countTech() {
  const counts = {};
  projects.forEach(p => {
    counts[p.tech] = (counts[p.tech] || 0) + 1;
  });
  return counts;
}

function renderStats(counts) {
  const grid = document.getElementById("statsGrid");
  grid.innerHTML = `
    <div class="stat-card">
      <div class="count">${projects.length}</div>
      <div class="label">Total Projects</div>
    </div>`;
  Object.entries(counts).forEach(([tech, count]) => {
    grid.innerHTML += `
      <div class="stat-card">
        <div class="count" style="color:${techColors[tech] || '#00d4ff'}">${count}</div>
        <div class="label">${tech}</div>
      </div>`;
  });
}

function renderChart(counts) {
  const ctx = document.getElementById("techChart").getContext("2d");
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: Object.keys(counts),
      datasets: [{
        data: Object.values(counts),
        backgroundColor: Object.keys(counts).map(t => techColors[t] || "#888"),
        borderWidth: 2,
        borderColor: "#0f0f1a",
      }]
    },
    options: {
      plugins: {
        legend: { labels: { color: "#e0e0e0" } }
      }
    }
  });
}

function renderFilters(counts) {
  const container = document.getElementById("filterButtons");
  const allBtn = document.createElement("button");
  allBtn.className = "filter-btn active";
  allBtn.textContent = "All";
  allBtn.onclick = () => { renderProjects(); setActive(allBtn); };
  container.appendChild(allBtn);

  Object.keys(counts).forEach(tech => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.textContent = tech;
    btn.onclick = () => { renderProjects(tech); setActive(btn); };
    container.appendChild(btn);
  });
}

function setActive(activeBtn) {
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  activeBtn.classList.add("active");
}

function renderProjects(filter = null) {
  const list = document.getElementById("projectsList");
  const filtered = filter ? projects.filter(p => p.tech === filter) : projects;
  list.innerHTML = filtered.map(p => `
    <div class="project-card">
      <h3>${p.name}</h3>
      <span class="tech-badge" style="background:${techColors[p.tech] || '#333'};color:#0f0f1a">
        ${p.tech}
      </span>
    </div>`).join("");
}

const counts = countTech();
renderStats(counts);
renderChart(counts);
renderFilters(counts);
renderProjects();