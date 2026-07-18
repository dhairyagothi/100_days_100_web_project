// --- CampusConnect Main Logic & State ---

// App State Management
class AppState {
    constructor() {
        this.clubs = this.load("cc_clubs", []);
        this.events = this.load("cc_events", []);
        this.notes = this.load("cc_notes", []);
        this.lostFound = this.load("cc_lostfound", []);
        this.marketplace = this.load("cc_market", []);
        this.timetablePreset = localStorage.getItem("cc_timetable_preset") || "custom";
        this.timetableCustom = this.load("cc_timetable_custom", []);
        this.placements = this.load("cc_placements", []);
        this.theme = localStorage.getItem("cc_theme") || "light";

        // Profile details default to Sanjana Sharma
        this.profileName = localStorage.getItem("cc_profile_name") || "Sanjana Sharma";
        this.profileRole = localStorage.getItem("cc_profile_role") || "Student, CS Dept";
    }

    load(key, fallback) {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    }

    save(key, val) {
        localStorage.setItem(key, JSON.stringify(val));
    }

    saveAll() {
        this.save("cc_clubs", this.clubs);
        this.save("cc_events", this.events);
        this.save("cc_notes", this.notes);
        this.save("cc_lostfound", this.lostFound);
        this.save("cc_market", this.marketplace);
        this.save("cc_timetable_custom", this.timetableCustom);
        this.save("cc_placements", this.placements);
        localStorage.setItem("cc_timetable_preset", this.timetablePreset);
        localStorage.setItem("cc_theme", this.theme);
        localStorage.setItem("cc_profile_name", this.profileName);
        localStorage.setItem("cc_profile_role", this.profileRole);
    }
}

const state = new AppState();

// --- Routing & View Toggling ---
function initRouting() {
    const navItems = document.querySelectorAll(".nav-item");
    const sections = document.querySelectorAll(".view-section");

    function switchView(targetViewId) {
        sections.forEach(sec => sec.classList.remove("active"));
        navItems.forEach(item => item.classList.remove("active"));

        const targetSection = document.getElementById(`view-${targetViewId}`);
        if (targetSection) {
            targetSection.classList.add("active");
            
            const activeItem = Array.from(navItems).find(item => item.dataset.view === targetViewId);
            if (activeItem) activeItem.classList.add("active");

            document.querySelector(".sidebar").classList.remove("mobile-open");
            renderView(targetViewId);
        }
    }

    window.addEventListener("hashchange", () => {
        const view = window.location.hash.substring(1) || "dashboard";
        switchView(view);
    });

    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            window.location.hash = view;
        });
    });

    document.querySelectorAll(".view-all-link").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const view = link.getAttribute("href").substring(1);
            window.location.hash = view;
        });
    });

    const initialView = window.location.hash.substring(1) || "dashboard";
    window.location.hash = initialView;
    switchView(initialView);
}

function renderView(viewId) {
    updateProfileView();
    updateOverviewStats();
    switch (viewId) {
        case "dashboard":
            renderDashboard();
            break;
        case "clubs":
            renderClubs();
            break;
        case "events":
            renderEvents();
            break;
        case "notes":
            renderNotes();
            break;
        case "lost-found":
            renderLostFound();
            break;
        case "marketplace":
            renderMarketplace();
            break;
        case "timetable":
            renderTimetable();
            break;
        case "placements":
            renderPlacements();
            break;
    }
}

// --- Dynamic Profile Elements ---
function updateProfileView() {
    // Sidebar profile display
    document.getElementById("sidebar-name").innerText = state.profileName;
    document.getElementById("sidebar-role").innerText = state.profileRole;
    
    // Initials avatar
    const initials = state.profileName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    document.getElementById("sidebar-avatar").innerText = initials || "SS";

    // Dashboard Banner Greeting
    const welcomeTitle = document.getElementById("welcome-title");
    if (welcomeTitle) {
        welcomeTitle.innerText = `Welcome back, ${state.profileName}!`;
    }
}

// Update Dashboard Stats Counters
function updateOverviewStats() {
    document.getElementById("stat-clubs").innerText = state.clubs.filter(c => c.joined).length;
    document.getElementById("stat-notes").innerText = state.notes.length;
    document.getElementById("stat-lost").innerText = state.lostFound.length;
    document.getElementById("stat-market").innerText = state.marketplace.length;
}

