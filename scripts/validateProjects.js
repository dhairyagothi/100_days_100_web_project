const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const projectsPath = path.join(rootDir, "projects.json");
const schemaPath = path.join(rootDir, "schema", "projects.schema.json");

function readJson(filePath, label) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    console.error(`Failed to read ${label}: ${error.message}`);
    process.exit(1);
  }
}

const data = readJson(projectsPath, "projects.json");
const schema = readJson(schemaPath, "projects.schema.json");

if (!Array.isArray(data)) {
  console.error("projects.json must be an array");
  process.exit(1);
}

const requiredFields = schema?.items?.required ?? [];
const seenProjectNumbers = new Set();

for (const [index, project] of data.entries()) {
  for (const field of requiredFields) {
    if (!(field in project)) {
      console.error(`Missing required field: ${field} at index ${index}`);
      process.exit(1);
    }
  }

  if (seenProjectNumbers.has(project.projectNo)) {
    console.error(`Duplicate projectNo detected: ${project.projectNo}`);
    process.exit(1);
  }
  seenProjectNumbers.add(project.projectNo);

  if (/^https?:\/\//i.test(project.projectPath)) {
    continue;
  }

  const localPath = decodeURI(project.projectPath.replace(/^\.\//, ""));
  const projectFile = path.resolve(rootDir, localPath);
  if (!fs.existsSync(projectFile)) {
    console.error(`Missing project file for projectNo ${project.projectNo}: ${project.projectPath}`);
    process.exit(1);
  }
}

console.log("projects.json validation passed ✅");
