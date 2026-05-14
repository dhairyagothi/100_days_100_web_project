import fs from 'fs';
import path from 'path';

console.log('Running project validation...\n');

const ROOT_DIR = process.cwd();
const INDEX_JS_PATH = path.join(ROOT_DIR, 'index.js');

let errorCount = 0;
let warningCount = 0;

try {
  const indexJsContent = fs.readFileSync(INDEX_JS_PATH, 'utf-8');

  console.log('Loaded index.js');

  const projectEntryRegex =
    /\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\]/g;

  const projects = [];

  let match;

  while ((match = projectEntryRegex.exec(indexJsContent)) !== null) {
    const [, day, projectName, projectPath] = match;

    projects.push({
      day,
      projectName,
      projectPath,
    });
  }

  console.log(`Extracted ${projects.length} project entries\n`);

  // ----------------------------------------
  // Duplicate Day Validation
  // ----------------------------------------

  const seenDays = new Set();

  for (const project of projects) {
    const normalizedDay = project.day
      .toLowerCase()
      .replace(/[^0-9]/g, '');

    if (seenDays.has(normalizedDay)) {
      console.error(`Duplicate day detected: ${project.day}`);
      errorCount++;
    } else {
      seenDays.add(normalizedDay);
    }
  }

  // ----------------------------------------
  // Local Demo Path Validation
  // ----------------------------------------

  for (const project of projects) {
    const projectPath = project.projectPath.trim();

    // Ignore external URLs
    if (
      projectPath.startsWith('http://') ||
      projectPath.startsWith('https://')
    ) {
      continue;
    }

    // Decode URL-encoded paths like %20
    const decodedPath = decodeURIComponent(projectPath);

    const resolvedPath = path.join(ROOT_DIR, decodedPath);

    if (!fs.existsSync(resolvedPath)) {
        console.error(
        `Invalid local demo path for "${project.projectName}" -> ${project.projectPath}`
        );

      errorCount++;
    }
  }

  // ----------------------------------------
  // Validation Summary
  // ----------------------------------------

  console.log('\nValidation Summary');
  console.log('-------------------');
  console.log(`Errors: ${errorCount}`);
  if (errorCount === 0) {
  console.log('\nAll project validations passed successfully.');
}
  if (errorCount > 0) {
    process.exit(1);
  }

} catch (error) {
  console.error('Failed to read index.js');
  console.error(error.message);
  process.exit(1);
}