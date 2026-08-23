const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const paletteContainer = document.getElementById("paletteContainer");
const gradientPreview = document.getElementById("gradientPreview");
const gradientCode = document.getElementById("gradientCode");

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

imageInput.addEventListener("change", loadImage);

function loadImage(event) {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    previewImage.src = e.target.result;
    previewImage.style.display = "block";

    previewImage.onload = function () {
      extractColors();
    };
  };

  reader.readAsDataURL(file);
}

function extractColors() {
  const width = 200;
  const height = Math.floor(
    (previewImage.naturalHeight / previewImage.naturalWidth) * width,
  );

  canvas.width = width;
  canvas.height = height;

  context.drawImage(previewImage, 0, 0, width, height);

  const imageData = context.getImageData(0, 0, width, height).data;

  const colorMap = {};

  for (let i = 0; i < imageData.length; i += 4) {
    const red = Math.round(imageData[i] / 32) * 32;
    const green = Math.round(imageData[i + 1] / 32) * 32;
    const blue = Math.round(imageData[i + 2] / 32) * 32;

    const brightness = (red + green + blue) / 3;

    if (brightness < 20 || brightness > 235) {
      continue;
    }

    const rgb = `rgb(${red}, ${green}, ${blue})`;

    if (colorMap[rgb]) {
      colorMap[rgb]++;
    } else {
      colorMap[rgb] = 1;
    }
  }

  const dominantColors = Object.entries(colorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map((color) => color[0]);

  renderPalette(dominantColors);
  createGradient(dominantColors);
}

function renderPalette(colors) {
  paletteContainer.innerHTML = "";

  colors.forEach((color) => {
    const card = document.createElement("div");
    const hex = rgbToHex(color);

    card.classList.add("color-card");
    card.style.background = color;

    card.innerHTML = `
      <div class="color-info">
        <h3>${hex}</h3>
        <p>Click to Copy</p>
      </div>
    `;

    card.addEventListener("click", () => {
      navigator.clipboard.writeText(hex);

      card.querySelector("p").textContent = "Copied!";

      setTimeout(() => {
        card.querySelector("p").textContent = "Click to Copy";
      }, 1200);
    });

    paletteContainer.appendChild(card);
  });
}

function rgbToHex(rgb) {
  const values = rgb.match(/\d+/g);

  return (
    "#" +
    values
      .map((value) => {
        const hex = Number(value).toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
      })
      .join("")
  );
}

function createGradient(colors) {
  if (colors.length < 2) {
    return;
  }

  const gradient = `
    linear-gradient(
      135deg,
      ${colors[0]},
      ${colors[1]},
      ${colors[2] || colors[0]}
    )
  `;

  gradientPreview.style.background = gradient;
  gradientCode.textContent = gradient.trim();
}
