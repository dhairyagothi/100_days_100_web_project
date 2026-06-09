let currentIncident = null;

function createIncident() {
  const title = document.getElementById("incidentTitle").value;
  const severity = document.getElementById("severity").value;

  if (!title) return alert("Enter incident title");

  currentIncident = {
    title,
    severity,
    status: "Investigating",
    updates: []
  };

  renderPublicStatus();
}

function renderPublicStatus() {
  const container = document.getElementById("publicStatus");
  container.innerHTML = "";

  if (!currentIncident) return;

  const div = document.createElement("div");
  div.className = "status-card " + currentIncident.severity;
  div.textContent =
    `${currentIncident.title} - ${currentIncident.status} (${currentIncident.severity})`;

  container.appendChild(div);
}

function postUpdate() {
  if (!currentIncident) return alert("Create incident first");

  const text = document.getElementById("updateText").value;
  if (!text) return;

  const timestamp = new Date().toLocaleTimeString();

  currentIncident.updates.unshift({
    text,
    time: timestamp
  });

  document.getElementById("updateText").value = "";

  if (text.toLowerCase().includes("resolved"))
    currentIncident.status = "Resolved";

  renderPublicStatus();
  renderTimeline();
}

function renderTimeline() {
  const container = document.getElementById("timeline");
  container.innerHTML = "";

  currentIncident.updates.forEach(update => {
    const div = document.createElement("div");
    div.className = "timeline-entry";
    div.innerHTML = `<strong>${update.time}</strong><br>${update.text}`;
    container.appendChild(div);
  });
}