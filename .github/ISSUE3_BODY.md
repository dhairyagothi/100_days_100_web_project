## 144 Project Directories Missing from projects.json Registry

## Issue

There are **144 project directories** in the `public/` directory that have no corresponding entry in `projects.json`. This means these projects are invisible on the main showcase website -- they exist in the repo but cannot be browsed or discovered through the project grid.

### Impact
- Users cannot find or access these projects from the main site
- Projects are effectively hidden/dead content
- New contributors may create duplicate projects not knowing these exist

### Full List (144 directories)
AdvancedFormBuilder, advice-generator, Air-Typing-Keyboard, AmazonClone, api-batching-engine, AttendancePro, Bill-Splitter, bubble game, ButtonsUIPage, Calculator, Calendar UI for service appointments with time slots, Casino_Memory_Match, checkers game, Chess_Game, code-playground, color_picker, color-palette-generator, columnar-data-engine, connect 4 game, Connect4, Contact Book, core-performance-utils, CountDown Timer, counter-app, Country Quiz Game, crossword_game, CrosswordPuzzleGame, Crypto Tracker & Market Analytics Dashboard, Cryptocurrency-Calculator, crypto-tracker, CSSShadowGenerator, currency_converter, CurrencyConverter-webapp, cute-calculator, CyberPulse-AI, Daily-Water-Intake-Tracker, day-10-color-picker, Dental Care Services, Diabetes-Health-Risk, dictionary-app, Discord project, dom-virtualization-pipeline, eisenhower-matrix-tool, event-registration-system, EveSparks, ExpenseTracker, Fact-Generator, Fake_API_Data_Generator, fake-hacker-terminal, File Uploader, FlashcardApp, FlashFocus-An_Observation_Game, Flip Clock, focustimer, fruit slice, game, github-finder, Glassmorphism-Generator, GradientPaletteGenerator, Guessing Game, guided-breathing-visualizer, Habit_Tracker, Heart-Risk-Prediction, image-particle-engine, images, IncidentCommunicationWarRoom, invisible maze runner game, job-tracker-system, jokes_site, live-code-playground, loginusingmern, lru-cache-engine, Markdown to HTML, markdown-editor, Mern Login Form, MERN_Job_Board, Mini_Calendar, minimalist-kanban-board, mini-postman, MLImpactVisualizer, mood-tracker-dashboard, movie-selector, multi-threaded-data-engine, music_website, Naukri_Campus_Clone, NEON_ORBIT, NeuralNetworkPlayground, New-AmazonClone, Number Guessing Game, PerfectSlice, Personal_website, pig_game, pixel-art, PixelArtCanvasEditor, Plant, Pomodoro__Timer, Pomodoro-Garden, pomodoro-timer-dashboard, Productivity-Dashboard, qr_generator, Quantum_CodeBreaker, RandomJokeGenerator, Razorpay, reactive-state-engine, Recipe Genie, RECIPE_Genie, recipe-finder, Resume Previewer, Secure_Password_Generator, secure-hashing-engine, Self-Improvement, SimpleDigitalClock, spotify clone, StudentCommandCenter, Stydy Sync, Stydy-Sync, Sudoku, SudoSolve, SVGPathBuilder, swiggy, Swiper API Slider, TENZI-GAME, TerminalPortfolio, text-to-readme, TheLastTab, time_rewind, Tower-of-Hanoi-Visualizer, Travelling_Breakthroughs, trie-search-engine, Twitter-clone, Typemaster, Unit-Kitchen, user_reviews, VirtualAudioSynth, Voting_Application_Backend, WanderLust, waterTracker, weather-app, Web-Kernal-simulator, Whack a mole, Word_dictionary, ZEN_TIMER, zen-breathing-visualizer, Zodiac

## Required Changes (1200+ Lines)
1. Audit each directory for entry point (index.html)
2. Determine project type, tech stack, difficulty
3. Add project entries to projects.json
4. Verify no duplicate entries were added

**Files affected:** 1 (projects.json)
**Total lines added:** ~1200+ (144 entries x ~8 lines each)
