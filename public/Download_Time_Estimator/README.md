# Download Time Estimator (NetMetrics)

A real-time bandwidth calculator that instantly computes download duration from file size and network speed, with multi-unit conversions and storage footprint visualization.

## Description

NetMetrics Dashboard is a practical utility for estimating how long file transfers will take based on your network speed and file size. Input any file size (terabytes to kilobytes) and any network bandwidth (gigabits to kilobytes per second), and instantly see the download duration and equivalent storage sizes across multiple units. Perfect for system administrators, network engineers, content creators, and anyone who needs quick bandwidth calculations without complex formulas.

## Features

- **Real-Time Calculations**: Instantly updates download time as you adjust file size or speed
- **Flexible Size Units**: TB, GB, MB, KB with automatic conversion
- **Flexible Speed Units**: Gbps (Gigabits/s), Mbps (Megabits/s), Kbps (Kilobits/s), MB/s (Megabytes/s)
- **Download Time Display**: Shows estimated duration in formatted `HHh MMm SSs` notation
- **Actual Transfer Rate**: Converts bandwidth to effective MB/s transfer rate
- **Storage Matrix**: Displays file size equivalents across all units (TB, GB, MB, KB) simultaneously
- **Smart Rate Formatting**: Automatically shows speeds in appropriate units (GB/s, MB/s, or KB/s) based on magnitude
- **Dark/Light Theme**: Toggle between dark and light modes with persistent localStorage storage
- **Responsive Design**: Mobile-friendly layout that adapts to small screens
- **No External Dependencies**: Pure vanilla HTML, CSS, and JavaScript
- **Accessible**: Semantic HTML with ARIA labels for accessibility

## Tech Stack

- **HTML5** — semantic structure, form inputs, display elements
- **CSS3** — custom properties (variables), dark/light theme, flexbox layout, responsive design, smooth transitions
- **Vanilla JavaScript (ES6)** — real-time calculations, unit conversions, event handling, localStorage API for theme persistence

## Folder Structure

```text
Download_Time_Estimator/
│
├── index.html      # Dashboard layout — inputs, displays, theme toggle
├── script.js        # Calculation engine, event listeners, theme management
├── style.css        # Dark/light themes, responsive layout, component styling
└── README.md        # Project documentation
```

## Setup / Run Instructions

No build step or dependencies required. This is a standalone web utility.

### Option 1: Open Directly
1. Navigate to the `Download_Time_Estimator` folder.
2. Double-click `index.html` to open in your browser.

### Option 2: Use a Local Server (recommended)
Using VS Code:
1. Install the **Live Server** extension.
2. Open the project folder in VS Code.
3. Right-click `index.html` → **Open with Live Server**.

## Usage

### Setting File Size

1. **Enter Quantity**: Type a number in the "File/Storage Size" input field
2. **Select Unit**: Choose from the dropdown:
   - **TB** (Terabytes) — for massive files or storage pools
   - **GB** (Gigabytes) — common for videos, backups, software
   - **MB** (Megabytes) — documents, images, smaller files
   - **KB** (Kilobytes) — tiny files, text documents
3. **Automatic Updates**: Dashboard recalculates instantly

### Setting Network Speed

1. **Enter Speed Value**: Type a number in the "Network Bandwidth (Speed)" field
2. **Select Speed Unit**: Choose appropriate bandwidth measurement:
   - **Gbps** (Gigabits/second) — fiber, enterprise networks
   - **Mbps** (Megabits/second) — typical home internet, DSL, mobile
   - **Kbps** (Kilobits/second) — slow connections, legacy networks
   - **MB/s** (Megabytes/second) — direct byte rate (no bit conversion needed)
3. **Automatic Conversion**: System converts to MB/s internally and recalculates

### Reading Results

**Download Clock Section:**
- **Large Time Display**: Shows download duration in `HHh MMm SSs` format
  - Example: `02h 30m 45s` means 2 hours, 30 minutes, 45 seconds
  - Leading zeros ensure readability (e.g., `00h 05m 02s`)
- **Actual Transfer Rate**: Shows equivalent transfer speed in most appropriate units
  - `12.5 MB/s` for typical broadband
  - `1.25 GB/s` for high-speed connections
  - `125.0 KB/s` for slow connections

**Storage Footprint Matrix:**
- Grid shows file size converted to all units simultaneously:
  - **Terabytes (TB)**: For very large files, displayed to 4 decimal places
  - **Gigabytes (GB)**: Standard unit, shown to 4 decimal places
  - **Megabytes (MB)**: Familiar unit with comma-separated thousands
  - **Kilobytes (KB)**: Smallest unit, good for precise calculations

### Theme Toggle

**To Switch Theme:**
1. Click the theme button in the top-right corner (☀️ for light / ☾ for dark)
2. UI instantly switches to selected theme
3. Preference is saved automatically for next visit

## How It Works

### Core Calculation

The fundamental equation for download time:
```
Download Time (seconds) = File Size (MB) / Transfer Speed (MB/s)
```

### File Size Normalization

All file sizes are first converted to Megabytes (MB) as the internal anchor:

```javascript
switch (unit) {
    case 'TB': sizeInMB = value * 1024 * 1024;  // 1 TB = 1,048,576 MB
    case 'GB': sizeInMB = value * 1024;          // 1 GB = 1,024 MB
    case 'MB': sizeInMB = value;                 // Already MB
    case 'KB': sizeInMB = value / 1024;          // 1 MB = 1,024 KB
}
```

