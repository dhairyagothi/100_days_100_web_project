
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
      word: data[0].word,
      definition: data[0].meanings?.[0]?.definitions?.[0]?.definition || "No definition",
      example: data[0].meanings?.[0]?.definitions?.[0]?.example || "No example available",
      audio: data[0].phonetics?.find(p=>p.audio)?.audio || ""
    };
  }catch{
    return null;
  }
}

// ------------------ Study Mode (index.html) ------------------
function initStudy(){
  const flashcard = document.getElementById("flashcard");
  flashcard.addEventListener("click",()=>{
    flashcard.classList.toggle("is-flipped");
  });

  document.getElementById("correct-btn").addEventListener("click",()=>{
    score++; streak++; xp += 10;
    updateStats();
    currentIndex++;
    renderCard();
  });

  document.getElementById("incorrect-btn").addEventListener("click",()=>{
    streak = 0;
    updateStats();
    currentIndex++;
    renderCard();
  });

  document.getElementById("prev-btn").addEventListener("click",()=>{
    if(currentIndex>0){ currentIndex--; renderCard(); }
  });

  document.getElementById("theme-toggle").addEventListener("click",()=>{
    document.body.classList.toggle("dark");
  });

  document.getElementById("audio-btn").addEventListener("click",(e)=>{
    e.stopPropagation();
    const card = deck[currentIndex];
    if(card.audio){
      new Audio(card.audio).play();
    }else{
      const speech = new SpeechSynthesisUtterance(card.word);
      speechSynthesis.speak(speech);
    }
  });

  renderCard();
}

function renderCard(){
  if(currentIndex>=deck.length){
    alert(`Session Complete!\nScore: ${score}/${deck.length}\nXP: ${xp}`);
    return;
  }
  const card = deck[currentIndex];
  document.getElementById("word-title").textContent = card.word;
  document.getElementById("word-definition").textContent = card.definition;
  document.getElementById("word-example").textContent = card.example;
  updateProgress();
}

function updateProgress(){
  document.getElementById("card-progress").textContent = `${currentIndex+1}/${deck.length}`;
  const percentage = ((currentIndex)/deck.length)*100;
  document.getElementById("progress-bar").style.width = percentage + "%";
}

function updateStats(){
  document.getElementById("score").textContent = score;
  document.getElementById("streak").textContent = streak;
  document.getElementById("xp").textContent = xp;
  localStorage.setItem("bestScore",score);
}

// ------------------ Grid Mode (cards.html) ------------------
function initGrid(){
  const grid = document.getElementById("cards-grid");
  grid.innerHTML = "";
  deck.forEach(card => {
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <h3>${card.word}</h3>
      <p><strong>Definition:</strong> ${card.definition}</p>
      <p><em>Example:</em> ${card.example}</p>
      ${card.audio ? `<button class="audio-btn">🔊 Pronounce</button>` : ""}
    `;
    if(card.audio){
      el.querySelector(".audio-btn").addEventListener("click",()=>{
        new Audio(card.audio).play();
      });
    }
    grid.appendChild(el);
  });
}

// ------------------ Page Detection ------------------
async function init(){
  for(const word of words){
    const data = await fetchCardData(word);
    if(data){ deck.push(data); }
  }

  if(document.getElementById("flashcard")){
    // Study mode page
    initStudy();
  }else if(document.getElementById("cards-grid")){
    // Grid mode page
    initGrid();
  }
}

init();


const themeBtn = document.getElementById("theme-toggle");
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    
    document.body.classList.toggle("dark");

    
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
}
