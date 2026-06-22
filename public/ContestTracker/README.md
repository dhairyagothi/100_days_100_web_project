# Multi-Platform Competitive Programming Contest Tracker

A modern, responsive web application that aggregates and displays upcoming competitive programming contests from multiple platforms in real time.

## ✨ Features

- **Multi-Platform Support**: Fetches contests from:
  - Codeforces
  - AtCoder
  - HackerRank
  - (Easily extensible for LeetCode, CodeChef, HackerEarth)

- **Real-Time Updates**: Automatically refreshes contest data every 5 minutes

- **Live Countdown Timers**: Shows time remaining until each contest starts with intelligent formatting:
  - Shows days, hours, minutes, seconds for contests far away
  - Reduces to hours/minutes/seconds as the contest approaches

- **Smart Filtering**: 
  - Filter by platform
  - Sort by time or platform

- **Responsive Design**: 
  - Works seamlessly on desktop, tablet, and mobile devices
  - Mobile-optimized grid layout
  - Touch-friendly controls

- **Enhanced UI/UX**:
  - Platform-specific badge colors
  - Smooth hover effects and transitions
  - Visual feedback on all interactions
  - Clear typography and hierarchy
  - Terminal/matrix aesthetic with professional polish

- **Timezone Conversion**: Automatically converts UNIX timestamps to local timezone

- **Error Handling**: Graceful error messages if contest data fails to load

- **Last Updated Timestamp**: Shows when data was last refreshed

## 🛠 Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Grid layout, responsive design, CSS variables for theming
- **Vanilla JavaScript**: Async/await, fetch API, DOM manipulation
- **APIs**: Multiple competitive programming platform REST APIs

## 🚀 How to Run

1. Save the three files (`index.html`, `style.css`, `script.js`) in the same directory
2. Open `index.html` in any modern web browser
3. Ensure you have an active internet connection for API calls
4. Enjoy real-time contest updates!

## 📱 Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🎨 Design Highlights

- **Terminal Aesthetic**: Green-on-black color scheme with matrix-like visual elements
- **Platform Badges**: Each contest source has a distinct color:
  - Codeforces: Dark purple
  - AtCoder: Bright blue
  - HackerRank: Green
- **Accessibility**: Proper heading hierarchy, semantic HTML, high contrast
- **Performance**: No external dependencies, lightweight and fast

## 📊 Data Refresh Strategy

- Automatic refresh every 5 minutes
- Manual refresh available through browser reload
- Failed requests don't break the application

## 🔄 Extensibility

To add a new platform:

1. Create a fetch function (e.g., `fetchCodeChef()`)
2. Return data in this format:
   ```javascript
   {
       site: 'Platform Name',
       name: 'Contest Name',
       start_time: timestamp_in_ms,
       duration: duration_in_seconds,
       url: 'link_to_contest',
       platform_key: 'lowercase_platform_name'
   }
   ```
3. Add the promise to the `fetchContests()` function's promises array
4. (Optional) Add platform-specific badge color to CSS

## 📝 Notes

- Times are displayed in your local timezone
- Contests that have started show "Started!" message
- The grid automatically adjusts based on available screen width
- All external links open in a new tab

## 👨‍💻 Author

Enhanced version with multi-platform support and improved UI/UX

## 📄 License

Free to use and modify for educational and personal purposes

## 🤝 Contributing

Feel free to fork, modify, and extend with additional platforms or features!