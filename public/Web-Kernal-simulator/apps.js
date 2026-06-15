/**
 * App Registry & Launcher
 * Contains logic for Task Manager and Notes App as well.
 */

const AppLauncher = {
    apps: {},

    init() {
        // Render Start Menu / Taskbar Icons using registered apps
        this.renderTaskbar();

        // Register Core Apps
        this.registerApp('terminal', {
            name: 'Terminal',
            icon: '>',
            create: () => TerminalApp.create() // Defined in terminal.js
        });

        this.registerApp('notes', {
            name: 'Notes',
            icon: '✎',
            create: () => NotesApp.create()
        });

        this.registerApp('taskmgr', {
            name: 'Task Manager',
            icon: '⚡',
            create: () => TaskManagerApp.create()
        });

        this.registerApp('calculator', {
            name: 'Calculator',
            icon: '🧮',
            width: 250,
            height: 350,
            create: () => CalculatorApp.create()
        });

        this.renderTaskbar();
        this.initStartMenu();
    },

    initStartMenu() {
        const startBtn = document.getElementById('start-button');
        const menu = document.getElementById('start-menu');

        if (!startBtn || !menu) return;

        // Toggle Menu
        startBtn.onclick = (e) => {
            e.stopPropagation();
            menu.classList.toggle('hidden');
        };

        // Handle Menu Items
        menu.onclick = (e) => {
            const item = e.target.closest('.start-menu-item');
            if (!item) return;

            const action = item.getAttribute('data-action');
            const app = item.getAttribute('data-app');

            if (action === 'launch' && app) {
                this.launch(app);
                menu.classList.add('hidden');
            } else if (action === 'toggle-widgets') {
                OS.toggleWidgets();
                menu.classList.add('hidden');
            }
        };

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !startBtn.contains(e.target)) {
                menu.classList.add('hidden');
            }
        });
    },

    registerApp(id, config) {
        this.apps[id] = config;
    },

    launch(appId) {
        const app = this.apps[appId];
        if (!app) return;

        // Start Process
        const process = OS.createProcess(app.name);

        // Create Window content
        const content = app.create(process.pid);

        // Create Window
        const winEl = WindowManager.createWindow({
            id: process.pid,
            title: app.name,
            content: content,
            width: app.width,
            height: app.height
        });

        process.windowId = process.pid; // Direct mapping for now
    },

    renderTaskbar() {
        const container = document.getElementById('taskbar-apps');
        if (!container) return;
        container.innerHTML = '';

        Object.keys(this.apps).forEach(id => {
            const app = this.apps[id];
            const btn = document.createElement('div');
            btn.className = 'taskbar-item';
            btn.innerText = `${app.icon} ${app.name}`;
            btn.onclick = () => this.launch(id);
            container.appendChild(btn);
        });
    }
};

/**
 * Task Manager App Logic
 */
const TaskManagerApp = {
    create() {
        const container = document.createElement('div');
        container.style.height = '100%';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';

        const list = document.createElement('div');
        list.style.flexGrow = '1';
        list.innerHTML = 'Loading...';

        container.appendChild(list);

        // Reactive update function
        const updateList = () => {
            if (!list.parentNode) return; // Stop if window closed (garbage collection helper)

            let html = '<table style="width:100%; border-collapse: collapse;">';
            html += '<tr style="text-align:left; border-bottom:1px solid #ccc;"><th>PID</th><th>Name</th><th>Action</th></tr>';

            OS.processes.forEach(p => {
                html += `<tr>
                    <td>${p.pid}</td>
                    <td>${p.name}</td>
                    <td><button onclick="OS.killProcess(${p.pid})" style="padding:2px 5px; color:red;">Kill</button></td>
                </tr>`;
            });
            html += '</table>';
            list.innerHTML = html;
        };

        // Initial render
        updateList();

        // Listen for OS updates
        OS.on('process-list-updated', updateList);

        // Hook for cleanup? process kill handles window removal

        return container;
    }
};

