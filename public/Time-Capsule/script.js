document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('capsuleForm');
  const messageInput = document.getElementById('message');
  const hrsEl = document.getElementById('hrs');
  const minsEl = document.getElementById('mins');
  const secsEl = document.getElementById('secs');
  const preview = document.getElementById('preview');
  const errEl = document.getElementById('err');
  const capsuleReveal = document.getElementById('capsuleReveal');
  const messageReveal = document.getElementById('messageReveal');
  const revealTime = document.getElementById('revealTime');
  const revealedMessage = document.getElementById('revealedMessage');

  // Safely get capsules from localStorage
  function getCapsules() {
    try {
      return JSON.parse(localStorage.getItem('capsules')) || [];
    } catch (error) {
      console.error('Error reading capsules from localStorage:', error);
      return [];
    }
  }

  // Safely save capsules
  function saveCapsules(capsules) {
    localStorage.setItem('capsules', JSON.stringify(capsules));
  }

  function totalMs() {
    const h = Math.max(0, parseInt(hrsEl.value) || 0);
    const m = Math.min(Math.max(0, parseInt(minsEl.value) || 0), 59);
    const s = Math.min(Math.max(0, parseInt(secsEl.value) || 0), 59);

    return (h * 3600 + m * 60 + s) * 1000;
  }

  function humanDuration(ms) {
    const totalSecs = Math.floor(ms / 1000);

    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;

    const parts = [];

    if (h) parts.push(`${h} ${h === 1 ? 'hour' : 'hours'}`);
    if (m) parts.push(`${m} ${m === 1 ? 'minute' : 'minutes'}`);
    if (s) parts.push(`${s} ${s === 1 ? 'second' : 'seconds'}`);

    return parts.length
      ? `Reveals in ${parts.join(', ')}`
      : 'Enter a duration above';
  }

  [hrsEl, minsEl, secsEl].forEach((el) => {
    el.addEventListener('input', () => {
      preview.textContent = humanDuration(totalMs());
    });
  });

  function checkCapsules() {
    const capsules = getCapsules();
    const now = Date.now();

    const dueCapsules = capsules.filter((capsule) => now >= capsule.revealAt);

    const pendingCapsules = capsules.filter(
      (capsule) => now < capsule.revealAt
    );

    if (dueCapsules.length > 0) {
      revealedMessage.innerHTML = '';

      dueCapsules.forEach((capsule, index) => {
        const wrapper = document.createElement('div');

        const title = document.createElement('strong');
        title.textContent = `Message ${index + 1}:`;

        const lineBreak = document.createElement('br');

        const messageText = document.createTextNode(capsule.message);

        wrapper.appendChild(title);
        wrapper.appendChild(lineBreak);
        wrapper.appendChild(messageText);

        revealedMessage.appendChild(wrapper);

        if (index < dueCapsules.length - 1) {
          revealedMessage.appendChild(document.createElement('hr'));
        }
      });

      messageReveal.classList.remove('hidden');
      capsuleReveal.classList.add('hidden');

      saveCapsules(pendingCapsules);
    }
  }

  // Run immediately on page load
  checkCapsules();

  // Then check every second
  setInterval(checkCapsules, 1000);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    errEl.textContent = '';

    const message = messageInput.value.trim();

    if (!message) {
      errEl.textContent = 'Please write a message first.';
      return;
    }

    const timer = totalMs();

    if (timer < 5000) {
      errEl.textContent = 'Set at least 5 seconds.';
      return;
    }

    const revealAt = Date.now() + timer;

    const newCapsule = {
      message,
      revealAt,
    };

    const capsules = getCapsules();
    capsules.push(newCapsule);

    saveCapsules(capsules);

    // Hide previous revealed message if visible
    messageReveal.classList.add('hidden');
    capsuleReveal.classList.remove('hidden');

    revealTime.textContent = `Your message will be revealed at: ${new Date(revealAt).toLocaleTimeString()}`;

    // Reset form
    messageInput.value = '';

    hrsEl.value = '0';
    minsEl.value = '0';
    secsEl.value = '30';

    preview.textContent = 'Reveals in 30 seconds';
  });
});
