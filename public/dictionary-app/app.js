/* ─── API Configuration ──────────────────────────────────────────── */
const DICTIONARY_API = "https://api.dictionaryapi.dev/api/v2/entries/en/";

/* ─── Word of the Day pool ───────────────────────────────────────── */
const WOTD_POOL = [
  "serendipity", "ephemeral", "luminous", "resonance", "eloquent",
  "melancholy", "zenith", "solstice", "labyrinth", "nebulous",
  "persevere", "rhetoric", "sanguine", "tranquil", "vivacious",
  "wistful", "axiom", "cascade", "diligent", "equanimity",
  "felicity", "gossamer", "halcyon", "impassive", "jubilant"
];

/* ─── DOM References ─────────────────────────────────────────────── */
const wordInput    = document.getElementById("wordInput");
const searchBtn    = document.getElementById("searchBtn");
const clearInputBtn= document.getElementById("clearInputBtn");
const resultsArea  = document.getElementById("resultsArea");
const statusBox    = document.getElementById("statusBox");
const statusText   = document.getElementById("statusText");
const targetWord   = document.getElementById("targetWord");
const phoneticText = document.getElementById("phoneticText");
const audioBtn     = document.getElementById("audioBtn");
const copyBtn      = document.getElementById("copyBtn");
const favBtn       = document.getElementById("favBtn");
const shareBtn     = document.getElementById("shareBtn");
const meaningsTabs = document.getElementById("meaningsTabs");
const meaningPanels= document.getElementById("meaningPanels");
const synAntRow    = document.getElementById("synAntRow");
const synBlock     = document.getElementById("synBlock");
const antBlock     = document.getElementById("antBlock");
const synList      = document.getElementById("synList");
const antList      = document.getElementById("antList");
const copyToast    = document.getElementById("copyToast");
const themeToggle  = document.getElementById("themeToggle");
const sidebarToggle= document.getElementById("sidebarToggle");
const sidebarClose = document.getElementById("sidebarClose");
const sidebar      = document.getElementById("sidebar");
const historyList  = document.getElementById("historyList");
const favouritesList=document.getElementById("favouritesList");
const clearHistory = document.getElementById("clearHistory");
const wotdWord     = document.getElementById("wotdWord");
const wotdLookBtn  = document.getElementById("wotdLookBtn");

/* ─── State ──────────────────────────────────────────────────────── */
let activeAudioUrl = "";
let currentWord    = "";
let currentPayload = null;
let searchHistory  = JSON.parse(localStorage.getItem("vl_history") || "[]");
let favourites     = JSON.parse(localStorage.getItem("vl_favs")    || "[]");
let activeTabIndex = 0;

/* ─── Theme ──────────────────────────────────────────────────────── */
const savedTheme = localStorage.getItem("vl_theme") || "dark";
applyTheme(savedTheme);

function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  localStorage.setItem("vl_theme", t);
  document.querySelector(".icon-moon").classList.toggle("hidden", t === "light");
  document.querySelector(".icon-sun").classList.toggle("hidden",  t === "dark");
}

themeToggle.addEventListener("click", () => {
  const cur = document.documentElement.getAttribute("data-theme");
  applyTheme(cur === "dark" ? "light" : "dark");
});

/* ─── Sidebar ────────────────────────────────────────────────────── */
// Create overlay element
const overlay = document.createElement("div");
overlay.className = "sidebar-overlay";
document.body.appendChild(overlay);

function openSidebar() {
  sidebar.classList.add("open");
  overlay.classList.add("visible");
  renderHistoryList();
  renderFavouritesList();
}
function closeSidebar() {
  sidebar.classList.remove("open");
  overlay.classList.remove("visible");
}

sidebarToggle.addEventListener("click", openSidebar);
sidebarClose.addEventListener("click", closeSidebar);
overlay.addEventListener("click", closeSidebar);

/* ─── Word of the Day ────────────────────────────────────────────── */
const todayKey = new Date().toDateString();
let wotd = localStorage.getItem("vl_wotd_word");
let wotdDate = localStorage.getItem("vl_wotd_date");
if (wotdDate !== todayKey) {
  wotd = WOTD_POOL[Math.floor(Math.random() * WOTD_POOL.length)];
  localStorage.setItem("vl_wotd_word", wotd);
  localStorage.setItem("vl_wotd_date", todayKey);
}
wotdWord.textContent = wotd;
wotdLookBtn.addEventListener("click", () => {
  wordInput.value = wotd;
  lookUpWord(wotd);
});

/* ─── Search Input helpers ───────────────────────────────────────── */
wordInput.addEventListener("input", () => {
  clearInputBtn.classList.toggle("hidden", wordInput.value.trim() === "");
});
clearInputBtn.addEventListener("click", () => {
  wordInput.value = "";
  clearInputBtn.classList.add("hidden");
  wordInput.focus();
});
searchBtn.addEventListener("click", () => {
  const w = wordInput.value.trim();
  if (w) lookUpWord(w);
});
wordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

