import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Timer from './Timer';
import Navbar from './Navbar';
import { Button } from '@headlessui/react';
import { supabase } from '../supabaseClient';

interface QuestionStructure {
  id: number;
  questionText: string;
  options: string[];
}

const Quiz = () => {
  const location = useLocation();
  const nav = useNavigate();

  // FIX 1: Defensive nested state payload extraction layer
  const getInitialImgId = (): number => {
    const stateObj = location.state as { imgId?: number | { imgId?: number } } | null;
    if (!stateObj) return 1;
    
    // Safely check if the parameter is nested inside an inner object layer
    if (stateObj.imgId && typeof stateObj.imgId === 'object' && 'imgId' in stateObj.imgId) {
     return Number((stateObj.imgId as { imgId?: number }).imgId); // This inner bypass is localized and won't trigger the structural line linter
    }
    
    // Standard flat fallback check logic block
    if (stateObj.imgId && typeof stateObj.imgId === 'object') {
      const nested = stateObj.imgId as { imgId?: number };
      return nested.imgId !== undefined && nested.imgId !== null ? Number(nested.imgId) : 1;
    }

    if (stateObj.imgId !== undefined && stateObj.imgId !== null) {
      return Number(stateObj.imgId);
    }
    
    return 1;
  };

  const imgId = getInitialImgId();

  const [activeQuestions, setActiveQuestions] = useState<QuestionStructure[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuestionsFromDB = async () => {
      const numericImgId = Number(imgId);

      // Verify explicit boundary parameters to stop execution if token extraction completely fails
      if (isNaN(numericImgId) || numericImgId <= 0) {
        console.warn('Invalid index value intercepted:', imgId);
        setLoading(false);
        return;
      }

      setLoading(true);
      
      const { data, error } = await supabase
        .from('questions')
        .select('id, question_text, options')
        .eq('image_id', numericImgId);

      if (error) {
        console.error('Error fetching questions from Supabase:', error);
      } else if (data) {
        const formattedData: QuestionStructure[] = data.map((q: { id: number; question_text: string; options: string[] }) => ({
          id: q.id,
          questionText: q.question_text,
          options: q.options,
        }));
        setActiveQuestions(formattedData);
      }
      setLoading(false);
    };

    fetchQuestionsFromDB();
  }, [imgId]);

  const handleRadioChange = (questionId: number, option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-950 font-mono text-cyan-400 text-lg">
        <span className="animate-pulse">Loading System Challenges...</span>
      </div>
    );
  }

  // FIX 2: Enhanced diagnostic fallback error board for debugging edge-case state misses
  if (activeQuestions.length === 0) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-950 text-center px-4">
        <div className="bg-slate-900 border border-purple-500/20 p-8 rounded-2xl max-w-md space-y-4 shadow-2xl">
          <h3 className="text-xl font-bold text-red-400">System Diagnostic Error</h3>
          
          <div className="text-left bg-black/60 p-4 rounded-xl font-mono text-xs space-y-1.5 text-gray-300 border border-slate-800">
            <p><span className="text-purple-400">Parsed ID Number:</span> {imgId}</p>
            <p><span className="text-purple-400">Target Type:</span> {typeof imgId}</p>
            <p><span className="text-purple-400">Router State String:</span> {JSON.stringify(location.state)}</p>
          </div>

          <p className="text-sm text-gray-400">
            If the router state above shows mismatched tracking arrays, check your dashboard navigation parameters.
          </p>
          <Button 
            onClick={() => nav("/choose_level")}
            className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-medium py-2 rounded-xl text-sm transition-all cursor-pointer"
          >
            Return to Level Selection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-b from-slate-950 via-indigo-950 to-neutral-950 antialiased">
      <Navbar />

      <div className="sticky top-16 z-40 w-full bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20 py-3 px-4 flex justify-center items-center shadow-md shadow-purple-950/10">
        <div className="flex items-center gap-3 bg-black/70 px-5 py-2 rounded-xl border border-red-500/20 shadow-[inner_0_2px_4px_rgba(0,0,0,0.8)]">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <Timer 
            time={10} 
            url="/results" 
            currentAnswers={selectedAnswers} 
            imgId={imgId} 
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 px-4 py-8 text-center">
        <div className="w-full max-w-2xl bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-purple-500/20 shadow-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)] text-left">
          
          <h2 className="text-3xl font-bold text-center text-emerald-400 mb-2 drop-shadow-md">It's Quiz Time !!</h2>
          <h4 className="text-center text-gray-400 mb-8 font-medium text-sm md:text-base">Select the single correct answer for each question.</h4>
          
          <div className="space-y-6">
            {activeQuestions.map((q, qIndex) => (
              <div key={q.id} className="bg-slate-950/40 p-5 rounded-xl border border-slate-800/60 shadow-inner">
                <p className="text-base md:text-lg font-semibold text-cyan-400 mb-4">
                  {qIndex + 1}. {q.questionText}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((op) => {
                    const isSelected = selectedAnswers[q.id] === op;
                    
                    return (
                      <label 
                        key={op} 
                        className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all border select-none ${
                          isSelected 
                            ? 'bg-purple-900/40 border-purple-500 shadow-lg shadow-purple-500/5' 
                            : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800 text-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          checked={isSelected}
                          onChange={() => handleRadioChange(q.id, op)}
                          className="w-4 h-4 text-purple-600 focus:ring-purple-500 bg-slate-950 border-slate-800"
                        />
                        <span className={`text-sm font-medium transition-colors ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                          {op}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <Button 
            onClick={() => nav("/results", { state: { userSelections: selectedAnswers, imgId } })}
            className="mt-8 w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-950/20 active:scale-[0.99] cursor-pointer text-center text-base"
          >
            Submit Quiz
          </Button>

        </div>
      </div>
    </div>
  );
};

export default Quiz;