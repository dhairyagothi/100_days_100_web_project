// Database of recommendations
const recommendationDB = {
    frontend: {
        react: {
            stack: 'React + Vite',
            structure: 'src/\n ├── assets/\n ├── components/\n │   ├── common/\n │   └── layout/\n ├── hooks/\n ├── pages/\n ├── services/\n ├── store/\n ├── utils/\n ├── App.jsx\n └── main.jsx',
            commands: ['npm create vite@latest my-app -- --template react', 'cd my-app', 'npm install'],
            tools: ['VS Code', 'Git', 'Chrome DevTools', 'React Developer Tools'],
            bestPractices: ['Use functional components with Hooks', 'Keep components small and reusable', 'Use absolute imports for cleaner code', 'Implement error boundaries']
        },
        vue: {
            stack: 'Vue 3 + Vite',
            structure: 'src/\n ├── assets/\n ├── components/\n ├── composables/\n ├── router/\n ├── stores/\n ├── views/\n ├── App.vue\n └── main.js',
            commands: ['npm create vue@latest my-app', 'cd my-app', 'npm install'],
            tools: ['VS Code', 'Vue.js devtools', 'Volar Extension'],
            bestPractices: ['Use Composition API (script setup)', 'Keep components scoped with scoped CSS', 'Use Pinia for state management']
        },
        angular: {
            stack: 'Angular',
            structure: 'src/\n ├── app/\n │   ├── core/\n │   ├── shared/\n │   ├── features/\n │   ├── app.component.ts\n │   └── app.module.ts\n ├── assets/\n └── environments/',
            commands: ['npm install -g @angular/cli', 'ng new my-app', 'cd my-app', 'npm start'],
            tools: ['VS Code', 'Angular Language Service', 'RxJS Snippets'],
            bestPractices: ['Follow LIFT principle for folder structure', 'Use OnPush change detection strategy', 'Unsubscribe from observables to prevent memory leaks']
        },
        nextjs: {
            stack: 'Next.js (App Router)',
            structure: 'src/\n ├── app/\n │   ├── api/\n │   ├── (routes)/\n │   ├── layout.tsx\n │   └── page.tsx\n ├── components/\n ├── lib/\n ├── types/\n └── utils/',
            commands: ['npx create-next-app@latest my-app', 'cd my-app', 'npm run dev'],
            tools: ['VS Code', 'Prettier', 'ESLint'],
            bestPractices: ['Use Server Components by default', 'Keep client components at the leaves of the tree', 'Use Next.js Image component for optimization']
        }
    },
    backend: {
        nodejs: {
            stack: 'Node.js + Vanilla JS',
            structure: 'src/\n ├── controllers/\n ├── models/\n ├── routes/\n ├── middleware/\n ├── utils/\n ├── config/\n └── server.js',
            commands: ['mkdir my-api && cd my-api', 'npm init -y', 'npm i dotenv cors'],
            tools: ['Postman', 'Nodemon', 'VS Code'],
            bestPractices: ['Use environment variables for secrets', 'Implement error handling middleware', 'Validate input data']
        },
        express: {
            stack: 'Node.js + Express',
            structure: 'src/\n ├── controllers/\n ├── models/\n ├── routes/\n ├── middleware/\n ├── services/\n ├── config/\n └── app.js',
            commands: ['mkdir my-express-api && cd my-express-api', 'npm init -y', 'npm i express cors dotenv helmet morgan', 'npm i -D nodemon'],
            tools: ['Postman/Insomnia', 'MongoDB Compass / DBeaver', 'Morgan for logging'],
            bestPractices: ['Keep business logic in services', 'Use Helmet for security headers', 'Rate limit your APIs']
        },
        django: {
            stack: 'Python + Django',
            structure: 'myproject/\n ├── manage.py\n ├── myproject/\n │   ├── settings.py\n │   ├── urls.py\n │   └── wsgi.py\n ├── myapp/\n │   ├── models.py\n │   ├── views.py\n │   └── urls.py\n └── requirements.txt',
            commands: ['python -m venv venv', 'source venv/bin/activate', 'pip install django', 'django-admin startproject myproject', 'python manage.py runserver'],
            tools: ['PyCharm or VS Code', 'PostgreSQL', 'Django Debug Toolbar'],
            bestPractices: ['Use environment variables with django-environ', 'Keep apps small and single-purpose', 'Use Django ORM efficiently (select_related)']
        },
        springboot: {
            stack: 'Java + Spring Boot',
            structure: 'src/\n ├── main/\n │   ├── java/\n │   │   └── com/example/demo/\n │   │       ├── controller/\n │   │       ├── service/\n │   │       ├── repository/\n │   │       ├── model/\n │   │       └── DemoApplication.java\n │   └── resources/\n │       └── application.yml\n └── test/',
            commands: ['# Use Spring Initializr (start.spring.io)', './mvnw spring-boot:run'],
            tools: ['IntelliJ IDEA', 'Maven/Gradle', 'Postman'],
            bestPractices: ['Use DTOs (Data Transfer Objects)', 'Keep controllers clean, delegate to services', 'Use constructor injection instead of @Autowired field injection']
        }
    },
    fullstack: {
        mern: {
            stack: 'MERN Stack (MongoDB, Express, React, Node)',
            structure: 'project-root/\n ├── backend/\n │   ├── controllers/\n │   ├── models/\n │   ├── routes/\n │   └── server.js\n └── frontend/\n     ├── src/\n     │   ├── components/\n     │   ├── pages/\n     │   └── App.jsx\n     └── package.json',
            commands: ['mkdir mern-app && cd mern-app', 'mkdir backend frontend', 'cd backend && npm init -y && npm i express mongoose dotenv cors', 'cd ../frontend && npm create vite@latest . -- --template react'],
            tools: ['MongoDB Compass', 'Postman', 'VS Code', 'React DevTools'],
            bestPractices: ['Separate backend and frontend concerns', 'Use JWT for authentication', 'Implement centralized error handling in backend']
        },
        mean: {
            stack: 'MEAN Stack (MongoDB, Express, Angular, Node)',
            structure: 'project-root/\n ├── backend/\n │   ├── controllers/\n │   ├── models/\n │   ├── routes/\n │   └── server.js\n └── frontend/\n     ├── src/\n     │   ├── app/\n     │   └── assets/\n     └── angular.json',
            commands: ['mkdir mean-app && cd mean-app', 'mkdir backend frontend', 'cd backend && npm init -y && npm i express mongoose', 'cd ../frontend && ng new client'],
            tools: ['MongoDB Compass', 'Angular CLI', 'VS Code'],
            bestPractices: ['Use Mongoose for schema validation', 'Leverage RxJS in Angular for async operations', 'Keep API routes RESTful']
        },
        nextnode: {
            stack: 'Next.js + Node.js Custom Backend',
            structure: 'project-root/\n ├── api/\n │   ├── src/\n │   │   ├── routes/\n │   │   └── server.js\n │   └── package.json\n └── web/\n     ├── src/\n     │   ├── app/\n     │   └── components/\n     └── package.json',
            commands: ['mkdir next-node && cd next-node', 'mkdir api web', 'cd api && npm init -y && npm i express', 'cd ../web && npx create-next-app@latest .'],
            tools: ['Docker', 'VS Code', 'Postman'],
            bestPractices: ['Use monorepo tools like Turborepo if project grows', 'Share types between frontend and backend if using TS', 'Configure CORS properly on backend']
        }
    },
    mobile: {
        flutter: {
            stack: 'Flutter (Dart)',
            structure: 'lib/\n ├── core/\n │   ├── constants/\n │   ├── theme/\n │   └── utils/\n ├── features/\n │   ├── auth/\n │   ├── home/\n │   └── profile/\n ├── widgets/\n └── main.dart',
            commands: ['flutter create my_app', 'cd my_app', 'flutter run'],
            tools: ['Android Studio / VS Code', 'Flutter DevTools', 'iOS Simulator / Android Emulator'],
            bestPractices: ['Use a state management solution (Riverpod, Bloc, Provider)', 'Separate UI from business logic', 'Extract reusable widgets']
        },
        reactnative: {
            stack: 'React Native (Expo)',
            structure: 'src/\n ├── assets/\n ├── components/\n │   └── common/\n ├── constants/\n ├── hooks/\n ├── navigation/\n ├── screens/\n ├── store/\n └── App.js',
            commands: ['npx create-expo-app my-app', 'cd my-app', 'npm start'],
            tools: ['Expo Go App', 'React Native Debugger', 'VS Code'],
            bestPractices: ['Use StyleSheet.create for styling', 'Optimize lists with FlatList/SectionList', 'Avoid inline functions in render methods']
        }
    }
};

