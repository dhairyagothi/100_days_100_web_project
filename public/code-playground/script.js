const htmlCode = document.getElementById('htmlCode');
const cssCode = document.getElementById('cssCode');
const jsCode = document.getElementById('jsCode');
const runBtn = document.getElementById('runBtn');
const previewFrame = document.getElementById('previewFrame');

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
  
  const blob = new Blob([code], { type: 'text/html' });
  previewFrame.src = URL.createObjectURL(blob);
}

runBtn.addEventListener('click', run);

// Initial live run on page load
window.addEventListener('DOMContentLoaded', run);
