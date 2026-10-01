
function generateColors() {
  const input = document.getElementById("emotionInput").value.toLowerCase().trim();

  const title = document.getElementById("emotionTitle");
  const text = document.getElementById("emotionText");
  const palette = document.getElementById("palette");
  const result = document.getElementById("result");

  let colors = [];
  let message = "";
  let bg = "";

  // 🛡 SAFE COLOR VALIDATION
  const isValidColor = (() => {
    const s = new Option().style;
    s.color = input;
    return s.color !== "";
  })();

  if (isValidColor) {

    colors = generateShades(input);

    const emotionMap = getColorEmotion(input);

    message = `🎨 Color detected: "${input}" → ${emotionMap}`;

    bg = `linear-gradient(120deg, ${input}, black)`;

  } else {

    colors = ["#888", "#aaa", "#ccc"];

    message = "🧠 Unknown input — no valid color found";

    bg = "linear-gradient(120deg, #232526, #414345)";
  }

  document.body.style.background = bg;

  title.innerText = `Input: ${input || "empty"}`;
  text.innerText = message;

  palette.innerHTML = "";

  colors.forEach(color => {
    const box = document.createElement("div");
    box.className = "color-box";
    box.style.background = color;
    palette.appendChild(box);
  });

  result.classList.remove("hidden");
}


// 🎨 COLOR → EMOTION MAPPING
function getColorEmotion(color) {
  const c = color.toLowerCase();

  if (c.includes("yellow") || c.includes("gold")) {
    return "happiness, optimism, energy ✨";
  }

  if (c.includes("blue")) {
    return "calmness, trust, focus 🌊";
  }

  if (c.includes("red")) {
    return "passion, anger, intensity 🔥";
  }

  if (c.includes("green")) {
    return "growth, balance, peace 🌿";
  }

  if (c.includes("black")) {
    return "mystery, power, depth 🌑";
  }

  if (c.includes("white")) {
    return "purity, clarity, simplicity ⚪";
  }

  return "complex emotional mix 🎭";
}


// 🌈 SAFE SHADE GENERATOR (NO CRASH VERSION)
function generateShades(color) {
  const temp = document.createElement("div");
  temp.style.color = color;
  document.body.appendChild(temp);

  const computed = getComputedStyle(temp).color;
  document.body.removeChild(temp);

  const rgb = computed.match(/\d+/g);

  // 🛡 SAFETY CHECK
  if (!rgb || rgb.length < 3) {
    return [color, "#888", "#ccc"];
  }

  let r = parseInt(rgb[0]);
  let g = parseInt(rgb[1]);
  let b = parseInt(rgb[2]);

  function shade(factor) {
    return `rgb(
      ${Math.max(0, Math.min(255, r * factor))},
      ${Math.max(0, Math.min(255, g * factor))},
      ${Math.max(0, Math.min(255, b * factor))}
    )`;
  }

  return [
    color,
    shade(0.8),
    shade(0.6)
  ];
}


// 🔄 RESET FUNCTION
function resetAll() {
  document.getElementById("emotionInput").value = "";
  document.getElementById("result").classList.add("hidden");
  document.body.style.background = "linear-gradient(120deg, #000, #333)";
}


// 📋 COPY PALETTE FUNCTION
function copyPalette() {
  const boxes = document.querySelectorAll(".color-box");
  let colors = [];

  boxes.forEach(box => {
    colors.push(box.style.background);
  });

  if (colors.length === 0) {
    alert("No colors to copy!");
    return;
  }

  navigator.clipboard.writeText(colors.join(", "));
  alert("Colors copied to clipboard!");
}