/* ─── Core API lookup ────────────────────────────────────────────── */
async function lookUpWord(query) {
  if (!query) return;
  currentWord = query.toLowerCase();

  // UI: loading state
  resultsArea.classList.add("hidden");
  statusBox.classList.remove("hidden");
  statusText.textContent = `Looking up "${query}"…`;
  activeAudioUrl = "";

  try {
    const res = await fetch(`${DICTIONARY_API}${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("Not found");
    const data = await res.json();
    currentPayload = data[0];
    renderResults(currentPayload);
    addToHistory(query.toLowerCase());
  } catch {
    statusBox.classList.remove("hidden");
    statusText.textContent = `No results found for "${query}". Check the spelling and try again.`;
    resultsArea.classList.add("hidden");
    // Remove spinner on error
    document.querySelector(".spinner").style.display = "none";
  }
}

/* ─── Render all results ─────────────────────────────────────────── */
function renderResults(payload) {
  statusBox.classList.add("hidden");
  document.querySelector(".spinner").style.display = "";
  resultsArea.classList.remove("hidden");
  activeTabIndex = 0;

  // Word & phonetic
  targetWord.textContent = payload.word;
  const phonetic = payload.phonetic
    || (payload.phonetics && payload.phonetics.find(p => p.text)?.text)
    || "";
  phoneticText.textContent = phonetic || "";
  phoneticText.style.display = phonetic ? "block" : "none";

  // Audio
  const audioObj = payload.phonetics?.find(p => p.audio && p.audio.trim());
  if (audioObj) {
    activeAudioUrl = audioObj.audio;
    audioBtn.style.display = "flex";
  } else {
    activeAudioUrl = "";
    audioBtn.style.display = "none";
  }

  // Favourite button state
  favBtn.classList.toggle("active", favourites.includes(payload.word.toLowerCase()));

  // Build tabs + panels
  meaningsTabs.innerHTML = "";
  meaningPanels.innerHTML = "";

  payload.meanings.forEach((meaning, idx) => {
    // Tab
    const tab = document.createElement("button");
    tab.className = "tab-btn" + (idx === 0 ? " active" : "");
    tab.textContent = meaning.partOfSpeech;
    tab.dataset.idx = idx;
    tab.addEventListener("click", () => switchTab(idx));
    meaningsTabs.appendChild(tab);

    // Panel
    const panel = document.createElement("div");
    panel.className = "meaning-panel" + (idx === 0 ? " active" : "");
    panel.id = `panel-${idx}`;

    // Up to 5 definitions
    meaning.definitions.slice(0, 5).forEach((def, dIdx) => {
      const item = document.createElement("div");
      item.className = "def-item";

      const numBadge = document.createElement("span");
      numBadge.className = "def-number";
      numBadge.textContent = `Def. ${dIdx + 1}`;
      item.appendChild(numBadge);

      const defText = document.createElement("p");
      defText.className = "def-text";
      defText.textContent = def.definition;
      item.appendChild(defText);

      if (def.example) {
        const ex = document.createElement("p");
        ex.className = "example-text";
        ex.textContent = `"${def.example}"`;
        item.appendChild(ex);
      }

      // Synonyms / antonyms within definition
      const allSyns = [...(def.synonyms || [])];
      const allAnts = [...(def.antonyms || [])];
      if (allSyns.length || allAnts.length) {
        const chips = document.createElement("div");
        chips.className = "def-chips";
        allSyns.slice(0, 5).forEach(s => {
          const c = document.createElement("span");
          c.className = "def-chip";
          c.textContent = s;
          c.title = `Search "${s}"`;
          c.addEventListener("click", () => { wordInput.value = s; lookUpWord(s); });
          chips.appendChild(c);
        });
        if (chips.children.length) item.appendChild(chips);
      }

      panel.appendChild(item);
    });

    meaningPanels.appendChild(panel);
  });

  // Aggregate synonyms / antonyms across all meanings
  const allSyns = new Set();
  const allAnts = new Set();
  payload.meanings.forEach(m => {
    m.synonyms?.forEach(s => allSyns.add(s));
    m.antonyms?.forEach(a => allAnts.add(a));
    m.definitions?.forEach(d => {
      d.synonyms?.forEach(s => allSyns.add(s));
      d.antonyms?.forEach(a => allAnts.add(a));
    });
  });

  renderChips(synList, [...allSyns].slice(0, 10), "syn-chip");
  renderChips(antList, [...allAnts].slice(0, 10), "ant-chip");

  synBlock.classList.toggle("hidden", allSyns.size === 0);
  antBlock.classList.toggle("hidden", allAnts.size === 0);
  synAntRow.classList.toggle("hidden", allSyns.size === 0 && allAnts.size === 0);
}

function renderChips(container, words, cls) {
  container.innerHTML = "";
  words.forEach(w => {
    const chip = document.createElement("span");
    chip.className = cls;
    chip.textContent = w;
    chip.title = `Search "${w}"`;
    chip.addEventListener("click", () => { wordInput.value = w; lookUpWord(w); });
    container.appendChild(chip);
  });
}

function switchTab(idx) {
  activeTabIndex = idx;
  document.querySelectorAll(".tab-btn").forEach((b, i) => b.classList.toggle("active", i === idx));
  document.querySelectorAll(".meaning-panel").forEach((p, i) => p.classList.toggle("active", i === idx));
}

/* ─── Audio ──────────────────────────────────────────────────────── */
audioBtn.addEventListener("click", () => {
  if (!activeAudioUrl) return;
  const audio = new Audio(activeAudioUrl);
  audio.play().catch(() => alert("Audio could not play. Check browser permissions."));
});

/* ─── Copy definition ────────────────────────────────────────────── */
copyBtn.addEventListener("click", () => {
  if (!currentPayload) return;
  const meaning = currentPayload.meanings[activeTabIndex] || currentPayload.meanings[0];
  const def = meaning.definitions[0].definition;
  const text = `${currentPayload.word} (${meaning.partOfSpeech}): ${def}`;
  navigator.clipboard.writeText(text).then(() => showToast("Definition copied!"));
});

/* ─── Favourites ─────────────────────────────────────────────────── */
favBtn.addEventListener("click", () => {
  if (!currentWord) return;
  if (favourites.includes(currentWord)) {
    favourites = favourites.filter(w => w !== currentWord);
    favBtn.classList.remove("active");
    showToast("Removed from favourites");
  } else {
    favourites.unshift(currentWord);
    favBtn.classList.add("active");
    showToast("Added to favourites ★");
  }
  localStorage.setItem("vl_favs", JSON.stringify(favourites));
  renderFavouritesList();
});

/* ─── Share ──────────────────────────────────────────────────────── */
shareBtn.addEventListener("click", () => {
  if (!currentWord) return;
  const url = `${location.origin}${location.pathname}?q=${encodeURIComponent(currentWord)}`;
  if (navigator.share) {
    navigator.share({ title: `Look up "${currentWord}"`, url });
  } else {
    navigator.clipboard.writeText(url).then(() => showToast("Link copied to clipboard!"));
  }
});

/* ─── History ────────────────────────────────────────────────────── */
function addToHistory(word) {
  searchHistory = [word, ...searchHistory.filter(w => w !== word)].slice(0, 25);
  localStorage.setItem("vl_history", JSON.stringify(searchHistory));
  renderHistoryList();
}

clearHistory.addEventListener("click", () => {
  searchHistory = [];
  localStorage.removeItem("vl_history");
  renderHistoryList();
});

function renderHistoryList() {
  historyList.innerHTML = "";
  if (!searchHistory.length) {
    historyList.innerHTML = '<li class="empty-note">No searches yet.</li>';
    return;
  }
  searchHistory.forEach(w => historyList.appendChild(makeWordChip(w, () => {
    closeSidebar();
    wordInput.value = w;
    lookUpWord(w);
  }, null)));
}

/* ─── Favourites list ────────────────────────────────────────────── */
function renderFavouritesList() {
  favouritesList.innerHTML = "";
  if (!favourites.length) {
    favouritesList.innerHTML = '<li class="empty-note">No favourites yet.</li>';
    return;
  }
  favourites.forEach(w => favouritesList.appendChild(makeWordChip(w, () => {
    closeSidebar();
    wordInput.value = w;
    lookUpWord(w);
  }, () => {
    favourites = favourites.filter(f => f !== w);
    localStorage.setItem("vl_favs", JSON.stringify(favourites));
    if (currentWord === w) favBtn.classList.remove("active");
    renderFavouritesList();
  })));
}

function makeWordChip(word, onClick, onRemove) {
  const li = document.createElement("li");
  const btn = document.createElement("button");
  btn.textContent = word;
  if (onRemove) {
    const rm = document.createElement("span");
    rm.className = "remove-chip";
    rm.textContent = "✕";
    rm.addEventListener("click", (e) => { e.stopPropagation(); onRemove(); });
    btn.appendChild(rm);
  }
  btn.addEventListener("click", onClick);
  li.appendChild(btn);
  return li;
}

/* ─── Toast helper ───────────────────────────────────────────────── */
let toastTimer;
function showToast(msg) {
  copyToast.textContent = msg;
  copyToast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => copyToast.classList.remove("show"), 2200);
}

/* ─── Deep-link: ?q=word on load ────────────────────────────────── */
const params = new URLSearchParams(location.search);
if (params.has("q")) {
  const q = params.get("q").trim();
  if (q) {
    wordInput.value = q;
    lookUpWord(q);
  }
}

/* ─── Render history/favs on sidebar open ───────────────────────── */
renderHistoryList();
renderFavouritesList();