// Render Dashboard Widgets
function renderDashboard() {
    // 1. Timetable Widget
    const ttContent = document.getElementById("widget-timetable-content");
    const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    
    let schedule = [];
    if (state.timetablePreset === "custom") {
        schedule = state.timetableCustom.filter(s => s.day === currentDay);
    } else {
        // Since we cleared mock templates, defaults would be empty unless preset matches custom additions
        schedule = state.timetableCustom.filter(s => s.day === currentDay);
    }

    if (schedule.length === 0) {
        ttContent.innerHTML = `
            <div class="empty-widget">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <p>No classes scheduled for today (${currentDay}).</p>
            </div>`;
    } else {
        ttContent.innerHTML = `<div class="widget-timetable-list">` + 
            schedule.map((item, idx) => `
                <div class="timetable-mini-row ${idx === 0 ? 'active' : ''}">
                    <div class="class-info-mini">
                        <h4>${item.name}</h4>
                        <p>${item.room} &bull; ${item.faculty || 'Professor'}</p>
                    </div>
                    <span class="time-lbl">${item.time.split(" - ")[0]}</span>
                </div>
            `).join("") + `</div>`;
    }

    // 2. Events Widget
    const eventsContent = document.getElementById("widget-events-content");
    const upcomingEvents = state.events.slice(0, 3);
    if (upcomingEvents.length === 0) {
        eventsContent.innerHTML = `
            <div class="empty-widget">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line></svg>
                <p>No upcoming events created.</p>
            </div>`;
    } else {
        eventsContent.innerHTML = `<div class="widget-events-list">` +
            upcomingEvents.map(evt => `
                <div class="event-mini-card">
                    <div class="event-date-badge">
                        <span class="day">${evt.date}</span>
                        <span class="month">${evt.month}</span>
                    </div>
                    <div class="event-info-mini">
                        <h4>${evt.title}</h4>
                        <p>${evt.time.split(" - ")[0]} &bull; ${evt.venue}</p>
                    </div>
                </div>
            `).join("") + `</div>`;
    }

    // 3. Placements Widget
    const placementsContent = document.getElementById("widget-placements-content");
    const activePlacements = state.placements.slice(0, 3);
    if (activePlacements.length === 0) {
        placementsContent.innerHTML = `
            <div class="empty-widget">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                <p>No active placement updates.</p>
            </div>`;
    } else {
        placementsContent.innerHTML = `<div class="placement-mini-list">` +
            activePlacements.map(plc => `
                <div class="placement-mini-row">
                    <div class="placement-company-logo">${plc.company[0]}</div>
                    <div class="placement-info-mini">
                        <h4>${plc.company}</h4>
                        <p>${plc.role}</p>
                    </div>
                    <span class="placement-deadline-mini">Apply by ${plc.deadline.split(",")[0]}</span>
                </div>
            `).join("") + `</div>`;
    }
}

// Render Clubs View
function renderClubs() {
    const container = document.getElementById("clubs-list-container");
    const filter = document.getElementById("club-category-select").value;
    
    const filteredClubs = state.clubs.filter(club => {
        return filter === "all" || club.category === filter;
    });

    if (filteredClubs.length === 0) {
        container.innerHTML = `
            <div class="empty-widget" style="grid-column: 1 / -1;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                <p>No clubs found. Click "Create Club" to establish the first college club!</p>
            </div>`;
        return;
    }

    container.innerHTML = filteredClubs.map(club => `
        <div class="club-card">
            <div class="club-card-top">
                <div class="club-badge-row">
                    <span class="badge badge-${club.category}">${club.category.toUpperCase()}</span>
                </div>
                <h3 class="club-title">${club.name}</h3>
                <p class="club-desc">${club.description}</p>
            </div>
            <div class="club-card-bottom">
                <span class="member-count">${club.members} members</span>
                <button class="btn ${club.joined ? 'btn-secondary' : 'btn-outline'} btn-sm join-club-trigger" data-id="${club.id}">
                    ${club.joined ? 'Joined' : 'Join'}
                </button>
            </div>
        </div>
    `).join("");

    // Join Button hooks
    container.querySelectorAll(".join-club-trigger").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            const club = state.clubs.find(c => c.id === id);
            if (club) {
                club.joined = !club.joined;
                club.members += club.joined ? 1 : -1;
                state.saveAll();
                renderClubs();
            }
        });
    });

    // Modal Details hooks
    container.querySelectorAll(".club-card").forEach((card, index) => {
        card.addEventListener("click", () => {
            const club = filteredClubs[index];
            openClubDetailModal(club);
        });
    });
}

