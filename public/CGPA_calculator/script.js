// Grade mapping with points
const gradeMap = {
    '4.0': 'A',
    '3.7': 'A-',
    '3.3': 'B+',
    '3.0': 'B',
    '2.7': 'B-',
    '2.3': 'C+',
    '2.0': 'C',
    '1.7': 'C-',
    '1.3': 'D+',
    '1.0': 'D',
    '0.0': 'F'
};

// Subjects array
let subjects = [];
let nextId = 1;
const MAX_SUBJECTS = 8;

// DOM Elements
const subjectNameInput = document.getElementById('subjectName');
const gradeSelect = document.getElementById('gradeSelect');
const creditHoursInput = document.getElementById('creditHours');
const addBtn = document.getElementById('addSubjectBtn');
const subjectsContainer = document.getElementById('subjectsList');
const subjectCounter = document.getElementById('subjectCounter');
const gpaValueSpan = document.getElementById('gpaValue');
const totalCreditsSpan = document.getElementById('totalCredits');
const qualityPointsSpan = document.getElementById('qualityPoints');
const subjectCountSpan = document.getElementById('subjectCount');
const gpaMessageSpan = document.getElementById('gpaMessage');
const resetAllBtn = document.getElementById('resetAllBtn');
const themeToggle = document.getElementById('themeToggle');

// Check if localStorage is available (for file:// protocol)
function isLocalStorageAvailable() {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        return false;
    }
}

const storageAvailable = isLocalStorageAvailable();

// Load saved theme preference
function loadTheme() {
    if (!storageAvailable) {
        // If localStorage not available, just use light theme
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.querySelector('.theme-icon').textContent = '🌙';
        return;
    }
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.querySelector('.theme-icon').textContent = '☀️';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.querySelector('.theme-icon').textContent = '🌙';
    }
}

// Toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (storageAvailable) localStorage.setItem('theme', 'light');
        themeToggle.querySelector('.theme-icon').textContent = '🌙';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (storageAvailable) localStorage.setItem('theme', 'dark');
        themeToggle.querySelector('.theme-icon').textContent = '☀️';
    }
}

// Calculate GPA
function calculateGPA() {
    let totalCredits = 0;
    let totalQualityPoints = 0;
    
    for (let subject of subjects) {
        totalCredits += subject.credits;
        totalQualityPoints += subject.gradePoint * subject.credits;
    }
    
    const gpa = totalCredits === 0 ? 0 : totalQualityPoints / totalCredits;
    
    return {
        totalCredits,
        totalQualityPoints,
        gpa: gpa
    };
}

// Get message based on GPA
function getGPAMessage(gpa) {
    if (gpa === 0) return "Add subjects to see your GPA";
    if (gpa >= 3.5) return "🎉 Excellent! Keep up the great work!";
    if (gpa >= 3.0) return "👍 Good job! You're doing well!";
    if (gpa >= 2.5) return "📚 Keep pushing! You can do better!";
    if (gpa >= 2.0) return "⚠️ You need to improve your grades";
    return "❌ Academic probation risk. Seek help!";
}

