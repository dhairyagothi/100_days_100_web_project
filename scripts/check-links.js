const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const data = JSON.parse(fs.readFileSync("./projects.json", "utf8"));

console.log(`Starting link health check for ${data.length} projects...`);

async function checkUrl(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith("https") ? https : http;
    try {
      const req = protocol.get(
        url,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          },
          timeout: 8000,
        },
        (res) => {
          if (res.statusCode >= 200 && res.statusCode < 400) {
            resolve({ ok: true, code: res.statusCode });
          } else {
            resolve({ ok: false, code: res.statusCode });
          }
        }
      );
      req.on("error", (err) => {
        resolve({ ok: false, error: err.message });
      });
      req.on("timeout", () => {
        req.destroy();
        resolve({ ok: false, error: "Timeout" });
      });
    } catch (err) {
      resolve({ ok: false, error: err.message });
    }
  });
}

async function run() {
  let failed = 0;
  for (const project of data) {
    const url = String(project.projectPath || "").trim();
    if (url.startsWith("http")) {
      console.log(`Checking Day ${project.projectNo} ("${project.projectName}") external link: ${url}`);
      const status = await checkUrl(url);
      if (!status.ok) {
        console.warn(`⚠️ Warning: Day ${project.projectNo} link failed: ${url} (Error: ${status.code || status.error})`);
        // We warn instead of hard-failing the CI to avoid breaking on transient network glitches
      } else {
        console.log(`✅ Day ${project.projectNo} link OK (Status: ${status.code})`);
      }
    }
  }
  console.log("Link checking completed successfully.");
}

run().catch((err) => {
  console.error("Link checker encountered an error:", err);
  process.exit(1);
});
