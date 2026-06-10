// collectFiles.js
// Utility script to read all project files into a single JavaScript object.
// Run with Node (>=12) inside the project folder.

const fs = require('fs').promises;
const path = require('path');

// Root directory of the Instagram landing project
const ROOT_DIR = path.resolve(__dirname);

// Recursively walk a directory and return an array of file paths
async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(entry => {
      const res = path.resolve(dir, entry.name);
      return entry.isDirectory() ? walk(res) : res;
    })
  );
  return Array.prototype.concat(...files);
}

// Load all files into an object where the key is the relative path
async function loadAllFiles() {
  const allFiles = await walk(ROOT_DIR);
  const result = {};
  for (const filePath of allFiles) {
    // Skip node_modules or hidden directories if they exist
    if (filePath.includes('node_modules') || path.basename(filePath).startsWith('.')) continue;
    const relPath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
    const content = await fs.readFile(filePath, 'utf8');
    result[relPath] = content;
  }
  return result;
}

// Example usage: print JSON representation of all files (may be large)
loadAllFiles()
  .then(filesObj => {
    console.log('All project files loaded into variable \"projectFiles\"');
    // Export the object for other scripts if needed
    global.projectFiles = filesObj;
    // Optionally write to a JSON file for inspection
    // fs.writeFile('projectFiles.json', JSON.stringify(filesObj, null, 2));
  })
  .catch(err => console.error('Error loading files:', err));

module.exports = { loadAllFiles };
