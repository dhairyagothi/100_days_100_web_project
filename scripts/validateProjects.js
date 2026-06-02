const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const projectsPath = path.join(repoRoot, 'projects.json');
const allowedDifficulties = new Set(['beginner', 'intermediate', 'advanced']);
const requiredStringFields = ['projectName', 'projectDesc', 'projectPath'];
const errors = [];

function addError(message) {
  errors.push(message);
}

function getProjectLabel(project, index) {
  const number = project && project.projectNo !== undefined ? `#${project.projectNo}` : `at index ${index}`;
  const name = project && project.projectName ? ` "${project.projectName}"` : '';
  return `Project ${number}${name}`;
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isExternalUrl(value) {
  return /^https?:\/\//i.test(value);
}

function validateExternalUrl(value, label) {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) {
      addError(`${label}: projectPath must use http or https for external URLs.`);
    }
  } catch {
    addError(`${label}: projectPath is not a valid URL.`);
  }
}

function validateLocalPath(value, label) {
  const normalizedPath = value.replace(/^\.\//, '');
  let decodedPath = normalizedPath;

  try {
    decodedPath = decodeURIComponent(normalizedPath);
  } catch {
    addError(`${label}: projectPath contains invalid URL encoding.`);
    return;
  }

  const resolvedPath = path.resolve(repoRoot, decodedPath);

  if (!resolvedPath.startsWith(repoRoot + path.sep) && resolvedPath !== repoRoot) {
    addError(`${label}: projectPath resolves outside the repository.`);
    return;
  }

  if (!fs.existsSync(resolvedPath)) {
    addError(`${label}: projectPath does not exist: ${value}`);
  }
}

function validateProject(project, index, projectNumbers) {
  const label = getProjectLabel(project, index);

  if (!project || typeof project !== 'object' || Array.isArray(project)) {
    addError(`Project at index ${index}: entry must be an object.`);
    return;
  }

  if (typeof project.projectNo !== 'number' || !Number.isInteger(project.projectNo)) {
    addError(`${label}: projectNo must be an integer.`);
  } else if (projectNumbers.has(project.projectNo)) {
    const firstProject = projectNumbers.get(project.projectNo);
    addError(
      `${label}: duplicate projectNo ${project.projectNo}; already used by "${firstProject.projectName || 'Unnamed project'}".`
    );
  } else {
    projectNumbers.set(project.projectNo, project);
  }

  requiredStringFields.forEach((field) => {
    if (!isNonEmptyString(project[field])) {
      addError(`${label}: ${field} must be a non-empty string.`);
    }
  });

  if (!isNonEmptyString(project.difficulty)) {
    addError(`${label}: difficulty must be a non-empty string.`);
  } else if (!allowedDifficulties.has(project.difficulty)) {
    addError(
      `${label}: invalid difficulty "${project.difficulty}". Use beginner, intermediate, or advanced.`
    );
  }

  if (!Array.isArray(project.techStack)) {
    addError(`${label}: techStack must be an array.`);
  } else if (project.techStack.length === 0) {
    addError(`${label}: techStack must include at least one item.`);
  } else {
    project.techStack.forEach((tech, techIndex) => {
      if (!isNonEmptyString(tech)) {
        addError(`${label}: techStack[${techIndex}] must be a non-empty string.`);
      }
    });
  }

  if (isNonEmptyString(project.projectPath)) {
    if (isExternalUrl(project.projectPath)) {
      validateExternalUrl(project.projectPath, label);
    } else {
      validateLocalPath(project.projectPath, label);
    }
  }
}

function main() {
  if (!fs.existsSync(projectsPath)) {
    addError('projects.json was not found at the repository root.');
  }

  let projects;

  if (errors.length === 0) {
    try {
      projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
    } catch (error) {
      addError(`projects.json could not be parsed: ${error.message}`);
    }
  }

  if (errors.length === 0 && !Array.isArray(projects)) {
    addError('projects.json must contain an array of project entries.');
  }

  if (errors.length === 0) {
    const projectNumbers = new Map();
    projects.forEach((project, index) => validateProject(project, index, projectNumbers));
  }

  if (errors.length > 0) {
    console.error('projects.json validation failed:');
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log(`projects.json validation passed. Checked ${projects.length} projects.`);
}

main();
