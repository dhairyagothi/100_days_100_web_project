const htmlCode = document.getElementById('htmlCode');
const cssCode = document.getElementById('cssCode');
const jsCode = document.getElementById('jsCode');
const runBtn = document.getElementById('runBtn');
const previewFrame = document.getElementById('previewFrame');
let currentBlobUrl = null;

function run() {
  const code = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <style>${cssCode.value}</style>
    </head>
    <body>
      ${htmlCode.value}
      <script>${jsCode.value}</script>
    </body>
    </html>
  `;

  // Release previously created Blob URL
  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
  }

  const blob = new Blob([code], { type: 'text/html' });

  currentBlobUrl = URL.createObjectURL(blob);
  previewFrame.src = currentBlobUrl;
} 

runBtn.addEventListener('click', run);

window.addEventListener('beforeunload', () => {
  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
  }
});

// Initial live run on page load
window.addEventListener('DOMContentLoaded', run);
