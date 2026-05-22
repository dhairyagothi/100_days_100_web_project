import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import Home from "./pages/Home";
import ResumeAnalysis from "./pages/ResumeAnalysis";
// Import JobMatches page
import JobMatches from "./pages/JobMatches";

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resume-analysis" element={<ResumeAnalysis />} />
        <Route path="/job-matches" element={<JobMatches />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