/**
 * Notes App Logic
 */
const NotesApp = {
    create() {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.height = '100%';
        container.style.gap = '5px';

        // Controls
        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.gap = '5px';

        const fileInput = document.createElement('input');
        fileInput.placeholder = 'filename.txt';
        fileInput.style.flexGrow = '1';
        fileInput.style.padding = '5px';

        const loadBtn = document.createElement('button');
        loadBtn.innerText = 'Load';
        loadBtn.style.padding = '5px 10px';

        const saveBtn = document.createElement('button');
        saveBtn.innerText = 'Save';
        saveBtn.style.padding = '5px 10px';

        controls.appendChild(fileInput);
        controls.appendChild(loadBtn);
        controls.appendChild(saveBtn);

        // Editor
        const textarea = document.createElement('textarea');
        textarea.style.flexGrow = '1';
        textarea.style.resize = 'none';
        textarea.style.padding = '5px';

        container.appendChild(controls);
        container.appendChild(textarea);

        // Logic
        saveBtn.onclick = () => {
            const name = fileInput.value.trim();
            if (!name) return alert('Enter filename');
            const path = name.startsWith('/') ? name : '/' + name;

            if (VFS.writeFile(path, textarea.value)) {
                alert('Saved!');
            } else {
                alert('Error saving. Check path.');
            }
        };

        loadBtn.onclick = () => {
            const name = fileInput.value.trim();
            if (!name) return alert('Enter filename');
            const path = name.startsWith('/') ? name : '/' + name;

            const content = VFS.readFile(path);
            if (content === null) {
                alert('File not found');
            } else {
                textarea.value = content;
            }
        };

        return container;
    }
};

window.AppLauncher = AppLauncher;

/**
 * Calculator App Logic
 */
const CalculatorApp = {
    create() {
        const container = document.createElement('div');
        container.style.height = '100%';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.padding = '10px';

        const display = document.createElement('div');
        display.className = 'calc-display';
        display.innerText = '0';

        const grid = document.createElement('div');
        grid.className = 'calc-grid';

        const buttons = [
            'C', '/', '*', '-',
            '7', '8', '9', '+',
            '4', '5', '6', '=',
            '1', '2', '3', '0'
        ];

        let currentInput = '';
        let pendingValue = null;
        let operator = null;
        let resetDisplay = false;

        const updateDisplay = (val) => {
            display.innerText = val.toString().slice(0, 10);
        };

        buttons.forEach(char => {
            const btn = document.createElement('button');
            btn.className = 'calc-btn';
            btn.innerText = char;
            if (['/', '*', '-', '+', '='].includes(char)) btn.classList.add('op');
            if (char === 'C') btn.classList.add('clear');
            if (char === '0') btn.style.gridColumn = 'span 4'; // Make 0 wide

            btn.onclick = () => {
                if (!isNaN(char)) {
                    // Number
                    if (resetDisplay) {
                        currentInput = char;
                        resetDisplay = false;
                    } else {
                        currentInput = (currentInput === '0' ? '' : currentInput) + char;
                    }
                    updateDisplay(currentInput);
                } else if (char === 'C') {
                    currentInput = '0';
                    pendingValue = null;
                    operator = null;
                    updateDisplay('0');
                } else if (char === '=') {
                    if (operator && pendingValue !== null) {
                        const val = parseFloat(currentInput);
                        let res = 0;
                        if (operator === '+') res = pendingValue + val;
                        if (operator === '-') res = pendingValue - val;
                        if (operator === '*') res = pendingValue * val;
                        if (operator === '/') res = pendingValue / val;

                        updateDisplay(res);
                        currentInput = res.toString();
                        pendingValue = null;
                        operator = null;
                        resetDisplay = true;
                    }
                } else {
                    // Operator
                    operator = char;
                    pendingValue = parseFloat(currentInput);
                    resetDisplay = true;
                }
            };

            grid.appendChild(btn);
        });

        container.appendChild(display);
        container.appendChild(grid);

        return container;
    }
};
