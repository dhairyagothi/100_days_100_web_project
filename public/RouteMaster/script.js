// Index.html related JS
// Sidebar active state
document.querySelectorAll(".sidebar-item").forEach((item) => {
  item.addEventListener("click", function () {
    document
      .querySelectorAll(".sidebar-item")
      .forEach((i) => i.classList.remove("active"));
    this.classList.add("active");
  });
});
// Search suggestions
document.querySelectorAll(".suggestion-chip").forEach((chip) => {
  chip.addEventListener("click", function () {
    document.getElementById("searchInput").value = this.textContent.trim();
  });
});

// Map.html related JS
// Simulate search navigation
function navigate() {
  const val = document.getElementById("searchInput").value;
  if (val) window.location.href = "navigation.html";
}

let zoom = 1,
  zoomLevel = 14;
const svg = document.getElementById("mapSvg");
document.getElementById("zoomIn").onclick = () => {
  zoom = Math.min(zoom + 0.15, 2.2);
  zoomLevel++;
  svg.style.transform = `scale(${zoom})`;
  document.getElementById("zoomVal").textContent = zoomLevel;
};
document.getElementById("zoomOut").onclick = () => {
  zoom = Math.max(zoom - 0.15, 0.6);
  zoomLevel--;
  svg.style.transform = `scale(${zoom})`;
  document.getElementById("zoomVal").textContent = zoomLevel;
};
function toggleChip(el) {
  el.classList.toggle("on");
  el.classList.toggle("off");
}
function selectPOI(el) {
  if (typeof el === "string") return;
  document
    .querySelectorAll(".poi-item")
    .forEach((i) => i.classList.remove("selected"));
  el.classList.add("selected");
}
document.getElementById("themeBtn").onclick = function () {
  document.body.style.filter =
    document.body.style.filter === "invert(0.9) hue-rotate(180deg)"
      ? ""
      : "invert(0.9) hue-rotate(180deg)";
};

// Navigation.html related JS
// Simulate navigation progress and step changes
let started = false;
let currentStep = 2;
const totalSteps = 6;

const startBtn = document.getElementById("startBtn");
const startLabel = document.getElementById("startLabel");
const stepNum = document.getElementById("stepNum");

startBtn.addEventListener("click", function () {
  started = !started;
  if (started) {
    startBtn.classList.add("started");
    startLabel.textContent = "Stop Navigation";
    startBtn.querySelector("i").className = "fas fa-stop";
    // Simulate progress
    let p = 35;
    const pFill = document.querySelector(".progress-fill");
    const interval = setInterval(() => {
      p = Math.min(p + 0.5, 100);
      pFill.style.width = p + "%";
      if (p >= 100) clearInterval(interval);
    }, 100);
  } else {
    startBtn.classList.remove("started");
    startLabel.textContent = "Start Navigation";
    startBtn.querySelector("i").className = "fas fa-location-arrow";
  }
});

document.getElementById("nextBtn").addEventListener("click", function () {
  if (currentStep < totalSteps) {
    currentStep++;
    stepNum.textContent = currentStep;
    updateSteps();
  }
});

document.getElementById("prevBtn").addEventListener("click", function () {
  if (currentStep > 1) {
    currentStep--;
    stepNum.textContent = currentStep;
    updateSteps();
  }
});

function updateSteps() {
  const steps = document.querySelectorAll(".step-item");
  const pct = Math.round((currentStep / totalSteps) * 100);
  document.querySelector(".progress-fill").style.width = pct + "%";
  document.querySelector(".progress-label span:last-child").textContent =
    pct + "% complete";
  document.querySelector(".progress-label span:first-child").textContent =
    `Step ${currentStep} of ${totalSteps}`;

  steps.forEach((step, i) => {
    step.classList.remove("done", "active");
    if (i < currentStep - 1) step.classList.add("done");
    else if (i === currentStep - 1) step.classList.add("active");

    const dot = step.querySelector(".step-dot");
    dot.classList.remove("done", "active", "pending");
    const conn = step.querySelector(".step-connector");

    if (i < currentStep - 1) {
      dot.classList.add("done");
      dot.innerHTML = '<i class="fas fa-check"></i>';
      if (conn) conn.classList.add("filled");
    } else if (i === currentStep - 1) {
      dot.classList.add("active");
      if (conn) conn.classList.add("filled");
    } else {
      dot.classList.add("pending");
      if (conn) conn.classList.remove("filled");
    }
  });
}
