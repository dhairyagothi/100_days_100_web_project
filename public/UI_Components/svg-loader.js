/**
 * SVG Sprite Namespace Loader
 * 
 * Fetches an SVG sprite and prefixes all symbol IDs and internal references
 * with a given namespace. This prevents ID collisions when multiple components
 * inject the same symbol ID (like 'icon-check') into the DOM.
 */

export async function loadAndNamespaceSVG(url, namespace) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch SVG: ${response.statusText}`);
        }
        const svgText = await response.text();

        // Parse the SVG string into a DOM document
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgElement = doc.querySelector('svg');

        if (!svgElement) {
            throw new Error('No SVG element found in the fetched file.');
        }

        // Hide the injected sprite container visually but keep it accessible to the DOM
        svgElement.style.position = 'absolute';
        svgElement.style.width = '0';
        svgElement.style.height = '0';
        svgElement.style.overflow = 'hidden';
        svgElement.setAttribute('aria-hidden', 'true');

        // Namespace IDs
        const elementsWithId = svgElement.querySelectorAll('[id]');
        const idMap = new Map();

        elementsWithId.forEach(el => {
            const originalId = el.getAttribute('id');
            const newId = `${namespace}-${originalId}`;
            el.setAttribute('id', newId);
            idMap.set(originalId, newId);
        });

        // Update internal references (e.g., url(#id), <use href="#id">, clip-path="url(#id)")
        // 1. Update <use> tags
        const useElements = svgElement.querySelectorAll('use');
        useElements.forEach(useEl => {
            const href = useEl.getAttribute('href') || useEl.getAttribute('xlink:href');
            if (href && href.startsWith('#')) {
                const originalId = href.substring(1);
                if (idMap.has(originalId)) {
                    const newId = idMap.get(originalId);
                    if (useEl.hasAttribute('href')) {
                        useEl.setAttribute('href', `#${newId}`);
                    }
                    if (useEl.hasAttribute('xlink:href')) {
                        useEl.setAttribute('xlink:href', `#${newId}`);
                    }
                }
            }
        });

        // 2. Update attributes like clip-path, fill, mask that might use url(#id)
        const allElements = svgElement.querySelectorAll('*');
        const urlRefRegex = /url\(#([^)]+)\)/g;

        allElements.forEach(el => {
            Array.from(el.attributes).forEach(attr => {
                if (attr.value.includes('url(#')) {
                    const newValue = attr.value.replace(urlRefRegex, (match, id) => {
                        if (idMap.has(id)) {
                            return `url(#${idMap.get(id)})`;
                        }
                        return match; // keep original if not found in our map
                    });
                    if (newValue !== attr.value) {
                        el.setAttribute(attr.name, newValue);
                    }
                }
            });
        });

        // Inject into the DOM
        document.body.appendChild(svgElement);
        
        return true;
    } catch (error) {
        console.error(`Error loading and namespacing SVG (${url}):`, error);
        return false;
    }
}
