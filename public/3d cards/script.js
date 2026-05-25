const leftBank = document.getElementById("left-bank");
const rightBank = document.getElementById("right-bank");
const boat = document.getElementById("boat");
const message = document.getElementById("message");

let state;

function initGame(){

    state = {
        leftM:3,
        leftC:3,
        rightM:0,
        rightC:0,
        boatM:0,
        boatC:0,
        boatPosition:"left",
        gameOver:false
    };

    render();

    message.textContent = "Game Started!";
}

function createPerson(type, location){

    const div = document.createElement("div");

    div.classList.add("person");

    if(type === "missionary"){

        div.classList.add("missionary");
        div.innerHTML = "👨";

    }else{

        div.classList.add("cannibal");
        div.innerHTML = "👹";
    }

    div.addEventListener("click", ()=>handleMove(type, location));

    return div;
}

function render(){

    leftBank.innerHTML = "";
    rightBank.innerHTML = "";
    boat.innerHTML = "";

    for(let i=0;i<state.leftM;i++){
        leftBank.appendChild(createPerson("missionary","left"));
    }

    for(let i=0;i<state.leftC;i++){
        leftBank.appendChild(createPerson("cannibal","left"));
    }

    for(let i=0;i<state.rightM;i++){
        rightBank.appendChild(createPerson("missionary","right"));
    }

    for(let i=0;i<state.rightC;i++){
        rightBank.appendChild(createPerson("cannibal","right"));
    }

    for(let i=0;i<state.boatM;i++){
        boat.appendChild(createPerson("missionary","boat"));
    }

    for(let i=0;i<state.boatC;i++){
        boat.appendChild(createPerson("cannibal","boat"));
    }

    checkWin();
}

function handleMove(type, location){

    if(state.gameOver) return;

    // FROM BANK TO BOAT
    if(location === state.boatPosition){

        if(state.boatM + state.boatC >= 2){

            message.textContent = "Boat is full!";
            return;
        }

        if(type === "missionary"){

            if(location === "left"){
                state.leftM--;
            }else{
                state.rightM--;
            }

            state.boatM++;

        }else{

            if(location === "left"){
                state.leftC--;
            }else{
                state.rightC--;
            }

            state.boatC++;
        }
    }

    // FROM BOAT TO BANK
    else if(location === "boat"){

        if(type === "missionary"){

            state.boatM--;

            if(state.boatPosition === "left"){
                state.leftM++;
            }else{
                state.rightM++;
            }

        }else{

            state.boatC--;

            if(state.boatPosition === "left"){
                state.leftC++;
            }else{
                state.rightC++;
            }
        }
    }

    if(!isValid()){

        message.textContent =
        "Invalid Move! Missionaries got eaten 😭";

        initGame();
        return;
    }

    render();
}

function isValid(){

    if(state.leftM > 0 &&
       state.leftC > state.leftM){

        return false;
    }

    if(state.rightM > 0 &&
       state.rightC > state.rightM){

        return false;
    }

    return true;
}

function moveBoat(){

    if(state.gameOver) return;

    if(state.boatM + state.boatC === 0){

        message.textContent =
        "Boat needs at least 1 person!";

        return;
    }

    state.boatPosition =
    state.boatPosition === "left"
    ? "right"
    : "left";

    message.textContent =
    `Boat moved to ${state.boatPosition} bank`;

    render();
}

function checkWin(){

    if(state.rightM === 3 &&
       state.rightC === 3){

        message.textContent =
        "🎉 You Won The Game!";

        state.gameOver = true;
    }
}

document
.getElementById("moveBoatBtn")
.addEventListener("click", moveBoat);

document
.getElementById("resetBtn")
.addEventListener("click", initGame);

initGame();