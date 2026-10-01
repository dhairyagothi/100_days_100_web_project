# Digital Vision Board

An interactive web-based vision board where you can create, organize, and visualize your goals, dreams, quotes, and aspirations through draggable, freeform canvas arrangement.

## Description

Digital Vision Board is a personal visualization tool that helps you manifest your goals and dreams by creating a digital collage of aspirations, inspirations, and affirmations. Add goals, motivational quotes, personal notes, and images to a freeform canvas, drag items around to arrange them exactly as you envision, and watch your dreams take shape. Your vision board is automatically saved to browser storage for persistent access across sessions.

## Features

- **Multiple Item Types**: Add Goals, Quotes, Notes, or Images to your board
- **Freeform Canvas**: Drag and drop items anywhere on the board to create your perfect layout
- **Image Upload**: Upload and display images from your device with preview before adding
- **Categories**: Organize items by category (Career, Fitness, Education, Travel, Finance, Personal Growth, Health, Other)
- **Category Filtering**: Sidebar shows all categories with item counts; click to filter the board display
- **Add/Edit/Delete**: Create new items via modal, double-click items to edit, or hover and click × to delete
- **Local Persistence**: All items automatically saved to browser localStorage; survives page refreshes
- **Board Statistics**: Sidebar displays total items count and last saved timestamp
- **Color-Coded Items**: Different visual styles for each item type (blue for goals, purple for quotes, orange for notes, grayscale for images)
- **Randomize Layout**: Shuffle all item positions on the board for fresh arrangements
- **Export Data**: Download your entire vision board as a timestamped JSON file for backup
- **Clear Board**: Nuclear option to start fresh (with confirmation)
- **Keyboard Shortcut**: Press **N** to quickly open the add item modal
- **Responsive Design**: Adapts sidebar and canvas for tablet and mobile screens
- **Dark Theme**: Easy-on-the-eyes dark interface with modern aesthetics
- **Empty State**: Helpful placeholder when board is empty with call-to-action

## Tech Stack

- **HTML5** — semantic structure, form controls, modal dialogs
- **CSS3** — dark theme, flexbox layout, animations, responsive design, grid background, shadows
- **JavaScript (ES6+)** — drag-and-drop implementation, localStorage API, file I/O, event handling, modal management
- **Bootstrap 5** — navbar, modals, buttons, form components, responsive grid
- **Bootstrap Icons** — UI icons for buttons and navigation

## Folder Structure

```text
Digital Vision Board/
│
├── index.html      # Main app structure — navbar, sidebar, canvas, modals
├── script.js        # Core functionality — drag/drop, CRUD, filtering, export, localStorage
├── styles.css       # Dark theme, board styling, animations, responsive layout
└── README.md        # Project documentation
```

## Setup / Run Instructions

No build step or dependencies required. Bootstrap is loaded via CDN.

### Option 1: Open Directly
1. Navigate to the `Digital Vision Board` folder.
2. Double-click `index.html` to open in your browser.

### Option 2: Use a Local Server (recommended)
Using VS Code:
1. Install the **Live Server** extension.
2. Open the project folder in VS Code.
3. Right-click `index.html` → **Open with Live Server**.

## Usage

### Adding Items

**Method 1: Button**
- Click **+ Add New Item** in the navbar

**Method 2: Keyboard Shortcut**
- Press **N** to instantly open the add dialog

**Method 3: Empty State**
- Click **Start Building** on the empty board

### Item Creation Form
1. **Select Type**: Choose Goal, Quote, Note, or Image
2. **Enter Title/Goal**: What do you want to achieve?
3. **Pick Category**: Select from 8 categories for organization
4. **Add Content**: Description, quote text, or personal note
5. **Upload Image** (images only): Select and preview your image
6. **Save**: Click Save Item to add to board

### Board Interaction

**Drag Items**
- Click and drag any item around the canvas to position it
- Items stay within board bounds (padding prevents escape)
- Dragging automatically saves position to localStorage

**Edit Items**
- Double-click any item on the board to open edit modal
- Modify title, content, category, or type
- Save to update (or cancel to discard changes)

**Delete Items**
- Hover over an item to reveal the red × button in the top-right corner
- Click × to delete (with confirmation)

**View Details**
- Hover over items for slight zoom and shadow effect

### Filtering & Organization

**Category Filter**
- Sidebar shows all categories with item counts as badges
- Click a category to show only items from that category
- Click "All Items" to return to full board view
- Active filter is highlighted in blue

### Board Management

