const getRuleBox = document.querySelector(".box");
const getGameBox = document.querySelector(".game");
const getWinBox = document.querySelector(".you-win");
const getLoseBox = document.querySelector(".you-lost");
const getDrawBox = document.querySelector(".tie-up");
const getRock = document.querySelector(".stone1");
const getPaper = document.querySelector(".paper1");
const getScissor = document.querySelector(".scissor1");
const opt_U1 = document.getElementById("opt-U1");
const opt_P1 = document.getElementById("opt-P1");
const opt_U2 = document.getElementById("opt-U2");
const opt_P2 = document.getElementById("opt-P2");
const opt_U3 = document.getElementById("opt-U3");
const opt_P3 = document.getElementById("opt-P3");
const com_score = document.getElementById("comscore");
const your_score = document.getElementById("youscore");

// Initialize local storage parameters safely
if (localStorage.getItem("clickcount") === null || localStorage.getItem("clickcount") === "undefined") {
  localStorage.setItem("clickcount", 0);
}
if (localStorage.getItem("clickcount2") === null || localStorage.getItem("clickcount2") === "undefined") {
  localStorage.setItem("clickcount2", 0);
}

function resetscore() {
  localStorage.setItem("clickcount", 0); 
  localStorage.setItem("clickcount2", 0); 
  your_score.innerHTML = 0;
  com_score.innerHTML = 0;
  alert("Resetting your score!");
}

// Keeping your nice purple bottom-left button!
const resetButton = document.createElement("button");
resetButton.innerText = "Reset Score";
resetButton.style.marginLeft = "150px";
resetButton.style.backgroundColor = "purple";
resetButton.style.color = "white";
resetButton.style.border = "2px solid white";
resetButton.style.fontSize = "20px";
resetButton.style.padding = "5px 20px";
resetButton.style.cursor = "pointer";
resetButton.style.borderRadius = "5px";
resetButton.style.display = "inline-block";
resetButton.onclick = resetscore;
document.body.appendChild(resetButton);

function displayscore() {
  your_score.innerHTML = localStorage.getItem("clickcount") || 0;
  com_score.innerHTML = localStorage.getItem("clickcount2") || 0;
}
displayscore();

function popup() {
  getRuleBox.style.display = "block";
}
function popdown() {
  getRuleBox.style.display = "none";
}

function replay() {
  getWinBox.style.display = "none";
  getLoseBox.style.display = "none";
  getDrawBox.style.display = "none";
  getGameBox.style.display = "block";
}

function getComputerChoice() {
  const choices = ["rock", "paper", "scissor"];
  const randomNumber = Math.floor(Math.random() * 3);
  return choices[randomNumber];
}

function loses(userOutput, pcOutput) {
  getLoseBox.style.display = "flex";
  getGameBox.style.display = "none";
  
  if (typeof Storage !== "undefined") {
    let currentScore = Number(localStorage.getItem("clickcount2")) || 0;
    localStorage.setItem("clickcount2", currentScore + 1);
    com_score.innerHTML = localStorage.getItem("clickcount2");
  }

  const cloneU = userOutput.cloneNode(true);
  while (opt_U2.firstChild) opt_U2.firstChild.remove();
  opt_U2.appendChild(cloneU);
  
  const cloneP = pcOutput.cloneNode(true);
  while (opt_P2.firstChild) opt_P2.firstChild.remove();
  opt_P2.appendChild(cloneP);
}

function win(userOutput, pcOutput) {
  getWinBox.style.display = "flex";
  getGameBox.style.display = "none";

  if (typeof Storage !== "undefined") {
    let currentScore = Number(localStorage.getItem("clickcount")) || 0;
    localStorage.setItem("clickcount", currentScore + 1);
    your_score.innerHTML = localStorage.getItem("clickcount");
  }

  const cloneU = userOutput.cloneNode(true);
  while (opt_U1.firstChild) opt_U1.firstChild.remove();
  opt_U1.appendChild(cloneU);
  
  const cloneP = pcOutput.cloneNode(true);
  while (opt_P1.firstChild) opt_P1.firstChild.remove();
  opt_P1.appendChild(cloneP);
}

function draw(userOutput, pcOutput) {
  getDrawBox.style.display = "flex";
  getGameBox.style.display = "none";

  const cloneU = userOutput.cloneNode(true);
  while (opt_U3.firstChild) opt_U3.firstChild.remove();
  opt_U3.appendChild(cloneU);
  
  const cloneP = pcOutput.cloneNode(true);
  while (opt_P3.firstChild) opt_P3.firstChild.remove();
  opt_P3.appendChild(cloneP);
}

function game(userChoice) {
  const computerChoice = getComputerChoice();
  let computerOutput = "";
  let userOutput = "";

  if (userChoice === "rock") userOutput = getRock;
  else if (userChoice === "paper") userOutput = getPaper;
  else if (userChoice === "scissor") userOutput = getScissor;

  if (computerChoice === "rock") computerOutput = getRock;
  else if (computerChoice === "paper") computerOutput = getPaper;
  else if (computerChoice === "scissor") computerOutput = getScissor;

  switch (userChoice + computerChoice) {
    case "paperrock":
    case "rockscissor":
    case "scissorpaper":
      win(userOutput, computerOutput);
      break;
    case "rockpaper":
    case "scissorrock":
    case "paperscissor":
      loses(userOutput, computerOutput);
      break;
    case "rockrock":
    case "scissorscissor":
    case "paperpaper":
      draw(userOutput, computerOutput);
      break;
  }
}

// Wire up missing interaction event listeners directly to selectors
if (getRock) getRock.addEventListener("click", () => game("rock"));
if (getPaper) getPaper.addEventListener("click", () => game("paper"));
if (getScissor) getScissor.addEventListener("click", () => game("scissor"));

// Wire up replay buttons across result screens
document.querySelectorAll(".play-again, .next").forEach(btn => {
  btn.addEventListener("click", replay);
});

// FIX: Target that small broken purple HTML button specifically and hide it!
const smallUglyResetBtn = document.querySelector(".reset");
if (smallUglyResetBtn) {
  smallUglyResetBtn.style.display = "none";
}