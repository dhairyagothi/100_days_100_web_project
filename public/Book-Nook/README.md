# 📖 Cozy BookNook - Personal Book Tracker & Library

A warm, aesthetic personal book management application where users can log books they've read, rate them, track reading goals, and share recommendations within a cozy digital reading sanctuary.

## Brief Description

Cozy BookNook is a full-featured book tracking application designed to create an inviting digital library experience. Users can maintain a personal bookshelf, track their reading progress, rate books, set reading goals, and discover recommendations in a beautifully designed interface with ambient animations and customizable themes.

## Features

- **Personal Book Library:**
  - Add books to your digital shelf
  - Store book metadata (title, author, ISBN)
  - Log reading dates and progress
  - Organize books by status (reading, completed, want-to-read)

- **Rating & Reviews:**
  - 5-star rating system
  - Written reviews and personal notes
  - Favorite books marking
  - Reading impressions and quotes

- **Reading Statistics:**
  - Books count display
  - Completed books tracker
  - Average rating calculation
  - Reading streak monitoring
  - Books read this year/month

- **Goal Tracking:**
  - Set annual reading goals
  - Track progress toward goals
  - Visual goal completion indicators
  - Achievement milestones

- **Recommendation System:**
  - Share book recommendations with others
  - Browse recommendations from community
  - Curated reading lists
  - Genre-based suggestions

- **Visual Design:**
  - Ambient particle background animations
  - Aesthetic, cozy interface
  - Multiple color themes (Berry-Much theme included)
  - Responsive, mobile-friendly layout
  - Smooth transitions and interactions

- **Data Persistence:**
  - Local storage of book collection
  - Browser-based data persistence
  - Import/export functionality

## Technologies Used

- **HTML5** - Semantic structure with meta tags for accessibility
- **CSS3** - Advanced styling with:
  - CSS Variables for theming
  - CSS Animations and transitions
  - Flexbox and Grid layouts
  - Gradient backgrounds
  - Ambient particle effects
- **JavaScript (ES6+)** - Core application logic
- **Local Storage API** - Data persistence
- **Google Fonts** - Custom typography (Gaegu font)
- **SVG** - Logo and icon rendering
- **Responsive Design** - Mobile and desktop support

## Installation / Setup Instructions

1. **Navigate to the project folder:**
   ```bash
   cd public/Book-Nook
   ```

2. **Open in a web browser:**
   - Open `index.html` in any modern web browser
   - No build process or external dependencies
   - All functionality works offline

3. **Alternative - Local development server:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Navigate to: http://localhost:8000/Book-Nook
   ```

## Usage Instructions

1. **Access Your Library:**
   - Open `index.html` in your browser
   - The header displays quick statistics about your collection
   - Main shelf displays all logged books

2. **Add Books to Your Shelf:**
   - Look for "Add Book" button in the interface
   - Enter book details:
     - Title (required)
     - Author (required)
     - ISBN (optional)
     - Publication year (optional)
     - Genre (optional)
   - Set current reading status
   - Click "Add to Shelf"

3. **Rate & Review Books:**
   - Click on a book in your shelf
   - Provide star rating (1-5 stars)
   - Write personal review or notes
   - Save your rating and review
   - Add book to favorites if desired

4. **Track Reading Progress:**
   - Mark current page/chapter
   - Log reading dates
   - Add reading notes and thoughts
   - Update status (reading, completed, abandoned, etc.)

5. **Monitor Statistics:**
   - View quick stats in header:
     - Total books shelved
     - Completed books count
     - Average rating
   - Check reading streaks
   - Monitor progress toward annual goals

6. **Set Reading Goals:**
   - Configure annual reading goal
   - Track books read this year
   - Receive progress notifications
   - Celebrate milestones

7. **Share Recommendations:**
   - Recommend books to others
   - Browse community recommendations
   - Create reading lists around themes
   - Discover new books based on interests

8. **Switch Themes:**
   - Access theme selector in settings
   - Choose from available color themes
   - Current theme: Berry-Much (warm, cozy colors)
   - Theme preference saves to local storage

## Project Structure

```
Book-Nook/
├── index.html          # Main application interface
├── script.js           # Application logic and state management
├── style.css           # Styling and theme definitions
└── README.md           # This file
```

## Features in Detail

### Quick Stats Bar
Displays key metrics at a glance:
- Total shelved books
- Completed books count
- Average book rating

### Ambient Design Elements
- Background glow effect for ambiance
- Smooth particle animations
- Gradient overlays
- Cozy color palette

### Book Card Display
- Book cover placeholder
- Title and author
- Rating stars
- Status badge
- Quick action buttons

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Local Storage

The application stores all data locally in the browser:
- Book collection data
- User ratings and reviews
- Reading statistics
- User preferences and theme selection
- No data sent to external servers

## Notes

- All data stored locally in browser storage (no cloud sync)
- Data persists across browser sessions
- Clearing browser storage will reset all data
- Perfect for personal book tracking and organization
- Great for finding and remembering recommended reads
- Designed to create a warm, inviting reading space
- No internet connection required after first load
