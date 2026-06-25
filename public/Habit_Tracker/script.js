// --- 1. STATE & DATABASE ---
const db = {
    getHabits: () => JSON.parse(localStorage.getItem("habits")) || [],
    saveHabits: (data) => localStorage.setItem("habits", JSON.stringify(data))
};

let habits = [];
try { habits = db.getHabits(); } catch (e) { habits = []; }

// Theme Logic
const savedTheme = localStorage.getItem('momentum_theme') || 'dark';
if (savedTheme === 'light') document.body.classList.add('light');

// The date the user is currently viewing (defaults to today)
let selectedDate = new Date();
let currentView = 'today'; // today, weekly, analytics, all-habits
let deleteHabitId = null;

// --- 2. DATE HELPERS ---
function getISODate(dateObj) {
    return dateObj.toLocaleDateString('en-CA'); // YYYY-MM-DD local time
}

function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay() || 7; // Get current day number, converting Sun(0) to 7
    if (day !== 1) d.setHours(-24 * (day - 1)); // Adjust to Monday
    return d;
}

function getWeekDates(date) {
    const start = getStartOfWeek(date);
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        dates.push(d);
    }
    return dates;
}

function calculateStreak(completedDates) {
    if (!completedDates || completedDates.length === 0) return 0;
    const sorted = [...completedDates].sort((a, b) => new Date(b) - new Date(a));
    const todayStr = getISODate(new Date());
    
    let currStr = todayStr;
    if (new Date(sorted[0]) > new Date(todayStr)) {
        currStr = sorted[0];
    }
    
    let streak = 0;
    let curr = new Date(currStr);

    const last = new Date(sorted[0]);
    const diff = Math.floor((curr - last) / (1000 * 60 * 60 * 24));
    if (diff > 1) return 0;
    if (diff === 1) curr.setDate(curr.getDate() - 1); // Start checking from yesterday

    for (let i = 0; i < sorted.length; i++) {
        if (new Date(sorted[i]).getTime() === curr.getTime()) {
            streak++;
            curr.setDate(curr.getDate() - 1);
        } else {
            break;
        }
    }
    return streak;
}

// --- 3. RENDER LOGIC ---
function renderApp() {
    renderSidebarStats();
    
    if (currentView === 'today') {
        renderWeekSlider();
        renderHabitList();
        renderBottomStats();
    } else if (currentView === 'weekly') {
        renderWeeklyView();
    } else if (currentView === 'analytics') {
        renderAnalyticsView();
    } else if (currentView === 'all-habits') {
        renderAllHabitsView();
    }
}

function renderSidebarStats() {
    let totalCurrentStreak = 0;
    let bestAllTimeStreak = 0;

    habits.forEach(h => {
        const streak = calculateStreak(h.completedDates);
        totalCurrentStreak += streak; // Simple aggregate or max. Let's do max for the user.
        if (streak > bestAllTimeStreak) bestAllTimeStreak = streak;
    });

    const maxCurrent = habits.length ? Math.max(...habits.map(h => calculateStreak(h.completedDates))) : 0;
    
    // As per mockup, "Current streak" is likely the max streak of any habit.
    document.getElementById('sidebarCurrentStreak').textContent = `${maxCurrent} days`;
    
    // For best streak, we just keep it simple
    document.getElementById('sidebarBestStreak').textContent = `${maxCurrent} days`;
}

