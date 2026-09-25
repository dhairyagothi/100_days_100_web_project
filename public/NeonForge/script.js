const state = {
  text: "NeonForge",
  color: "#ff2bd6",
  secondaryColor: "#25d8ff",
  blur: 24,
  spread: 6,
  fontSize: 84,
  fontFamily: "'Arial Black', Impact, sans-serif",
  background: "midnight",
  customBackground: "#05050c",
  effect: "tube",
  flicker: true
};

const presets = {
  pink: { color: "#ff2bd6", secondaryColor: "#25d8ff", blur: 24, spread: 6, background: "midnight", effect: "tube" },
  blue: { color: "#25d8ff", secondaryColor: "#8a5cff", blur: 26, spread: 7, background: "violet", effect: "glitch" },
  green: { color: "#3dff90", secondaryColor: "#f5ff35", blur: 22, spread: 6, background: "teal", effect: "tube" },
  red: { color: "#ff3f45", secondaryColor: "#ffb000", blur: 30, spread: 8, background: "black", effect: "chrome" },
  white: { color: "#f8fbff", secondaryColor: "#9ed9ff", blur: 4, spread: 1, background: "midnight", effect: "solid" }
};

const backgrounds = {
  midnight: "radial-gradient(circle at 24% 18%, rgba(255, 43, 214, 0.2), transparent 28%), linear-gradient(135deg, #05050c 0%, #10152b 56%, #070712 100%)",
  black: "#020206",
  violet: "radial-gradient(circle at 70% 18%, rgba(145, 92, 255, 0.28), transparent 28%), linear-gradient(135deg, #12071f 0%, #080811 100%)",
  teal: "radial-gradient(circle at 28% 20%, rgba(40, 255, 214, 0.22), transparent 30%), linear-gradient(135deg, #031111 0%, #071727 100%)"
};

const elements = {
  preview: document.querySelector("#neonPreview"),
  stage: document.querySelector("#stageWrap"),
  textInput: document.querySelector("#textInput"),
  colorInput: document.querySelector("#colorInput"),
  secondaryColorInput: document.querySelector("#secondaryColorInput"),
  blurInput: document.querySelector("#blurInput"),
  spreadInput: document.querySelector("#spreadInput"),
  fontSizeInput: document.querySelector("#fontSizeInput"),
  fontSelect: document.querySelector("#fontSelect"),
  effectSelect: document.querySelector("#effectSelect"),
  backgroundSelect: document.querySelector("#backgroundSelect"),
  backgroundColorInput: document.querySelector("#backgroundColorInput"),
  customBgField: document.querySelector("#customBgField"),
  flickerInput: document.querySelector("#flickerInput"),
  blurValue: document.querySelector("#blurValue"),
  spreadValue: document.querySelector("#spreadValue"),
  fontSizeValue: document.querySelector("#fontSizeValue"),
  cssCode: document.querySelector("#cssCode"),
  copyButton: document.querySelector("#copyButton"),
  downloadButton: document.querySelector("#downloadButton"),
  presets: document.querySelectorAll(".preset")
};

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const value = parseInt(normalized, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255
  };
}

function hexToRgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function isLightColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  return (r * 0.299 + g * 0.587 + b * 0.114) > 220;
}

function getTextShadow() {
  if (isLightColor(state.color)) {
    return [
      "0 0 1px rgba(255, 255, 255, 0.9)",
      `0 0 ${Math.max(2, Math.round(state.blur * 0.55))}px ${hexToRgba(state.color, 0.48)}`,
      `0 0 ${Math.max(4, Math.round(state.blur * 1.1))}px ${hexToRgba(state.secondaryColor, 0.3)}`,
      `0 0 ${Math.max(7, Math.round(state.blur * 1.7))}px ${hexToRgba(state.secondaryColor, 0.16)}`
    ].join(",\n    ");
  }

  const layers = [
    "0 0 2px #ffffff",
    "0 0 8px #ffffff",
    `0 0 ${Math.max(10, Math.round(state.blur * 0.65))}px ${state.color}`
  ];

  for (let i = 1; i <= state.spread; i += 1) {
    const blur = Math.round(state.blur * (i * 0.72));
    const color = i % 3 === 0 ? state.secondaryColor : state.color;
    layers.push(`0 0 ${blur}px ${color}`);
  }

  layers.push(`0 0 ${Math.round(state.blur * 4)}px ${state.secondaryColor}`);
  return layers.join(",\n    ");
}

