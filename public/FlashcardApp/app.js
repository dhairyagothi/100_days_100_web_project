let deck = [];
let currentIndex = 0;

let score = 0;
let streak = 0;
let xp = 0;

const words = [
  "ubiquitous",
  "resilient",
  "pragmatic",
  "scrutinize",
  "transient",
  "eloquent",
  "meticulous",
  "versatile",
  "coherent",
  "benevolent"
];

function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [array[i],array[j]]=[array[j],array[i]];
  }
}

shuffle(words);

async function fetchCardData(word){

  try{

    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    const data = await response.json();

    return {
      word:data[0].word,
      definition:
      data[0].meanings?.[0]?.definitions?.[0]?.definition
      || "No definition",

      example:
      data[0].meanings?.[0]?.definitions?.[0]?.example
      || "No example available",

      audio:
      data[0].phonetics?.find(p=>p.audio)?.audio || ""
    };

  }catch{
    return null;
  }
}

async function init(){

  for(const word of words){

    const data = await fetchCardData(word);

    if(data){
      deck.push(data);
    }
  }

  renderCard();
}

const flashcard = document.getElementById("flashcard");

flashcard.addEventListener("click",()=>{
  flashcard.classList.toggle("is-flipped");
});

function renderCard(){

  if(currentIndex>=deck.length){

    alert(
      `Session Complete!\nScore: ${score}/${deck.length}\nXP: ${xp}`
    );

    return;
  }

  flashcard.classList.remove("is-flipped");

  const card = deck[currentIndex];

  document.getElementById("word-title").textContent=
  card.word;

  document.getElementById("word-definition").textContent=
  card.definition;

  document.getElementById("word-example").textContent=
  card.example;

  updateProgress();
}

function updateProgress(){

  document.getElementById("card-progress").textContent=
  `${currentIndex+1}/${deck.length}`;

  const percentage =
  ((currentIndex)/deck.length)*100;

  document.getElementById("progress-bar").style.width =
  percentage + "%";
}

document.getElementById("correct-btn")
.addEventListener("click",()=>{

  score++;
  streak++;
  xp += 10;

  updateStats();

  currentIndex++;

  renderCard();
});

document.getElementById("incorrect-btn")
.addEventListener("click",()=>{

  streak = 0;

  updateStats();

  currentIndex++;

  renderCard();
});

document.getElementById("prev-btn")
.addEventListener("click",()=>{

  if(currentIndex>0){

    currentIndex--;

    renderCard();
  }
});

function updateStats(){

  document.getElementById("score").textContent=
  score;

  document.getElementById("streak").textContent=
  streak;

  document.getElementById("xp").textContent=
  xp;

  localStorage.setItem("bestScore",score);
}

document.getElementById("theme-toggle")
.addEventListener("click",()=>{

  document.body.classList.toggle("dark");
});

document.getElementById("audio-btn")
.addEventListener("click",(e)=>{

  e.stopPropagation();

  const card = deck[currentIndex];

  if(card.audio){

    new Audio(card.audio).play();

  }else{

    const speech = new SpeechSynthesisUtterance(
      card.word
    );

    speechSynthesis.speak(speech);
  }
});

init();