function openClubDetailModal(club) {
    const modal = document.getElementById("modal-club-details");
    document.getElementById("club-detail-name").innerText = club.name;
    document.getElementById("club-detail-desc").innerText = club.description;
    
    const tag = document.getElementById("club-detail-tag");
    tag.className = `badge badge-${club.category}`;
    tag.innerText = club.category.toUpperCase();

    const announceList = document.getElementById("club-detail-announcements");
    if (!club.announcements || club.announcements.length === 0) {
        announceList.innerHTML = `<p class="announcement-date">No announcements have been posted yet.</p>`;
    } else {
        announceList.innerHTML = club.announcements.map(ann => `
            <div class="announcement-item">
                <p>${ann.text}</p>
                <span class="announcement-date">${ann.date}</span>
            </div>
        `).join("");
    }

    const joinBtn = document.getElementById("btn-toggle-join-club");
    joinBtn.className = club.joined ? 'btn btn-secondary' : 'btn btn-primary';
    joinBtn.innerText = club.joined ? 'Leave Club' : 'Join Club';

    joinBtn.onclick = () => {
        club.joined = !club.joined;
        club.members += club.joined ? 1 : -1;
        state.saveAll();
        modal.classList.remove("active");
        renderClubs();
    };

    modal.classList.add("active");
}

// Render Events View
function renderEvents() {
    const container = document.getElementById("events-list-container");
    const filter = document.getElementById("event-type-select").value;

    const filteredEvents = state.events.filter(evt => {
        return filter === "all" || evt.type === filter;
    });

    if (filteredEvents.length === 0) {
        container.innerHTML = `
            <div class="empty-widget" style="grid-column: 1 / -1;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect></svg>
                <p>No events matching filters. Click "Create Event" to schedule an activity!</p>
            </div>`;
        return;
    }

    container.innerHTML = filteredEvents.map(evt => `
        <div class="event-card">
            <div class="event-card-banner">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <span class="event-tag-pill">${evt.type.toUpperCase()}</span>
            </div>
            <div class="event-card-body">
                <div>
                    <h3 class="event-title">${evt.title}</h3>
                    <div class="event-meta">
                        <div class="meta-row">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            <span>${evt.date} ${evt.month} &bull; ${evt.time}</span>
                        </div>
                        <div class="meta-row">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            <span>${evt.venue}</span>
                        </div>
                    </div>
                    <p class="club-desc" style="margin-bottom: 16px;">${evt.description}</p>
                </div>
                <div class="event-card-actions">
                    <span class="rsvp-status">${evt.rsvps} going</span>
                    <button class="btn btn-sm ${evt.userRsvped ? 'btn-secondary' : 'btn-primary'} rsvp-trigger" data-id="${evt.id}">
                        ${evt.userRsvped ? 'Going' : 'RSVP'}
                    </button>
                </div>
            </div>
        </div>
    `).join("");

    container.querySelectorAll(".rsvp-trigger").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const evt = state.events.find(e => e.id === id);
            if (evt) {
                evt.userRsvped = !evt.userRsvped;
                evt.rsvps += evt.userRsvped ? 1 : -1;
                state.saveAll();
                renderEvents();
            }
        });
    });
}

