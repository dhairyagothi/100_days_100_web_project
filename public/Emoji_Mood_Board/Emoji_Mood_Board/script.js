document.addEventListener('DOMContentLoaded', function() {
    loadLog();
});

function logMood(emoji, mood) {
    const now = new Date();
    const date = now.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    const time = now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const entry = {
        emoji: emoji,
        mood: mood,
        date: date,
        time: time
    };

    const log = getLog();
    log.unshift(entry);
    localStorage.setItem('moodLog', JSON.stringify(log));

    renderLog();
}

function getLog() {
    const data = localStorage.getItem('moodLog');
    return data ? JSON.parse(data) : [];
}

function renderLog() {
    const log = getLog();
    const container = document.getElementById('mood-log');

    if (log.length === 0) {
        container.innerHTML = '<p class="empty-msg">No moods logged yet. Click an emoji above!</p>';
        return;
    }

    container.innerHTML = log.map(function(entry) {
        return '<div class="log-item">' +
            '<span class="log-emoji">' + entry.emoji + '</span>' +
            '<span class="log-mood">' + entry.mood + '</span>' +
            '<span class="log-time">' + entry.date + ' · ' + entry.time + '</span>' +
        '</div>';
    }).join('');
}

function loadLog() {
    renderLog();
}

function clearLog() {
    if (confirm('Clear all mood history?')) {
        localStorage.removeItem('moodLog');
        renderLog();
    }
}
