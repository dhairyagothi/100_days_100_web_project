const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { validateProjects } = require("./projectRegistryValidator");

const schema = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "schema", "projects.schema.json"), "utf8")
);

function withTempRoot(setup) {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), "projects-validator-"));

  try {
    return setup(rootDir);
  } finally {
    fs.rmSync(rootDir, { recursive: true, force: true });
  }
}

function writeProjectFile(rootDir, relativePath) {
  const filePath = path.join(rootDir, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, "<!doctype html><title>Demo</title>");
}

test("accepts a valid registry entry", () => {
  withTempRoot((rootDir) => {
    writeProjectFile(rootDir, path.join("public", "demo", "index.html"));

    const result = validateProjects({
      data: [
        {
          projectNo: 1,
          projectName: "Demo",
          projectType: "Tool",
          projectDesc: "A valid demo project.",
          techStack: ["html", "css"],
          difficulty: "beginner",
          projectPath: "./public/demo/index.html",
        },
      ],
      schema,
      rootDir,
    });

    assert.deepEqual(result.issues, []);
    assert.equal(result.stats.totalProjects, 1);
    assert.equal(result.stats.localProjects, 1);
    assert.equal(result.stats.remoteProjects, 0);
  });
});

test("surfaces duplicate ids, invalid difficulty and path escapes", () => {
  withTempRoot((rootDir) => {
    writeProjectFile(rootDir, path.join("public", "demo", "index.html"));

    const result = validateProjects({
      data: [
        {
          projectNo: 1,
          projectName: "Demo One",
          projectType: "Tool",
          projectDesc: "A valid demo project.",
          techStack: ["html", "css", "css"],
          difficulty: "beginner",
          projectPath: "./public/demo/index.html",
        },
        {
          projectNo: 1,
          projectName: "Demo Two",
          projectType: "Tool",
          projectDesc: "Another project.",
          techStack: ["javascript"],
          difficulty: "expert",
          projectPath: "./public/../../escape.html",
        },
      ],
      schema,
      rootDir,
    });

    assert(result.issues.some((issue) => issue.includes("duplicate projectNo 1")));
    assert(result.issues.some((issue) => issue.includes("duplicate techStack entry")));
    assert(result.issues.some((issue) => issue.includes("invalid difficulty")));
    assert(result.issues.some((issue) => issue.includes("resolves outside the repository root")));
    assert.equal(result.warnings.length, 0);
  });
});

test("downgrades duplicate project paths to warnings", () => {
  withTempRoot((rootDir) => {
    writeProjectFile(rootDir, path.join("public", "demo-a", "index.html"));

    const result = validateProjects({
      data: [
        {
          projectNo: 1,
          projectName: "Demo One",
          projectType: "Tool",
          projectDesc: "A valid demo project.",
          techStack: ["html"],
          difficulty: "beginner",
          projectPath: "./public/demo-a/index.html",
        },
        {
          projectNo: 2,
          projectName: "Demo Two",
          projectType: "Tool",
          projectDesc: "A duplicate path demo.",
          techStack: ["css"],
          difficulty: "intermediate",
          projectPath: "./public/demo-a/index.html",
        },
      ],
      schema,
      rootDir,
    });

    assert.deepEqual(result.issues, []);
    assert.equal(result.warnings.length, 1);
    assert(result.warnings[0].includes("duplicate projectPath"));
  });
});
