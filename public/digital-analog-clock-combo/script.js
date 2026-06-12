function updateClock() {
    const now = new Date();

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Digital Clock
    const digitalTime =
        String(hours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");

    document.getElementById("digitalClock").textContent = digitalTime;

    // Analog Clock
    const hourDeg = (hours % 12) * 30 + minutes * 0.5;
    const minuteDeg = minutes * 6;
    const secondDeg = seconds * 6;

    document.getElementById("hour").style.transform =
        `translateX(-50%) rotate(${hourDeg}deg)`;

    document.getElementById("minute").style.transform =
        `translateX(-50%) rotate(${minuteDeg}deg)`;

    document.getElementById("second").style.transform =
        `translateX(-50%) rotate(${secondDeg}deg)`;
}

updateClock();
setInterval(updateClock, 1000);