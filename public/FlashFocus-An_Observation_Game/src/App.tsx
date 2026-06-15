import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Components/Home";
import Choose_level from "./Components/Choose_level";
import Img from "./Components/Img";
import Quiz from "./Components/Quiz";
import Results from "./Components/Results";

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen bg-slate-950 text-white overflow-x-hidden selection:bg-purple-500/30">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/choose_level" element={<Choose_level/>}/>
          <Route path="/img" element={<Img/>}/>
          <Route path="/quiz" element={<Quiz/>}/>
          <Route path="/results" element={<Results/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;