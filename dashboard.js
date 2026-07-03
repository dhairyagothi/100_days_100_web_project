function updateProgressDashboard() {
  const completed = getCompletedProjects().length;
  const total = PROJECTS.length || 218;

  const percent = Math.round((completed / total) * 100);

  const progressBar =
    document.getElementById("progressBar");

  const progressText =
    document.getElementById("progressText");

  if (progressBar) {
    progressBar.style.width = percent + "%";
  }

  if (progressText) {
    progressText.textContent =
      `${completed} / ${total} completed (${percent}%)`;
  }

  const badges =
    document.getElementById("achievementBadges");

  if (!badges) return;

  let html = "";

  if (completed >= 10)
    html += "<span>🏅 10 Projects</span>";

  if (completed >= 25)
    html += "<span>🥈 25 Projects</span>";

  if (completed >= 50)
    html += "<span>🥇 50 Projects</span>";

  if (completed >= 100)
    html += "<span>🏆 100 Projects</span>";

  badges.innerHTML = html;
}