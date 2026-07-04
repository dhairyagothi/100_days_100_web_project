// FILE UPLOADER - JavaScript (Enhanced with Multiple File Types)

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
  return { stats: { totalFiles: 0, totalSizeBytes: 0, largestFileBytes: 0, fileTypes: {} }, history: [] };
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

// NEW: File Type Detection & Icons
function getFileTypeInfo(file) {
  var type = file.type;
  var extension = file.name.split('.').pop().toLowerCase();
  
  var typeMap = {
    // Images
    'image/jpeg': { icon: 'fa-image', color: '#FF6B6B', label: 'JPEG', category: 'image' },
    'image/jpg': { icon: 'fa-image', color: '#FF6B6B', label: 'JPG', category: 'image' },
    'image/png': { icon: 'fa-image', color: '#4ECDC4', label: 'PNG', category: 'image' },
    'image/webp': { icon: 'fa-image', color: '#45B7D1', label: 'WEBP', category: 'image' },
    'image/gif': { icon: 'fa-image', color: '#96CEB4', label: 'GIF', category: 'image' },
    'image/svg+xml': { icon: 'fa-image', color: '#FFEAA7', label: 'SVG', category: 'image' },
    
    // Documents
    'application/pdf': { icon: 'fa-file-pdf', color: '#FF6B6B', label: 'PDF', category: 'document' },
    'application/msword': { icon: 'fa-file-word', color: '#4A90D9', label: 'DOC', category: 'document' },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: 'fa-file-word', color: '#4A90D9', label: 'DOCX', category: 'document' },
    'application/vnd.ms-excel': { icon: 'fa-file-excel', color: '#27AE60', label: 'XLS', category: 'document' },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: 'fa-file-excel', color: '#27AE60', label: 'XLSX', category: 'document' },
    'application/vnd.ms-powerpoint': { icon: 'fa-file-powerpoint', color: '#E67E22', label: 'PPT', category: 'document' },
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': { icon: 'fa-file-powerpoint', color: '#E67E22', label: 'PPTX', category: 'document' },
    'text/plain': { icon: 'fa-file-alt', color: '#95A5A6', label: 'TXT', category: 'document' },
    'text/csv': { icon: 'fa-file-csv', color: '#3498DB', label: 'CSV', category: 'document' },
    
    // Archives
    'application/zip': { icon: 'fa-file-archive', color: '#F39C12', label: 'ZIP', category: 'archive' },
    'application/x-rar-compressed': { icon: 'fa-file-archive', color: '#E67E22', label: 'RAR', category: 'archive' },
    'application/x-7z-compressed': { icon: 'fa-file-archive', color: '#8E44AD', label: '7Z', category: 'archive' },
    'application/gzip': { icon: 'fa-file-archive', color: '#2ECC71', label: 'GZ', category: 'archive' },
    'application/x-tar': { icon: 'fa-file-archive', color: '#1ABC9C', label: 'TAR', category: 'archive' },
    
    // Code
    'text/html': { icon: 'fa-code', color: '#E74C3C', label: 'HTML', category: 'code' },
    'text/css': { icon: 'fa-code', color: '#3498DB', label: 'CSS', category: 'code' },
    'application/javascript': { icon: 'fa-code', color: '#F1C40F', label: 'JS', category: 'code' },
    'application/json': { icon: 'fa-code', color: '#2ECC71', label: 'JSON', category: 'code' },
    
    // Video
    'video/mp4': { icon: 'fa-video', color: '#E74C3C', label: 'MP4', category: 'video' },
    'video/webm': { icon: 'fa-video', color: '#3498DB', label: 'WEBM', category: 'video' },
    'video/quicktime': { icon: 'fa-video', color: '#2ECC71', label: 'MOV', category: 'video' },
    
    // Audio
    'audio/mpeg': { icon: 'fa-music', color: '#F39C12', label: 'MP3', category: 'audio' },
    'audio/wav': { icon: 'fa-music', color: '#9B59B6', label: 'WAV', category: 'audio' },
    'audio/ogg': { icon: 'fa-music', color: '#1ABC9C', label: 'OGG', category: 'audio' }
  };
  
  // Fallback based on extension
  var extensionMap = {
    'pdf': { icon: 'fa-file-pdf', color: '#FF6B6B', label: 'PDF', category: 'document' },
    'doc': { icon: 'fa-file-word', color: '#4A90D9', label: 'DOC', category: 'document' },
    'docx': { icon: 'fa-file-word', color: '#4A90D9', label: 'DOCX', category: 'document' },
    'txt': { icon: 'fa-file-alt', color: '#95A5A6', label: 'TXT', category: 'document' },
    'zip': { icon: 'fa-file-archive', color: '#F39C12', label: 'ZIP', category: 'archive' },
    'rar': { icon: 'fa-file-archive', color: '#E67E22', label: 'RAR', category: 'archive' },
    '7z': { icon: 'fa-file-archive', color: '#8E44AD', label: '7Z', category: 'archive' },
    'csv': { icon: 'fa-file-csv', color: '#3498DB', label: 'CSV', category: 'document' },
    'xls': { icon: 'fa-file-excel', color: '#27AE60', label: 'XLS', category: 'document' },
    'xlsx': { icon: 'fa-file-excel', color: '#27AE60', label: 'XLSX', category: 'document' },
    'ppt': { icon: 'fa-file-powerpoint', color: '#E67E22', label: 'PPT', category: 'document' },
    'pptx': { icon: 'fa-file-powerpoint', color: '#E67E22', label: 'PPTX', category: 'document' },
    'html': { icon: 'fa-code', color: '#E74C3C', label: 'HTML', category: 'code' },
    'css': { icon: 'fa-code', color: '#3498DB', label: 'CSS', category: 'code' },
    'js': { icon: 'fa-code', color: '#F1C40F', label: 'JS', category: 'code' },
    'json': { icon: 'fa-code', color: '#2ECC71', label: 'JSON', category: 'code' },
    'mp4': { icon: 'fa-video', color: '#E74C3C', label: 'MP4', category: 'video' },
    'mp3': { icon: 'fa-music', color: '#F39C12', label: 'MP3', category: 'audio' }
  };
  
  var info = typeMap[type] || extensionMap[extension] || { 
    icon: 'fa-file', 
    color: '#95A5A6', 
    label: extension.toUpperCase() || 'FILE',
    category: 'other'
  };
  
  return info;
}

