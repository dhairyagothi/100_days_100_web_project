document.addEventListener("DOMContentLoaded", () => {

    // ── Audio Mixer ───────────────────────────────────────────
    const tracks = [
        { slider: document.getElementById('vol-rain'),  audio: document.getElementById('audio-rain'),  theme: 'cozy' },
        { slider: document.getElementById('vol-cafe'),  audio: document.getElementById('audio-cafe'),  theme: 'cafe' },
        { slider: document.getElementById('vol-ocean'), audio: document.getElementById('audio-ocean'), theme: 'cozy' },
    ];

    tracks.forEach(track => {
        track.slider.addEventListener('input', (e) => {
            const vol = parseFloat(e.target.value);
            track.audio.volume = vol;
            if (vol > 0 && track.audio.paused) {
                track.audio.play().catch(() => {});
                document.documentElement.setAttribute('data-theme', track.theme);
            } else if (vol === 0) {
                track.audio.pause();
            }
        });
    });

    // ── Theme Toggle ──────────────────────────────────────────
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const html = document.documentElement;
        html.setAttribute('data-theme', html.getAttribute('data-theme') === 'cozy' ? 'cafe' : 'cozy');
    });

    // ── Pomodoro Timer ────────────────────────────────────────
    let timerInterval = null;
    let totalDuration = 25 * 60;
    let timeLeft = totalDuration;

    const countdownEl = document.getElementById('countdown-text');
    const ring = document.querySelector('.ring-fg');
    const CIRC = 2 * Math.PI * 96; // r=96

    ring.style.strokeDasharray = `${CIRC} ${CIRC}`;

    function setProgress(pct) {
        ring.style.strokeDashoffset = CIRC - (pct / 100) * CIRC;
    }

    function render() {
        const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const s = (timeLeft % 60).toString().padStart(2, '0');
        countdownEl.textContent = `${m}:${s}`;
        setProgress(((totalDuration - timeLeft) / totalDuration) * 100);
    }

    function showToast() {
        const t = document.getElementById('toast');
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3500);
    }

    document.getElementById('btn-start').addEventListener('click', () => {
        if (timerInterval) return;
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                render();
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
                showToast();
            }
        }, 1000);
    });

    document.getElementById('btn-pause').addEventListener('click', () => {
        clearInterval(timerInterval);
        timerInterval = null;
    });

    document.getElementById('btn-reset').addEventListener('click', () => {
        clearInterval(timerInterval);
        timerInterval = null;
        timeLeft = totalDuration;
        render();
    });

    // Session length pills
    document.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            clearInterval(timerInterval);
            timerInterval = null;
            totalDuration = parseInt(pill.dataset.mins) * 60;
            timeLeft = totalDuration;
            // update label
            countdownEl.nextElementSibling.textContent =
                pill.dataset.mins === '5' ? 'BREAK' :
                pill.dataset.mins === '15' ? 'LONG BREAK' : 'FOCUS';
            render();
        });
    });

    // ── Quick Notes ───────────────────────────────────────────
    const notesEl = document.getElementById('notes-area');
    const statusEl = document.getElementById('save-status');
    const charEl = document.getElementById('char-count');

    notesEl.value = localStorage.getItem('zenSpaceNotes') || '';
    charEl.textContent = `${notesEl.value.length} chars`;

    let saveTimeout;
    notesEl.addEventListener('input', () => {
        charEl.textContent = `${notesEl.value.length} chars`;
        statusEl.textContent = '● Saving…';
        statusEl.classList.add('saving');
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            localStorage.setItem('zenSpaceNotes', notesEl.value);
            statusEl.textContent = '● Saved';
            statusEl.classList.remove('saving');
        }, 600);
    });

    document.getElementById('btn-clear-notes').addEventListener('click', () => {
        if (notesEl.value && confirm('Clear all notes?')) {
            notesEl.value = '';
            charEl.textContent = '0 chars';
            localStorage.removeItem('zenSpaceNotes');
            statusEl.textContent = '● Cleared';
        }
    });

    // Initial render
    render();
});