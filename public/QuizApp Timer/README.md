# QuizMaster

Enhanced multi-category quiz application with performance tracking and personal bests.

## Features

### Core Quiz Functionality
- Multiple quiz categories (General Knowledge, Science, History, Technology)
- Adjustable difficulty levels (Easy, Medium, Hard)
- Customizable number of questions (5, 10, 15, 20)
- Real-time timer and score display
- Explanations for correct answers

### New Enhancements
- **Performance Analytics Dashboard** (in side panel on desktop, stacked on mobile):
  - Best Score
  - Average Score
  - Total Quizzes Taken
  - Accuracy Percentage
- **Personal Best by Category**: Track your highest score in each quiz category
- **Achievement Badge System**: 
  - Quiz Master (100%)
  - Expert (80%+)
  - Scholar (60%+)
  - Learner (below 60%)
- **LocalStorage Persistence**: All statistics are saved locally in your browser
- **Responsive Design**: Works great on mobile, tablet, and desktop devices
- **Modern UI**: Clean, gradient-based design consistent with the original theme

## Usage

Open `index1.html` in your browser to start using QuizMaster.

### LocalStorage Keys
- `quizMasterStats`: Stores overall quiz statistics
- `quizMasterPersonalBest`: Stores best scores per category
