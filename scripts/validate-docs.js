const fs = require('fs');
const path = require('path');

// Target directory paths relative to this script location
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const MAX_SIZE_MB = 2;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

// Parsing the command line flags
const args = process.argv.slice(2);
const projectIdx = args.indexOf('--project');
const targetProject = projectIdx !== -1 ? args[projectIdx + 1] : null;

/**
 * Recursively steps through folders to catch any asset exceeding size threshold
 */
function checkAssetSizes(currentPath, issueLog) {
    if (!fs.existsSync(currentPath)) return;

    const items = fs.readdirSync(currentPath);
    for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            checkAssetSizes(fullPath, issueLog);
        } else {
            if (stats.size > MAX_SIZE_BYTES) {
                const actualMB = (stats.size / (1024 * 1024)).toFixed(2);
                issueLog.push(`⚠️  Asset Performance Bloat: "${item}" is ${actualMB}MB (Limit: ${MAX_SIZE_MB}MB)`);
            }
        }
    }
}

/**
 * Validates a targeted project folder against the 3 core criteria
 */
function validateProjectFolder(projectName) {
    const projectPath = path.join(PUBLIC_DIR, projectName);

    // Ensure it's a directory
    if (!fs.existsSync(projectPath) || !fs.statSync(projectPath).isDirectory()) {
        console.error(`❌ Error: Project "${projectName}" does not exist in /public.`);
        return false;
    }

    const projectIssues = [];

    // Rule 1: Critical Documentation Check
    if (!fs.existsSync(path.join(projectPath, 'README.md'))) {
        projectIssues.push(`❌ Critical Documentation: Missing "README.md"`);
    }

    // Rule 3: Valid Entry Point Check
    if (!fs.existsSync(path.join(projectPath, 'index.html'))) {
        projectIssues.push(`❌ Valid Entry Point: Missing "index.html"`);
    }

    // Rule 2: Asset Size Audit
    checkAssetSizes(projectPath, projectIssues);

    // If this project has problems, print them out clearly
    if (projectIssues.length > 0) {
        console.log(`\n📁 Project: /public/${projectName}`);
        projectIssues.forEach(issue => console.log(`   ${issue}`));
        return false; // Failed validation
    }

    return true; // Passed validation
}

function main() {
    if (!fs.existsSync(PUBLIC_DIR)) {
        console.error(`❌ Root Directory Error: Cannot find "/public" folder at ${PUBLIC_DIR}`);
        process.exit(1);
    }

    let dynamicSuccess = true;

    if (targetProject) {
        // Mode 1: node scripts/validate-docs.js --project name
        console.log(`🚀 Running audit for single workspace project: "${targetProject}"`);
        dynamicSuccess = validateProjectFolder(targetProject);
    } else {
        // Mode 2: node scripts/validate-docs.js
        console.log(`🚀 Running global audit across all subdirectories under /public...`);
        const totalItems = fs.readdirSync(PUBLIC_DIR);

        let failedProjectsCount = 0;
        let totalProjectsCount = 0;

        for (const item of totalItems) {
            const fullPath = path.join(PUBLIC_DIR, item);
            if (fs.statSync(fullPath).isDirectory()) {
                totalProjectsCount++;
                const isPassed = validateProjectFolder(item);
                if (!isPassed) failedProjectsCount++;
            }
        }

        console.log(`\n--- Audit Summary ---`);
        console.log(`📊 Total project folders audited: ${totalProjectsCount}`);
        console.log(`✅ Passed: ${totalProjectsCount - failedProjectsCount}`);
        console.log(`❌ Failed: ${failedProjectsCount}`);

        if (failedProjectsCount > 0) dynamicSuccess = false;
    }

    // Exit blocks or passes git hooks/CI pipelines cleanly
    if (!dynamicSuccess) {
        console.log(`\n❌ Script ended: Structural validation issues were found.`);
        process.exit(1);
    } else {
        console.log(`\n✅ Script ended: All validation rules met perfectly.`);
        process.exit(0);
    }
}

main();
main();