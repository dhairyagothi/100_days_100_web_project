document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cdDays = document.getElementById('cd-days');
    const cdHours = document.getElementById('cd-hours');
    const cdMins = document.getElementById('cd-mins');
    const nextExamTitle = document.getElementById('next-exam-title');

    const addTaskBtn = document.getElementById('add-task-btn');
    const taskInputGroup = document.getElementById('task-input-group');
    const saveTaskBtn = document.getElementById('save-task-btn');
    const newTaskInput = document.getElementById('new-task-input');
    const taskList = document.getElementById('task-list');
    const taskEmptyState = document.getElementById('task-empty-state');

    const addExamBtn = document.getElementById('add-exam-btn');
    const examInputGroup = document.getElementById('exam-input-group');
    const saveExamBtn = document.getElementById('save-exam-btn');
    const newExamName = document.getElementById('new-exam-name');
    const newExamDate = document.getElementById('new-exam-date');
    const examList = document.getElementById('exam-list');

    // State
    let tasks = JSON.parse(localStorage.getItem('study_tasks')) || [];
    let exams = JSON.parse(localStorage.getItem('study_exams')) || [];
    let countdownInterval;

    // --- Tasks Logic ---
    addTaskBtn.addEventListener('click', () => {
        taskInputGroup.classList.toggle('hidden');
        newTaskInput.focus();
    });

    saveTaskBtn.addEventListener('click', () => {
        const text = newTaskInput.value.trim();
        if (text) {
            tasks.push({ id: Date.now().toString(), text, completed: false });
            saveTasks();
            renderTasks();
            newTaskInput.value = '';
            taskInputGroup.classList.add('hidden');
        }
    });

    taskList.addEventListener('click', (e) => {
        const id = e.target.closest('li')?.dataset.id;
        if (!id) return;

        if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
            tasks = tasks.filter(t => t.id !== id);
        } else if (e.target.classList.contains('task-checkbox')) {
            const task = tasks.find(t => t.id === id);
            if (task) task.completed = e.target.checked;
        }
        
        saveTasks();
        renderTasks();
    });

    function saveTasks() {
        localStorage.setItem('study_tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        if (tasks.length === 0) {
            taskEmptyState.classList.remove('hidden');
        } else {
            taskEmptyState.classList.add('hidden');
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `task-item ${task.completed ? 'completed' : ''}`;
                li.dataset.id = task.id;
                li.innerHTML = `
                    <div class="task-info">
                        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                        <span>${task.text}</span>
                    </div>
                    <button class="delete-btn"><i class="ph ph-trash"></i></button>
                `;
                taskList.appendChild(li);
            });
        }
    }

    // --- Exams Logic ---
    addExamBtn.addEventListener('click', () => {
        examInputGroup.classList.toggle('hidden');
    });

    saveExamBtn.addEventListener('click', () => {
        const name = newExamName.value.trim();
        const date = newExamDate.value;
        
        if (name && date) {
            exams.push({ id: Date.now().toString(), name, date });
            saveExams();
            renderExams();
            updateCountdown();
            newExamName.value = '';
            newExamDate.value = '';
            examInputGroup.classList.add('hidden');
        }
    });

    examList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
            const id = e.target.closest('.exam-item').dataset.id;
            exams = exams.filter(ex => ex.id !== id);
            saveExams();
            renderExams();
            updateCountdown();
        }
    });

    function saveExams() {
        localStorage.setItem('study_exams', JSON.stringify(exams));
    }

    function renderExams() {
        examList.innerHTML = '';
        
        // Sort by closest date
        const sortedExams = [...exams].sort((a, b) => new Date(a.date) - new Date(b.date));

        sortedExams.forEach(exam => {
            const dateObj = new Date(exam.date);
            const dateStr = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
            const timeStr = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

            const div = document.createElement('div');
            div.className = 'exam-item';
            div.dataset.id = exam.id;
            div.style.marginBottom = '0.75rem';
            div.innerHTML = `
                <div>
                    <h4 style="color: var(--accent-blue); margin-bottom: 0.25rem;">${exam.name}</h4>
                    <span style="font-size: 0.85rem; color: var(--text-muted);"><i class="ph ph-calendar"></i> ${dateStr} at ${timeStr}</span>
                </div>
                <button class="delete-btn"><i class="ph ph-trash"></i></button>
            `;
            examList.appendChild(div);
        });
    }

    // --- Countdown Logic ---
    function updateCountdown() {
        clearInterval(countdownInterval);

        // Find the next upcoming exam
        const now = new Date();
        const upcomingExams = exams.filter(ex => new Date(ex.date) > now);
        
        if (upcomingExams.length === 0) {
            nextExamTitle.textContent = "No Upcoming Exams";
            cdDays.textContent = "00";
            cdHours.textContent = "00";
            cdMins.textContent = "00";
            return;
        }

        upcomingExams.sort((a, b) => new Date(a.date) - new Date(b.date));
        const nextExam = upcomingExams[0];
        const examDate = new Date(nextExam.date);

        nextExamTitle.textContent = nextExam.name;

        function calcTime() {
            const current = new Date();
            const diff = examDate - current;

            if (diff <= 0) {
                clearInterval(countdownInterval);
                updateCountdown(); // Check for the next one
                return;
            }

            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            cdDays.textContent = d < 10 ? '0' + d : d;
            cdHours.textContent = h < 10 ? '0' + h : h;
            cdMins.textContent = m < 10 ? '0' + m : m;
        }

        calcTime();
        countdownInterval = setInterval(calcTime, 60000); // Update every minute
    }

    // Init
    renderTasks();
    renderExams();
    updateCountdown();
});
