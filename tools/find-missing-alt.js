/**
 * find-missing-alt.js
 *
 * Scans HTML files under `public/` for <img> tags that are missing an
 * `alt` attribute and writes a JSON report describing every violation.
 *
 * Usage:
 *   node tools/find-missing-alt.js
 *   node tools/find-missing-alt.js --dir public/SomeDemo
 *   node tools/find-missing-alt.js --out custom-report.json
 *
 * Exit code:
 *   0  - no missing alt attributes found
 *   1  - one or more <img> tags are missing alt attributes
 *
 * See CONTRIBUTING.md for full usage and the fix workflow.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DEFAULT_SCAN_DIR = path.join(ROOT_DIR, 'public');
const DEFAULT_OUTPUT_FILE = path.join(ROOT_DIR, 'missing-alt-report.json');

const IMG_TAG_REGEX = /<img\b[^>]*>/gis;
const ALT_ATTR_REGEX = /\salt\s*=/i;
const SRC_ATTR_REGEX = /\ssrc\s*=\s*(?:"([^"]*)"|'([^']*)')/i;

function parseArgs(argv) {
  const args = { dir: DEFAULT_SCAN_DIR, out: DEFAULT_OUTPUT_FILE };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--dir' && argv[i + 1]) {
      args.dir = path.resolve(argv[i + 1]);
      i++;
    } else if (argv[i] === '--out' && argv[i + 1]) {
      args.out = path.resolve(argv[i + 1]);
      i++;
    }
  }
  return args;
}

function findHtmlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { recursive: true });
  return entries
    .filter((entry) => typeof entry === 'string' && entry.toLowerCase().endsWith('.html'))
    .map((entry) => path.join(dir, entry));
}

function lineNumberAt(html, charIndex) {
  let line = 1;
  for (let i = 0; i < charIndex; i++) {
    if (html.charCodeAt(i) === 10) line++;
  }
  return line;
}

function stripComments(html) {
  return html.replace(/<!--[\s\S]*?-->/g, (comment) =>
    comment.replace(/[^\n]/g, ' ')
  );
}

function scanFile(filePath) {
  const rawHtml = fs.readFileSync(filePath, 'utf8');
  const html = stripComments(rawHtml);
  const violations = [];

  let match;
  IMG_TAG_REGEX.lastIndex = 0;
  while ((match = IMG_TAG_REGEX.exec(html)) !== null) {
    const tag = match[0];
    if (ALT_ATTR_REGEX.test(tag)) continue;

    const srcMatch = tag.match(SRC_ATTR_REGEX);
    const src = srcMatch ? srcMatch[1] || srcMatch[2] || '' : '(inline / dynamically set)';

    violations.push({
      file: path.relative(ROOT_DIR, filePath).split(path.sep).join('/'),
      line: lineNumberAt(html, match.index),
      src,
    });
  }

  return violations;
}

function main() {
  const { dir, out } = parseArgs(process.argv.slice(2));
  const htmlFiles = findHtmlFiles(dir);

  console.log(`Scanning ${htmlFiles.length} HTML file(s) under ${path.relative(ROOT_DIR, dir) || '.'} ...\n`);

  const report = htmlFiles.flatMap(scanFile);

  fs.writeFileSync(out, JSON.stringify(report, null, 2) + '\n', 'utf8');

  if (report.length === 0) {
    console.log('No missing alt attributes found. ✅');
    console.log(`Report written to ${path.relative(ROOT_DIR, out)}`);
    process.exit(0);
  }

  const fileCount = new Set(report.map((r) => r.file)).size;
  console.log(`Found ${report.length} <img> tag(s) missing alt attributes across ${fileCount} file(s):\n`);
  for (const violation of report) {
    console.log(`  ${violation.file}:${violation.line}  src="${violation.src}"`);
  }
  console.log(`\nFull report written to ${path.relative(ROOT_DIR, out)}`);
  process.exit(1);
}

main();