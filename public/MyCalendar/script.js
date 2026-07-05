const daysContainer = document.querySelector('.calendar-grid');
const monthYearText = document.getElementById('monthYearText');
const monthImage = document.getElementById('month-image');
const noteInput = document.getElementById('noteInput');
const selectedDateText = document.getElementById('selectedDateText');
const saveBtn = document.getElementById('saveNote');
const prevBtn = document.getElementById('prevMonth');
const nextBtn = document.getElementById('nextMonth');
const eventTag = document.getElementById('eventTag');

let date = new Date();
let selectedDateKey = "";

const monthImages = [
    "jan.jpg", "feb.jpg", "mar.jpg", "apr.jpg",
    "may.jpg", "jun.jpg", "jul.jpg", "aug.jpg",
    "sep.jpg", "oct.jpg", "nov.jpg", "dec.jpg"
];

const monthColors = [
    "#00b894", "#00cec9", "#0984e3", "#6c5ce7", 
    "#fab1a0", "#ff7675", "#fd79a8", "#fdcb6e", 
    "#e17055", "#d63031", "#4834d4", "#2d3436"
];

function updateTheme(monthIndex) {
    const color = monthColors[monthIndex];
    document.documentElement.style.setProperty('--theme-color', color);
    document.body.style.backgroundColor = color + "15"; 
}

function renderCalendar() {
    const existingDays = daysContainer.querySelectorAll('.day, .empty-day');
    existingDays.forEach(el => el.remove());

    const month = date.getMonth();
    const year = date.getFullYear();

    monthYearText.innerText = `${date.toLocaleString('default', { month: 'long' })} ${year}`;
    monthImage.style.backgroundImage = `url('images/${monthImages[month]}')`;
    updateTheme(month);

    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();

    for (let x = firstDayIndex; x > 0; x--) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('empty-day');
        daysContainer.appendChild(emptyDiv);
    }

    for (let i = 1; i <= lastDay; i++) {
        const dayEl = document.createElement('div');
        dayEl.classList.add('day');
        dayEl.innerText = i;

        const dateKey = `${year}-${month + 1}-${i}`;
        const savedData = localStorage.getItem(dateKey);

        if (savedData) {
            const parsedData = JSON.parse(savedData);
            if (parsedData.text) dayEl.classList.add('has-note');
            if (parsedData.tag === 'festival') dayEl.classList.add('festival-mark');
            if (parsedData.tag === 'event') dayEl.classList.add('event-mark');
        }

        if (i === new Date().getDate() && 
            month === new Date().getMonth() && 
            year === new Date().getFullYear()) {
            dayEl.style.border = "3px solid var(--theme-color)";
        }

        dayEl.onclick = () => selectDate(i, dateKey, dayEl);
        daysContainer.appendChild(dayEl);
    }
}

function selectDate(day, key, element) {
    document.querySelectorAll('.day').forEach(d => d.classList.remove('active'));
    element.classList.add('active');
    
    selectedDateKey = key;
    selectedDateText.innerText = key;
    
    const savedData = localStorage.getItem(key);
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        noteInput.value = parsedData.text || "";
        eventTag.value = parsedData.tag || "none";
    } else {
        noteInput.value = "";
        eventTag.value = "none";
    }
}

saveBtn.onclick = () => {
    if (!selectedDateKey) {
        alert("Please select a day first!");
        return;
    }

    const noteData = {
        text: noteInput.value,
        tag: eventTag.value
    };

    localStorage.setItem(selectedDateKey, JSON.stringify(noteData));
    renderCalendar();
};

prevBtn.onclick = () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
};

nextBtn.onclick = () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
};

renderCalendar();