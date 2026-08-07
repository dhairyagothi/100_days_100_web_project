// State Management Key
const CAMPUS_STATE_KEY = 'campusos_dashboard_state';

// Pre-populated Default State
const defaultState = {
    activeView: 'dashboard',
    timetableActiveDay: 'Monday',
    attendance: [
        { code: 'CS-301', name: 'Software Engineering', present: 22, total: 25 },
        { code: 'CS-302', name: 'Computer Networks', present: 18, total: 24 },
        { code: 'CS-303', name: 'Database Management Systems', present: 20, total: 23 },
        { code: 'CS-304', name: 'Theory of Computation', present: 14, total: 20 },
        { code: 'CS-305', name: 'Web Development Lab', present: 12, total: 12 }
    ],
    timetable: {
        Monday: [
            { time: '09:00 AM', duration: '50m', subject: 'Computer Networks', room: 'LH-101', instructor: 'Dr. Sarah Jenkins' },
            { time: '10:00 AM', duration: '50m', subject: 'Software Engineering', room: 'LH-203', instructor: 'Prof. Alan Vance' },
            { time: '11:15 AM', duration: '1h 15m', subject: 'Database Management Systems', room: 'Lab-A', instructor: 'Dr. Michael Cho' }
        ],
        Tuesday: [
            { time: '09:00 AM', duration: '50m', subject: 'Theory of Computation', room: 'LH-101', instructor: 'Prof. Elena Rostova' },
            { time: '10:00 AM', duration: '50m', subject: 'Computer Networks', room: 'LH-101', instructor: 'Dr. Sarah Jenkins' },
            { time: '02:00 PM', duration: '2h 00m', subject: 'Web Development Lab', room: 'Lab-B', instructor: 'Prof. Alan Vance' }
        ],
        Wednesday: [
            { time: '11:15 AM', duration: '1h 15m', subject: 'Database Management Systems', room: 'LH-203', instructor: 'Dr. Michael Cho' },
            { time: '01:00 PM', duration: '50m', subject: 'Theory of Computation', room: 'LH-101', instructor: 'Prof. Elena Rostova' }
        ],
        Thursday: [
            { time: '09:00 AM', duration: '50m', subject: 'Software Engineering', room: 'LH-203', instructor: 'Prof. Alan Vance' },
            { time: '10:00 AM', duration: '50m', subject: 'Computer Networks', room: 'LH-101', instructor: 'Dr. Sarah Jenkins' },
            { time: '11:15 AM', duration: '1h 15m', subject: 'Database Management Systems', room: 'LH-203', instructor: 'Dr. Michael Cho' }
        ],
        Friday: [
            { time: '09:00 AM', duration: '50m', subject: 'Theory of Computation', room: 'LH-101', instructor: 'Prof. Elena Rostova' },
            { time: '10:00 AM', duration: '50m', subject: 'Software Engineering', room: 'LH-203', instructor: 'Prof. Alan Vance' }
        ]
    },
    assignments: [
        { id: '1', title: 'Socket Programming Lab Exercise', subject: 'Computer Networks', deadline: '2026-07-28', completed: false },
        { id: '2', title: 'Entity Relationship Diagram Draft', subject: 'Database Management Systems', deadline: '2026-07-26', completed: false },
        { id: '3', title: 'Turing Machine Solver Homework', subject: 'Theory of Computation', deadline: '2026-08-02', completed: false },
        { id: '4', title: 'SRS Document Submission', subject: 'Software Engineering', deadline: '2026-07-20', completed: true }
    ],
    clubs: [
        { id: 'c1', name: 'ACM Student Chapter', desc: 'Coding contests, hackathons, and algorithm study groups.', members: 145, joined: true },
        { id: 'c2', name: 'Robotics & Automation Club', desc: 'Build hardware, study microcontrollers, and prepare for Robocon.', members: 82, joined: false },
        { id: 'c3', name: 'Music and Symphony Guild', desc: 'Acoustic jam sessions, college bands, and annual concerts.', members: 64, joined: false },
        { id: 'c4', name: 'Literary & Debating Society', desc: 'Public speaking drills, MUN simulations, and publishing student columns.', members: 40, joined: true }
    ],
    events: [
        { id: 'e1', title: 'Internal Hackathon 2026', day: '29', month: 'Jul', time: '09:00 AM', venue: 'Main Auditorium', rsvp: 'going' },
        { id: 'e2', title: 'Seminar: AI and Cloud Ethics', day: '04', month: 'Aug', time: '02:30 PM', venue: 'Seminar Hall 2', rsvp: 'none' },
        { id: 'e3', title: 'Freshers Welcome Jam', day: '08', month: 'Aug', time: '06:00 PM', venue: 'Amphitheatre', rsvp: 'none' }
    ],
    notes: [
        { id: 'n1', title: 'CN Study Guide: OSI Model Layering', content: 'OSI Model Layers Checklist:\n\n1. Physical: Bits, cables, transceivers.\n2. Data Link: Frames, MAC addressing, ethernet protocols.\n3. Network: Packets, IP addressing, routers.\n4. Transport: Segments, TCP/UDP, error handling.\n5. Session: Dialog controls, establishing connections.\n6. Presentation: Formatting, encryption, JPEG/MPEG.\n7. Application: High level protocols (HTTP, SMTP, FTP).\n\nKey Focus Areas: Learn the differences between TCP and UDP headers, three-way handshake.', date: '2026-07-24' },
        { id: 'n2', title: 'Database Normalization Notes', content: 'Normalization forms rules:\n- 1NF: Atomic values, no repeating groups.\n- 2NF: In 1NF + no partial dependencies (every non-key attribute must depend fully on the primary key).\n- 3NF: In 2NF + no transitive dependencies (non-key columns do not determine other non-key columns).', date: '2026-07-22' }
    ],
    notesActiveId: 'n1',
    placements: [
        { id: 'p1', company: 'Stripe', role: 'Software Engineer Intern', ctc: '$42/hr', eligibility: 'CGPA > 8.0, CS/IT', deadline: '2026-07-30', status: 'apply' },
        { id: 'p2', company: 'Google', role: 'Associate APM (New Grad)', ctc: '$135,000/yr', eligibility: 'Open to All Branches', deadline: '2026-08-05', status: 'applied' },
        { id: 'p3', company: 'Figma', role: 'Frontend Engineer', ctc: '$120,000/yr', eligibility: 'CGPA > 7.5, Web Dev Knowledge', deadline: '2026-07-29', status: 'apply' },
        { id: 'p4', company: 'Atlassian', role: 'Site Reliability Engineer', ctc: '$110,000/yr', eligibility: 'CGPA > 8.0, Linux internals', deadline: '2026-08-10', status: 'apply' }
    ]
};

