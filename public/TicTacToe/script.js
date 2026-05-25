const boxes = document.querySelectorAll(".box");

const statusText = document.getElementById("statusText");
const turnChip = document.getElementById("turnChip");

const scoreO = document.getElementById("scoreO");
const scoreX = document.getElementById("scoreX");
const scoreD = document.getElementById("scoreD");

const resetRound = document.getElementById("resetRound");
const resetAll = document.getElementById("resetAll");

const winnerModal = document.getElementById("winnerModal");
const winnerTitle = document.getElementById("winnerTitle");
const winnerNext = document.getElementById("winnerNext");
const winnerClose = document.getElementById("winnerClose");

const startModal = document.getElementById("startModal");
const startGameBtn = document.getElementById("startGameBtn");

const modeSelect = document.getElementById("modeSelect");

let board = ["", "", "", "", "", "", "", "", ""];

let currentPlayer = "O";

let gameOver = false;

let mode = "pvp";

let scores = {
    O: 0,
    X: 0,
    D: 0
};

const winPatterns = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

startGameBtn.addEventListener("click", () => {

    startModal.classList.remove("show");

    startModal.setAttribute("aria-hidden","true");

});

modeSelect.addEventListener("change", () => {

    mode = modeSelect.value;

    resetBoard();

});

boxes.forEach((box) => {

    box.addEventListener("click", handleClick);

});

resetRound.addEventListener("click", resetBoard);

resetAll.addEventListener("click", () => {

    scores = {
        O:0,
        X:0,
        D:0
    };

    updateScores();

    resetBoard();

});

winnerNext.addEventListener("click", () => {

    closeWinnerModal();

    resetBoard();

});

winnerClose.addEventListener("click", closeWinnerModal);

function handleClick(event){

    const index = event.target.dataset.index;

    if(board[index] !== "" || gameOver){
        return;
    }

    makeMove(index,currentPlayer);

    if(
        !gameOver &&
        currentPlayer === "X" &&
        mode !== "pvp"
    ){

        setTimeout(cpuMove,500);

    }

}

function makeMove(index,player){

    board[index] = player;

    boxes[index].textContent = player;

    if(player === "O"){

        boxes[index].classList.add("mark-o");

    }else{

        boxes[index].classList.add("mark-x");

    }

    checkWinner();

}

function checkWinner(){

    let winnerFound = false;

    winPatterns.forEach((pattern)=>{

        const [a,b,c] = pattern;

        if(
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ){

            winnerFound = true;

            boxes[a].classList.add("win");
            boxes[b].classList.add("win");
            boxes[c].classList.add("win");

        }

    });

    if(winnerFound){

        gameOver = true;

        statusText.textContent =
            `Player ${currentPlayer} Wins!`;

        winnerTitle.textContent =
            `Player ${currentPlayer} Wins!`;

        winnerModal.classList.add("show");

        winnerModal.setAttribute(
            "aria-hidden",
            "false"
        );

        scores[currentPlayer]++;

        updateScores();

        return;

    }

    if(!board.includes("")){

        gameOver = true;

        statusText.textContent = "It's a Draw!";

        scores.D++;

        updateScores();

        return;

    }

    switchPlayer();

}

function switchPlayer(){

    currentPlayer =
        currentPlayer === "O" ? "X" : "O";

    turnChip.textContent =
        `Turn: ${currentPlayer}`;

    statusText.textContent =
        `Player ${currentPlayer}'s Turn`;

}

function cpuMove(){

    let move = null;

    if(mode === "cpu-easy"){

        move = randomMove();

    }

    else if(mode === "cpu-medium"){

        const smartChance = Math.random();

        if(smartChance < 0.6){

            move =
                findWinningMove("X") ??
                findWinningMove("O") ??
                randomMove();

        }else{

            move = randomMove();

        }

    }

    else if(mode === "cpu-hard"){

        move =
            findWinningMove("X") ??
            findWinningMove("O") ??
            takeCenter() ??
            takeCorner() ??
            randomMove();

    }

    if(move !== null){

        makeMove(move,"X");

    }

}

function randomMove(){

    const empty = [];

    board.forEach((cell,index)=>{

        if(cell === ""){
            empty.push(index);
        }

    });

    if(empty.length === 0){
        return null;
    }

    return empty[
        Math.floor(Math.random() * empty.length)
    ];

}

function findWinningMove(player){

    for(let pattern of winPatterns){

        const [a,b,c] = pattern;

        const values = [
            board[a],
            board[b],
            board[c]
        ];

        const playerCount =
            values.filter(v => v === player).length;

        const emptyCell =
            pattern.find(i => board[i] === "");

        if(
            playerCount === 2 &&
            emptyCell !== undefined
        ){

            return emptyCell;

        }

    }

    return null;

}

function takeCenter(){

    if(board[4] === ""){
        return 4;
    }

    return null;

}

function takeCorner(){

    const corners = [0,2,6,8];

    const availableCorners =
        corners.filter(
            index => board[index] === ""
        );

    if(availableCorners.length === 0){
        return null;
    }

    return availableCorners[
        Math.floor(
            Math.random() *
            availableCorners.length
        )
    ];

}

function resetBoard(){

    board = ["","","","","","","","",""];

    currentPlayer = "O";

    gameOver = false;

    turnChip.textContent = "Turn: O";

    statusText.textContent = "Ready to play";

    boxes.forEach((box)=>{

        box.textContent = "";

        box.classList.remove(
            "mark-o",
            "mark-x",
            "win"
        );

    });

    closeWinnerModal();

}

function updateScores(){

    scoreO.textContent = scores.O;

    scoreX.textContent = scores.X;

    scoreD.textContent = scores.D;

}

function closeWinnerModal(){

    winnerModal.classList.remove("show");

    winnerModal.setAttribute(
        "aria-hidden",
        "true"
    );

}