// Tool specific logic to append to commands/best practices
const toolsDB = {
    eslint: { command: 'npm install -D eslint', practice: 'Configure ESLint rules based on your team preferences.' },
    prettier: { command: 'npm install -D prettier eslint-config-prettier', practice: 'Set up Prettier to run on save in your editor.' },
    git: { command: 'git init\ncat > .gitignore << EOL\nnode_modules/\n.env\ndist/\nbuild/\nEOL', practice: 'Use descriptive commit messages and branch naming conventions.' },
    docker: { command: 'touch Dockerfile docker-compose.yml', practice: 'Use multi-stage builds to minimize image size.' },
    tailwindcss: { command: 'npm install -D tailwindcss postcss autoprefixer\nnpx tailwindcss init -p', practice: 'Extract reusable classes into components.' },
    testing: { command: 'npm install -D jest @testing-library/react', practice: 'Write unit tests for utils and integration tests for key workflows.' }
};

// DOM Elements
const projectTypeSelect = document.getElementById('projectType');
const frameworkSelect = document.getElementById('framework');
const generatorForm = document.getElementById('generatorForm');
const loadingSpinner = document.getElementById('loadingSpinner');
const btnText = document.querySelector('.btn-text');
const emptyState = document.getElementById('emptyState');
const resultContainer = document.getElementById('resultContainer');
const outputCode = document.getElementById('outputCode');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const toast = document.getElementById('toast');
const statsCounter = document.getElementById('statsCounter');
const themeToggle = document.getElementById('themeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');

