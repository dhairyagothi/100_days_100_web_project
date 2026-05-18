import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import UploadResume from "./components/UploadResume";
import ResultPage from "./components/ResultPage";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#0d1627] text-white selection:bg-blue-500/30">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-start py-8">
          <Routes>
            <Route path="/" element={<UploadResume />} />
            <Route path="/result" element={<ResultPage />} />
          </Routes>
        </main>

        <footer className="py-8 border-t border-slate-700/30 text-center">
          <p className="text-slate-500 text-sm">
            &copy; 2024 AI Resume Analyzer • Built for modern careers
          </p>
        </footer>
      </div>

    </Router>
  );
}

export default App;