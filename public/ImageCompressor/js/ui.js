export function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function showToast(message, type = 'info', iconClass = 'ph-info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    toast.innerHTML = `
        <i class="ph ${iconClass}" style="font-size: 1.25rem;"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 3000);
}

export function initSortable(containerId, onReorderCallback) {
    const el = document.getElementById(containerId);
    if (window.Sortable) {
        new window.Sortable(el, {
            animation: 150,
            handle: '.drag-handle',
            ghostClass: 'sortable-ghost',
            onEnd: function (evt) {
                if (onReorderCallback) {
                    onReorderCallback(evt.oldIndex, evt.newIndex);
                }
            }
        });
    }
}

export function initSlider() {
    const container = document.getElementById('compareContainer');
    const handle = document.getElementById('compareHandle');
    const overlay = document.getElementById('compareOverlay');
    let isDragging = false;
    
    function move(x) {
        const rect = container.getBoundingClientRect();
        let pos = x - rect.left;
        
        // Boundaries
        if (pos < 0) pos = 0;
        if (pos > rect.width) pos = rect.width;
        
        const percent = (pos / rect.width) * 100;
        handle.style.left = `${percent}%`;
        overlay.style.width = `${percent}%`;
    }
    
    handle.addEventListener('mousedown', () => isDragging = true);
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        move(e.clientX);
    });
    
    // Touch support
    handle.addEventListener('touchstart', () => isDragging = true);
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        move(e.touches[0].clientX);
    });
}
