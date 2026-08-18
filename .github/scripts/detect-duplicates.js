const fs = require('fs');
const path = require('path');

// Going up two levels from '.github/scripts/' to reach repository root
const projectsPath = path.join(__dirname, '../../projects.json');

console.log('🔍 Starting comprehensive duplicate and constraints check on projects.json...');

if (!fs.existsSync(projectsPath)) {
  console.error('❌ Error: projects.json does not exist at ' + projectsPath);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
} catch (error) {
  console.error('❌ Error parsing projects.json: ' + error.message);
  process.exit(1);
}

if (!Array.isArray(data)) {
  console.error('❌ Error: projects.json root must be an array.');
  process.exit(1);
}

const dayRegistry = new Map();
const nameRegistry = new Map();
const pathRegistry = new Map();

let issueFound = false;

data.forEach((project, idx) => {
  const lineNo = idx + 1;
  
  // Clean values safely to prevent crashes on undefined or non-string fields
  const day = project.projectNo;
  const name = typeof project.projectName === 'string' ? project.projectName.trim() : '';
  const desc = typeof project.projectDesc === 'string' ? project.projectDesc.trim() : '';
  let rawPath = typeof project.projectPath === 'string' ? project.projectPath.trim() : '';

  const label = `Item #${lineNo} (Day: ${day || 'N/A'}, Name: "${name || 'Unnamed'}")`;

  // --- 1. STRING LENGTH CONSTRAINTS (Enforcing Schema rules) ---
  if (name.length > 120) {
    console.error(`❌ Data Limit Error: ${label} "projectName" exceeds maximum length of 120 characters.`);
    issueFound = true;
  }
  if (desc.length > 500) {
    console.error(`❌ Data Limit Error: ${label} "projectDesc" exceeds maximum length of 500 characters.`);
    issueFound = true;
  }

  // --- 2. DUPLICATE DAY NUMBER CHECK ---
  if (day !== undefined && day !== null && typeof day === 'number') {
    if (dayRegistry.has(day)) {
      console.error(`❌ Duplicate Day Number Found: Day "${day}" is registered multiple times.`);
      console.error(`   - First instance: Index ${dayRegistry.get(day).index} ("${dayRegistry.get(day).name}")`);
      console.error(`   - Duplicate instance: Index ${lineNo} ("${name}")`);
      issueFound = true;
    } else {
      dayRegistry.set(day, { index: lineNo, name: name });
    }
  }

  // --- 3. DUPLICATE PROJECT NAME CHECK ---
  if (name) {
    const lowerName = name.toLowerCase();
    if (nameRegistry.has(lowerName)) {
      console.warn(`⚠️ Warning: Duplicate Project Name detected: "${name}"`);
      console.warn(`   - First instance: Index ${nameRegistry.get(lowerName).index} (Day ${nameRegistry.get(lowerName).day})`);
      console.warn(`   - Duplicate instance: Index ${lineNo} (Day ${day})`);
    } else {
      nameRegistry.set(lowerName, { index: lineNo, day: day });
    }
  }

  // --- 4. DUPLICATE PATH CHECK (With Normalization) ---
  // Ignore external links if your repo allows them, otherwise track them
  if (rawPath && (rawPath.startsWith('http://') || rawPath.startsWith('https://'))) {
    rawPath = ''; 
  }

  if (rawPath) {
    // Enforce uniform path style check (regex protection from schema)
    if (!/^\.\/public\/.+\.html$/.test(rawPath) && !/^public\/.+\.html$/.test(rawPath)) {
      console.error(`❌ Path Format Error: ${label} "projectPath" ("${rawPath}") must point to a file inside public/ ending with .html`);
      issueFound = true;
    }

    // Normalize path strings to catch alternative formats matching the same file 
    // (e.g. "public/day1/index.html" vs "./public/day1/index.html")
    let normalizedPath = rawPath.toLowerCase();
    if (normalizedPath.startsWith('./')) {
      normalizedPath = normalizedPath.substring(2);
    }

    if (pathRegistry.has(normalizedPath)) {
      console.error(`❌ Duplicate File Path Found: path "${rawPath}" is claimed by multiple projects.`);
      console.error(`   - First instance: Index ${pathRegistry.get(normalizedPath).index} ("${pathRegistry.get(normalizedPath).name}", Day ${pathRegistry.get(normalizedPath).day})`);
      console.error(`   - Duplicate instance: Index ${lineNo} ("${name}", Day ${day})`);
      issueFound = true;
    } else {
      pathRegistry.set(normalizedPath, { index: lineNo, name: name, day: day });
    }
  }
});

if (issueFound) {
  console.error('\n❌ Validation completed with blocking errors. PR check failed.');
  process.exit(1);
} else {
  console.log('\n🎉 Success: No duplicate day numbers, file paths, or length constraint violations found.');
  process.exit(0);
}
