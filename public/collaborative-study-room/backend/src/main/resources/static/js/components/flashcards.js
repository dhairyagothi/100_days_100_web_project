// Flashcard View Component Handler with Leitner Spaced Repetition
import { state, addFlashcard, unlockBadge, addXP } from '../state.js';

// Local study session tracking variables
const masteredCardIndexes = new Set();
let currentRoomId = null;
let xpBonusAwarded = false;

export function initFlashcardsComponent() {
  const formAdd = document.getElementById('form-add-flashcard');
  const btnPrev = document.getElementById('btn-fc-prev');
  const btnNext = document.getElementById('btn-fc-next');
  const cardScene = document.getElementById('card-3d-scene');
  const cardBody = document.getElementById('card-3d-body');

  const btnAgain = document.getElementById('btn-fc-again');
  const btnMaster = document.getElementById('btn-fc-master');

  // Flip Card Action
  cardScene.addEventListener('click', () => {
    if (!state.activeRoom) return;
    const roomId = state.activeRoom.id;
    const cards = state.flashcards[roomId] || [];
    if (cards.length === 0) return;

    // Don't flip if deck congratulations is active
    if (masteredCardIndexes.size === cards.length) return;

    cardBody.classList.toggle('flipped');
    unlockBadge('quiz_scholar');
  });

  // Previous card navigation
  btnPrev.addEventListener('click', (e) => {
    e.stopPropagation(); // Avoid flipping the card
    const roomId = state.activeRoom.id;
    const cards = state.flashcards[roomId] || [];
    if (cards.length === 0) return;

    cardBody.classList.remove('flipped');

    setTimeout(() => {
      // Find the previous unmastered card
      let prevIndex = state.currentFlashcardIndex;
      let found = false;

      for (let i = 0; i < cards.length; i++) {
        prevIndex = prevIndex > 0 ? prevIndex - 1 : cards.length - 1;
        if (!masteredCardIndexes.has(prevIndex) || masteredCardIndexes.size === cards.length) {
          state.currentFlashcardIndex = prevIndex;
          found = true;
          break;
        }
      }

      renderFlashcardsView();
    }, 150);
  });

  // Next card navigation
  btnNext.addEventListener('click', (e) => {
    e.stopPropagation(); // Avoid flipping the card
    const roomId = state.activeRoom.id;
    const cards = state.flashcards[roomId] || [];
    if (cards.length === 0) return;

    cardBody.classList.remove('flipped');

    setTimeout(() => {
      goToNextCard(cards);
      renderFlashcardsView();
    }, 150);
  });

  // Leitner "Review Again 🔴" click
  btnAgain.addEventListener('click', (e) => {
    e.stopPropagation();
    const roomId = state.activeRoom.id;
    const cards = state.flashcards[roomId] || [];
    if (cards.length === 0) return;

    // Play low audio buzzer chime
    playLeitnerSound('again');

    // Reset card body flip locally
    cardBody.classList.remove('flipped');

    // Slide to next card
    setTimeout(() => {
      goToNextCard(cards);
      renderFlashcardsView();
    }, 150);
  });

  // Leitner "Mastered 🟢" click
  btnMaster.addEventListener('click', (e) => {
    e.stopPropagation();
    const roomId = state.activeRoom.id;
    const cards = state.flashcards[roomId] || [];
    if (cards.length === 0) return;

    // Mark current card index as mastered
    masteredCardIndexes.add(state.currentFlashcardIndex);

    // Play high positive success chime
    playLeitnerSound('success');

    // Add immediate XP reward (+10 XP)
    addXP(10);

    cardBody.classList.remove('flipped');

    setTimeout(() => {
      // If all cards are now mastered
      if (masteredCardIndexes.size === cards.length) {
        if (!xpBonusAwarded) {
          addXP(50); // +50 Bonus XP for completion
          xpBonusAwarded = true;
          unlockBadge('quiz_scholar');
        }
      } else {
        // Go to next unmastered card
        goToNextCard(cards);
      }
      renderFlashcardsView();
    }, 150);
  });

  // Add card form submit
  formAdd.addEventListener('submit', (e) => {
    e.preventDefault();
    const front = document.getElementById('fc-front').value.trim();
    const back = document.getElementById('fc-back').value.trim();

    if (!front || !back) return;

    addFlashcard(front, back);

    document.getElementById('fc-front').value = '';
    document.getElementById('fc-back').value = '';

    // Reset congratulations state and focus on the new card
    xpBonusAwarded = false;
    const cards = state.flashcards[state.activeRoom.id] || [];
    state.currentFlashcardIndex = cards.length - 1;
    cardBody.classList.remove('flipped');
    renderFlashcardsView();
  });
}

function goToNextCard(cards) {
  let nextIndex = state.currentFlashcardIndex;
  for (let i = 0; i < cards.length; i++) {
    nextIndex = (nextIndex + 1) % cards.length;
    // Skip mastered cards if we haven't mastered everything
    if (!masteredCardIndexes.has(nextIndex) || masteredCardIndexes.size === cards.length) {
      state.currentFlashcardIndex = nextIndex;
      break;
    }
  }
}

