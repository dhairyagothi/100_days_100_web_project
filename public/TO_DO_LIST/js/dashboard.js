/* ============================================================
   TASKFLOW — Dashboard Logic
   ============================================================ */

// Authentication Check
const user = sessionStorage.getItem('taskflow_user');
if (!user) {
  window.location.href = '../index.html';
} else {
  document.getElementById('user-display').innerText = user;
}

function logout() {
  sessionStorage.removeItem('taskflow_user');
  window.location.href = '../index.html';
}

// State
let tasks = JSON.parse(localStorage.getItem('taskflow_tasks')) || [];
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
  
  // Enter key support for task input
  const input = document.getElementById('task-input');
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });
});

function addTask() {
  const input = document.getElementById('task-input');
  const cat = document.getElementById('task-category');
  
  if (!input.value.trim()) {
    input.style.borderColor = 'var(--accent-red)';
    setTimeout(() => input.style.borderColor = 'transparent', 1000);
    return;
  }

  const newTask = {
    id: Date.now().toString(),
    text: input.value.trim(),
    category: cat.value,
    done: false
  };

  tasks.unshift(newTask);
  saveData();
  renderTasks();
  
  input.value = '';
  cat.value = '';
  showToast('Task added successfully!');
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    saveData();
    renderTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveData();
  renderTasks();
  showToast('Task deleted.');
}

function clearCompleted() {
  const doneCount = tasks.filter(t => t.done).length;
  if (doneCount === 0) return showToast('No completed tasks found.');
  
  tasks = tasks.filter(t => !t.done);
  saveData();
  renderTasks();
  showToast(`${doneCount} tasks cleared.`);
}

function setFilter(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById('task-list');
  list.innerHTML = '';

  let filtered = tasks;
  if (currentFilter === 'active') filtered = tasks.filter(t => !t.done);
  if (currentFilter === 'done') filtered = tasks.filter(t => t.done);

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-list-check"></i>
        <p>Your task list is empty. Time to relax or add a new task!</p>
      </div>
    `;
  } else {
    filtered.forEach(t => {
      const item = document.createElement('div');
      item.className = `task-item ${t.done ? 'done' : ''}`;
      
      const tagHtml = t.category ? `<span class="tag ${t.category}">${t.category}</span>` : '';
      
      item.innerHTML = `
        <div class="task-content">
          <div class="checkbox" onclick="toggleTask('${t.id}')"></div>
          <div>
            <div class="task-text">${escapeHtml(t.text)}</div>
            ${tagHtml}
          </div>
        </div>
        <button class="del-btn" onclick="deleteTask('${t.id}')"><i class="fa-solid fa-trash-can"></i></button>
      `;
      list.appendChild(item);
    });
  }

  updateStats();
}

function updateStats() {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const pending = total - done;

  document.getElementById('stat-total').innerText = total;
  document.getElementById('stat-done').innerText = done;
  document.getElementById('stat-pend').innerText = pending;

  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  document.getElementById('progress-fill').style.width = `${pct}%`;
  document.getElementById('progress-text').innerText = `${pct}%`;
}

function saveData() {
  localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function showToast(msg) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-bell" style="color:var(--primary-color)"></i> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 3000);
}

/* --- PDF Export --- */
function exportPDF() {
  if (tasks.length === 0) return showToast('No tasks to export!');
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.text("TaskFlow - Your Dashboard Report", 20, 20);
  
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 28);
  doc.line(20, 32, 190, 32);
  
  doc.setFontSize(12);
  let y = 42;
  
  tasks.forEach((t, i) => {
    if (y > 270) { doc.addPage(); y = 20; }
    const status = t.done ? "[x]" : "[ ]";
    const cat = t.category ? `(${t.category})` : "";
    doc.text(`${status} ${i+1}. ${t.text} ${cat}`, 20, y);
    y += 10;
  });

  doc.save(`TaskFlow_Report_${Date.now()}.pdf`);
  showToast('PDF Exported Successfully!');
}
