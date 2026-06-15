// FILE UPLOADER - JavaScript

// Theme Toggle
function syncThemeIcon() {
  var theme = document.documentElement.getAttribute('data-theme') || 'dark';
  var icon = document.getElementById('themeIcon');
  if (icon) icon.textContent = theme === 'dark' ? '\uD83C\uDF19' : '\u2600\uFE0F';
}

syncThemeIcon();

var themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('fd-theme', next);
    syncThemeIcon();
  });
  themeToggle.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); themeToggle.click(); }
  });
}

// Upload Data (localStorage)
var STORAGE_KEY = 'fd-upload-data';

function loadData() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return { stats: { totalFiles: 0, totalSizeBytes: 0, largestFileBytes: 0, imageCount: 0 }, history: [] };
}

function saveData() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(uploadData)); } catch (_) {}
}

var uploadData = loadData();
var selectedFiles = [];

// Helpers
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Render Stats
function renderStats() {
  var s = uploadData.stats;
  var el = function (id) { return document.getElementById(id); };
  if (el('statTotalFiles'))  el('statTotalFiles').textContent  = s.totalFiles;
  if (el('statTotalSize'))   el('statTotalSize').textContent   = formatSize(s.totalSizeBytes);
  if (el('statLargestFile')) el('statLargestFile').textContent = formatSize(s.largestFileBytes);
  if (el('statImageCount'))  el('statImageCount').textContent  = s.imageCount;
}

// Render History
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
      '<span class="history-size">' + formatSize(item.size) + '</span>' +
      '<button class="history-remove" type="button" aria-label="Remove ' + escapeHtml(item.name) + '" data-idx="' + i + '" title="Remove">&times;</button>';
    list.appendChild(div);
  });

  list.querySelectorAll('.history-remove').forEach(function (btn) {
    btn.addEventListener('click', function () {
      removeHistoryItem(parseInt(this.getAttribute('data-idx'), 10));
    });
  });
}

// Remove history item and update stats
function removeHistoryItem(idx) {
  var removed = uploadData.history.splice(idx, 1)[0];
  if (!removed) return;

  uploadData.stats.totalFiles     = Math.max(0, uploadData.stats.totalFiles - 1);
  uploadData.stats.totalSizeBytes = Math.max(0, uploadData.stats.totalSizeBytes - removed.size);
  uploadData.stats.imageCount     = Math.max(0, uploadData.stats.imageCount - 1);

  uploadData.stats.largestFileBytes = uploadData.history.reduce(function (max, item) {
    return item.size > max ? item.size : max;
  }, 0);

  saveData();
  renderStats();
  renderHistory();
  showToast('"' + removed.name + '" removed from history', '\uD83D\uDDD1\uFE0F');
}