### Speed Conversion

Network bandwidth is converted from bits to bytes and normalized to MB/s:

```javascript
switch (unit) {
    case 'Gbps': speedInMBps = (value * 1024) / 8;        // Gigabits → Megabytes
    case 'Mbps': speedInMBps = value / 8;                  // Megabits → Megabytes
    case 'Kbps': speedInMBps = value / (1024 * 8);         // Kilobits → Megabytes
    case 'MBps': speedInMBps = value;                      // Already Megabytes/s
}
```

### Time Formatting

Duration is broken into hours, minutes, and seconds with zero-padding:

```javascript
hours = Math.floor(totalSeconds / 3600);
minutes = Math.floor((totalSeconds % 3600) / 60);
seconds = Math.floor(totalSeconds % 60);

formatted = `${hours.padStart(2, '0')}h ${minutes.padStart(2, '0')}m ${seconds.padStart(2, '0')}s`
```

### Smart Speed Formatting

Transfer rate is displayed in the most readable unit:

```javascript
if (speedInMBps >= 1024) {
    display as GB/s  // e.g., "1.25 GB/s"
} else if (speedInMBps < 0.01) {
    display as KB/s  // e.g., "5.2 KB/s"
} else {
    display as MB/s  // e.g., "12.5 MB/s"
}
```

### Theme Persistence

Theme preference is saved to browser localStorage:

```javascript
// Save preference
if (lightTheme) localStorage.setItem('theme', 'light');
else localStorage.setItem('theme', 'dark');

// Load preference on next visit
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-theme');
}
```

## Implementation Notes

- **Real-Time Updates**: All calculations trigger on `input` or `change` events, ensuring instant feedback
- **CSS Custom Properties**: Theme colors defined as variables for easy light/dark switching
- **Smooth Transitions**: 0.3s transitions on color and background changes for comfortable theme toggling
- **Responsive Input**: Inputs use `flex-direction: column` on mobile (< 440px) to prevent cramping
- **Monospace Numbers**: Time and storage values use monospace font for alignment and readability
- **Number Formatting**: 
  - `toFixed()` for decimals to control precision
  - `toLocaleString()` for comma-separated thousands in MB display
  - `padStart()` for zero-padded time components
- **Edge Cases**: Zero or negative inputs result in "00h 00m 00s" and "0 MB/s" to prevent NaN display

## Educational Value

This project demonstrates:

- Real-time reactive calculations and UI updates
- Multi-unit conversion logic and algorithm design
- Event-driven architecture with input listeners
- Browser localStorage API for persistence
- CSS custom properties (variables) for theming
- Dark/light mode implementation
- Responsive design with media queries
- Number formatting and localization
- Mathematical calculations (division, modulo, floor functions)
- String manipulation and padding
- Flexbox layout for responsive design
- Semantic HTML and accessibility

## Common Use Cases

**For System Administrators:**
- Estimate backup/restore duration
- Plan data migration timing
- Verify bandwidth utilization

**For Network Engineers:**
- Validate connection speeds
- Troubleshoot slow downloads
- Plan network upgrades

**For Content Creators:**
- Check upload times before sending files
- Estimate viewer download durations
- Plan bandwidth requirements

**For Developers:**
- Test large file transfers
- Plan deployment timings
- Understand data transfer constraints

## Example Scenarios

**High-Speed Fiber Backup:**
- File: 500 GB
- Speed: 1 Gbps
- Result: ~66 minutes (1h 06m 40s)

**Mobile Hotspot Download:**
- File: 1.5 GB
- Speed: 20 Mbps
- Result: ~10 minutes (10m 2s)

**Enterprise Data Transfer:**
- File: 10 TB
- Speed: 100 Mbps
- Result: ~23 hours (23h 26m 4s)

**Slow Connection Upload:**
- File: 100 MB
- Speed: 1 Mbps
- Result: ~13 minutes (13m 20s)

## Future Enhancements

Potential improvements:

- **Overhead Factor**: Account for protocol overhead (TCP/IP, encryption) with a percentage slider
- **Network Variability**: Show best-case, average-case, and worst-case scenarios
- **Multiple Transfers**: Calculate simultaneous file transfers with shared bandwidth
- **History**: Save and recall previous calculations
- **Batch Upload**: Calculate total time for multiple files with different sizes
- **Unit Conversion Only**: Separate utility for just converting between units
- **Speed Presets**: Quick buttons for common speeds (Home WiFi, 4G LTE, Fiber, etc.)
- **Latency Impact**: Factor in connection latency and retransmissions
- **Download Graph**: Visualize transfer progress over time
- **Share Results**: Generate shareable links with saved calculations
- **Mobile App**: React Native or Flutter port for mobile devices
- **Advanced Settings**: Packet loss, compression ratio, protocol efficiency controls
- **Temperature Display**: Time in different formats (ISO 8601, spoken words, etc.)

## Browser Compatibility

Works on all modern browsers supporting:
- ES6 JavaScript
- CSS custom properties
- localStorage API
- Flexbox

**Tested on**: Chrome, Firefox, Safari, Edge

## Accessibility

- Semantic HTML form elements
- ARIA labels for screen readers
- Focus states for keyboard navigation
- Color contrast meets WCAG AA standards in both themes
- Readable font sizes with proper line height

## License

This project is open-source and available for educational and personal use.

## Author

Contributed as part of the [100 Days 100 Web Projects](../../README.md) challenge.
