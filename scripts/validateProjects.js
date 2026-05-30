const fs = require("fs");

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
      console.error(`Missing required field: ${field}`);
      process.exit(1);
    }
  }
}

console.log("projects.json validation passed ✅");