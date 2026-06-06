const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

const httpsSafeDomains = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'code.jquery.com',
  'maxcdn.bootstrapcdn.com',
  'cdnjs.cloudflare.com',
  'stackpath.bootstrapcdn.com',
  'cdn.jsdelivr.net',
  'unpkg.com',
  'ajax.googleapis.com',
  'ajax.aspnetcdn.com',
  'maps.googleapis.com',
  'maps.gstatic.com',
  'platform.twitter.com',
  'www.google-analytics.com',
  'google-analytics.com',
  'www.googletagmanager.com',
  'googleads.g.doubleclick.net',
  'pagead2.googlesyndication.com',
  'www.youtube.com',
  'i.ytimg.com',
  'vimeo.com',
  'player.vimeo.com',
  'api.github.com',
  'raw.githubusercontent.com',
  'www.gstatic.com',
  'cdn.datatables.net',
  'cdn.quilljs.com',
  'cdn.ckeditor.com',
  'cdn.socket.io',
  'cdn.tailwindcss.com',
  'cdn.plot.ly',
  'cdn.plyr.io',
  'cdn.amcharts.com',
  'www.google.com',
  'apis.google.com',
];

function fixHttpToHttps(content, filePath) {
  let changed = false;
  let count = 0;
  let fixed = content;

  for (const domain of httpsSafeDomains) {
    const escapedDomain = domain.replace(/\./g, '\\.');
    const regex = new RegExp(`http://${escapedDomain}`, 'gi');
    const matches = fixed.match(regex);
    if (matches) {
      count += matches.length;
      fixed = fixed.replace(regex, `https://${domain}`);
      changed = true;
    }
  }

  if (changed) {
    console.log(`  Fixed ${count} http:// -> https:// in ${path.relative(publicDir, filePath)}`);
  }

  return changed ? { content: fixed, count } : null;
}

function main() {
  const allFiles = fs.readdirSync(publicDir, { recursive: true });
  const targetFiles = allFiles.filter(f =>
    typeof f === 'string' && /\.(html|css|js)$/i.test(f)
  );

  console.log(`Found ${targetFiles.length} files to process for mixed content.\n`);

  let totalFixed = 0;
  let totalFilesChanged = 0;

  for (const file of targetFiles) {
    const filePath = path.join(publicDir, file);
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const result = fixHttpToHttps(content, filePath);
      if (result) {
        fs.writeFileSync(filePath, result.content, 'utf8');
        totalFixed += result.count;
        totalFilesChanged++;
      }
    } catch (err) {
      // skip binary files
    }
  }

  console.log(`\nDone!`);
  console.log(`Files changed: ${totalFilesChanged}`);
  console.log(`http:// -> https:// fixes: ${totalFixed}`);
}

main();