// Render Notes Sharing View
function renderNotes() {
    const container = document.getElementById("notes-list-container");
    const search = document.getElementById("notes-search-input").value.toLowerCase();
    const branch = document.getElementById("notes-branch-select").value;
    const sem = document.getElementById("notes-sem-select").value;

    const filteredNotes = state.notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(search) || 
                              note.courseCode.toLowerCase().includes(search) ||
                              note.fileName.toLowerCase().includes(search);
        const matchesBranch = branch === "all" || note.branch === branch;
        const matchesSem = sem === "all" || note.semester === sem;
        return matchesSearch && matchesBranch && matchesSem;
    });

    if (filteredNotes.length === 0) {
        container.innerHTML = `
            <div class="empty-widget">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path></svg>
                <p>No study notes available. Click "Share a Note" to contribute your first document!</p>
            </div>`;
        return;
    }

    container.innerHTML = filteredNotes.map(note => `
        <div class="note-row">
            <div class="note-row-left">
                <div class="note-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                </div>
                <div class="note-info">
                    <h4>${note.title}</h4>
                    <div class="note-details">
                        <span>Sem ${note.semester}</span>
                        <div class="note-dot"></div>
                        <span>By ${note.author || 'Anonymous'}</span>
                        <div class="note-dot"></div>
                        <span>${note.downloads} downloads</span>
                    </div>
                </div>
            </div>
            <div class="note-row-right">
                <span class="course-code-badge">${note.courseCode}</span>
                <button class="btn btn-secondary btn-sm download-note-trigger" data-id="${note.id}">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline></svg>
                    <span>Download</span>
                </button>
            </div>
        </div>
    `).join("");

    container.querySelectorAll(".download-note-trigger").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const note = state.notes.find(n => n.id === id);
            if (note) {
                note.downloads += 1;
                state.saveAll();
                alert(`Simulating download of notes file: ${note.fileName}`);
                renderNotes();
            }
        });
    });
}

// Render Lost & Found View
let activeLFStatus = "all";
function renderLostFound() {
    const container = document.getElementById("lf-list-container");
    
    document.querySelectorAll(".tab-btn[data-lf-filter]").forEach(btn => {
        if (btn.dataset.lfFilter === activeLFStatus) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    const filteredItems = state.lostFound.filter(item => {
        return activeLFStatus === "all" || item.status.toLowerCase() === activeLFStatus;
    });

    if (filteredItems.length === 0) {
        container.innerHTML = `
            <div class="empty-widget" style="grid-column: 1 / -1;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path></svg>
                <p>No reported items in this category. Click "Report Item" to list a lost/found accessory.</p>
            </div>`;
        return;
    }

    container.innerHTML = filteredItems.map(item => `
        <div class="lf-card">
            <div class="lf-media">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path></svg>
            </div>
            <div class="lf-content">
                <div class="lf-header-row">
                    <h3>${item.title}</h3>
                    <span class="status-badge status-${item.status.toLowerCase()}">${item.status}</span>
                </div>
                <p class="lf-desc">${item.description || 'No description provided.'}</p>
                <div class="lf-details">
                    <span><strong>Location:</strong> ${item.location}</span>
                    <span><strong>Contact:</strong> ${item.contact}</span>
                    <span style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px;">Posted ${item.date}</span>
                </div>
            </div>
        </div>
    `).join("");
}

// Render Marketplace View
function renderMarketplace() {
    const container = document.getElementById("market-list-container");
    const search = document.getElementById("market-search-input").value.toLowerCase();
    const category = document.getElementById("market-category-select").value;

    const filteredListings = state.marketplace.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(search) || 
                              item.description.toLowerCase().includes(search);
        const matchesCategory = category === "all" || item.category === category;
        return matchesSearch && matchesCategory;
    });

    if (filteredListings.length === 0) {
        container.innerHTML = `
            <div class="empty-widget" style="grid-column: 1 / -1;">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path></svg>
                <p>No listings found. Click "List Item" to advertise cycles, books, or electronics!</p>
            </div>`;
        return;
    }

    container.innerHTML = filteredListings.map(item => `
        <div class="market-card">
            <div class="market-media">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path></svg>
                <span class="market-cat-pill">${item.category}</span>
            </div>
            <div class="market-content">
                <div class="market-meta">
                    <div class="market-price-row">
                        <span class="market-price">₹${item.price}</span>
                        <span style="font-size:0.7rem; color: var(--text-muted);">Listed ${item.date}</span>
                    </div>
                    <h3>${item.title}</h3>
                    <p class="market-desc">${item.description || ''}</p>
                </div>
                <div class="market-bottom-actions">
                    <span class="market-contact-info">Seller: ${item.contact}</span>
                    <button class="btn btn-secondary btn-sm contact-seller-trigger" data-contact="${item.contact}">
                        <span>Contact</span>
                    </button>
                </div>
            </div>
        </div>
    `).join("");

    container.querySelectorAll(".contact-seller-trigger").forEach(btn => {
        btn.addEventListener("click", () => {
            alert(`Contact the seller directly on WhatsApp/Call: ${btn.dataset.contact}`);
        });
    });
}

