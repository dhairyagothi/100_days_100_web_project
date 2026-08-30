# 🚀 AI Resume Analyzer (Advanced ATS Platform)

An intelligent, full-stack open-source platform designed to parse, deeply analyze, and optimize your resume against Applicant Tracking Systems (ATS) through granular AI metrics.

Built with a highly responsive, modern glassmorphic interface, this tool guarantees professionals can tailor their resumes through brutal accuracy, section completion validation, project grading, readability optimization, and powerful phrasing enhancements.

## ✨ Advanced Mega-Prompt AI Pipeline

Unlike traditional tools that send a single massive request or trigger rate limits, this application guarantees lightning-fast token streaming by implementing a complex **Mega-Payload ATS Evaluator** using **Groq's hyper-fast Llama 3.3 70B Versatile** engine to ensure extremely reliable, non-hallucinating outputs:

1. **Step 1: Structural Parsing** - Extracts raw document text strictly matching standard JSON components (Education, Experience, Custom Skills).
2. **Step 2: ATS Score Calculation** - Evaluates foundational layout restrictions, contact info presence, and formatting weight ratios dynamically.
3. **Step 3: Deep Keyword Matrix** - Runs concurrently. Segments naturally integrated keywords versus critical missing/preferred keywords matched directly against active Job Descriptions.
4. **Step 4: Content Quality AI** - Runs concurrently. Hunts for metric-void sentences and overused weak verbs (`"worked on"` vs `"architected"`).
5. **Step 5: Prioritized Recommendations** - Evaluates the combined AI analyses to output a prioritized list of critical action plans, complete with time estimates and exact Before/After execution examples!

## 💻 Tech Stack

**Frontend:**
- [React.js](https://react.dev/) (via [Vite](https://vitejs.dev/))
- [Tailwind CSS v4](https://tailwindcss.com/)
- [React Router DOM](https://reactrouter.com/) (Multi-page routing mechanism)
- [Lucide React](https://lucide.dev/) (Aesthetic SVGs & Iconography)

**Backend:**
- [Node.js](https://nodejs.org/en/) & [Express.js](https://expressjs.com/)
- [Multer](https://github.com/expressjs/multer) & [Mammoth](https://www.npmjs.com/package/mammoth) (Document ingestion)
- [Groq SDK](https://www.npmjs.com/package/groq-sdk) (Lightning-fast AI inference using LLaMA models structured directly to JSON formats)

## 🛠 Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd AI_Resume_Analyzer
   ```

2. **Frontend Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Backend Setup**
   Open a new terminal window / tab:
   ```bash
   cd server
   npm install
   ```

4. **Environment Configuration**
   In the `/server` directory, create a `.env` file and securely add your active Groq API key:
   ```env
   PORT=5000
   GROQ_API_KEY=your_groq_api_key_here
   ```

5. **Start the Backend server**
   ```bash
   npm run dev
   ```

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to fork this project, submit a PR, or open an issue to expand our AI ATS matrix constraints.

## 📝 License
This project is open-source and free to use.
