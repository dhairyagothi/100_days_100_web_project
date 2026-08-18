// State definition
let state = {
    exams: [],
    subjects: [],
    sessions: [],
    notifications: [],
    settings: {
        browserNotifications: false,
        theme: 'dark'
    }
};

// Global Timer Variables
let timerInterval = null;
let timerLeftSeconds = 1500; // 25 minutes default
let timerTotalSeconds = 1500;
let isTimerRunning = false;
let timerMode = 'focus'; // 'focus', 'deep', 'break'

// Calendar State
let calCurrentDate = new Date();
let calSelectedDate = new Date();

// Active planner subject
let activeSubjectId = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    loadState();
    setupRouting();
    setupEventListeners();
    setupTheme();
    
    // Start countdown ticks
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // Check deadlines immediately and schedule checks every 60s
    checkExamDeadlines();
    setInterval(checkExamDeadlines, 60000);

    // Initial render
    renderAll();
    
    // Set active subject to first available (if any)
    if (state.subjects.length > 0) {
        selectSubject(state.subjects[0].id);
    } else {
        togglePlannerDetail(false);
    }
}

// ----------------------------------------------------
// STATE MANAGEMENT & PERSISTENCE
// ----------------------------------------------------
function saveState() {
    localStorage.setItem('aether_planner_state', JSON.stringify(state));
}

function loadState() {
    const rawData = localStorage.getItem('aether_planner_state');
    if (rawData) {
        try {
            state = JSON.parse(rawData);
            // Ensure schema integrity
            if (!state.exams) state.exams = [];
            if (!state.subjects) state.subjects = [];
            if (!state.sessions) state.sessions = [];
            if (!state.notifications) state.notifications = [];
            if (!state.settings) state.settings = { browserNotifications: false, theme: 'dark' };
        } catch (e) {
            console.error("Error reading stored state, resetting.", e);
            resetStateToDefault();
        }
    } else {
        // Load some nice initial template data on first visit
        loadMockData();
    }
}

function resetStateToDefault() {
    state = {
        exams: [],
        subjects: [],
        sessions: [],
        notifications: [],
        settings: {
            browserNotifications: false,
            theme: 'dark'
        }
    };
    saveState();
}

function loadMockData() {
    const now = new Date();
    
    // Setup Mock Exams
    const examMathDate = new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000); // 8 days from now
    examMathDate.setHours(9, 0, 0, 0);
    
    const examHistoryDate = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 days from now
    examHistoryDate.setHours(14, 30, 0, 0);

    const examPhysicsDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
    examPhysicsDate.setHours(10, 0, 0, 0);

    state.exams = [
        { id: 'ex-1', title: 'Mathematics II (Calculus)', dateTime: examMathDate.toISOString() },
        { id: 'ex-2', title: 'Modern World History', dateTime: examHistoryDate.toISOString() },
        { id: 'ex-3', title: 'Physics Mechanics Final', dateTime: examPhysicsDate.toISOString() }
    ];

    // Setup Mock Subjects & Topics
    state.subjects = [
        {
            id: 'sb-1',
            name: 'Mathematics',
            color: '#6366f1',
            topics: [
                { id: 'tp-1-1', name: 'Limits and Continuity', priority: 'medium', completed: true },
                { id: 'tp-1-2', name: 'Derivatives & Applications', priority: 'high', completed: true },
                { id: 'tp-1-3', name: 'Integration Techniques', priority: 'high', completed: false },
                { id: 'tp-1-4', name: 'Differential Equations', priority: 'low', completed: false }
            ]
        },
        {
            id: 'sb-2',
            name: 'History',
            color: '#f59e0b',
            topics: [
                { id: 'tp-2-1', name: 'Industrial Revolution', priority: 'low', completed: true },
                { id: 'tp-2-2', name: 'World War I Alliances', priority: 'high', completed: false },
                { id: 'tp-2-3', name: 'The Great Depression', priority: 'medium', completed: false }
            ]
        },
        {
            id: 'sb-3',
            name: 'Physics',
            color: '#06b6d4',
            topics: [
                { id: 'tp-3-1', name: 'Kinematics & Vectors', priority: 'medium', completed: true },
                { id: 'tp-3-2', name: 'Newtons Laws of Motion', priority: 'high', completed: true },
                { id: 'tp-3-3', name: 'Rotational Dynamics', priority: 'high', completed: true },
                { id: 'tp-3-4', name: 'Work, Energy & Power', priority: 'low', completed: false }
            ]
        }
    ];

    // Setup Mock Study Sessions (last 7 days)
    const makeSessionDate = (daysAgo, hours, mins) => {
        const d = new Date();
        d.setDate(d.getDate() - daysAgo);
        d.setHours(hours, mins, 0, 0);
        return d.toISOString();
    };

    state.sessions = [
        { id: 'ss-1', subjectId: 'sb-1', durationSeconds: 2700, dateTime: makeSessionDate(6, 10, 0) }, // 45m Math 6 days ago
        { id: 'ss-2', subjectId: 'sb-3', durationSeconds: 1500, dateTime: makeSessionDate(5, 16, 30) }, // 25m Physics 5 days ago
        { id: 'ss-3', subjectId: 'sb-1', durationSeconds: 2700, dateTime: makeSessionDate(4, 9, 15) },  // 45m Math 4 days ago
        { id: 'ss-4', subjectId: 'sb-2', durationSeconds: 1500, dateTime: makeSessionDate(4, 11, 0) },  // 25m History 4 days ago
        { id: 'ss-5', subjectId: 'sb-3', durationSeconds: 2700, dateTime: makeSessionDate(3, 14, 0) },  // 45m Physics 3 days ago
        { id: 'ss-6', subjectId: 'sb-1', durationSeconds: 5400, dateTime: makeSessionDate(2, 10, 30) }, // 90m Math 2 days ago
        { id: 'ss-7', subjectId: 'sb-3', durationSeconds: 1500, dateTime: makeSessionDate(1, 15, 0) },  // 25m Physics yesterday
        { id: 'ss-8', subjectId: 'sb-1', durationSeconds: 2700, dateTime: makeSessionDate(0, 10, 0) }   // 45m Math today
    ];

    // Setup Mock Notifications
    state.notifications = [
        {
            id: 'nt-1',
            title: 'Revision Completed',
            desc: 'Great work! You logged 45 minutes on Mathematics.',
            dateTime: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            read: false
        },
        {
            id: 'nt-2',
            title: 'Exam Approach Alert',
            desc: 'Physics Mechanics Final is in 3 days. Focus on Rotational Dynamics.',
            dateTime: now.toISOString(),
            read: false
        }
    ];

    saveState();
}