// Update UI
function updateUI() {
    // Update counter
    subjectCounter.textContent = `${subjects.length} / ${MAX_SUBJECTS}`;
    subjectCountSpan.textContent = subjects.length;
    
    // Render subjects list
    if (subjects.length === 0) {
        subjectsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📚</div>
                <p>No subjects added yet</p>
                <small>Add your first subject using the form above</small>
            </div>
        `;
    } else {
        subjectsContainer.innerHTML = '';
        subjects.forEach(subject => {
            const subjectDiv = document.createElement('div');
            subjectDiv.className = 'subject-item';
            subjectDiv.innerHTML = `
                <div class="subject-info">
                    <div class="subject-name">${escapeHtml(subject.name)}</div>
                    <div class="subject-details">
                        <span class="subject-grade">Grade: ${subject.gradeLetter}</span>
                        <span class="subject-credits">Credits: ${subject.credits}</span>
                        <span class="subject-points">Points: ${(subject.gradePoint * subject.credits).toFixed(2)}</span>
                    </div>
                </div>
                <button class="delete-btn" data-id="${subject.id}">Delete</button>
            `;
            subjectsContainer.appendChild(subjectDiv);
        });
        
        // Add delete event listeners
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.getAttribute('data-id'));
                deleteSubject(id);
            });
        });
    }
    
    // Calculate and display GPA
    const { totalCredits, totalQualityPoints, gpa } = calculateGPA();
    totalCreditsSpan.textContent = totalCredits;
    qualityPointsSpan.textContent = totalQualityPoints.toFixed(2);
    gpaValueSpan.textContent = gpa.toFixed(2);
    gpaMessageSpan.textContent = getGPAMessage(gpa);
    
    // Change message color based on GPA
    if (gpa >= 3.0) {
        gpaMessageSpan.style.color = '#10b981';
    } else if (gpa >= 2.0) {
        gpaMessageSpan.style.color = '#f59e0b';
    } else if (gpa > 0) {
        gpaMessageSpan.style.color = '#ef4444';
    } else {
        gpaMessageSpan.style.color = 'var(--text-secondary)';
    }
}

// Add subject
function addSubject() {
    // Check maximum subjects limit
    if (subjects.length >= MAX_SUBJECTS) {
        alert(`⚠️ Maximum ${MAX_SUBJECTS} subjects reached. Remove some subjects before adding new ones.`);
        return false;
    }
    
    // Validate subject name
    const subjectName = subjectNameInput.value.trim();
    if (subjectName === "") {
        alert("❌ Please enter a subject name.");
        subjectNameInput.focus();
        return false;
    }
    
    // Get grade and credit hours
    const gradePoint = parseFloat(gradeSelect.value);
    const gradeLetter = gradeMap[gradePoint];
    let credits = parseInt(creditHoursInput.value);
    
    // Validate credits
    if (isNaN(credits) || credits < 1) {
        credits = 1;
    }
    if (credits > 6) {
        credits = 6;
    }
    
    // Create new subject
    const newSubject = {
        id: nextId++,
        name: subjectName,
        gradePoint: gradePoint,
        gradeLetter: gradeLetter,
        credits: credits
    };
    
    subjects.push(newSubject);
    
    // Clear form
    subjectNameInput.value = '';
    creditHoursInput.value = '3';
    gradeSelect.value = '3.0';
    subjectNameInput.focus();
    
    // Update UI
    updateUI();
    
    // Show success feedback
    showTemporaryFeedback("✅ Subject added successfully!", "success");
    
    return true;
}

// Delete subject
function deleteSubject(id) {
    subjects = subjects.filter(sub => sub.id !== id);
    updateUI();
    showTemporaryFeedback("🗑️ Subject removed", "info");
}

// Reset all subjects
function resetAll() {
    if (subjects.length === 0) {
        alert("✨ No subjects to reset.");
        return;
    }
    
    if (confirm("⚠️ Are you sure you want to reset all subjects? This action cannot be undone.")) {
        subjects = [];
        nextId = 1;
        updateUI();
        showTemporaryFeedback("🔄 All subjects have been reset", "info");
    }
}

// Show temporary feedback message
function showTemporaryFeedback(message, type) {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.textContent = message;
    feedbackDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(feedbackDiv);
    
    setTimeout(() => {
        feedbackDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(feedbackDiv)) {
                document.body.removeChild(feedbackDiv);
            }
        }, 300);
    }, 2000);
}

// Add CSS animations for feedback
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Escape HTML to prevent XSS
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Event Listeners
addBtn.addEventListener('click', addSubject);
resetAllBtn.addEventListener('click', resetAll);
themeToggle.addEventListener('click', toggleTheme);

// Add keyboard shortcuts
subjectNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addSubject();
    }
});

creditHoursInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addSubject();
    }
});

// Validate credit hours input
creditHoursInput.addEventListener('change', function() {
    let val = parseInt(this.value);
    if (isNaN(val)) this.value = 3;
    else if (val < 1) this.value = 1;
    else if (val > 6) this.value = 6;
});

// Initialize app
loadTheme();
updateUI();

// Optional: Save to localStorage if available (auto-save feature)
function autoSave() {
    if (storageAvailable) {
        try {
            localStorage.setItem('gpa_subjects', JSON.stringify(subjects));
            localStorage.setItem('gpa_nextId', nextId);
        } catch(e) {
            // Silently fail if storage is full or not available
            console.log('Auto-save failed:', e);
        }
    }
}

function autoLoad() {
    if (!storageAvailable) return;
    
    try {
        const savedSubjects = localStorage.getItem('gpa_subjects');
        const savedNextId = localStorage.getItem('gpa_nextId');
        
        if (savedSubjects) {
            subjects = JSON.parse(savedSubjects);
            nextId = savedNextId ? parseInt(savedNextId) : subjects.length + 1;
            updateUI();
        }
    } catch(e) {
        console.log('Auto-load failed:', e);
    }
}

// Auto-save every 30 seconds only if storage is available
if (storageAvailable) {
    setInterval(autoSave, 30000);
    autoLoad();
    
    // Save before page unload
    window.addEventListener('beforeunload', autoSave);
}