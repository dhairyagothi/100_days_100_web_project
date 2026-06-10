const wordDisplay = document.querySelector('.word-display');
const guessesText = document.querySelector('.guesses-text b');
const keyboardDiv = document.querySelector('.keyboard');
const hangmanImage = document.querySelector('.hangman-box img');
const gameModal = document.querySelector('.game-modal');
const playAgainBtn = gameModal.querySelector('button');
let shownHints = new Set();

// variable bnaye hai game shuru krne ke
let currentWord,
  correctLetters,
  wrongGuessCount,
  currentHints = [],
  hintLevel = 0;

const hintCountText = document.querySelector('.hint-count b');

const maxGuesses = 6;
const GEMINI_API_KEY = window.GEMINI_API_KEY || '';
const updateHint = () => {
  document.querySelector('.hint-text b').innerText =
    currentHints[hintLevel] || 'Loading AI hint...';

  const remaining = Math.max(currentHints.length - 1 - hintLevel, 0);

  hintCountText.innerText = remaining;

  document.querySelector('.better-hint-btn').disabled = remaining === 0;
};

const fetchAIHints = async (word) => {
  const fallbackHint = wordList.find((item) => item.word === word)?.hint || 'Think carefully';

  try {
    if (!GEMINI_API_KEY) {
      throw new Error('No Gemini Key');
    }

    const prompt = `
Generate 3 progressive hangman hints.

Word: ${word}

Rules:
- Hint 1 vague
- Hint 2 more specific than Hint 1
- Hint 3 significantly more specific than Hint 2
- Every hint must be unique
- Do not repeat information from previous hints
- Never reveal the word
- Never reveal letters

Return ONLY JSON:

{
  "hints":[
    "...",
    "...",
    "..."
  ]
}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    const parsed = JSON.parse(
      raw
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim()
    );

    const uniqueHints = [...new Set(parsed.hints)]
  .filter(hint => hint && hint.trim().length > 0);

while (uniqueHints.length < 3) {
  uniqueHints.push("Think about words related to the first hint.");
}

currentHints = uniqueHints.slice(0, 3);
  } catch (err) {
  console.warn('Gemini unavailable', err);

  currentHints = [
    fallbackHint,
    `The word starts with "${word[0].toUpperCase()}".`,
    `The word starts with "${word[0].toUpperCase()}" and ends with "${word[word.length - 1].toUpperCase()}".`,
  ];
}

  hintLevel = 0;

  updateHint();
};

const resetGame = () => {
  correctLetters = [];
  wrongGuessCount = 0;
  shownHints.clear();
  hangmanImage.src = 'images/hangman-0.svg';
  guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
  wordDisplay.innerHTML = currentWord
    .split('')
    .map(() => `<li class="letter"></li>`)
    .join('');
  keyboardDiv.querySelectorAll('button').forEach((btn) => (btn.disabled = false));
  gameModal.classList.remove('show');
  document.activeElement.blur();
};

const getRandomWord = () => {
  const { word } = wordList[Math.floor(Math.random() * wordList.length)];

  currentWord = word;

  resetGame();

  currentHints = ['Generating AI hint...'];

  hintLevel = 0;

  updateHint();

  fetchAIHints(word);
};

const gameOver = (isVictory) => {
  const modalText = isVictory ? `You found the word:` : 'The correct word was:';
  gameModal.querySelector('img').src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
  gameModal.querySelector('h4').innerText = isVictory ? 'Congrats!' : 'Game Over!';
  gameModal.querySelector('p').innerHTML = `${modalText} <b>${currentWord}</b>`;
  gameModal.classList.add('show');
};

const initGame = (button, clickedLetter) => {
  if (currentWord.includes(clickedLetter)) {
    [...currentWord].forEach((letter, index) => {
      if (letter === clickedLetter) {
        correctLetters.push(letter);
        wordDisplay.querySelectorAll('li')[index].innerText = letter;
        wordDisplay.querySelectorAll('li')[index].classList.add('guessed');
      }
    });
  } else {
    wrongGuessCount++;
    if (wrongGuessCount % 2 === 0 && hintLevel < currentHints.length - 1) {
      hintLevel++;

      updateHint();
    }
    hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
  }
  button.disabled = true;
  guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

  if (wrongGuessCount === maxGuesses) return gameOver(false);
  if (correctLetters.length === currentWord.length) return gameOver(true);
};

for (let i = 97; i <= 122; i++) {
  const button = document.createElement('button');
  button.innerText = String.fromCharCode(i);
  keyboardDiv.appendChild(button);
  button.addEventListener('click', (e) => initGame(e.target, String.fromCharCode(i)));
}

const rulesBtn = document.querySelector('.rules-btn');

const rulesModal = document.querySelector('.rules-modal');

const closeRules = document.querySelector('.close-rules');

rulesBtn.addEventListener('click', () => {
  rulesModal.classList.add('show');
});

closeRules.addEventListener('click', () => {
  rulesModal.classList.remove('show');
});

rulesModal.addEventListener('click', (e) => {
  if (e.target === rulesModal) {
    rulesModal.classList.remove('show');
  }
});
document.querySelector('.better-hint-btn').addEventListener('click', () => {
  if (hintLevel < currentHints.length - 1) {
    hintLevel++;

    updateHint();
  }
});
getRandomWord();
playAgainBtn.addEventListener('click', getRandomWord);
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();

  // allow only letters
  if (!/^[a-z]$/.test(key)) return;

  // stop input if modal open
  if (gameModal.classList.contains('show')) return;

  // directly click matching button
  const targetBtn = [...keyboardDiv.children].find((btn) => btn.innerText.toLowerCase() === key);

  if (targetBtn && !targetBtn.disabled) {
    targetBtn.click();
  }
});
