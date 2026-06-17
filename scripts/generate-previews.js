const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.join(__dirname, '..');
const PROJECTS_JSON_PATH = path.join(REPO_ROOT, 'projects.json');
const PREVIEWS_DIR = path.join(REPO_ROOT, 'public', 'previews');
const SCREENSHOT_WIDTH = 800;
const SCREENSHOT_HEIGHT = 500;

// Concurrency limit for Puppeteer workers
const CONCURRENCY_LIMIT = 10;

// Get specific project from --project flag
const args = process.argv.slice(2);
const projectFlag = args.indexOf('--project');
const specificProjectName = projectFlag !== -1 ? args[projectFlag + 1] : null;

// Helper to normalize strings for robust comparison
function normalizeName(name) {
  return name ? name.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
}

// Helper to find HTML file in a directory
function findHtmlInDir(dirPath) {
  if (!fs.existsSync(dirPath)) return null;
  const stat = fs.statSync(dirPath);
  if (!stat.isDirectory()) return null;
  
  const files = fs.readdirSync(dirPath);
  // Prioritize index.html
  if (files.includes('index.html')) {
    return path.join(dirPath, 'index.html');
  }
  const htmlFile = files.find(f => f.toLowerCase().endsWith('.html'));
  return htmlFile ? path.join(dirPath, htmlFile) : null;
}

// Helper to resolve local HTML file path for a project record
function resolveLocalHtmlPath(project) {
  let projectPath = project.projectPath;
  const previewImage = project.previewImage;
  
  if (!projectPath) return null;
  
  // Decode URL-encoded paths (e.g. spaces represented as %20)
  projectPath = decodeURIComponent(projectPath);
  
  // Case 1: projectPath is a local path
  if (projectPath.startsWith('./') || projectPath.startsWith('public/')) {
    const fullPath = path.resolve(REPO_ROOT, projectPath);
    if (fs.existsSync(fullPath)) {
      if (fs.statSync(fullPath).isFile()) {
        return fullPath;
      }
      return findHtmlInDir(fullPath);
    }
    // If path is malformed/missing but parent exists
    const dirPath = path.dirname(fullPath);
    return findHtmlInDir(dirPath);
  }
  
  // Case 2: projectPath is a GitHub link
  if (projectPath.includes('github.com') && projectPath.includes('/tree/Main/')) {
    const parts = projectPath.split('/tree/Main/');
    if (parts[1]) {
      const localSubpath = decodeURIComponent(parts[1]);
      const fullPath = path.join(REPO_ROOT, localSubpath);
      return findHtmlInDir(fullPath);
    }
  }
  
  // Case 3: External hosted link, infer folder from previewImage name
  if (previewImage) {
    const imageName = path.basename(previewImage, '.png');
    // Try public/<imageName>
    const fullPath = path.join(REPO_ROOT, 'public', imageName);
    const htmlPath = findHtmlInDir(fullPath);
    if (htmlPath) return htmlPath;
    
    // Try case-insensitive matching inside public/
    const publicDir = path.join(REPO_ROOT, 'public');
    if (fs.existsSync(publicDir)) {
      const folders = fs.readdirSync(publicDir);
      const matchedFolder = folders.find(f => f.toLowerCase() === imageName.toLowerCase());
      if (matchedFolder) {
        return findHtmlInDir(path.join(publicDir, matchedFolder));
      }
    }
  }
  
  return null;
}

async function generatePreview(browser, project) {
  const htmlPath = resolveLocalHtmlPath(project);
  if (!htmlPath || !fs.existsSync(htmlPath)) {
    console.log(`⚠️  Skipping "${project.projectName}" — no local HTML file resolved.`);
    return;
  }
  
  const previewImagePath = project.previewImage 
    ? path.resolve(REPO_ROOT, project.previewImage)
    : path.join(PREVIEWS_DIR, `${project.projectName}.png`);

  const page = await browser.newPage();
  await page.setViewport({ width: SCREENSHOT_WIDTH, height: SCREENSHOT_HEIGHT });

  try {
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle2', timeout: 15000 });
    await page.screenshot({ path: previewImagePath, type: 'png' });
    console.log(`✅  "${project.projectName}" — preview saved to ${path.relative(REPO_ROOT, previewImagePath)}`);
  } catch (err) {
    console.error(`❌  "${project.projectName}" — failed: ${err.message}`);
  } finally {
    await page.close();
  }
}

async function main() {
  if (!fs.existsSync(PROJECTS_JSON_PATH)) {
    console.error(`Error: projects.json not found at ${PROJECTS_JSON_PATH}`);
    process.exit(1);
  }

  if (!fs.existsSync(PREVIEWS_DIR)) {
    fs.mkdirSync(PREVIEWS_DIR, { recursive: true });
  }

  const projectsData = JSON.parse(fs.readFileSync(PROJECTS_JSON_PATH, 'utf8'));
  let projects = projectsData;

  if (specificProjectName) {
    const normalizedTarget = normalizeName(specificProjectName);
    projects = projectsData.filter(p => 
      normalizeName(p.projectName) === normalizedTarget ||
      (p.previewImage && normalizeName(path.basename(p.previewImage, '.png')) === normalizedTarget)
    );
    if (projects.length === 0) {
      console.error(`Error: Specific project "${specificProjectName}" not found in projects.json`);
      process.exit(1);
    }
  }

  console.log(`🚀 Generating previews for ${projects.length} project(s) using up to ${CONCURRENCY_LIMIT} parallel workers...\n`);

  const browser = await puppeteer.launch({ headless: 'new' });
  
  let index = 0;
  async function worker() {
    while (index < projects.length) {
      const currentProject = projects[index++];
      await generatePreview(browser, currentProject);
    }
  }

  const workers = [];
  const activeLimit = Math.min(CONCURRENCY_LIMIT, projects.length);
  for (let i = 0; i < activeLimit; i++) {
    workers.push(worker());
  }

  await Promise.all(workers);
  await browser.close();
  console.log('\n🎉 Preview generation completed!');
}

main().catch(console.error);