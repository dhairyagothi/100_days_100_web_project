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

    function totalMs() {
        const h = parseInt(hrsEl.value) || 0;
        const m = parseInt(minsEl.value) || 0;
        const s = parseInt(secsEl.value) || 0;
        return (h * 3600 + m * 60 + s) * 1000;
    }

    function humanDuration(ms) {
        const totalSecs = Math.floor(ms / 1000);
        const h = Math.floor(totalSecs / 3600);
        const m = Math.floor((totalSecs % 3600) / 60);
        const s = totalSecs % 60;
        const parts = [];
        if (h) parts.push(h + (h === 1 ? ' hour' : ' hours'));
        if (m) parts.push(m + (m === 1 ? ' minute' : ' minutes'));
        if (s) parts.push(s + (s === 1 ? ' second' : ' seconds'));
        return parts.length ? 'Reveals in ' + parts.join(', ') : 'Enter a duration above';
    }

    [hrsEl, minsEl, secsEl].forEach(el => el.addEventListener('input', () => {
        preview.textContent = humanDuration(totalMs());
    }));

    function checkCapsules() {
        const savedCapsules = JSON.parse(localStorage.getItem('capsules')) || [];
        const now = new Date().getTime();
        
        let updatedCapsules = [];
        let revealedCapsule = null;

        for (let capsule of savedCapsules) {
            if (now >= capsule.revealAt) {
                revealedCapsule = capsule;
                break; // Reveal only the first due capsule
            } else {
                updatedCapsules.push(capsule);
            }
        }

        if (revealedCapsule) {
            revealedMessage.textContent = revealedCapsule.message;
            messageReveal.classList.remove('hidden');
            capsuleReveal.classList.add('hidden');
            localStorage.setItem('capsules', JSON.stringify(updatedCapsules));
        }
    }

    // Run checkCapsules every second
    setInterval(checkCapsules, 1000);

    form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate first
    errEl.textContent = '';
    const message = messageInput.value.trim();
    if (!message) { errEl.textContent = 'Please write a message first.'; return; }
    const timer = totalMs();
    if (timer < 5000) { errEl.textContent = 'Set at least 5 seconds.'; return; }

    const revealAt = new Date().getTime() + timer;
    const newCapsule = { message, revealAt };
    const savedCapsules = JSON.parse(localStorage.getItem('capsules')) || [];
    savedCapsules.push(newCapsule);
    localStorage.setItem('capsules', JSON.stringify(savedCapsules));

    // Show feedback, hide old revealed message
    messageReveal.classList.add('hidden');
    capsuleReveal.classList.remove('hidden');
    revealTime.textContent = `Your message will be revealed at: ${new Date(revealAt).toLocaleTimeString()}`;

    // Clear inputs
    messageInput.value = '';
    hrsEl.value = '0'; minsEl.value = '0'; secsEl.value = '30';
    preview.textContent = 'Reveals in 30 seconds';
    });
});