function getBackground() {
  if (state.background === "custom") {
    return state.customBackground;
  }

  return backgrounds[state.background];
}

function getGeneratedCss() {
  const animationLine = state.flicker ? "  animation: neonFlicker 2.8s infinite alternate;\n" : "";

  return `.neon-text {
  color: ${state.color};
  font-family: ${state.fontFamily};
  font-size: ${state.fontSize}px;
  font-weight: 900;
  line-height: 1.08;
  text-align: center;
  text-shadow:
    ${getTextShadow()};
  -webkit-text-stroke: ${state.effect === "solid" ? "0" : "1px rgba(255, 255, 255, 0.62)"};
${animationLine}}

.neon-text::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  z-index: -1;
  color: ${state.secondaryColor};
  filter: blur(12px);
  transform: translate(5px, 5px);
  pointer-events: none;
}

.neon-background {
  background: ${getBackground()};
}

@keyframes neonFlicker {
  0%, 19%, 21%, 23%, 54%, 56%, 100% {
    opacity: 1;
    filter: brightness(1.16);
  }
  20%, 22%, 55% {
    opacity: 0.74;
    filter: brightness(0.82);
  }
}`;
}

function updateActivePreset() {
  let activePreset = "";

  Object.entries(presets).forEach(([name, preset]) => {
    if (
      preset.color === state.color &&
      preset.secondaryColor === state.secondaryColor &&
      preset.blur === state.blur &&
      preset.spread === state.spread &&
      preset.effect === state.effect
    ) {
      activePreset = name;
    }
  });

  elements.presets.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.preset === activePreset);
  });
}

