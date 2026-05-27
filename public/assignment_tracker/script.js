// Load assignments from localStorage
let assignments = JSON.parse(localStorage.getItem('assignments')) || [];
let currentFilter = 'all';

// DOM Elements
const assignmentsList = document.getElementById('assignmentsList');
const assignmentNameInput = document.getElementById('assignmentName');
const dueDateInput = document.getElementById('dueDate');
const addBtn = document.getElementById('addBtn');

// Set min date to today
const today = new Date().toISOString().split('T')[0];
dueDateInput.min = today;
dueDateInput.value = today;

// Add assignment
addBtn.addEventListener('click', () => {
    const name = assignmentNameInput.value.trim();
    const dueDate = dueDateInput.value;
    
    if (!name) {
        alert('Please enter assignment name!');
        return;
    }
    
    if (!dueDate) {
        alert('Please select due date!');
        return;
    }
    
    const newAssignment = {
        id: Date.now(),
        name: name,
        dueDate: dueDate,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    assignments.push(newAssignment);
    saveAndRender();
    assignmentNameInput.value = '';
});

// Save to localStorage and render
function saveAndRender() {
    localStorage.setItem('assignments', JSON.stringify(assignments));
    render();
}

// Calculate days remaining
function getDaysRemaining(dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Get status class based on days remaining
function getDaysLeftClass(daysRemaining) {
    if (daysRemaining < 0) return 'urgent';
    if (daysRemaining === 0) return 'urgent';
    if (daysRemaining <= 2) return 'warning';
    return 'safe';
}

// Get formatted days left text
function getDaysLeftText(daysRemaining) {
    if (daysRemaining < 0) return `⚠️ Overdue by ${Math.abs(daysRemaining)} days`;
    if (daysRemaining === 0) return '⚠️ Due Today!';
    if (daysRemaining === 1) return '📅 Due tomorrow!';
    return `📅 ${daysRemaining} days left`;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Toggle complete status
function toggleComplete(id) {
    const assignment = assignments.find(a => a.id === id);
    if (assignment) {
        assignment.completed = !assignment.completed;
        saveAndRender();
    }
}

// Delete assignment
function deleteAssignment(id) {
    if (confirm('Are you sure you want to delete this assignment?')) {
        assignments = assignments.filter(a => a.id !== id);
        saveAndRender();
    }
}

// Render assignments based on current filter
function render() {
    // Filter assignments
    let filteredAssignments = assignments;
    if (currentFilter === 'pending') {
        filteredAssignments = assignments.filter(a => !a.completed);
    } else if (currentFilter === 'completed') {
        filteredAssignments = assignments.filter(a => a.completed);
    }
    
    // Sort by due date (earliest first for pending, latest first for completed)
    if (currentFilter !== 'completed') {
        filteredAssignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } else {
        filteredAssignments.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    }
    
    // Render to DOM
    if (filteredAssignments.length === 0) {
        assignmentsList.innerHTML = '<p class="empty-message">✨ No assignments here! ✨</p>';
    } else {
        assignmentsList.innerHTML = filteredAssignments.map(assignment => {
            const daysRemaining = getDaysRemaining(assignment.dueDate);
            const daysLeftClass = getDaysLeftClass(daysRemaining);
            const daysLeftText = getDaysLeftText(daysRemaining);
            
            return `
                <div class="assignment-item ${assignment.completed ? 'completed-assignment' : ''}">
                    <div class="assignment-info">
                        <div class="assignment-name">${escapeHtml(assignment.name)}</div>
                        <div class="due-date">📅 Due: ${formatDate(assignment.dueDate)}</div>
                        <div class="days-left ${daysLeftClass}">${daysLeftText}</div>
                    </div>
                    <div class="assignment-actions">
                        ${!assignment.completed ? 
                            `<button class="complete-btn" onclick="toggleComplete(${assignment.id})">✅ Complete</button>` : 
                            `<button class="complete-btn" onclick="toggleComplete(${assignment.id})">🔄 Undo</button>`
                        }
                        <button class="delete-btn" onclick="deleteAssignment(${assignment.id})">🗑️ Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Update statistics
    updateStats();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Update statistics
function updateStats() {
    const total = assignments.length;
    const completed = assignments.filter(a => a.completed).length;
    const pending = total - completed;
    
    document.getElementById('totalCount').textContent = total;
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('completedCount').textContent = completed;
}

// Filter button handlers
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        render();
    });
});

// Initial render
render();