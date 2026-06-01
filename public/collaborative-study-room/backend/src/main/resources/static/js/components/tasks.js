// Session Checklist UI Component Handler
import { state, addTask, toggleTask, deleteTask } from '../state.js';

export function initTasksComponent() {
  const formAddTask = document.getElementById('form-add-task');
  const taskInput = document.getElementById('task-input');

  formAddTask.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return;

    addTask(text);
    taskInput.value = '';
  });
}

export function renderTasksView() {
  const listContainer = document.getElementById('room-task-list');
  const badge = document.getElementById('tasks-completed-badge');
  if (!listContainer || !state.activeRoom) return;

  const roomId = state.activeRoom.id;
  const tasks = state.tasks[roomId] || [];

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  badge.textContent = `${completedCount}/${totalCount}`;

  if (totalCount === 0) {
    listContainer.innerHTML = `
      <div class="no-tasks-msg">
        <p>No goals set for this session. Add one below!</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = tasks.map(task => {
    return `
      <div class="task-item ${task.completed ? 'completed' : ''}">
        <label class="task-checkbox-container">
          <input type="checkbox" class="chk-task-toggle" data-task-id="${task.id}" ${task.completed ? 'checked' : ''}>
          <span class="checkmark"></span>
          <span class="task-text">${formatTaskText(task.text)}</span>
        </label>
        <button class="btn-delete-task" data-task-id="${task.id}" title="Remove task">&times;</button>
      </div>
    `;
  }).join('');

  // Attach toggle listeners
  listContainer.querySelectorAll('.chk-task-toggle').forEach(input => {
    input.addEventListener('change', (e) => {
      const taskId = e.target.getAttribute('data-task-id');
      toggleTask(taskId);
    });
  });

  // Attach delete listeners
  listContainer.querySelectorAll('.btn-delete-task').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const taskId = e.target.getAttribute('data-task-id');
      deleteTask(taskId);
    });
  });
}

function formatTaskText(text) {
  // Prevent script injections
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
