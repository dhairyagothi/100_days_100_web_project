/**
 * Window Manager
 * Handles creation, movement, and management of app windows.
 */

const WindowManager = {
    windows: [],
    activeWindow: null,
    baseZIndex: 100,

    init() {
        console.log('WindowManager: Initialized');
        // Drag move listener globally to prevent stuck drag if mouse leaves window
        document.addEventListener('mousemove', (e) => this.handleDragMove(e));
        document.addEventListener('mouseup', () => this.handleDragEnd());
    },

    createWindow(config) {
        // config: { id: pid, title: '...', content: DOMElement, width, height }

        const winEl = document.createElement('div');
        winEl.classList.add('window');
        winEl.style.width = (config.width || 400) + 'px';
        winEl.style.height = (config.height || 300) + 'px';

        // Center window roughly
        const top = 50 + (this.windows.length * 20);
        const left = 50 + (this.windows.length * 20);
        winEl.style.top = top + 'px';
        winEl.style.left = left + 'px';
        winEl.style.zIndex = this.baseZIndex + this.windows.length + 1;

        // Window Structure
        winEl.innerHTML = `
            <div class="title-bar" data-action="drag">
                <span class="title-text">${config.title}</span>
                <div class="window-controls">
                    <button class="control-btn minimize-btn" title="Minimize">-</button>
                    <button class="control-btn maximize-btn" title="Maximize">+</button>
                    <button class="control-btn close-btn" title="Close">x</button>
                </div>
            </div>
            <div class="window-content"></div>
            <div class="resize-handle" data-action="resize"></div>
        `;

        // Inject content
        const contentArea = winEl.querySelector('.window-content');
        if (config.content) {
            contentArea.appendChild(config.content);
        }

        // Attach Event Listeners
        const titleBar = winEl.querySelector('.title-bar');
        titleBar.addEventListener('mousedown', (e) => {
            if (e.target.closest('.control-btn')) return; // Don't drag if clicking buttons
            this.handleDragStart(e, winEl);
            this.focusWindow(winEl);
        });

        winEl.querySelector('.close-btn').addEventListener('click', () => {
            // Tell OS to kill process, which will call closeWindow back
            if (window.OS) OS.killProcess(config.id);
        });

        winEl.querySelector('.resize-handle').addEventListener('mousedown', (e) => {
            this.handleResizeStart(e, winEl);
            this.focusWindow(winEl);
        });

        winEl.addEventListener('mousedown', () => this.focusWindow(winEl));

        // Add to desktop
        document.getElementById('desktop').appendChild(winEl);

        // Track
        this.windows.push({ id: config.id, element: winEl });
        this.focusWindow(winEl);

        return winEl;
    },

    closeWindow(pid) {
        const idx = this.windows.findIndex(w => w.id === pid);
        if (idx !== -1) {
            const winData = this.windows[idx];
            if (winData.element.parentNode) {
                winData.element.parentNode.removeChild(winData.element);
            }
            this.windows.splice(idx, 1);
        }
    },

    focusWindow(winEl) {
        if (this.activeWindow === winEl) return;

        // Demote current
        if (this.activeWindow) {
            this.activeWindow.classList.remove('active');
        }

        // Promote new
        this.activeWindow = winEl;
        winEl.classList.add('active');

        // Bring to front
        // Re-sort z-indexes to keep numbers low
        this.windows.forEach(w => {
            if (w.element === winEl) {
                w.element.style.zIndex = this.baseZIndex + this.windows.length + 10;
            } else {
                let currentZ = parseInt(w.element.style.zIndex || (this.baseZIndex));
                if (currentZ > this.baseZIndex) {
                    w.element.style.zIndex = currentZ - 1;
                }
            }
        });
    },

    // Dragging Logic
    dragState: null, // { el, startX, startY, startLeft, startTop }

    handleDragStart(e, el) {
        this.dragState = {
            el: el,
            startX: e.clientX,
            startY: e.clientY,
            startLeft: el.offsetLeft,
            startTop: el.offsetTop,
            action: 'move'
        };
    },

    // Resizing Logic
    resizeState: null,

    handleResizeStart(e, el) {
        e.stopPropagation(); // prevent window drag
        this.resizeState = {
            el: el,
            startX: e.clientX,
            startY: e.clientY,
            startW: el.offsetWidth,
            startH: el.offsetHeight,
            action: 'resize'
        };
    },

    handleDragMove(e) {
        if (this.dragState) {
            const dx = e.clientX - this.dragState.startX;
            const dy = e.clientY - this.dragState.startY;
            this.dragState.el.style.left = (this.dragState.startLeft + dx) + 'px';
            this.dragState.el.style.top = (this.dragState.startTop + dy) + 'px';
        }

        if (this.resizeState) {
            const dx = e.clientX - this.resizeState.startX;
            const dy = e.clientY - this.resizeState.startY;
            this.resizeState.el.style.width = Math.max(200, this.resizeState.startW + dx) + 'px';
            this.resizeState.el.style.height = Math.max(150, this.resizeState.startH + dy) + 'px';
        }
    },

    handleDragEnd() {
        this.dragState = null;
        this.resizeState = null;
    }
};

// Make globally available
window.WindowManager = WindowManager;
