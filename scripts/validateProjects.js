const fs = require("fs");
const path = require("path");
const { validateProjects } = require("./projectRegistryValidator");

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
const { issues, warnings, stats } = validateProjects({ data, schema, rootDir });

if (issues.length > 0) {
  console.error(`projects.json validation failed with ${issues.length} issue(s)`);
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  if (warnings.length > 0) {
    console.error(`warnings: ${warnings.length}`);
    for (const warning of warnings) {
      console.error(`- ${warning}`);
    }
  }
  process.exit(1);
}

if (warnings.length > 0) {
  console.log(`projects.json validation passed with ${warnings.length} warning(s)`);
  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
  console.log(`summary: ${stats.totalProjects} projects, ${stats.localProjects} local, ${stats.remoteProjects} remote`);
  process.exit(0);
}

console.log(`projects.json validation passed ✅ (${stats.totalProjects} projects, ${stats.localProjects} local, ${stats.remoteProjects} remote)`);