// Render Timetable View
const TIME_SLOTS = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:15 AM - 12:15 PM",
    "12:15 PM - 01:15 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM"
];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const PRESETS = {
    "CS-3A": [
        { day: "Monday", time: "09:00 AM - 10:00 AM", name: "Operating Systems", room: "B-302", faculty: "Dr. R. Kumar" },
        { day: "Monday", time: "11:15 AM - 12:15 PM", name: "Database Management Systems", room: "B-304", faculty: "Prof. S. Rao" },
        { day: "Tuesday", time: "10:00 AM - 11:00 AM", name: "Theory of Computation", room: "B-302", faculty: "Dr. Amit Roy" },
        { day: "Wednesday", time: "09:00 AM - 10:00 AM", name: "Operating Systems", room: "B-302", faculty: "Dr. R. Kumar" },
        { day: "Wednesday", time: "12:15 PM - 01:15 PM", name: "Software Engineering", room: "B-305", faculty: "Dr. Priya Sen" },
        { day: "Thursday", time: "11:15 AM - 12:15 PM", name: "Database Management Systems", room: "B-304", faculty: "Prof. S. Rao" },
        { day: "Thursday", time: "02:00 PM - 03:00 PM", name: "OS Lab", room: "Lab 2", faculty: "Dr. R. Kumar" },
        { day: "Friday", time: "09:00 AM - 10:00 AM", name: "Theory of Computation", room: "B-302", faculty: "Dr. Amit Roy" },
        { day: "Friday", time: "10:00 AM - 11:00 AM", name: "Software Engineering", room: "B-305", faculty: "Dr. Priya Sen" }
    ],
    "CS-3B": [
        { day: "Monday", time: "10:00 AM - 11:00 AM", name: "Database Management Systems", room: "B-304", faculty: "Prof. S. Rao" },
        { day: "Tuesday", time: "09:00 AM - 10:00 AM", name: "Operating Systems", room: "Dr. R. Kumar", faculty: "Lab 1" },
        { day: "Wednesday", time: "11:15 AM - 12:15 PM", name: "Theory of Computation", room: "B-302", faculty: "Dr. Amit Roy" },
        { day: "Thursday", time: "12:15 PM - 01:15 PM", name: "Software Engineering", room: "B-305", faculty: "Dr. Priya Sen" }
    ],
    "EC-2A": [
        { day: "Monday", time: "09:00 AM - 10:00 AM", name: "Signals & Systems", room: "C-101", faculty: "Dr. A. Verma" },
        { day: "Tuesday", time: "11:15 AM - 12:15 PM", name: "Digital Electronics", room: "C-102", faculty: "Prof. N. Murthy" },
        { day: "Wednesday", time: "10:00 AM - 11:00 AM", name: "Analog Circuits", room: "C-104", faculty: "Dr. K. Das" }
    ],
    "custom": []
};

function renderTimetable() {
    const gridBody = document.getElementById("timetable-slots-grid");
    document.getElementById("timetable-preset-select").value = state.timetablePreset;

    let schedule = [];
    if (state.timetablePreset === "custom") {
        schedule = state.timetableCustom;
    } else {
        schedule = PRESETS[state.timetablePreset] || [];
    }

    let rowsHTML = "";
    TIME_SLOTS.forEach(slot => {
        rowsHTML += `<div class="timetable-row">`;
        rowsHTML += `<div class="time-slot-label">${slot.split(" - ")[0]}<br>${slot.split(" - ")[1]}</div>`;
        
        DAYS.forEach(day => {
            const classItem = schedule.find(item => item.day === day && item.time === slot);
            rowsHTML += `<div class="day-slot-cell">`;
            if (classItem) {
                rowsHTML += `
                    <div class="timetable-class-card">
                        <div class="class-title-text">${classItem.name}</div>
                        <div class="class-meta-details">
                            <span>${classItem.room}</span>
                            <span>${classItem.faculty ? classItem.faculty.split(" ").slice(-1)[0] : ''}</span>
                        </div>
                    </div>
                `;
            }
            rowsHTML += `</div>`;
        });
        rowsHTML += `</div>`;
    });

    gridBody.innerHTML = rowsHTML;
}

