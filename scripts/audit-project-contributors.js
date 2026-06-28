const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const projectsPath = path.join(__dirname, "..", "projects.json");
const reportPath = path.join(__dirname, "..", "audit-report.md");
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function runAudit() {
  console.log("Starting audit of project contributors...");

  if (!fs.existsSync(projectsPath)) {
    console.error("projects.json not found!");
    process.exit(1);
  }

  const projects = JSON.parse(fs.readFileSync(projectsPath, "utf8"));
  const reportRows = [];
  let matchCount = 0;
  let mismatchCount = 0;
  let unverifiedCount = 0;

  console.log(`Auditing ${projects.length} projects...`);

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    const projectNo = project.projectNo;
    const projectName = project.projectName;
    const projectPathVal = project.projectPath;
    const listedContributor = project.contributor || "None";

    process.stdout.write(
      `Processing [${i + 1}/${projects.length}] Day ${projectNo}: ${projectName}... `,
    );

    let cleanPath = projectPathVal;
    if (cleanPath.startsWith("./")) {
      cleanPath = cleanPath.slice(2);
    }
    // Remove query/hash
    cleanPath = cleanPath.split("?")[0].split("#")[0];
    try {
      cleanPath = decodeURIComponent(cleanPath);
    } catch (_) {}

    // Find git first commit that added this file
    let gitInfo = null;
    try {
      // We look for the first commit that created the projectPath
      const logOutput = execSync(
        `git log --diff-filter=A --follow --format="%H|%an|%ae" -- "${cleanPath}"`,
        { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] },
      ).trim();

      if (logOutput) {
        // Take the last line, which is the oldest/first commit
        const lines = logOutput.split("\n");
        const firstCommitLine = lines[lines.length - 1];
        const [sha, name, email] = firstCommitLine.split("|");
        gitInfo = { sha, name, email };
      } else {
        // Fallback: search for first commit of the project directory if the specific file path was renamed/changed
        const dirPath = path.dirname(cleanPath);
        const dirLogOutput = execSync(
          `git log --diff-filter=A --follow --format="%H|%an|%ae" -- "${dirPath}"`,
          { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] },
        ).trim();
        if (dirLogOutput) {
          const lines = dirLogOutput.split("\n");
          const firstCommitLine = lines[lines.length - 1];
          const [sha, name, email] = firstCommitLine.split("|");
          gitInfo = { sha, name, email };
        }
      }
    } catch (err) {
      // Git command failed
    }

    if (!gitInfo) {
      console.log("⚠️ Git history not found");
      reportRows.push({
        projectNo,
        projectName,
        listed: listedContributor,
        gitAuthor: "Unknown",
        gitEmail: "Unknown",
        resolvedUsername: "Unknown",
        status: "⚠️ Unverified (No Git History)",
      });
      unverifiedCount++;
      continue;
    }

    // Try to extract username from email
    let resolvedUsername = null;
    const emailLower = gitInfo.email.toLowerCase();

    // GitHub noreply email formats:
    // 1. 12345+username@users.noreply.github.com
    // 2. username@users.noreply.github.com
    if (emailLower.endsWith("@users.noreply.github.com")) {
      const handle = emailLower.split("@")[0];
      if (handle.includes("+")) {
        resolvedUsername = handle.split("+")[1];
      } else {
        resolvedUsername = handle;
      }
    }

    // If GITHUB_TOKEN is provided, let's fetch commit details from GitHub API to resolve username exactly
    if (GITHUB_TOKEN) {
      try {
        const response = await fetch(
          `https://api.github.com/repos/dhairyagothi/100_days_100_web_project/commits/${gitInfo.sha}`,
          {
            headers: {
              Authorization: `token ${GITHUB_TOKEN}`,
              Accept: "application/vnd.github+json",
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          if (data.author && data.author.login) {
            resolvedUsername = data.author.login;
          }
        }
      } catch (apiErr) {
        // Silent API fail, fallback to email regex
      }
    }

    let status = "❌ Mismatch";
    const cleanListed = listedContributor.toLowerCase().trim();
    const cleanResolved = resolvedUsername
      ? resolvedUsername.toLowerCase().trim()
      : "";
    const cleanGitName = gitInfo.name.toLowerCase().replace(/\s+/g, "").trim();

    if (cleanListed === "none" || cleanListed === "unknown") {
      status = "⚠️ Missing Attribution";
      unverifiedCount++;
    } else if (resolvedUsername && cleanListed === cleanResolved) {
      status = "✅ Match";
      matchCount++;
    } else if (
      !resolvedUsername &&
      (cleanGitName.includes(cleanListed) || cleanListed.includes(cleanGitName))
    ) {
      // fallback matching using git author name
      status = "✅ Match (Name-based)";
      matchCount++;
    } else {
      mismatchCount++;
    }

    console.log(status);

    reportRows.push({
      projectNo,
      projectName,
      listed: listedContributor,
      gitAuthor: gitInfo.name,
      gitEmail: gitInfo.email,
      resolvedUsername:
        resolvedUsername || "N/A (Provide GITHUB_TOKEN for API resolution)",
      status,
    });
  }

  // Generate Markdown report
  const matchRate = ((matchCount / (projects.length || 1)) * 100).toFixed(1);
  let markdown = `# Project Contributors Audit Report\n\n`;
  markdown += `Generated on: ${new Date().toUTCString()}\n\n`;
  markdown += `## Summary\n\n`;
  markdown += `- **Total Projects**: ${projects.length}\n`;
  markdown += `- **Matches**: ${matchCount}\n`;
  markdown += `- **Mismatches**: ${mismatchCount}\n`;
  markdown += `- **Unverified/Missing**: ${unverifiedCount}\n`;
  markdown += `- **Match Rate**: ${matchRate}%\n\n`;

  if (!GITHUB_TOKEN) {
    markdown += `> [!NOTE]\n`;
    markdown += `> Run this script with \`GITHUB_TOKEN=your_token node scripts/audit-project-contributors.js\` for more accurate GitHub username resolution via the GitHub API.\n\n`;
  }

  markdown += `## Audit Details\n\n`;
  markdown += `| Day | Project Name | Listed Contributor | Git Commit Author | Git Email | Resolved GitHub Username | Status |\n`;
  markdown += `|---|---|---|---|---|---|---|\n`;

  reportRows.forEach((row) => {
    markdown += `| ${row.projectNo} | ${row.projectName} | **${row.listed}** | ${row.gitAuthor} | ${row.gitEmail} | ${row.resolvedUsername} | ${row.status} |\n`;
  });

  fs.writeFileSync(reportPath, markdown, "utf8");
  console.log(`\nAudit completed! Report written to ${reportPath}`);
  console.log(
    `Summary: ${matchCount} matches, ${mismatchCount} mismatches, ${unverifiedCount} unverified. Match rate: ${matchRate}%`,
  );
}

runAudit();
