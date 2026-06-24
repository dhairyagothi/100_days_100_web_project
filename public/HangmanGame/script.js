const wordDisplay = document.querySelector('.word-display');
const guessesText = document.querySelector('.guesses-text b');
const keyboardDiv = document.querySelector('.keyboard');
const hangmanImage = document.querySelector('.hangman-box img');
const gameModal = document.querySelector('.game-modal');
const playAgainBtn = gameModal.querySelector('button');
let shownHints = new Set();

// Game state variables
let currentWord,
  correctLetters,
  wrongGuessCount,
  currentHints = [],
  hintLevel = 0;

const hintCountText = document.querySelector('.hint-count b');

const maxGuesses = 6;

// ─── Smart Hint (Groq) state ──────────────────────────────────
const SMART_HINT_MAX_USES = 3;
let smartHintUsesLeft = SMART_HINT_MAX_USES;

const smartHintBtn     = document.getElementById('smartHintBtn');
const smartHintCard    = document.getElementById('smartHintCard');
const smartHintText    = document.getElementById('smartHintText');
const smartHintUses    = document.getElementById('smartHintUses');
const groqKeyModal     = document.getElementById('groqKeyModal');
const groqKeyInput     = document.getElementById('groqKeyInput');
const saveGroqKeyBtn   = document.getElementById('saveGroqKey');
const cancelGroqKeyBtn = document.getElementById('cancelGroqKey');
const closeGroqModal   = document.getElementById('closeGroqModal');

// ─── Groq key helper ──────────────────────────────────────────
const getGroqKey = () => sessionStorage.getItem('groq_key');

// ─── Typewriter animation ─────────────────────────────────────
const typewriterWrite = (element, text, speed = 28) => {
  element.classList.remove('done');
  element.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      element.classList.add('done');
    }
  }, speed);
};

// ─── Update smart-hint usage label ───────────────────────────
const updateSmartHintUses = () => {
  if (smartHintUsesLeft <= 0) {
    smartHintUses.textContent = 'No uses left';
    smartHintUses.classList.add('exhausted');
    smartHintBtn.disabled = true;
  } else {
    smartHintUses.textContent = `${smartHintUsesLeft} use${smartHintUsesLeft !== 1 ? 's' : ''} left · costs 1 life`;
    smartHintUses.classList.remove('exhausted');
    smartHintBtn.disabled = false;
  }
};

// ─── Shared Groq API call ─────────────────────────────────────
const callGroq = async (prompt, maxTokens = 60) => {
  const key = getGroqKey();
  if (!key) return null;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices?.[0]?.message?.content?.trim() || null;
};

// ─── Groq: fetch 3 progressive hints ─────────────────────────
const fetchAIHints = async (word) => {
  const fallbackHint = wordList.find((item) => item.word === word)?.hint || 'Think carefully';

  // No key yet — use static fallback silently, don't prompt for key here
  if (!getGroqKey()) {
    currentHints = [
      fallbackHint,
      `The word starts with "${word[0].toUpperCase()}".`,
      `The word starts with "${word[0].toUpperCase()}" and ends with "${word[word.length - 1].toUpperCase()}".`,
    ];
    hintLevel = 0;
    updateHint();
    return;
  }

  try {
    const prompt = `Generate 3 progressive hangman hints for the word: "${word}".

Rules:
- Hint 1: vague, general
- Hint 2: more specific than Hint 1
- Hint 3: significantly more specific than Hint 2
- Every hint must be unique
- Do not repeat information from previous hints
- Never reveal the word
- Never reveal any of its letters

Return ONLY valid JSON, no markdown, no backticks:
{"hints":["...","...","..."]}`;

    const raw = await callGroq(prompt, 200);
    const parsed = JSON.parse(raw.replace(/```json/g, '').replace(/```/g, '').trim());

    const uniqueHints = [...new Set(parsed.hints)].filter((h) => h && h.trim().length > 0);
    while (uniqueHints.length < 3) {
      uniqueHints.push('Think more carefully about the category of this word.');
    }
    currentHints = uniqueHints.slice(0, 3);
  } catch (err) {
    console.warn('Groq progressive hints failed:', err);
    currentHints = [
      fallbackHint,
      `The word starts with "${word[0].toUpperCase()}".`,
      `The word starts with "${word[0].toUpperCase()}" and ends with "${word[word.length - 1].toUpperCase()}".`,
    ];
  }

  hintLevel = 0;
  updateHint();
};

// ─── Update the progressive hint display ─────────────────────
const updateHint = () => {
  document.querySelector('.hint-text b').innerText =
    currentHints[hintLevel] || 'Loading hint...';

  const remaining = Math.max(currentHints.length - 1 - hintLevel, 0);
  hintCountText.innerText = remaining;
  document.querySelector('.better-hint-btn').disabled = remaining === 0;
};

// ─── Groq: fetch one cryptic Smart Hint ──────────────────────
const fetchGroqSmartHint = async (word) => {
  try {
    const prompt = `Give one cryptic clue for the word "${word}" in under 20 words. Do NOT say the word, any rhymes, or any of its letters. Return ONLY the clue, nothing else.`;
    return await callGroq(prompt, 60);
  } catch (err) {
    console.warn('Groq smart hint failed:', err);
    return null;
  }
};

