const holes = document.querySelectorAll('.hole');
const scoreBoard = document.getElementById('score');
const startButton = document.getElementById('startButton');
const whackSound = document.getElementById('whackSound');
const gameContainer = document.querySelector('.game-container');

let lastHole;
let score = 0;
let gameTime = false;
// function to randomly pick a hole for the mole to appear
function RandomHole(holes){
    const index = Math.floor(Math.random() * holes.length);
    const hole = holes[index];
    if(hole === lastHole)
    {
        // avoid showing in the same hole consecutively
        return RandomHole(holes);
    }
    lastHole = hole;
    return hole;
}
// function to make the mole pop up and hide
function MolePopUp(){
    // random pop up duration
    const time = Math.random() * 800 + 200;
    const hole = RandomHole(holes);
    // show mole
    hole.classList.add('active');
    setTimeout(() => {
        //hide mole after random time
        hole.classList.remove('active');
        // keep moles popping until game ends
        if(gameTime) MolePopUp();
    }, time);
}
// function to start the game
function StartGame(){
    score = 0;
    scoreBoard.textContent = score;
    gameTime = true;
    MolePopUp();
    setTimeout(() => {
        gameTime = false;
    }, 50000); // game duration of 50 seconds
}
// function to whack a mole and increase score
holes.forEach(hole => {
    hole.addEventListener('click', () => {
        // only whack active mole
        if (!hole.classList.contains('active')) return;
        score++;
        scoreBoard.textContent = score;
        hole.classList.remove('active');
        whackSound.play();
    });
});
startButton.addEventListener('click', StartGame);

gameContainer.addEventListener('mousedown', () => {
    gameContainer.style.cursor = "url('hammer.png') 16 16 , auto";
});
gameContainer.addEventListener('mouseup', () => {
    gameContainer.style.cursor = "url('hammer.png') 16 16 , auto";
});