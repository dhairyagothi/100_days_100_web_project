const outputContainer = document.getElementById('output-container');
const inputLine = document.getElementById('input-line');
const inputMirror = document.getElementById('input-mirror');
const hiddenInput = document.getElementById('hidden-input');
const terminalBody = document.getElementById('terminal-body');

const PROMPT = '<span class="prompt">visitor@portfolio:~$</span>';

const commands = {
    help: `<div>Available commands:</div>
<div class="help-grid">
  <div><span class="info-text">about</span></div><div>- Developer bio</div>
  <div><span class="info-text">skills</span></div><div>- Categorized skills with progress</div>
  <div><span class="info-text">projects</span></div><div>- Realistic portfolio projects</div>
  <div><span class="info-text">contact</span></div><div>- Contact information</div>
  <div><span class="info-text">resume</span></div><div>- Open resume (simulated)</div>
  <div><span class="info-text">github</span></div><div>- Open GitHub profile (simulated)</div>
  <div><span class="info-text">linkedin</span></div><div>- Open LinkedIn profile (simulated)</div>
  <div><span class="info-text">clear</span></div><div>- Clear terminal history</div>
  <div><span class="info-text">help</span></div><div>- Show this help menu</div>
</div>`,

    about: `<div>Hi, I'm a passionate web developer specializing in building modern, interactive, and accessible web applications. I love turning complex problems into simple, beautiful, and intuitive designs.</div><br>
<div>When I'm not coding, you'll find me exploring new technologies or contributing to open-source projects. I thrive in environments that challenge me to learn and adapt quickly.</div>`,

    skills: `<div class="skill-bar-container"><div class="skill-name">HTML5</div><div class="skill-bar"><div class="skill-fill" style="width: 95%;"></div></div></div>
<div class="skill-bar-container"><div class="skill-name">CSS3/SASS</div><div class="skill-bar"><div class="skill-fill" style="width: 90%;"></div></div></div>
<div class="skill-bar-container"><div class="skill-name">JavaScript</div><div class="skill-bar"><div class="skill-fill" style="width: 85%;"></div></div></div>
<div class="skill-bar-container"><div class="skill-name">React.js</div><div class="skill-bar"><div class="skill-fill" style="width: 80%;"></div></div></div>
<div class="skill-bar-container"><div class="skill-name">Node.js</div><div class="skill-bar"><div class="skill-fill" style="width: 75%;"></div></div></div>
<div class="skill-bar-container"><div class="skill-name">Express</div><div class="skill-bar"><div class="skill-fill" style="width: 70%;"></div></div></div>
<div class="skill-bar-container"><div class="skill-name">SQL</div><div class="skill-bar"><div class="skill-fill" style="width: 65%;"></div></div></div>
<div class="skill-bar-container"><div class="skill-name">Git</div><div class="skill-bar"><div class="skill-fill" style="width: 90%;"></div></div></div>
<div class="skill-bar-container"><div class="skill-name">Figma</div><div class="skill-bar"><div class="skill-fill" style="width: 75%;"></div></div></div>`,

    projects: `<div class="project-item">
  <div class="project-name">1. E-Commerce Platform</div>
  <div>A full-stack e-commerce solution with secure payment gateway integration, real-time inventory management, and an intuitive admin dashboard.</div>
  <div class="project-tech">[React, Node.js, Express, PostgreSQL, Stripe]</div>
</div>
<div class="project-item">
  <div class="project-name">2. AI Content Generator</div>
  <div>Web application that leverages AI models to generate high-quality blog posts and marketing copy automatically based on user prompts.</div>
  <div class="project-tech">[Next.js, Tailwind CSS, OpenAI API]</div>
</div>
<div class="project-item">
  <div class="project-name">3. Real-Time Chat Application</div>
  <div>A lightweight chat app featuring private messaging, typing indicators, and read receipts with WebSocket integration.</div>
  <div class="project-tech">[Vue.js, Socket.io, Firebase]</div>
</div>
<div class="project-item">
  <div class="project-name">4. Kanban Task Manager</div>
  <div>Collaborative task management tool with drag-and-drop boards, role-based access, and real-time updates across clients.</div>
  <div class="project-tech">[React, Redux, Node.js, MongoDB]</div>
</div>
<div class="project-item">
  <div class="project-name">5. Terminal Portfolio</div>
  <div>A realistic developer portfolio that looks and behaves like a modern terminal application. You are looking at it right now!</div>
  <div class="project-tech">[HTML5, CSS3, Vanilla JavaScript]</div>
</div>`,

    contact: `<div class="contact-item"><span>Email:</span>    <a href="mailto:hello@example.com">hello@example.com</a></div>
<div class="contact-item"><span>GitHub:</span>   <a href="#" onclick="executeCommand('github'); return false;">github.com/developer</a></div>
<div class="contact-item"><span>LinkedIn:</span> <a href="#" onclick="executeCommand('linkedin'); return false;">linkedin.com/in/developer</a></div>`
};

