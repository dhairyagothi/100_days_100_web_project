# Repository Architecture Map

This guide documents the technical design, routing layers, and dynamic engines that power the **100 Days 100 Web Projects** catalog page.

## System Workflow Diagram

```mermaid
graph TD
    A[index.html Layout Load] --> B[navbar.js rendering]
    A --> C[index.js Dynamic Grid Parser]
    C --> D[Fetch projects.json catalog manifest]
    D --> E[Filter chips & search parsing]
    E --> F[Render responsive project-card grid]
```

## Folder Structure Core Architecture

- **`index.html`**: Master catalog frame.
- **`style.css`**: Central HSL theme styles.
- **`index.js`**: Search query engine and filtering selectors.
- **`projects.json`**: Primary JSON database manifest matching tags, title, and assets.
- **`public/`**: Sandbox folder structure for all 100 isolated front-end projects.
