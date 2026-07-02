const input = document.getElementById('commandInput');
const outputArea = document.getElementById('outputArea');
const terminalBody = document.getElementById('terminalBody');

// Ensure clicking anywhere in the terminal focuses the input
terminalBody.addEventListener('click', () => {
  input.focus();
});

input.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    const cmd = input.value.trim();
    if (!cmd) return;

    // Echo the command to the screen
    printLine(`user@macbook ~ % ${cmd}`, 'user-cmd');

    // Disable input while processing
    input.value = '';
    input.disabled = true;

    await processCommand(cmd);

    // Re-enable input
    input.disabled = false;
    input.focus();
    scrollToBottom();
  }
});

async function processCommand(cmd) {
  const command = cmd.toLowerCase();

  switch (command) {
    case 'help':
      printLine('Available commands:', 'system-msg');
      printLine('  fetch --joke      : Get a programming joke', 'highlight');
      printLine(
        '  sudo entertain_me : Bypass permissions to get a joke',
        'highlight'
      );
      printLine('  clear             : Clear the terminal output', 'highlight');
      break;

    case 'clear':
      outputArea.innerHTML = '';
      break;

    case 'fetch --joke':
    case 'sudo entertain_me':
      await fetchProgrammingJoke();
      break;

    default:
      printLine(`bash: command not found: ${cmd}`, 'error-msg');
      printLine(`Type 'help' for available commands.`, 'system-msg');
  }
}

async function fetchProgrammingJoke() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    printLine('Connecting to JokeAPI v2...', 'system-msg');

    const response = await fetch(
      'https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit',
      {
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    const data = await response.json();

    if (data.error) {
      throw new Error('API Error');
    }

    if (data.type === 'single') {
      await typeWriter(data.joke, 'joke-punchline');
    } else {
      await typeWriter(data.setup, 'joke-setup');

      const thinkingDiv = document.createElement('div');
      thinkingDiv.className = 'typing-indicator';
      thinkingDiv.textContent = '...';
      outputArea.appendChild(thinkingDiv);
      scrollToBottom();

      await sleep(2000);

      thinkingDiv.remove();
      await typeWriter(data.delivery, 'joke-punchline');
    }

    printLine('', '');
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      printLine(
        'Request timed out. Please check your connection and try again.',
        'error-msg'
      );
    } else {
      printLine(
        'Error: Failed to fetch joke. Are you connected to the internet?',
        'error-msg'
      );
    }
  }
}

// Utility function to print static text immediately
function printLine(text, className) {
  const div = document.createElement('div');
  div.textContent = text;
  if (className) div.className = className;
  outputArea.appendChild(div);
  scrollToBottom();
}

// Utility function to create a typing effect
async function typeWriter(text, className) {
  const div = document.createElement('div');
  if (className) div.className = className;
  outputArea.appendChild(div);

  for (let i = 0; i < text.length; i++) {
    div.textContent += text.charAt(i);
    scrollToBottom();
    // 30ms delay between characters for terminal speed
    await sleep(30);
  }
}

// Keep the terminal scrolled to the bottom
function scrollToBottom() {
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Simple Promise-based sleep function for async/await
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