function render() {
  const rgb = hexToRgb(state.color);
  const secondaryRgb = hexToRgb(state.secondaryColor);
  const background = getBackground();

  document.documentElement.style.setProperty("--accent", state.color);
  document.documentElement.style.setProperty("--accent-rgb", `${rgb.r}, ${rgb.g}, ${rgb.b}`);
  document.documentElement.style.setProperty("--secondary", state.secondaryColor);
  document.documentElement.style.setProperty("--secondary-rgb", `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);
  document.documentElement.style.setProperty("--preview-shadow", getTextShadow());
  document.documentElement.style.setProperty("--stage-bg", background);

  elements.preview.textContent = state.text.trim() || "NeonForge";
  elements.preview.dataset.text = state.text.trim() || "NeonForge";
  elements.preview.className = `neon-sign effect-${state.effect}`;
  elements.preview.style.color = state.color;
  elements.preview.style.fontFamily = state.fontFamily;
  elements.preview.style.fontSize = `${state.fontSize}px`;
  elements.preview.style.textShadow = getTextShadow();
  elements.preview.style.animation = state.flicker ? "neonFlicker 2.8s infinite alternate" : "none";
  elements.stage.style.background = background;

  elements.blurValue.textContent = `${state.blur}px`;
  elements.spreadValue.textContent = state.spread;
  elements.fontSizeValue.textContent = `${state.fontSize}px`;
  elements.customBgField.style.display = state.background === "custom" ? "grid" : "none";
  elements.cssCode.textContent = getGeneratedCss();

  updateActivePreset();
}

function syncInputs() {
  elements.textInput.value = state.text;
  elements.colorInput.value = state.color;
  elements.secondaryColorInput.value = state.secondaryColor;
  elements.blurInput.value = state.blur;
  elements.spreadInput.value = state.spread;
  elements.fontSizeInput.value = state.fontSize;
  elements.fontSelect.value = state.fontFamily;
  elements.effectSelect.value = state.effect;
  elements.backgroundSelect.value = state.background;
  elements.backgroundColorInput.value = state.customBackground;
  elements.flickerInput.checked = state.flicker;
}

function copyCss() {
  navigator.clipboard.writeText(elements.cssCode.textContent).then(() => {
    elements.copyButton.textContent = "Copied";
    window.setTimeout(() => {
      elements.copyButton.textContent = "Copy CSS";
    }, 1200);
  }).catch(() => {
    elements.copyButton.textContent = "Select Code";
    window.setTimeout(() => {
      elements.copyButton.textContent = "Copy CSS";
    }, 1400);
  });
}

function drawGrid(ctx, width, height) {
  ctx.save();
  ctx.globalAlpha = 0.14;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;

  for (let x = 0; x <= width; x += 46) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += 46) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.restore();
}

function paintCanvasBackground(ctx, width, height) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);

  if (state.background === "black") {
    gradient.addColorStop(0, "#020206");
    gradient.addColorStop(1, "#050509");
  } else if (state.background === "violet") {
    gradient.addColorStop(0, "#12071f");
    gradient.addColorStop(1, "#080811");
  } else if (state.background === "teal") {
    gradient.addColorStop(0, "#031111");
    gradient.addColorStop(1, "#071727");
  } else if (state.background === "custom") {
    gradient.addColorStop(0, state.customBackground);
    gradient.addColorStop(1, state.customBackground);
  } else {
    gradient.addColorStop(0, "#05050c");
    gradient.addColorStop(0.58, "#10152b");
    gradient.addColorStop(1, "#070712");
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  drawGrid(ctx, width, height);
}

function downloadPreview() {
  const canvas = document.createElement("canvas");
  const width = 1400;
  const height = 800;
  const ctx = canvas.getContext("2d");
  const fontName = state.fontFamily.split(",")[0].replaceAll("'", "");
  const text = state.text.trim() || "NeonForge";

  canvas.width = width;
  canvas.height = height;
  paintCanvasBackground(ctx, width, height);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `900 ${Math.round(state.fontSize * 1.55)}px ${fontName}`;
  ctx.fillStyle = state.color;
  ctx.shadowColor = state.color;
  ctx.shadowBlur = state.blur * 3.2;

  for (let i = 0; i < state.spread; i += 1) {
    ctx.shadowColor = i % 3 === 0 ? state.secondaryColor : state.color;
    ctx.fillText(text, width / 2, height / 2);
  }

  ctx.shadowBlur = 6;
  ctx.shadowColor = "#ffffff";
  ctx.fillText(text, width / 2, height / 2);

  const link = document.createElement("a");
  link.download = "neonforge-preview.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

elements.textInput.addEventListener("input", (event) => {
  state.text = event.target.value;
  render();
});

elements.colorInput.addEventListener("input", (event) => {
  state.color = event.target.value;
  render();
});

elements.secondaryColorInput.addEventListener("input", (event) => {
  state.secondaryColor = event.target.value;
  render();
});

elements.blurInput.addEventListener("input", (event) => {
  state.blur = Number(event.target.value);
  render();
});

elements.spreadInput.addEventListener("input", (event) => {
  state.spread = Number(event.target.value);
  render();
});

elements.fontSizeInput.addEventListener("input", (event) => {
  state.fontSize = Number(event.target.value);
  render();
});

elements.fontSelect.addEventListener("change", (event) => {
  state.fontFamily = event.target.value;
  render();
});

elements.effectSelect.addEventListener("change", (event) => {
  state.effect = event.target.value;
  render();
});

elements.backgroundSelect.addEventListener("change", (event) => {
  state.background = event.target.value;
  render();
});

elements.backgroundColorInput.addEventListener("input", (event) => {
  state.customBackground = event.target.value;
  render();
});

elements.flickerInput.addEventListener("change", (event) => {
  state.flicker = event.target.checked;
  render();
});

elements.presets.forEach((button) => {
  button.addEventListener("click", () => {
    Object.assign(state, presets[button.dataset.preset]);
    syncInputs();
    render();
  });
});

elements.copyButton.addEventListener("click", copyCss);
elements.downloadButton.addEventListener("click", downloadPreview);

syncInputs();
render();
