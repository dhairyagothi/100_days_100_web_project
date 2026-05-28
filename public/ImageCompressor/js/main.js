import { initTheme } from './theme.js';
import { compressImage } from './compressor.js';
import { showToast, formatBytes, initSortable, initSlider } from './ui.js';

let fileQueue = [];
let totalSavedBytes = 0;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadSection = document.getElementById('uploadSection');
const workspaceSection = document.getElementById('workspaceSection');
const queueList = document.getElementById('queueList');
const queueCount = document.getElementById('queueCount');
const globalStats = document.getElementById('globalStats');
const totalSavedStat = document.getElementById('totalSavedStat');
const targetSizeInput = document.getElementById('targetSizeInput');
const applyTargetBtn = document.getElementById('applyTargetBtn');
const clearQueueBtn = document.getElementById('clearQueueBtn');
const downloadAllBtn = document.getElementById('downloadAllBtn');

// Modal Elements
const comparisonModal = document.getElementById('comparisonModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalFilename = document.getElementById('modalFilename');
const compareOriginal = document.getElementById('compareOriginal');
const compareCompressed = document.getElementById('compareCompressed');
const modalOriginalSize = document.getElementById('modalOriginalSize');
const modalCompressedSize = document.getElementById('modalCompressedSize');
const modalSavings = document.getElementById('modalSavings');
const modalDownloadBtn = document.getElementById('modalDownloadBtn');
let activeModalFileId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initSlider();
    
    // Make drop zone sortable
    initSortable('queueList', (oldIndex, newIndex) => {
        const item = fileQueue.splice(oldIndex, 1)[0];
        fileQueue.splice(newIndex, 0, item);
    });
});

// ==========================================
// File Input & Drag/Drop
// ==========================================
dropZone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fileInput.click();
    }
});

dropZone.addEventListener('click', (e) => {
    if (e.target.tagName !== 'LABEL' && e.target.tagName !== 'INPUT') {
        fileInput.click();
    }
});

fileInput.addEventListener('change', handleFiles);

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
    }
});

// ==========================================
// Logic
// ==========================================
function handleFiles(e) {
    if (fileInput.files.length > 0) {
        processFiles(fileInput.files);
    }
    // reset input so the same files can be selected again if needed
    fileInput.value = '';
}

function processFiles(files) {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    let addedCount = 0;
    
    Array.from(files).forEach(file => {
        if (!validTypes.includes(file.type)) {
            showToast(`Skipped ${file.name} - Invalid format`, 'error', 'ph-warning');
            return;
        }
        
        if (file.size > MAX_FILE_SIZE) {
            showToast(`Skipped ${file.name} - Exceeds 10MB`, 'error', 'ph-warning-circle');
            return;
        }
        
        const id = 'file_' + Math.random().toString(36).substr(2, 9);
        fileQueue.push({
            id,
            file,
            status: 'compressing', // 'compressing', 'done', 'error'
            result: null
        });
        addedCount++;
    });
    
    if (addedCount > 0) {
        showToast(`Added ${addedCount} images to queue`, 'success', 'ph-check-circle');
        updateUI();
        processQueue();
    }
}

function getTargetBytes() {
    let targetKB = parseInt(targetSizeInput.value, 10);
    if (isNaN(targetKB) || targetKB < 50) {
        showToast('Images cannot be compressed below 50KB safely.', 'error', 'ph-warning');
        return null;
    }
    return targetKB * 1024;
}

async function processQueue() {
    const targetBytes = getTargetBytes();
    if (!targetBytes) {
        fileQueue.forEach(item => {
            if (item.status === 'compressing') item.status = 'error';
        });
        renderQueue();
        return;
    }
    
    for (const item of fileQueue) {
        if (item.status === 'compressing' && !item.result) {
            try {
                const result = await compressImage(item.file, targetBytes);
                item.status = 'done';
                item.result = result;
                
                if (result.hitUnsafeLimit) {
                    showToast(`Unable to safely compress ${item.file.name} to target without major loss.`, 'error', 'ph-warning-circle');
                }
                
                updateStats();
                renderQueue(); // Re-render to show done state
            } catch (err) {
                console.error(err);
                item.status = 'error';
                showToast(`Failed to compress ${item.file.name}`, 'error', 'ph-warning');
                renderQueue();
            }
        }
    }
}

