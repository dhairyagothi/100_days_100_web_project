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

// ========== THEME TOGGLE ==========
function initTheme() {
  const themeBtn = document.getElementById("theme-toggle");
  if (!themeBtn) return;

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeBtn.textContent = "☀️";
  }

  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeBtn.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

// ========== STUDY MODE ==========
function initStudy(){
  const flashcard = document.getElementById("flashcard");
  if (!flashcard) return;

  flashcard.addEventListener("click", () => {
    flashcard.classList.toggle("is-flipped");
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "ArrowRight") {
      e.preventDefault();
      if (!flashcard.classList.contains("is-flipped")) {
        flashcard.classList.toggle("is-flipped");
      }
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      document.getElementById("prev-btn")?.click();
    }
    if (e.key === "1") {
      document.getElementById("correct-btn")?.click();
    }
    if (e.key === "2") {
      document.getElementById("incorrect-btn")?.click();
    }
  });

  document.getElementById("correct-btn").addEventListener("click", () => {
    score++; streak++; xp += 10;
    updateStats();
    currentIndex++;
    renderCard();
    // Auto-flip to front
    flashcard.classList.remove("is-flipped");
  });

  document.getElementById("incorrect-btn").addEventListener("click", () => {
    streak = 0;
    updateStats();
    currentIndex++;
    renderCard();
    flashcard.classList.remove("is-flipped");
  });

  document.getElementById("prev-btn").addEventListener("click", () => {
    if(currentIndex > 0){ 
      currentIndex--; 
      renderCard();
      flashcard.classList.remove("is-flipped");
    }
  });

  document.getElementById("audio-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    const card = deck[currentIndex];
    if(card && card.audio){
      new Audio(card.audio).play();
    }else if(card){
      const speech = new SpeechSynthesisUtterance(card.word);
      speech.rate = 0.9;
      speechSynthesis.speak(speech);
    }
  });

  renderCard();
}

function renderCard(){
  if(currentIndex >= deck.length){
    showCompletionModal();
    return;
  }
  const card = deck[currentIndex];
  document.getElementById("word-title").textContent = card.word;
  document.getElementById("word-definition").textContent = card.definition;
  document.getElementById("word-example").textContent = `"${card.example}"`;
  updateProgress();
}

function updateProgress(){
  document.getElementById("card-progress").textContent = `${currentIndex + 1}/${deck.length}`;
  const percentage = ((currentIndex) / deck.length) * 100;
  document.getElementById("progress-bar").style.width = percentage + "%";
}

function updateStats(){
  document.getElementById("score").textContent = score;
  document.getElementById("streak").textContent = streak;
  document.getElementById("xp").textContent = xp;
  
  const bestScore = localStorage.getItem("bestScore");
  if (!bestScore || score > parseInt(bestScore)) {
    localStorage.setItem("bestScore", score);
  }
}

function showCompletionModal() {
  const bestScore = localStorage.getItem("bestScore") || score;
  const message = `
🎉 Session Complete! 🎉

📊 Your Results:
✅ Score: ${score}/${deck.length}
🔥 Streak: ${streak}
⭐ XP Earned: ${xp}
🏆 Best Score: ${bestScore}

${score === deck.length ? "🌟 PERFECT SCORE! AMAZING! 🌟" : "Keep practicing! 💪"}

Click OK to restart.
  `;
  alert(message);
  // Reset but keep progress
  if (confirm("Start a new session?")) {
    score = 0;
    streak = 0;
    xp = 0;
    currentIndex = 0;
    shuffle(deck);
    updateStats();
    renderCard();
    document.getElementById("flashcard").classList.remove("is-flipped");
  }
}

// ========== GRID MODE ==========
function initGrid(){
  const grid = document.getElementById("cards-grid");
  if (!grid) return;
  
  if (deck.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <h2>📭 No cards yet</h2>
        <p>Please wait while we load your flashcards...</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = "";
  deck.forEach((card, index) => {
    const el = document.createElement("div");
    el.className = "card-item";
    el.style.animationDelay = `${index * 0.05}s`;
    el.innerHTML = `
      <h3>${index + 1}. ${card.word}</h3>
      <p><strong>Definition:</strong> ${card.definition}</p>
      <p><em>Example:</em> ${card.example}</p>
      ${card.audio ? `<button class="audio-btn" data-audio="${card.audio}">🔊 Pronounce</button>` : ""}
    `;
    
    if(card.audio){
      const audioBtn = el.querySelector(".audio-btn");
      audioBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const audio = new Audio(card.audio);
        audio.play().catch(() => {
          const speech = new SpeechSynthesisUtterance(card.word);
          speechSynthesis.speak(speech);
        });
      });
    }
    grid.appendChild(el);
  });
}

// ========== INITIALIZATION ==========
async function init(){
  // Load cards
  for(const word of words){
    const data = await fetchCardData(word);
    if(data){ deck.push(data); }
  }

  // Init theme first
  initTheme();

  // Init page based on content
  if(document.getElementById("flashcard")){
    initStudy();
  }else if(document.getElementById("cards-grid")){
    initGrid();
  }
}

// Start the app
init();