// ----------------------------------------------------
// NAVIGATION & THEMES
// ----------------------------------------------------
function setupRouting() {
    const navLinks = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.app-view');
    const pageTitle = document.getElementById('page-title');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Toggle active classes on nav
            navLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');

            // Show active section view
            views.forEach(view => {
                if (view.id === `view-${targetId}`) {
                    view.classList.add('active-view');
                } else {
                    view.classList.remove('active-view');
                }
            });

            // Update page title
            const label = link.querySelector('span').innerText;
            pageTitle.innerText = label;

            // Trigger specific rendering depending on view
            if (targetId === 'calendar') {
                renderCalendar();
            } else if (targetId === 'dashboard') {
                renderDashboardStats();
                renderUpcomingExamsList();
                renderStudyIntensityChart();
            } else if (targetId === 'tracker') {
                renderTrackerSubjectSelect();
                renderStudyLogs();
            } else if (targetId === 'planner') {
                renderPlannerSubjects();
            } else if (targetId === 'settings') {
                renderSettingsExamsList();
            }
        });
    });

    // Format current date in Header
    const dateOptions = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
    document.getElementById('header-date').innerText = new Date().toLocaleDateString('en-US', dateOptions);
}

function setupTheme() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const sunIcon = themeBtn.querySelector('.sun-icon');
    const moonIcon = themeBtn.querySelector('.moon-icon');

    if (state.settings.theme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        document.body.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
}

function toggleTheme() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const sunIcon = themeBtn.querySelector('.sun-icon');
    const moonIcon = themeBtn.querySelector('.moon-icon');

    if (document.body.classList.contains('dark-theme')) {
        document.body.classList.replace('dark-theme', 'light-theme');
        state.settings.theme = 'light';
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        document.body.classList.replace('light-theme', 'dark-theme');
        state.settings.theme = 'dark';
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
    saveState();
    renderAll();
}

// ----------------------------------------------------
// EVENT LISTENERS
// ----------------------------------------------------
function setupEventListeners() {
    // Theme Toggle click
    document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);

    // Notification Dropdown Trigger
    const bellBtn = document.getElementById('notif-bell-btn');
    const dropdown = document.getElementById('notif-dropdown');
    
    bellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
        
        // Mark all notifications as read when opening dropdown
        if (dropdown.classList.contains('show')) {
            state.notifications.forEach(n => n.read = true);
            saveState();
            renderNotificationBadge();
        }
    });

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== bellBtn) {
            dropdown.classList.remove('show');
        }
    });

    document.getElementById('clear-notif-btn').addEventListener('click', () => {
        state.notifications = [];
        saveState();
        renderNotifications();
        renderNotificationBadge();
    });

    // Subject planner listeners
    document.getElementById('btn-add-subject').addEventListener('click', () => {
        document.getElementById('add-subject-modal').style.display = 'flex';
    });

    document.getElementById('modal-add-subject-close').addEventListener('click', () => {
        document.getElementById('add-subject-modal').style.display = 'none';
    });

    document.getElementById('btn-cancel-add-subject').addEventListener('click', () => {
        document.getElementById('add-subject-modal').style.display = 'none';
    });

    document.getElementById('add-subject-form').addEventListener('submit', handleAddSubject);

    // Options dropdown for active subject
    const optionsBtn = document.getElementById('active-subj-options-btn');
    const menuPopup = document.getElementById('active-subj-menu');
    optionsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menuPopup.classList.toggle('show');
    });

    document.addEventListener('click', () => {
        menuPopup.classList.remove('show');
    });

    document.getElementById('btn-delete-active-subj').addEventListener('click', handleDeleteActiveSubject);

    // Topic list form submit
    document.getElementById('add-topic-form').addEventListener('submit', handleAddTopic);

    // Topic filters click
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderPlannerTopics(tab.getAttribute('data-filter'));
        });
    });

    // Focus Timer Mode triggers
    document.getElementById('timer-focus-btn').addEventListener('click', () => setTimerMode(1500, 'focus'));
    document.getElementById('timer-deep-btn').addEventListener('click', () => setTimerMode(2700, 'deep'));
    document.getElementById('timer-break-btn').addEventListener('click', () => setTimerMode(300, 'break'));
    
    document.getElementById('timer-toggle-btn').addEventListener('click', toggleTimer);
    document.getElementById('timer-reset-btn').addEventListener('click', resetTimer);

    // Calendar navigation
    document.getElementById('cal-prev-btn').addEventListener('click', () => adjustCalendarMonth(-1));
    document.getElementById('cal-next-btn').addEventListener('click', () => adjustCalendarMonth(1));
    document.getElementById('cal-today-btn').addEventListener('click', () => {
        calCurrentDate = new Date();
        calSelectedDate = new Date();
        renderCalendar();
        renderSelectedDayAgenda();
    });

    // Settings page listeners
    document.getElementById('add-exam-form').addEventListener('submit', handleAddExam);
    
    // Toggle system notifications
    const toggleBrowser = document.getElementById('toggle-browser-notifs');
    toggleBrowser.checked = state.settings.browserNotifications;
    toggleBrowser.addEventListener('change', (e) => {
        state.settings.browserNotifications = e.target.checked;
        saveState();
        
        if (state.settings.browserNotifications && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    });

    document.getElementById('btn-load-mock').addEventListener('click', () => {
        if(confirm("This will overwrite your existing data with sample test subjects and exams. Proceed?")) {
            loadMockData();
            initApp();
            addNotification('Mock Data Loaded', 'The workspace has been filled with mock test schedules.');
        }
    });

    document.getElementById('btn-reset-app').addEventListener('click', () => {
        if(confirm("Are you sure you want to permanently reset all exams, planner details, and history?")) {
            resetStateToDefault();
            initApp();
            location.reload();
        }
    });
}

