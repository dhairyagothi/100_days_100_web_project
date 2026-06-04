const fs = require('fs');
const path = require('path');

const projectsPath = path.join(__dirname, '..', 'projects.json');
const rootDir = path.join(__dirname, '..');

try {
  const data = fs.readFileSync(projectsPath, 'utf8');
  const projects = JSON.parse(data);

  if (!Array.isArray(projects)) {
    console.error('Validation Error: projects.json must be a JSON Array');
    process.exit(1);
  }

  const errors = [];
  const seenProjectNos = new Set();
  const seenProjectPaths = new Set();

  projects.forEach((project, index) => {
    const requiredKeys = ['projectNo', 'projectName', 'techStack', 'difficulty', 'projectPath'];
    
    // 1. Validate required fields presence
    requiredKeys.forEach(key => {
      if (project[key] === undefined || project[key] === null || project[key] === '') {
        errors.push(`Index ${index}: Missing or empty required field "${key}"`);
      }
    });

    // 2. Validate field types and duplicate detection
    if (project.projectNo !== undefined && project.projectNo !== null) {
      if (typeof project.projectNo !== 'number') {
        errors.push(`Index ${index}: "projectNo" must be a number, got "${typeof project.projectNo}"`);
      } else {
        // Detect duplicate projectNo values
        if (seenProjectNos.has(project.projectNo)) {
          errors.push(`Index ${index} (Day ${project.projectNo} - ${project.projectName || 'Unnamed'}): Duplicate projectNo "${project.projectNo}"`);
        } else {
          seenProjectNos.add(project.projectNo);
        }
      }
    }

    if (project.projectName !== undefined && project.projectName !== null && project.projectName !== '') {
      if (typeof project.projectName !== 'string') {
        errors.push(`Index ${index}: "projectName" must be a string, got "${typeof project.projectName}"`);
      }
    }

    if (project.techStack !== undefined && project.techStack !== null) {
      if (!Array.isArray(project.techStack)) {
        errors.push(`Index ${index}: "techStack" must be an array, got "${typeof project.techStack}"`);
      }
    }

    if (project.difficulty !== undefined && project.difficulty !== null && project.difficulty !== '') {
      if (typeof project.difficulty !== 'string') {
        errors.push(`Index ${index}: "difficulty" must be a string, got "${typeof project.difficulty}"`);
      }
    }

    if (project.projectPath !== undefined && project.projectPath !== null && project.projectPath !== '') {
      if (typeof project.projectPath !== 'string') {
        errors.push(`Index ${index}: "projectPath" must be a string, got "${typeof project.projectPath}"`);
      } else {
        // Detect duplicate projectPath values
        if (seenProjectPaths.has(project.projectPath)) {
          errors.push(`Index ${index} (Day ${project.projectNo || 'Unknown'} - ${project.projectName || 'Unnamed'}): Duplicate projectPath "${project.projectPath}"`);
        } else {
          seenProjectPaths.add(project.projectPath);
        }

        // Validate local path existence (or allow external URLs)
        const isExternalUrl = project.projectPath.startsWith('http://') || project.projectPath.startsWith('https://');
        if (!isExternalUrl) {
          let relPath = project.projectPath;
          // Strip query parameters and hashes
          relPath = relPath.split('?')[0].split('#')[0];
          // Decode URI encoded components (e.g. %20 -> space)
          try {
            relPath = decodeURIComponent(relPath);
          } catch (e) {
            errors.push(`Index ${index}: Failed to decode URI component for projectPath "${relPath}"`);
          }

          const resolvedPath = path.resolve(rootDir, relPath);
          if (!fs.existsSync(resolvedPath)) {
            errors.push(`Index ${index} (Day ${project.projectNo || 'Unknown'} - ${project.projectName || 'Unnamed'}): Local path "${relPath}" does not exist in the repository`);
          }
        }
      }
    }
  });

  if (errors.length > 0) {
    console.error('Validation failed with the following errors:\n');
    errors.forEach(err => console.error(`- ${err}`));
    console.error(`\nTotal validation errors: ${errors.length}`);
    process.exit(1);
  }

  console.log('Success: projects.json registry is valid and verified perfectly!');
  process.exit(0);
} catch (error) {
  console.error('Validation failed with unexpected error:', error.message);
  process.exit(1);
}

