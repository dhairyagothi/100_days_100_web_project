# Bucket List Tracker

A feature-rich personal goal tracker app for building, organizing, and tracking your bucket list dreams—from travel adventures to career milestones to fitness goals.

## Description

This project helps you define, organize, and accomplish your life goals. Add bucket list items with titles, descriptions, categories, priorities, and due dates. Break each goal into subtasks, mark progress, filter by status or category, and watch your completion percentage climb. Your entire bucket list syncs to browser local storage and can be exported/imported as JSON for backup and sharing.

## Features

- **Create & Edit Goals**: Add goals with title, description, category, priority (Low/Medium/High), and due date.
- **Subtasks**: Break complex goals into smaller actionable steps within each goal.
- **Multiple Views**: Switch between **Grid View** (card layout with hover effects) and **Compact List View** (dense, table-like rows).
- **Progress Tracking**: Overall completion percentage and goal count shown in header; category-based statistics in sidebar.
- **Filtering & Search**:
  - Text search across titles and descriptions
  - Status filter (All, Pending, Completed)
  - Category filter (Travel, Career, Fitness, Learning, Personal, Adventure, Finance)
  - One-click "Clear Filters" button
- **Local Persistence**: Goals are automatically saved to browser `localStorage` on every change.
- **Export & Import**: Download your bucket list as JSON (timestamped filename) or import a previously exported file to replace/restore your list.
- **Responsive Design**: Optimized for desktop, tablet, and mobile screens; sidebar collapses on smaller viewports.
- **Dark Theme**: Sleek dark UI with high-contrast text and smooth transitions.
- **Keyboard Shortcut**: Press **Ctrl+K** (or **Cmd+K** on Mac) to open the "Add Goal" modal instantly.
- **Mark Complete/Pending**: Toggle goals between pending and completed with instant visual feedback (strikethrough, opacity).
- **Zero Dependencies**: Pure HTML, CSS, and Vanilla JavaScript—only Bootstrap 5 for UI components (loaded via CDN).

## Tech Stack

- **HTML5** — semantic structure and layout
- **CSS3** — custom dark theme, flexbox, grid, responsive media queries, transitions
- **Vanilla JavaScript (ES6)** — DOM manipulation, event handling, localStorage API, JSON parsing/stringification
- **Bootstrap 5** — modal dialogs, buttons, form controls, grid system (loaded via CDN)

## Folder Structure

```text
Bucket List/
│
├── index.html      # App structure — header, sidebar, filters, goal views, modal
├── styles.css       # Dark theme styling, card/list layouts, responsive design
├── script.js        # Goal CRUD, filtering, view toggle, localStorage, export/import
└── README.md         # Project documentation
```

## Setup / Run Instructions

No build step or npm install required.

### Option 1: Open Directly
1. Navigate to the `Bucket List` folder.
2. Double-click `index.html` (or open it) in any modern web browser.

### Option 2: Use a Local Server (recommended)
Using VS Code:
1. Install the **Live Server** extension.
2. Open the project folder in VS Code.
3. Right-click `index.html` → **Open with Live Server**.

## Usage

### Adding a Goal
1. Click the **+ New Goal** button in the header, or press **Ctrl+K** (Windows/Linux) / **Cmd+K** (Mac).
2. Fill in the form:
   - **Title** (required) — the goal description
   - **Description** (optional) — more context or details
   - **Category** (required) — pick from Travel, Career, Fitness, Learning, Personal, Adventure, Finance
   - **Priority** — Low, Medium, or High
   - **Due Date** (optional) — a target completion date
   - **Subtasks** (optional) — click "+ Add Subtask" to add action items
3. Click **Save Goal** to create.

### Viewing Goals
- **Grid View** (default): Cards displayed in a 3-column responsive grid with hover effects. Shows title, priority badge, category tag, description, due date, and action buttons.
- **Compact List View**: Dense row layout showing all fields inline, better for scanning many goals at once.
- Toggle between views using the **Grid** / **Compact List** buttons above the goals.

### Filtering Goals
Use the sidebar filters to narrow down the view:
- **Search**: Type keywords to filter goals by title or description (instant live search).
- **Status**: All, Pending, or Completed.
- **Category**: Select one of the 7 predefined categories.
- **Clear Filters**: One-click reset to show all goals again.

### Managing Goals
For each goal card/row:
- **Mark Complete / Mark Pending**: Toggle completion status with the green button (turns gray when completed).
- **Edit**: Opens the modal to update the goal's details and subtasks.
- **Delete**: Permanently remove the goal (with confirmation).

### Tracking Progress
- The **Progress Bar** in the header shows overall completion: e.g., "68% (17/25)".
- The **Statistics Panel** on the sidebar displays:
  - Total Goals
  - Completed count
  - Pending count
  - Breakdown by category

### Export & Import
- **Export JSON**: Downloads a timestamped JSON file (`bucket-list-YYYY-MM-DD.json`) containing all your goals. Useful for backup.
- **Import JSON**: Opens a file picker to upload a previously exported JSON file. Replaces your current list after confirmation.

## Implementation Notes

- **Local Storage**: Goals are persisted to `localStorage` under the key `"bucketListGoals"`. Clearing browser data will erase all goals.
- **Unique IDs**: Each goal gets a unique ID generated using a timestamp + random suffix for reliable CRUD operations.
- **Modal Reuse**: The same modal form is used for both creating and editing goals; the `edit-id` hidden field tracks edit mode.
- **Bootstrap Modal**: Uses Bootstrap 5's Modal component for the add/edit dialog; manages show/hide via the `bootstrap.Modal` JS API.
- **No External Data**: All data is stored locally; there is no server or cloud sync.
- **Subtasks Storage**: Subtasks are stored as an array of objects within each goal (`{ text, completed }`), allowing future enhancements like subtask-level progress.

## Educational Value

This project demonstrates:

- DOM manipulation and event handling
- Browser localStorage API for persistence
- JSON import/export workflows
- Filter and search logic
- Modal dialogs and form validation
- Responsive layouts with Bootstrap 5 and CSS media queries
- CSS transitions and hover effects
- Keyboard shortcuts (`Ctrl+K` listener)
- Conditional rendering based on data state

## Future Enhancements

Potential improvements:
- **Recurring Goals**: Support for repeating goals (daily, weekly, monthly).
- **Goal Statistics**: Charts showing completion trends over time.
- **Subtask Progress**: Track subtask completion percentage per goal.
- **Priority Sorting**: Sort goals by priority, due date, or completion status.
- **Cloud Sync**: Optional backend integration for multi-device sync.
- **Themes**: Light theme toggle option.
- **Tagging**: Add custom tags beyond predefined categories.
- **Notes History**: Track goal notes and updates over time.
- **Reminder Notifications**: Browser notifications for upcoming due dates.

## License

This project is open-source and available for educational and personal use.

## Author

Contributed as part of the [100 Days 100 Web Projects](../../README.md) challenge.