// NEW: Get file type badge HTML
function getFileTypeBadge(file, isHistory) {
  var info = getFileTypeInfo(file);
  var color = info.color;
  var label = info.label;
  var icon = info.icon;
  
  if (isHistory) {
    return '<span class="file-type-badge" style="background: ' + color + '33; color: ' + color + '; padding: 2px 8px; border-radius: 10px; font-size: 0.7rem; font-weight: 700; margin-left: 8px; flex-shrink: 0;">' + label + '</span>';
  }
  
  return '<span class="file-type-badge" style="background: ' + color + '33; color: ' + color + '; padding: 2px 8px; border-radius: 10px; font-size: 0.7rem; font-weight: 700; margin-left: 8px; flex-shrink: 0;">' + label + '</span>';
}

// Generate thumbnail for images
function generateThumbnail(file, callback) {
  if (!file.type.startsWith('image/')) {
    callback(null);
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var img = new Image();
    img.onload = function() {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var maxSize = 80;
      var width = img.width;
      var height = img.height;
      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Render Stats
function renderStats() {
  var s = uploadData.stats;
  var el = function (id) { return document.getElementById(id); };
  if (el('statTotalFiles'))  el('statTotalFiles').textContent  = s.totalFiles;
  if (el('statTotalSize'))   el('statTotalSize').textContent   = formatSize(s.totalSizeBytes);
  if (el('statLargestFile')) el('statLargestFile').textContent = formatSize(s.largestFileBytes);
  
  // NEW: Count unique file types
  if (el('statFileTypes')) {
    var typeCount = Object.keys(s.fileTypes || {}).length;
    el('statFileTypes').textContent = typeCount;
  }
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
    
    // Get file type info
    var fileObj = { name: item.name, type: item.type || '' };
    var info = getFileTypeInfo(fileObj);
    
    // Thumbnail or icon
    var thumbHtml = '';
    if (item.thumbnail) {
      thumbHtml = '<img src="' + item.thumbnail + '" alt="" class="history-thumb" style="width: 32px; height: 32px; object-fit: cover; border-radius: 4px; margin-right: 10px; flex-shrink: 0;">';
    } else {
      thumbHtml = '<i class="fas ' + info.icon + '" style="color: ' + info.color + '; font-size: 1.2rem; margin-right: 10px; flex-shrink: 0;"></i>';
    }
    
    div.innerHTML =
      '<div style="display: flex; align-items: center; flex: 1; min-width: 0;">' +
        thumbHtml +
        '<span class="history-name" title="' + escapeHtml(item.name) + '">' + escapeHtml(item.name) + '</span>' +
        '<span class="history-size">' + formatSize(item.size) + '</span>' +
        getFileTypeBadge(fileObj, true) +
      '</div>' +
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
  
  // Update file types count
  if (removed.type) {
    var info = getFileTypeInfo({ type: removed.type });
    var category = info.category || 'other';
    if (uploadData.stats.fileTypes && uploadData.stats.fileTypes[category]) {
      uploadData.stats.fileTypes[category] = Math.max(0, uploadData.stats.fileTypes[category] - 1);
      if (uploadData.stats.fileTypes[category] === 0) {
        delete uploadData.stats.fileTypes[category];
      }
    }
  }

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

// Update progress bar
function updateProgress(percent, text) {
  var container = document.getElementById('uploadProgressContainer');
  var bar = document.getElementById('progressBar');
  var percentage = document.getElementById('progressPercentage');
  var progressText = document.getElementById('progressText');
  
  if (percent === 100) {
    setTimeout(function() {
      container.style.display = 'none';
      bar.style.width = '0%';
      percentage.textContent = '0%';
    }, 1000);
    if (progressText) progressText.textContent = text || 'Complete! ✅';
  } else {
    container.style.display = 'block';
    if (bar) bar.style.width = percent + '%';
    if (percentage) percentage.textContent = percent + '%';
    if (progressText) progressText.textContent = text || 'Uploading...';
  }
}

// Export History as CSV
function exportHistoryCSV() {
  if (!uploadData.history || uploadData.history.length === 0) {
    showToast('No history to export', '\u26A0\uFE0F');
    return;
  }
  
  var headers = ['Name', 'Type', 'Size (bytes)', 'Size (formatted)', 'Date'];
  var rows = uploadData.history.map(function(item) {
    var date = new Date(item.timestamp);
    var formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    var info = getFileTypeInfo({ name: item.name, type: item.type || '' });
    return [item.name, info.label, item.size, formatSize(item.size), formattedDate];
  });
  
  var csvContent = headers.join(',') + '\n' + 
    rows.map(function(row) {
      return row.map(function(cell) {
        if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
          return '"' + cell.replace(/"/g, '""') + '"';
        }
        return cell;
      }).join(',');
    }).join('\n');
  
  var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  var link = document.createElement('a');
  var url = URL.createObjectURL(blob);
  link.href = url;
  link.download = 'upload_history_' + new Date().toISOString().split('T')[0] + '.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  showToast('History exported successfully!', '\u2705');
}

// Image Preview Modal
function openImagePreview(imageUrl, fileName, fileSize) {
  var modal = document.getElementById('imagePreviewModal');
  var modalImg = document.getElementById('modalImage');
  var modalInfo = document.getElementById('modalImageInfo');
  
  modalImg.src = imageUrl;
  modalInfo.textContent = fileName + ' | ' + formatSize(fileSize);
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeImagePreview() {
  var modal = document.getElementById('imagePreviewModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
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
  dropZone.addEventListener('dragover', function (e) { e.preventDefault(); e.stopPropagation(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', function () { dropZone.classList.remove('dragover'); });
  dropZone.addEventListener('drop', function (e) {
    dropZone.classList.remove('dragover');
    var files = e.dataTransfer && e.dataTransfer.files;
    if (files && files.length > 0) mergeAndPreview(Array.from(files));
  });
}

// Validation & Preview
function mergeAndPreview(newFiles) {
  // NEW: Expanded allowed types
  var allowedTypes = [
    // Images
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
    // Documents
    'application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain', 'text/csv',
    // Archives
    'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed',
    'application/gzip', 'application/x-tar',
    // Code
    'text/html', 'text/css', 'application/javascript', 'application/json',
    // Video
    'video/mp4', 'video/webm', 'video/quicktime',
    // Audio
    'audio/mpeg', 'audio/wav', 'audio/ogg'
  ];
  
  var maxSizeBytes = 10 * 1024 * 1024; // 10MB
  
  for (var i = 0; i < newFiles.length; i++) {
    var f = newFiles[i];
    if (allowedTypes.indexOf(f.type) === -1) {
      var info = getFileTypeInfo(f);
      showToast('"' + f.name + '" (' + info.label + ') is not supported.', '\u26A0\uFE0F');
      return;
    }
    if (f.size > maxSizeBytes) {
      showToast('"' + f.name + '" exceeds 10MB (' + formatSize(f.size) + ').', '\u26A0\uFE0F');
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
    
    // Get file type info
    var info = getFileTypeInfo(file);
    var isImage = file.type.startsWith('image/');
    
    // Thumbnail or icon
    var thumbHtml = '';
    if (isImage) {
      thumbHtml = '<div class="chip-thumb" style="width: 32px; height: 32px; border-radius: 4px; flex-shrink: 0; background: var(--bg-input); display: flex; align-items: center; justify-content: center; overflow: hidden; cursor: pointer;" data-fileidx="' + idx + '">📄</div>';
    } else {
      thumbHtml = '<i class="fas ' + info.icon + '" style="color: ' + info.color + '; font-size: 1.4rem; width: 32px; text-align: center; flex-shrink: 0;"></i>';
    }
    
    chip.innerHTML =
      thumbHtml +
      '<span class="chip-name" title="' + escapeHtml(file.name) + '">' + escapeHtml(file.name) + '</span>' +
      '<span class="chip-size">' + formatSize(file.size) + '</span>' +
      getFileTypeBadge(file, false) +
      '<button class="chip-remove" type="button" aria-label="Remove ' + escapeHtml(file.name) + '" data-idx="' + idx + '" title="Remove">&times;</button>';
    preview.appendChild(chip);
    
    // Generate thumbnail for images
    if (isImage) {
      generateThumbnail(file, function(thumbnail) {
        if (thumbnail) {
          var thumb = chip.querySelector('.chip-thumb');
          if (thumb) {
            thumb.innerHTML = '<img src="' + thumbnail + '" alt="' + escapeHtml(file.name) + '" style="width: 100%; height: 100%; object-fit: cover;">';
            thumb.style.cursor = 'pointer';
            thumb.addEventListener('click', function(e) {
              e.stopPropagation();
              openImagePreview(thumbnail, file.name, file.size);
            });
          }
        }
      });
    }
  });
  
  // Add click listeners for remove buttons
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
      '<strong>\u2713 ' + count + ' file' + (count > 1 ? 's' : '') + ' ready</strong>' +
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
      'Supported: Images, PDFs, Documents, Archives &mdash; Max 10MB each';
  }
}

// Form Submit
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      showToast('Please select at least one file.', '\u26A0\uFE0F');
      return;
    }
    var firstName = document.getElementById('firstName').value.trim();
    var lastName  = document.getElementById('lastName').value.trim();
    if (!firstName || !lastName) {
      showToast('Please fill in your first and last name.', '\u26A0\uFE0F');
      return;
    }

    // Show progress
    updateProgress(0, 'Starting upload...');
    var progressInterval = setInterval(function() {
      var current = parseInt(document.getElementById('progressBar').style.width) || 0;
      if (current < 95) {
        var increment = Math.random() * 15 + 5;
        var newValue = Math.min(current + increment, 95);
        updateProgress(newValue, 'Uploading... ' + Math.round(newValue) + '%');
      }
    }, 300);

    var fd = new FormData();
    fd.append('firstName', firstName);
    fd.append('lastName',  lastName);
    selectedFiles.forEach(function (file) { fd.append('myFile', file); });

    // Generate thumbnails for history
    var thumbnails = [];
    var thumbnailPromises = selectedFiles.map(function(file) {
      return new Promise(function(resolve) {
        if (file.type.startsWith('image/')) {
          generateThumbnail(file, function(thumbnail) {
            thumbnails.push(thumbnail);
            resolve();
          });
        } else {
          thumbnails.push(null);
          resolve();
        }
      });
    });

    Promise.all(thumbnailPromises).then(function() {
      // Update stats with file types
      selectedFiles.forEach(function (file, index) {
        uploadData.stats.totalFiles     += 1;
        uploadData.stats.totalSizeBytes += file.size;
        
        // Track file types
        var info = getFileTypeInfo(file);
        var category = info.category || 'other';
        if (!uploadData.stats.fileTypes) uploadData.stats.fileTypes = {};
        uploadData.stats.fileTypes[category] = (uploadData.stats.fileTypes[category] || 0) + 1;
        
        if (file.size > uploadData.stats.largestFileBytes) {
          uploadData.stats.largestFileBytes = file.size;
        }
        
        uploadData.history.unshift({ 
          name: file.name, 
          size: file.size, 
          type: file.type,
          timestamp: Date.now(),
          thumbnail: thumbnails[index] || null
        });
      });
      uploadData.history = uploadData.history.slice(0, 10);
      saveData();
      renderStats();
      renderHistory();
    });

    var uploadedNames = selectedFiles.map(function (f) { return f.name; });

    fetch('/upload', { method: 'POST', body: fd })
      .then(function (res) {
        clearInterval(progressInterval);
        updateProgress(100, 'Complete! ✅');
        return res.text().then(function (html) {
          document.open(); document.write(html); document.close();
        });
      })
      .catch(function () {
        clearInterval(progressInterval);
        updateProgress(100, 'Complete! ✅');
        uploadedNames.forEach(function (name) { showToast(name + ' logged locally', '\u2705'); });
      });

    selectedFiles = [];
    var preview = document.getElementById('file-preview');
    if (preview) { preview.innerHTML = ''; preview.style.display = 'none'; }
    resetDropZoneText();
    
    // Reset form fields
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
  });
}

// Export History Button
var exportBtn = document.getElementById('exportHistoryBtn');
if (exportBtn) {
  exportBtn.addEventListener('click', exportHistoryCSV);
}

// Modal Close handlers
var modal = document.getElementById('imagePreviewModal');
var modalClose = document.getElementById('modalClose');
if (modalClose) {
  modalClose.addEventListener('click', closeImagePreview);
}
if (modal) {
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeImagePreview();
  });
}
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeImagePreview();
});

// Init
renderStats();
renderHistory();