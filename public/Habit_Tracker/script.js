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
let selectedHabitForHeatmap = null;

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

// Get all unique categories
function getAllCategories() {
    const categories = new Set();
    habits.forEach(h => {
        if (h.category) categories.add(h.category);
    });
    return ['all', ...Array.from(categories)];
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
        renderCategoryStats();
        renderHeatmap();
    } else if (currentView === 'all-habits') {
        populateCategoryFilter();
        renderAllHabitsView();
    }
}

function renderSidebarStats() {
    let totalCurrentStreak = 0;
    let bestAllTimeStreak = 0;

    habits.forEach(h => {
        const streak = calculateStreak(h.completedDates);
        totalCurrentStreak += streak;
        if (streak > bestAllTimeStreak) bestAllTimeStreak = streak;
    });

    const maxCurrent = habits.length ? Math.max(...habits.map(h => calculateStreak(h.completedDates))) : 0;
    
    document.getElementById('sidebarCurrentStreak').textContent = `${maxCurrent} days`;
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

        let dotsHtml = '';
        const dotsCount = Math.min(habits.length, 3);
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
        const streak = calculateStreak(h.completedDates);
        if (streak > bestEverStreak) bestEverStreak = streak;
    });

    document.getElementById("analyticsTotalHabits").textContent = habits.length;
    document.getElementById("analyticsAllTimeCompletions").textContent = allTimeCompletions;
    document.getElementById("analyticsBestStreak").textContent = bestEverStreak;
}

