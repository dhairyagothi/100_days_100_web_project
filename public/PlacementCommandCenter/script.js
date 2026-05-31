// ===============================
// DATE
// ===============================

document.getElementById("currentDate").textContent = new Date().toDateString();

// ===============================
// STORAGE KEYS
// ===============================

const COMPANY_KEY = "placementCompanies";
const CODING_KEY = "placementCoding";
const RESUME_KEY = "placementResume";
const GOAL_KEY = "placementGoal";
const ACTIVITY_KEY = "placementActivity";
const THEME_KEY = "placementTheme";

// ===============================
// THEME
// ===============================

const themeToggle = document.getElementById("themeToggle");

if (localStorage.getItem(THEME_KEY) === "dark") {
  document.body.classList.add("dark");
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  localStorage.setItem(
    THEME_KEY,
    document.body.classList.contains("dark") ? "dark" : "light",
  );
});

// ===============================
// NAVIGATION
// ===============================

const navButtons = document.querySelectorAll(".nav-btn");

const sections = document.querySelectorAll(".section");

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    navButtons.forEach((btn) => btn.classList.remove("active"));

    button.classList.add("active");

    const target = button.dataset.section;

    sections.forEach((section) => {
      section.classList.remove("active-section");

      if (section.id === target) {
        section.classList.add("active-section");
      }
    });
  });
});

// ===============================
// DATA
// ===============================

let companies = JSON.parse(localStorage.getItem(COMPANY_KEY)) || [];

let resumeVersions = JSON.parse(localStorage.getItem(RESUME_KEY)) || [];

let activities = JSON.parse(localStorage.getItem(ACTIVITY_KEY)) || [];

let editingIndex = null;

// ===============================
// ELEMENTS
// ===============================

const companyName = document.getElementById("companyName");

const companyStatus = document.getElementById("companyStatus");

const addCompanyBtn = document.getElementById("addCompanyBtn");

const companyTableBody = document.getElementById("companyTableBody");

const searchCompany = document.getElementById("searchCompany");

const filterStatus = document.getElementById("filterStatus");

// ===============================
// ACTIVITY SYSTEM
// ===============================

function addActivity(message) {
  activities.unshift(`${new Date().toLocaleTimeString()} - ${message}`);

  if (activities.length > 15) {
    activities.pop();
  }

  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities));

  renderActivities();
}

function renderActivities() {
  const activityFeed = document.getElementById("activityFeed");

  activityFeed.innerHTML = "";

  if (activities.length === 0) {
    activityFeed.innerHTML = "<li>No activity yet.</li>";

    return;
  }

  activities.forEach((item) => {
    const li = document.createElement("li");

    li.textContent = item;

    activityFeed.appendChild(li);
  });
}

// ===============================
// COMPANIES
// ===============================

function saveCompanies() {
  localStorage.setItem(COMPANY_KEY, JSON.stringify(companies));

  updateStats();
  updateGoalProgress();
}