// Render Placements View
function renderPlacements() {
    const container = document.getElementById("placements-feed-container");
    
    if (state.placements.length === 0) {
        container.innerHTML = `
            <div class="empty-widget">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                <p>No placement updates posted. Click "Post Update" to publish a new recruitment link!</p>
            </div>`;
        return;
    }

    container.innerHTML = state.placements.map(plc => `
        <div class="placement-card">
            <div class="placement-card-header">
                <div class="placement-company-info">
                    <div class="logo-container">${plc.company[0]}</div>
                    <div class="company-details">
                        <h3>${plc.company}</h3>
                        <p>${plc.role}</p>
                    </div>
                </div>
                <div class="placement-ctc">${plc.ctc}</div>
            </div>
            
            <div class="placement-details-grid">
                <div class="p-detail-box">
                    <span class="p-detail-lbl">CGPA Eligibility</span>
                    <span class="p-detail-val">${plc.cgpa}</span>
                </div>
                <div class="p-detail-box">
                    <span class="p-detail-lbl">Eligible Branches</span>
                    <span class="p-detail-val">${plc.branches}</span>
                </div>
                <div class="p-detail-box">
                    <span class="p-detail-lbl">Recruitment Mode</span>
                    <span class="p-detail-val">On-Campus</span>
                </div>
            </div>

            <div class="placement-desc-block">
                ${plc.description}
            </div>

            <div class="placement-footer">
                <span class="deadline-text">Deadline: ${plc.deadline}</span>
                <button class="btn btn-sm ${plc.applied ? 'btn-secondary' : 'btn-primary'} apply-placement-trigger" data-id="${plc.id}">
                    ${plc.applied ? 'Applied' : 'Apply Now'}
                </button>
            </div>
        </div>
    `).join("");

    container.querySelectorAll(".apply-placement-trigger").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const plc = state.placements.find(p => p.id === id);
            if (plc) {
                plc.applied = !plc.applied;
                state.saveAll();
                renderPlacements();
            }
        });
    });
}

// --- Global Search Handler ---
function initGlobalSearch() {
    const input = document.getElementById("global-search");
    input.addEventListener("input", () => {
        const query = input.value.toLowerCase().trim();
        if (query.length < 2) return;

        const noteMatches = state.notes.filter(n => n.title.toLowerCase().includes(query) || n.courseCode.toLowerCase().includes(query)).length;
        const marketMatches = state.marketplace.filter(m => m.title.toLowerCase().includes(query) || m.description.toLowerCase().includes(query)).length;
        const lfMatches = state.lostFound.filter(l => l.title.toLowerCase().includes(query) || l.description.toLowerCase().includes(query)).length;

        if (noteMatches >= marketMatches && noteMatches >= lfMatches && noteMatches > 0) {
            window.location.hash = "notes";
            document.getElementById("notes-search-input").value = query;
            renderNotes();
        } else if (marketMatches >= lfMatches && marketMatches > 0) {
            window.location.hash = "marketplace";
            document.getElementById("market-search-input").value = query;
            renderMarketplace();
        } else if (lfMatches > 0) {
            window.location.hash = "lost-found";
            activeLFStatus = "all";
            renderLostFound();
        }
    });
}

