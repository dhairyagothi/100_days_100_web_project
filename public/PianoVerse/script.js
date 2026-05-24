const pianoKeys = document.querySelectorAll(".piano-keys .key"),
  volumeSlider = document.querySelector(".volume-slider input"),
  keysCheckbox = document.querySelector(".keys-checkbox input");

let allKeys = [];
const audio = new Audio(`tunes/a.wav`);

const playTune = (key) => {
  audio.src = `tunes/${key}.wav`;
  audio.play();

  const clickedKey = document.querySelector(`[data-key="${key}"]`);
  if (!clickedKey) return;

  clickedKey.classList.add("active");
  setTimeout(() => {
    clickedKey.classList.remove("active");
  }, 150);
};

pianoKeys.forEach((key) => {
  allKeys.push(key.dataset.key);

  // Mouse click
  key.addEventListener("click", () => playTune(key.dataset.key));

  // Touch support — fires on finger down so there's no delay
  key.addEventListener("touchstart", (e) => {
    e.preventDefault(); // prevent the 300ms click delay and double-fire
    playTune(key.dataset.key);
  }, { passive: false });
});

const handleVolume = (e) => {
  audio.volume = e.target.value;
};

const showHideKeys = () => {
  pianoKeys.forEach((key) => key.classList.toggle("hide"));
};

const pressedKey = (e) => {
  if (allKeys.includes(e.key)) playTune(e.key);
};

keysCheckbox.addEventListener("click", showHideKeys);
volumeSlider.addEventListener("input", handleVolume);
document.addEventListener("keydown", pressedKey);