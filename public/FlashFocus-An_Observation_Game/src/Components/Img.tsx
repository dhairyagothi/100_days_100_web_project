import React, { useState } from 'react';
import Timer from './Timer';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

import obs1 from '../assets/obs1.jpeg';
import obs2 from '../assets/obs2.jpg';
import obs3 from '../assets/obs3.jpeg';
import obs4 from '../assets/obs4.jpeg';

function randomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const Img = () => {
  const time: Record<string, number> = {
    'Level 1' : 15,
    'Level 2' : 10,
    'Level 3' : 5
  };

  // Map database primary key integer IDs to the locally imported asset variables
  const imageMapping: Record<number, string> = {
    1: obs1,
    2: obs2,
    3: obs3,
    4: obs4
  };

  const location = useLocation();
  const { difficulty } = (location.state as { difficulty: string }) || { difficulty: 'Level 1' };

  const [imgId] = useState<number>(() => randomInt(1, 2));
  
  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-b from-slate-950 via-indigo-950 to-neutral-950 text-center antialiased">
      {/* Navbar stays fixed at top */}
      <Navbar />

      {/* Sticky Digital Clock Header Bar */}
      <div className="sticky top-16 z-40 w-full bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20 py-3 px-4 flex justify-center items-center shadow-md shadow-purple-950/10">
        {/* Adjusted spacing to align perfectly with the formatted double-digit time string */}
        <div className="flex items-center gap-3 bg-black/70 px-5 py-2 rounded-xl border border-red-500/20 shadow-[inner_0_2px_4px_rgba(0,0,0,0.8)]">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          
          {/* Props are passed exactly the same way, but the rendered output will look like 00:15 */}
          <Timer 
  time={time[difficulty]} 
  url="/quiz" 
  imgId={imgId} // Pass the generated random image ID down to the timer
  currentAnswers={{}} // Pass an empty object since no questions are answered yet
/>
        </div>
      </div>
      
      {/* Centered Main Image Gameplay Body */}
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-8">
        <div className="w-full max-w-2xl bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-purple-500/20 shadow-2xl shadow-[0_0_50px_rgba(168,85,247,0.1)]">
          <img 
            src={imageMapping[imgId]} // Renders the loaded asset smoothly
            alt="Observation Challenge" 
            className="w-full max-h-[65vh] object-contain rounded-xl select-none pointer-events-none" 
          />
        </div>
      </div>
    </div>
  );
};

export default Img;