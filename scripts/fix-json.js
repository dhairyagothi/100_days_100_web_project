const fs = require('fs');
const content = fs.readFileSync('projects.json', 'utf8');
const lines = content.split('\n');

// Find lines that are part of a multi-line string value
let inMultiline = false;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (inMultiline) {
    // Check if this line ends the string
    if (line.trim().endsWith('"') || line.trim().endsWith('",') || line.trim().endsWith('"}')) {
      inMultiline = false;
    }
  } else {
    // Check if a string value starts on this line but doesn't end
    const hasValueStart = /:\s*"/.test(line);
    const hasValueEnd = line.trimEnd().endsWith('"') || line.trimEnd().endsWith('",');
    // Also check for ":" patterns with arrays
    if (hasValueStart && !hasValueEnd && !line.trim().startsWith('//')) {
      // But the quote might be inside the key, not value
      const colonIdx = line.indexOf(':');
      if (colonIdx >= 0) {
        const afterColon = line.substring(colonIdx + 1);
        const valMatch = afterColon.match(/"([^"]*)$/);
        if (valMatch && valMatch[1].length > 0 && !afterColon.includes('"[')) {
          console.log(`Line ${i + 1}: Possible multi-line string start: ${line.trim().substring(0, 80)}`);
          inMultiline = true;
        }
      }
    }
  }
}

// Try to parse
try {
  JSON.parse(content);
  console.log('VALID JSON');
} catch (e) {
  console.log('ERROR: ' + e.message.substring(0, 200));
  const posMatch = e.message.match(/position (\d+)/);
  if (posMatch) {
    const pos = parseInt(posMatch[1]);
    console.log(`Error around position ${pos}:`);
    console.log(content.substring(Math.max(0, pos - 50), pos + 50));
  }
}
