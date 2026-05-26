const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const REQUIRED_FILES = ['index.html'];

let results = {
  total: 0,
  passed: 0,
  failed: 0,
  issues: []
};

function validateProject(projectPath, projectName) {
  results.total++;
  let projectIssues = [];

  // Check required files
  REQUIRED_FILES.forEach(file => {
    const filePath = path.join(projectPath, file);
    if (!fs.existsSync(filePath)) {
      projectIssues.push(`Missing: ${file}`);
    }
  });

  // Check empty folder
  const files = fs.readdirSync(projectPath);
  if (files.length === 0) {
    projectIssues.push('Empty folder');
  }

  // Check for broken asset links in index.html
  const indexPath = path.join(projectPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf8');
    const assetRefs = content.match(/src=["']([^"']+)["']/g) || [];
    assetRefs.forEach(ref => {
      const assetPath = ref.replace(/src=["']/, '').replace(/["']$/, '');
      if (!assetPath.startsWith('http') && !assetPath.startsWith('//')) {
        const fullPath = path.join(projectPath, assetPath);
        if (!fs.existsSync(fullPath)) {
          projectIssues.push(`Broken asset: ${assetPath}`);
        }
      }
    });
  }

  if (projectIssues.length === 0) {
    results.passed++;
    console.log(`✅ PASS: ${projectName}`);
  } else {
    results.failed++;
    results.issues.push({ project: projectName, issues: projectIssues });
    console.log(`❌ FAIL: ${projectName}`);
    projectIssues.forEach(issue => console.log(`   ⚠️  ${issue}`));
  }
}

function scanAllProjects() {
  console.log('🔍 Starting Project Validation...\n');
  console.log(`📁 Scanning: ${ROOT_DIR}\n`);

  const entries = fs.readdirSync(ROOT_DIR, { withFileTypes: true });

  entries.forEach(entry => {
    if (entry.isDirectory()) {
      const dirName = entry.name;
      // Skip hidden folders, node_modules, ProjectValidator itself
      if (!dirName.startsWith('.') && 
          dirName !== 'node_modules' && 
          dirName !== 'ProjectValidator' &&
          dirName !== 'TechVisualization') {
        const projectPath = path.join(ROOT_DIR, dirName);
        validateProject(projectPath, dirName);
      }
    }
  });

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 VALIDATION SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total Projects : ${results.total}`);
  console.log(`✅ Passed      : ${results.passed}`);
  console.log(`❌ Failed      : ${results.failed}`);

  // Save report
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: results
  };
  fs.writeFileSync(
    path.join(__dirname, 'validation-report.json'),
    JSON.stringify(reportData, null, 2)
  );
  console.log('\n📄 Report saved: ProjectValidator/validation-report.json');
}

scanAllProjects();