// ----------------------------------------------------
// CORE RENDERING DISPATCHER
// ----------------------------------------------------
function renderAll() {
    renderNotificationBadge();
    renderNotifications();
    
    // Active Tab Render
    const activeTab = document.querySelector('.nav-item.active').getAttribute('href').substring(1);
    if (activeTab === 'dashboard') {
        renderDashboardStats();
        renderUpcomingExamsList();
        renderStudyIntensityChart();
    } else if (activeTab === 'planner') {
        renderPlannerSubjects();
    } else if (activeTab === 'tracker') {
        renderTrackerSubjectSelect();
        renderStudyLogs();
    } else if (activeTab === 'calendar') {
        renderCalendar();
        renderSelectedDayAgenda();
    } else if (activeTab === 'settings') {
        renderSettingsExamsList();
    }
}

// ----------------------------------------------------
// EXAM COUNTDOWN HERO
// ----------------------------------------------------
function updateCountdown() {
    if (state.exams.length === 0) {
        document.getElementById('countdown-exam-title').innerText = "No Upcoming Exams Scheduled";
        document.getElementById('countdown-exam-date').innerText = "Configure exams in the Settings view";
        document.getElementById('cd-days').innerText = "00";
        document.getElementById('cd-hours').innerText = "00";
        document.getElementById('cd-minutes').innerText = "00";
        document.getElementById('cd-seconds').innerText = "00";
        return;
    }

    // Sort exams by date, filter out past ones
    const now = new Date().getTime();
    const upcomingExams = state.exams
        .map(e => ({ ...e, time: new Date(e.dateTime).getTime() }))
        .filter(e => e.time > now)
        .sort((a, b) => a.time - b.time);

    if (upcomingExams.length === 0) {
        document.getElementById('countdown-exam-title').innerText = "No Upcoming Exams";
        document.getElementById('countdown-exam-date').innerText = "All configured exams have concluded";
        document.getElementById('cd-days').innerText = "00";
        document.getElementById('cd-hours').innerText = "00";
        document.getElementById('cd-minutes').innerText = "00";
        document.getElementById('cd-seconds').innerText = "00";
        return;
    }

    const nextExam = upcomingExams[0];
    const diff = nextExam.time - now;

    // Time calculations
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Render countdown numbers
    document.getElementById('countdown-exam-title').innerText = nextExam.title;
    
    const examDate = new Date(nextExam.dateTime);
    const dateStr = examDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = examDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('countdown-exam-date').innerText = `Scheduled for ${dateStr} • ${timeStr}`;

    document.getElementById('cd-days').innerText = String(days).padStart(2, '0');
    document.getElementById('cd-hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('cd-minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('cd-seconds').innerText = String(seconds).padStart(2, '0');
}

// ----------------------------------------------------
// NOTIFICATION HUB
// ----------------------------------------------------
function addNotification(title, desc) {
    const newNotif = {
        id: 'nt-' + Date.now(),
        title,
        desc,
        dateTime: new Date().toISOString(),
        read: false
    };
    state.notifications.unshift(newNotif);
    saveState();
    renderNotificationBadge();
    renderNotifications();
    
    // Trigger desktop notification if configured
    if (state.settings.browserNotifications && Notification.permission === "granted") {
        new Notification(title, { body: desc });
    }
}

function renderNotificationBadge() {
    const unreadCount = state.notifications.filter(n => !n.read).length;
    const badge = document.getElementById('notif-badge');
    if (unreadCount > 0) {
        badge.style.display = 'flex';
        badge.innerText = unreadCount;
    } else {
        badge.style.display = 'none';
    }
}

function renderNotifications() {
    const listContainer = document.getElementById('notif-list-container');
    
    if (state.notifications.length === 0) {
        listContainer.innerHTML = `
            <div class="notif-empty-state">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <p>All caught up!</p>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = state.notifications.map(n => {
        const date = new Date(n.dateTime);
        const timeDiff = formatRelativeTime(date);
        
        let iconTintClass = 'indigo-tint';
        let svgIcon = `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>`;
        
        if (n.title.toLowerCase().includes('exam') || n.title.toLowerCase().includes('alert')) {
            iconTintClass = 'red-tint';
            svgIcon = `<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>`;
        }

        return `
            <div class="notif-item">
                <div class="notif-icon-box ${iconTintClass}">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        ${svgIcon}
                    </svg>
                </div>
                <div class="notif-details">
                    <span class="notif-title">${escapeHTML(n.title)}</span>
                    <span class="notif-desc">${escapeHTML(n.desc)}</span>
                    <span class="notif-time">${timeDiff}</span>
                </div>
            </div>
        `;
    }).join('');
}

function formatRelativeTime(date) {
    const diffMs = new Date() - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return `${diffDays}d ago`;
}

// Deadline alarm logic
function checkExamDeadlines() {
    const now = new Date().getTime();
    state.exams.forEach(exam => {
        const examTime = new Date(exam.dateTime).getTime();
        const diffMs = examTime - now;
        
        if (diffMs > 0) {
            const diffHours = diffMs / (1000 * 60 * 60);
            
            // Check threshold triggers
            if (diffHours <= 24 && !exam.notified24h) {
                addNotification('CRITICAL DEADLINE', `${exam.title} begins in less than 24 hours! Prepare final materials.`);
                exam.notified24h = true;
                saveState();
            } else if (diffHours <= 72 && !exam.notified72h) {
                addNotification('EXAM APPROACHING', `${exam.title} is scheduled in 3 days. Focus active revision.`);
                exam.notified72h = true;
                saveState();
            }
        }
    });
}

// ----------------------------------------------------
// STATS DASHBOARD
// ----------------------------------------------------
function renderDashboardStats() {
    // Total configured exams
    const totalExams = state.exams.length;
    document.getElementById('stat-exams-count').innerText = totalExams;

    // Total Study Hours
    const totalSeconds = state.sessions.reduce((acc, curr) => acc + curr.durationSeconds, 0);
    const totalHours = (totalSeconds / 3600).toFixed(1);
    document.getElementById('stat-hours-count').innerText = totalHours + 'h';

    // Total completed planner topics
    let totalTopics = 0;
    let completedTopics = 0;
    state.subjects.forEach(subj => {
        subj.topics.forEach(topic => {
            totalTopics++;
            if (topic.completed) completedTopics++;
        });
    });
    document.getElementById('stat-topics-count').innerText = `${completedTopics}/${totalTopics}`;

    // Mastery Rating %
    const masteryPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    document.getElementById('stat-progress-percent').innerText = `${masteryPercent}%`;
}

function renderUpcomingExamsList() {
    const listContainer = document.getElementById('dashboard-exam-timeline');
    if (state.exams.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <p>No exams configured. Visit settings to add exams.</p>
            </div>
        `;
        return;
    }

    const now = new Date().getTime();
    // Sort chronological
    const sortedExams = [...state.exams].sort((a,b) => new Date(a.dateTime) - new Date(b.dateTime));

    listContainer.innerHTML = `<div class="timeline-list">` + sortedExams.map(exam => {
        const examDate = new Date(exam.dateTime);
        const isPast = examDate.getTime() < now;
        const diffMs = examDate.getTime() - now;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        
        let pillHtml = '';
        if (isPast) {
            pillHtml = `<span class="timeline-countdown-pill relaxed">Completed</span>`;
        } else if (diffDays <= 2) {
            pillHtml = `<span class="timeline-countdown-pill urgent">${diffDays} day${diffDays !== 1 ? 's' : ''} left</span>`;
        } else if (diffDays <= 7) {
            pillHtml = `<span class="timeline-countdown-pill normal">${diffDays} days left</span>`;
        } else {
            pillHtml = `<span class="timeline-countdown-pill relaxed">${diffDays} days left</span>`;
        }

        const formattedDate = examDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        
        // Find subject color if matching name exists
        const matchedSubject = state.subjects.find(s => exam.title.toLowerCase().includes(s.name.toLowerCase()));
        const colorAccent = matchedSubject ? matchedSubject.color : '#e2e8f0';

        return `
            <div class="timeline-item">
                <div class="timeline-left">
                    <span class="timeline-dot" style="background-color: ${colorAccent}"></span>
                    <div class="timeline-details">
                        <span class="timeline-name">${escapeHTML(exam.title)}</span>
                        <span class="timeline-date">${formattedDate}</span>
                    </div>
                </div>
                ${pillHtml}
            </div>
        `;
    }).join('') + `</div>`;
}

// Custom SVG Study intensity rendering
function renderStudyIntensityChart() {
    const barsGroup = document.getElementById('chart-bars-group');
    if (!barsGroup) return;

    // Calculate dates for last 7 days including today
    const dates = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);
        dates.push(d);
    }

    // Accumulate total hours studied per day
    const hoursPerDay = dates.map(date => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);

        const dailySecs = state.sessions
            .filter(s => {
                const sDate = new Date(s.dateTime);
                return sDate >= date && sDate < nextDay;
            })
            .reduce((sum, curr) => sum + curr.durationSeconds, 0);

        return dailySecs / 3600; // convert to hours
    });

    // Drawing metrics
    const chartHeight = 150; // max Y pixel coordinate for 0h
    const chartMinY = 20;    // min Y pixel coordinate for max height (4h)
    const maxHeightVal = 4.0; // scale limit
    const barWidth = 24;
    const spacing = 45;
    const startX = 65;

    let elementsHTML = '';

    dates.forEach((date, i) => {
        const hrs = hoursPerDay[i];
        
        // Cap visual representation to max scale height
        const displayHrs = Math.min(hrs, maxHeightVal);
        const barHeight = ((displayHrs / maxHeightVal) * (chartHeight - chartMinY));
        const barY = chartHeight - barHeight;
        const barX = startX + (i * spacing);

        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        // Styling theme color accent
        const isToday = i === 6;
        const fillTheme = isToday ? 'var(--accent-color)' : 'rgba(99, 102, 241, 0.4)';

        elementsHTML += `
            <!-- Bar -->
            <rect class="chart-bar" x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}" rx="4" fill="${fillTheme}">
                <title>${hrs.toFixed(1)} hours revised on ${dayName}</title>
            </rect>
            <!-- X Axis Label -->
            <text class="chart-text label-x" x="${barX + (barWidth / 2)}" y="${chartHeight + 16}">${dayName}</text>
        `;
    });

    barsGroup.innerHTML = elementsHTML;
}

