const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const livesElement = document.getElementById("lives");
const riskBar = document.getElementById("riskBar");
const messageBox = document.getElementById("message");

const safeBtn = document.getElementById("safeBtn");
const riskBtn = document.getElementById("riskBtn");
const restartBtn = document.getElementById("restartBtn");

let score = 0;
let lives = 3;
let turns = 0;
let riskLevel = 10;

let highScore =
Number(localStorage.getItem("luckSkillHighScore")) || 0;

highScoreElement.textContent = highScore;

const gameOverModal =
new bootstrap.Modal(
document.getElementById("gameOverModal")
);

function updateUI(){

scoreElement.textContent = score;
livesElement.textContent = lives;

riskBar.style.width =
    riskLevel + "%";

riskBar.textContent =
    riskLevel + "%";

if(riskLevel < 40){
    riskBar.className =
    "progress-bar bg-success";
}
else if(riskLevel < 70){
    riskBar.className =
    "progress-bar bg-warning";
}
else{
    riskBar.className =
    "progress-bar bg-danger";
}

scoreElement.classList.add("pulse");

setTimeout(()=>{
    scoreElement.classList.remove("pulse");
},300);

if(score > highScore){

    highScore = score;

    localStorage.setItem(
        "luckSkillHighScore",
        highScore
    );

    highScoreElement.textContent =
        highScore;
}

if(lives <= 0){
    endGame();
}


}

function safeChoice(){

const gain =
Math.floor(Math.random()*6)+5;

score += gain;

turns++;

messageBox.innerHTML =
`✅ Safe move! You gained ${gain} points.`;

riskLevel += 5;

randomEvent();

updateUI();


}

function riskChoice(){

const random =
Math.random();

turns++;

if(random < 0.55){

    let reward =
    Math.floor(Math.random()*25)+15;

    score += reward;

    messageBox.innerHTML =
    `🔥 Big win! You gained ${reward} points.`;

}else{

    let loss =
    Math.floor(Math.random()*20)+10;

    score -= loss;

    lives--;

    messageBox.innerHTML =
    `💀 Bad luck! You lost ${loss} points and 1 life.`;
}

riskLevel += 10;

randomEvent();

updateUI();


}

function randomEvent(){

if(turns % 3 !== 0)
    return;

const events = [

    {
        text:"🍀 Lucky bonus! +20",
        value:20
    },

    {
        text:"💰 Treasure found! +15",
        value:15
    },

    {
        text:"⚠ Trap activated! -15",
        value:-15
    },

    {
        text:"🌩 Storm damage! -20",
        value:-20
    }

];

const event =
events[
    Math.floor(
        Math.random() *
        events.length
    )
];

score += event.value;

messageBox.innerHTML +=
`<br>${event.text}`;


}

function endGame(){


safeBtn.disabled = true;
riskBtn.disabled = true;

document.getElementById(
    "finalScore"
).textContent =
`Final Score: ${score}`;

gameOverModal.show();


}

function restartGame(){


score = 0;
lives = 3;
turns = 0;
riskLevel = 10;

safeBtn.disabled = false;
riskBtn.disabled = false;

messageBox.innerHTML =
"Start playing and test your luck!";

updateUI();


}

safeBtn.addEventListener(
"click",
safeChoice
);

riskBtn.addEventListener(
"click",
riskChoice
);

restartBtn.addEventListener(
"click",
restartGame
);

updateUI();
