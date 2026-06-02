const fs = require('fs');
const path = require('path');

const projectsPath = path.join(__dirname, '../../projects.json');

console.log('🔍 Starting duplicate checks on projects.json...');

if (!fs.existsSync(projectsPath)) {
  console.error('❌ Error: projects.json does not exist!');
  process.exit(1);
}

let data;
try {
  data = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
} catch (error) {
  console.error('❌ Error parsing projects.json: ' + error.message);
  process.exit(1);
}

const dayRegistry = new Map();
const nameRegistry = new Map();
const pathRegistry = new Map();

let duplicateFound = false;

data.forEach((project, idx) => {
  const lineNo = idx + 1;
  const day = project.projectNo;
  const name = project.projectName ? project.projectName.trim() : null;
  let rawPath = project.projectPath ? project.projectPath.trim() : null;

  // Ignore external source urls when checking for path duplicates
  if (rawPath && (rawPath.startsWith('http://') || rawPath.startsWith('https://'))) {
    rawPath = null;
  }

  // 1. Check duplicate day number
  if (day !== undefined && day !== null) {
    if (dayRegistry.has(day)) {
      console.error(`❌ Duplicate Day Number Found: Day "${day}" is registered multiple times.`);
      console.error(`   - First instance: Index ${dayRegistry.get(day).index} ("${dayRegistry.get(day).name}")`);
      console.error(`   - Duplicate instance: Index ${lineNo} ("${name}")`);
      duplicateFound = true;
    } else {
      dayRegistry.set(day, { index: lineNo, name: name });
    }
  }

  // 2. Check duplicate project name
  if (name) {
    const lowerName = name.toLowerCase();
    if (nameRegistry.has(lowerName)) {
      console.warn(`⚠️ Warning: Duplicate Project Name detected: "${name}"`);
      console.warn(`   - First instance: Index ${nameRegistry.get(lowerName).index} (Day ${nameRegistry.get(lowerName).day})`);
      console.warn(`   - Duplicate instance: Index ${lineNo} (Day ${day})`);
      // Note: We flag duplicate names as warning or error based on project standards, let's treat it as a warning
    } else {
      nameRegistry.set(lowerName, { index: lineNo, day: day });
    }
  }

  // 3. Check duplicate physical file path (extremely critical!)
  if (rawPath) {
    const lowerPath = rawPath.toLowerCase();
    if (pathRegistry.has(lowerPath)) {
      console.error(`❌ Duplicate File Path Found: path "${rawPath}" is claimed by multiple projects.`);
      console.error(`   - First instance: Index ${pathRegistry.get(lowerPath).index} ("${pathRegistry.get(lowerPath).name}", Day ${pathRegistry.get(lowerPath).day})`);
      console.error(`   - Duplicate instance: Index ${lineNo} ("${name}", Day ${day})`);
      duplicateFound = true;
    } else {
      pathRegistry.set(lowerPath, { index: lineNo, name: name, day: day });
    }
  }
});

if (duplicateFound) {
  console.error('\n❌ Duplicate detection completed with blocking errors. Please fix duplicate day numbers or paths in projects.json.');
  process.exit(1);
} else {
  console.log('\n🎉 Success: No duplicate day numbers or file paths found! Registry integrity is intact.');
  process.exit(0);
}
