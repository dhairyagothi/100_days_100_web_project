# Typer - Relaxing Typing Speed Test

A beautiful, minimalist typing speed test application built with vanilla HTML, CSS, and JavaScript. Perfect for practicing typing speed and accuracy in a calm, distraction-free environment.

## 🎯 Features

### Core Functionality
- **Real-time Typing Test**: Type randomized sentences and get instant visual feedback
- **Live Statistics**: Watch your WPM, accuracy, and character count update as you type
- **Stopwatch Timer**: Built-in timer to track how long your test takes
- **Randomized Sentences**: 15 diverse sentences that shuffle randomly each test

### Visual Feedback
- ✅ **Correct characters** turn **green**
- ❌ **Wrong characters** turn **red** with a highlight
- 🔵 **Current character** shows with a blue cursor that blinks
- Untyped text appears in muted gray

### Design & UX
- **Dark/Light Mode Toggle**: Easy on the eyes - switch themes with a button click (top-right corner)
- **Theme Persistence**: Your preferred theme is saved to your browser
- **Minimalist Aesthetic**: Clean, breathing interface with smooth animations
- **Responsive Design**: Works beautifully on desktop and mobile devices
- **Smooth Animations**: Fade-in effects and micro-interactions for polish

### Results Dashboard
After completing a test, view detailed statistics:
- **Words Per Minute (WPM)**: Your typing speed
- **Accuracy %**: Percentage of correctly typed characters
- **Time Taken**: Duration of the test
- **Error Count**: Total number of mistakes

## 🚀 How to Use

1. **Open the file**: Just double-click `typing_test.html` in your browser
2. **Start a test**: Click the blue "START TEST" button
3. **Type the sentence**: The text will appear in the center. Type it exactly as shown
4. **Watch the feedback**: See correct letters turn green, wrong ones turn red
5. **Complete**: When you type the entire sentence correctly, the test finishes automatically
6. **View results**: Your final stats appear on a results screen
7. **Try again**: Click "TRY AGAIN" to get a new random sentence and test again

### Controls
- **Start Test**: Begin a new typing test
- **Reset**: Clear your current input and reset the interface
- **Try Again**: After test completion, start a fresh test
- **Dark/Light Toggle**: Moon/Sun icon in top-right corner

## 📊 How Stats Are Calculated

### WPM (Words Per Minute)
```
WPM = (Characters Typed / 5) / (Time in Minutes)
```
The standard formula where 5 characters = 1 word.

### Accuracy
```
Accuracy = (Correct Characters / Total Characters Typed) × 100%
```
Shows what percentage of your typing was correct.

### Errors
```
Errors = Total Characters Typed - Correct Characters
```
The total number of mistakes made during the test.

## 💾 File Structure

The entire project is **ONE HTML file** with:
- **CSS Styling**: All visual design and animations
- **HTML Structure**: The layout and UI elements
- **JavaScript Logic**: All functionality and interactivity

**File Size**: ~25KB (super lightweight!)

## 🎨 Customization

### Add More Sentences
Edit the `sentences` array in the JavaScript section:
```javascript
const sentences = [
    "Your sentence here.",
    "Another sentence.",
    // Add as many as you want!
];
```

### Change Colors
Edit the CSS variables at the top:
```css
:root {
    --correct: #4ade80;        /* Green for correct */
    --wrong: #ef4444;          /* Red for wrong */
    --accent: #3b82f6;         /* Blue for cursor/accent */
    /* etc... */
}
```

### Adjust Timer Update Speed
In the `initTest()` function, change the interval:
```javascript
timerInterval = setInterval(() => { ... }, 100); // 100ms updates
```

## 🌓 Theme Colors

### Light Mode (Default)
- Background: White
- Text: Dark gray/black
- Borders: Light gray

### Dark Mode
- Background: Almost black (#0f0f0f)
- Text: White
- Borders: Dark gray
- Accent: Lighter blue

Both themes have subtle gradient backgrounds for atmosphere.

## 📱 Browser Support

Works on:
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Flexbox, gradients, animations, CSS variables for theming
- **Vanilla JavaScript**: No frameworks or libraries needed

### Key Features
- **localStorage**: Saves your theme preference
- **Event Listeners**: Real-time input handling
- **DOM Manipulation**: Dynamic text coloring and updates
- **Timer Interval**: Accurate time tracking
- **Regex-free**: Simple string comparison for accuracy

### Performance
- Lightweight single file
- No external dependencies
- Smooth 60fps animations
- Efficient DOM updates

## 📝 Example Sentences Included

The typing test comes with 15 diverse, relaxing sentences perfect for practice:
- "The quick brown fox jumps over the lazy dog."
- "Music has the power to heal the human soul."
- "Every sunset brings the promise of a new dawn."
- "Patience and persistence are keys to achieving success."
- And 11 more...

## 🎓 Perfect For

- 👨‍💻 Developers practicing typing skills
- 📚 Students improving typing speed
- 🎵 Anyone wanting a calm, zen typing practice
- 🌍 All ages and skill levels

## 💡 Tips for Best Results

1. **Sit up straight** - Good posture helps with accuracy
2. **Use proper finger position** - Home row typing is faster
3. **Don't look at the keyboard** - Focus on the screen
4. **Start slow** - Accuracy matters more than speed at first
5. **Take breaks** - Prevent fatigue with regular breaks
6. **Practice daily** - Consistency improves skills faster

## 📈 Progress Tracking

Keep track of your improvements:
- Note your WPM each session
- Track your accuracy percentage
- Try to improve one metric per week
- Re-test with the same sentence to compare

## ⚙️ Version Info

- **Version**: 1.0
- **Last Updated**: May 2026
- **Project**: 100 Days of Web - GSSoC 2026
- **Status**: Complete & Functional

## 🤝 Contributing

To improve this project:
1. Add more sentences for variety
2. Create sentence packs (easy, medium, hard)
3. Add time-limited challenges
4. Include typing tests in different languages
5. Add keyboard shortcut support

## 📄 License

Free to use and modify for personal and educational purposes.

---

**Happy Typing! 🎉**

Practice daily and watch your typing speed soar. Remember: accuracy first, speed comes naturally!