function renderCompanies() {
  companyTableBody.innerHTML = "";

  let filtered = [...companies];

  const search = searchCompany.value.trim().toLowerCase();

  const status = filterStatus.value;

  if (search) {
    filtered = filtered.filter((company) =>
      company.name.toLowerCase().includes(search),
    );
  }

  if (status !== "All") {
    filtered = filtered.filter((company) => company.status === status);
  }

  if (filtered.length === 0) {
    companyTableBody.innerHTML = `
        <tr>
            <td colspan="3">
                No matching records found.
            </td>
        </tr>
        `;

    return;
  }

  filtered.forEach((company) => {
    const actualIndex = companies.indexOf(company);

    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${company.name}</td>

            <td>${company.status}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editCompany(${actualIndex})"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteCompany(${actualIndex})"
                >
                    Delete
                </button>

            </td>
        `;

    companyTableBody.appendChild(row);
  });
}

window.deleteCompany = function (index) {
  const company = companies[index];

  addActivity(`Deleted ${company.name}`);

  companies.splice(index, 1);

  saveCompanies();

  renderCompanies();
};

window.editCompany = function (index) {
  companyName.value = companies[index].name;

  companyStatus.value = companies[index].status;

  editingIndex = index;

  addCompanyBtn.textContent = "Update Company";
};

addCompanyBtn.addEventListener("click", () => {
  const name = companyName.value.trim();

  const status = companyStatus.value;

  if (!name) {
    alert("Enter company name");

    return;
  }

  if (editingIndex !== null) {
    companies[editingIndex] = {
      name,
      status,
    };

    addActivity(`Updated ${name}`);

    editingIndex = null;

    addCompanyBtn.textContent = "Add Company";
  } else {
    companies.push({
      name,
      status,
    });

    addActivity(`Added ${name}`);
  }

  companyName.value = "";

  saveCompanies();

  renderCompanies();
});

searchCompany.addEventListener("input", renderCompanies);

filterStatus.addEventListener("change", renderCompanies);

// ===============================
// DASHBOARD STATS
// ===============================

function updateStats() {
  const applications = companies.length;

  const interviews = companies.filter((c) => c.status === "Interview").length;

  const offers = companies.filter((c) => c.status === "Offer").length;

  const rejected = companies.filter((c) => c.status === "Rejected").length;

  document.getElementById("totalApplications").textContent = applications;

  document.getElementById("totalInterviews").textContent = interviews;

  document.getElementById("totalOffers").textContent = offers;

  document.getElementById("totalRejected").textContent = rejected;

  let successRate = 0;

  if (applications > 0) {
    successRate = (offers / applications) * 100;
  }

  document.getElementById("successRate").textContent =
    successRate.toFixed(1) + "%";
}

// ===============================
// GOAL TRACKER
// ===============================

const goalInput = document.getElementById("goalInput");

const saveGoalBtn = document.getElementById("saveGoalBtn");

saveGoalBtn.addEventListener("click", () => {
  localStorage.setItem(GOAL_KEY, goalInput.value);

  addActivity("Updated placement goal");

  updateGoalProgress();
});

function updateGoalProgress() {
  const goal = Number(localStorage.getItem(GOAL_KEY)) || 0;

  goalInput.value = goal || "";

  const applications = companies.length;

  let percent = 0;

  if (goal > 0) {
    percent = Math.min(100, (applications / goal) * 100);
  }

  document.getElementById("goalProgress").style.width = percent + "%";

  document.getElementById("goalPercentage").textContent =
    percent.toFixed(1) + "%";
}

// ===============================
// CODING
// ===============================

const leetcodeSolved = document.getElementById("leetcodeSolved");

const contestRating = document.getElementById("contestRating");

const weeklyProblems = document.getElementById("weeklyProblems");

const saveCodingBtn = document.getElementById("saveCodingBtn");

function loadCoding() {
  const data = JSON.parse(localStorage.getItem(CODING_KEY));

  if (!data) return;

  leetcodeSolved.value = data.leetcodeSolved || "";

  contestRating.value = data.contestRating || "";

  weeklyProblems.value = data.weeklyProblems || "";
}

saveCodingBtn.addEventListener("click", () => {
  localStorage.setItem(
    CODING_KEY,
    JSON.stringify({
      leetcodeSolved: leetcodeSolved.value,
      contestRating: contestRating.value,
      weeklyProblems: weeklyProblems.value,
    }),
  );

  addActivity("Updated coding progress");

  alert("Coding progress saved");
});

// ===============================
// RESUME
// ===============================

const resumeVersion = document.getElementById("resumeVersion");

const addResumeBtn = document.getElementById("addResumeBtn");

const resumeList = document.getElementById("resumeList");

function saveResume() {
  localStorage.setItem(RESUME_KEY, JSON.stringify(resumeVersions));
}

function renderResume() {
  resumeList.innerHTML = "";

  if (resumeVersions.length === 0) {
    resumeList.innerHTML = "<li>No resume versions added.</li>";

    return;
  }

  resumeVersions.forEach((version, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
                <span>${version}</span>

                <button
                    class="delete-btn"
                    onclick="deleteResume(${index})"
                >
                    Delete
                </button>
            `;

    resumeList.appendChild(li);
  });
}

window.deleteResume = function (index) {
  addActivity(`Removed ${resumeVersions[index]}`);

  resumeVersions.splice(index, 1);

  saveResume();

  renderResume();
};

addResumeBtn.addEventListener("click", () => {
  const version = resumeVersion.value.trim();

  if (!version) return;

  resumeVersions.push(version);

  addActivity(`Added ${version}`);

  resumeVersion.value = "";

  saveResume();

  renderResume();
});

// ===============================
// CLEAR ALL
// ===============================

document.getElementById("clearAllBtn").addEventListener("click", () => {
  const ok = confirm("Delete all saved data?");

  if (!ok) return;

  [COMPANY_KEY, CODING_KEY, RESUME_KEY, GOAL_KEY, ACTIVITY_KEY].forEach((key) =>
    localStorage.removeItem(key),
  );

  location.reload();
});

// ===============================
// INITIAL LOAD
// ===============================

renderCompanies();
renderResume();
renderActivities();
loadCoding();
updateStats();
updateGoalProgress();