async function recompressAll() {
    const targetBytes = getTargetBytes();
    if (!targetBytes) return;

    const originalText = applyTargetBtn.innerHTML;
    applyTargetBtn.innerHTML = '<i class="ph ph-spinner-gap" style="animation: spin 1s linear infinite;"></i> Processing...';
    applyTargetBtn.disabled = true;

    // Revoke old object URLs
    fileQueue.forEach(item => {
        if (item.result && item.result.compressedUrl) {
            URL.revokeObjectURL(item.result.compressedUrl);
        }
        item.status = 'compressing';
        item.result = null;
    });
    
    totalSavedBytes = 0;
    updateStats();
    renderQueue();
    
    await processQueue();
    
    applyTargetBtn.innerHTML = originalText;
    applyTargetBtn.disabled = false;

    // If modal is open, refresh it
    if (!comparisonModal.classList.contains('hidden') && activeModalFileId) {
        openModal(activeModalFileId);
    }
}

// ==========================================
// UI Updates
// ==========================================
function updateUI() {
    if (fileQueue.length > 0) {
        uploadSection.classList.add('hidden');
        workspaceSection.classList.remove('hidden');
        globalStats.classList.remove('hidden');
    } else {
        uploadSection.classList.remove('hidden');
        workspaceSection.classList.add('hidden');
        globalStats.classList.add('hidden');
    }
    
    queueCount.textContent = `${fileQueue.length} file${fileQueue.length !== 1 ? 's' : ''}`;
    renderQueue();
}

function updateStats() {
    totalSavedBytes = fileQueue.reduce((acc, item) => {
        if (item.status === 'done' && item.result) {
            const savings = item.result.originalSize - item.result.compressedSize;
            return acc + (savings > 0 ? savings : 0);
        }
        return acc;
    }, 0);
    
    totalSavedStat.textContent = formatBytes(totalSavedBytes);
}

function renderQueue() {
    queueList.innerHTML = '';
    
    fileQueue.forEach((item) => {
        const el = document.createElement('div');
        el.className = `queue-item ${item.status === 'compressing' ? 'compressing' : ''}`;
        
        let savingsBadge = '';
        if (item.status === 'done' && item.result) {
            const pct = item.result.savingsPercent;
            if (pct > 0) {
                savingsBadge = `<span class="item-savings savings-positive">Saved ${pct}%</span>`;
            } else {
                savingsBadge = `<span class="item-savings savings-neutral">Larger ${Math.abs(pct)}%</span>`;
            }
        }
        
        // Thumbnail handling
        let thumbSrc = '';
        if (item.result && item.result.compressedUrl) {
            thumbSrc = item.result.compressedUrl;
        } else if (item.result && item.result.originalUrl) {
            thumbSrc = item.result.originalUrl;
        }
        
        el.innerHTML = `
            <div class="drag-handle"><i class="ph ph-dots-six-vertical"></i></div>
            ${thumbSrc ? `<img src="${thumbSrc}" class="item-thumbnail">` : `<div class="item-thumbnail"></div>`}
            <div class="item-details">
                <span class="item-name">${item.file.name}</span>
                <div class="item-meta">
                    ${item.status === 'done' ? `<span>${formatBytes(item.result.compressedSize)}</span>` : ''}
                </div>
                <div class="item-progress">
                    <div class="bar" style="width: 100%"></div>
                </div>
            </div>
            ${savingsBadge}
            <div class="item-actions">
                <button class="remove-btn" title="Remove"><i class="ph ph-trash"></i></button>
            </div>
        `;
        
        // Click item to open modal
        el.addEventListener('click', (e) => {
            if (e.target.closest('.remove-btn') || e.target.closest('.drag-handle')) return;
            if (item.status === 'done') {
                openModal(item.id);
            }
        });
        
        // Remove button
        const removeBtn = el.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => {
            if (item.result) {
                if (item.result.originalUrl) URL.revokeObjectURL(item.result.originalUrl);
                if (item.result.compressedUrl) URL.revokeObjectURL(item.result.compressedUrl);
            }
            fileQueue = fileQueue.filter(q => q.id !== item.id);
            updateStats();
            updateUI();
        });
        
        queueList.appendChild(el);
    });
}

