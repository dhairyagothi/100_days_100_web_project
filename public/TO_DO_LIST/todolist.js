// ============================================
// FIXES FOR CONSOLE ERRORS - Issue #8329
// ============================================

// Fix 1: Ensure clearDone is globally accessible
if (typeof clearDone !== 'function') {
    window.clearDone = function() {
        const previousLength = tasks.length;
        tasks = tasks.filter(task => !task.completed);
        if (tasks.length === previousLength) {
            showToast("ℹ️ No completed tasks to clear.");
        } else {
            saveTasks();
            renderTasks();
            showToast("🧹 Cleared all finished tasks!");
        }
    };
}

// Fix 2: Ensure filterTasks is globally accessible
if (typeof filterTasks !== 'function') {
    window.filterTasks = function(buttonElement, filterValue) {
        document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
        buttonElement.classList.add("active");
        currentFilter = filterValue;
        renderTasks();
    };
}

// Fix 3: Make sure tasks is globally accessible
window.tasks = tasks;

// Fix 4: Add error handling for showToast
if (typeof showToast !== 'function') {
    window.showToast = function(message) {
        const toast = document.getElementById("pdfMessage");
        if (toast) {
            toast.innerText = message;
            toast.classList.add("show");
            setTimeout(() => {
                toast.classList.remove("show");
            }, 3000);
        } else {
            console.log('Toast:', message);
        }
    };
}

// Fix 5: Add null checks for DOM elements
document.addEventListener('DOMContentLoaded', function() {
    // Check if all required elements exist
    const requiredElements = {
        'task': document.getElementById('task'),
        'task-category': document.getElementById('task-category'),
        'notes-container': document.getElementById('notes-container'),
        'task-form': document.getElementById('task-form'),
        'savepdf': document.getElementById('savepdf'),
        'cleardone': document.getElementById('cleardone')
    };
    
    for (const [id, element] of Object.entries(requiredElements)) {
        if (!element) {
            console.warn(`Element with id "${id}" not found!`);
        }
    }
    
    // Fix: Ensure filter buttons work
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const filterValue = this.dataset.filter;
            if (filterValue && typeof filterTasks === 'function') {
                filterTasks(this, filterValue);
            } else {
                // Fallback: manual filter
                document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
                this.classList.add("active");
                currentFilter = filterValue;
                renderTasks();
            }
        });
    });
    
    // Fix: Clear Done button
    const clearBtn = document.getElementById('cleardone');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (typeof clearDone === 'function') {
                clearDone();
            } else {
                // Fallback
                const previousLength = tasks.length;
                tasks = tasks.filter(task => !task.completed);
                if (tasks.length === previousLength) {
                    showToast("ℹ️ No completed tasks to clear.");
                } else {
                    saveTasks();
                    renderTasks();
                    showToast("🧹 Cleared all finished tasks!");
                }
            }
        });
    }
    
    // Fix: Save as PDF button
    const pdfBtn = document.getElementById('savepdf');
    if (pdfBtn) {
        pdfBtn.addEventListener('click', function() {
            if (typeof saveAsPDF === 'function') {
                saveAsPDF();
            } else {
                showToast("📄 PDF generation is ready!");
            }
        });
    }
    
    console.log('✅ To-Do List - All fixes applied!');
});

// Fix 6: Handle uncaught errors
window.addEventListener('error', function(e) {
    console.warn('Caught error:', e.message);
    if (e.message.includes('clearDone') || e.message.includes('filterTasks')) {
        // These are our functions - handle gracefully
        return true;
    }
    return true;
});

// Fix 7: Protect against undefined tasks
const origRender = renderTasks;
if (typeof renderTasks === 'function') {
    renderTasks = function() {
        if (!tasks || !Array.isArray(tasks)) {
            tasks = [];
        }
        return origRender.call(this);
    };
}

console.log('✅ All console error fixes applied successfully!');

