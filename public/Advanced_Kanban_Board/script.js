/**
 * KanbanFlow Core Logic
 * Handles Data persistence, Drag & Drop, and DOM Manipulation
 */

// Initialize or get data from LocalStorage
let kanbanData = JSON.parse(localStorage.getItem('kanban_data')) || {
    todo: [],
    inProgress: [],
    done: []
};

// Global Theme Initialization
const theme = localStorage.getItem('theme') || 'light';
if (theme === 'dark') {
    document.body.classList.add('dark-mode');
}

// Ensure we are on the board page before attaching these listeners
if (window.location.pathname.includes('board.html') || window.location.pathname === '/') {
    
    // Elements
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskModal = document.getElementById('task-modal');
    const closeBtn = document.querySelector('.close-btn');
    const taskForm = document.getElementById('task-form');

    const columns = document.querySelectorAll('.kanban-column');
    const lists = {
        todo: document.getElementById('todo-list'),
        inProgress: document.getElementById('in-progress-list'),
        done: document.getElementById('done-list')
    };

    let draggedTask = null;
    let draggedSourceColumn = null;

    // --- Core Functions ---

    function generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    function saveData() {
        localStorage.setItem('kanban_data', JSON.stringify(kanbanData));
        updateCounts();
    }

    function updateCounts() {
        if(document.getElementById('todo-count')) {
            document.getElementById('todo-count').innerText = kanbanData.todo.length;
            document.getElementById('in-progress-count').innerText = kanbanData.inProgress.length;
            document.getElementById('done-count').innerText = kanbanData.done.length;
        }
    }

    function renderBoard() {
        if(!lists.todo) return; // Not on board page

        // Clear existing
        lists.todo.innerHTML = '';
        lists.inProgress.innerHTML = '';
        lists.done.innerHTML = '';

        // Render all tasks
        Object.keys(kanbanData).forEach(columnKey => {
            kanbanData[columnKey].forEach(task => {
                const taskEl = createTaskElement(task, columnKey);
                lists[columnKey].appendChild(taskEl);
            });
        });

        updateCounts();
    }

    function createTaskElement(task, columnKey) {
        const el = document.createElement('div');
        el.classList.add('task-card');
        el.setAttribute('draggable', 'true');
        el.dataset.id = task.id;
        el.dataset.column = columnKey;

        const dateStr = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date';

        el.innerHTML = `
            <span class="task-priority-badge badge-${task.priority}">${task.priority.toUpperCase()}</span>
            <button class="delete-task-btn" onclick="deleteTask('${task.id}', '${columnKey}', event)"><i class="fa-solid fa-trash"></i></button>
            <div class="task-title">${task.title}</div>
            ${task.desc ? `<div class="task-desc">${task.desc}</div>` : ''}
            <div class="task-footer">
                <span><i class="fa-regular fa-calendar"></i> ${dateStr}</span>
            </div>
        `;

        // Drag events
        el.addEventListener('dragstart', handleDragStart);
        el.addEventListener('dragend', handleDragEnd);

        return el;
    }

    // --- Modal Logic ---

    if(addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            taskModal.style.display = 'block';
        });

        closeBtn.addEventListener('click', () => {
            taskModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target == taskModal) {
                taskModal.style.display = 'none';
            }
        });

        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const title = document.getElementById('task-title').value;
            const desc = document.getElementById('task-desc').value;
            const priority = document.getElementById('task-priority').value;
            const dueDate = document.getElementById('task-due').value;

            const newTask = {
                id: generateId(),
                title,
                desc,
                priority,
                dueDate
            };

            // Add to default 'todo' column
            kanbanData.todo.push(newTask);
            saveData();
            renderBoard();

            // Reset and close
            taskForm.reset();
            taskModal.style.display = 'none';
        });
    }

    // --- Drag & Drop Logic ---

    function handleDragStart(e) {
        draggedTask = this;
        draggedSourceColumn = this.dataset.column;
        setTimeout(() => this.classList.add('dragging'), 0);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.dataset.id);
    }

    function handleDragEnd() {
        this.classList.remove('dragging');
        columns.forEach(col => {
            col.querySelector('.task-list').classList.remove('drag-over');
        });
    }

    columns.forEach(column => {
        const list = column.querySelector('.task-list');
        
        list.addEventListener('dragover', e => {
            e.preventDefault();
            list.classList.add('drag-over');
            
            const afterElement = getDragAfterElement(list, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (afterElement == null) {
                list.appendChild(draggable);
            } else {
                list.insertBefore(draggable, afterElement);
            }
        });

        list.addEventListener('dragleave', e => {
            list.classList.remove('drag-over');
        });

        list.addEventListener('drop', e => {
            e.preventDefault();
            list.classList.remove('drag-over');
            
            const taskId = e.dataTransfer.getData('text/plain');
            const targetColumn = column.dataset.column;
            
            if(draggedSourceColumn !== targetColumn) {
                // Move in data state
                const taskIndex = kanbanData[draggedSourceColumn].findIndex(t => t.id === taskId);
                const taskObj = kanbanData[draggedSourceColumn].splice(taskIndex, 1)[0];
                
                // For simplicity, just pushing to the end of the array here.
                // Reordering logic can be added later by checking DOM siblings.
                kanbanData[targetColumn].push(taskObj);
                
                // Update DOM dataset
                draggedTask.dataset.column = targetColumn;
                
                saveData();
            }
        });
    });

    // Helper for drag position
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task-card:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // --- Expose Delete Function globally ---
    window.deleteTask = function(taskId, columnKey, e) {
        e.stopPropagation();
        if(confirm('Delete this task?')) {
            kanbanData[columnKey] = kanbanData[columnKey].filter(t => t.id !== taskId);
            saveData();
            renderBoard();
        }
    }

    // Initial render
    renderBoard();
}
