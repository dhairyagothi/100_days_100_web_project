const fs = require('fs');
const path = require('path');

// Going up two levels from '.github/scripts/' to reach the repository root
const projectsPath = path.join(__dirname, '../../projects.json');

console.log('🔍 Starting comprehensive structural integrity check on projects.json...');

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

console.log(`✅ JSON structure is valid. Validating ${data.length} project schemas...`);

const requiredFields = ['projectNo', 'projectName', 'projectType', 'projectDesc', 'techStack', 'difficulty', 'projectPath'];
const validDifficulties = ['beginner', 'intermediate', 'advanced'];

let errors = [];

data.forEach((project, idx) => {
  const lineNo = idx + 1;
  const label = `Project at Index ${lineNo} (Day: ${project.projectNo || 'Missing'}, Name: "${project.projectName || 'Unnamed'}")`;

  // 1. Strict null / undefined / empty field checking
  requiredFields.forEach(field => {
    if (project[field] === undefined || project[field] === null || String(project[field]).trim() === '') {
      errors.push(`${label}: Missing required field "${field}"`);
    }
  });

  // 2. Exact Type and Length Constraints (Replacing Schema)
  if (project.projectNo !== undefined && project.projectNo !== null) {
    if (typeof project.projectNo !== 'number' || !Number.isInteger(project.projectNo) || project.projectNo < 1) {
      errors.push(`${label}: "projectNo" must be a positive integer.`);
    }
  }

  if (typeof project.projectName === 'string') {
    if (project.projectName.trim().length > 120) {
      errors.push(`${label}: "projectName" exceeds the limit of 120 characters.`);
    }
  }

  if (typeof project.projectDesc === 'string') {
    if (project.projectDesc.trim().length > 500) {
      errors.push(`${label}: "projectDesc" exceeds the limit of 500 characters.`);
    }
  }

  // Strict Array Content Check
  if (project.techStack) {
    if (!Array.isArray(project.techStack)) {
      errors.push(`${label}: "techStack" must be an array.`);
    } else if (project.techStack.length === 0) {
      errors.push(`${label}: "techStack" cannot be an empty array. Provide at least one technology tag.`);
    } else {
      project.techStack.forEach((tech, sIdx) => {
        if (typeof tech !== 'string' || tech.trim() === '') {
          errors.push(`${label}: "techStack" index [${sIdx}] contains an invalid or empty string.`);
        }
      });
    }
  }

  if (project.difficulty && typeof project.difficulty === 'string') {
    if (!validDifficulties.includes(project.difficulty.toLowerCase())) {
      errors.push(`${label}: "difficulty" ("${project.difficulty}") must be one of: ${validDifficulties.join(', ')}`);
    }
  }

  // 3. Strict Regex + Physical File Path Verification
  if (typeof project.projectPath === 'string' && project.projectPath.trim() !== '') {
    const pathStr = project.projectPath.trim();

    // Enforce schema regex pattern rule
    const validPathRegex = /^(\.\/)?public\/.+\.html$/;
    if (!validPathRegex.test(pathStr)) {
      errors.push(`${label}: "projectPath" ("${pathStr}") must be a local file path starting with 'public/' or './public/' and ending with '.html'`);
    } else {
      // Resolve path properly to check local disk availability
      let cleanRelativePath = pathStr;
      if (cleanRelativePath.startsWith('./')) {
        cleanRelativePath = cleanRelativePath.substring(2);
      }

      const decodedPath = decodeURIComponent(cleanRelativePath);
      const targetFilePath = path.join(__dirname, '../../', decodedPath);

      if (!fs.existsSync(targetFilePath)) {
        errors.push(`${label}: Physical file does not exist at path: "${pathStr}"`);
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
  console.log('\n🎉 Success: projects.json structural constraints match 100%! All files accounted for.');
  process.exit(0);
}
