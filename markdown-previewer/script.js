document.addEventListener("DOMContentLoaded", () => {
  const editor = document.getElementById("editor");
  const preview = document.getElementById("preview");

  // Default template content shown when opening the app
  const defaultMarkdown = `# Welcome to Markdown Previewer

## Subheading example
You can write paragraphs cleanly here. 

Inline code can be wrapped inside ticks like this: \`const app = true;\`

### Code Block Layout:
\`\`\`javascript
function greetUser() {
    console.log("Hello World!");
}
\`\`\`

- List item number one
- List item number two

> Blockquotes format perfectly as well!

Enjoy editing!`;

  // Configure the Marked library configurations safely
  marked.setOptions({
    breaks: true, // Converts line breaks automatically to <br>
    gfm: true, // Enables GitHub Flavored Markdown
  });

  // Render logic function
  function renderMarkdown() {
    const rawContent = editor.value;
    // Parse markdown content to HTML string text securely via MarkedJS
    preview.innerHTML = marked.parse(rawContent);
  }

  // Event listener setup for active real-time compiling
  editor.addEventListener("input", renderMarkdown);

  // Initial setup loading template configuration
  editor.value = defaultMarkdown;
  renderMarkdown();
});
