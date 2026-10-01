import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightCircle, Layers } from 'lucide-react';

import Navbar from './Navbar';
import Dropbox from './Dropbox';

const Choose_level = () => {
  const nav = useNavigate();
  const options = [
    'Select difficulty level',
    'Level 1',
    'Level 2',
    'Level 3'
  ];
  const [select, setSelect] = useState<string>(options[0]);

  // Logic Verification: Check if the user has actually chosen a valid game level
  const isValidSelection = select !== options[0];

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-b from-slate-950 via-indigo-950 to-neutral-950 text-center antialiased">
      <Navbar />
      
      {/* Centered Content Wrapper */}
      <div className='flex flex-col items-center justify-center flex-1 px-4 py-12'>
        
        {/* Balanced container card matching Home screen structure */}
        <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-md p-8 md:p-10 rounded-2xl border border-purple-500/20 shadow-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col items-center space-y-8">
          
          {/* Header Section */}
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/30 text-purple-400">
              <Layers className="w-6 h-6" />
            </div>
            <p className='text-blue-400 text-xl font-semibold tracking-wide mt-2'>
              Select Difficulty Level
            </p>
          </div>
          
          {/* Custom Select Box */}
          <div className="w-full">
            <Dropbox options={options} selected={select} onChange={setSelect} />
          </div>
          
          {/* Dynamic Next Action Control Button */}
          <button 
            disabled={!isValidSelection}
            onClick={() => nav("/img", { state: { difficulty: select } })} 
            className={`w-full sm:w-auto flex items-center justify-center gap-2 text-white text-base font-semibold py-3.5 px-10 rounded-xl transition-all duration-200 shadow-lg border outline-none focus:ring-2 ${
              isValidSelection 
                ? 'bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 border-cyan-500/20 shadow-purple-500/10 hover:shadow-purple-500/20 active:scale-[0.98] focus:ring-purple-500/40 cursor-pointer' 
                : 'bg-slate-800/50 border-slate-700/40 text-gray-500 cursor-not-allowed opacity-60'
            }`}
          >
            <span>Next</span>
            <ArrowRightCircle className="w-5 h-5" />
          </button>

        </div>
      </div>
    </div>
  )
}

export default Choose_level;