// ─── Smart Hint button handler ────────────────────────────────
const handleSmartHint = async () => {
  if (smartHintUsesLeft <= 0) return;
  if (wrongGuessCount >= maxGuesses) return;

  if (!getGroqKey()) {
    groqKeyModal.classList.add('show');
    return;
  }

  await triggerSmartHint();
};

const triggerSmartHint = async () => {
  // Deduct a life immediately
  wrongGuessCount++;
  hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
  guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

  // Deduct a use
  smartHintUsesLeft--;
  updateSmartHintUses();

  // Disable while fetching
  smartHintBtn.disabled = true;
  smartHintBtn.textContent = '⏳ Fetching...';

  // Show card with loading state
  smartHintCard.classList.add('visible');
  smartHintText.classList.remove('done');
  smartHintText.textContent = 'Generating cryptic clue…';

  const hint = await fetchGroqSmartHint(currentWord);
  const displayText = hint || 'Could not generate a hint — check your Groq key.';

  typewriterWrite(smartHintText, displayText);

  // Restore button
  smartHintBtn.textContent = '💡 Smart Hint';
  if (smartHintUsesLeft > 0 && wrongGuessCount < maxGuesses) {
    smartHintBtn.disabled = false;
  }

  // Check if this use caused game over
  if (wrongGuessCount === maxGuesses) {
    setTimeout(() => gameOver(false), 600);
  }
};

// ─── Groq key modal ───────────────────────────────────────────
const closeGroqKeyModal = () => {
  groqKeyModal.classList.remove('show');
  groqKeyInput.value = '';
};

saveGroqKeyBtn.addEventListener('click', async () => {
  const key = groqKeyInput.value.trim();
  if (!key) {
    groqKeyInput.focus();
    return;
  }
  sessionStorage.setItem('groq_key', key);
  closeGroqKeyModal();

  // Refetch progressive hints with the new key if we only had static fallbacks
  const fallback = wordList.find((i) => i.word === currentWord)?.hint || 'Think carefully';
  if (currentHints[0] === fallback || currentHints[0] === 'Think carefully') {
    await fetchAIHints(currentWord);
  }

  await triggerSmartHint();
});

cancelGroqKeyBtn.addEventListener('click', closeGroqKeyModal);
closeGroqModal.addEventListener('click', closeGroqKeyModal);
groqKeyModal.addEventListener('click', (e) => {
  if (e.target === groqKeyModal) closeGroqKeyModal();
});

groqKeyInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') saveGroqKeyBtn.click();
});

smartHintBtn.addEventListener('click', handleSmartHint);

// ─── Core game logic ──────────────────────────────────────────
const resetGame = () => {
  correctLetters = [];
  wrongGuessCount = 0;
  shownHints.clear();

  // Reset Smart Hint state
  smartHintUsesLeft = SMART_HINT_MAX_USES;
  smartHintCard.classList.remove('visible');
  smartHintText.textContent = '';
  smartHintText.classList.remove('done');
  smartHintBtn.textContent = '💡 Smart Hint';
  updateSmartHintUses();

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

  currentHints = ['Loading hint...'];
  hintLevel = 0;
  updateHint();
  fetchAIHints(word);
};

const gameOver = (isVictory) => {
  const modalText = isVictory ? 'You found the word:' : 'The correct word was:';
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

  // Disable smart hint if using it would push past maxGuesses
  if (wrongGuessCount + 1 >= maxGuesses && smartHintUsesLeft > 0) {
    smartHintBtn.disabled = true;
  }
};

// ─── Keyboard creation ────────────────────────────────────────
for (let i = 97; i <= 122; i++) {
  const button = document.createElement('button');
  button.innerText = String.fromCharCode(i);
  keyboardDiv.appendChild(button);
  button.addEventListener('click', (e) => initGame(e.target, String.fromCharCode(i)));
}

// ─── Rules modal ──────────────────────────────────────────────
const rulesBtn   = document.querySelector('.rules-btn');
const rulesModal = document.querySelector('.rules-modal');
const closeRules = document.querySelector('.close-rules');

rulesBtn.addEventListener('click', () => rulesModal.classList.add('show'));
closeRules.addEventListener('click', () => rulesModal.classList.remove('show'));
rulesModal.addEventListener('click', (e) => {
  if (e.target === rulesModal) rulesModal.classList.remove('show');
});

// ─── Better Hint button (Groq progressive) ───────────────────
document.querySelector('.better-hint-btn').addEventListener('click', () => {
  if (hintLevel < currentHints.length - 1) {
    hintLevel++;
    updateHint();
  }
});

// ─── Play again + keyboard input ─────────────────────────────
getRandomWord();
playAgainBtn.addEventListener('click', getRandomWord);

document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (!/^[a-z]$/.test(key)) return;
  if (gameModal.classList.contains('show')) return;
  const targetBtn = [...keyboardDiv.children].find((btn) => btn.innerText.toLowerCase() === key);
  if (targetBtn && !targetBtn.disabled) targetBtn.click();
});