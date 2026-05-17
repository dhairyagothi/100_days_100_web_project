let tasks = []
let currentFilter = 'all'

const CATEGORY_COLORS = {
  Work: '#FFDE59',
  Personal: '#FFC0CB',
  Urgent: '#FF6B6B',
  Fitness: '#B1EE99',
  Misc: '#CAB9F5',
}

const taskInput = document.getElementById('task-input');
const taskTypeSelect = document.getElementById('task-type-select')
const taskList = document.getElementById('task-list')
const statTotal = document.getElementById('stat-total')
const statDone = document.getElementById('stat-done')
const statPending = document.getElementById('stat-pending')
const progressFill = document.getElementById('progress-fill')
const progressPct = document.getElementById('progress-pct')
const documentsList = document.getElementById('documents-list')
const toast = document.getElementById('toast')

// home tab
function showHome() {
  document.getElementById('home-tab').style.display = 'block'
  document.getElementById('documents-tab').style.display = 'none'

  document.getElementById('btn-home').classList.add('active')
  document.getElementById('btn-docs').classList.remove('active')
}

// document tab
function showDocuments() {
  document.getElementById('home-tab').style.display = 'none'
  document.getElementById('documents-tab').style.display = 'block'

  document.getElementById('btn-home').classList.remove('active')
  document.getElementById('btn-docs').classList.add('active')
}

// theme
const theme_map = {
  sunset: '',
  ocean: 'theme-ocean',
  forest: 'theme-forest',
  midnight: 'theme-midnight',
  aurora: 'theme-aurora',
}

function applyTheme(theme, silent = false) {
  Object.values(theme_map).forEach(themeClass => {
    if (themeClass) {
      document.body.classList.remove(themeClass)
    }
  });
  if (theme_map[theme]) {
    document.body.classList.add(theme_map[theme])
  }
  document
    .querySelectorAll('.theme-swatch')
    .forEach(btn => btn.classList.remove('active'))
  const activeTheme = {
    sunset: 't1',
    ocean: 't2',
    forest: 't3',
    midnight: 't4',
    aurora: 't5',
  }
  const activeButton =
    document.getElementById(activeTheme[theme])
  if (activeButton) {
    activeButton.classList.add('active')
  }
  localStorage.setItem('taskflow-theme', theme)
  if (!silent) {
    showToast('Theme changed!')
  }
}

// add task
function addTask() {
  const text = taskInput.value.trim()
  if (!text) {
    showToast('Please type a task first!');
    taskInput.focus()
    return
  }
  const category = taskTypeSelect.value;
  const task = {
    id: Date.now(),
    text,
    category,
    done: false,
  }

  tasks.push(task)
  saveTasks()

  taskInput.value = ''
  taskTypeSelect.value = ''
  renderAll()
  showToast('Task added!')
}
function renderAll() {
  renderTasks()
  updateStats()
}
function renderTasks() {
  const visibleTasks = tasks.filter(task => {
    if (currentFilter === 'all') return true
    if (currentFilter === 'done') return task.done
    if (currentFilter === 'pending') return !task.done
    return task.category === currentFilter
  })

  taskList.innerHTML = ''

  if (visibleTasks.length === 0) {
    const emptyState = document.createElement('div')
    emptyState.className = 'empty-state'
    emptyState.innerHTML = `
      <div class="empty-icon">📋</div>
      <p>No tasks here. Add one above!</p>`
    taskList.appendChild(emptyState);
    return
  }

  visibleTasks.forEach(task => {
    const color =
      CATEGORY_COLORS[task.category] || 'rgba(255,255,255,0.2)'
    const card = document.createElement('div')
    card.className = `task-card ${task.done ? 'done' : ''}`
    card.dataset.id = task.id
    card.style.setProperty('--tag-color', color)
    card.innerHTML = `
      <div class="task-check ${task.done ? 'checked' : ''}">
        ${task.done ? '✓' : ''}
      </div>

      <span 
        class="task-text" 
        contenteditable="true" 
        spellcheck="false">
        ${escapeHTML(task.text)}
      </span>
      ${task.category
        ? `<span class="task-tag" style="background:${color}">
              ${task.category}
            </span>`
        : ''
      }

      <button class="task-del" aria-label="Delete task">
        ✕
      </button>`
    card
      .querySelector('.task-check')
      .addEventListener('click', () => {
        toggleDone(task.id)
      });

    // edit task 
    const textElement = card.querySelector('.task-text')

    textElement.addEventListener('blur', () => {
      const updatedText = textElement.textContent.trim()
      if (!updatedText) {
        textElement.textContent = task.text
        return
      }
      task.text = updatedText
      saveTasks()
    })

    // prevent newline on Enter
    textElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        textElement.blur()
      }
    });

    // delete task
    card
      .querySelector('.task-del')
      .addEventListener('click', () => {
        deleteTask(task.id)
      });

    taskList.appendChild(card)
  });
}

