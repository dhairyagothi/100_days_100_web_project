

const AUDIUS_APP  = "AuraMusicPlayer";          // app name for API attribution
let   AUDIUS_HOST = "https://discoveryprovider.audius.co"; // default; may update


const audio            = new Audio();
const cover            = document.getElementById("cover");
const coverWrap        = document.getElementById("coverWrap");
const titleEl          = document.getElementById("title");
const artistEl         = document.getElementById("artist");
const playBtn          = document.getElementById("play");
const nextBtn          = document.getElementById("next");
const prevBtn          = document.getElementById("prev");
const progressFill     = document.getElementById("progress");
const progressThumb    = document.getElementById("progressThumb");
const progressContainer= document.getElementById("progressContainer");
const currentTimeEl    = document.getElementById("currentTime");
const durationEl       = document.getElementById("duration");
const playlistEl       = document.getElementById("playlist");
const volumeEl         = document.getElementById("volume");
const searchInput      = document.getElementById("searchInput");
const searchBtn        = document.getElementById("searchBtn");
const lyricsBox        = document.getElementById("lyricsBox");
const toast            = document.getElementById("toast");
const likeBtn          = document.getElementById("likeBtn");
const eqEl             = document.getElementById("eq");
const tabs             = document.querySelectorAll(".tab");
const tabPanels        = document.querySelectorAll(".tab-panel");


let songs       = [];
let currentIdx  = 0;
let isPlaying   = false;
let likedTracks = JSON.parse(localStorage.getItem("aura_liked") || "[]");


async function bootstrapHost() {
  try {
    const res  = await fetch("https://api.audius.co");
    const data = await res.json();
    const hosts = data?.data;
    if (Array.isArray(hosts) && hosts.length) {
      AUDIUS_HOST = hosts[Math.floor(Math.random() * Math.min(3, hosts.length))];
    }
  } catch (_) {
    /* fallback to default */
  }
}

