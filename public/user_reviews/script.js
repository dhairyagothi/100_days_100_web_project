// ── Seed data (sample reviews) ─────────────────────────────────
const SEED_REVIEWS = [
  { id: 1, name: "Aryan Kumar",   rating: 5, text: "This project taught me so much. The variety of web projects in 100 days is genuinely impressive — each one covers a different concept.", date: "2025-05-12" },
  { id: 2, name: "Sneha Rao",     rating: 4, text: "Great for beginners. I especially liked the JavaScript mini-projects. Would love more comments in the code for learning purposes.", date: "2025-04-28" },
  { id: 3, name: "Mihail T.",     rating: 5, text: "Forked this and used it as a personal practice repo. The structure is clean and easy to navigate. Highly recommend for anyone learning frontend.", date: "2025-03-15" },
  { id: 4, name: "Priya L.",      rating: 3, text: "Good collection overall. Some projects could use responsive design improvements. But a solid reference for HTML/CSS patterns.", date: "2025-02-20" },
  { id: 5, name: "Rajan Mehta",   rating: 5, text: "Completed 30 of the projects as personal challenges. My CSS skills improved dramatically. The snake game project was my favourite!", date: "2025-05-30" },
  { id: 6, name: "Fatima A.",     rating: 4, text: "Very well organised. Would love a difficulty tag on each project so beginners know where to start.", date: "2025-04-10" },
];

// ── State ───────────────────────────────────────────────────────
let reviews      = loadReviews();
let selectedStar = 0;
let activeFilter = "all";
let activeSort   = "newest";
let nextId       = reviews.length ? Math.max(...reviews.map(r => r.id)) + 1 : 100;

// ── Persistence ─────────────────────────────────────────────────
function loadReviews() {
  try {
    const stored = localStorage.getItem("userReviews");
    return stored ? JSON.parse(stored) : [...SEED_REVIEWS];
  } catch {
    return [...SEED_REVIEWS];
  }
}

function saveReviews() {
  try { localStorage.setItem("userReviews", JSON.stringify(reviews)); } catch {}
}

// ── Helpers ─────────────────────────────────────────────────────
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

function avatarClass(name) {
  const classes = ["c0","c1","c2","c3","c4"];
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return classes[h % classes.length];
}

function starsHTML(rating, size) {
  return Array.from({length: 5}, (_, i) =>
    `<span class="s${i < rating ? " on" : ""}" style="font-size:${size}px">★</span>`
  ).join("");
}

// ── Summary bar ─────────────────────────────────────────────────
function updateSummary() {
  const n = reviews.length;
  document.getElementById("totalCount").textContent = n;

  const avg = n ? (reviews.reduce((a,r) => a + r.rating, 0) / n) : 0;
  document.getElementById("avgScore").textContent = n ? avg.toFixed(1) : "–";

  const starsEl = document.getElementById("avgStars");
  starsEl.innerHTML = starsHTML(Math.round(avg), 18);

  const breakdown = document.getElementById("breakdown");
  breakdown.innerHTML = "";
  for (let s = 5; s >= 1; s--) {
    const count = reviews.filter(r => r.rating === s).length;
    const pct   = n ? Math.round((count / n) * 100) : 0;
    const row   = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `
      <span class="bar-label">${s}★</span>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
      <span class="bar-pct">${pct}%</span>`;
    breakdown.appendChild(row);
  }
}

// ── Render reviews ───────────────────────────────────────────────
function renderReviews() {
  const grid  = document.getElementById("reviewsGrid");
  const empty = document.getElementById("emptyState");

  let list = [...reviews];

  // filter
  if (activeFilter !== "all") {
    list = list.filter(r => r.rating === Number(activeFilter));
  }

  // sort
  if (activeSort === "newest")  list.sort((a,b) => b.id - a.id);
  if (activeSort === "oldest")  list.sort((a,b) => a.id - b.id);
  if (activeSort === "highest") list.sort((a,b) => b.rating - a.rating);
  if (activeSort === "lowest")  list.sort((a,b) => a.rating - b.rating);

  grid.innerHTML = "";
  if (!list.length) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  const newestId = reviews.length ? Math.max(...reviews.map(r => r.id)) : -1;

  list.forEach(r => {
    const card = document.createElement("div");
    card.className = "review-card";
    const isNew = r.id === newestId && r.id >= 100; // user-added only
    card.innerHTML = `
      <div class="card-top">
        <div class="avatar ${avatarClass(r.name)}">${initials(r.name)}</div>
        <div class="user-info">
          <div class="name">${escapeHTML(r.name)}${isNew ? '<span class="new-badge">New</span>' : ""}</div>
          <div class="date">${formatDate(r.date)}</div>
        </div>
      </div>
      <div class="card-stars">${starsHTML(r.rating, 15)}</div>
      <p class="card-text">${escapeHTML(r.text)}</p>`;
    grid.appendChild(card);
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, c =>
    ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

// ── Filter & sort ────────────────────────────────────────────────
function filterReviews(val, btn) {
  activeFilter = val;
  document.querySelectorAll(".filter-btns button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderReviews();
}

function sortReviews(val) {
  activeSort = val;
  renderReviews();
}

// ── Star picker ──────────────────────────────────────────────────
function initStarPicker() {
  const picker = document.getElementById("starPicker");
  const spans  = picker.querySelectorAll("span");

  spans.forEach(span => {
    span.addEventListener("mouseenter", () => {
      const v = Number(span.dataset.val);
      spans.forEach(s => s.classList.toggle("hover", Number(s.dataset.val) <= v));
    });
    span.addEventListener("mouseleave", () => {
      spans.forEach(s => s.classList.remove("hover"));
      highlightSelected();
    });
    span.addEventListener("click", () => {
      selectedStar = Number(span.dataset.val);
      highlightSelected();
    });
  });
}

function highlightSelected() {
  const spans = document.querySelectorAll("#starPicker span");
  spans.forEach(s => s.classList.toggle("active", Number(s.dataset.val) <= selectedStar));
}

// ── Character counter ────────────────────────────────────────────
document.getElementById("inputReview").addEventListener("input", function() {
  document.getElementById("charCount").textContent = `${this.value.length} / 300`;
});

// ── Submit ───────────────────────────────────────────────────────
function submitReview() {
  const name   = document.getElementById("inputName").value.trim();
  const text   = document.getElementById("inputReview").value.trim();
  const errEl  = document.getElementById("formError");

  if (!name)            return showError("Please enter your name.");
  if (!selectedStar)    return showError("Please select a star rating.");
  if (text.length < 10) return showError("Review must be at least 10 characters.");

  errEl.textContent = "";

  const review = {
    id:     nextId++,
    name,
    rating: selectedStar,
    text,
    date:   new Date().toISOString().split("T")[0],
  };

  reviews.unshift(review);
  saveReviews();
  updateSummary();

  // Reset form
  document.getElementById("inputName").value    = "";
  document.getElementById("inputReview").value  = "";
  document.getElementById("charCount").textContent = "0 / 300";
  selectedStar = 0;
  highlightSelected();

  // Switch to all/newest to show new card
  activeFilter = "all";
  activeSort   = "newest";
  document.getElementById("sortSelect").value = "newest";
  document.querySelectorAll(".filter-btns button").forEach((b,i) => b.classList.toggle("active", i===0));

  renderReviews();
}

function showError(msg) {
  document.getElementById("formError").textContent = msg;
}

// ── Init ─────────────────────────────────────────────────────────
initStarPicker();
updateSummary();
renderReviews();
