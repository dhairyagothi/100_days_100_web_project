let BJgame = {
    'you': {'scoreSpan': '#yourscore' , 'div': '#your-box', 'score': 0},
    'dealer': {'scoreSpan': '#dealerscore' , 'div': '#dealer-box', 'score': 0},
    
    'cards': ['2C','3C','4C','5C','6C','7C','8C','9C','10C','KC','QC','JC','AC','2D','3D','4D','5D','6D','7D','8D','9D','10D','KD','QD','JD','AD','2H','3H','4H','5H','6H','7H','8H','9H','10H','KH','QH','JH','AH','2S','3S','4S','5S','6S','7S','8S','9S','10S','KS','QS','JS','AS'],
    
    'cardsmap': {'2C':2,'3C':3,'4C':4,'5C':5,'6C':6,'7C':7,'8C':8,'9C':9,'10C':10,'KC':10,'QC':10,'JC':10,'AC':[1, 11],'2D':2,'3D':3,'4D':4,'5D':5,'6D':6,'7D':7,'8D':8,'9D':9,'10D':10,'KD':10,'QD':10,'JD':10,'AD':[1, 11],'2H':2,'3H':3,'4H':4,'5H':5,'6H':6,'7H':7,'8H':8,'9H':9,'10H':10,'KH':10,'QH':10,'JH':10,'AH':[1, 11],'2S':2,'3S':3,'4S':4,'5S':5,'6S':6,'7S':7,'8S':8,'9S':9,'10S':10,'KS':10,'QS':10,'JS':10,'AS':[1, 11]},

    'wins':0,
    'losses':0,
    'draws':0
};
const You = BJgame['you'];
const Dealer = BJgame['dealer'];

const tink = new Audio('./static/sounds/tink.wav');

function drawCard(activeplayer) {
    const randomNumber = Math.floor(Math.random() * (BJgame['cards'].length));
    const currentCard = BJgame['cards'].splice(randomNumber, 1);
    let card = document.createElement('img');
    card.src = `./static/${currentCard}.png`;
    document.querySelector(activeplayer['div']).appendChild(card);
    hitsound.play();
    
    // Update Score
    updateScore(currentCard, activeplayer);

    // Show Score
    showScore(activeplayer);
    
}

function updateScore(currentcard, activeplayer){
    // For Ace
    if(currentcard == 'AC' || currentcard == 'AD' || currentcard == 'AH' || currentcard == 'AS'){
        if((activeplayer['score'] + BJgame['cardsmap'][currentcard][1]) <= 21){

            activeplayer['score'] += BJgame['cardsmap'][currentcard][1];
        }
        else{
            activeplayer['score'] += BJgame['cardsmap'][currentcard][0];
        }
    }
    else{  //For Other Cases
        activeplayer['score'] += BJgame['cardsmap'][currentcard];
    }   
}

function showScore(activeplayer){
    if(activeplayer['score']>21){
        document.querySelector(activeplayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activeplayer['scoreSpan']).style.color = 'yellow';
    }
    else{
        document.querySelector(activeplayer['scoreSpan']).textContent = activeplayer['score'];
    }
}

// Compute Winner Function
function findwinner(){
    let winner;

    if(You['score']<=21){
        if(Dealer['score']<You['score'] || Dealer['score']>21){
            BJgame['wins']++;
            winner = You;
        }
        else if(Dealer['score'] == You['score']){
            BJgame['draws']++;
        }
        else{
            BJgame['losses']++;
            winner = Dealer;
        }
    }
    else if(You['score']>21 && Dealer['score']<=21){
        BJgame['losses']++;
        winner = Dealer;
    }
    else if(You['score']>21 && Dealer['score']>21){
        BJgame['draws']++;
    }
    return winner;
}

// Results
const winSound = new Audio('./static/sounds/cash.mp3'); 
const cheers = new Audio('./static/sounds/cheer.wav');
const loseSound = new Audio('./static/sounds/aww.mp3');
const drawSound = new Audio('./static/sounds/ohh.mp3');

function showresults(winner){
    if(winner == You){
        document.querySelector('#command').textContent = 'You Won!';
        document.querySelector('#command').style.color = 'green';
        winSound.play();
        cheers.play();
        cheers.volume = 0.4;
    }
    else if(winner == Dealer){
        document.querySelector('#command').textContent = "You Lost!";
        document.querySelector('#command').style.color = 'red';
        loseSound.play();
    }
    else{
        document.querySelector('#command').textContent = 'You Drew!';
        document.querySelector('#command').style.color = 'orange';
        drawSound.play();
    }

}

// Scoreboard
function scoreboard(){
    document.querySelector('#wins').textContent = BJgame['wins'];
    document.querySelector('#losses').textContent = BJgame['losses'];
    document.querySelector('#draws').textContent = BJgame['draws'];
}

// Hit Button (starting)
document.querySelector('#hit').addEventListener('click', BJhit);

const hitsound = new Audio('./static/sounds/swish.m4a');

function BJhit(){
    if(Dealer['score'] === 0){
        if(You['score']<=21){
            drawCard(You);
        }
    }
}

// Deal Button
document.querySelector('#deal').addEventListener('click', BJdeal);

function BJdeal(){

    if(You['score']=== 0){
        alert('Please Hit Some Cards First!');
    }
    else if(Dealer['score']===0){
        alert('Please Press Stand Key Before Deal...');
    }
    else{

    let yourimg = document.querySelector('#your-box').querySelectorAll('img');
    let dealerimg = document.querySelector('#dealer-box').querySelectorAll('img');
    
    for(let i=0; i<yourimg.length; i++){
        yourimg[i].remove();
    }
    for(let i=0; i<dealerimg.length; i++){
        dealerimg[i].remove();
    }

    BJgame['cards'] = ['2C','3C','4C','5C','6C','7C','8C','9C','10C','KC','QC','JC','AC','2D','3D','4D','5D','6D','7D','8D','9D','10D','KD','QD','JD','AD','2H','3H','4H','5H','6H','7H','8H','9H','10H','KH','QH','JH','AH','2S','3S','4S','5S','6S','7S','8S','9S','10S','KS','QS','JS','AS'];

    You['score'] = 0;
    document.querySelector(You['scoreSpan']).textContent = You['score'];
    document.querySelector(You['scoreSpan']).style.color = 'whitesmoke';
    Dealer['score'] = 0;
    document.querySelector(Dealer['scoreSpan']).textContent = Dealer['score'];
    document.querySelector(Dealer['scoreSpan']).style.color = 'whitesmoke';

    document.querySelector('#command').textContent = "Let's Play";
    document.querySelector('#command').style.color = 'black';
    }
}

// Dealer's Logic (2nd player) OR Stand button
document.querySelector('#stand').addEventListener('click', BJstand)

function BJstand(){
    if(You['score']===0){
        alert('Please Hit Some Cards First!');
    }
    else{
        while(Dealer['score']<16){
            drawCard(Dealer);
        }
        setTimeout(function(){
            showresults(findwinner());
            scoreboard();
        }, 800); 
    }
}