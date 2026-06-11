const fs = require('fs');
const path = require('path');

const projectsPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(__dirname, '..', 'projects.json');
const rootDir = process.argv[3]
  ? path.resolve(process.argv[3])
  : path.join(__dirname, '..');

const VALID_DIFFICULTIES = new Set(['beginner', 'intermediate', 'advanced']);
const REQUIRED_KEYS = ['projectNo', 'projectName', 'techStack', 'difficulty', 'projectPath'];
const UNSAFE_PROTOCOL_RE = /^(?:javascript|data|vbscript):/i;
const URL_SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i;
const EXPECTED_GITHUB_REPOSITORY = 'dhairyagothi/100_days_100_web_project';

function formatProjectLabel(index, project = {}) {
  const day = project.projectNo || 'Unknown';
  const name = project.projectName || 'Unnamed';
  return `Index ${index} (Day ${day} - ${name})`;
}

function addFieldError(errors, index, project, fieldName, message) {
  errors.push(`${formatProjectLabel(index, project)}: "${fieldName}" ${message}`);
}

function isExternalHttpUrl(value) {
  return /^https?:\/\//i.test(value);
}

function isGitHubUrl(parsedUrl) {
  const hostname = parsedUrl.hostname.toLowerCase();
  return hostname === 'github.com' || hostname === 'www.github.com';
}

function getGitHubRepository(pathname) {
  const [owner, repo] = pathname
    .split('/')
    .filter(Boolean)
    .map(segment => segment.toLowerCase());

  return owner && repo ? `${owner}/${repo}` : null;
}

function hasPathTraversal(value) {
  return value
    .replace(/\\/g, '/')
    .split('/')
    .some(segment => segment === '..');
}

function resolvesInsideRoot(resolvedPath) {
  const relativePath = path.relative(rootDir, resolvedPath);
  return relativePath === '' || (!relativePath.startsWith('..') && !path.isAbsolute(relativePath));
}

function validateExternalUrl(projectPath, index, project, errors) {
  let parsedUrl;

  try {
    parsedUrl = new URL(projectPath);
  } catch (_error) {
    addFieldError(errors, index, project, 'projectPath', 'must be a valid http(s) URL');
    return;
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    addFieldError(errors, index, project, 'projectPath', 'must use http or https');
    return;
  }

  if (isGitHubUrl(parsedUrl) && getGitHubRepository(parsedUrl.pathname) !== EXPECTED_GITHUB_REPOSITORY) {
    addFieldError(errors, index, project, 'projectPath', 'GitHub URLs must point to this repository');
  }
}

function validateLocalPath(projectPath, index, project, errors) {
  let relPath = projectPath.split('?')[0].split('#')[0];

  try {
    relPath = decodeURIComponent(relPath);
  } catch (_error) {
    addFieldError(errors, index, project, 'projectPath', `failed to decode URI component for "${relPath}"`);
    return;
  }

  if (hasPathTraversal(relPath)) {
    addFieldError(errors, index, project, 'projectPath', 'must not contain path traversal');
  }

  const resolvedPath = path.resolve(rootDir, relPath);

  if (!resolvesInsideRoot(resolvedPath)) {
    addFieldError(errors, index, project, 'projectPath', 'must resolve inside the repository root');
    return;
  }

  if (!fs.existsSync(resolvedPath)) {
    addFieldError(errors, index, project, 'projectPath', `local path "${relPath}" does not exist in the repository`);
  }
}

function validateProjectPath(projectPath, index, project, errors) {
  const rawPath = projectPath.trim();

  if (rawPath !== projectPath) {
    addFieldError(errors, index, project, 'projectPath', 'must not contain leading or trailing whitespace');
  }

  if (rawPath.startsWith('//')) {
    addFieldError(errors, index, project, 'projectPath', 'must not use a protocol-relative URL');
    return;
  }

  if (UNSAFE_PROTOCOL_RE.test(rawPath)) {
    addFieldError(errors, index, project, 'projectPath', 'uses an unsafe URL protocol');
    return;
  }

  if (isExternalHttpUrl(rawPath)) {
    validateExternalUrl(rawPath, index, project, errors);
    return;
  }

  if (URL_SCHEME_RE.test(rawPath)) {
    addFieldError(errors, index, project, 'projectPath', 'must use http(s) or a local relative path');
    return;
  }

  validateLocalPath(rawPath, index, project, errors);
}

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
    if (project === null || typeof project !== 'object' || Array.isArray(project)) {
      errors.push(`Index ${index}: project entry must be an object`);
      return;
    }

    REQUIRED_KEYS.forEach(key => {
      if (project[key] === undefined || project[key] === null || project[key] === '') {
        addFieldError(errors, index, project, key, 'is missing or empty');
      }
    });

    if (project.projectNo !== undefined && project.projectNo !== null) {
      if (typeof project.projectNo !== 'number') {
        addFieldError(errors, index, project, 'projectNo', `must be a number, got "${typeof project.projectNo}"`);
      } else if (!Number.isInteger(project.projectNo) || project.projectNo <= 0) {
        addFieldError(errors, index, project, 'projectNo', 'must be a positive integer');
      } else if (seenProjectNos.has(project.projectNo)) {
        addFieldError(errors, index, project, 'projectNo', `duplicates day number "${project.projectNo}"`);
      } else {
        seenProjectNos.add(project.projectNo);
      }
    }

    if (project.projectName !== undefined && project.projectName !== null && project.projectName !== '') {
      if (typeof project.projectName !== 'string') {
        addFieldError(errors, index, project, 'projectName', `must be a string, got "${typeof project.projectName}"`);
      } else if (project.projectName.trim() === '') {
        addFieldError(errors, index, project, 'projectName', 'must not be blank');
      }
    }

    if (project.techStack !== undefined && project.techStack !== null) {
      if (!Array.isArray(project.techStack)) {
        addFieldError(errors, index, project, 'techStack', `must be an array, got "${typeof project.techStack}"`);
      } else if (project.techStack.length === 0) {
        addFieldError(errors, index, project, 'techStack', 'must contain at least one token');
      } else {
        project.techStack.forEach((token, tokenIndex) => {
          if (typeof token !== 'string' || token.trim() === '') {
            addFieldError(errors, index, project, `techStack[${tokenIndex}]`, 'must be a non-empty string');
          }
        });
      }
    }

    if (project.difficulty !== undefined && project.difficulty !== null && project.difficulty !== '') {
      if (typeof project.difficulty !== 'string') {
        addFieldError(errors, index, project, 'difficulty', `must be a string, got "${typeof project.difficulty}"`);
      } else if (!VALID_DIFFICULTIES.has(project.difficulty)) {
        addFieldError(errors, index, project, 'difficulty', 'must be one of: beginner, intermediate, advanced');
      }
    }

    if (project.projectPath !== undefined && project.projectPath !== null && project.projectPath !== '') {
      if (typeof project.projectPath !== 'string') {
        addFieldError(errors, index, project, 'projectPath', `must be a string, got "${typeof project.projectPath}"`);
      } else {
        if (seenProjectPaths.has(project.projectPath)) {
          addFieldError(errors, index, project, 'projectPath', `duplicates path "${project.projectPath}"`);
        } else {
          seenProjectPaths.add(project.projectPath);
        }

        validateProjectPath(project.projectPath, index, project, errors);
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
