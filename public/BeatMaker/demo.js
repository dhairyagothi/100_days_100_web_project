const snareBeat = document.getElementById("sAudio"); //snare ses doyamıza erişim sağladık
const snareBtn = document.querySelector(".snare-btn");

const kickBeat = document.getElementById("kAudio"); //snare ses doyamıza erişim sağladık
const kickBtn = document.querySelector(".kick-btn");

const boomBeat = document.getElementById("bAudio"); //snare ses doyamıza erişim sağladık
const boomBtn = document.querySelector(".boom-btn");


const playBtn = document.getElementById("play");
const stopBtn = document.getElementById("stop");

const snares = document.querySelectorAll(".snare");
const kicks = document.querySelectorAll(".kick");
const booms = document.querySelectorAll(".boom");

const addBtns = (list) => {
  list.forEach(el => {
    el.addEventListener("click", (e) => {
      console.log(e);
      if(e.target.classList.contains("play")) {
        e.target.classList.remove("play");
      } else {
        e.target.classList.add("play");
      }
    })
  });
}

addBtns(snares);
addBtns(kicks);
addBtns(booms);


let tempo = 300;

const iterate = (list, timing, sound) => {

  list.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add("active-btn");
      if(el.classList.contains("play")) {
        sound();
      }
      setTimeout(() => {
        el.classList.remove("active-btn");
      }, timing)
    }, i * timing)
  });

};

snareBtn.addEventListener("click", () => playSnare());
kickBtn.addEventListener("click", () => playKick());
boomBtn.addEventListener("click", () => playBoom());


const playSnare = () => {
  snareBeat.currentTime = 0;
  snareBeat.play();
}

const playKick = () => {
  kickBeat.currentTime = 0;
  kickBeat.play();
}

const playBoom = () => {
  boomBeat.currentTime = 0;
  boomBeat.play();
}

const playSounds = (i) => {
  iterate(snares, tempo, playSnare);
  iterate(booms, tempo, playBoom);
  iterate(kicks, tempo, playKick);

}

let musicPlaying;

const play = () => {
  musicPlaying = setInterval(playSounds, tempo*8);
  playBtn.style.display = "none";
  stopBtn.style.display = "block";
}

const stop = () => {
  clearInterval(musicPlaying);
  stopBtn.style.display = "none";
  playBtn.style.display = "block";
}
// Theme toggle
  const themeBtn = document.getElementById("themeToggle");

    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("light-theme");

      themeBtn.textContent =
        document.body.classList.contains("light-theme")
          ? "☀️"
          : "🌙";
    });