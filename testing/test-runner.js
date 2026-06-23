#!/usr/bin/env node
/**
 * Test orchestration script for detecting project type and
 * dispatching to the appropriate test runner (Jest or pytest).
 *
 * Usage: node testing/test-runner.js <project-directory>
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function detectProjectType(projectDir) {
  if (fs.existsSync(path.join(projectDir, 'package.json'))) {
    return 'javascript';
  }
  if (fs.existsSync(path.join(projectDir, 'requirements.txt'))) {
    return 'python';
  }
  return null;
}

function runTests(projectDir) {
  const type = detectProjectType(projectDir);

  if (!type) {
    console.log(`No recognized test configuration found in ${projectDir}. Skipping.`);
    return true;
  }

  try {
    if (type === 'javascript') {
      execSync('npm install --no-audit --no-fund', { cwd: projectDir, stdio: 'inherit' });
      execSync('npm run test --if-present -- --coverage', { cwd: projectDir, stdio: 'inherit' });
    } else if (type === 'python') {
      execSync('pip install -r requirements.txt pytest pytest-cov', { cwd: projectDir, stdio: 'inherit' });
      execSync('pytest --cov=. --cov-fail-under=70 tests/', { cwd: projectDir, stdio: 'inherit' });
    }
    console.log(`✓ Tests passed for ${projectDir}`);
    return true;
  } catch (error) {
    console.error(`✗ Tests failed for ${projectDir}`);
    return false;
  }
}

const targetDir = process.argv[2];
if (!targetDir) {
  console.error('Usage: node test-runner.js <project-directory>');
  process.exit(1);
}

const passed = runTests(targetDir);
process.exit(passed ? 0 : 1);
