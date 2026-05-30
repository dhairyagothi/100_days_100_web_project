const board = document.getElementById("board");

const statusText = document.getElementById("statusText");
const turnChip = document.getElementById("turnChip");

const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const scoreD = document.getElementById("scoreD");

const newRoundBtn = document.getElementById("newRoundBtn");
const resetAllBtn = document.getElementById("resetAllBtn");

const winnerModal = document.getElementById("winnerModal");
const winnerTitle = document.getElementById("winnerTitle");
const winnerSubtitle = document.getElementById("winnerSubtitle");

const winnerNext = document.getElementById("winnerNext");
const winnerClose = document.getElementById("winnerClose");

const modeSelect = document.getElementById("modeSelect");
const themeSelect = document.getElementById("themeSelect");

const hintBtn = document.getElementById("hintBtn");
const undoBtn = document.getElementById("undoBtn");

const historyList = document.getElementById("historyList");

let gameBoard = Array(9).fill("");
let currentPlayer = "X";
let gameOver = false;

let moveHistory = [];

let scores = {
X: 0,
O: 0,
D: 0
};

const WIN_LINES = [
[0,1,2],
[3,4,5],
[6,7,8],
[0,3,6],
[1,4,7],
[2,5,8],
[0,4,8],
[2,4,6]
];

function renderBoard() {


board.innerHTML = "";

gameBoard.forEach((value,index) => {

    const cell = document.createElement("button");

    cell.className = "cell";

    if(value === "X") {
        cell.classList.add("mark-x");
    }

    if(value === "O") {
        cell.classList.add("mark-o");
    }

    cell.textContent = value;

    cell.addEventListener("click", () => {
        handleMove(index);
    });

    board.appendChild(cell);
});


}

function handleMove(index){


if(gameOver) return;

if(gameBoard[index] !== "") return;

gameBoard[index] = currentPlayer;

moveHistory.push({
    player: currentPlayer,
    cell: index + 1
});

updateHistory();

const winLine = getWinner();

if(winLine){

    highlightWin(winLine);

    scores[currentPlayer]++;

    updateScores();

    gameOver = true;

    showWinner(currentPlayer);

    return;
}

if(gameBoard.every(cell => cell !== "")){

    scores.D++;

    updateScores();

    gameOver = true;

    showDraw();

    return;
}

currentPlayer =
    currentPlayer === "X" ? "O" : "X";

updateStatus();

renderBoard();

const mode = modeSelect.value;

if(
    mode !== "pvp" &&
    currentPlayer === "O" &&
    !gameOver
){
    setTimeout(cpuMove,400);
}


}

function cpuMove(){


const available = [];

gameBoard.forEach((cell,index)=>{
    if(cell === "") {
        available.push(index);
    }
});

if(!available.length) return;

const mode = modeSelect.value;

let move;

if(mode === "cpu-easy"){

    move =
        available[
            Math.floor(
                Math.random()*available.length
            )
        ];
}

else if(mode === "cpu-medium"){

    if(Math.random() < 0.6){

        move = getBestMove();

    } else {

        move =
            available[
                Math.floor(
                    Math.random()*available.length
                )
            ];
    }
}

else {

    move = getBestMove();
}

handleMove(move);


}

function getBestMove(){


for(const line of WIN_LINES){

    const [a,b,c] = line;

    const cells = [
        gameBoard[a],
        gameBoard[b],
        gameBoard[c]
    ];

    if(
        cells.filter(v => v === "O").length === 2 &&
        cells.includes("")
    ){
        return line[
            cells.indexOf("")
        ];
    }
}

for(const line of WIN_LINES){

    const [a,b,c] = line;

    const cells = [
        gameBoard[a],
        gameBoard[b],
        gameBoard[c]
    ];

    if(
        cells.filter(v => v === "X").length === 2 &&
        cells.includes("")
    ){
        return line[
            cells.indexOf("")
        ];
    }
}

if(gameBoard[4] === ""){
    return 4;
}

const free = [];

gameBoard.forEach((cell,index)=>{
    if(cell === "") {
        free.push(index);
    }
});

return free[
    Math.floor(Math.random()*free.length)
];


}

function getWinner(){


for(const line of WIN_LINES){

    const [a,b,c] = line;

    if(
        gameBoard[a] &&
        gameBoard[a] === gameBoard[b] &&
        gameBoard[a] === gameBoard[c]
    ){
        return line;
    }
}

return null;


}

function highlightWin(line){


renderBoard();

line.forEach(index => {

    board.children[index]
        .classList.add("win-cell");
});


}

function updateStatus(){


statusText.textContent =
    currentPlayer + "'s Turn";

turnChip.textContent =
    "Turn: " + currentPlayer;


}

function updateScores(){

scoreX.textContent = scores.X;
scoreO.textContent = scores.O;
scoreD.textContent = scores.D;

}

function updateHistory(){


historyList.innerHTML = "";

moveHistory.slice(-10).forEach(move => {

    const li =
        document.createElement("li");

    li.textContent =
        move.player +
        " → Cell " +
        move.cell;

    historyList.appendChild(li);
});


}

function showWinner(player){


winnerTitle.textContent =
    "Player " + player + " Wins!";

winnerSubtitle.textContent =
    "Ready for the next round?";

winnerModal.classList.add("show");


}

function showDraw(){


winnerTitle.textContent =
    "Draw!";

winnerSubtitle.textContent =
    "Nobody wins this round.";

winnerModal.classList.add("show");


}

function newRound(){


gameBoard = Array(9).fill("");

currentPlayer = "X";

gameOver = false;

moveHistory = [];

updateHistory();

updateStatus();

winnerModal.classList.remove("show");

renderBoard();


}

function resetScores(){


scores = {
    X:0,
    O:0,
    D:0
};

updateScores();

newRound();


}

function undoMove(){


if(!moveHistory.length) return;

const last = moveHistory.pop();

gameBoard[last.cell - 1] = "";

currentPlayer = last.player;

gameOver = false;

updateHistory();

updateStatus();

renderBoard();


}

function showHint(){


const move = getBestMove();

renderBoard();

if(board.children[move]){

    board.children[move]
        .classList.add("hint-cell");
}


}

themeSelect.addEventListener(
"change",
function(){


    document.body.setAttribute(
        "data-theme",
        this.value
    );
}


);

newRoundBtn.addEventListener(
"click",
newRound
);

resetAllBtn.addEventListener(
"click",
resetScores
);

undoBtn.addEventListener(
"click",
undoMove
);

hintBtn.addEventListener(
"click",
showHint
);

winnerNext.addEventListener(
"click",
newRound
);

winnerClose.addEventListener(
"click",
()=>{
winnerModal.classList.remove("show");
}
);

updateStatus();
updateScores();
renderBoard();
