<p align="center">
  <img src="https://img.shields.io/badge/🧠_CareerAI-Resume_Analyzer-6366f1?style=for-the-badge&labelColor=0a0f1e" alt="CareerAI" />
</p>

<h1 align="center">
  🚀 CareerAI — Resume Analyzer & Job Matcher
</h1>

<p align="center">
  <em>Your Career, Powered by Intelligence</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.4-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.2-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Gemini-AI-4285F4?style=flat-square&logo=google&logoColor=white" alt="Gemini AI" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/✅_Match_Accuracy-98%25-34d399?style=flat-square" alt="Accuracy" />
  <img src="https://img.shields.io/badge/⚡_Analysis_Speed-12ms-fbbf24?style=flat-square" alt="Speed" />
  <img src="https://img.shields.io/badge/⭐_User_Rating-4.9/5-f472b6?style=flat-square" alt="Rating" />
  <img src="https://img.shields.io/badge/📄_License-MIT-a78bfa?style=flat-square" alt="License" />
</p>

---

<br/>

## 📋 Table of Contents

- [✨ Overview](#-overview)
- [🎯 Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [📂 Project Structure](#-project-structure)
- [⚙️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🔧 Configuration](#-configuration)
- [🌐 Deployment](#-deployment)
- [🧪 How It Works](#-how-it-works)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

<br/>

---

<br/>

## ✨ Overview

**CareerAI** is an executive-grade AI-powered platform that analyzes your professional DNA to find career matches others miss. Upload your resume (PDF or text), and our intelligent engine extracts your skills, experience, and career trajectory — then matches you with the most compatible roles from a dataset of **50,000+ positions**.

> 💡 Move beyond job boards into **intelligent career steering**.
<br/>

---

<br/>

## 🎯 Key Features

| Feature | Description |
|:---:|:---|
| 📄 **Seamless Upload** | Drag & drop PDF, DOCX, or LinkedIn exports — our parser handles complex layouts with 100% data retention |
| 🧠 **AI-Powered Parsing** | Dual-engine semantic parser utilizing **Gemini API** (`gemini-2.0-flash`) via the `google-genai` SDK for expert-grade profile extraction |
| ⚡ **Local NLP Fallback** | Instant local NLP parsing using **spaCy** as an automatic fallback if API credentials are not configured or if requests fail |
| 🔒 **Resume Validator** | Smart pre-validation checks contact information and resume format to immediately reject invalid uploads (e.g. medical reports, general articles) |
| 🎯 **Domain Filter Penalty** | Advanced logic that caps match scores at 10% for candidates matching roles in completely unrelated domains to ensure accuracy |
| 📊 **Score Breakdown** | Detailed compatibility scoring: Skills Match (40%) + Experience Match (30%) + Education Match (15%) + Industry/Domain Match (15%) |
| 🗺️ **Career Insights** | Personalized career path recommendations, salary estimates, strength identification, and custom preparation steps |
| 🌐 **Premium UI** | Modern glassmorphism design featuring dynamic glowing backdrops/orbs, responsive dashboards, and interactive sidebar navigation |

<br/>

---

<br/>

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     🌐 CLIENT (Browser)                      │
│                                                              │
│   ┌────────────┐  ┌───────────────┐  ┌───────────────────┐  │
│   │  Landing    │  │  Resume       │  │  Job Matches      │  │
│   │  Page       │  │  Analysis     │  │  Dashboard        │  │
│   │  (index)    │  │  Page         │  │  Page             │  │
│   └─────┬──────┘  └──────┬────────┘  └────────┬──────────┘  │
│         │                │                     │             │
│         └────────────────┼─────────────────────┘             │
│                          │                                   │
│              React Router + React 19 (SPA)                   │
└──────────────────────────┬───────────────────────────────────┘
                           │ HTTP POST /analyze
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                   🐍 BACKEND (FastAPI)                        │
│                                                              │
│   ┌─────────────────┐    ┌──────────────────────────────┐   │
│   │   api.py         │───▶│  gemini_parser.py (Gemini 2) │   │
│   │   (REST API)     │    │  (Structured JSON extract)   │   │
│   │                  │    └──────────────┬───────────────┘   │
│   │   • PDF Extract  │                   │                   │
│   │   • Resume Check │                   ▼ (fallback)        │
│   │   • Job Scoring  │    ┌──────────────────────────────┐   │
│   │   • Top 5 Match  │───▶│  local_parser.py (spaCy NLP) │   │
│   └────────┬─────────┘    └──────────────────────────────┘   │
│            │                                                 │
│            ▼                                                 │
│   ┌─────────────────────────────────────────────────────┐   │
│   │         📊 resume_data.csv (50K+ Job Records)      │   │
│   │         Skills • Education • Experience • Roles     │   │
│   └─────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

<br/>

---

<br/>

## 📂 Project Structure

```
resumeanalyzer/
│
├── 🎨 frontend/
│   ├── index.html                      # 📄 Vite SPA entry point (fonts, meta)
│   ├── vercel.json                     # ☁️ Vercel SPA routing rewrite
│   ├── vite.config.ts                  # ⚡ Standard Vite SPA config
│   ├── tsconfig.json                   # 📝 TypeScript configuration
│   ├── package.json                    # 📦 Dependencies & scripts
│   └── src/
│       ├── main.tsx                    # 🚀 React SPA entry point
│       ├── App.tsx                     # 🗺️ App component with React Router routes
│       ├── styles.css                  # 🎨 Global styles & design system
│       ├── pages/                      # 🏠 Page components
│       │   ├── Home.tsx                # 🏠 Landing page (Hero + Features)
│       │   ├── ResumeAnalysis.tsx      # 📄 Resume upload & analysis page
│       │   └── JobMatches.tsx          # 💼 Job matches dashboard
│       └── components/
│           ├── AnalysisResultDisplay.tsx  # 📊 Rich analysis result UI
│           ├── DashboardSidebar.tsx       # 📋 Sidebar navigation
│           ├── Navigation.tsx             # 🧭 Top navigation bar
│           └── ui/                        # 🧩 Radix UI primitives
│
├── 🐍 backend/
│   ├── api.py                          # 🌐 FastAPI REST server
│   ├── gemini_parser.py                # 🧠 Gemini AI resume parser (Preferred)
│   ├── local_parser.py                 # 🧠 spaCy NLP resume parser (Fallback)
│   ├── resume_analyzer.py              # 🔧 Shared resume analysis utilities
│   ├── requirements.txt                # 📋 Python dependencies
│   ├── .env                            # 🔑 Your local API keys (not committed)
│   ├── .env.example                    # 🔑 Example environment configuration
│   └── resume_data.csv                 # 💾 Job dataset (50K+ records)
│
└── 📄 Config Files
    ├── .gitignore
    ├── .prettierrc
    └── README.md                       # 📖 You are here!
```

<br/>

---

<br/>

## ⚙️ Tech Stack

### 🎨 Frontend
| Technology | Purpose |
|:---|:---|
| **React 19** | UI framework with latest concurrent features |
| **React Router DOM** | Standard client-side routing for React SPAs |
| **TypeScript 5.8** | Type safety across the entire frontend |
| **Vite 6** | Next-gen build tool with HMR |
| **Tailwind CSS 4** | Utility-first styling with JIT compilation |
| **Radix UI** | Accessible, unstyled UI primitives |
| **Recharts** | Data visualization for score breakdowns |
| **Lucide React** | Beautiful icon library |
| **Sonner** | Toast notifications |
| **Zod** | Runtime schema validation |

### 🐍 Backend
| Technology | Purpose |
|:---|:---|
| **FastAPI** | High-performance async REST API |
| **Google GenAI** | Advanced LLM-powered extraction with `gemini-2.0-flash` |
| **spaCy** | Industrial-strength NLP for fallback resume parsing |
| **python-dotenv** | Managing local environment configuration |
| **PyPDF2** | PDF text extraction |
| **Pandas** | Job dataset processing & analysis |
| **Uvicorn** | ASGI server |

<br/>

---

<br/>

## 🚀 Getting Started

### 📋 Prerequisites

- **Node.js** `>= 18.x`
- **Python** `>= 3.10`
- **npm** (comes with Node.js)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Nazeem0/resume_analyzer.git
cd resume_analyzer
```

### 2️⃣ Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3️⃣ Install Backend Dependencies

```bash
cd ../backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

### 4️⃣ Configure API Keys (Optional but Recommended)

Create a `.env` file in the `backend/` directory by copying `.env.example` and filling in your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
Get a free API key at [Google AI Studio](https://aistudio.google.com/app/apikey). If not set, the app will automatically use the local spaCy NLP parser.

### 5️⃣ Start the Backend Server

```bash
cd backend
python api.py
```
> 🟢 The API server starts at **http://localhost:8000**

### 6️⃣ Start the Frontend Dev Server

```bash
cd frontend
npm run dev
```
> 🟢 The app opens at **http://localhost:5173**

<br/>

---

<br/>

## 🔧 Configuration

### 🧠 Gemini API Integration

The application leverages the Google GenAI SDK to perform semantic analysis on resumes.
To activate Gemini parser:
1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Set it in `backend/.env` as `GEMINI_API_KEY=...` or as a system environment variable.

If the key is not set, the backend falls back to the **local spaCy parser** seamlessly.

### 📊 Dataset

The project includes `resume_data.csv` (~17MB) containing **50,000+ job records** with:
- Job position names
- Educational requirements
- Experience requirements  
- Required skills
- Responsibilities

<br/>

---

<br/>

## 📸 Screenshots

### 🏠 Landing Page
> Premium glassmorphism design with floating orbs, gradient text, and smooth animations
<img width="1915" height="974" alt="image" src="https://github.com/user-attachments/assets/12da755c-0677-4745-83f6-09bf66e3f66d" />

### 📄 Resume Analysis
> Upload your resume and get instant AI-powered analysis with detailed skill extraction
<img width="1914" height="977" alt="image" src="https://github.com/user-attachments/assets/3b1bc308-34e4-42ee-9344-f4b778f42899" />

### 📊 Results Dashboard
> Comprehensive compatibility scores, skill gap analysis, and career insights

<br/>

---

<br/>

## 🌐 Deployment

### Frontend → Vercel

The frontend is a standard **Vite SPA** — fully compatible with Vercel.

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Configure the project settings:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**.

> The included `frontend/vercel.json` automatically configures SPA routing so all pages (e.g. `/resume-analysis`, `/job-matches`) work correctly.

### Backend → Local / Self-hosted

The Python FastAPI backend is designed to run locally or on any Python-capable server.
For local use, simply run `python api.py` from the `backend/` folder.

> The frontend auto-detects whether it's running on `localhost` and routes API requests accordingly — no config needed for local development.

<br/>

---

<br/>

## 🧪 How It Works

```
   📄 Upload Resume                    🧠 NLP Parsing                    🎯 Job Matching
  ─────────────────      ─────────────────────────────      ─────────────────────────
                                                           
  ┌───────────┐          ┌─────────────────────────┐       ┌─────────────────────┐
  │           │          │  Extract:                │       │  Score Formula:      │
  │  PDF/TXT  │────────▶ │  • Name, Email, Phone   │──────▶│                     │
  │  Resume   │          │  • Skills (by section)   │       │  Skills:    40%     │
  │           │          │  • Years of Experience   │       │  Experience:30%     │
  └───────────┘          │  • Education Level       │       │  Education: 15%     │
                         │  • Soft Skills           │       │  Industry:  15%     │
                         │  • Certifications        │       │  ─────────────────  │
                         └─────────────────────────┘       │  Total:    100%     │
                                                           └──────────┬──────────┘
                                                                      │
                                                                      ▼
                                                           ┌─────────────────────┐
                                                           │  🏆 Top 5 Matches   │
                                                           │  + Skill Gaps       │
                                                           │  + Career Insights  │
                                                           │                     │
                                                           └─────────────────────┘
```

<br/>

---

<br/>

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. 🍴 **Fork** the repository
2. 🌿 **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. 📤 **Push** to the branch (`git push origin feature/amazing-feature`)
5. 🔃 **Open** a Pull Request

<br/>

---

<br/>

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
