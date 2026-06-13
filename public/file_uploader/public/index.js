/* ============================================================
   FILE UPLOADER — JavaScript
   - Dark/Light theme toggle with localStorage persistence
   - Drag-and-drop file handling
   - File preview with validation
   - Upload statistics (localStorage)
   - Recent upload history (localStorage)
   - Toast notifications
   ============================================================ */

// ── Theme Toggle ──────────────────────────────────────────────
// Icon is synced on every page load (theme already applied by
// the inline <script> in <head> before paint).
function syncThemeIcon() {
  var theme = document.documentElement.getAttribute('data-theme') || 'dark';
  var icon  = document.getElementById('themeIcon');
  if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
}

syncThemeIcon(); // run immediately when JS loads

var themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme');
    var next    = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('fd-theme', next);
    syncThemeIcon();
  });

  themeToggle.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      themeToggle.click();
    }
  });
}

// ── Upload Data (localStorage) ────────────────────────────────
var STORAGE_KEY = 'fd-upload-data';

function loadData() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return {
    stats: { totalFiles: 0, totalSizeBytes: 0, largestFileBytes: 0, imageCount: 0 },
    history: []
  };
}

function saveData() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(uploadData)); } catch (_) {}
}

var uploadData = loadData();

// ── Helpers ───────────────────────────────────────────────────
function formatSize(bytes) {
  if (bytes < 1024)        return bytes + ' B';
  if (bytes < 1048576)     return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

// ── Render Stats ──────────────────────────────────────────────
function renderStats() {
  var s = uploadData.stats;
  var el = function (id) { return document.getElementById(id); };
  if (el('statTotalFiles'))  el('statTotalFiles').textContent  = s.totalFiles;
  if (el('statTotalSize'))   el('statTotalSize').textContent   = formatSize(s.totalSizeBytes);
  if (el('statLargestFile')) el('statLargestFile').textContent = formatSize(s.largestFileBytes);
  if (el('statImageCount'))  el('statImageCount').textContent  = s.imageCount;
}

// ── Render History ────────────────────────────────────────────
function renderHistory() {
  var list = document.getElementById('historyList');
  if (!list) return;

  if (!uploadData.history || uploadData.history.length === 0) {
    list.innerHTML = '<p class="empty-history">No uploads yet</p>';
    return;
  }

  list.innerHTML = '';
  uploadData.history.slice(0, 10).forEach(function (item, i) {
    var div = document.createElement('div');
    div.className = 'history-item';
    div.setAttribute('role', 'listitem');
    div.style.animationDelay = (i * 0.05) + 's';
    div.innerHTML =
      '<span class="history-name" title="' + escapeHtml(item.name) + '">' + escapeHtml(item.name) + '</span>' +
      '<span class="history-size">' + formatSize(item.size) + '</span>';
    list.appendChild(div);
  });
}

// ── Toast Notifications ───────────────────────────────────────
function showToast(message, icon) {
  icon = icon || '✅';
  var container = document.getElementById('toastContainer');
  if (!container) return;

  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'alert');
  toast.innerHTML =
    '<span class="toast-icon" aria-hidden="true">' + icon + '</span>' +
    '<span class="toast-message">' + escapeHtml(message) + '</span>';
  container.appendChild(toast);

  setTimeout(function () {
    toast.classList.add('fade-out');
    toast.addEventListener('animationend', function () { toast.remove(); }, { once: true });
  }, 3500);
}

// ── Drop Zone Logic ───────────────────────────────────────────
var dropZone  = document.getElementById('dropZone');
var fileInput = document.getElementById('myFile');
var form      = document.getElementById('uploadForm');

if (dropZone && fileInput) {
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (evt) {
    dropZone.addEventListener(evt, function (e) {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  dropZone.addEventListener('dragover',  function () { dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', function () { dropZone.classList.remove('dragover'); });

  dropZone.addEventListener('drop', function (e) {
    dropZone.classList.remove('dragover');
    var files = e.dataTransfer && e.dataTransfer.files;
    if (files && files.length > 0) {
      fileInput.files = files;
      showPreview(fileInput);
    }
  });

  dropZone.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });
}

// ── File Preview & Validation ─────────────────────────────────
function showPreview(input) {
  var preview = document.getElementById('file-preview');
  if (!preview) return;

  preview.innerHTML = '';

  if (!input.files || input.files.length === 0) {
    preview.style.display = 'none';
    return;
  }

  var allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  var maxSizeBytes = 2 * 1024 * 1024;

  for (var i = 0; i < input.files.length; i++) {
    var file = input.files[i];
    if (allowedTypes.indexOf(file.type) === -1) {
      alert('Unsupported file type! "' + file.name + '" is not a valid image.\nAllowed: .jpg, .jpeg, .png, .webp');
      input.value = '';
      preview.style.display = 'none';
      resetDropZoneText();
      return;
    }
    if (file.size > maxSizeBytes) {
      alert('File too large! "' + file.name + '" exceeds the 2MB limit.\nActual size: ' + formatSize(file.size));
      input.value = '';
      preview.style.display = 'none';
      resetDropZoneText();
      return;
    }
  }

  preview.style.display = 'flex';

  Array.from(input.files).forEach(function (file, idx) {
    var chip = document.createElement('div');
    chip.className = 'file-chip';
    chip.setAttribute('role', 'listitem');
    chip.style.animationDelay = (idx * 0.06) + 's';
    chip.innerHTML =
      '<span class="chip-icon" aria-hidden="true">🖼️</span>' +
      '<span class="chip-name" title="' + escapeHtml(file.name) + '">' + escapeHtml(file.name) + '</span>' +
      '<span class="chip-size">' + formatSize(file.size) + '</span>';
    preview.appendChild(chip);
  });

  var count    = input.files.length;
  var dropText = dropZone && dropZone.querySelector('.drop-text');
  if (dropText) {
    dropText.innerHTML =
      '<strong>✓ ' + count + ' image' + (count > 1 ? 's' : '') + ' ready</strong>' +
      'Click to change selection';
  }
}

function resetDropZoneText() {
  var dropText = dropZone && dropZone.querySelector('.drop-text');
  if (dropText) {
    dropText.innerHTML =
      '<strong>Click to browse or drag &amp; drop</strong>' +
      'Supported: .jpg, .jpeg, .png, .webp &mdash; Max 2MB each';
  }
}

// ── Form Submit ───────────────────────────────────────────────
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert('Please select at least one image file to upload.');
      return;
    }

    var uploadedNames = [];

    Array.from(fileInput.files).forEach(function (file) {
      uploadData.stats.totalFiles     += 1;
      uploadData.stats.totalSizeBytes += file.size;
      uploadData.stats.imageCount     += 1;
      if (file.size > uploadData.stats.largestFileBytes) {
        uploadData.stats.largestFileBytes = file.size;
      }
      uploadData.history.unshift({ name: file.name, size: file.size, timestamp: Date.now() });
      uploadedNames.push(file.name);
    });

    uploadData.history = uploadData.history.slice(0, 10);
    saveData();
    renderStats();
    renderHistory();

    uploadedNames.forEach(function (name) { showToast(name + ' uploaded', '✅'); });

    setTimeout(function () {
      if (fileInput) fileInput.value = '';
      var preview = document.getElementById('file-preview');
      if (preview) { preview.innerHTML = ''; preview.style.display = 'none'; }
      resetDropZoneText();
    }, 400);

    // To actually POST to server, replace e.preventDefault() above with form.submit() here:
    // form.submit();
  });
}

// ── Initial Render ────────────────────────────────────────────
renderStats();
renderHistory();