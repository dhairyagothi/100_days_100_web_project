/**
 * WebKernel Core
 * Global OS state and Process Management
 */

const OS = {
    // Process list
    processes: [],

    // Counter for PIDs
    _nextPid: 1000,

    // Boot sequence
    boot() {
        console.log('OS: Booting...');

        // Init Subsystems
        if (window.VFS) VFS.init();
        if (window.WindowManager) WindowManager.init();
        if (window.AppLauncher) AppLauncher.init();

        // Keep time updated
        this.startClock();
        this.initWidgets();

        // Restore widget state
        const hideWidgets = localStorage.getItem('webkernel_widgets_hidden') === 'true';
        if (hideWidgets) {
            const container = document.getElementById('widget-container');
            if (container) container.classList.add('hidden');
        }

        console.log('OS: Boot complete.');
    },

    toggleWidgets() {
        const container = document.getElementById('widget-container');
        if (container) {
            container.classList.toggle('hidden');
            const isHidden = container.classList.contains('hidden');
            localStorage.setItem('webkernel_widgets_hidden', isHidden);
            return !isHidden;
        }
        return false;
    },

    initWidgets() { },

    // Create a new process
    createProcess(name, appConfig) {
        const pid = this._nextPid++;

        const process = {
            pid: pid,
            name: name,
            startTime: Date.now(),
            state: 'running',
            windowId: null // Linked later if window creates one
        };

        this.processes.push(process);
        console.log(`OS: Process started [${pid}] ${name}`);

        // Notify Task Manager logic if needed (reactive update is better in App)
        this.emit('process-list-updated');

        return process;
    },

    // Kill a process
    killProcess(pid) {
        const idx = this.processes.findIndex(p => p.pid === pid);
        if (idx !== -1) {
            const process = this.processes[idx];
            console.log(`OS: Killing process [${pid}] ${process.name}`);

            // Clean up window if it exists
            if (process.windowId && window.WindowManager) {
                WindowManager.closeWindow(process.windowId);
            }

            this.processes.splice(idx, 1);
            this.emit('process-list-updated');
            return true;
        }
        return false;
    },

    getProcess(pid) {
        return this.processes.find(p => p.pid === pid);
    },

    // Simple Event Emitter for internal OS communication
    listeners: {},

    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    },

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    },

    startClock() {
        const update = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateStr = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

            // Taskbar
            const clockEl = document.getElementById('clock');
            if (clockEl) clockEl.innerText = timeStr;

            // Widget
            const wTime = document.getElementById('w-time');
            const wDate = document.getElementById('w-date');
            if (wTime) wTime.innerText = timeStr;
            if (wDate) wDate.innerText = dateStr;
        };
        update();
        setInterval(update, 1000);
    }
};

// Make globally available
window.OS = OS;