// ----------------------------------------------------
// SUBJECT PLANNER CONTROLLERS
// ----------------------------------------------------
function renderPlannerSubjects() {
    const listContainer = document.getElementById('subject-sidebar-list');
    
    if (state.subjects.length === 0) {
        listContainer.innerHTML = `<p class="empty-msg">No subjects. Add one to begin.</p>`;
        return;
    }

    listContainer.innerHTML = state.subjects.map(subj => {
        // Calculate nested completion counts
        const total = subj.topics.length;
        const done = subj.topics.filter(t => t.completed).length;
        
        const activeClass = subj.id === activeSubjectId ? 'active' : '';

        return `
            <div class="subject-nav-item ${activeClass}" onclick="selectSubject('${subj.id}')">
                <div class="subj-nav-label-box">
                    <span class="subject-color-dot" style="background-color: ${subj.color}"></span>
                    <span>${escapeHTML(subj.name)}</span>
                </div>
                <span class="subj-nav-count">${done}/${total}</span>
            </div>
        `;
    }).join('');
}

function selectSubject(id) {
    activeSubjectId = id;
    renderPlannerSubjects();

    const currentSubj = state.subjects.find(s => s.id === id);
    if (!currentSubj) {
        togglePlannerDetail(false);
        return;
    }

    togglePlannerDetail(true);

    // Set headers
    document.getElementById('active-subj-title').innerText = currentSubj.name;
    document.getElementById('active-subj-color-dot').style.backgroundColor = currentSubj.color;
    
    // Reset filters
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(t => t.classList.remove('active'));
    filterTabs[0].classList.add('active'); // Set to 'All'

    renderPlannerTopics('all');
}

