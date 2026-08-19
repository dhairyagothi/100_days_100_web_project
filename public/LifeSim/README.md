# LifeSim

LifeSim is a modular web application that combines developer productivity tools, financial tracking, and exploratory simulations into a cohesive single-page application experience.

## Goal
The primary objective of LifeSim is to provide an extensible hub for day-to-day operations:
- **Developer Hub (Focus List)**: A straightforward task management interface to keep track of current objectives.
- **Finance Dashboard**: A module to oversee and manage financial data (currently in development).
- **Life Simulation**: A visually engaging implementation of Conway's Game of Life for exploratory simulations.

## Tech Stack
- **HTML5**: Semantic and structural markup for the application.
- **CSS3**: Custom vanilla CSS for layout and responsiveness, avoiding heavy UI frameworks.
- **Vanilla JavaScript**: Pure JS implementation of the simulation rendering, task logic, and page routing logic. No external dependencies.

## Architecture & Separation of Concerns
Following standard software architecture best practices, the single-file structure has been modularized:
- `index.html`: Contains purely structure and UI semantics.
- `styles.css`: Independent styling, improving readability and caching.
- `app.js`: Core logic for tasks, routing, and Game of Life engine, fully abstracted out of the view layer.

## Future Features / Roadmap
- **Finance Dashboard Integration**: Implementing the full finance tracker and data visualization. 
- **Persistence**: Hooking the Focus List into `localStorage` or a backend so tasks are saved across sessions.
- **Advanced Simulation Configs**: Allowing users to adjust grid sizes, update speeds, and simulation rules inside the Life Simulation module.

## How to Run
Simply open `index.html` in any modern web browser. No compilation or start scripts required!