**Randomize Layout**
- Click **Randomize** in navbar to shuffle all item positions
- Useful for finding fresh arrangements or breaking symmetry

**Export Board**
- Click **Export** to download JSON file with all items
- File named `vision-board-YYYY-MM-DD.json` for easy archiving
- Includes all item data: titles, content, images (as base64), positions, categories

**Clear Board**
- Click **Clear Board** to remove all items (with confirmation warning)
- This also clears localStorage

### Board Statistics

The sidebar displays:
- **Total Items**: Count of all items on the board
- **Last Saved**: Timestamp of last modification
- **Category Breakdown**: How many items per category

## How It Works

### Drag & Drop Mechanism

```javascript
function makeDraggable(element) {
    element.onmousedown = dragMouseDown;
    // Track mouse deltas and update element position
    // Constrain within board boundaries
    // Save position on drag end
}
```

The drag system:
1. Tracks initial mouse position on mousedown
2. Calculates delta on mousemove
3. Updates element's `left` and `top` style properties
4. Constrains within board (±20px padding from edges)
5. Saves updated position to localStorage on mouseup

### LocalStorage Persistence

```javascript
function saveBoard() {
    localStorage.setItem("visionBoard", JSON.stringify(items));
    lastSavedEl.textContent = new Date().toLocaleTimeString();
}
```

All items stored as JSON string in localStorage key `"visionBoard"`. Auto-saves on every change.

### Item Types

Each type has distinct styling:
- **Goal**: Blue left border (`#60a5fa`)
- **Quote**: Purple left border (`#c084fc`), italic text
- **Note**: Orange left border (`#fb923c`)
- **Image**: Special rendering with image as main content

### Image Handling

Images are converted to base64 data URIs using FileReader API:
1. User selects image file
2. FileReader converts to base64 string
3. Stored in `imageData` property of item
4. Rendered directly in board item without external URL dependency

### Export Functionality

Creates a data URI with JSON content and triggers browser download:
```javascript
const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
link.download = `vision-board-${date}.json`;
```

## Implementation Notes

- **Z-Index Management**: Hovering items get `z-index: 30` to appear above others
- **Grid Background**: Subtle 50px grid helps with alignment and visual structure
- **Responsive Sidebar**: On mobile, sidebar height limited to 45vh to preserve canvas space
- **Modal Management**: Bootstrap modals used for add/edit; form resets after save
- **Confirmation Dialogs**: Clear board and delete item use `confirm()` for safety
- **Active Filter State**: Tracked in `currentFilter` variable; applied on every render

## Educational Value

This project demonstrates:

- Drag and drop implementation without libraries
- Browser localStorage API for persistence
- File upload and image preview handling
- Base64 encoding of images
- Bootstrap modal component integration
- Responsive layout with sidebar and canvas
- Array filtering and manipulation
- Event delegation and bubbling
- CSS styling with dark theme
- Keyboard shortcut handling
- JSON export/download functionality
- Dynamic DOM element creation and removal

## Future Enhancements

Potential improvements:

- **Cloud Storage**: Sync with Firebase/backend instead of just localStorage
- **Sharing**: Generate shareable links to view others' vision boards
- **Collaboration**: Multiple users editing same board in real-time
- **Templates**: Pre-made board layouts or theme packs
- **Animations**: Confetti or celebration effects when goals are marked complete
- **Goal Completion**: Mark items as achieved and archive them
- **Reminders**: Set notifications for goal milestones
- **Vision Board Gallery**: Browse community vision boards for inspiration
- **Color Themes**: Dark/Light mode and custom color schemes
- **Stickers & Shapes**: Add pre-made elements beyond images and text
- **Text Styling**: Font size, color, and alignment options
- **Smart Suggestions**: AI-powered goal suggestions based on category
- **History/Undo**: Track changes and undo recent deletions
- **Undo on Delete**: Recover recently deleted items within a session
- **Mobile Touch Support**: Improved dragging on touch devices

## Performance Notes

- **LocalStorage Limit**: Browser localStorage typically allows 5-10MB; JSON-encoded images count toward this limit
- **Large Images**: Consider compressing images before upload to maximize storage
- **Render Performance**: Items rendered individually; acceptable for typical boards (< 100 items)

## Browser Compatibility

Works on all modern browsers supporting:
- ES6 JavaScript
- CSS Flexbox and Grid
- LocalStorage API
- FileReader API
- Bootstrap 5

**Not recommended for**: IE11 or older browsers.

## License

This project is open-source and available for educational and personal use.

## Author

Contributed as part of the [100 Days 100 Web Projects](../../README.md) challenge.
