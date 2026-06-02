/**
 * Terminal Application
 */

const TerminalApp = {
    create() {
        const container = document.createElement('div');
        container.style.backgroundColor = '#1e1e1e';
        container.style.color = '#ccc';
        container.style.fontFamily = 'Consolas, monospace';
        container.style.height = '100%';
        container.style.padding = '10px';
        container.style.fontSize = '14px';
        container.style.overflowY = 'auto';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';

        // Output Display
        const output = document.createElement('div');
        output.style.whiteSpace = 'pre-wrap';

        // Input Area
        const inputLine = document.createElement('div');
        inputLine.style.display = 'flex';
        inputLine.style.marginTop = '5px';

        const prompt = document.createElement('span');
        prompt.innerText = '/ $ ';
        prompt.style.color = '#4a90e2';
        prompt.style.marginRight = '5px';

        const input = document.createElement('input');
        input.type = 'text';
        input.style.backgroundColor = 'transparent';
        input.style.border = 'none';
        input.style.color = '#fff';
        input.style.flexGrow = '1';
        input.style.fontFamily = 'inherit';
        input.style.outline = 'none';

        inputLine.appendChild(prompt);
        inputLine.appendChild(input);

        container.appendChild(output);
        container.appendChild(inputLine);

        // State
        let currentDir = '/';

        // Helper to print
        const print = (text, type = 'normal') => {
            const line = document.createElement('div');
            line.textContent = text;
            if (type === 'error') line.style.color = '#ff5f56';
            output.appendChild(line);
            container.scrollTop = container.scrollHeight;
        };

        // Command Logic
        const exec = (cmdStr) => {
            const parts = cmdStr.trim().split(/\s+/);
            const cmd = parts[0];
            const args = parts.slice(1);

            if (!cmd) return;

            // Resolve Path Helper
            const resolvePath = (path) => {
                if (path.startsWith('/')) return path;
                return currentDir === '/' ? `/${path}` : `${currentDir}/${path}`;
            };

            switch (cmd) {
                case 'ls':
                    // In a real OS we'd parse absolute vs relative, simpler here:
                    // Just resolving current dir
                    const files = VFS.listFiles(currentDir);
                    if (files) {
                        print(files.join('  '));
                    } else {
                        print('Error listing directory', 'error');
                    }
                    break;

                case 'cd':
                    if (!args[0]) return;
                    let target = args[0];
                    if (target === '..') {
                        // Simple parent logic
                        if (currentDir === '/') return;
                        const parts = currentDir.split('/').filter(p => p);
                        parts.pop();
                        currentDir = '/' + parts.join('/');
                    } else {
                        const newPath = resolvePath(target);
                        if (VFS.exists(newPath)) { // Ideally check if it IS a dir
                            currentDir = newPath;
                        } else {
                            print(`cd: ${target}: No such directory`, 'error');
                        }
                    }
                    prompt.innerText = `${currentDir} $ `;
                    break;

                case 'touch':
                    if (args[0]) {
                        const path = resolvePath(args[0]);
                        if (VFS.writeFile(path, '')) {
                            print(`Created ${args[0]}`);
                        } else {
                            print('Error creating file', 'error');
                        }
                    }
                    break;

                case 'cat':
                    if (args[0]) {
                        const path = resolvePath(args[0]);
                        const content = VFS.readFile(path);
                        if (content !== null) {
                            print(content);
                        } else {
                            print(`cat: ${args[0]}: No such file`, 'error');
                        }
                    }
                    break;

                case 'help':
                    print('Commands: ls, cd, touch, cat, help');
                    break;

                case 'clear':
                    output.innerHTML = '';
                    break;

                default:
                    print(`Command not found: ${cmd}`, 'error');
            }
        };

        // Event
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value;
                print(`${currentDir} $ ${cmd}`);
                exec(cmd);
                input.value = '';
            }
        });

        // Auto focus
        container.addEventListener('click', () => input.focus());
        setTimeout(() => input.focus(), 100);

        return container;
    }
};

window.TerminalApp = TerminalApp;
