const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

let totalFilesChanged = 0;
let totalAltAdded = 0;
let totalBoilerplateFixes = 0;
let totalAriaHiddenAdded = 0;

function fixBoilerplate(html, filePath) {
  let fixed = html;
  let changed = false;

  if (!/^<!DOCTYPE html>/i.test(fixed)) {
    fixed = '<!DOCTYPE html>\n' + fixed;
    changed = true;
    console.log(`  Added DOCTYPE to ${filePath}`);
  }

  if (!/<html[^>]*lang=/i.test(fixed)) {
    fixed = fixed.replace(/<html([^>]*)>/i, (match, attrs) => {
      if (attrs.includes('lang=')) return match;
      return `<html lang="en"${attrs ? ' ' + attrs.trim() : ''}>`;
    });
    changed = true;
    console.log(`  Added lang="en" to ${filePath}`);
  }

  const headMatch = fixed.match(/<head[^>]*>/i);
  if (headMatch) {
    const headEnd = headMatch.index + headMatch[0].length;
    const insertions = [];

    if (!/<meta[^>]*charset=/i.test(fixed)) {
      insertions.push('  <meta charset="UTF-8" />');
    }

    if (!/<meta[^>]*name="viewport"/i.test(fixed)) {
      insertions.push('  <meta name="viewport" content="width=device-width, initial-scale=1.0" />');
    }

    if (insertions.length > 0) {
      fixed = fixed.slice(0, headEnd) + '\n' + insertions.join('\n') + fixed.slice(headEnd);
      changed = true;
      insertions.forEach(ins => console.log(`  Added ${ins.trim()} to ${filePath}`));
    }
  }

  return changed ? fixed : null;
}

function fixIconAria(html, filePath) {
  let fixed = html;
  let changed = false;
  let count = 0;

  const iconRegex = /<i\s[^>]*>/gi;
  fixed = fixed.replace(iconRegex, (match) => {
    if (/\b(fa[bsrl]?|material-icons|glyphicon|bi)\b/i.test(match) && !/\b(aria-hidden|aria-label|role)\s*=/i.test(match)) {
      const result = match.replace(/^<i/i, '<i aria-hidden="true"');
      if (result !== match) {
        count++;
        changed = true;
        return result;
      }
    }
    return match;
  });

  if (changed) {
    console.log(`  Added aria-hidden="true" to ${count} icons in ${filePath}`);
  }

  return changed ? { html: fixed, count } : null;
}

function fixImgAlt(html, filePath) {
  let fixed = html;
  let changed = false;
  let count = 0;

  const imgRegex = /<img\s[^>]*>/gi;
  fixed = fixed.replace(imgRegex, (match) => {
    if (!/\salt\s*=/i.test(match)) {
      const result = match.replace(/^<img/i, '<img alt=""');
      if (result !== match) {
        count++;
        changed = true;
        return result;
      }
    }
    return match;
  });

  if (changed) {
    console.log(`  Added alt="" to ${count} images in ${filePath}`);
  }

  return changed ? { html: fixed, count } : null;
}

function main() {
  const allFiles = fs.readdirSync(publicDir, { recursive: true });
  const files = allFiles.filter(f => typeof f === 'string' && f.endsWith('.html'));
  console.log(`Found ${files.length} HTML files to process.\n`);

  for (const file of files) {
    const filePath = path.join(publicDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    let fileChanged = false;

    const boilerplateResult = fixBoilerplate(html, file);
    if (boilerplateResult) {
      html = boilerplateResult;
      fileChanged = true;
      totalBoilerplateFixes++;
    }

    const imgResult = fixImgAlt(html, file);
    if (imgResult) {
      html = imgResult.html;
      fileChanged = true;
      totalAltAdded += imgResult.count;
    }

    const iconResult = fixIconAria(html, file);
    if (iconResult) {
      html = iconResult.html;
      fileChanged = true;
      totalAriaHiddenAdded += iconResult.count;
    }

    if (fileChanged) {
      fs.writeFileSync(filePath, html, 'utf8');
      totalFilesChanged++;
    }
  }

  console.log(`\nDone!`);
  console.log(`Files changed: ${totalFilesChanged}`);
  console.log(`Alt attributes added: ${totalAltAdded}`);
  console.log(`Boilerplate fixes: ${totalBoilerplateFixes}`);
  console.log(`aria-hidden added to icons: ${totalAriaHiddenAdded}`);
}

main();
