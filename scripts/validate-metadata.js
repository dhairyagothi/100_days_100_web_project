const fs = require('fs');
const path = require('path');

const projectsPath = path.join(__dirname, '..', 'projects.json');

try {
  const data = fs.readFileSync(projectsPath, 'utf8');
  const projects = JSON.parse(data);

  if (!Array.isArray(projects)) {
    console.error('Validation Error: projects.json must be a JSON Array');
    process.exit(1);
  }

  projects.forEach((project, index) => {
    const requiredKeys = ['day', 'title', 'tags', 'difficulty', 'link'];
    requiredKeys.forEach(key => {
      if (!project[key]) {
        console.error(`Validation Error at index ${index}: Missing key "${key}"`);
        process.exit(1);
      }
    });

    if (typeof project.day !== 'number') {
      console.error(`Validation Error at index ${index}: "day" must be a number`);
      process.exit(1);
    }
  });

  console.log('Success: projects.json metadata validated perfectly!');
  process.exit(0);
} catch (error) {
  console.error('Validation failed with error:', error.message);
  process.exit(1);
}
