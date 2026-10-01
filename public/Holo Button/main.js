const fileName = '4SvKgmIrnw7KodjP';
const canvas = document.getElementById('canvas3d');
const holoButton = document.getElementById('holoButton');
const statusText = document.getElementById('statusText');
const demoAction = document.getElementById('demoAction');
const navigationDemo = document.getElementById('navigationDemo');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const themeButtons = document.querySelectorAll('.theme-option');
let toastTimer;
let isProcessing = false;

const messages = {
  standby: 'Standby mode. Choose a theme or activate the assistant.',
  hover: 'Target locked. Click to run the hologram action.',
  loading: 'Initializing secure hologram channel...',
  active: 'AI assistant activated. This button can now trigger app logic.',
  demo: 'Demo action complete: notification, loading state, and callback fired.',
};

async function loadSplineScene() {
  try {
    const { Application } = await import('https://esm.sh/@splinetool/runtime');
    const app = new Application(canvas);
    await app.load(`https://prod.spline.design/${fileName}/scene.splinecode`);
  } catch (error) {
    canvas.hidden = true;
    console.warn(
      'Spline scene could not be loaded. The button UI is still available.',
      error
    );
  }
}

function playFeedbackTone() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) {
    return;
  }

  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    880,
    audioContext.currentTime + 0.12
  );
  gain.gain.setValueAtTime(0.001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.18, audioContext.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + 0.18
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.2);
}

function setButtonState(state, message) {
  holoButton.classList.toggle('is-loading', state === 'loading');
  holoButton.classList.toggle('is-active', state === 'active');
  holoButton.querySelector('.button-subtext').textContent =
    state === 'loading' ? 'Syncing' : state;
  statusText.textContent = message;
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toastMessage.textContent = message;
  toast.classList.add('is-visible');

  toastTimer = window.setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 3200);
}

function triggerHologramAction(
  message = messages.active,
  toastText = 'AI assistant activated successfully.'
) {
  if (isProcessing) return;

  isProcessing = true;

  holoButton.disabled = true;

  playFeedbackTone();
  setButtonState('loading', messages.loading);

  window.setTimeout(() => {
    setButtonState('active', message);

    showToast(toastText);

    holoButton.dispatchEvent(
      new CustomEvent('hologram:activated', {
        bubbles: true,
        detail: {
          action: holoButton.dataset.action,
          theme: document.body.dataset.theme || 'cyan',
        },
      })
    );

    isProcessing = false;
    holoButton.disabled = false;
  }, 900);
}

document.body.dataset.theme = 'cyan';

holoButton.addEventListener('mouseenter', () => {
  if (!holoButton.classList.contains('is-active')) {
    statusText.textContent = messages.hover;
  }
});

holoButton.addEventListener('mouseleave', () => {
  if (!holoButton.classList.contains('is-active')) {
    statusText.textContent = messages.standby;
  }
});

holoButton.addEventListener('click', () => triggerHologramAction());

demoAction.addEventListener('click', () => {
  holoButton.dataset.action = 'demo-notification';
  triggerHologramAction(
    messages.demo,
    'Demo action completed. Event callback fired.'
  );
});

navigationDemo.addEventListener('click', () => {
  const message =
    'Navigation module opened. Connect this action to a route or menu in your app.';
  holoButton.dataset.action = 'open-navigation';
  statusText.textContent = message;
  showToast('Navigation demo triggered. No page redirect needed.');

  holoButton.dispatchEvent(
    new CustomEvent('hologram:activated', {
      bubbles: true,
      detail: {
        action: holoButton.dataset.action,
        theme: document.body.dataset.theme || 'cyan',
      },
    })
  );
});

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    document.body.dataset.theme = button.dataset.theme;
    themeButtons.forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    statusText.textContent = `${button.dataset.theme} theme applied.`;
    showToast(`${button.dataset.theme} hologram theme applied.`);
  });
});

loadSplineScene();
