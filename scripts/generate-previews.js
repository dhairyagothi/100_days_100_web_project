const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = path.join(__dirname, '..', 'public');
const SCREENSHOT_WIDTH = 1280;
const SCREENSHOT_HEIGHT = 720;

// Get specific project from --project flag
const args = process.argv.slice(2);
const projectFlag = args.indexOf('--project');
const specificProject = projectFlag !== -1 ? args[projectFlag + 1] : null;

async function generatePreview(browser, projectName) {
  const projectPath = path.join(PROJECTS_DIR, projectName, 'index.html');
  const outputPath = path.join(PROJECTS_DIR, projectName, 'preview.png');

  if (!fs.existsSync(projectPath)) {
    console.log(`⚠️  Skipping ${projectName} — no index.html found`);
    return;
  }

  const page = await browser.newPage();
  await page.setViewport({ width: SCREENSHOT_WIDTH, height: SCREENSHOT_HEIGHT });

  try {
    await page.goto(`file://${projectPath}`, { waitUntil: 'networkidle2', timeout: 15000 });
    await page.screenshot({ path: outputPath, type: 'png' });
    console.log(`✅  ${projectName} — preview saved`);
  } catch (err) {
    console.error(`❌  ${projectName} — failed: ${err.message}`);
  } finally {
    await page.close();
  }
}

async function main() {
  let projects = [];

  if (specificProject) {
    projects = [specificProject];
  } else {
    projects = fs.readdirSync(PROJECTS_DIR).filter((name) => {
      const fullPath = path.join(PROJECTS_DIR, name);
      return fs.statSync(fullPath).isDirectory();
    });
  }

  console.log(`🚀 Generating previews for ${projects.length} project(s)...\n`);

  const browser = await puppeteer.launch({ headless: 'new' });

  for (const project of projects) {
    await generatePreview(browser, project);
  }

  await browser.close();
  console.log('\n🎉 Done!');
}

main().catch(console.error);