// Toast
function showToast(message, icon) {
  icon = icon || '\u2705';
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

// Drop Zone
var dropZone  = document.getElementById('dropZone');
var fileInput = document.getElementById('myFile');
var form      = document.getElementById('uploadForm');

if (dropZone && fileInput) {
  dropZone.addEventListener('click', function () { fileInput.click(); });
  dropZone.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
  });

  fileInput.addEventListener('change', function () {
    if (fileInput.files && fileInput.files.length > 0) {
      mergeAndPreview(Array.from(fileInput.files));
      fileInput.value = '';
    }
  });

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (evt) {
    dropZone.addEventListener(evt, function (e) { e.preventDefault(); e.stopPropagation(); });
  });
  dropZone.addEventListener('dragover',  function () { dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', function () { dropZone.classList.remove('dragover'); });
  dropZone.addEventListener('drop', function (e) {
    dropZone.classList.remove('dragover');
    var files = e.dataTransfer && e.dataTransfer.files;
    if (files && files.length > 0) mergeAndPreview(Array.from(files));
  });
}

// Validation & Preview
function mergeAndPreview(newFiles) {
  var allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  var maxSizeBytes = 2 * 1024 * 1024;
  for (var i = 0; i < newFiles.length; i++) {
    var f = newFiles[i];
    if (allowedTypes.indexOf(f.type) === -1) {
      showToast('"' + f.name + '" is not a supported type.', '\u26A0\uFE0F');
      return;
    }
    if (f.size > maxSizeBytes) {
      showToast('"' + f.name + '" exceeds 2MB (' + formatSize(f.size) + ').', '\u26A0\uFE0F');
      return;
    }
    var exists = selectedFiles.some(function (s) { return s.name === f.name; });
    if (!exists) selectedFiles.push(f);
  }
  rebuildPreview();
}

function rebuildPreview() {
  var preview = document.getElementById('file-preview');
  if (!preview) return;
  preview.innerHTML = '';
  if (selectedFiles.length === 0) {
    preview.style.display = 'none';
    resetDropZoneText();
    return;
  }
  preview.style.display = 'flex';
  selectedFiles.forEach(function (file, idx) {
    var chip = document.createElement('div');
    chip.className = 'file-chip';
    chip.setAttribute('role', 'listitem');
    chip.style.animationDelay = (idx * 0.06) + 's';
    chip.innerHTML =
      '<span class="chip-icon" aria-hidden="true">\uD83D\uDDBC\uFE0F</span>' +
      '<span class="chip-name" title="' + escapeHtml(file.name) + '">' + escapeHtml(file.name) + '</span>' +
      '<span class="chip-size">' + formatSize(file.size) + '</span>' +
      '<button class="chip-remove" type="button" aria-label="Remove ' + escapeHtml(file.name) + '" data-idx="' + idx + '" title="Remove">&times;</button>';
    preview.appendChild(chip);
  });
  preview.querySelectorAll('.chip-remove').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      removeFile(parseInt(this.getAttribute('data-idx'), 10));
    });
  });
  var count = selectedFiles.length;
  var dropText = dropZone && dropZone.querySelector('.drop-text');
  if (dropText) {
    dropText.innerHTML =
      '<strong>\u2713 ' + count + ' image' + (count > 1 ? 's' : '') + ' ready</strong>' +
      'Click to add more &mdash; use &times; to remove';
  }
}

function removeFile(idx) {
  var removed = selectedFiles.splice(idx, 1)[0];
  rebuildPreview();
  renderStats();
  showToast('"' + removed.name + '" removed', '\uD83D\uDDD1\uFE0F');
}

function resetDropZoneText() {
  var dropText = dropZone && dropZone.querySelector('.drop-text');
  if (dropText) {
    dropText.innerHTML =
      '<strong>Click to browse or drag &amp; drop</strong>' +
      'Supported: .jpg, .jpeg, .png, .webp &mdash; Max 2MB each';
  }
}

// Form Submit
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      showToast('Please select at least one image.', '\u26A0\uFE0F');
      return;
    }
    var firstName = document.getElementById('firstName').value.trim();
    var lastName  = document.getElementById('lastName').value.trim();
    if (!firstName || !lastName) {
      showToast('Please fill in your first and last name.', '\u26A0\uFE0F');
      return;
    }

    var fd = new FormData();
    fd.append('firstName', firstName);
    fd.append('lastName',  lastName);
    selectedFiles.forEach(function (file) { fd.append('myFile', file); });

    selectedFiles.forEach(function (file) {
      uploadData.stats.totalFiles     += 1;
      uploadData.stats.totalSizeBytes += file.size;
      uploadData.stats.imageCount     += 1;
      if (file.size > uploadData.stats.largestFileBytes) {
        uploadData.stats.largestFileBytes = file.size;
      }
      uploadData.history.unshift({ name: file.name, size: file.size, timestamp: Date.now() });
    });
    uploadData.history = uploadData.history.slice(0, 10);
    saveData();
    renderStats();
    renderHistory();

    var uploadedNames = selectedFiles.map(function (f) { return f.name; });

    fetch('http://localhost:3000/upload', { method: 'POST', body: fd })
      .then(function (res) {
        return res.text().then(function (html) {
          document.open(); document.write(html); document.close();
        });
      })
      .catch(function () {
        uploadedNames.forEach(function (name) { showToast(name + ' logged locally', '\u2705'); });
      });

    selectedFiles = [];
    var preview = document.getElementById('file-preview');
    if (preview) { preview.innerHTML = ''; preview.style.display = 'none'; }
    resetDropZoneText();
  });
}

// Init
renderStats();
renderHistory();