// Programmatic Web Audio Synthesizer chimes for Leitner responses
function playLeitnerSound(type) {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'success') {
      osc.type = 'sine';
      // Ding tone (A5)
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else {
      // Again tone (A3)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {
    // Unsupported browser audio context
  }
}

export function renderFlashcardsView() {
  const currentIndexLabel = document.getElementById('fc-current-index');
  const totalCountLabel = document.getElementById('fc-total-count');
  const displayFront = document.getElementById('card-display-front');
  const displayBack = document.getElementById('card-display-back');
  const cardBody = document.getElementById('card-3d-body');

  const leitnerPanel = document.getElementById('leitner-panel');
  const leitnerProgressText = document.getElementById('leitner-progress-text');
  const leitnerProgressFill = document.getElementById('leitner-progress-fill');

  const btnPrev = document.getElementById('btn-fc-prev');
  const btnNext = document.getElementById('btn-fc-next');

  if (!currentIndexLabel || !state.activeRoom) return;

  const roomId = state.activeRoom.id;
  const cards = state.flashcards[roomId] || [];

  // Reset mastered card list if we swapped study rooms
  if (roomId !== currentRoomId) {
    currentRoomId = roomId;
    masteredCardIndexes.clear();
    xpBonusAwarded = false;
  }

  // Handle empty deck
  if (cards.length === 0) {
    currentIndexLabel.textContent = '0';
    totalCountLabel.textContent = '0';
    displayFront.textContent = 'No flashcards in this deck yet. Create one or ask Jaypee AI to generate them!';
    displayBack.textContent = 'Type "/books" or ask: "generate anatomy flashcards about the heart" to populate cards automatically.';
    cardBody.classList.remove('flipped');
    
    // Hide controls
    if (leitnerPanel) leitnerPanel.classList.add('hidden');
    return;
  }

  // Handle deck completed (congratulations screen)
  if (masteredCardIndexes.size === cards.length) {
    currentIndexLabel.textContent = cards.length.toString();
    totalCountLabel.textContent = cards.length.toString();
    
    displayFront.innerHTML = `
      <div style="text-align: center; color: var(--color-secondary);">
        <span style="font-size: 2.2rem; display: block; margin-bottom: 0.5rem;">🎉</span>
        <h3 style="margin: 0 0 5px 0; font-size: 1rem; color: #fff;">Deck Mastered!</h3>
        <p style="font-size: 0.8rem; margin: 0 0 10px 0; color: rgba(255,255,255,0.7);">You checked off all active recall cards.</p>
        <strong style="color: var(--color-success); font-size: 0.85rem;">+50 Bonus XP Awarded</strong>
        <button id="btn-fc-restart" class="btn btn-primary btn-small" style="display: block; margin: 15px auto 0 auto; padding: 4px 12px; font-size: 0.75rem;">Restart Quiz</button>
      </div>
    `;
    displayBack.textContent = 'Spaced repetition round finished. Click Restart Quiz to study this deck again!';
    cardBody.classList.remove('flipped');

    // Configure restart button listener
    setTimeout(() => {
      const btnRestart = document.getElementById('btn-fc-restart');
      if (btnRestart) {
        btnRestart.addEventListener('click', (e) => {
          e.stopPropagation();
          masteredCardIndexes.clear();
          xpBonusAwarded = false;
          state.currentFlashcardIndex = 0;
          renderFlashcardsView();
        });
      }
    }, 50);

    // Update progress bar
    if (leitnerPanel) {
      leitnerPanel.classList.remove('hidden');
      leitnerProgressText.textContent = `${cards.length} / ${cards.length}`;
      leitnerProgressFill.style.width = '100%';
      
      // Hide buttons when completed
      leitnerPanel.querySelector('.leitner-buttons').style.display = 'none';
      leitnerPanel.querySelector('.leitner-label').textContent = 'Deck completed!';
    }
    return;
  }

  // Bound index check
  if (state.currentFlashcardIndex >= cards.length) {
    state.currentFlashcardIndex = Math.max(0, cards.length - 1);
  }

  // Ensure current card index is not one of the mastered ones (safeguard)
  if (masteredCardIndexes.has(state.currentFlashcardIndex)) {
    goToNextCard(cards);
  }

  const currentCard = cards[state.currentFlashcardIndex];
  
  currentIndexLabel.textContent = (state.currentFlashcardIndex + 1).toString();
  totalCountLabel.textContent = cards.length.toString();
  
  displayFront.textContent = currentCard.front;
  displayBack.textContent = currentCard.back;

  // Render Leitner Progress Bar
  if (leitnerPanel) {
    leitnerPanel.classList.remove('hidden');
    // Show buttons
    leitnerPanel.querySelector('.leitner-buttons').style.display = 'flex';
    leitnerPanel.querySelector('.leitner-label').textContent = 'Did you recall this correctly?';
    
    // Update labels
    leitnerProgressText.textContent = `${masteredCardIndexes.size} / ${cards.length}`;
    const percent = (masteredCardIndexes.size / cards.length) * 100;
    leitnerProgressFill.style.width = `${percent}%`;
  }
}
