import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@headlessui/react';
import Navbar from './Navbar';
import { supabase } from '../supabaseClient'; // Make sure this path points to your setup file

const Results = () => {
  const location = useLocation();
  const nav = useNavigate();

  const state = location.state as { userSelections?: Record<number, string>; imgId?: number } | null;
  const userSelections = state?.userSelections || {};
  const imgId = state?.imgId || 1;

  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const calculateScoreFromDB = async () => {
      setLoading(true);
      
      // Fetch the correct answers matching the loaded image challenge directly from the cloud
      const { data, error } = await supabase
        .from('questions')
        .select('id, correct_option')
        .eq('image_id', imgId);

      if (error) {
        console.error('Error fetching verification keys:', error);
      } else if (data) {
        let calculatedScore = 0;

        // Verify the user selections against the database truth keys
        data.forEach((q: { id: number; correct_option: string }) => {
          const userSelected = userSelections[q.id];
          if (userSelected === q.correct_option) {
            calculatedScore += 1;
          }
        });

        setScore(calculatedScore);
      }
      setLoading(false);
    };

    calculateScoreFromDB();
  }, [imgId, userSelections]);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-950 font-mono text-cyan-400 text-lg">
        <span className="animate-pulse">Calculating Your Score...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-b from-slate-950 via-indigo-950 to-neutral-950 antialiased">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-md p-8 md:p-10 rounded-2xl border border-purple-500/20 shadow-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)] space-y-6">
          <h3 className="text-sm font-bold tracking-widest uppercase text-purple-400">Time Up !!</h3>
          <h2 className="text-2xl font-bold text-gray-200">Your Final Score</h2>
          
          {/* Render verified database calculated score */}
          <h1 className="text-7xl font-black text-emerald-400 font-mono drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
            {score}
          </h1>
          
          <Button 
            onClick={() => nav("/choose_level")}
            className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 border border-cyan-500/20 text-white text-base font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-500/20 active:scale-[0.98] cursor-pointer"
          >
            Play Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;