// State
let generatedCount = 0;
let currentOutputText = '';

// Initialize
function init() {
    loadPreferences();
    updateFrameworkOptions();
    
    // Event Listeners
    projectTypeSelect.addEventListener('change', () => {
        updateFrameworkOptions();
        savePreferences();
    });
    
    document.getElementById('language').addEventListener('change', savePreferences);
    frameworkSelect.addEventListener('change', savePreferences);
    
    const checkboxes = document.querySelectorAll('input[name="tools"]');
    checkboxes.forEach(cb => cb.addEventListener('change', savePreferences));

    generatorForm.addEventListener('submit', handleGenerate);
    copyBtn.addEventListener('click', copySetup);
    downloadBtn.addEventListener('click', downloadSetup);
    themeToggle.addEventListener('click', toggleTheme);
}

// Update Framework Dropdown based on Project Type
function updateFrameworkOptions() {
    const type = projectTypeSelect.value;
    frameworkSelect.innerHTML = '';
    
    const frameworks = Object.keys(recommendationDB[type]);
    
    frameworks.forEach(fw => {
        const option = document.createElement('option');
        option.value = fw;
        // Format name (e.g. reactnative -> React Native)
        let name = recommendationDB[type][fw].stack.split(' ')[0];
        if (fw === 'reactnative') name = 'React Native';
        if (fw === 'springboot') name = 'Spring Boot';
        if (fw === 'nodejs') name = 'Node.js';
        
        option.textContent = name;
        frameworkSelect.appendChild(option);
    });

    // Try to restore framework from preferences if applicable
    const savedPrefs = JSON.parse(localStorage.getItem('devEnvPrefs'));
    if (savedPrefs && savedPrefs.framework && frameworks.includes(savedPrefs.framework) && savedPrefs.projectType === type) {
        frameworkSelect.value = savedPrefs.framework;
    }
}

// Handle Form Submission
function handleGenerate(e) {
    e.preventDefault();
    
    // UI Loading state
    btnText.textContent = 'Generating...';
    loadingSpinner.classList.remove('hidden');
    emptyState.classList.add('hidden');
    resultContainer.classList.add('hidden');
    
    // Simulate processing time for realistic feel
    setTimeout(() => {
        generateEnvironment();
        
        // Reset UI loading state
        btnText.textContent = 'Generate Environment';
        loadingSpinner.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        
        // Update stats
        generatedCount++;
        animateCounter(statsCounter, generatedCount - 1, generatedCount);
        localStorage.setItem('devEnvCount', generatedCount);
        
    }, 1200);
}

