export function parseMarkdown(text) {
    let html = text;

    // Escaping generic tags safely
    html = html.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Headings parsing (e.g., # Heading 1, ## Heading 2)
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold text formatting (**bold**)
    html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');

    // Inline code snippet styling (`code`)
    html = html.replace(/`(.*?)`/gim, '<code>$1</code>');

    // Line breaks to paragraph rules
    html = html.replace(/\n$/gim, '<br />');

    return html;
}