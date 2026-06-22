import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface TimerProps {
  time: number;
  url: string;
  currentAnswers?: Record<number, string>;
  imgId?: number;
}

const Timer: React.FC<TimerProps> = ({ time, url, currentAnswers = {}, imgId }) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(time);
  const navigate = useNavigate();

  // Effect 1: Handles the 1-second interval countdown ticker loop
  useEffect(() => {
    if (secondsLeft <= 0) return;

    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [secondsLeft]);

  // Effect 2: FIXES THE BUG - Safely manages the page navigation side-effect after rendering is complete
  useEffect(() => {
    if (secondsLeft === 0) {
      navigate(url, { 
        state: { 
          userSelections: currentAnswers, 
          imgId 
        } 
      });
    }
  }, [secondsLeft, navigate, url, currentAnswers, imgId]);

  // Format seconds into a clean MM:SS presentation format
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-xl md:text-2xl font-black font-mono tracking-wider text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.2)] select-none">
      {formatTime(secondsLeft)}
    </div>
  );
};

export default Timer;