let state = { ...defaultState };

// Sync Utilities
function loadState() {
    const saved = localStorage.getItem(CAMPUS_STATE_KEY);
    if (saved) {
        try {
            state = JSON.parse(saved);
        } catch (e) {
            console.error('Failed to parse CampusOS state, loaded default config', e);
            state = { ...defaultState };
        }
    } else {
        state = { ...defaultState };
        saveState();
    }
}

function saveState() {
    localStorage.setItem(CAMPUS_STATE_KEY, JSON.stringify(state));
}

// Global Views Switching Router
function switchView(viewName) {
    state.activeView = viewName;
    saveState();

    // Toggle active sidebar link
    document.querySelectorAll('.nav-item').forEach(item => {
        if (item.dataset.view === viewName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Toggle active viewport container
    document.querySelectorAll('.module-view').forEach(view => {
        if (view.id === `view-${viewName}`) {
            view.classList.add('active');
        } else {
            view.classList.remove('active');
        }
    });

    // Set header title
    const headerTitle = document.getElementById('view-title');
    const titles = {
        dashboard: 'Dashboard Overview',
        attendance: 'Attendance Analytics',
        timetable: 'Timetable Schedule',
        assignments: 'Assignments Checklist',
        'clubs-events': 'Clubs & Campus Events',
        notes: 'Personal Notes Board',
        placement: 'Placement Portal'
    };
    headerTitle.textContent = titles[viewName] || 'CampusOS';

    // Special render pipelines depending on view
    renderActiveViewContents(viewName);
}

// Delegate view updates
function renderActiveViewContents(viewName) {
    switch (viewName) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'attendance':
            renderAttendance();
            break;
        case 'timetable':
            renderTimetable();
            break;
        case 'assignments':
            renderAssignments();
            break;
        case 'clubs-events':
            renderClubsAndEvents();
            break;
        case 'notes':
            renderNotes();
            break;
        case 'placement':
            renderPlacements();
            break;
    }
}

// ----------------------------------------------------
// 1. DASHBOARD VIEW RENDER PIPELINE
// ----------------------------------------------------
function renderDashboard() {
    // KPI 1: Attendance percentage
    const totalPresent = state.attendance.reduce((sum, item) => sum + item.present, 0);
    const totalHours = state.attendance.reduce((sum, item) => sum + item.total, 0);
    const overallPercent = totalHours > 0 ? Math.round((totalPresent / totalHours) * 100) : 0;
    document.getElementById('db-attendance').textContent = `${overallPercent}%`;

    // KPI 2: Next Upcoming Class today
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = daysOfWeek[new Date().getDay()];
    // Default to Monday classes if today is weekend for visual layout demo
    const activeDayClasses = state.timetable[todayName] || state.timetable['Monday'];
    
    if (activeDayClasses && activeDayClasses.length > 0) {
        const nextClass = activeDayClasses[0]; // Simplification for demo: show first class of day
        document.getElementById('db-next-class').textContent = nextClass.subject;
        document.getElementById('db-next-class-time').textContent = `${nextClass.time} (Room ${nextClass.room})`;
    } else {
        document.getElementById('db-next-class').textContent = 'No Lectures Today';
        document.getElementById('db-next-class-time').textContent = '-';
    }

    // KPI 3: Pending Tasks
    const pendingTasks = state.assignments.filter(a => !a.completed).length;
    document.getElementById('db-assignments').textContent = pendingTasks;

    // KPI 4: Jobs Applied
    const appliedJobs = state.placements.filter(p => p.status === 'applied').length;
    document.getElementById('db-placements').textContent = appliedJobs;

    // Render Timeline listing (first 3 classes for today/Monday)
    const timelineEl = document.getElementById('db-timeline');
    const demoClasses = activeDayClasses.slice(0, 3);
    
    if (demoClasses.length > 0) {
        timelineEl.innerHTML = demoClasses.map((c, i) => `
            <div class="timeline-slot ${i === 0 ? '' : 'completed'}">
                <span class="slot-time">${c.time}</span>
                <div class="slot-details">
                    <h4>${escapeHTML(c.subject)}</h4>
                    <p>Instructor: ${escapeHTML(c.instructor)} | Room ${escapeHTML(c.room)}</p>
                </div>
            </div>
        `).join('');
    } else {
        timelineEl.innerHTML = `
            <div class="no-classes-empty">
                <i data-lucide="calendar-check"></i>
                <p>No classes scheduled</p>
            </div>
        `;
    }

    // Render alerts panel: Assignments due soon
    const alertsEl = document.getElementById('db-alerts');
    const pendingAssignments = state.assignments.filter(a => !a.completed).slice(0, 3);

    if (pendingAssignments.length > 0) {
        alertsEl.innerHTML = pendingAssignments.map(a => {
            const daysLeft = Math.ceil((new Date(a.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            const isUrgent = daysLeft <= 2;
            
            return `
                <div class="alert-item ${isUrgent ? 'urgent' : ''}">
                    <div class="alert-item-icon">
                        <i data-lucide="${isUrgent ? 'alert-triangle' : 'info'}"></i>
                    </div>
                    <p>${escapeHTML(a.title)} (${daysLeft}d left)</p>
                </div>
            `;
        }).join('');
    } else {
        alertsEl.innerHTML = `
            <div class="alert-item">
                <div class="alert-item-icon" style="color: var(--color-emerald)">
                    <i data-lucide="check-circle"></i>
                </div>
                <p>All tasks cleared. Good job!</p>
            </div>
        `;
    }
    
    lucide.createIcons();
}

// ----------------------------------------------------
// 2. ATTENDANCE VIEW RENDER PIPELINE
// ----------------------------------------------------
function renderAttendance() {
    const listEl = document.getElementById('attendance-list');
    
    // Core math
    const overallPresent = state.attendance.reduce((sum, item) => sum + item.present, 0);
    const overallTotal = state.attendance.reduce((sum, item) => sum + item.total, 0);
    const overallPercent = overallTotal > 0 ? Math.round((overallPresent / overallTotal) * 100) : 0;
    
    document.getElementById('attn-big-percent').textContent = `${overallPercent}%`;

    let lowSubjects = 0;
    let safeClasses = 0;

    const listHTML = state.attendance.map((subject, idx) => {
        const percent = subject.total > 0 ? Math.round((subject.present / subject.total) * 100) : 0;
        const isLow = percent < 75;
        
        if (isLow) {
            lowSubjects++;
        } else {
            safeClasses++;
        }

        const barClass = isLow ? 'warning' : 'success';
        const textClass = isLow ? 'warning' : 'success';

        return `
            <tr>
                <td>
                    <span class="subject-name">${escapeHTML(subject.name)}</span>
                    <span class="subject-code">${subject.code}</span>
                </td>
                <td>
                    <span class="ratio-value">${subject.present} / ${subject.total}</span>
                </td>
                <td>
                    <div class="percentage-gauge-container">
                        <div class="mini-bar">
                            <div class="mini-bar-fill ${barClass}" style="width: ${percent}%;"></div>
                        </div>
                        <span class="percentage-val ${textClass}">${percent}%</span>
                    </div>
                </td>
                <td>
                    <div class="action-group">
                        <button class="btn-action-success" onclick="adjustAttendance(${idx}, 'present')" title="Add Present Class">+ Pres</button>
                        <button class="btn-action-danger" onclick="adjustAttendance(${idx}, 'absent')" title="Add Absent Class">+ Abs</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    listEl.innerHTML = listHTML;
    document.getElementById('attn-safe-classes').textContent = safeClasses;
    document.getElementById('attn-low-subjects').textContent = lowSubjects;
}

window.adjustAttendance = function(index, type) {
    const subject = state.attendance[index];
    if (type === 'present') {
        subject.present++;
        subject.total++;
    } else if (type === 'absent') {
        subject.total++;
    }
    saveState();
    renderAttendance();
};

// ----------------------------------------------------
// 3. TIMETABLE VIEW RENDER PIPELINE
// ----------------------------------------------------
function renderTimetable() {
    const activeDay = state.timetableActiveDay;
    document.getElementById('timetable-day-label').textContent = activeDay;

    // Setup active button
    document.querySelectorAll('.day-tab').forEach(tab => {
        if (tab.dataset.day === activeDay) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    const slotsListEl = document.getElementById('timetable-slots-list');
    const slots = state.timetable[activeDay] || [];

    if (slots.length === 0) {
        slotsListEl.innerHTML = `
            <div class="no-classes-empty">
                <i data-lucide="coffee"></i>
                <p>No lectures scheduled for ${activeDay}. Rest day!</p>
            </div>
        `;
    } else {
        slotsListEl.innerHTML = slots.map(s => `
            <div class="class-slot-row">
                <div class="slot-time-block">
                    <span class="time-start">${s.time}</span>
                    <span class="time-duration">${s.duration} duration</span>
                </div>
                <div class="slot-details-block">
                    <div class="slot-class-info">
                        <h4>${escapeHTML(s.subject)}</h4>
                        <p class="slot-instructor">${escapeHTML(s.instructor)}</p>
                    </div>
                    <div class="slot-room">
                        <i data-lucide="map-pin"></i>
                        <span>${s.room}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    lucide.createIcons();
}

// ----------------------------------------------------
// 4. ASSIGNMENTS VIEW RENDER PIPELINE
// ----------------------------------------------------
function renderAssignments() {
    // Populate form subjects dropdown if not already populated
    const selectEl = document.getElementById('assign-subject');
    if (selectEl.children.length === 0) {
        selectEl.innerHTML = state.attendance.map(sub => 
            `<option value="${sub.name}">${sub.name}</option>`
        ).join('');
    }

    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.taskFilter || 'all';
    const listEl = document.getElementById('assignments-list');
    
    const filtered = state.assignments.filter(a => {
        if (activeFilter === 'pending') return !a.completed;
        if (activeFilter === 'completed') return a.completed;
        return true;
    });

    // Sort: Pending/soonest deadline first
    const sorted = [...filtered].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return new Date(a.deadline) - new Date(b.deadline);
    });

    if (sorted.length === 0) {
        listEl.innerHTML = `
            <div class="no-classes-empty">
                <i data-lucide="check-circle-2"></i>
                <p>No assignments found under this filter</p>
            </div>
        `;
    } else {
        listEl.innerHTML = sorted.map(a => {
            const today = new Date().toISOString().split('T')[0];
            const isLate = !a.completed && a.deadline < today;
            const checkIcon = a.completed ? 'check-circle' : 'circle';
            const textDeadline = isLate ? 'Overdue!' : formatDate(a.deadline);
            const deadlineClass = isLate ? 'danger' : '';

            return `
                <li class="task-item ${a.completed ? 'completed' : ''}">
                    <div class="task-main">
                        <button class="btn-checkbox" onclick="toggleAssignment('${a.id}')">
                            <i data-lucide="${checkIcon}"></i>
                        </button>
                        <div class="task-details">
                            <span class="task-title">${escapeHTML(a.title)}</span>
                            <div class="task-meta">
                                <span>${a.subject}</span>
                                <span class="dot" style="width:3px;height:3px;background-color:var(--text-muted)"></span>
                                <span class="task-deadline ${deadlineClass}">due: ${textDeadline}</span>
                            </div>
                        </div>
                    </div>
                    <button class="task-delete" onclick="deleteAssignment('${a.id}')">
                        <i data-lucide="trash"></i>
                    </button>
                </li>
            `;
        }).join('');
    }

    lucide.createIcons();
}

window.toggleAssignment = function(id) {
    const task = state.assignments.find(a => a.id === id);
    if (task) {
        task.completed = !task.completed;
        saveState();
        renderAssignments();
    }
};

window.deleteAssignment = function(id) {
    state.assignments = state.assignments.filter(a => a.id !== id);
    saveState();
    renderAssignments();
};

document.getElementById('assignment-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const titleEl = document.getElementById('assign-title');
    const subjectEl = document.getElementById('assign-subject');
    const deadlineEl = document.getElementById('assign-deadline');

    const newAssignment = {
        id: Date.now().toString(),
        title: titleEl.value.trim(),
        subject: subjectEl.value,
        deadline: deadlineEl.value,
        completed: false
    };

    state.assignments.push(newAssignment);
    saveState();

    titleEl.value = '';
    deadlineEl.value = '';

    renderAssignments();
});

// ----------------------------------------------------
// 5. CLUBS & EVENTS VIEW RENDER PIPELINE
// ----------------------------------------------------
function renderClubsAndEvents() {
    // 1. Render Clubs
    const clubsEl = document.getElementById('clubs-list');
    clubsEl.innerHTML = state.clubs.map((c, index) => {
        const btnText = c.joined ? 'Leave Club' : 'Join Club';
        const btnClass = c.joined ? 'btn-secondary' : 'btn-primary';

        return `
            <div class="club-card">
                <div class="club-info">
                    <h4>${escapeHTML(c.name)}</h4>
                    <p>${escapeHTML(c.desc)}</p>
                    <span class="club-members">
                        <i data-lucide="users-2"></i>
                        <span>${c.members} members</span>
                    </span>
                </div>
                <button class="btn btn-sm ${btnClass}" onclick="toggleClubMembership(${index})">
                    ${btnText}
                </button>
            </div>
        `;
    }).join('');

    // 2. Render Events
    const eventsEl = document.getElementById('events-list');
    eventsEl.innerHTML = state.events.map((e, index) => {
        const isGoing = e.rsvp === 'going';
        const btnText = isGoing ? 'Going' : 'RSVP';
        const btnClass = isGoing ? 'btn-applied' : 'btn-secondary';
        const goingIcon = isGoing ? '<i data-lucide="check" style="width:0.875rem;height:0.875rem"></i>' : '';

        return `
            <div class="event-card">
                <div class="event-date-badge">
                    <span class="day-num">${e.day}</span>
                    <span class="month-name">${e.month}</span>
                </div>
                <div class="event-details-box">
                    <h4>${escapeHTML(e.title)}</h4>
                    <div class="event-meta-info">
                        <span><i data-lucide="clock"></i>${e.time}</span>
                        <span><i data-lucide="map-pin"></i>${escapeHTML(e.venue)}</span>
                    </div>
                </div>
                <button class="btn btn-sm ${btnClass}" onclick="toggleEventRSVP(${index})">
                    ${goingIcon}
                    <span>${btnText}</span>
                </button>
            </div>
        `;
    }).join('');

    lucide.createIcons();
}

window.toggleClubMembership = function(index) {
    const club = state.clubs[index];
    if (club.joined) {
        club.joined = false;
        club.members--;
    } else {
        club.joined = true;
        club.members++;
    }
    saveState();
    renderClubsAndEvents();
};

window.toggleEventRSVP = function(index) {
    const event = state.events[index];
    event.rsvp = event.rsvp === 'going' ? 'none' : 'going';
    saveState();
    renderClubsAndEvents();
};

// ----------------------------------------------------
// 6. NOTES BOARD VIEW RENDER PIPELINE
// ----------------------------------------------------
const noteTitleInput = document.getElementById('note-editor-title');
const noteContentTextarea = document.getElementById('note-editor-content');
const notesListEl = document.getElementById('notes-index-list');
const editorEmptyEl = document.getElementById('notes-editor-empty');
const editorActiveEl = document.getElementById('notes-editor-active');
const saveStatusEl = document.getElementById('note-save-status');

function renderNotes() {
    // Render Left index sidebar
    if (state.notes.length === 0) {
        notesListEl.innerHTML = `<li style="font-size:0.8125rem;color:var(--text-muted);text-align:center;padding:1rem;">No notes yet</li>`;
        editorActiveEl.style.display = 'none';
        editorEmptyEl.style.display = 'flex';
        return;
    }

    notesListEl.innerHTML = state.notes.map(note => {
        const isActive = note.id === state.notesActiveId;
        const activeClass = isActive ? 'active' : '';
        const cleanContent = note.content ? note.content.substring(0, 40) + '...' : 'Empty details';

        return `
            <li class="note-preview-item ${activeClass}" onclick="selectNote('${note.id}')">
                <span class="note-p-title">${escapeHTML(note.title || 'Untitled Note')}</span>
                <span class="note-p-body">${escapeHTML(cleanContent)}</span>
                <span class="note-p-date">${formatDate(note.date)}</span>
            </li>
        `;
    }).join('');

    // Load active note into editor panel
    const activeNote = state.notes.find(n => n.id === state.notesActiveId);
    
    if (activeNote) {
        editorEmptyEl.style.display = 'none';
        editorActiveEl.style.display = 'flex';
        
        // Populate inputs
        noteTitleInput.value = activeNote.title;
        noteContentTextarea.value = activeNote.content;
    } else {
        editorActiveEl.style.display = 'none';
        editorEmptyEl.style.display = 'flex';
    }
}

window.selectNote = function(id) {
    state.notesActiveId = id;
    saveState();
    renderNotes();
};

// Auto-save logic triggers on keystroke
function triggerAutoSave() {
    const activeNote = state.notes.find(n => n.id === state.notesActiveId);
    if (activeNote) {
        activeNote.title = noteTitleInput.value.trim() || 'Untitled Note';
        activeNote.content = noteContentTextarea.value;
        activeNote.date = new Date().toISOString().split('T')[0];
        
        saveState();
        
        // Flash "Saving..." to "Saved" status feedback
        saveStatusEl.textContent = 'Saving...';
        saveStatusEl.style.opacity = '0.5';
        
        setTimeout(() => {
            saveStatusEl.textContent = 'Saved';
            saveStatusEl.style.opacity = '1';
            
            // Re-render only the sidebar titles list to reflect edits without redrawing active inputs
            updateNotesIndexListOnly();
        }, 300);
    }
}

function updateNotesIndexListOnly() {
    notesListEl.innerHTML = state.notes.map(note => {
        const isActive = note.id === state.notesActiveId;
        const activeClass = isActive ? 'active' : '';
        const cleanContent = note.content ? note.content.substring(0, 40) + '...' : 'Empty details';

        return `
            <li class="note-preview-item ${activeClass}" onclick="selectNote('${note.id}')">
                <span class="note-p-title">${escapeHTML(note.title || 'Untitled Note')}</span>
                <span class="note-p-body">${escapeHTML(cleanContent)}</span>
                <span class="note-p-date">${formatDate(note.date)}</span>
            </li>
        `;
    }).join('');
}

noteTitleInput.addEventListener('input', triggerAutoSave);
noteContentTextarea.addEventListener('input', triggerAutoSave);

document.getElementById('btn-add-note').addEventListener('click', () => {
    const newNote = {
        id: Date.now().toString(),
        title: 'New Student Note',
        content: '',
        date: new Date().toISOString().split('T')[0]
    };
    
    state.notes.push(newNote);
    state.notesActiveId = newNote.id;
    saveState();
    renderNotes();
    
    // Focus content area automatically
    noteContentTextarea.focus();
});

document.getElementById('btn-delete-note').addEventListener('click', () => {
    state.notes = state.notes.filter(n => n.id !== state.notesActiveId);
    state.notesActiveId = state.notes.length > 0 ? state.notes[0].id : null;
    saveState();
    renderNotes();
});

// ----------------------------------------------------
// 7. PLACEMENT PORTAL VIEW RENDER PIPELINE
// ----------------------------------------------------
const placementSearch = document.getElementById('placement-search-input');

function renderPlacements() {
    const searchVal = placementSearch.value.toLowerCase().trim();
    
    const filtered = state.placements.filter(p => 
        p.company.toLowerCase().includes(searchVal) || 
        p.role.toLowerCase().includes(searchVal)
    );

    // Render Stats
    document.getElementById('p-stat-total').textContent = state.placements.length;
    const countApplied = state.placements.filter(p => p.status === 'applied').length;
    document.getElementById('p-stat-applied').textContent = countApplied;

    const listEl = document.getElementById('placement-jobs-list');

    if (filtered.length === 0) {
        listEl.innerHTML = `
            <div class="no-classes-empty" style="grid-column: span 3;">
                <i data-lucide="alert-octagon"></i>
                <p>No job matching "${escapeHTML(searchVal)}" found</p>
            </div>
        `;
    } else {
        listEl.innerHTML = filtered.map(job => {
            const isApplied = job.status === 'applied';
            const btnText = isApplied ? 'Applied' : 'Apply Now';
            const btnClass = isApplied ? 'btn-applied' : 'btn-primary';
            const logoLetter = job.company.charAt(0);

            return `
                <div class="job-card content-card">
                    <div class="job-card-header">
                        <div class="company-logo-slot">${logoLetter}</div>
                        <span class="badge ${isApplied ? 'badge-emerald' : 'badge-accent'}">${isApplied ? 'applied' : 'active'}</span>
                    </div>
                    
                    <div class="job-card-meta">
                        <h4 class="job-role">${escapeHTML(job.role)}</h4>
                        <span class="company-name">${escapeHTML(job.company)}</span>
                    </div>

                    <div class="job-details-tags">
                        <div class="tag-row">
                            <span class="tag-label">CTC/Package:</span>
                            <span class="tag-value ctc-val">${job.ctc}</span>
                        </div>
                        <div class="tag-row">
                            <span class="tag-label">Eligibility:</span>
                            <span class="tag-value">${escapeHTML(job.eligibility)}</span>
                        </div>
                    </div>

                    <div class="card-header" style="padding:0; margin:0 0 1rem 0; border:none;">
                        <span class="job-deadline">
                            <i data-lucide="calendar"></i>
                            <span>Apply by ${formatDate(job.deadline)}</span>
                        </span>
                    </div>

                    <button class="btn ${btnClass}" onclick="applyForJob('${job.id}')" ${isApplied ? 'disabled' : ''}>
                        <span>${btnText}</span>
                    </button>
                </div>
            `;
        }).join('');
    }

    lucide.createIcons();
}

window.applyForJob = function(id) {
    const job = state.placements.find(p => p.id === id);
    if (job && job.status === 'apply') {
        job.status = 'applied';
        saveState();
        renderPlacements();
    }
};

placementSearch.addEventListener('input', renderPlacements);

// ----------------------------------------------------
// SYSTEM ROUTINE AT STARTUP
// ----------------------------------------------------

// Day Switcher Tabs Event Handler (Timetable)
document.getElementById('timetable-day-tabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.day-tab');
    if (tab) {
        state.timetableActiveDay = tab.dataset.day;
        saveState();
        renderTimetable();
    }
});

// Dynamic Task Filters Event Handler (Assignments)
document.querySelectorAll('.task-filters .filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.task-filters .filter-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        renderAssignments();
    });
});

// Shortcut KPI cards on Dashboard
document.querySelectorAll('.kpi-card').forEach(card => {
    card.addEventListener('click', (e) => {
        const shortcut = e.currentTarget.dataset.shortcut;
        if (shortcut) {
            switchView(shortcut);
        }
    });
});

// Main Sidebar navigation router events
document.querySelectorAll('.nav-item').forEach(button => {
    button.addEventListener('click', (e) => {
        const view = e.currentTarget.dataset.view;
        switchView(view);
    });
});

// Date formatting utility
function formatDate(dateStr) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', options);
}

// Current date in Top Header
function initHeaderDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', options);
}

// Escape simple HTML input tags
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Initialize CampusOS
function init() {
    loadState();
    initHeaderDate();
    switchView(state.activeView);
}

window.addEventListener('DOMContentLoaded', init);