// --- Modal Handling System ---
function initModals() {
    const modalMappings = [
        { btnId: "btn-upload-note", modalId: "modal-upload-note" },
        { btnId: "btn-report-item", modalId: "modal-report-item" },
        { btnId: "btn-list-market", modalId: "modal-list-market" },
        { btnId: "btn-add-class", modalId: "modal-add-class" },
        { btnId: "btn-create-club", modalId: "modal-create-club" },
        { btnId: "btn-create-event", modalId: "modal-create-event" },
        { btnId: "btn-post-placement", modalId: "modal-post-placement" },
        { btnId: "user-profile-trigger", modalId: "modal-edit-profile" }
    ];

    modalMappings.forEach(map => {
        const btn = document.getElementById(map.btnId);
        const modal = document.getElementById(map.modalId);
        if (btn && modal) {
            btn.addEventListener("click", () => {
                // Prefill Edit Profile if triggered
                if (map.modalId === "modal-edit-profile") {
                    document.getElementById("edit-profile-name").value = state.profileName;
                    document.getElementById("edit-profile-role").value = state.profileRole;
                }
                modal.classList.add("active");
            });
        }
    });

    // Close triggers
    document.querySelectorAll(".modal").forEach(modal => {
        const closeBtns = modal.querySelectorAll(".close-modal-btn, .btn-close-modal");
        closeBtns.forEach(cBtn => {
            cBtn.addEventListener("click", () => {
                modal.classList.remove("active");
            });
        });

        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("active");
            }
        });
    });

    // --- Form Submissions ---

    // Note upload
    document.getElementById("form-upload-note").addEventListener("submit", (e) => {
        e.preventDefault();
        const newNote = {
            id: `note-${Date.now()}`,
            title: document.getElementById("note-title").value,
            courseCode: document.getElementById("note-course-code").value.toUpperCase(),
            branch: document.getElementById("note-branch").value,
            semester: document.getElementById("note-sem").value,
            author: document.getElementById("note-author").value || state.profileName,
            fileName: document.getElementById("note-file-name").value,
            downloads: 0
        };

        state.notes.unshift(newNote);
        state.saveAll();
        document.getElementById("modal-upload-note").classList.remove("active");
        e.target.reset();
        renderNotes();
    });

    // Lost Found report
    document.getElementById("form-report-item").addEventListener("submit", (e) => {
        e.preventDefault();
        const status = document.querySelector('input[name="item-status"]:checked').value;
        const newItem = {
            id: `lf-${Date.now()}`,
            status: status,
            title: document.getElementById("item-title").value,
            location: document.getElementById("item-location").value,
            contact: document.getElementById("item-contact").value,
            description: document.getElementById("item-description").value,
            date: "Just now"
        };

        state.lostFound.unshift(newItem);
        state.saveAll();
        document.getElementById("modal-report-item").classList.remove("active");
        e.target.reset();
        activeLFStatus = status.toLowerCase();
        renderLostFound();
    });

    // Marketplace Listing
    document.getElementById("form-list-market").addEventListener("submit", (e) => {
        e.preventDefault();
        const newItem = {
            id: `mkt-${Date.now()}`,
            title: document.getElementById("market-title").value,
            price: parseFloat(document.getElementById("market-price").value),
            category: document.getElementById("market-category").value,
            contact: document.getElementById("market-contact").value,
            description: document.getElementById("market-description").value,
            date: "Just now"
        };

        state.marketplace.unshift(newItem);
        state.saveAll();
        document.getElementById("modal-list-market").classList.remove("active");
        e.target.reset();
        renderMarketplace();
    });

    // Add Timetable Class
    document.getElementById("form-add-class").addEventListener("submit", (e) => {
        e.preventDefault();
        const newClass = {
            day: document.getElementById("class-day").value,
            time: document.getElementById("class-time").value,
            name: document.getElementById("class-name").value,
            room: document.getElementById("class-room").value,
            faculty: document.getElementById("class-faculty").value || "TBD"
        };

        state.timetablePreset = "custom";
        state.timetableCustom.push(newClass);
        state.saveAll();
        document.getElementById("modal-add-class").classList.remove("active");
        e.target.reset();
        renderTimetable();
    });

    // Create Club Form
    document.getElementById("form-create-club").addEventListener("submit", (e) => {
        e.preventDefault();
        const newClub = {
            id: `club-${Date.now()}`,
            name: document.getElementById("new-club-name").value,
            category: document.getElementById("new-club-category").value,
            description: document.getElementById("new-club-desc").value,
            members: 1,
            joined: true,
            announcements: [
                { text: "Club was successfully established!", date: "Just now" }
            ]
        };

        state.clubs.unshift(newClub);
        state.saveAll();
        document.getElementById("modal-create-club").classList.remove("active");
        e.target.reset();
        renderClubs();
    });

    // Create Event Form
    document.getElementById("form-create-event").addEventListener("submit", (e) => {
        e.preventDefault();
        const newEvent = {
            id: `evt-${Date.now()}`,
            title: document.getElementById("new-event-title").value,
            type: document.getElementById("new-event-type").value,
            date: document.getElementById("new-event-day").value,
            month: document.getElementById("new-event-month").value,
            time: document.getElementById("new-event-time").value,
            venue: document.getElementById("new-event-venue").value,
            description: document.getElementById("new-event-desc").value,
            rsvps: 1,
            userRsvped: true
        };

        state.events.unshift(newEvent);
        state.saveAll();
        document.getElementById("modal-create-event").classList.remove("active");
        e.target.reset();
        renderEvents();
    });

    // Post Placement Form
    document.getElementById("form-post-placement").addEventListener("submit", (e) => {
        e.preventDefault();
        const newPlacement = {
            id: `plc-${Date.now()}`,
            company: document.getElementById("new-place-company").value,
            role: document.getElementById("new-place-role").value,
            ctc: document.getElementById("new-place-ctc").value,
            cgpa: document.getElementById("new-place-cgpa").value,
            branches: document.getElementById("new-place-branches").value,
            deadline: document.getElementById("new-place-deadline").value,
            description: document.getElementById("new-place-desc").value,
            applied: false
        };

        state.placements.unshift(newPlacement);
        state.saveAll();
        document.getElementById("modal-post-placement").classList.remove("active");
        e.target.reset();
        renderPlacements();
    });

    // Edit Profile Form
    document.getElementById("form-edit-profile").addEventListener("submit", (e) => {
        e.preventDefault();
        state.profileName = document.getElementById("edit-profile-name").value;
        state.profileRole = document.getElementById("edit-profile-role").value;
        state.saveAll();
        document.getElementById("modal-edit-profile").classList.remove("active");
        updateProfileView();
        renderView(window.location.hash.substring(1) || "dashboard");
    });
}

