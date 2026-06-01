const fs = require('fs');
const path = require('path');

const projectsPath = path.join(__dirname, '../projects.json');
const readmePath = path.join(__dirname, '../README.md');

try {
  const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
  const count = projectsData.length;

  if (fs.existsSync(readmePath)) {
    let readmeContent = fs.readFileSync(readmePath, 'utf8');

    // Matches strings like "All Projects (112 Total)" or "All Projects (182 Total)"
    const updatedContent = readmeContent.replace(
      /All Projects \(\d+ Total\)/i,
      `All Projects (${count} Total)`
    );

    if (readmeContent !== updatedContent) {
      fs.writeFileSync(readmePath, updatedContent, 'utf8');
      console.log(`Updated README.md project count to: ${count} ✅`);
    } else {
      console.log("README.md project count is already up to date.");
    }
  } else {
    console.error("README.md not found.");
  }
} catch (error) {
  console.error("Error updating README count:", error);
  process.exit(1);
}
