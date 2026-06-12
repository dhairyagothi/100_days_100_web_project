function playSound(e) {
  // Determine if trigger came from keydown event or mouse click event
  const keyCode =
    e.type === "keydown" ? e.keyCode : this.getAttribute("data-key");

  // Normalizing characters to allow handling both uppercase and lowercase inputs smoothly
  const targetCode =
    typeof keyCode === "string" ? keyCode.toLowerCase() : keyCode;

  const audio = document.querySelector(
    `audio[data-key="${targetCode}"], audio[data-key="${String(targetCode).toUpperCase()}"]`,
  );
  const key = document.querySelector(
    `.key[data-key="${targetCode}"], .key[data-key="${String(targetCode).toUpperCase()}"]`,
  );

  if (!audio) return; // Stop function execution if an unmapped key was struck

  // Reset audio track to beginning pointer to handle rapid-fire key spamming instantly
  audio.currentTime = 0;
  audio.play();

  key.classList.add("playing");
}

function removeTransition(e) {
  if (e.propertyName !== "transform") return; // Skip if transition event parameter is not a transform modification
  this.classList.remove("playing");
}

// Global keydown hook registration
window.addEventListener("keydown", playSound);

// Mouse click fallback registration across elements
const keys = document.querySelectorAll(".key");
keys.forEach((key) => {
  key.addEventListener("click", playSound);
  key.addEventListener("transitionend", removeTransition);
});