function renderWeekSlider() {
    const title = document.getElementById("todayDateTitle");
    const isToday = getISODate(selectedDate) === getISODate(new Date());
    
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    title.textContent = (isToday ? "Today — " : "") + selectedDate.toLocaleDateString('en-US', options);

    const weekDates = getWeekDates(selectedDate);
    const slider = document.getElementById("weekSlider");
    slider.innerHTML = "";

    weekDates.forEach(date => {
        const dateStr = getISODate(date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNum = date.getDate();

        const block = document.createElement("div");
        block.className = `day-block ${dateStr === getISODate(selectedDate) ? 'active' : ''}`;
        block.onclick = () => {
            selectedDate = new Date(date);
            renderApp();
        };

        // Calculate dots
        let dotsHtml = '';
        const dotsCount = Math.min(habits.length, 3); // show up to 3 dots
        for (let i = 0; i < dotsCount; i++) {
            const h = habits[i];
            const isDone = h && h.completedDates && h.completedDates.includes(dateStr);
            dotsHtml += `<div class="dot ${isDone ? 'done' : ''}"></div>`;
        }

        block.innerHTML = `
            <div class="day-name">${dayName}</div>
            <div class="day-num">${dayNum}</div>
            <div class="day-dots">${dotsHtml}</div>
        `;
        slider.appendChild(block);
    });
}

function renderHabitList() {
    const list = document.getElementById("habitList");
    list.innerHTML = "";

    const selectedDateStr = getISODate(selectedDate);
    let doneCount = 0;

    habits.forEach(habit => {
        const isDone = habit.completedDates && habit.completedDates.includes(selectedDateStr);
        if (isDone) doneCount++;

        const currentStreak = calculateStreak(habit.completedDates);

        const card = document.createElement("div");
        card.className = `habit-card ${isDone ? 'completed' : ''}`;
        
        // Use custom icon if set, otherwise fallback
        const icon = habit.icon || '⭐';

        card.innerHTML = `
            <div class="habit-icon" style="background-color: ${habit.color}40; color: ${isDone ? '#065f46' : habit.color}">
                ${icon}
            </div>
            <div class="habit-details">
                <div class="habit-title">${habit.name}</div>
                <div class="habit-subtitle">${habit.notes || habit.category}</div>
            </div>
            <div class="habit-streak">
                🔥 ${currentStreak}
            </div>
            <button class="habit-toggle" data-id="${habit.id}"></button>
        `;

        list.appendChild(card);
    });

    document.getElementById("habitCountText").textContent = `Habits · ${doneCount} of ${habits.length} done`;

    // Attach toggle events
    document.querySelectorAll('.habit-toggle').forEach(btn => {
        btn.onclick = (e) => {
            const id = Number(e.target.dataset.id);
            const habit = habits.find(h => h.id === id);
            if (!habit.completedDates) habit.completedDates = [];

            if (habit.completedDates.includes(selectedDateStr)) {
                habit.completedDates = habit.completedDates.filter(d => d !== selectedDateStr);
            } else {
                habit.completedDates.push(selectedDateStr);
            }
            db.saveHabits(habits);
            renderApp();
        };
    });
}

function renderBottomStats() {
    const weekDates = getWeekDates(selectedDate).map(d => getISODate(d));
    
    let totalPossible = habits.length * 7;
    let actualDone = 0;

    habits.forEach(h => {
        if(h.completedDates) {
            h.completedDates.forEach(d => {
                if (weekDates.includes(d)) actualDone++;
            });
        }
    });

    const completionRate = totalPossible === 0 ? 0 : Math.round((actualDone / totalPossible) * 100);
    
    document.getElementById("statCompletion").textContent = `${completionRate}%`;
    document.getElementById("statActive").textContent = habits.length;
    
    const maxStreak = habits.length ? Math.max(...habits.map(h => calculateStreak(h.completedDates))) : 0;
    document.getElementById("statDayStreak").textContent = maxStreak;
}

function renderWeeklyView() {
    const table = document.getElementById("weeklyTable");
    const weekDates = getWeekDates(selectedDate);
    
    let headerHtml = `<tr><th>Habit</th>`;
    weekDates.forEach(d => {
        headerHtml += `<th>${d.toLocaleDateString('en-US', {weekday:'short'})} ${d.getDate()}</th>`;
    });
    headerHtml += `</tr>`;

    let bodyHtml = '';
    habits.forEach(h => {
        bodyHtml += `<tr><td class="habit-name-cell">${h.icon || '⭐'} ${h.name}</td>`;
        weekDates.forEach(d => {
            const dateStr = getISODate(d);
            const isDone = h.completedDates && h.completedDates.includes(dateStr);
            bodyHtml += `<td><div class="check-dot ${isDone ? 'done' : ''}"></div></td>`;
        });
        bodyHtml += `</tr>`;
    });

    table.innerHTML = headerHtml + bodyHtml;
}

function renderAnalyticsView() {
    let allTimeCompletions = 0;
    let bestEverStreak = 0;

    habits.forEach(h => {
        if(h.completedDates) allTimeCompletions += h.completedDates.length;
        const streak = calculateStreak(h.completedDates); // Note: proper best streak needs historical calc, this is simplified
        if (streak > bestEverStreak) bestEverStreak = streak;
    });

    document.getElementById("analyticsTotalHabits").textContent = habits.length;
    document.getElementById("analyticsAllTimeCompletions").textContent = allTimeCompletions;
    document.getElementById("analyticsBestStreak").textContent = bestEverStreak;
}

// --- 4. NAVIGATION LOGIC ---
document.querySelectorAll('.menu-section .nav-btn').forEach(btn => {
    btn.onclick = (e) => {
        if (e.currentTarget.id === 'addHabitSidebarBtn') return; // Handled separately
        
        // Remove active class
        document.querySelectorAll('.menu-section .nav-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        // Hide all views
        document.querySelectorAll('.view-section').forEach(v => v.style.display = 'none');
        
        currentView = e.currentTarget.dataset.view;
        document.getElementById(`view-${currentView}`).style.display = 'block';
        
        renderApp();
    };
});

document.getElementById('prevWeekBtn').onclick = () => {
    selectedDate.setDate(selectedDate.getDate() - 7);
    renderApp();
};

document.getElementById('nextWeekBtn').onclick = () => {
    selectedDate.setDate(selectedDate.getDate() + 7);
    renderApp();
};

// --- 5. MODALS LOGIC ---
const habitModal = document.getElementById("habitModal");

document.getElementById("addHabitSidebarBtn").onclick = () => {
    document.getElementById("modalTitle").textContent = "Add Habit";
    document.getElementById("editHabitId").value = "";
    document.getElementById("habitName").value = "";
    document.getElementById("habitNotes").value = "";
    document.getElementById("habitCategory").value = "Health";
    document.getElementById("habitIcon").value = "🏃";
    habitModal.style.display = "flex";
};

document.getElementById("cancelHabitBtn").onclick = () => {
    habitModal.style.display = "none";
};

document.getElementById("saveHabitBtn").onclick = () => {
    const name = document.getElementById("habitName").value;
    if (!name) return;

    const editId = document.getElementById("editHabitId").value;
    const data = {
        name,
        category: document.getElementById("habitCategory").value,
        color: "#10b981",
        icon: document.getElementById("habitIcon").value,
        notes: document.getElementById("habitNotes").value
    };

    if (editId) {
        const index = habits.findIndex(h => h.id === Number(editId));
        if (index !== -1) {
            habits[index] = { ...habits[index], ...data };
        }
    } else {
        habits.push({
            ...data,
            id: Date.now(),
            completedDates: [],
            createdAt: getISODate(new Date())
        });
    }

    db.saveHabits(habits);
    habitModal.style.display = "none";
    renderApp();
};

// --- 6. ALL HABITS LOGIC ---
function renderAllHabitsView() {
    const list = document.getElementById("allHabitsList");
    list.innerHTML = "";

    if (habits.length === 0) {
        list.innerHTML = `<p style="color: #888; text-align: center; padding: 40px;">No habits created yet. Click "+ Add habit" to start!</p>`;
        return;
    }

    habits.forEach(habit => {
        const card = document.createElement("div");
        card.className = `habit-card`;
        
        card.innerHTML = `
            <div class="habit-icon" style="background-color: ${habit.color}40; color: ${habit.color}">
                ${habit.icon || '⭐'}
            </div>
            <div class="habit-details">
                <div class="habit-title">${habit.name}</div>
                <div class="habit-subtitle">${habit.category}</div>
            </div>
            <div class="habit-card-actions">
                <button class="btn-icon edit-btn" data-id="${habit.id}">✏️</button>
                <button class="btn-icon delete-btn" data-id="${habit.id}">🗑️</button>
            </div>
        `;
        list.appendChild(card);
    });

    document.querySelectorAll('#view-all-habits .edit-btn').forEach(btn => {
        btn.onclick = (e) => {
            const id = Number(e.currentTarget.dataset.id);
            const habit = habits.find(h => h.id === id);
            
            document.getElementById("modalTitle").textContent = "Edit Habit";
            document.getElementById("editHabitId").value = habit.id;
            document.getElementById("habitName").value = habit.name;
            document.getElementById("habitCategory").value = habit.category;
            document.getElementById("habitIcon").value = habit.icon || '⭐';
            document.getElementById("habitNotes").value = habit.notes || '';
            
            habitModal.style.display = "flex";
        };
    });

    document.querySelectorAll('#view-all-habits .delete-btn').forEach(btn => {
        btn.onclick = (e) => {
            deleteHabitId = Number(e.currentTarget.dataset.id);
            document.getElementById("deleteModal").style.display = "flex";
        };
    });
}

document.getElementById("confirmDeleteBtn").onclick = () => {
    if (deleteHabitId !== null) {
        habits = habits.filter(h => h.id !== deleteHabitId);
        db.saveHabits(habits);
        deleteHabitId = null;
        document.getElementById("deleteModal").style.display = "none";
        renderApp();
    }
};

document.getElementById("cancelDeleteBtn").onclick = () => {
    deleteHabitId = null;
    document.getElementById("deleteModal").style.display = "none";
};

// Close Modals on click outside
window.onclick = (e) => {
    const habitModal = document.getElementById("habitModal");
    const deleteModal = document.getElementById("deleteModal");
    if (e.target === habitModal) habitModal.style.display = "none";
    if (e.target === deleteModal) deleteModal.style.display = "none";
};

// Theme Toggle Button
document.getElementById('themeToggleBtn').onclick = () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    localStorage.setItem('momentum_theme', isLight ? 'light' : 'dark');
};

// Initial Render
renderApp();
