# Flashcard Quiz App

A simple, interactive flashcard quiz application built with HTML, CSS, and Vanilla JavaScript. Perfect for studying and practicing new concepts!

## Features

### 1. Normal Practice Mode
- Browse through your flashcards
- Check answers and get instant feedback
- Add, edit, or delete flashcards (with optional hints!)
- Save flashcards to localStorage for persistence

### 2. Timed Challenge Mode ⚡
The brand new Timed Challenge Mode adds excitement and urgency to your study sessions!

#### Features of Timed Challenge Mode:
- **Choose Your Duration**: Select between 30, 60, or 120 seconds
- **Real-Time Statistics Dashboard**: Track your progress as you go!
  - ⏱️ Time Left: Countdown of remaining time
  - ✅ Correct Answers: Number of correctly answered cards
  - ❌ Wrong Answers: Number of incorrect attempts
  - 📊 Questions Attempted: Total cards answered
  - 🎯 Accuracy: Percentage of correct answers
  - 🏆 Best Score: Highest score saved to localStorage
- **Auto-Next Card**: After a correct answer, automatically moves to the next card after 1 second
- **Results Modal**: When time's up, view a comprehensive summary of your performance
  - Final Score
  - Correct & Wrong Answers
  - Accuracy %
  - Best Score
  - Play Again button to retry

### 3. Hint System 💡
Every flashcard can have a custom hint! If no hint is provided, one is automatically generated (shows first 2 characters and answer length)

### 4. Improved Answer Flow
- "Show Answer" hidden by default
- Hint button to get a helpful tip
- On incorrect answer: "Show Answer" becomes visible, and you can try again
- On correct answer: Buttons disable, and auto-next card

### 5. LocalStorage Support
All your flashcards and best timed score are saved locally in your browser!

## How to Use

### Normal Practice Mode
1. View the question on the flashcard
2. (Optional) Click "Hint" to get a helpful tip
3. Type your answer in the input field
4. Click "Check Answer" to see if you got it right!
5. Use "Previous" and "Next" buttons to navigate
6. Use the "Add / Edit Flashcard" section to manage your deck (can include custom hints!)

### Timed Challenge Mode
1. Find the "Timed Challenge Mode" section at the top of the page
2. Choose your desired duration from the dropdown (30s, 60s, or 120s)
3. Click "Start Timed Challenge"
4. Answer as many flashcards as you can before time runs out!
5. When the challenge ends, view your results in the modal
6. Click "Play Again" to try again and beat your best score!

## Technologies Used
- HTML5
- CSS3 (responsive design, smooth transitions, animations)
- Vanilla JavaScript
- localStorage for data persistence

## Screenshots
You can add screenshots of the app here!
- Normal Practice Mode with Hints
- Timed Challenge Setup
- Timed Challenge in Progress with Statistics Dashboard
- Results Modal

## Creator
Developed as part of the 100 Days 100 Web Projects initiative.
