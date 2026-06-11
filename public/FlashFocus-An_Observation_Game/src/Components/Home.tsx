import React from 'react';
import { ArrowRightCircle, HelpCircle } from 'lucide-react';
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const nav = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-b from-slate-950 via-indigo-950 to-neutral-950 px-4 py-12 text-center antialiased">      
      {/* Container Card with added deep ambient glow and gentle entry animation */}
      <div className="w-full max-w-xl bg-slate-900/50 backdrop-blur-md p-8 md:p-10 rounded-2xl border border-purple-500/20 shadow-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col items-center transition-all duration-300 transform">
        
        {/* Title Logo Wrapper */}
        <div className="mb-8">
          <img 
            src={Logo} 
            alt="FlashFocus" 
            className="w-64 h-24 object-contain drop-shadow-[0_4px_12px_rgba(168,85,247,0.3)]" 
          />
        </div>

        {/* Instructions Header */}
        <div className="flex items-center gap-2 mb-5 border-b border-slate-700/50 pb-2 w-full justify-center">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          <h3 className="text-xl font-bold tracking-widest uppercase text-emerald-400 drop-shadow-sm">
            Instructions
          </h3>
        </div>

        {/* Core Instruction Text */}
        <p className="text-gray-300 text-base md:text-lg font-medium max-w-sm mb-5 leading-relaxed">
          An image will flash on your screen based on your chosen difficulty level:
        </p>

        {/* Difficulty Levels Matrix */}
        <div className="w-full max-w-xs bg-slate-950/50 border border-slate-800/60 rounded-xl p-4 mb-6 shadow-inner">
          <ul className="space-y-3 font-semibold text-sm md:text-base text-left">
            <li className="flex justify-between items-center bg-slate-900/40 px-3 py-2 rounded-lg border-l-4 border-cyan-400">
              <span className="text-gray-300 font-normal">Difficulty Level 1</span>
              <span className="text-cyan-400 font-mono tracking-wide">15 seconds</span>
            </li>
            <li className="flex justify-between items-center bg-slate-900/40 px-3 py-2 rounded-lg border-l-4 border-yellow-400">
              <span className="text-gray-300 font-normal">Difficulty Level 2</span>
              <span className="text-yellow-400 font-mono tracking-wide">10 seconds</span>
            </li>
            <li className="flex justify-between items-center bg-slate-900/40 px-3 py-2 rounded-lg border-l-4 border-pink-500">
              <span className="text-gray-300 font-normal">Difficulty Level 3</span>
              <span className="text-pink-500 font-mono tracking-wide">5 seconds</span>
            </li>
          </ul>
        </div>

        {/* Additional Rules Wrapper */}
        <div className="space-y-2.5 max-w-sm mb-8 text-sm md:text-base text-gray-300 border-t border-slate-700/30 pt-5 w-full">
          <p className="leading-relaxed">
            After the image disappears, you must answer the subsequent tracking questions within <span className="text-purple-400 font-semibold font-mono">10s</span>.
          </p>
          <p className="leading-relaxed text-slate-400 text-xs md:text-sm italic">
            Your final performance evaluation metrics will be displayed instantly upon completion.
          </p>
        </div>

        {/* Greeting / CTA Section */}
        <div className="w-full space-y-5">
          {/* Cleaned text string without rotating icon elements */}
          <p className="text-lg font-bold tracking-widest uppercase text-emerald-400 drop-shadow-md">
            All the best !!
          </p>

          <button 
            onClick={() => nav("/choose_level")} 
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 border border-cyan-500/20 text-white text-base font-semibold py-3.5 px-12 rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-500/10 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-purple-500/40"
          >
            <span>Get Started</span>
            <ArrowRightCircle className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Home;