//task completion
function toggleDone(id) {
  const task = tasks.find(task => task.id === id);

  if (!task) return

  task.done = !task.done

  saveTasks()
  renderAll()

  showToast(
    task.done
      ? 'Task completed!'
      : 'Marked as pending'
  );
}

// Delete task
function deleteTask(id) {
  const card = taskList.querySelector(`[data-id="${id}"]`)

  if (card) {
    card.style.animation = 'fadeOut 0.25s ease forwards'

    card.addEventListener(
      'animationend',
      () => {
        tasks = tasks.filter(task => task.id !== id);

        saveTasks()
        renderAll()
      },
      { once: true }
    )
  }
}

function updateStats() {
  const total = tasks.length
  const done = tasks.filter(task => task.done).length
  const pending = total - done

  const percentage =
    total === 0 ? 0 : Math.round((done / total) * 100)

  statTotal.textContent = total
  statDone.textContent = done
  statPending.textContent = pending

  progressFill.style.width = `${percentage}%`
  progressPct.textContent = `${percentage}%`
}

// filter tasks
function filterTasks(button, filter) {
  currentFilter = filter

  document
    .querySelectorAll('.filter-btn')
    .forEach(btn => btn.classList.remove('active'))

  button.classList.add('active')
  renderTasks()
}

// clear completed tasks
function clearDone() {
  const completedCount = tasks.filter(task => task.done).length

  if (completedCount === 0) {
    showToast('No completed tasks to clear!')
    return
  }

  tasks = tasks.filter(task => !task.done)
  saveTasks()
  renderAll()
  showToast(`Cleared ${completedCount} completed task${completedCount > 1 ? 's' : ''}`)
}

// load saved 
window.addEventListener('DOMContentLoaded', () => {
  const savedTasks = localStorage.getItem('taskflow-tasks')

  if (savedTasks) {
    try {
      tasks = JSON.parse(savedTasks)
    } catch {
      tasks = []
    }
  }

  const savedTheme = localStorage.getItem('taskflow-theme') || 'sunset'
  applyTheme(savedTheme, true);
  renderAll()

  taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addTask()
    }
  })
})

function saveTasks() {
  localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
}

let toastTimer

function showToast(message) {
  toast.textContent = message
  toast.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800)
}

// save PDF
function saveAsPDF() {
  if (!tasks.length) {
    showToast('No tasks to export!')
    return
  }

  const { jsPDF } = window.jspdf

  const doc = new jsPDF()

  tasks.forEach((task, index) => {
    const status = task.done ? '[Done]' : '[Pending]'

    doc.text(
      `${index + 1}. ${task.text} ${status}`,
      10,
      20 + index * 10
    );
  });

  const fileName = `TaskFlow_${Date.now()}.pdf`
  doc.save(fileName)
  const fileURL = URL.createObjectURL(
    doc.output('blob')
  );
  addDocumentEntry(fileName, fileURL)
  showToast('PDF saved!')
}

function addDocumentEntry(fileName, fileURL) {
  const emptyState = documentsList.querySelector('.empty-state')

  if (emptyState) {
    emptyState.remove()
  }

  const item = document.createElement('div')
  item.className = 'doc-item'
  item.innerHTML = `
    <span class="doc-icon">📄</span>
    <div style="flex:1;">
      <div class="doc-name">${fileName}</div>
      <div class="doc-date">
        ${new Date().toLocaleString()}
      </div>
    </div>

    <div class="doc-actions">
      <button 
        class="doc-btn"
        onclick="window.open('${fileURL}','_blank')">
        View
      </button>

      <button 
        class="doc-btn"
        onclick="downloadDoc('${fileURL}','${fileName}')">
        Download
      </button>

      <button 
        class="doc-btn del"
        onclick="this.closest('.doc-item').remove()">
        Delete
      </button>
    </div>`

  documentsList.prepend(item);
}

// download PDF
function downloadDoc(url, fileName) {
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  link.click()
}

function escapeHTML(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}