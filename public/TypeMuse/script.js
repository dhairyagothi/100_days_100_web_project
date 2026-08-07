const fonts = [
  { name: "Playfair Display", type: "Serif", sample: "Elegant editorial rhythm" },
  { name: "Inter", type: "Sans", sample: "Clean digital clarity" },
  { name: "Syne", type: "Display", sample: "Creative studio energy" },
  { name: "DM Serif Display", type: "Serif", sample: "Soft classic romance" },
  { name: "Space Grotesk", type: "Sans", sample: "Modern geometric voice" },
  { name: "Anton", type: "Display", sample: "Loud poster headline" },
  { name: "Libre Baskerville", type: "Serif", sample: "Literary calm texture" },
  { name: "Montserrat", type: "Sans", sample: "Polished brand system" },
  { name: "Poppins", type: "Sans", sample: "Friendly rounded balance" },
  { name: "Bebas Neue", type: "Display", sample: "Tall cinematic impact" }
];

const words = [
  ["Kerning", "The space between individual letters, adjusted to make type feel balanced."],
  ["Ligature", "A graceful connection between letters that creates a smoother shape."],
  ["Serif", "A small finishing stroke that gives letters elegance, rhythm, and editorial charm."],
  ["Glyph", "A single designed character, symbol, or letterform within a typeface."],
  ["Baseline", "The invisible line letters sit on, keeping text visually grounded."]
];

const gallery = document.getElementById("fontGallery");
const fontSelect = document.getElementById("fontSelect");
const favoritesList = document.getElementById("favoritesList");
const preview = document.getElementById("livePreview");
const textInput = document.getElementById("textInput");
const sizeRange = document.getElementById("sizeRange");
const weightRange = document.getElementById("weightRange");
const spacingRange = document.getElementById("spacingRange");
const sizeValue = document.getElementById("sizeValue");
const weightValue = document.getElementById("weightValue");
const spacingValue = document.getElementById("spacingValue");
const toast = document.getElementById("toast");

function splitHero() {
  const title = document.getElementById("heroTitle");
  const text = title.textContent;

  title.replaceChildren();

  text.split("").forEach((letter, index) => {
    const span = document.createElement("span");
    span.textContent = letter;
    span.style.animationDelay = `${index * 0.055}s`;
    title.appendChild(span);
  });
}

function getFavs() {
  return JSON.parse(localStorage.getItem("typemuseFavorites")) || [];
}

function setFavs(favs) {
  localStorage.setItem("typemuseFavorites", JSON.stringify(favs));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1700);
}

function renderGallery() {
  const favs = getFavs();
  gallery.replaceChildren();

  fonts.forEach(font => {
    const card = document.createElement("article");
    card.className = "card";

    const cardTop = document.createElement("div");
    cardTop.className = "card-top";

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = font.type;

    const heart = document.createElement("button");
    heart.className = favs.includes(font.name) ? "heart active" : "heart";
    heart.setAttribute("aria-label", `Favorite ${font.name}`);
    heart.textContent = "♥";

    cardTop.appendChild(tag);
    cardTop.appendChild(heart);

    const middle = document.createElement("div");

    const fontPreview = document.createElement("div");
    fontPreview.className = "font-preview";
    fontPreview.style.fontFamily = `'${font.name}', sans-serif`;
    fontPreview.textContent = font.sample;

    const fontName = document.createElement("strong");
    fontName.textContent = font.name;

    middle.appendChild(fontPreview);
    middle.appendChild(fontName);

    const cardBottom = document.createElement("div");
    cardBottom.className = "card-bottom";

    const sampleText = document.createElement("span");
    sampleText.style.color = "var(--muted)";
    sampleText.style.fontWeight = "800";
    sampleText.textContent = "Aa Bb Cc 123";

    const copyBtn = document.createElement("button");
    copyBtn.className = "pill mini-copy";
    copyBtn.textContent = "CSS";

    cardBottom.appendChild(sampleText);
    cardBottom.appendChild(copyBtn);

    card.appendChild(cardTop);
    card.appendChild(middle);
    card.appendChild(cardBottom);

    heart.addEventListener("click", () => toggleFavorite(font.name));

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(`font-family: '${font.name}', sans-serif;`);
      showToast(`${font.name} CSS copied`);
    });

    gallery.appendChild(card);
  });
}

