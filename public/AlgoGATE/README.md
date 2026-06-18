# AlgoGATE 🚀
Closes #8668
## Description
A production-grade, Competitive Programming Learning Platform built with React 19 + Firebase. 

Most CP platforms (like Codeforces, LeetCode) are raw problem archives — they give you thousands of problems but provide zero guidance on what to study, in what order, or how you're progressing. Students choose problems randomly, miss entire topic classes, and have no way to track their study effort holistically. 

A structured, topic-wise, difficulty-gated learning journey dramatically improves retention and interview readiness. AlgoGATE provides a curated path from 800 to 1800 rating tracks, Codeforces auto-syncing, a GitHub-style activity heatmap, integrated PDF study notes, and real-time discussion threads per problem.

## Features
- **Authentication**: Email/Password signup & login via Firebase Auth
- **Dashboard**: Streak tracker, stats overview, topic progress rings, activity heatmap
- **Topic-wise Practice**: 10+ DSA topics × 8 difficulty levels (800–1500) with 100+ curated CF problems
- **Star / Bookmark**: Bookmark problems; view them on a dedicated Starred page
- **Study Notes**: Browse PDF notes by subject (DSA Java, IITM BS Stats/Maths/Python)
- **Discussion Threads**: Real-time per-problem discussion via Firestore `onSnapshot`
- **Codeforces Auto-Sync**: Auto-detects and marks problems solved on Codeforces into AlgoGATE progress
- **Activity Heatmap**: Codeforces-style 52-week heatmap (AlgoGATE + CF unified)
- **Planner Calendar**: Plan and track your upcoming study sessions by date
- **Profile Page**: View stats, edit CF handle, manually trigger full sync
- **Hint System**: Collapsible, reveal-on-demand hints for curated problems

## Technologies Used
- React 19
- Vite
- Firebase v12 (Auth + Firestore)
- Tailwind CSS v3
- Codeforces Public REST API

## Installation/Setup
### Prerequisites
- Node.js ≥ 18
- A Firebase project with Authentication (Email/Password) and Firestore enabled

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/YASHK-arch/AlgoGATE.git
   cd AlgoGATE
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in a `.env` file:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
4. Run locally:
   ```bash
   npm run dev
   ```

## Usage
1. Open the app in your browser at `http://localhost:5173`.
2. Sign up or log in using your email and password.
3. Update your Codeforces handle in your profile to auto-sync your problem-solving history.
4. Navigate to the **Practice** section to follow curated topic-wise paths and improve your competitive programming skills.
5. Track your daily streak, activity heatmap, and topic mastery on the Dashboard.

## Screenshots
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=github)](https://YASHK-arch.github.io/AlgoGATE)
[![Video Demo](https://img.shields.io/badge/Video-Demo-red?style=for-the-badge&logo=youtube)](https://youtu.be/4P8quFQMnJE)



## Contributing
Feel free to fork, study, and build on top of AlgoGATE. If you'd like to contribute, please fork the repository, make your changes, and submit a pull request. We welcome any improvements to the question sets, notes, or platform features.

## License
MIT License

## Author
YASHK-arch
