# Accessibility Guidelines

This repository aims to be accessible to all users. Please follow these guidelines when adding or updating projects.

## Checklist

- [ ] Use semantic HTML tags (nav, main, section, article, header, footer).
- [ ] Provide `alt` text for all images.
- [ ] Ensure sufficient color contrast.
- [ ] Make all interactive elements keyboard focusable and operable.
- [ ] Use ARIA attributes where necessary to provide context to screen readers.
- [ ] Ensure visible focus indicators for keyboard navigation.

## Helper Components

### Focus Trap

A common accessibility requirement for modals is to trap focus within the modal while it's open.

```javascript
export function createFocusTrap(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(e) {
        const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

        if (!isTabPressed) {
            return;
        }

        if (e.shiftKey) { /* shift + tab */
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else { /* tab */
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    });
}
```

### ARIA Patterns

Use `aria-expanded` on buttons that control collapsible content:

```html
<button aria-expanded="false" aria-controls="menu-list" id="menu-button">Menu</button>
<ul id="menu-list" hidden>
  <li>Item 1</li>
</ul>
```