// ==========================================
// Modal Logic
// ==========================================
function openModal(id) {
    const item = fileQueue.find(q => q.id === id);
    if (!item || !item.result) return;
    
    activeModalFileId = id;
    const r = item.result;
    
    modalFilename.textContent = item.file.name;
    modalOriginalSize.textContent = formatBytes(r.originalSize);
    modalCompressedSize.textContent = formatBytes(r.compressedSize);
    
    if (r.savingsPercent > 0) {
        modalSavings.textContent = `-${r.savingsPercent}%`;
        modalSavings.className = 'savings';
        modalSavings.style.display = 'inline-block';
    } else {
        modalSavings.style.display = 'none';
    }
    
    compareOriginal.src = r.originalUrl;
    compareCompressed.src = r.compressedUrl;
    
    // Reset handle to center
    document.getElementById('compareHandle').style.left = '50%';
    document.getElementById('compareOverlay').style.width = '50%';
    
    comparisonModal.classList.remove('hidden');
}

closeModalBtn.addEventListener('click', () => {
    comparisonModal.classList.add('hidden');
    activeModalFileId = null;
});

comparisonModal.addEventListener('click', (e) => {
    if (e.target === comparisonModal) {
        comparisonModal.classList.add('hidden');
        activeModalFileId = null;
    }
});

modalDownloadBtn.addEventListener('click', () => {
    if (!activeModalFileId) return;
    const item = fileQueue.find(q => q.id === activeModalFileId);
    if (!item || !item.result) return;
    
    downloadSingle(item);
});

function downloadSingle(item) {
    const a = document.createElement('a');
    a.href = item.result.compressedUrl;
    const nameParts = item.file.name.split('.');
    const ext = nameParts.pop();
    const baseName = nameParts.join('.');
    a.download = `${baseName}-compressed.${ext}`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// ==========================================
// Global Controls
// ==========================================
applyTargetBtn.addEventListener('click', () => {
    if (fileQueue.length > 0) {
        recompressAll();
    }
});

clearQueueBtn.addEventListener('click', () => {
    fileQueue.forEach(item => {
        if (item.result) {
            if (item.result.originalUrl) URL.revokeObjectURL(item.result.originalUrl);
            if (item.result.compressedUrl) URL.revokeObjectURL(item.result.compressedUrl);
        }
    });
    fileQueue = [];
    updateStats();
    updateUI();
});

downloadAllBtn.addEventListener('click', async () => {
    const doneItems = fileQueue.filter(q => q.status === 'done' && q.result);
    if (doneItems.length === 0) {
        showToast('No finished files to download', 'info', 'ph-info');
        return;
    }
    
    const originalText = downloadAllBtn.innerHTML;
    downloadAllBtn.innerHTML = '<i class="ph ph-spinner-gap" style="animation: spin 1s linear infinite;"></i> Zipping...';
    downloadAllBtn.disabled = true;
    
    try {
        if (doneItems.length === 1) {
            downloadSingle(doneItems[0]);
        } else {
            // Generate ZIP using JSZip
            const zip = new window.JSZip();
            
            doneItems.forEach((item, index) => {
                const nameParts = item.file.name.split('.');
                const ext = nameParts.pop();
                const baseName = nameParts.join('.');
                // Add index to avoid naming collisions
                const uniqueName = `${baseName}-compressed-${index+1}.${ext}`;
                zip.file(uniqueName, item.result.compressedBlob);
            });
            
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const zipUrl = URL.createObjectURL(zipBlob);
            
            const a = document.createElement('a');
            a.href = zipUrl;
            a.download = `ShrinkIO-Images.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            setTimeout(() => URL.revokeObjectURL(zipUrl), 1000);
        }
        showToast('Download started', 'success', 'ph-check-circle');
    } catch (e) {
        console.error(e);
        showToast('Failed to generate ZIP', 'error', 'ph-warning');
    } finally {
        downloadAllBtn.innerHTML = originalText;
        downloadAllBtn.disabled = false;
    }
});
