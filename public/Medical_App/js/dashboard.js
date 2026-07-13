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

if (document.getElementById("heartRate")) {
    animateValue("heartRate", 60, 78, 2000);
}

// Doctor Search
const globalSearch = document.getElementById('globalSearch');
if (globalSearch) {
    globalSearch.addEventListener('input', function () {
        const query = this.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.doctor-card');
        let found = 0;

        cards.forEach(card => {
            const name = card.querySelector('.doctor-name')?.textContent.toLowerCase() || '';
            const specialty = card.querySelector('.doctor-specialty')?.textContent.toLowerCase() || '';

            if (name.includes(query) || specialty.includes(query)) {
                card.style.display = '';
                found++;
            } else {
                card.style.display = 'none';
            }
        });

        if (query !== '') {
            document.querySelector('.doctors-section')?.scrollIntoView({ behavior: 'smooth' });
        }

        let noResult = document.getElementById('doctorNotFound');
        if (!noResult) {
            noResult = document.createElement('p');
            noResult.id = 'doctorNotFound';
            noResult.style.cssText = 'text-align:center; color:#888; padding:20px; width:100%;';
            document.querySelector('.doctors-grid').appendChild(noResult);
        }

        noResult.style.display = (found === 0 && query !== '') ? 'block' : 'none';
        if (found === 0 && query !== '') {
            noResult.textContent = `No doctor found for "${this.value}"`;
        }
    });
}