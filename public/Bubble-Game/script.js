let time = 60;
let score = 0;
let hit = 0;

function makeBubble() {
  let clutter = "";

  for (let i = 1; i <= 168; i++) {
    let rn = Math.floor(Math.random() * 10);
    clutter += `<div class="bubble">${rn}</div>`;
  }

  document.querySelector("#pbtm").innerHTML = clutter;
}
function runTimer() {
  let timerInt = setInterval(() => {
    if (time > 0) {
      time--;
      document.querySelector(".time").innerHTML = time;
    } else {
      document.querySelector("#pbtm").innerHTML = `<h1>Game Over!</h1>`;
      clearInterval(timerInt);
    }
  }, 1000);
}

function getNewHit() {
  hit = Math.floor(Math.random() * 10);
  document.querySelector(".hit").innerHTML = hit;
}

function increaseScore() {
  score += 10;
  document.querySelector(".score").innerHTML = score;
}

document.querySelector("#pbtm").addEventListener("click", function (details) {
  let det = Number(details.target.innerHTML);

  if (det === hit) {
    increaseScore();
    makeBubble();
    getNewHit();
  }
});

runTimer();
makeBubble();
getNewHit();