// --- CATEGORY STATISTICS ---
function renderCategoryStats() {
    const grid = document.getElementById("categoryStatsGrid");
    grid.innerHTML = "";

    const categoryMap = {};
    habits.forEach(h => {
        const cat = h.category || 'Uncategorized';
        if (!categoryMap[cat]) {
            categoryMap[cat] = { total: 0, completed: 0 };
        }
        categoryMap[cat].total++;
        if (h.completedDates && h.completedDates.length > 0) {
            categoryMap[cat].completed++;
        }
    });

    Object.keys(categoryMap).forEach(cat => {
        const data = categoryMap[cat];
        const completionRate = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
        
        const card = document.createElement("div");
        card.className = "category-stat-card";
        card.innerHTML = `
            <div class="category-name">${cat}</div>
            <div class="category-count">${data.completed}/${data.total}</div>
            <div class="category-progress">${completionRate}% completion rate</div>
            <div class="category-bar">
                <div class="category-bar-fill" style="width: ${completionRate}%"></div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- HEATMAP VISUALIZATION ---
function renderHeatmap() {
    const analyticsContent = document.getElementById("analyticsContent");
    
    // Remove existing heatmap containers properly
    const existingSelectors = analyticsContent.querySelectorAll('.heatmap-selector-container');
    existingSelectors.forEach(el => el.remove());
    
    const existingHeatmaps = analyticsContent.querySelectorAll('.heatmap-container');
    existingHeatmaps.forEach(el => el.remove());

    if (habits.length === 0) return;

    // Create habit selector for heatmap
    const selectorContainer = document.createElement('div');
    selectorContainer.className = 'heatmap-selector-container';
    selectorContainer.style.marginTop = '30px';
    selectorContainer.innerHTML = `
        <h2 style="color: #ccc; margin-bottom: 15px;">Streak Visualization</h2>
        <select id="heatmapHabitSelect" class="filter-select" style="margin-bottom: 15px;">
            ${habits.map(h => `<option value="${h.id}">${h.icon || '⭐'} ${h.name}</option>`).join('')}
        </select>
    `;
    analyticsContent.appendChild(selectorContainer);

    // Create heatmap container
    const heatmapContainer = document.createElement('div');
    heatmapContainer.className = 'heatmap-container';
    heatmapContainer.id = 'heatmapContainer';
    analyticsContent.appendChild(heatmapContainer);

    // Show heatmap for selected habit
    const habitSelect = document.getElementById('heatmapHabitSelect');
    if (habitSelect) {
        // Remove old event listener by cloning
        const newSelect = habitSelect.cloneNode(true);
        habitSelect.parentNode.replaceChild(newSelect, habitSelect);
        
        newSelect.onchange = () => {
            renderHeatmapForHabit(Number(newSelect.value));
        };
        // Render initial heatmap
        if (habits.length > 0) {
            renderHeatmapForHabit(Number(newSelect.value));
        }
    }
}

function renderHeatmapForHabit(habitId) {
    const container = document.getElementById('heatmapContainer');
    if (!container) return;

    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    // Get last 365 days
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setDate(oneYearAgo.getDate() - 364);

    const dates = [];
    const currentDate = new Date(oneYearAgo);
    while (currentDate <= today) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate completion levels
    const completedSet = new Set(habit.completedDates || []);
    const maxCompletions = Math.max(...dates.map(d => {
        const dateStr = getISODate(d);
        return completedSet.has(dateStr) ? 1 : 0;
    }), 1);

    // Build heatmap grid
    let gridHtml = '<div class="heatmap-grid">';
    dates.forEach(d => {
        const dateStr = getISODate(d);
        const isCompleted = completedSet.has(dateStr);
        const level = isCompleted ? Math.min(4, Math.floor((1 / maxCompletions) * 4)) : 0;
        const title = `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}: ${isCompleted ? '✅ Completed' : '❌ Not completed'}`;
        gridHtml += `<div class="heatmap-cell level-${level}" title="${title}"></div>`;
    });
    gridHtml += '</div>';

    // Add legend
    const legendHtml = `
        <div class="heatmap-legend">
            <span>Less</span>
            <div class="legend-color level-0"></div>
            <div class="legend-color level-1"></div>
            <div class="legend-color level-2"></div>
            <div class="legend-color level-3"></div>
            <div class="legend-color level-4"></div>
            <span>More</span>
        </div>
    `;

    // Add progress bar for this habit
    const totalDays = dates.length;
    const completedDays = completedSet.size;
    const completionRate = Math.round((completedDays / totalDays) * 100);
    const currentStreak = calculateStreak(habit.completedDates);

    container.innerHTML = `
        <h3 style="margin-bottom: 15px;">${habit.icon} ${habit.name} - Last 365 Days</h3>
        <div class="progress-container">
            <div class="progress-label">
                <span>Overall Completion</span>
                <span>${completedDays}/${totalDays} days (${completionRate}%)</span>
            </div>
            <div class="progress-bar">
                <div class="progress-bar-fill" style="width: ${completionRate}%"></div>
            </div>
        </div>
        <div class="progress-container">
            <div class="progress-label">
                <span>Current Streak</span>
                <span>🔥 ${currentStreak} days</span>
            </div>
            <div class="progress-bar">
                <div class="progress-bar-fill" style="width: ${Math.min(currentStreak / 30 * 100, 100)}%; background: linear-gradient(90deg, #f59e0b, #ef4444);"></div>
            </div>
        </div>
        ${gridHtml}
        ${legendHtml}
    `;
}

// --- ALL HABITS VIEW WITH FILTERS ---
function populateCategoryFilter() {
    const filter = document.getElementById("categoryFilter");
    const currentValue = filter.value;
    filter.innerHTML = '';
    
    const categories = getAllCategories();
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat === 'all' ? 'All Categories' : cat;
        filter.appendChild(option);
    });
    
    if (currentValue) filter.value = currentValue;
}

function renderAllHabitsView() {
    const list = document.getElementById("allHabitsList");
    list.innerHTML = "";

    const categoryFilter = document.getElementById("categoryFilter").value;
    let filteredHabits = habits;
    
    if (categoryFilter !== 'all') {
        filteredHabits = habits.filter(h => h.category === categoryFilter);
    }

    if (filteredHabits.length === 0) {
        list.innerHTML = `<p style="color: #888; text-align: center; padding: 40px;">No habits found${categoryFilter !== 'all' ? ' in this category' : ''}. Click "+ Add habit" to start!</p>`;
        return;
    }

    filteredHabits.forEach(habit => {
        const card = document.createElement("div");
        card.className = `habit-card`;
        
        const currentStreak = calculateStreak(habit.completedDates);
        
        card.innerHTML = `
            <div class="habit-icon" style="background-color: ${habit.color}40; color: ${habit.color}">
                ${habit.icon || '⭐'}
            </div>
            <div class="habit-details">
                <div class="habit-title">${habit.name}</div>
                <div class="habit-subtitle">${habit.category} · 🔥 ${currentStreak} day streak</div>
            </div>
            <div class="habit-card-actions">
                <button class="btn-icon view-streak-btn" data-id="${habit.id}">📊</button>
                <button class="btn-icon edit-btn" data-id="${habit.id}">✏️</button>
                <button class="btn-icon delete-btn" data-id="${habit.id}">🗑️</button>
            </div>
        `;
        list.appendChild(card);
    });

    // View streak button - switch to analytics and show heatmap for this habit
    document.querySelectorAll('#view-all-habits .view-streak-btn').forEach(btn => {
        btn.onclick = (e) => {
            const id = Number(e.currentTarget.dataset.id);
            // Switch to analytics view
            document.querySelectorAll('.menu-section .nav-btn').forEach(b => b.classList.remove('active'));
            const analyticsBtn = document.querySelector('[data-view="analytics"]');
            if (analyticsBtn) analyticsBtn.classList.add('active');
            
            document.querySelectorAll('.view-section').forEach(v => v.style.display = 'none');
            currentView = 'analytics';
            document.getElementById('view-analytics').style.display = 'block';
            
            // Store selected habit ID for heatmap
            selectedHabitForHeatmap = id;
            renderApp();
            
            // Wait for render to complete then select the habit
            setTimeout(() => {
                const select = document.getElementById('heatmapHabitSelect');
                if (select) {
                    select.value = id;
                    select.onchange();
                }
            }, 100);
        };
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

// --- 4. NAVIGATION LOGIC ---
document.querySelectorAll('.menu-section .nav-btn').forEach(btn => {
    btn.onclick = (e) => {
        if (e.currentTarget.id === 'addHabitSidebarBtn') return;
        
        document.querySelectorAll('.menu-section .nav-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

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
    document.getElementById("customCategoryContainer").style.display = "none";
    habitModal.style.display = "flex";
};

// Show custom category input when "Custom" is selected
document.getElementById("habitCategory").onchange = function() {
    const container = document.getElementById("customCategoryContainer");
    if (this.value === "Custom") {
        container.style.display = "block";
    } else {
        container.style.display = "none";
    }
};

document.getElementById("cancelHabitBtn").onclick = () => {
    habitModal.style.display = "none";
};

document.getElementById("saveHabitBtn").onclick = () => {
    const name = document.getElementById("habitName").value;
    if (!name) return;

    const editId = document.getElementById("editHabitId").value;
    let category = document.getElementById("habitCategory").value;
    
    // If custom category, use the custom input
    if (category === "Custom") {
        const customName = document.getElementById("customCategoryName").value.trim();
        if (!customName) {
            alert("Please enter a custom category name");
            return;
        }
        category = customName;
    }
    
    const data = {
        name,
        category: category,
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

// --- 6. FILTER EVENT ---
document.getElementById("categoryFilter").onchange = () => {
    renderAllHabitsView();
};

// --- 7. DELETE MODAL ---
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
    if(localStorage.getItem('momentum_theme')=='light')document.getElementById('themeToggleBtn').innerText = '🌙';
    else document.getElementById('themeToggleBtn').innerText = '☀️';
};

// Initial Render
renderApp();