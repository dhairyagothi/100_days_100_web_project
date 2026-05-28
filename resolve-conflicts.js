const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  const status = execSync('git diff --name-only --diff-filter=U').toString();
  const files = status.split('\n').map(f => f.trim()).filter(f => f.length > 0);
  
  let fixedCount = 0;
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    
    // Replace conflict blocks keeping HEAD
    content = content.replace(/<<<<<<< HEAD\r?\n([\s\S]*?)=======\r?\n[\s\S]*?>>>>>>>[^\r\n]*\r?\n?/g, '$1');
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      fixedCount++;
      execSync('git add "' + file + '"');
    } else {
      // Just git add if it's already resolved manually by the user
      if (!content.includes('<<<<<<< HEAD')) {
         execSync('git add "' + file + '"');
         fixedCount++;
      } else {
         console.log('Could not automatically resolve: ' + file);
      }
    }
  }
  console.log('Fixed and staged ' + fixedCount + ' files.');
} catch (e) {
  console.error(e.toString());
}
