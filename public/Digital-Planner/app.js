import { STICKERS } from './stickers.js';
import { plannerAudio } from './audio.js';

class CozyPlannerApp {
  constructor() {
    // Check if we need to clean up previous session default data for a fresh first-time user experience
    const isCleaned = localStorage.getItem('cozy_planner_first_time_cleaned');
    if (!isCleaned) {
      localStorage.removeItem('cozy_planner_timetable');
      localStorage.removeItem('cozy_planner_timetable_title');
      localStorage.removeItem('cozy_planner_tasks');
      localStorage.removeItem('cozy_planner_notes');
      localStorage.removeItem('cozy_planner_stickers');
      localStorage.setItem('cozy_planner_first_time_cleaned', 'true');
    }

    // Current date values
    this.today = new Date();
    this.selectedDate = this.formatDate(this.today);

    // Calendar view state
    this.viewMonth = this.today.getMonth();
    this.viewYear = this.today.getFullYear();

    // Timetable state
    this.viewMode = 'calendar'; // 'calendar' or 'timetable'

    // Check if the saved timetable title is standard default and migrate it to clean English
    let savedTitle = localStorage.getItem('cozy_planner_timetable_title');
    if (
      !savedTitle ||
      savedTitle.includes('2026') ||
      savedTitle.includes('3학년') ||
      savedTitle.includes('Grade') ||
      savedTitle.includes('Semester') ||
      savedTitle === 'My Timetable' ||
      savedTitle === 'My Time Table'
    ) {
      savedTitle = 'My TimeTable';
      localStorage.setItem('cozy_planner_timetable_title', savedTitle);
    }
    this.timetableTitle = savedTitle;

    this.timetableData = JSON.parse(localStorage.getItem('cozy_planner_timetable'));

    if (!this.timetableData) {
      this.timetableData = this.getDefaultTimetable();
      localStorage.setItem('cozy_planner_timetable', JSON.stringify(this.timetableData));
    }

    // App State (loaded from localStorage or defaults)
    this.tasks = JSON.parse(localStorage.getItem('cozy_planner_tasks')) || {};
    this.notes = JSON.parse(localStorage.getItem('cozy_planner_notes')) || {};
    this.placedStickers = JSON.parse(localStorage.getItem('cozy_planner_stickers')) || [];

    // Clean up old placed stickers that belong to deleted SVG library
    const validIds = STICKERS.map(s => s.id);
    const initialStickerCount = this.placedStickers.length;
    this.placedStickers = this.placedStickers.filter(st => validIds.includes(st.stickerId));
    if (this.placedStickers.length !== initialStickerCount) {
      localStorage.setItem('cozy_planner_stickers', JSON.stringify(this.placedStickers));
    }

    this.theme = localStorage.getItem('cozy_planner_theme') || 'custard';
    this.isMuted = JSON.parse(localStorage.getItem('cozy_planner_muted')) || false;

    // Sticker placing & relative drag states
    this.activePlacingStickerId = null;
    this.draggedStickerElement = null;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.dragStartLeft = 0;
    this.dragStartTop = 0;
    this.scratchThrottleTimer = null;

    // Timetable edit modal state
    this.editingCellKey = null;
    this.editingCellColor = 'pink';

    // DOM selectors
    this.prevMonthBtn = document.getElementById('prev-month-btn');
    this.nextMonthBtn = document.getElementById('next-month-btn');
    this.monthNameLabel = document.getElementById('calendar-month-name');
    this.yearLabel = document.getElementById('calendar-year-label');
    this.daysGrid = document.getElementById('calendar-days-grid');
    this.selectedDayLabel = document.getElementById('selected-day-label');

    this.checklistItemsList = document.getElementById('checklist-items');
    this.addTaskForm = document.getElementById('add-task-form');
    this.newTaskInput = document.getElementById('new-task-input');

    this.dailyNotesInput = document.getElementById('daily-notes-input');
    this.clearPageBtn = document.getElementById('clear-page-btn');
    this.soundToggleBtn = document.getElementById('sound-toggle-btn');

    this.themeWashiTabs = document.querySelectorAll('.washi-tab');
    this.notebookSpread = document.getElementById('notebook-spread');

    // Floating Sticker Picker Popover
    this.stickersToggleBtn = document.getElementById('stickers-toggle-btn');
    this.stickerPickerPopover = document.getElementById('sticker-picker-popover');
    this.popoverStickersList = document.getElementById('popover-stickers-list');
    this.closePopoverBtn = document.getElementById('close-popover-btn');
    this.pendingPlacementX = 50;
    this.pendingPlacementY = 50;

    // View toggles
    this.toggleCalendarBtn = document.getElementById('toggle-calendar-btn');
    this.toggleTimetableBtn = document.getElementById('toggle-timetable-btn');
    this.calendarViewContainer = document.getElementById('calendar-view-container');
    this.timetableViewContainer = document.getElementById('timetable-view-container');
    this.timetableBannerText = document.getElementById('timetable-banner-text');

    // Timetable Modal selectors
    this.timetableModal = document.getElementById('timetable-modal');
    this.timetableCellInfo = document.getElementById('timetable-cell-info');
    this.timetableSubjectInput = document.getElementById('timetable-subject-input');
    this.saveTimetableBtn = document.getElementById('save-timetable-btn');
    this.closeTimetableBtn = document.getElementById('close-timetable-btn');
    this.markerColorButtons = document.querySelectorAll('.marker-color-btn');

    this.init();
  }

