# FlashFocus - An Observation Game

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD622)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-1C1C1C?style=for-the-badge&logo=supabase&logoColor=3ECF8E)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

</div>

## About the project

A fast-paced, full-stack visual memory and attention-to-detail game. Users choose a difficulty level, observe a complex image under a strict countdown timer, and then answer dynamic, randomized quiz questions fetched from a secure PostgreSQL database based on what they can recall.

## Key Features

* **Smart Type Protection:** Stops database errors by forcing incoming data types to strictly convert into clean numbers before running any database lookups.
* **Real-Time Cloud Queries:** Connects directly to a cloud Supabase database to fetch the exact question set instantly without lagging the user interface.
* **Safe Database Access:** Uses PostgreSQL Row-Level Security (RLS) policies so players can read game questions securely without exposing sensitive backend infrastructure.
* **Responsive Gaming Interface:** Built with a clean, responsive layout using Tailwind CSS that looks sharp on mobile screens, tablets, and desktop monitors alike.
* **Modular & Reusable Component Architecture:** The codebase follows a clean, decoupled design pattern.

## Tech Stack

* **Frontend Architecture:** React (v18), TypeScript (Strict Mode)

* **Build Tool:** Vite

* **Routing Infrastructure:** React Router DOM

* **Styling Engine:** Tailwind CSS, Headless UI components, Lucide React

* **Backend Database:** Supabase (PostgreSQL engine)

  
## Project Structure

``` text
FlashFocus-An Observation Game/
├── src/
│   ├── Components/
│   │   ├── Navbar.tsx        # Persistent header navigation bar
│   │   ├── Timer.tsx         # Component managing the quiz & observation countdowns
│   │   ├── Quiz.tsx          # Dynamic challenge arena with strict type checks
│   │   └── ...
│   ├── supabaseClient.ts     # Initialized client configuration for the database
│   ├── App.tsx               # Primary router tree mapping
│   └── main.tsx              # Application entry mounting point
├── supabase/                 # Database seed templates and schema helpers
├── .env.example              # Public documentation tracker for required environment variables
├── .gitignore                # Protects environment keys from being pushed to GitHub
├── eslint.config.js          # Code quality and syntax rule parameters
├── index.html                # Single-page application template container
├── package.json              # Active system node dependency tracking scripts
├── tsconfig.json             # TypeScript root compilation preferences
└── vite.config.ts            # Vite compiler build settings

```

## Working

https://github.com/user-attachments/assets/df1b88de-7129-4f56-92a0-d02e1b59d609