// --- Theme Switcher & Filters Handling ---
function initControls() {
    // Theme toggle
    const themeBtn = document.getElementById("theme-toggle");
    document.documentElement.setAttribute("data-theme", state.theme);
    themeBtn.addEventListener("click", () => {
        state.theme = state.theme === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", state.theme);
        state.saveAll();
    });

    // Mobile Navigation Toggle
    const mobileBtn = document.getElementById("mobile-toggle");
    const sidebar = document.querySelector(".sidebar");
    mobileBtn.addEventListener("click", () => {
        sidebar.classList.toggle("mobile-open");
    });

    // Notification click mock
    const notifBtn = document.getElementById("notifications-btn");
    notifBtn.addEventListener("click", () => {
        alert("You have no new notifications.");
    });

    // Notes Filters
    document.getElementById("notes-search-input").addEventListener("input", renderNotes);
    document.getElementById("notes-branch-select").addEventListener("change", renderNotes);
    document.getElementById("notes-sem-select").addEventListener("change", renderNotes);

    // Marketplace Filters
    document.getElementById("market-search-input").addEventListener("input", renderMarketplace);
    document.getElementById("market-category-select").addEventListener("change", renderMarketplace);

    // Clubs Category Filter
    document.getElementById("club-category-select").addEventListener("change", renderClubs);

    // Events Type Filter
    document.getElementById("event-type-select").addEventListener("change", renderEvents);

    // Lost Found Tabs Filtering
    document.querySelectorAll(".tab-btn[data-lf-filter]").forEach(btn => {
        btn.addEventListener("click", () => {
            activeLFStatus = btn.dataset.lfFilter;
            renderLostFound();
        });
    });

    // Timetable Preset Selection
    document.getElementById("timetable-preset-select").addEventListener("change", (e) => {
        state.timetablePreset = e.target.value;
        state.saveAll();
        renderTimetable();
    });
}

// --- App Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    initRouting();
    initControls();
    initModals();
    initGlobalSearch();
    updateProfileView();
});