// ── Fetch trending / search ───────────────────────────────────
async function fetchSongs(query = "") {
  playlistEl.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>${query ? `Searching for "${query}"…` : "Loading trending tracks…"}</p>
    </div>`;

  try {
    const endpoint = query
      ? `${AUDIUS_HOST}/v1/tracks/search?query=${encodeURIComponent(query)}&limit=25&app_name=${AUDIUS_APP}`
      : `${AUDIUS_HOST}/v1/tracks/trending?limit=25&app_name=${AUDIUS_APP}`;

    const res  = await fetch(endpoint);
    const data = await res.json();

    songs = (data?.data || []).filter(t => t?.id && t?.title);

    if (!songs.length) {
      playlistEl.innerHTML = `<div class="loading-state"><p>No tracks found. Try another search.</p></div>`;
      return;
    }

    renderPlaylist();
    loadSong(0);

  } catch (err) {
    console.error(err);
    playlistEl.innerHTML = `<div class="loading-state"><p>⚠ Could not load tracks. Please try again.</p></div>`;
  }
}


function renderPlaylist() {
  playlistEl.innerHTML = "";
  songs.forEach((song, i) => {
    const art = getArtwork(song, "150x150");
    const dur = fmtTime(song.duration || 0);

    const div = document.createElement("div");
    div.className = "song-item" + (i === currentIdx ? " active" : "");
    div.innerHTML = `
      <img class="song-thumb" src="${art}" alt="" loading="lazy" />
      <div class="song-meta">
        <div class="song-name">${esc(song.title)}</div>
        <div class="song-artist">${esc(song.user?.name || "Unknown")}</div>
      </div>
      <div class="song-duration">${dur}</div>`;

    div.addEventListener("click", () => {
      currentIdx = i;
      loadSong(i);
      playSong();
    });
    playlistEl.appendChild(div);
  });
}

function highlightActive() {
  document.querySelectorAll(".song-item").forEach((el, i) => {
    el.classList.toggle("active", i === currentIdx);
  });
  // scroll active item into view
  const active = playlistEl.querySelector(".song-item.active");
  if (active) active.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

// ── Load a track ──────────────────────────────────────────────
function loadSong(idx) {
  const song = songs[idx];
  if (!song) return;

  currentIdx = idx;

  titleEl.textContent  = song.title;
  artistEl.textContent = song.user?.name || "Unknown";
  cover.src            = getArtwork(song, "480x480");

  // Full-quality stream URL  (no 30-second preview limitation)
  audio.src = `${AUDIUS_HOST}/v1/tracks/${song.id}/stream?app_name=${AUDIUS_APP}`;
  audio.load();

  // Like button state
  const liked = likedTracks.includes(song.id);
  likeBtn.classList.toggle("liked", liked);
  likeBtn.querySelector("i").className = liked ? "fas fa-heart" : "far fa-heart";

  highlightActive();
  fetchLyrics(song.user?.name || "", song.title);
}

// ── Playback ──────────────────────────────────────────────────
function playSong() {
  audio.play().catch(e => console.warn("Playback blocked:", e));
  isPlaying = true;
  playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
  coverWrap.classList.add("playing");
  eqEl.classList.add("active");
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.innerHTML = `<i class="fas fa-play"></i>`;
  coverWrap.classList.remove("playing");
  eqEl.classList.remove("active");
}

playBtn.addEventListener("click", () => {
  isPlaying ? pauseSong() : playSong();
});

nextBtn.addEventListener("click", () => {
  currentIdx = (currentIdx + 1) % songs.length;
  loadSong(currentIdx);
  playSong();
});

prevBtn.addEventListener("click", () => {
  currentIdx = (currentIdx - 1 + songs.length) % songs.length;
  loadSong(currentIdx);
  playSong();
});

audio.addEventListener("ended", () => {
  currentIdx = (currentIdx + 1) % songs.length;
  loadSong(currentIdx);
  playSong();
});

// ── Progress bar ──────────────────────────────────────────────
audio.addEventListener("timeupdate", () => {
  const { currentTime, duration } = audio;
  if (!duration || isNaN(duration)) return;

  const pct = (currentTime / duration) * 100;
  progressFill.style.width   = pct + "%";
  progressThumb.style.left   = pct + "%";
  currentTimeEl.textContent  = fmtTime(currentTime);
  durationEl.textContent     = fmtTime(duration);
});

progressContainer.addEventListener("click", e => {
  const rect  = progressContainer.getBoundingClientRect();
  const pct   = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
});

// ── Volume ────────────────────────────────────────────────────
volumeEl.addEventListener("input", () => {
  audio.volume = volumeEl.value;
});

// ── Like / favourite ──────────────────────────────────────────
likeBtn.addEventListener("click", () => {
  if (!songs.length) return;
  const id = songs[currentIdx]?.id;
  if (!id) return;

  const idx = likedTracks.indexOf(id);
  if (idx === -1) {
    likedTracks.push(id);
    likeBtn.classList.add("liked");
    likeBtn.querySelector("i").className = "fas fa-heart";
    showToast("❤  Added to Favourites");
  } else {
    likedTracks.splice(idx, 1);
    likeBtn.classList.remove("liked");
    likeBtn.querySelector("i").className = "far fa-heart";
    showToast("Removed from Favourites");
  }
  localStorage.setItem("aura_liked", JSON.stringify(likedTracks));
});

// ── Search ────────────────────────────────────────────────────
searchBtn.addEventListener("click", () => {
  const q = searchInput.value.trim();
  if (q) fetchSongs(q);
});

searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const q = searchInput.value.trim();
    if (q) fetchSongs(q);
  }
});

// ── Tabs ──────────────────────────────────────────────────────
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("tab--active"));
    tab.classList.add("tab--active");

    const target = tab.dataset.tab;
    tabPanels.forEach(p => {
      p.classList.toggle("tab-panel--active", p.id === "tab-" + target);
    });
  });
});

// ── Lyrics ────────────────────────────────────────────────────
async function fetchLyrics(artist, song) {
  lyricsBox.textContent = "Fetching lyrics…";
  try {
    const res  = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`);
    const data = await res.json();
    lyricsBox.textContent = data.lyrics || "No lyrics found for this track.";
  } catch {
    lyricsBox.textContent = "Lyrics unavailable.";
  }
}

// ── Helpers ───────────────────────────────────────────────────
function fmtTime(sec) {
  if (!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function getArtwork(song, size = "480x480") {
  const art = song?.artwork;
  if (!art) return `https://via.placeholder.com/${size.split("x")[0]}/1a1a2e/0fd5ca?text=♫`;
  return art[size] || art["480x480"] || art["150x150"] || Object.values(art)[0]
      || `https://via.placeholder.com/${size.split("x")[0]}/1a1a2e/0fd5ca?text=♫`;
}

function esc(str) {
  return String(str)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;");
}

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove("show"), 2400);
}

// ── Keyboard shortcuts ─────────────────────────────────────────
document.addEventListener("keydown", e => {
  if (e.target === searchInput) return;
  if (e.code === "Space")       { e.preventDefault(); isPlaying ? pauseSong() : playSong(); }
  if (e.code === "ArrowRight")  { audio.currentTime = Math.min(audio.duration, audio.currentTime + 10); }
  if (e.code === "ArrowLeft")   { audio.currentTime = Math.max(0, audio.currentTime - 10); }
  if (e.code === "ArrowUp")     { volumeEl.value = Math.min(1, +volumeEl.value + 0.1); audio.volume = volumeEl.value; }
  if (e.code === "ArrowDown")   { volumeEl.value = Math.max(0, +volumeEl.value - 0.1); audio.volume = volumeEl.value; }
});

// ── Init ──────────────────────────────────────────────────────
(async () => {
  await bootstrapHost();
  fetchSongs();           // load trending on start
})();
