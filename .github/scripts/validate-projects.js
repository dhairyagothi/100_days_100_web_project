const fs = require('fs');
const path = require('path');

const projectsPath = path.join(__dirname, '../../projects.json');

console.log('🔍 Starting validation of projects.json...');

if (!fs.existsSync(projectsPath)) {
  console.error('❌ Error: projects.json file does not exist at path: ' + projectsPath);
  process.exit(1);
}

let data;
try {
  const content = fs.readFileSync(projectsPath, 'utf8');
  data = JSON.parse(content);
} catch (error) {
  console.error('❌ Error: projects.json is not valid JSON!');
  console.error(error.message);
  process.exit(1);
}

if (!Array.isArray(data)) {
  console.error('❌ Error: projects.json root must be a JSON array.');
  process.exit(1);
}

console.log(`✅ JSON is valid. Found ${data.length} registered projects.`);

const requiredFields = ['projectNo', 'projectName', 'projectType', 'projectDesc', 'techStack', 'difficulty', 'projectPath'];
const validDifficulties = ['beginner', 'intermediate', 'advanced'];

let errors = [];

data.forEach((project, idx) => {
  const label = `Project #${project.projectNo || idx + 1} (${project.projectName || 'Unnamed'})`;

  // 1. Check required fields
  requiredFields.forEach(field => {
    if (project[field] === undefined || project[field] === null || project[field] === '') {
      errors.push(`${label}: Missing required field "${field}"`);
    }
  });

  // 2. Validate types
  if (project.projectNo && typeof project.projectNo !== 'number') {
    errors.push(`${label}: "projectNo" must be a number.`);
  }

  if (project.techStack && !Array.isArray(project.techStack)) {
    errors.push(`${label}: "techStack" must be an array of strings.`);
  }

  if (project.difficulty && !validDifficulties.includes(project.difficulty.toLowerCase())) {
    errors.push(`${label}: "difficulty" ("${project.difficulty}") must be one of: ${validDifficulties.join(', ')}`);
  }

  // 3. Verify local directory / file path exists
  if (project.projectPath) {
    const pathStr = project.projectPath.trim();
    if (pathStr.startsWith('./public/')) {
      // Decode URL encoding like %20 to space
      const decodedPath = decodeURIComponent(pathStr.substring(2));
      const targetFilePath = path.join(__dirname, '../../', decodedPath);
      
      if (!fs.existsSync(targetFilePath)) {
        errors.push(`${label}: Local file path specified in "projectPath" does not exist: "${pathStr}" (Resolved path: "${targetFilePath}")`);
      }
    } else if (pathStr.startsWith('public/')) {
      const decodedPath = decodeURIComponent(pathStr);
      const targetFilePath = path.join(__dirname, '../../', decodedPath);
      
      if (!fs.existsSync(targetFilePath)) {
        errors.push(`${label}: Local file path specified in "projectPath" does not exist: "${pathStr}" (Resolved path: "${targetFilePath}")`);
      }
    }
  }
});

if (errors.length > 0) {
  console.error('\n❌ Integrity validation failed with the following errors:\n');
  errors.forEach(err => console.error(`  - ${err}`));
  console.error(`\nTotal Errors Found: ${errors.length}`);
  process.exit(1);
} else {
  console.log('\n🎉 Success: projects.json integrity is 100% valid! No broken paths or malformed schemas found.');
  process.exit(0);
}
