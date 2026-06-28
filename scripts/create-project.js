#!/usr/bin/env node

// ============================================
// PROJECT SCAFFOLDING TOOL - Issue #8865
// Creates standardized project structure
// ============================================

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ── Questions ──
const questions = [
  { key: 'projectName', question: '📁 Project name (e.g., "Custom Scroll Bar"): ' },
  { key: 'projectDesc', question: '📝 Project description: ' },
  { key: 'dayNumber', question: '📅 Day number: ' },
  { key: 'difficulty', question: '🎯 Difficulty (beginner/intermediate/advanced): ' },
  { key: 'techStack', question: '🛠️ Tech stack (comma separated, e.g., "HTML, CSS, JS"): ' }
];

// ── Functions ──
function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function toKebabCase(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function createProjectFolder(projectName, dayNumber) {
  const folderName = `${String(dayNumber).padStart(2, '0')}_${toKebabCase(projectName)}`;
  const projectPath = path.join(__dirname, '../../public', folderName);
  
  if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath, { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'assets'), { recursive: true });
    fs.mkdirSync(path.join(projectPath, 'assets/images'), { recursive: true });
  }
  
  return projectPath;
}

function copyTemplateFiles(projectPath, answers) {
  const templatePath = path.join(__dirname, 'templates/project-template');
  const files = ['index.html', 'style.css', 'script.js', 'README.md'];
  
  files.forEach(file => {
    let content = fs.readFileSync(path.join(templatePath, file), 'utf8');
    
    // Replace placeholders
    content = content
      .replace(/PROJECT_NAME/g, answers.projectName)
      .replace(/PROJECT_DESCRIPTION/g, answers.projectDesc)
      .replace(/DAY_NUMBER/g, answers.dayNumber)
      .replace(/DIFFICULTY/g, answers.difficulty)
      .replace(/TECH_STACK/g, answers.techStack);
    
    fs.writeFileSync(path.join(projectPath, file), content);
  });
}

function updateProjectsJson(answers) {
  const jsonPath = path.join(__dirname, '../../projects.json');
  const projects = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  const newProject = {
    projectNo: parseInt(answers.dayNumber),
    projectName: answers.projectName,
    projectType: 'Tool',
    projectDesc: answers.projectDesc,
    techStack: answers.techStack.split(',').map(t => t.trim().toLowerCase()),
    difficulty: answers.difficulty,
    projectPath: `./public/${String(answers.dayNumber).padStart(2, '0')}_${toKebabCase(answers.projectName)}/index.html`
  };
  
  // Check if day already exists
  const existingIndex = projects.findIndex(p => p.projectNo === parseInt(answers.dayNumber));
  if (existingIndex !== -1) {
    projects[existingIndex] = newProject;
  } else {
    projects.push(newProject);
    projects.sort((a, b) => a.projectNo - b.projectNo);
  }
  
  fs.writeFileSync(jsonPath, JSON.stringify(projects, null, 2));
}

function updateIndexJs(answers) {
  const indexPath = path.join(__dirname, '../../index.js');
  let content = fs.readFileSync(indexPath, 'utf8');
  
  // Check if already added
  const dayStr = String(answers.dayNumber).padStart(2, '0');
  const searchStr = `Day ${answers.dayNumber}`;
  if (!content.includes(searchStr)) {
    // Find the right place to insert (keeping projects sorted by day)
    const lines = content.split('\n');
    let insertionIndex = lines.findIndex(line => 
      line.includes(`"Day ${parseInt(answers.dayNumber) + 1}"`) ||
      line.includes('const PROJECTS = [')
    );
    
    // Add at appropriate position (simplified)
    if (insertionIndex === -1) {
      // Find end of PROJECTS array
      const endIndex = lines.findIndex((line, i) => 
        i > 0 && line.includes('];') && lines[i-1].includes('],')
      );
      insertionIndex = endIndex;
    }
    
    const newLine = `  ["Day ${answers.dayNumber}",  "${answers.projectName}",  "./public/${String(answers.dayNumber).padStart(2, '0')}_${toKebabCase(answers.projectName)}/index.html",  [${answers.techStack.split(',').map(t => `"${t.trim()}"`).join(',')}],  "${answers.difficulty}"],`;
    
    lines.splice(insertionIndex, 0, newLine);
    fs.writeFileSync(indexPath, lines.join('\n'));
  }
}

// ── Main ──
async function main() {
  console.log('\n🚀 100 Days · 100 Projects - Scaffolding Tool\n');
  console.log('📋 Answer the following questions to create a new project:\n');
  
  const answers = {};
  for (const q of questions) {
    answers[q.key] = await askQuestion(q.question);
  }
  
  console.log('\n📁 Creating project...');
  
  const projectPath = createProjectFolder(answers.projectName, answers.dayNumber);
  copyTemplateFiles(projectPath, answers);
  updateProjectsJson(answers);
  updateIndexJs(answers);
  
  console.log(`\n✅ Project created successfully at: ${projectPath}`);
  console.log('\n📋 Next steps:');
  console.log(`  1. cd ${projectPath}`);
  console.log('  2. Add your project code');
  console.log('  3. git add . && git commit -m "Add project"');
  console.log('  4. git push\n');
  
  rl.close();
}

main().catch(console.error);