// Generate the recommendation output
function generateEnvironment() {
    const type = projectTypeSelect.value;
    const fw = frameworkSelect.value;
    const selectedTools = Array.from(document.querySelectorAll('input[name="tools"]:checked')).map(cb => cb.value);
    
    const baseData = recommendationDB[type][fw];
    if (!baseData) return;

    let finalCommands = [...baseData.commands];
    let finalPractices = [...baseData.bestPractices];
    let selectedToolsNames = [...baseData.tools];

    // Append tools logic
    selectedTools.forEach(tool => {
        if (toolsDB[tool]) {
            finalCommands.push(toolsDB[tool].command);
            finalPractices.push(toolsDB[tool].practice);
            selectedToolsNames.push(tool.charAt(0).toUpperCase() + tool.slice(1));
        }
    });

    // Construct HTML for output
    const outputHTML = `
<span class="section-title"># 1. Recommended Stack</span>
${baseData.stack}

<span class="section-title"># 2. Setup Commands</span>
<span class="command">${finalCommands.join('\n')}</span>

<span class="section-title"># 3. Recommended Folder Structure</span>
<span class="file-tree">${baseData.structure}</span>

<span class="section-title"># 4. Recommended Tools</span>
- ${selectedToolsNames.join('\n- ')}

<span class="section-title"># 5. Best Practices</span>
- ${finalPractices.join('\n- ')}
`;

    // Construct plain text for copy/download
    currentOutputText = `
Recommended Stack
=================
${baseData.stack}

Setup Commands
==============
${finalCommands.join('\n')}

Recommended Folder Structure
============================
${baseData.structure}

Recommended Tools
=================
- ${selectedToolsNames.join('\n- ')}

Best Practices
==============
- ${finalPractices.join('\n- ')}
`;

    outputCode.textContent = outputHTML.trim();
}

// Copy to Clipboard
function copySetup() {
    if (!currentOutputText) return;
    
    navigator.clipboard.writeText(currentOutputText).then(() => {
        showToast();
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        // Fallback for older browsers not implemented for brevity
    });
}

// Download as Text File
function downloadSetup() {
    if (!currentOutputText) return;
    
    const blob = new Blob([currentOutputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'setup.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Show Toast Notification
function showToast() {
    toast.classList.remove('hidden');
    // small delay to allow display block to apply before adding animation class
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 400); // Wait for transition
    }, 3000);
}

// Animate Counter
function animateCounter(element, start, end) {
    let current = start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(500 / (end - start)));
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// Save Preferences to LocalStorage
function savePreferences() {
    const prefs = {
        projectType: projectTypeSelect.value,
        language: document.getElementById('language').value,
        framework: frameworkSelect.value,
        tools: Array.from(document.querySelectorAll('input[name="tools"]:checked')).map(cb => cb.value)
    };
    localStorage.setItem('devEnvPrefs', JSON.stringify(prefs));
}

// Load Preferences from LocalStorage
function loadPreferences() {
    // Load Stats
    const savedCount = localStorage.getItem('devEnvCount');
    if (savedCount) {
        generatedCount = parseInt(savedCount, 10);
        statsCounter.textContent = generatedCount;
    }

    // Load Theme
    const savedTheme = localStorage.getItem('devEnvTheme');
    if (savedTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }

    // Load Form Data
    const savedPrefs = localStorage.getItem('devEnvPrefs');
    if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs);
        if (prefs.projectType) projectTypeSelect.value = prefs.projectType;
        if (prefs.language) document.getElementById('language').value = prefs.language;
        
        // tools
        if (prefs.tools) {
            const checkboxes = document.querySelectorAll('input[name="tools"]');
            checkboxes.forEach(cb => {
                cb.checked = prefs.tools.includes(cb.value);
            });
        }
    }
}

// Toggle Theme
function toggleTheme() {
    const isLight = document.body.getAttribute('data-theme') === 'light';
    
    if (isLight) {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('devEnvTheme', 'dark');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    } else {
        document.body.setAttribute('data-theme', 'light');
        localStorage.setItem('devEnvTheme', 'light');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }
}

// Run init on load
document.addEventListener('DOMContentLoaded', init);