function togglePlannerDetail(show) {
    const emptyPanel = document.getElementById('planner-detail-empty');
    const activePanel = document.getElementById('planner-detail-active');
    
    if (show) {
        emptyPanel.style.display = 'none';
        activePanel.style.display = 'flex';
    } else {
        emptyPanel.style.display = 'flex';
        activePanel.style.display = 'none';
    }
}

function renderPlannerTopics(filter = 'all') {
    const currentSubj = state.subjects.find(s => s.id === activeSubjectId);
    if (!currentSubj) return;

    // Render progress stats
    const total = currentSubj.topics.length;
    const done = currentSubj.topics.filter(t => t.completed).length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    
    document.getElementById('active-subj-progress-bar').style.width = `${percent}%`;
    document.getElementById('active-subj-progress-bar').style.backgroundColor = currentSubj.color;
    document.getElementById('active-subj-progress-text').innerText = `${done} of ${total} topics completed (${percent}%)`;

    // Filter topics
    let displayedTopics = currentSubj.topics;
    if (filter === 'todo') {
        displayedTopics = currentSubj.topics.filter(t => !t.completed);
    } else if (filter === 'done') {
        displayedTopics = currentSubj.topics.filter(t => t.completed);
    }

    const listContainer = document.getElementById('active-subj-topics-list');
    
    if (displayedTopics.length === 0) {
        listContainer.innerHTML = `<p class="empty-msg">No topics found in this section.</p>`;
        return;
    }

    listContainer.innerHTML = displayedTopics.map(topic => {
        const completedClass = topic.completed ? 'completed' : '';
        const checkedAttr = topic.completed ? 'checked' : '';

        return `
            <div class="topic-item ${completedClass}" id="topic-card-${topic.id}">
                <div class="topic-left">
                    <label class="custom-checkbox-container">
                        <input type="checkbox" ${checkedAttr} onchange="toggleTopicCompletion('${topic.id}', this.checked)">
                        <span class="checkmark"></span>
                    </label>
                    <span class="topic-name" title="${escapeHTML(topic.name)}">${escapeHTML(topic.name)}</span>
                </div>
                <div class="topic-right">
                    <span class="priority-pill ${topic.priority}">${topic.priority}</span>
                    <button class="icon-btn text-danger" onclick="deleteTopic('${topic.id}')" title="Delete Topic">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Action Handlers
function handleAddSubject(e) {
    e.preventDefault();
    const name = document.getElementById('new-subject-name').value.trim();
    const color = document.querySelector('input[name="subject-color"]:checked').value;

    if (!name) return;

    const newSubj = {
        id: 'sb-' + Date.now(),
        name,
        color,
        topics: []
    };

    state.subjects.push(newSubj);
    saveState();
    
    // Close modal
    document.getElementById('add-subject-modal').style.display = 'none';
    document.getElementById('new-subject-name').value = '';
    
    // Select newly created subject
    selectSubject(newSubj.id);
    addNotification('Subject Created', `Added ${name} to your planner.`);
}

function handleDeleteActiveSubject() {
    if (!activeSubjectId) return;
    const currentSubj = state.subjects.find(s => s.id === activeSubjectId);
    if (!currentSubj) return;

    if(confirm(`Remove ${currentSubj.name} and all of its planner topics permanently?`)) {
        state.subjects = state.subjects.filter(s => s.id !== activeSubjectId);
        
        // Clean sessions linked to this subject (keep log metrics but remove link if needed or keep)
        // Here we just keep history but clean active references
        
        saveState();
        
        if (state.subjects.length > 0) {
            selectSubject(state.subjects[0].id);
        } else {
            activeSubjectId = null;
            togglePlannerDetail(false);
            renderPlannerSubjects();
        }
        addNotification('Subject Deleted', `Removed ${currentSubj.name} planner database.`);
    }
}

function handleAddTopic(e) {
    e.preventDefault();
    const name = document.getElementById('topic-name-input').value.trim();
    const priority = document.getElementById('topic-priority').value;

    if (!name || !activeSubjectId) return;

    const subject = state.subjects.find(s => s.id === activeSubjectId);
    if (!subject) return;

    const newTopic = {
        id: 'tp-' + Date.now(),
        name,
        priority,
        completed: false
    };

    subject.topics.push(newTopic);
    saveState();

    document.getElementById('topic-name-input').value = '';
    
    // Re-render
    renderPlannerSubjects();
    
    // Keep active filter tab state or fallback to 'all'
    const activeFilter = document.querySelector('.filter-tab.active').getAttribute('data-filter');
    renderPlannerTopics(activeFilter);
}

function toggleTopicCompletion(topicId, isCompleted) {
    const subject = state.subjects.find(s => s.id === activeSubjectId);
    if (!subject) return;

    const topic = subject.topics.find(t => t.id === topicId);
    if (!topic) return;

    topic.completed = isCompleted;
    saveState();

    // Adjust UI classes dynamically without complete rebuild
    const topicCard = document.getElementById(`topic-card-${topicId}`);
    if (topicCard) {
        if (isCompleted) {
            topicCard.classList.add('completed');
        } else {
            topicCard.classList.remove('completed');
        }
    }

    // Render count badges and totals
    renderPlannerSubjects();
    
    const activeFilter = document.querySelector('.filter-tab.active').getAttribute('data-filter');
    // If filtering by todo/done, rebuild list. Else, just update stats.
    if (activeFilter !== 'all') {
        renderPlannerTopics(activeFilter);
    } else {
        const total = subject.topics.length;
        const done = subject.topics.filter(t => t.completed).length;
        const percent = total > 0 ? Math.round((done / total) * 100) : 0;
        document.getElementById('active-subj-progress-bar').style.width = `${percent}%`;
        document.getElementById('active-subj-progress-text').innerText = `${done} of ${total} topics completed (${percent}%)`;
    }
}

function deleteTopic(topicId) {
    const subject = state.subjects.find(s => s.id === activeSubjectId);
    if (!subject) return;

    subject.topics = subject.topics.filter(t => t.id !== topicId);
    saveState();

    renderPlannerSubjects();
    const activeFilter = document.querySelector('.filter-tab.active').getAttribute('data-filter');
    renderPlannerTopics(activeFilter);
}

// ----------------------------------------------------
// POMODORO REVISION TRACKER
// ----------------------------------------------------
function renderTrackerSubjectSelect() {
    const select = document.getElementById('timer-subject-select');
    if (!select) return;

    const currentVal = select.value;
    select.innerHTML = '<option value="">No subject linked</option>' + state.subjects.map(s => {
        return `<option value="${s.id}">${escapeHTML(s.name)}</option>`;
    }).join('');

    // Restore previous selection if still exists
    if (state.subjects.some(s => s.id === currentVal)) {
        select.value = currentVal;
    }
}

function setTimerMode(seconds, mode) {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerMode = mode;
    timerLeftSeconds = seconds;
    timerTotalSeconds = seconds;
    
    // Toggle active state classes on mode tabs
    const buttons = {
        'focus': document.getElementById('timer-focus-btn'),
        'deep': document.getElementById('timer-deep-btn'),
        'break': document.getElementById('timer-break-btn')
    };

    Object.keys(buttons).forEach(k => {
        if(k === mode) {
            buttons[k].classList.add('active');
        } else {
            buttons[k].classList.remove('active');
        }
    });

    // Update displays
    updateTimerDigitalDisplay();
    updateTimerSVGStroke();
    
    // Update Start Button Text
    document.getElementById('timer-toggle-btn').innerText = "Start Session";
    document.getElementById('timer-state-label').innerText = mode === 'break' ? 'BREAK TIME' : 'FOCUS SESSION';
    document.getElementById('session-active-indicator').innerText = 'Idle';
}

function toggleTimer() {
    const toggleBtn = document.getElementById('timer-toggle-btn');
    
    if (isTimerRunning) {
        // Pause timer
        clearInterval(timerInterval);
        isTimerRunning = false;
        toggleBtn.innerText = "Resume Session";
        document.getElementById('session-active-indicator').innerText = 'Paused';
    } else {
        // Start timer
        isTimerRunning = true;
        toggleBtn.innerText = "Pause Session";
        document.getElementById('session-active-indicator').innerText = timerMode === 'break' ? 'Break' : 'Focusing';

        timerInterval = setInterval(() => {
            timerLeftSeconds--;
            
            if (timerLeftSeconds <= 0) {
                clearInterval(timerInterval);
                handleTimerCompletion();
            } else {
                updateTimerDigitalDisplay();
                updateTimerSVGStroke();
            }
        }, 1000);
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerLeftSeconds = timerTotalSeconds;
    
    updateTimerDigitalDisplay();
    updateTimerSVGStroke();
    
    document.getElementById('timer-toggle-btn').innerText = "Start Session";
    document.getElementById('session-active-indicator').innerText = 'Idle';
}

function updateTimerDigitalDisplay() {
    const mins = Math.floor(timerLeftSeconds / 60);
    const secs = timerLeftSeconds % 60;
    document.getElementById('timer-display').innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateTimerSVGStroke() {
    const ring = document.getElementById('timer-progress-ring');
    const radius = ring.r.baseVal.value;
    const circumference = 2 * Math.PI * radius; // 565.48 approx

    const progress = (timerTotalSeconds - timerLeftSeconds) / timerTotalSeconds;
    const strokeDashoffset = circumference * (1 - progress);
    
    ring.style.strokeDashoffset = strokeDashoffset;
}

function handleTimerCompletion() {
    isTimerRunning = false;
    document.getElementById('timer-toggle-btn').innerText = "Start Session";
    document.getElementById('session-active-indicator').innerText = 'Idle';
    
    const linkedSubjectId = document.getElementById('timer-subject-select').value;
    
    if (timerMode === 'break') {
        addNotification('Break Completed', 'Time to return to studying. Stay persistent!');
        setTimerMode(1500, 'focus'); // reset default focus
    } else {
        // Log focus session in stats
        const sessionLengthSec = timerTotalSeconds;
        
        let subjectName = 'Unlinked Subject';
        if (linkedSubjectId) {
            const subj = state.subjects.find(s => s.id === linkedSubjectId);
            if (subj) subjectName = subj.name;
        }

        const newLog = {
            id: 'ss-' + Date.now(),
            subjectId: linkedSubjectId || null,
            durationSeconds: sessionLengthSec,
            dateTime: new Date().toISOString()
        };

        state.sessions.push(newLog);
        saveState();

        const minutesFocused = Math.round(sessionLengthSec / 60);
        addNotification('Study Session Completed!', `Awesome work! You completed a ${minutesFocused}-minute session on ${subjectName}.`);
        
        // Re-render logs if tracker page active
        renderStudyLogs();
        
        // Trigger break mode automatic transition
        setTimerMode(300, 'break');
    }
}

function renderStudyLogs() {
    const listContainer = document.getElementById('study-sessions-list');
    
    if (state.sessions.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <p>No study logs recorded yet.</p>
            </div>
        `;
        return;
    }

    // Sort most recent first
    const sortedLogs = [...state.sessions].sort((a,b) => new Date(b.dateTime) - new Date(a.dateTime));

    listContainer.innerHTML = `<div class="study-logs-list">` + sortedLogs.map(log => {
        const logDate = new Date(log.dateTime);
        const timeStr = logDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        
        // Subject lookup
        const subject = state.subjects.find(s => s.id === log.subjectId);
        const subjName = subject ? subject.name : 'General Focus';
        const colorAccent = subject ? subject.color : 'var(--text-muted)';
        
        const minutes = Math.round(log.durationSeconds / 60);

        return `
            <div class="log-item">
                <div class="log-left">
                    <span class="log-dot" style="background-color: ${colorAccent}"></span>
                    <div class="log-details">
                        <span class="log-subject">${escapeHTML(subjName)}</span>
                        <span class="log-time">${timeStr}</span>
                    </div>
                </div>
                <div class="log-duration">${minutes}m</div>
            </div>
        `;
    }).join('') + `</div>`;
}

// ----------------------------------------------------
// INTERACTIVE CALENDAR SYSTEM
// ----------------------------------------------------
function adjustCalendarMonth(direction) {
    calCurrentDate.setMonth(calCurrentDate.getMonth() + direction);
    renderCalendar();
}

function renderCalendar() {
    const year = calCurrentDate.getFullYear();
    const month = calCurrentDate.getMonth();

    // Set month title
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById('cal-month-title').innerText = `${monthNames[month]} ${year}`;

    const daysContainer = document.getElementById('calendar-days-container');
    daysContainer.innerHTML = '';

    // First day of current month
    const firstDayIndex = new Date(year, month, 1).getDay();
    // Last day of current month
    const lastDay = new Date(year, month + 1, 0).getDate();
    // Last day of previous month
    const prevLastDay = new Date(year, month, 0).getDate();

    const today = new Date();

    // 1. Previous month buffer days
    for (let i = firstDayIndex; i > 0; i--) {
        const dayNum = prevLastDay - i + 1;
        const cellDate = new Date(year, month - 1, dayNum);
        daysContainer.appendChild(createCalCell(cellDate, true));
    }

    // 2. Active month days
    for (let i = 1; i <= lastDay; i++) {
        const cellDate = new Date(year, month, i);
        const isToday = cellDate.toDateString() === today.toDateString();
        daysContainer.appendChild(createCalCell(cellDate, false, isToday));
    }

    // 3. Next month buffer days (fill standard 42-day calendar grid)
    const totalRendered = firstDayIndex + lastDay;
    const remainingDays = 42 - totalRendered;
    for (let i = 1; i <= remainingDays; i++) {
        const cellDate = new Date(year, month + 1, i);
        daysContainer.appendChild(createCalCell(cellDate, true));
    }
}

function createCalCell(date, isMuted, isToday = false) {
    const cell = document.createElement('div');
    cell.classList.add('calendar-cell');
    if (isMuted) cell.classList.add('muted');
    if (isToday) cell.classList.add('today');

    const isSelected = date.toDateString() === calSelectedDate.toDateString();
    if (isSelected) cell.classList.add('selected');

    cell.innerHTML = `<span class="cell-number">${date.getDate()}</span>`;

    // Render Event Indicator Dots
    const dotWrapper = document.createElement('div');
    dotWrapper.classList.add('cell-events');

    // Check for Exams on this day
    const dayExams = state.exams.filter(e => {
        const eDate = new Date(e.dateTime);
        return eDate.toDateString() === date.toDateString();
    });

    // Check for Study Logs on this day
    const dayStudy = state.sessions.filter(s => {
        const sDate = new Date(s.dateTime);
        return sDate.toDateString() === date.toDateString();
    });

    dayExams.forEach(() => {
        const dot = document.createElement('span');
        dot.classList.add('event-dot', 'exam');
        dotWrapper.appendChild(dot);
    });

    if (dayStudy.length > 0) {
        const dot = document.createElement('span');
        dot.classList.add('event-dot', 'study');
        dotWrapper.appendChild(dot);
    }

    cell.appendChild(dotWrapper);

    // Click handler to select date
    cell.addEventListener('click', () => {
        // Deselect previous selection
        const prevSelected = document.querySelector('.calendar-cell.selected');
        if (prevSelected) prevSelected.classList.remove('selected');
        
        cell.classList.add('selected');
        calSelectedDate = new Date(date);
        
        renderSelectedDayAgenda();
    });

    return cell;
}

function renderSelectedDayAgenda() {
    const listContainer = document.getElementById('cal-day-events-list');
    
    // Set headers
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const dateTitle = calSelectedDate.toDateString() === new Date().toDateString() ? "Today's Agenda" : "Day Agenda";
    document.getElementById('cal-selected-day-title').innerText = dateTitle;
    document.getElementById('cal-selected-day-subtitle').innerText = calSelectedDate.toLocaleDateString('en-US', options);

    // Find Events
    const dayExams = state.exams.filter(e => {
        const eDate = new Date(e.dateTime);
        return eDate.toDateString() === calSelectedDate.toDateString();
    });

    const dayStudy = state.sessions.filter(s => {
        const sDate = new Date(s.dateTime);
        return sDate.toDateString() === calSelectedDate.toDateString();
    });

    if (dayExams.length === 0 && dayStudy.length === 0) {
        listContainer.innerHTML = `<p class="empty-msg">No scheduled exams or study sessions recorded for this date.</p>`;
        return;
    }

    let agendaHTML = '';

    dayExams.forEach(exam => {
        const time = new Date(exam.dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        agendaHTML += `
            <div class="day-event-item">
                <div class="day-event-marker exam"></div>
                <div class="day-event-details">
                    <span class="day-event-name">${escapeHTML(exam.title)}</span>
                    <span class="day-event-time">Exam Scheduled • ${time}</span>
                </div>
            </div>
        `;
    });

    dayStudy.forEach(session => {
        const time = new Date(session.dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const subject = state.subjects.find(s => s.id === session.subjectId);
        const subjName = subject ? subject.name : 'General Focus';
        const mins = Math.round(session.durationSeconds / 60);

        agendaHTML += `
            <div class="day-event-item">
                <div class="day-event-marker study"></div>
                <div class="day-event-details">
                    <span class="day-event-name">Studied ${escapeHTML(subjName)}</span>
                    <span class="day-event-time">Revision Logged • ${mins} minutes at ${time}</span>
                </div>
            </div>
        `;
    });

    listContainer.innerHTML = agendaHTML;
}

// ----------------------------------------------------
// SETTINGS VIEWS & FORM ACTIONS
// ----------------------------------------------------
function renderSettingsExamsList() {
    const listContainer = document.getElementById('settings-exams-list');
    
    if (state.exams.length === 0) {
        listContainer.innerHTML = `<p class="empty-msg">No configured exams. Add one below.</p>`;
        return;
    }

    // Sort chrono
    const sortedExams = [...state.exams].sort((a,b) => new Date(a.dateTime) - new Date(b.dateTime));

    listContainer.innerHTML = sortedExams.map(exam => {
        const d = new Date(exam.dateTime);
        const fmt = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        
        return `
            <div class="setting-exam-item">
                <div class="setting-exam-info">
                    <div class="setting-exam-name">${escapeHTML(exam.title)}</div>
                    <div class="setting-exam-date">${fmt}</div>
                </div>
                <button class="icon-btn text-danger" onclick="deleteExam('${exam.id}')" title="Delete Schedule">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `;
    }).join('');
}

function handleAddExam(e) {
    e.preventDefault();
    const title = document.getElementById('exam-name-input').value.trim();
    const date = document.getElementById('exam-date-input').value;
    const time = document.getElementById('exam-time-input').value;

    if (!title || !date || !time) return;

    const examDateTime = new Date(`${date}T${time}`);

    const newExam = {
        id: 'ex-' + Date.now(),
        title,
        dateTime: examDateTime.toISOString()
    };

    state.exams.push(newExam);
    saveState();

    // Reset Form
    document.getElementById('exam-name-input').value = '';
    document.getElementById('exam-date-input').value = '';
    document.getElementById('exam-time-input').value = '';

    renderSettingsExamsList();
    updateCountdown();
    addNotification('Exam Scheduled', `Configured schedule for ${title}.`);
}

function deleteExam(id) {
    const exam = state.exams.find(e => e.id === id);
    const title = exam ? exam.title : 'Exam';

    state.exams = state.exams.filter(e => e.id !== id);
    saveState();

    renderSettingsExamsList();
    updateCountdown();
    addNotification('Exam Cancelled', `Removed ${title} schedule.`);
}

// Helper to escape HTML tags to avoid XSS vectors in input
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
