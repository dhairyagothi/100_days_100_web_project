const slider       = document.getElementById("slider");
const directionBtn = document.getElementById("directionBtn");
const pauseBtn     = document.getElementById("pauseBtn");
const themeBtn     = document.getElementById("themeBtn");

let isPaused   = false;
let isReversed = false;

function getCurrentAngle() {
  const style  = window.getComputedStyle(slider);
  const matrix = new DOMMatrixReadOnly(style.transform);
  
  const angle  = Math.round(Math.atan2(matrix.m13, matrix.m11) * (180 / Math.PI));
  return ((angle % 360) + 360) % 360;
}

function freeze() {
  const angle = getCurrentAngle();
  slider.style.animation = "none";
  slider.style.transform = `perspective(1400px) rotateY(${angle}deg)`;
  return angle;
}

function resume(fromAngle, reverse) {
  const old = document.getElementById("__dyn_kf");
  if (old) old.remove();

  const endAngle  = reverse ? fromAngle - 360 : fromAngle + 360;
  const duration  = getComputedStyle(document.documentElement)
                      .getPropertyValue("--duration").trim() || "18s";

  const style = document.createElement("style");
  style.id    = "__dyn_kf";
  style.textContent = `
    @keyframes __resume {
      from { transform: perspective(1400px) rotateY(${fromAngle}deg); }
      to   { transform: perspective(1400px) rotateY(${endAngle}deg); }
    }
  `;
  document.head.appendChild(style);

  slider.style.transform = "";
  slider.style.animation = `__resume ${duration} linear infinite`;
}

pauseBtn.addEventListener("click", () => {
  if (!isPaused) {
    freeze();
    pauseBtn.querySelector(".btn-label").textContent = "Resume Rotation";
  } else {
    const frozenAngle = parseFloat(
      slider.style.transform.match(/rotateY\(([-\d.]+)deg\)/)?.[1] ?? 0
    );
    resume(frozenAngle, isReversed);
    pauseBtn.querySelector(".btn-label").textContent = "Pause Rotation";
  }
  isPaused = !isPaused;
});


directionBtn.addEventListener("click", () => {
  isReversed = !isReversed;

  if (isPaused) {
    directionBtn.querySelector(".btn-label").textContent =
      isReversed ? "Normal Rotation" : "Reverse Rotation";
    return;
  }

  const angle = getCurrentAngle();
  resume(angle, isReversed);

  directionBtn.querySelector(".btn-label").textContent =
    isReversed ? "Normal Rotation" : "Reverse Rotation";
});

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  const isLight = document.body.classList.contains("light-theme");
  themeBtn.querySelector(".btn-label").textContent =
    isLight ? "Dark Mode" : "Light Mode";
});

document.querySelectorAll(".ctrl-btn").forEach(btn => {
  btn.addEventListener("mousemove", e => {
    const rect   = btn.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);  // -1 … 1
    const dy     = (e.clientY - cy) / (rect.height / 2);
    const pull   = 6; // max pixel pull
    btn.style.setProperty("--mx", `${dx * pull}px`);
    btn.style.setProperty("--my", `${dy * pull}px`);
    btn.style.transform =
      `translateY(-5px) scale(1.04) translate(${dx * pull}px, ${dy * pull}px)`;
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "";
  });
});