const tips = [
    "Drink at least 8 glasses of water daily.",
    "Walk 30 minutes every day.",
    "Sleep for 7-8 hours.",
    "Avoid excessive sugar intake.",
    "Regular checkups help prevent disease."
];

const healthTip = document.getElementById("healthTip");

if(healthTip){
    const randomTip = tips[Math.floor(Math.random()*tips.length)];

    healthTip.innerHTML = `
        <div class="tip-card">
            ${randomTip}
        </div>
    `;
}
function animateValue(id, start, end, duration) {
    let range = end - start;
    let current = start;
    let increment = end > start ? 1 : -1;
    let stepTime = Math.abs(Math.floor(duration / range));

    const obj = document.getElementById(id);

    const timer = setInterval(() => {
        current += increment;
        obj.textContent = current;

        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}

animateValue("heartRate", 60, 78, 2000);