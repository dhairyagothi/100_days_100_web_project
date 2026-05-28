const masonryGrid = document.getElementById("masonryGrid");
const sentinel = document.getElementById("sentinel");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");
const savedFilter = document.getElementById("savedFilter");

const modal = document.getElementById("pinModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalTag = document.getElementById("modalTag");
const modalMeta = document.getElementById("modalMeta");
const modalSave = document.getElementById("modalSave");
const modalShare = document.getElementById("modalShare");

const baseImages = [
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    tag: "interiors",
    credit: "Studio",
  },
  {
    src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
    tag: "portrait",
    credit: "Minimal",
  },
  {
    src: "https://images.unsplash.com/photo-1493666438817-866a91353ca9",
    tag: "texture",
    credit: "Layered",
  },
  {
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    tag: "travel",
    credit: "Wander",
  },
  {
    src: "https://images.unsplash.com/photo-1468343966296-e4e008f91dd8",
    tag: "architecture",
    credit: "Form",
  },
  {
    src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
    tag: "nature",
    credit: "Wild",
  },
  {
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    tag: "forest",
    credit: "Moss",
  },
  {
    src: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    tag: "editorial",
    credit: "Nordic",
  },
  {
    src: "https://images.unsplash.com/photo-1466637574441-749b8f19452f",
    tag: "food",
    credit: "Kitchen",
  },
  {
    src: "https://images.unsplash.com/photo-1487014679447-9f8336841d58",
    tag: "workspace",
    credit: "Desk",
  },
  {
    src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622",
    tag: "fashion",
    credit: "Style",
  },
  {
    src: "https://images.unsplash.com/photo-1471879832106-c7ab9e0cee23",
    tag: "lifestyle",
    credit: "Home",
  },
];

const aspectOptions = [
  { w: 4, h: 5 },
  { w: 3, h: 4 },
  { w: 5, h: 4 },
  { w: 2, h: 3 },
  { w: 1, h: 1 },
  { w: 9, h: 16 },
];

const tagPool = [
  "warm minimal",
  "ceramics",
  "coastal",
  "street style",
  "handmade",
  "typography",
  "ocean",
  "studio light",
  "soft glow",
  "architectural",
  "organic",
  "coral",
];

const savedPins = new Set(JSON.parse(localStorage.getItem("pinspire-saved")) || []);
const allPins = [];
let activeFilter = "";
let showSavedOnly = false;
let isLoading = false;
let modalPin = null;

const PIN_BATCH = 12;

const observer = new IntersectionObserver(
  (entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && !isLoading && !activeFilter && !showSavedOnly) {
      loadMorePins();
    }
  },
  { rootMargin: "200px" }
);

function buildPin(seed) {
  const base = baseImages[seed % baseImages.length];
  const aspect = aspectOptions[Math.floor(Math.random() * aspectOptions.length)];
  const tag = tagPool[Math.floor(Math.random() * tagPool.length)];
  const ratio = `${aspect.w} / ${aspect.h}`;
  const height = Math.round((700 * aspect.h) / aspect.w);
  const url = `${base.src}?auto=format&fit=crop&w=700&h=${height}&q=80&sig=${seed}`;

  return {
    id: `pin-${Date.now()}-${seed}`,
    title: `${tag.replace(/\b\w/g, (m) => m.toUpperCase())} Moodboard`,
    tag,
    credit: base.credit,
    image: url,
    ratio,
  };
}

function renderPins(pins, append = true) {
  if (!append) {
    masonryGrid.innerHTML = "";
  }

  const fragment = document.createDocumentFragment();

  pins.forEach((pin) => {
    const card = document.createElement("article");
    card.className = "pin-card";
    card.dataset.id = pin.id;
    if (savedPins.has(pin.id)) {
      card.classList.add("is-saved");
    }

    card.innerHTML = `
      <div class="pin-media" style="aspect-ratio: ${pin.ratio}">
        <img src="${pin.image}" alt="${pin.title}" loading="lazy" />
        <div class="pin-overlay">
          <div class="overlay-top">
            <button class="save-btn" type="button">${
              savedPins.has(pin.id) ? "Saved" : "Save"
            }</button>
          </div>
          <div class="overlay-bottom">
            <button class="action-btn" type="button">Share</button>
          </div>
        </div>
      </div>
      <div class="pin-meta">
        <h3>${pin.title}</h3>
        <p>${pin.tag} · ${pin.credit}</p>
      </div>
    `;

    fragment.appendChild(card);
  });

  masonryGrid.appendChild(fragment);
}

