# Nexus - Collaborative Study Room Platform (Full-Stack JWT & Google OAuth)

Nexus is an advanced, high-fidelity collaborative study room platform designed to help students and professionals focus, maintain accountability, and study productively in virtual group environments. 

This repository houses an enterprise-grade full-stack architecture tailored for collaborative study, featuring a Java Spring Boot secure API backend, a Supabase PostgreSQL database, and a highly interactive Vanilla JS frontend client served directly from the backend.

**🌐 Live Production Deployment:** [https://nexus-collaborative-study-room-platform.onrender.com/](https://nexus-collaborative-study-room-platform.onrender.com/)

---

## ✨ Features

*   **Real-time Study Rooms**: Create and join dedicated rooms for focused studying with other peers.
*   **Pomodoro Focus Timer**: Integrated timers to manage focus sessions and breaks.
*   **Gamification & Badges**: Earn XP and unlock achievement badges based on your study habits (time focused, chat messages, etc).
*   **Jaypee Medical Study AI**: A built-in AI chatbot capable of answering questions, summarizing topics, and automatically generating study flashcards.
*   **Shared Interactive Tools**: Real-time synced whiteboard, revision flashcards, and group notes.
*   **Focus Soundscapes**: Built-in audio synthesizer for ambient focus sounds.
*   **Admin Security Portal**: A restricted dashboard for administrators to monitor platform health, active users, and manage study rooms.
*   **Robust Authentication**: Secure, stateless authentication utilizing JSON Web Tokens (JWT) and integrated Google OAuth 2.0.

---

## 🛠 Technology Stack

### Backend Architecture (`/backend`)
*   **Core Framework**: Java 17, Spring Boot 3.x (Spring MVC REST Web Services)
*   **Security & Encryption**: Spring Security 6, BCrypt Password Encoder
*   **Session Management**: Stateless authentication powered by JSON Web Tokens (JJWT library)
*   **Data Persistence**: Spring Data JPA (Java Persistence API), Hibernate ORM
*   **Database**: Supabase PostgreSQL (Production) / In-Memory H2 SQL Database (Local fallback)
*   **Build Tool**: Maven

### Frontend Client (Served natively from Spring Boot)
*   **Layout & Styling**: Semantic HTML5, Vanilla CSS3 (Custom properties, CSS Grid/Flexbox, Glassmorphism, 3D CSS Card Flips)
*   **Logic & Routing**: Vanilla ES6 JS Modules (Dynamic component routing via reactive State Proxy binding)
*   **Cloud Authentication**: Official Google Identity Services (GSI) SDK integration (OAuth 2.0 Implicit Token Client flow)
*   **Real-time Collaboration**: HTML5 `BroadcastChannel` API (Serverless multi-tab data synchronization)
*   **Audio Engine**: Web Audio API (Synthesizing oscillators, LFOs, and filters entirely in the browser)

---

## 🚀 Step-by-Step Execution Guide

Because the frontend is fully integrated into the Spring Boot application (housed in `backend/src/main/resources/static`), you only need to run the backend server to launch the entire platform.

### Step 1: Configure Environment Variables
Before running the application, make sure your database credentials and API keys are configured:
1. Open the environment file at: **`backend/.env`**.
2. Define the following key-value pairs to connect to your Supabase PostgreSQL instance:
   ```env
   SUPABASE_DB_URL=jdbc:postgresql://db.[project].supabase.co:5432/postgres
   SUPABASE_DB_USER=postgres
   SUPABASE_DB_PASSWORD=your_password
   ```
3. Open **`backend/src/main/resources/static/.env`** to configure your frontend parameters:
   *   `GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.
   *   `API_BASE_URL`: `http://localhost:8080/api`

### Step 2: Build & Start the Server
Ensure you have **Java JDK 17** (or higher) and **Maven** installed.

1. Open a terminal window and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build the project and download Maven dependencies:
   ```bash
   mvn clean package
   ```
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

### Step 3: Access the Application
1. Open your web browser and navigate to: **`http://localhost:8080/index.html`**
2. Register an account, log in, or use Google Sign-In to enter the study platform.

---

## 🔐 Admin Security Portal

Nexus features a dedicated, exclusive login portal for administrators to monitor platform statistics, users, and rooms.

### How to Create an Admin Account
The system automatically grants `ADMIN` privileges to any account registered with the official admin email.
1. Go to the public application: `http://localhost:8080/index.html`
2. Sign up for a new account using the email **`admin@nexus.com`** and a password of your choice.

### How to Access the Dashboard
1. Navigate directly to the Admin Security Portal: **`http://localhost:8080/admin-login.html`**
2. Log in using your `admin@nexus.com` credentials.
3. Once authenticated via the JWT server, you will be securely routed to the internal administrative dashboard.
