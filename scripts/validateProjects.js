const fs = require("fs");
const path = require("path");

const data = JSON.parse(
  fs.readFileSync("./projects.json", "utf8")
);

const schema = JSON.parse(
  fs.readFileSync("./schema/projects.schema.json", "utf8")
);

if (!Array.isArray(data)) {
  console.error("projects.json must be an array");
  process.exit(1);
}

for (const project of data) {
  for (const field of schema.items.required) {
    if (!(field in project)) {
      console.error(`Error in Day ${project.projectNo}: Missing required field "${field}"`);
      process.exit(1);
    }
  }

  const isSourceOnly = project.techStack && (
    Array.isArray(project.techStack) 
      ? project.techStack.includes("source-only") 
      : String(project.techStack).includes("source-only")
  );

  const isExternal = String(project.projectPath).startsWith("http");

  if (!isSourceOnly && !isExternal) {
    const relativePath = project.projectPath;
    const cleanPath = relativePath.startsWith("./") ? relativePath.slice(2) : relativePath;
    
    // Decode percent-encoded spaces and characters (e.g. %20 -> " ")
    const decodedPath = decodeURIComponent(cleanPath);
    const filePathOnly = decodedPath.split(/[?#]/)[0];
    const absoluteFilePath = path.join(__dirname, "../", filePathOnly);

    if (!fs.existsSync(absoluteFilePath)) {
      console.error(`Error in Day ${project.projectNo} ("${project.projectName}"): The path "${project.projectPath}" (resolved as "${filePathOnly}") does not exist in the repository.`);
      process.exit(1);
    }
  }
}

console.log("projects.json validation passed successfully ✅ (Checked required fields and local path existences)");