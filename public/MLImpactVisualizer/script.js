const weights = {
  age: 0.02,
  income: 0.04,
  experience: 0.05,
  credit: 0.03
};

const bias = -10;

const sliders = ["age", "income", "experience", "credit"];
const ctx = document.getElementById("impactChart").getContext("2d");

sliders.forEach(id => {
  const slider = document.getElementById(id);
  const span = document.getElementById(id + "Val");

  slider.addEventListener("input", () => {
    span.textContent = slider.value;
    updatePrediction();
  });
});

function updatePrediction() {
  const values = {};
  sliders.forEach(id => {
    values[id] = parseFloat(document.getElementById(id).value);
  });

  let prediction = bias;
  const contributions = {};

  sliders.forEach(id => {
    contributions[id] = values[id] * weights[id];
    prediction += contributions[id];
  });

  document.getElementById("predictionValue").textContent =
    prediction.toFixed(2);

  drawChart(contributions);
}

function drawChart(contributions) {
  const canvas = ctx.canvas;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const keys = Object.keys(contributions);
  const maxVal = Math.max(...Object.values(contributions).map(v => Math.abs(v))) * 1.2;

  const barWidth = 50;
  const spacing = 30;

  keys.forEach((key, i) => {
    const value = contributions[key];
    const x = 40 + i * (barWidth + spacing);
    const barHeight = (value / maxVal) * 100;

    ctx.fillStyle = value >= 0 ? "#22c55e" : "#ef4444";
    ctx.fillRect(
      x,
      canvas.height / 2 - barHeight,
      barWidth,
      barHeight
    );

    ctx.fillStyle = "#000";
    ctx.fillText(key, x + 5, canvas.height - 10);
  });

  ctx.beginPath();
  ctx.moveTo(0, canvas.height / 2);
  ctx.lineTo(canvas.width, canvas.height / 2);
  ctx.strokeStyle = "#94a3b8";
  ctx.stroke();
}

updatePrediction();