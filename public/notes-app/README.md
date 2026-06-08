# Notes App

A responsive notes application built with HTML, CSS, and vanilla JavaScript. Notes are saved in the browser with `localStorage`, so the app works without a backend.

## Features

- Create, edit, archive, restore, and permanently delete notes
- Search by title, note body, or tag
- Filter by all notes, favorites, archived notes, trash, and tag
- Mark notes as favorites
- Choose a note color and tag
- Light and dark themes with persistent preference
- Export and import notes as JSON backups
- Responsive layout for desktop, tablet, and mobile
- Keyboard shortcuts: `Ctrl+N` or `Cmd+N` for a new note, `Ctrl+F` or `Cmd+F` for search, and `Escape` to close the editor

## How To Run

Open `index.html` directly in a browser, or serve the repository locally and visit:

```text
public/notes-app/index.html
```

## Storage

The app stores notes in browser local storage under:

```text
responsive-notes-app:v2
```

Theme preference is stored under:

```text
responsive-notes-app:theme
```

## Files

```text
notes-app/
  index.html
  style.css
  script.js
  NotesApp-Logo.png
  README.md
```

## Backup

Use **Export JSON** to download a backup. Use **Import JSON** to load a previous backup into the app.
