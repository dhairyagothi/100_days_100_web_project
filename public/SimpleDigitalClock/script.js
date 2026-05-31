function updateTime() {
    const now = new Date();
    document.getElementById('time').textContent = 
    now.toLocaleTimeString();
}
setInterval(updateTime, 1000);
updateTime();

function updateDate() {
    const now = new Date();
    document.getElementById('date').textContent = 
    now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
setInterval(updateDate, 1000);
updateDate();