let commandHistory = [];
let historyIndex = -1;
let isBooting = true;

const bootSequence = [
    "Loading portfolio...",
    "Initializing projects module...",
    "Loading skills...",
    "System ready. Welcome to my portfolio.",
    "Type 'help' to see available commands."
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runBootSequence() {
    const bootCommand = "boot";
    let typed = "";
    
    const bootLine = document.createElement('div');
    bootLine.className = 'command-output';
    outputContainer.appendChild(bootLine);

    for (let i = 0; i < bootCommand.length; i++) {
        typed += bootCommand[i];
        bootLine.innerHTML = `${PROMPT} ${typed}<span class="cursor"></span>`;
        await delay(150);
    }
    
    bootLine.innerHTML = `${PROMPT} ${bootCommand}`;

    const logsDiv = document.createElement('div');
    logsDiv.className = 'command-output';
    outputContainer.appendChild(logsDiv);

    for (let line of bootSequence) {
        await delay(300 + Math.random() * 200);
        logsDiv.innerHTML += `<div>${line}</div>`;
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    await delay(400);
    
    inputLine.style.display = 'flex';
    hiddenInput.focus();
    isBooting = false;
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

function appendOutput(html) {
    const div = document.createElement('div');
    div.className = 'command-output';
    div.innerHTML = html;
    outputContainer.appendChild(div);
}

window.executeCommand = function(cmd) {
    if (!cmd) {
        appendOutput(`${PROMPT}`);
        return;
    }
    
    appendOutput(`${PROMPT} ${cmd}`);
    
    const lowerCmd = cmd.toLowerCase().trim();
    let output = '';
    
    switch (lowerCmd) {
        case 'help':
            output = commands.help;
            break;
        case 'about':
            output = commands.about;
            break;
        case 'skills':
            output = commands.skills;
            break;
        case 'projects':
            output = commands.projects;
            break;
        case 'contact':
            output = commands.contact;
            break;
        case 'resume':
            output = `<div class="info-text">Opening resume... (simulated)</div>`;
            setTimeout(() => window.open('#', '_blank'), 1000);
            break;
        case 'github':
            output = `<div class="info-text">Redirecting to GitHub... (simulated)</div>`;
            setTimeout(() => window.open('https://github.com', '_blank'), 1000);
            break;
        case 'linkedin':
            output = `<div class="info-text">Redirecting to LinkedIn... (simulated)</div>`;
            setTimeout(() => window.open('https://linkedin.com', '_blank'), 1000);
            break;
        case 'clear':
            outputContainer.innerHTML = '';
            terminalBody.scrollTop = 0;
            return;
        default:
            output = `<div class="error-text">Command not found: ${cmd}. Type 'help' to see available commands.</div>`;
    }
    
    if (output) {
        appendOutput(output);
    }
    
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

hiddenInput.addEventListener('keydown', function(e) {
    if (isBooting) {
        e.preventDefault();
        return;
    }

    if (e.key === 'Enter') {
        const cmd = hiddenInput.value;
        if (cmd.trim()) {
            commandHistory.push(cmd);
        }
        historyIndex = commandHistory.length;
        
        executeCommand(cmd);
        
        hiddenInput.value = '';
        updateInputMirror();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            hiddenInput.value = commandHistory[historyIndex];
            updateInputMirror();
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            hiddenInput.value = commandHistory[historyIndex];
            updateInputMirror();
        } else {
            historyIndex = commandHistory.length;
            hiddenInput.value = '';
            updateInputMirror();
        }
    }
});

hiddenInput.addEventListener('input', updateInputMirror);

function updateInputMirror() {
    inputMirror.textContent = hiddenInput.value.replace(/ /g, '\u00A0');
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

document.addEventListener('click', () => {
    if (!isBooting && window.getSelection().toString() === '') {
        hiddenInput.focus();
    }
});

window.onload = () => {
    runBootSequence();
};