function renderSelect() {
  fontSelect.replaceChildren();

  fonts.forEach(font => {
    const option = document.createElement("option");
    option.value = font.name;
    option.textContent = font.name;
    fontSelect.appendChild(option);
  });

  fontSelect.value = "Playfair Display";
}

function renderFavorites() {
  const favs = getFavs();
  favoritesList.replaceChildren();

  if (favs.length > 0) {
    favs.forEach(name => {
      const chip = document.createElement("span");
      chip.className = "fav-chip";
      chip.style.fontFamily = `'${name}', sans-serif`;
      chip.textContent = name;
      favoritesList.appendChild(chip);
    });
  } else {
    const empty = document.createElement("p");
    empty.className = "favorites-empty";
    empty.textContent = "No favorites yet. Tap the hearts in the gallery to save your dream fonts.";
    favoritesList.appendChild(empty);
  }
}

function toggleFavorite(name) {
  const favs = getFavs();
  const next = favs.includes(name)
    ? favs.filter(f => f !== name)
    : [...favs, name];

  setFavs(next);
  renderGallery();
  renderFavorites();
  showToast(next.includes(name) ? `${name} added to favorites` : `${name} removed`);
}

function updatePreview() {
  preview.textContent = textInput.value || "Type something beautiful.";
  preview.style.fontFamily = `'${fontSelect.value}', sans-serif`;
  preview.style.fontSize = `${sizeRange.value}px`;
  preview.style.fontWeight = weightRange.value;
  preview.style.letterSpacing = `${spacingRange.value}px`;

  sizeValue.textContent = `${sizeRange.value}px`;
  weightValue.textContent = weightRange.value;
  spacingValue.textContent = `${spacingRange.value}px`;
}

function randomFont() {
  const font = fonts[Math.floor(Math.random() * fonts.length)];

  fontSelect.value = font.name;
  textInput.value = font.sample;
  sizeRange.value = Math.floor(Math.random() * 52) + 52;
  weightRange.value = [400, 600, 700, 800, 900][Math.floor(Math.random() * 5)];
  spacingRange.value = Math.floor(Math.random() * 9) - 4;

  updatePreview();
  showToast(`Generated: ${font.name}`);
  document.getElementById("playground").scrollIntoView({ behavior: "smooth" });
}

function setWordOfDay() {
  const index = new Date().getDate() % words.length;
  document.getElementById("wordOfDay").textContent = words[index][0];
  document.getElementById("wordDesc").textContent = words[index][1];
}

function copyCSS() {
  const css = `font-family: '${fontSelect.value}', sans-serif;
font-size: ${sizeRange.value}px;
font-weight: ${weightRange.value};
letter-spacing: ${spacingRange.value}px;
line-height: 1;`;

  navigator.clipboard.writeText(css);
  showToast("Playground CSS copied");
}

function resetPlayground() {
  textInput.value = "Typography is visual music.";
  fontSelect.value = "Playfair Display";
  sizeRange.value = 72;
  weightRange.value = 700;
  spacingRange.value = -2;
  updatePreview();
}

document.getElementById("themeBtn").addEventListener("click", e => {
  const dark = document.body.dataset.theme !== "dark";
  document.body.dataset.theme = dark ? "dark" : "light";
  e.currentTarget.textContent = dark ? "☀️ Light Mode" : "🌙 Dark Mode";
});

document.getElementById("randomBtn").addEventListener("click", randomFont);
document.getElementById("copyBtn").addEventListener("click", copyCSS);
document.getElementById("resetBtn").addEventListener("click", resetPlayground);

[textInput, fontSelect, sizeRange, weightRange, spacingRange].forEach(el => {
  el.addEventListener("input", updatePreview);
});

document.addEventListener("mousemove", e => {
  if (Math.random() > 0.82) {
    const trail = document.createElement("span");
    trail.className = "cursor-trail";
    trail.textContent = "Aa";
    trail.style.left = `${e.clientX}px`;
    trail.style.top = `${e.clientY}px`;
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 700);
  }
});

splitHero();
setWordOfDay();
renderSelect();
renderGallery();
renderFavorites();
updatePreview();