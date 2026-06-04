let deck = [];
let currentIndex = 0;
let score = 0;
let audioUrl = "";

const flashcard = document.getElementById('flashcard');
const wordTitle = document.getElementById('word-title');
const wordDefinition = document.getElementById('word-definition');
const wordExample = document.getElementById('word-example');
const scoreEl = document.getElementById('score');
const progressEl = document.getElementById('card-progress');

// Asynchronously fetch word data from Free Dictionary API
async function fetchCardData(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) throw new Error("Word data unavailable");
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error(`Error fetching word "${word}":`, error);
    return null;
  }
}

// Initialize the card session
async function initSession() {
  const words = ['ubiquitous', 'resilient', 'pragmatic', 'scrutinize', 'transient'];
  deck = [];
  
  for (let word of words) {
    const data = await fetchCardData(word);
    if (data) {
      // Safely handle API paths to avoid unexpected data crashes
      const definitionPath = data.meanings?.[0]?.definitions?.[0]?.definition || "Definition missing.";
      const examplePath = data.meanings?.[0]?.definitions?.[0]?.example || "Context example omitted by API.";
      const audioPath = data.phonetics?.find(p => p.audio)?.audio || "";

      deck.push({
        word: data.word,
        definition: definitionPath,
        example: examplePath,
        audio: audioPath
      });
    }
  }
  renderCard();
}

// Render values to UI
function renderCard() {
  if (currentIndex >= deck.length) {
    alert(`Session Finished! Clean score: ${score}/${deck.length}`);
    return;
  }
  
  // Clean card orientation state back to front face
  flashcard.classList.remove('is-flipped');
  
  const currentCard = deck[currentIndex];
  wordTitle.textContent = currentCard.word;
  wordDefinition.textContent = currentCard.definition;
  wordExample.textContent = `"${currentCard.example}"`;
  audioUrl = currentCard.audio;
  
  progressEl.textContent = `${currentIndex + 1}/${deck.length}`;
}

// 3D Card Flipping Event
flashcard.addEventListener('click', () => {
  flashcard.classList.toggle('is-flipped');
});

// Audio Pronunciation Edge-case handling
document.getElementById('audio-btn').addEventListener('click', (e) => {
  e.stopPropagation(); // Prevents clicking the audio button from flipping the card back over
  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play();
  } else {
    alert("Audio track missing for this selection.");
  }
});

// Controller Logic
document.getElementById('correct-btn').addEventListener('click', () => {
  score++;
  scoreEl.textContent = score;
  currentIndex++;
  renderCard();
});

document.getElementById('incorrect-btn').addEventListener('click', () => {
  currentIndex++;
  renderCard();
});

// Kick off app
initSession();