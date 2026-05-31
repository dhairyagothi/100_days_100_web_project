const fs = require("fs");
const path = require("path");

const VALID_DIFFICULTIES = new Set(["beginner", "intermediate", "advanced"]);

function isHttpUrl(value) {
  return /^https?:\/\//i.test(value);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeLocalPath(projectPath) {
  return decodeURI(projectPath.replace(/^\.\//, ""));
}

function rootPrefix(rootDir) {
  return rootDir.endsWith(path.sep) ? rootDir : `${rootDir}${path.sep}`;
}

function projectLabel(project, index) {
  if (Number.isInteger(project?.projectNo)) {
    return `projectNo ${project.projectNo}`;
  }

  return `index ${index}`;
}

function addIssue(issues, message) {
  issues.push(message);
}

function validateProjects({ data, schema, rootDir }) {
  const issues = [];
  const warnings = [];
  const stats = {
    totalProjects: Array.isArray(data) ? data.length : 0,
    localProjects: 0,
    remoteProjects: 0,
  };

  if (!Array.isArray(data)) {
    addIssue(issues, "projects.json must be an array");
    return { issues, stats };
  }

  if (!rootDir || typeof rootDir !== "string") {
    throw new Error("validateProjects requires a rootDir string");
  }

  const requiredFields = schema?.items?.required ?? [];
  const seenProjectNumbers = new Map();
  const seenProjectPaths = new Map();
  const rootDirWithSeparator = rootPrefix(rootDir);

  data.forEach((project, index) => {
    const label = projectLabel(project, index);

    if (!isPlainObject(project)) {
      addIssue(issues, `${label} must be a plain object`);
      return;
    }

    for (const field of requiredFields) {
      if (!(field in project)) {
        addIssue(issues, `${label} is missing required field "${field}"`);
      }
    }

    if (!Number.isInteger(project.projectNo) || project.projectNo < 1) {
      addIssue(issues, `${label} must use a positive integer projectNo`);
    } else {
      const expectedProjectNo = index + 1;
      if (project.projectNo !== expectedProjectNo) {
        addIssue(issues, `${label} is out of sequence, expected projectNo ${expectedProjectNo}`);
      }

      if (seenProjectNumbers.has(project.projectNo)) {
        const firstIndex = seenProjectNumbers.get(project.projectNo);
        addIssue(issues, `duplicate projectNo ${project.projectNo} found at index ${index} and index ${firstIndex}`);
      } else {
        seenProjectNumbers.set(project.projectNo, index);
      }
    }

    const projectName = normalizeString(project.projectName);
    if (!projectName) {
      addIssue(issues, `${label} must include a non-empty projectName`);
    }

    const projectType = normalizeString(project.projectType);
    if (!projectType) {
      addIssue(issues, `${label} must include a non-empty projectType`);
    }

    const projectDesc = normalizeString(project.projectDesc);
    if (!projectDesc) {
      addIssue(issues, `${label} must include a non-empty projectDesc`);
    }

    const projectPath = normalizeString(project.projectPath);
    if (!projectPath) {
      addIssue(issues, `${label} must include a non-empty projectPath`);
    } else if (seenProjectPaths.has(projectPath)) {
      const firstIndex = seenProjectPaths.get(projectPath);
      warnings.push(`duplicate projectPath "${projectPath}" found at index ${index} and index ${firstIndex}`);
    } else {
      seenProjectPaths.set(projectPath, index);
    }

    const difficulty = normalizeString(project.difficulty).toLowerCase();
    if (!VALID_DIFFICULTIES.has(difficulty)) {
      addIssue(issues, `${label} has invalid difficulty "${project.difficulty}"`);
    }

    if (!Array.isArray(project.techStack) || project.techStack.length === 0) {
      addIssue(issues, `${label} must include at least one techStack item`);
    } else {
      const seenTech = new Set();
      project.techStack.forEach((tech, techIndex) => {
        if (typeof tech !== "string" || !tech.trim()) {
          addIssue(issues, `${label} has an invalid techStack entry at position ${techIndex}`);
          return;
        }

        const normalizedTech = tech.trim();
        if (seenTech.has(normalizedTech)) {
          addIssue(issues, `${label} has duplicate techStack entry "${normalizedTech}"`);
          return;
        }

        seenTech.add(normalizedTech);
      });
    }

    if (!projectPath) {
      return;
    }

    if (isHttpUrl(projectPath)) {
      stats.remoteProjects += 1;
      return;
    }

    if (!projectPath.startsWith("./")) {
      addIssue(issues, `${label} must use a relative ./ path or an http(s) URL`);
      return;
    }

    const resolvedPath = path.resolve(rootDir, normalizeLocalPath(projectPath));

    if (!resolvedPath.startsWith(rootDirWithSeparator)) {
      addIssue(issues, `${label} resolves outside the repository root: ${projectPath}`);
      return;
    }

    stats.localProjects += 1;

    if (!fs.existsSync(resolvedPath)) {
      addIssue(issues, `${label} points to a missing file: ${projectPath}`);
    }
  });

  return { issues, warnings, stats };
}

module.exports = {
  VALID_DIFFICULTIES,
  validateProjects,
};