function loadMorePins() {
  isLoading = true;
  sentinel.classList.add("is-loading");

  const newPins = Array.from({ length: PIN_BATCH }, (_, index) =>
    buildPin(allPins.length + index + 1)
  );

  allPins.push(...newPins);
  renderPins(newPins, true);

  isLoading = false;
  sentinel.classList.remove("is-loading");
}

function applyFilter() {
  const term = activeFilter.toLowerCase();
  const filtered = allPins.filter((pin) => {
    const matchesTerm =
      !term ||
      pin.title.toLowerCase().includes(term) ||
      pin.tag.toLowerCase().includes(term);
    const matchesSaved = !showSavedOnly || savedPins.has(pin.id);
    return matchesTerm && matchesSaved;
  });

  renderPins(filtered, false);
  sentinel.style.display = activeFilter || showSavedOnly ? "none" : "flex";
}

function toggleSave(pinId) {
  if (savedPins.has(pinId)) {
    savedPins.delete(pinId);
  } else {
    savedPins.add(pinId);
  }

  localStorage.setItem("pinspire-saved", JSON.stringify([...savedPins]));
  applyFilter();

  if (modalPin && modalPin.id === pinId) {
    modalSave.textContent = savedPins.has(pinId) ? "Saved" : "Save";
  }
}

function openModal(pin) {
  modalPin = pin;
  modalImage.src = pin.image;
  modalImage.alt = pin.title;
  modalTitle.textContent = pin.title;
  modalTag.textContent = pin.tag;
  modalMeta.textContent = `From ${pin.credit} collection`;
  modalSave.textContent = savedPins.has(pin.id) ? "Saved" : "Save";
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  modalPin = null;
}

function sharePin(pin) {
  const shareData = {
    title: pin.title,
    text: `Check out this pin: ${pin.title}`,
    url: pin.image,
  };

  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(pin.image).then(() => {
      alert("Pin link copied to clipboard.");
    });
  }
}

function syncThemeButton(isDark) {
  themeToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
  themeToggle.textContent = isDark ? "Light" : "Dark";
}

function initTheme() {
  const stored = localStorage.getItem("pinspire-theme");
  if (stored === "dark") {
    document.body.setAttribute("data-theme", "dark");
    syncThemeButton(true);
  } else {
    syncThemeButton(false);
  }
}

searchInput.addEventListener("input", (event) => {
  activeFilter = event.target.value.trim();
  applyFilter();
});

savedFilter.addEventListener("click", () => {
  showSavedOnly = !showSavedOnly;
  savedFilter.classList.toggle("is-active", showSavedOnly);
  savedFilter.textContent = showSavedOnly ? "All" : "Saved";
  applyFilter();
});

themeToggle.addEventListener("click", () => {
  const isDark = document.body.getAttribute("data-theme") === "dark";
  if (isDark) {
    document.body.removeAttribute("data-theme");
    localStorage.setItem("pinspire-theme", "light");
    syncThemeButton(false);
  } else {
    document.body.setAttribute("data-theme", "dark");
    localStorage.setItem("pinspire-theme", "dark");
    syncThemeButton(true);
  }
});

masonryGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".pin-card");
  if (!card) return;

  const pin = allPins.find((item) => item.id === card.dataset.id);
  if (!pin) return;

  if (event.target.closest(".save-btn")) {
    toggleSave(pin.id);
    return;
  }

  if (event.target.closest(".action-btn")) {
    sharePin(pin);
    return;
  }

  openModal(pin);
});

modal.addEventListener("click", (event) => {
  if (event.target.dataset.close === "true") {
    closeModal();
  }
});

modalSave.addEventListener("click", () => {
  if (modalPin) {
    toggleSave(modalPin.id);
  }
});

modalShare.addEventListener("click", () => {
  if (modalPin) {
    sharePin(modalPin);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});

function bootstrap() {
  initTheme();
  loadMorePins();
  observer.observe(sentinel);
}

bootstrap();
