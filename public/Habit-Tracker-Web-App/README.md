# Habit Tracker Web App

A responsive Habit Tracker for creating daily habits, tracking completion, viewing weekly progress, and reviewing habit analytics.

## Features

- Create habits with name, tags, daily goal, reminder time, notes, and schedule.
- Validate required fields before adding a habit.
- Restrict Daily Goal to positive whole numbers.
- Show inline validation messages and success/error feedback.
- Mark habits as done or undo today's completion.
- Delete habits with confirmation.
- Track current streak, best streak, weekly progress, and completion history.
- Persist habits in localStorage.
- View analytics for completion rates, streaks, and activity heatmaps.
- Switch between light and dark theme on both Tracker and Analytics pages.
- Responsive layout for desktop and mobile screens.

## Recent Improvements

- Fixed the habit creation workflow so habits are added, saved, and rendered correctly.
- Replaced inconsistent/undefined add-habit variables with a single working form flow.
- Standardized completion tracking around `completionDates` while keeping compatibility with older `history` data.
- Added proper numeric validation for the Daily Goal field.
- Cleaned up broken and unused UI fragments from the main page.
- Moved navigation into a top bar to avoid overlap.
- Matched the theme styling between the main tracker page and analytics page.
- Removed encoding/mojibake characters from visible UI text.

## Files

- `index.html` - Main Habit Tracker page.
- `style.css` - Main page styling, form validation states, responsive layout, and theme styles.
- `script.js` - Habit creation, validation, rendering, progress, streaks, delete flow, reminders, and localStorage logic.
- `analytics.html` - Analytics dashboard page.
- `analytics.css` - Analytics dashboard styling.
- `analytics.js` - Analytics calculations and charts based on saved habits.
- `analytics-nav.css` - Shared navigation styling for tracker and analytics pages.

## How to Run

Open `index.html` in a browser.

No build step or package installation is required.

## Manual Testing Checklist

1. Open `index.html`.
2. Try adding a habit without a name.
3. Try entering invalid Daily Goal values such as text, symbols, zero, or negative numbers.
4. Add a valid habit with a positive numeric goal.
5. Confirm the habit appears in Today's habits and Progress charts.
6. Mark the habit as done and undo it.
7. Delete the habit and confirm it is removed.
8. Switch light/dark theme on the tracker page.
9. Open `analytics.html` and confirm the same theme style is applied.