  init() {
    this.initTheme();
    this.initSoundUI();
    this.renderPopoverStickerList();
    this.renderCalendar();
    this.renderTimetable();
    this.loadDayData(this.selectedDate);
    this.renderAllStickers();
    this.initEvents();
  }

  initTheme() {
    document.body.className = `theme-${this.theme}`;
    this.themeWashiTabs.forEach(tab => {
      if (tab.dataset.theme === this.theme) tab.classList.add('active');
      else tab.classList.remove('active');
    });
  }

  initSoundUI() {
    plannerAudio.setMute(this.isMuted);
    this.soundToggleBtn.textContent = this.isMuted ? "🔇" : "🔊";
  }

  initEvents() {
    // Calendar navigation
    this.prevMonthBtn.addEventListener('click', () => this.navigateMonth(-1));
    this.nextMonthBtn.addEventListener('click', () => this.navigateMonth(1));

    // Theme tabs
    this.themeWashiTabs.forEach(tab => {
      tab.addEventListener('click', () => this.changeTheme(tab.dataset.theme));
    });

    // Task submit
    this.addTaskForm.addEventListener('submit', (e) => this.handleAddTask(e));

    // Key writing sound triggers
    this.newTaskInput.addEventListener('keydown', () => this.triggerTypeSound());
    this.dailyNotesInput.addEventListener('keydown', () => this.triggerTypeSound());

    // Notes saving on input change
    this.dailyNotesInput.addEventListener('input', () => this.saveNotes());

    // Sound and clear controllers
    this.soundToggleBtn.addEventListener('click', () => this.toggleSound());
    this.clearPageBtn.addEventListener('click', () => this.clearCurrentDay());

    // Sticker placements & picker popover visibility
    this.notebookSpread.addEventListener('click', (e) => this.handleNotebookClick(e));

    this.stickersToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = this.notebookSpread.getBoundingClientRect();
      const clientX = rect.left + rect.width / 2;
      const clientY = rect.top + rect.height / 2;
      this.pendingPlacementX = 50;
      this.pendingPlacementY = 50;
      this.openStickerPicker(clientX, clientY);
    });

    this.closePopoverBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeStickerPicker();
    });

    document.addEventListener('click', (e) => {
      if (this.stickerPickerPopover.classList.contains('active') && !e.target.closest('#sticker-picker-popover') && !e.target.closest('#stickers-toggle-btn')) {
        this.closeStickerPicker();
      }
    });

    // Document stickers drags handlers (Relative Delta logic)
    document.addEventListener('mousemove', (e) => this.handleStickerDrag(e));
    document.addEventListener('mouseup', () => this.stopStickerDrag());
    document.addEventListener('touchmove', (e) => this.handleStickerDrag(e), { passive: false });
    document.addEventListener('touchend', () => this.stopStickerDrag());

    // View toggling (Calendar vs Timetable)
    this.toggleCalendarBtn.addEventListener('click', () => this.setViewMode('calendar'));
    this.toggleTimetableBtn.addEventListener('click', () => this.setViewMode('timetable'));

    // Timetable cell click triggers
    const cells = document.querySelectorAll('.timetable-cell');
    cells.forEach(cell => {
      cell.addEventListener('click', () => {
        const day = cell.dataset.day;
        const period = cell.dataset.period;
        this.openTimetableEditor(day, period);
      });
    });

    // Timetable modal handlers
    this.closeTimetableBtn.addEventListener('click', () => this.closeTimetableEditor());
    this.saveTimetableBtn.addEventListener('click', () => this.saveTimetableEntry());

    this.markerColorButtons.forEach(btn => {
      btn.addEventListener('click', () => this.selectMarkerColor(btn.dataset.color));
    });

    // Timetable banner editing
    this.timetableBannerText.addEventListener('blur', () => {
      this.timetableTitle = this.timetableBannerText.textContent.trim() || 'Timetable';
      localStorage.setItem('cozy_planner_timetable_title', this.timetableTitle);
      plannerAudio.playPenScratch();
    });
    this.timetableBannerText.addEventListener('keydown', (e) => {
      this.triggerTypeSound();
      if (e.key === 'Enter') {
        e.preventDefault();
        this.timetableBannerText.blur();
      }
    });
  }

  getDefaultTimetable() {
    return {};
  }

  formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  navigateMonth(direction) {
    plannerAudio.playPageFlip();
    this.viewMonth += direction;
    if (this.viewMonth < 0) {
      this.viewMonth = 11;
      this.viewYear--;
    } else if (this.viewMonth > 11) {
      this.viewMonth = 0;
      this.viewYear++;
    }
    this.renderCalendar();
  }

  changeTheme(newTheme) {
    this.theme = newTheme;
    localStorage.setItem('cozy_planner_theme', newTheme);
    this.initTheme();
    plannerAudio.playPageFlip();
  }

  toggleSound() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('cozy_planner_muted', this.isMuted);
    this.initSoundUI();

    if (!this.isMuted) {
      plannerAudio.playPenScratch();
    }
  }

  triggerTypeSound() {
    if (this.scratchThrottleTimer) return;
    plannerAudio.playPenScratch();
    this.scratchThrottleTimer = setTimeout(() => {
      this.scratchThrottleTimer = null;
    }, 120);
  }

  setViewMode(mode) {
    if (this.viewMode === mode) return;

    this.viewMode = mode;
    plannerAudio.playPageFlip();

    if (mode === 'calendar') {
      this.toggleCalendarBtn.classList.add('active');
      this.toggleTimetableBtn.classList.remove('active');
      this.calendarViewContainer.style.display = 'block';
      this.timetableViewContainer.style.display = 'none';
    } else {
      this.toggleCalendarBtn.classList.remove('active');
      this.toggleTimetableBtn.classList.add('active');
      this.calendarViewContainer.style.display = 'none';
      this.timetableViewContainer.style.display = 'flex';
      this.renderTimetable();
    }
  }

  // Monthly Calendar Grid Generator
  renderCalendar() {
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    this.monthNameLabel.textContent = monthNames[this.viewMonth];
    this.yearLabel.textContent = this.viewYear;

    this.daysGrid.innerHTML = "";

    const firstDayIndex = new Date(this.viewYear, this.viewMonth, 1).getDay();
    const shiftedStartDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const totalDays = new Date(this.viewYear, this.viewMonth + 1, 0).getDate();
    const prevMonthDays = new Date(this.viewYear, this.viewMonth, 0).getDate();

    // Previous month padding
    for (let i = shiftedStartDay - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const prevMonth = this.viewMonth === 0 ? 11 : this.viewMonth - 1;
      const prevYear = this.viewMonth === 0 ? this.viewYear - 1 : this.viewYear;
      this.createDayCell(dayNum, prevMonth, prevYear, true);
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      this.createDayCell(d, this.viewMonth, this.viewYear, false);
    }

    // Next month padding days to reach 42 grid cells
    const currentCells = this.daysGrid.children.length;
    const remainingCells = 42 - currentCells;
    for (let n = 1; n <= remainingCells; n++) {
      const nextMonth = this.viewMonth === 11 ? 0 : this.viewMonth + 1;
      const nextYear = this.viewMonth === 11 ? this.viewYear + 1 : this.viewYear;
      this.createDayCell(n, nextMonth, nextYear, true);
    }
  }

  createDayCell(day, month, year, isOtherMonth) {
    const cellDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const cell = document.createElement('div');
    cell.className = 'day-cell handdrawn-border';
    if (isOtherMonth) cell.classList.add('other-month');
    if (cellDateStr === this.selectedDate) cell.classList.add('selected');

    cell.innerHTML = `
      <span class="day-number">${day}</span>
      <div class="cell-lines"></div>
    `;

    const dayTasks = this.tasks[cellDateStr] || [];
    if (dayTasks.length > 0) {
      const hasUnfinished = dayTasks.some(t => !t.completed);
      const indicator = document.createElement('span');
      indicator.className = 'cell-indicator';
      indicator.textContent = hasUnfinished ? "🌸" : "✓";
      cell.appendChild(indicator);
    }

    cell.addEventListener('click', () => this.selectDate(cellDateStr));
    this.daysGrid.appendChild(cell);
  }

  selectDate(dateStr) {
    if (this.selectedDate === dateStr) return;

    plannerAudio.playPageFlip();
    this.selectedDate = dateStr;

    this.renderCalendar();
    this.loadDayData(dateStr);
  }

  loadDayData(dateStr) {
    const dateObj = new Date(dateStr + "T00:00:00");
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    this.selectedDayLabel.textContent = dateObj.toLocaleDateString('en-US', options);

    this.renderChecklist();
    this.dailyNotesInput.value = this.notes[dateStr] || "";
  }

  renderChecklist() {
    this.checklistItemsList.innerHTML = "";
    const dayTasks = this.tasks[this.selectedDate] || [];

    dayTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-item';
      if (task.completed) li.classList.add('completed');

      li.innerHTML = `
        <div class="handdrawn-checkbox"></div>
        <span class="task-text">${task.text}</span>
        <button class="delete-task-btn" title="Delete Task">🗑️</button>
      `;

      li.querySelector('.handdrawn-checkbox').addEventListener('click', () => this.toggleTaskCompletion(task.id));
      li.querySelector('.task-text').addEventListener('click', () => this.toggleTaskCompletion(task.id));
      li.querySelector('.delete-task-btn').addEventListener('click', () => this.deleteTask(task.id));

      this.checklistItemsList.appendChild(li);
    });
  }

  handleAddTask(e) {
    e.preventDefault();
    const text = this.newTaskInput.value.trim();
    if (!text) return;

    if (!this.tasks[this.selectedDate]) {
      this.tasks[this.selectedDate] = [];
    }

    const newTask = {
      id: `task_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      text: text,
      completed: false
    };

    this.tasks[this.selectedDate].push(newTask);
    this.saveTasksToStorage();
    this.newTaskInput.value = "";

    plannerAudio.playPenScratch();
    this.renderChecklist();
    this.renderCalendar();
  }

  toggleTaskCompletion(taskId) {
    const dayTasks = this.tasks[this.selectedDate] || [];
    const task = dayTasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.saveTasksToStorage();

      plannerAudio.playPenScratch();
      this.renderChecklist();
      this.renderCalendar();
    }
  }

  deleteTask(taskId) {
    let dayTasks = this.tasks[this.selectedDate] || [];
    this.tasks[this.selectedDate] = dayTasks.filter(t => t.id !== taskId);

    if (this.tasks[this.selectedDate].length === 0) {
      delete this.tasks[this.selectedDate];
    }

    this.saveTasksToStorage();
    plannerAudio.playPenScratch();
    this.renderChecklist();
    this.renderCalendar();
  }

  saveTasksToStorage() {
    localStorage.setItem('cozy_planner_tasks', JSON.stringify(this.tasks));
  }

  saveNotes() {
    const notesText = this.dailyNotesInput.value;
    this.notes[this.selectedDate] = notesText;

    if (!notesText.trim()) {
      delete this.notes[this.selectedDate];
    }

    localStorage.setItem('cozy_planner_notes', JSON.stringify(this.notes));
  }

  clearCurrentDay() {
    if (confirm("Would you like to reset this page? This will clear all tasks, notes, and stickers for this date, and reset the timetable to default.")) {
      delete this.tasks[this.selectedDate];
      delete this.notes[this.selectedDate];
      this.saveTasksToStorage();
      localStorage.setItem('cozy_planner_notes', JSON.stringify(this.notes));

      this.placedStickers = this.placedStickers.filter(st => st.date !== this.selectedDate);
      localStorage.setItem('cozy_planner_stickers', JSON.stringify(this.placedStickers));

      // Reset timetable data and title to default
      this.timetableTitle = 'My TimeTable';
      localStorage.setItem('cozy_planner_timetable_title', this.timetableTitle);
      this.timetableData = this.getDefaultTimetable();
      localStorage.setItem('cozy_planner_timetable', JSON.stringify(this.timetableData));

      plannerAudio.playPageFlip();
      this.loadDayData(this.selectedDate);
      this.renderCalendar();
      this.renderAllStickers();
      this.renderTimetable();
    }
  }

  // TIMETABLE LOGIC
  renderTimetable() {
    this.timetableBannerText.textContent = this.timetableTitle;

    const cells = document.querySelectorAll('.timetable-cell');
    let hasEntries = false;
    cells.forEach(cell => {
      const day = cell.dataset.day;
      const period = cell.dataset.period;
      const key = `${day}-${period}`;
      const entry = this.timetableData[key];

      cell.innerHTML = "";
      if (entry && entry.text.trim()) {
        hasEntries = true;
        const span = document.createElement('span');
        span.className = 'marker-highlight';
        if (entry.color && entry.color !== 'none') {
          span.classList.add(`highlight-${entry.color}`);
        }
        span.textContent = entry.text;
        cell.appendChild(span);
      }
    });

    const hint = document.getElementById('timetable-hint-pointer');
    if (hint) {
      hint.style.display = hasEntries ? 'none' : 'flex';
    }
  }

  openTimetableEditor(day, period) {
    const key = `${day}-${period}`;
    this.editingCellKey = key;
    this.timetableCellInfo.textContent = `${day}, Period ${period}`;

    const entry = this.timetableData[key] || { text: "", color: "pink" };
    this.timetableSubjectInput.value = entry.text;
    this.selectMarkerColor(entry.color || 'pink');

    this.timetableModal.classList.add('active');
    plannerAudio.playPageFlip();

    // Autofocus input
    setTimeout(() => this.timetableSubjectInput.focus(), 150);
  }

  selectMarkerColor(color) {
    this.editingCellColor = color;

    this.markerColorButtons.forEach(btn => {
      if (btn.dataset.color === color) btn.classList.add('active');
      else btn.classList.remove('active');
    });
  }

  closeTimetableEditor() {
    this.timetableModal.classList.remove('active');
    this.editingCellKey = null;
    plannerAudio.playPageFlip();
  }

  saveTimetableEntry() {
    const text = this.timetableSubjectInput.value.trim();
    if (this.editingCellKey) {
      if (text) {
        this.timetableData[this.editingCellKey] = {
          text: text,
          color: this.editingCellColor
        };
      } else {
        delete this.timetableData[this.editingCellKey];
      }

      localStorage.setItem('cozy_planner_timetable', JSON.stringify(this.timetableData));
      plannerAudio.playPenScratch();
      this.renderTimetable();
      this.closeTimetableEditor();
    }
  }

  // STICKERS METHODS
  renderPopoverStickerList() {
    this.popoverStickersList.innerHTML = "";

    STICKERS.forEach(sticker => {
      const item = document.createElement('div');
      item.className = 'popover-sticker-item';
      item.dataset.stickerId = sticker.id;
      if (sticker.imgSrc) {
        item.innerHTML = `<img src="${sticker.imgSrc}" alt="${sticker.name}" style="width: 85%; height: 85%; object-fit: contain; -webkit-user-drag: none; pointer-events: none;" />`;
      } else {
        item.innerHTML = sticker.svg;
      }

      item.addEventListener('click', () => this.placePendingSticker(sticker.id));
      this.popoverStickersList.appendChild(item);
    });
  }

  openStickerPicker(clientX, clientY) {
    this.stickerPickerPopover.style.left = `${clientX}px`;
    this.stickerPickerPopover.style.top = `${clientY}px`;
    this.stickerPickerPopover.classList.add('active');
    plannerAudio.playPageFlip();
  }

  closeStickerPicker() {
    this.stickerPickerPopover.classList.remove('active');
  }

  placePendingSticker(stickerId) {
    const angle = Math.floor(Math.random() * 24) - 12;
    const stickerDef = STICKERS.find(s => s.id === stickerId);
    if (!stickerDef) return;

    const newPlacedSticker = {
      id: `placed_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      stickerId: stickerId,
      x: this.pendingPlacementX,
      y: this.pendingPlacementY,
      width: stickerDef.width,
      height: stickerDef.height,
      angle: angle,
      date: this.selectedDate
    };

    this.placedStickers.push(newPlacedSticker);
    localStorage.setItem('cozy_planner_stickers', JSON.stringify(this.placedStickers));

    plannerAudio.playPenScratch();
    this.renderPlacedSticker(newPlacedSticker);
    this.closeStickerPicker();
  }

  handleNotebookClick(e) {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea') || e.target.closest('.handdrawn-checkbox') || e.target.closest('.placed-sticker') || e.target.closest('.ring') || e.target.closest('.washi-tab')) {
      return;
    }

    const rect = this.notebookSpread.getBoundingClientRect();
    this.pendingPlacementX = ((e.clientX - rect.left) / rect.width) * 100;
    this.pendingPlacementY = ((e.clientY - rect.top) / rect.height) * 100;

    this.openStickerPicker(e.clientX, e.clientY);
  }

  renderAllStickers() {
    document.querySelectorAll('.placed-sticker').forEach(node => node.remove());

    const activeStickers = this.placedStickers.filter(st => st.date === this.selectedDate);
    activeStickers.forEach(sticker => this.renderPlacedSticker(sticker));
  }

  renderPlacedSticker(stickerConfig) {
    const stickerDef = STICKERS.find(s => s.id === stickerConfig.stickerId);
    if (!stickerDef) return;

    const div = document.createElement('div');
    div.id = stickerConfig.id;
    div.className = 'placed-sticker';
    div.style.left = `${stickerConfig.x}%`;
    div.style.top = `${stickerConfig.y}%`;
    div.style.width = `${stickerConfig.width || stickerDef.width}px`;
    div.style.height = `${stickerConfig.height || stickerDef.height}px`;
    div.style.transform = `translate(-50%, -50%) rotate(${stickerConfig.angle}deg)`;

    if (stickerDef.imgSrc) {
      div.innerHTML = `<img src="${stickerDef.imgSrc}" alt="${stickerDef.name}" style="width: 100%; height: 100%; object-fit: contain; -webkit-user-drag: none; pointer-events: none;" />`;
    } else {
      div.innerHTML = stickerDef.svg;
    }

    // Create and append delete handle
    const deleteBtn = document.createElement('div');
    deleteBtn.className = 'sticker-delete-handle';
    deleteBtn.textContent = '✕';
    deleteBtn.title = 'Peel off sticker';
    div.appendChild(deleteBtn);

    deleteBtn.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.deletePlacedSticker(stickerConfig.id);
    });

    deleteBtn.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.deletePlacedSticker(stickerConfig.id);
    });

    // Create and append resize handle
    const handle = document.createElement('div');
    handle.className = 'sticker-resize-handle';
    div.appendChild(handle);

    // Resize dragging listener
    let isResizing = false;
    let startWidth, startHeight, startX, startY;

    handle.addEventListener('mousedown', (e) => {
      e.stopPropagation(); // Prevent sticker drag
      e.preventDefault();
      isResizing = true;
      startWidth = parseFloat(div.style.width) || stickerDef.width;
      startHeight = parseFloat(div.style.height) || stickerDef.height;
      startX = e.clientX;
      startY = e.clientY;

      const handleResizeMove = (moveEvent) => {
        if (!isResizing) return;
        const dx = moveEvent.clientX - startX;
        const newWidth = Math.max(30, Math.min(300, startWidth + dx));
        const newHeight = newWidth * (startHeight / startWidth);

        div.style.width = `${newWidth}px`;
        div.style.height = `${newHeight}px`;
      };

      const handleResizeUp = () => {
        if (isResizing) {
          isResizing = false;
          stickerConfig.width = parseFloat(div.style.width);
          stickerConfig.height = parseFloat(div.style.height);
          localStorage.setItem('cozy_planner_stickers', JSON.stringify(this.placedStickers));

          document.removeEventListener('mousemove', handleResizeMove);
          document.removeEventListener('mouseup', handleResizeUp);
          plannerAudio.playPenScratch();
        }
      };

      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeUp);
    });

    handle.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      e.preventDefault();
      isResizing = true;
      startWidth = parseFloat(div.style.width) || stickerDef.width;
      startHeight = parseFloat(div.style.height) || stickerDef.height;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;

      const handleResizeTouchMove = (moveEvent) => {
        if (!isResizing) return;
        const dx = moveEvent.touches[0].clientX - startX;
        const newWidth = Math.max(30, Math.min(300, startWidth + dx));
        const newHeight = newWidth * (startHeight / startWidth);

        div.style.width = `${newWidth}px`;
        div.style.height = `${newHeight}px`;
      };

      const handleResizeTouchEnd = () => {
        if (isResizing) {
          isResizing = false;
          stickerConfig.width = parseFloat(div.style.width);
          stickerConfig.height = parseFloat(div.style.height);
          localStorage.setItem('cozy_planner_stickers', JSON.stringify(this.placedStickers));

          document.removeEventListener('touchmove', handleResizeTouchMove);
          document.removeEventListener('touchend', handleResizeTouchEnd);
          plannerAudio.playPenScratch();
        }
      };

      document.addEventListener('touchmove', handleResizeTouchMove, { passive: false });
      document.addEventListener('touchend', handleResizeTouchEnd);
    });

    div.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      this.deletePlacedSticker(stickerConfig.id);
    });

    const startDrag = (clientX, clientY) => {
      this.draggedStickerElement = div;
      this.isDragging = true;
      this.dragStartX = clientX;
      this.dragStartY = clientY;
      this.dragStartLeft = parseFloat(div.style.left) || stickerConfig.x;
      this.dragStartTop = parseFloat(div.style.top) || stickerConfig.y;

      div.classList.add('draggable-active');
    };

    div.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      startDrag(e.clientX, e.clientY);
    });

    div.addEventListener('touchstart', (e) => {
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    });

    this.notebookSpread.appendChild(div);
  }

  handleStickerDrag(e) {
    if (!this.isDragging || !this.draggedStickerElement) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const dx = clientX - this.dragStartX;
    const dy = clientY - this.dragStartY;

    const parentRect = this.notebookSpread.getBoundingClientRect();

    // Relative delta calculations
    const pctDx = (dx / parentRect.width) * 100;
    const pctDy = (dy / parentRect.height) * 100;

    const newLeft = this.dragStartLeft + pctDx;
    const newTop = this.dragStartTop + pctDy;

    const clampedX = Math.max(3, Math.min(97, newLeft));
    const clampedY = Math.max(3, Math.min(97, newTop));

    this.draggedStickerElement.style.left = `${clampedX}%`;
    this.draggedStickerElement.style.top = `${clampedY}%`;
  }

  stopStickerDrag() {
    if (!this.isDragging || !this.draggedStickerElement) return;

    this.isDragging = false;
    const divId = this.draggedStickerElement.id;
    const pctX = parseFloat(this.draggedStickerElement.style.left);
    const pctY = parseFloat(this.draggedStickerElement.style.top);

    const sticker = this.placedStickers.find(st => st.id === divId);
    if (sticker) {
      sticker.x = pctX;
      sticker.y = pctY;
      localStorage.setItem('cozy_planner_stickers', JSON.stringify(this.placedStickers));
    }

    this.draggedStickerElement.classList.remove('draggable-active');
    this.draggedStickerElement = null;

    plannerAudio.playPenScratch();
  }

  deletePlacedSticker(id) {
    this.placedStickers = this.placedStickers.filter(st => st.id !== id);
    localStorage.setItem('cozy_planner_stickers', JSON.stringify(this.placedStickers));

    const node = document.getElementById(id);
    if (node) node.remove();

    plannerAudio.playPageFlip();
  }
}

// Instantiate on load
window.addEventListener('DOMContentLoaded', () => {
  window.plannerApp = new CozyPlannerApp();
});
