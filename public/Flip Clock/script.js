function updateClock() {
  const now = new Date();

  document.getElementById('hour').textContent = String(now.getHours()).padStart(
    2,
    '0'
  );

  document.getElementById('minute').textContent = String(
    now.getMinutes()
  ).padStart(2, '0');

  document.getElementById('second').textContent = String(
    now.getSeconds()
  ).padStart(2, '0');

  document.getElementById('date').textContent = now.toLocaleDateString();

  document.getElementById('day').textContent = now.toLocaleDateString('en-US', {
    weekday: 'long',
  });
}

function changeTheme(theme, button) {
  const themes = {
    mint: {
      text: '#5c9b7b',
      bg: '#dff7ea',
    },

    lavender: {
      text: '#8b6fb3',
      bg: '#e9defa',
    },

    peach: {
      text: '#d68a72',
      bg: '#ffe7dd',
    },

    sky: {
      text: '#6f9ecf',
      bg: '#dfefff',
    },

    sakura: {
      text: '#c47a94',
      bg: '#ffdfe8',
    },

    butter: {
      text: '#c2a24a',
      bg: '#fff4c9',
    },
  };

  document.documentElement.style.setProperty('--text', themes[theme].text);

  document.documentElement.style.setProperty('--bg', themes[theme].bg);

  document.querySelectorAll('.color').forEach((btn) => {
    btn.classList.remove('active');
    btn.setAttribute('aria-pressed', 'false');
  });

  button.classList.add('active');
  button.setAttribute('aria-pressed', 'true');
}
updateClock();
setInterval(updateClock, 1000);
