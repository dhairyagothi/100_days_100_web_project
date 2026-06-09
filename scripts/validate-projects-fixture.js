const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const validatorPath = path.join(__dirname, 'validate-projects.js');
const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'project-registry-'));
const validEntryPath = path.join(fixtureRoot, 'public', 'valid-project', 'index.html');
const validRegistryPath = path.join(fixtureRoot, 'valid-projects.json');
const invalidRegistryPath = path.join(fixtureRoot, 'invalid-projects.json');

fs.mkdirSync(path.dirname(validEntryPath), { recursive: true });
fs.writeFileSync(validEntryPath, '<!doctype html><title>Valid Project</title>');

fs.writeFileSync(validRegistryPath, JSON.stringify([
  {
    projectNo: 1,
    projectName: 'Valid Project',
    techStack: ['html', 'css'],
    difficulty: 'beginner',
    projectPath: './public/valid-project/index.html'
  }
], null, 2));

fs.writeFileSync(invalidRegistryPath, JSON.stringify([
  {
    projectNo: 1,
    projectName: 'Original Project',
    techStack: ['html'],
    difficulty: 'beginner',
    projectPath: './public/valid-project/index.html'
  },
  {
    projectNo: 1,
    projectName: 'Duplicate Day',
    techStack: ['javascript'],
    difficulty: 'expert',
    projectPath: 'javascript:alert(1)'
  },
  {
    projectNo: 3,
    projectName: 'Escaped Path',
    techStack: ['html'],
    difficulty: 'advanced',
    projectPath: '../outside.html'
  },
  {
    projectNo: 4,
    projectName: 'Missing File',
    techStack: ['css'],
    difficulty: 'intermediate',
    projectPath: './public/missing/index.html'
  }
], null, 2));

function runValidator(registryPath) {
  return spawnSync(process.execPath, [validatorPath, registryPath, fixtureRoot], {
    encoding: 'utf8'
  });
}

const validResult = runValidator(validRegistryPath);

if (validResult.status !== 0) {
  console.error('Expected valid project registry fixture to pass validation.');
  console.error(validResult.stdout);
  console.error(validResult.stderr);
  process.exit(1);
}

const invalidResult = runValidator(invalidRegistryPath);
const invalidOutput = `${invalidResult.stdout}\n${invalidResult.stderr}`;
const expectedMessages = [
  'duplicates day number "1"',
  'must be one of: beginner, intermediate, advanced',
  'uses an unsafe URL protocol',
  'must not contain path traversal',
  'local path "./public/missing/index.html" does not exist in the repository'
];

if (invalidResult.status === 0) {
  console.error('Expected invalid project registry fixture to fail validation.');
  process.exit(1);
}

const missingMessages = expectedMessages.filter(message => !invalidOutput.includes(message));

if (missingMessages.length > 0) {
  console.error('Invalid project registry fixture did not trigger expected validation errors.');
  missingMessages.forEach(message => console.error(`- Missing: ${message}`));
  process.exit(1);
}

console.log('Success: project registry validation fixtures passed.');
