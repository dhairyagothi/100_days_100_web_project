const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

const httpsSafeDomains = [
  'fonts.googleapis.com', 'fonts.gstatic.com', 'code.jquery.com',
  'maxcdn.bootstrapcdn.com', 'cdnjs.cloudflare.com', 'stackpath.bootstrapcdn.com',
  'cdn.jsdelivr.net', 'unpkg.com', 'ajax.googleapis.com', 'ajax.aspnetcdn.com',
  'maps.googleapis.com', 'maps.gstatic.com', 'platform.twitter.com',
  '[www.google-analytics.com](https://www.google-analytics.com)', 'google-analytics.com', '[www.googletagmanager.com](https://www.googletagmanager.com)',
  'googleads.g.doubleclick.net', 'pagead2.googlesyndication.com', '[www.youtube.com](https://www.youtube.com)',
  'i.ytimg.com', 'vimeo.com', 'player.vimeo.com', 'api.github.com',
  'raw.githubusercontent.com', '[www.gstatic.com](https://www.gstatic.com)', 'cdn.datatables.net',
  'cdn.quilljs.com', 'cdn.ckeditor.com', 'cdn.socket.io', 'cdn.tailwindcss.com',
  'cdn.plot.ly', 'cdn.plyr.io', 'cdn.amcharts.com', '[www.google.com](https://www.google.com)', 'apis.google.com',
];

// 1. Pre-compile a single optimized Regex outside the loop
const escapedDomains = httpsSafeDomains.map(d => d.replace(/\./g, '\\.'));
const mixedContentRegex = new RegExp(`http://(${escapedDomains.join('|')})`, 'gi');

function fixHttpToHttps(content, filePath) {
  let count = 0;

  // 2. Use a match callback function to preserve original casing and count matches accurately
  const fixed = content.replace(mixedContentRegex, (match, domain) => {
    count++;
    return `https://${domain}`; 
  });

  if (count > 0) {
    console.log(`  Fixed ${count} http:// -> https:// in ${path.relative(publicDir, filePath)}`);
    return { content: fixed, count };
  }

  return null;
}

function main() {
  if (!fs.existsSync(publicDir)) {
    console.error(`Error: Public directory does not exist at ${publicDir}`);
    return;
  }

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
      // 3. Ensure it's a file and not a directory before reading
      const stat = fs.statSync(filePath);
      if (!stat.isFile()) continue;

      const content = fs.readFileSync(filePath, 'utf8');
      const result = fixHttpToHttps(content, filePath);
      
      if (result) {
        fs.writeFileSync(filePath, result.content, 'utf8');
        totalFixed += result.count;
        totalFilesChanged++;
      }
    } catch (err) {
      console.error(`Error processing ${file}: ${err.message}`);
    }
  }

  console.log(`\nDone!`);
  console.log(`Files changed: ${totalFilesChanged}`);
  console.log(`http:// -> https:// fixes: ${totalFixed}`);
}

main();
