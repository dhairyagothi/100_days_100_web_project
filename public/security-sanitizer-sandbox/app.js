class DynamicDOMPurifier {
    constructor() {
        // Strict allowlist configuration rules for permissible tags
        this.ALLOWED_TAGS = ['b', 'i', 'em', 'strong', 'p', 'span', 'br'];
        this.ALLOWED_ATTRIBUTES = ['class', 'id'];

        this.inputElement = document.getElementById('payloadInput');
        this.vulnerableViewport = document.getElementById('vulnerableOutput');
        this.secureViewport = document.getElementById('secureOutput');

        this.registerEventBindings();
    }

    /**
     * Custom DOM Purification Engine using tree-tokenization mechanics.
     * Builds an isolated document fragment to neutralize execution nodes.
     */
    sanitizeString(dirtyHtml) {
        // 1. Create an isolated, non-executing DOM parser instance
        const parser = new DOMParser();
        const doc = parser.parseFromString(dirtyHtml, 'text/html');
        const body = doc.body || document.createElement('body');

        // 2. Transverse the tree node-by-node and strip non-allowlisted entities
        this.purifyNodeTree(body);

        return body.innerHTML;
    }

    purifyNodeTree(parentNode) {
        const childNodes = Array.from(parentNode.childNodes);

        for (const node of childNodes) {
            // If the element node is structural, validate its properties
            if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName.toLowerCase();

                // Drop unsafe tags entirely from the structure
                if (!this.ALLOWED_TAGS.includes(tagName)) {
                    node.remove();
                    continue;
                }

                // Strip all inline execution listeners (e.g., onerror, onclick)
                const attributes = Array.from(node.attributes);
                for (const attr of attributes) {
                    const attrName = attr.name.toLowerCase();

                    if (attrName.startsWith('on') || !this.ALLOWED_ATTRIBUTES.includes(attrName)) {
                        node.removeAttribute(attrName);
                    }
                }

                // Recursively scan deep nested structural elements
                this.purifyNodeTree(node);
            }
            // Escape trailing brackets inside textual data
            else if (node.nodeType === Node.TEXT_NODE) {
                node.textContent = node.textContent.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            }
        }
    }

    registerEventBindings() {
        this.inputElement.addEventListener('input', (e) => {
            const rawPayload = e.target.value;

            // 1. Vulnerable execution branch: loads raw payloads directly
            this.vulnerableViewport.innerHTML = rawPayload;

            // 2. Defensive security branch: strips malicious scripts safely
            const sterileHtml = this.sanitizeString(rawPayload);
            this.secureViewport.innerHTML = sterileHtml;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DynamicDOMPurifier();
});