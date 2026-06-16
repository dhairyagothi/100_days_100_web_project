let count = 0;
let animationTimeout = null;

const counterValue = document.getElementById('counter-value');
const incrementBtn = document.getElementById('increment-btn');
const decrementBtn = document.getElementById('decrement-btn');
const resetBtn = document.getElementById('reset-btn');
const saveBtn = document.getElementById('save-btn');
const historyLog = document.getElementById('history-log');

// Update UI
function updateDisplay() {
  counterValue.textContent = count;

  // Prevent overlapping animation timers
  if (animationTimeout) {
    clearTimeout(animationTimeout);
  }

  // Restart animation cleanly
  counterValue.style.transform = 'scale(1)';

  // Force reflow so rapid clicks restart the animation
  void counterValue.offsetWidth;

  counterValue.style.transform = 'scale(1.1)';

  animationTimeout = setTimeout(() => {
    counterValue.style.transform = 'scale(1)';
    animationTimeout = null;
  }, 100);
}

// Event Listeners
incrementBtn.addEventListener('click', () => {
  count++;
  updateDisplay();
});

decrementBtn.addEventListener('click', () => {
  count--;
  updateDisplay();
});

resetBtn.addEventListener('click', () => {
  count = 0;
  updateDisplay();
});

saveBtn.addEventListener('click', () => {
  const li = document.createElement('li');
  const timestamp = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  li.textContent = `Saved Count: ${count} at ${timestamp}`;
  historyLog.prepend(li); // Adds newest log to the top
});
