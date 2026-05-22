import { FileSignature } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <FileSignature size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
              AI Resume Analyzer
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Dashboard</Link>
            <a href="#" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">How it works</a>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95">
              Try Pro
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
