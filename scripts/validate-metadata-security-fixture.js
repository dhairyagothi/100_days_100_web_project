const { spawnSync } = require('child_process');
const path = require('path');

const validatorPath = path.join(__dirname, 'validate-metadata.js');
const fixturePath = path.join(__dirname, 'fixtures', 'unsafe-preview-metadata.json');

const result = spawnSync(process.execPath, [validatorPath, fixturePath], {
  encoding: 'utf8'
});
const output = `${result.stdout}\n${result.stderr}`;

const expectedMessages = [
  '"projectName" contains double quotes, angle brackets, backticks, or control characters',
  'preview image path segment derived from metadata is unsafe',
  '"projectPath" must not contain path traversal',
  '"projectPath" uses an unsafe URL protocol'
];

if (result.status === 0) {
  console.error('Expected unsafe preview metadata fixture to fail validation.');
  process.exit(1);
}

const missingMessages = expectedMessages.filter(message => !output.includes(message));

if (missingMessages.length > 0) {
  console.error('Unsafe preview metadata fixture did not trigger expected validation errors.');
  missingMessages.forEach(message => console.error(`- Missing: ${message}`));
  process.exit(1);
}

console.log('Success: unsafe preview metadata fixture is rejected.');
