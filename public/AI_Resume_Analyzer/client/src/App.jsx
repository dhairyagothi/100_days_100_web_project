import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import UploadResume from "./components/UploadResume";
import ResultPage from "./components/ResultPage";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#0d1627] text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<UploadResume />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;