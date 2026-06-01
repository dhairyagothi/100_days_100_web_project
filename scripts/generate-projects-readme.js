const fs = require("fs");

const projects = JSON.parse(fs.readFileSync("projects.json", "utf8"));

const README_PATH = "README.md";

function getDemoLink(projectPath) {
  if (!projectPath) return "#";

  // External URLs (GitHub, Render, etc.)
  if (projectPath.startsWith("http://") || projectPath.startsWith("https://")) {
    return projectPath;
  }

  // Internal project paths
  return `https://100-days-100-web-project.vercel.app/${projectPath.replace(
    /^\.\//,
    "",
  )}`;
}

const projectTable = [
  "## 📚 All Projects (" + projects.length + " Total)",
  "",
  '<div align="center">',
  "",
  "### 🎮 Interactive Demo Available!",
  "**[🌐 Visit Live Website](https://100-days-100-web-project.vercel.app/)** to see all projects with working demos!",
  "",
  "</div>",
  "",
  "| Day | Project Name | Difficulty | Demo |",
  "|-----|--------------|------------|------|",
];

projects.forEach((project) => {
  const demoLink = getDemoLink(project.projectPath);

  projectTable.push(
    `| ${project.projectNo} | ${project.projectName} | ${project.difficulty} | [View Demo](${demoLink}) |`,
  );
});

const readme = fs.readFileSync(README_PATH, "utf8");

const startMarker = "## 📚 All Projects";
const endMarker = "## 🤝 Contributing";

const startIndex = readme.indexOf(startMarker);
const endIndex = readme.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("README markers not found.");
  process.exit(1);
}

const updatedReadme =
  readme.substring(0, startIndex) +
  projectTable.join("\n") +
  "\n\n" +
  readme.substring(endIndex);

fs.writeFileSync(README_PATH, updatedReadme);

console.log(`README updated with ${projects.length} projects`);
