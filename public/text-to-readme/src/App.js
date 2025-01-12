import React, { useEffect, useState } from 'react';
import './App.css';
import Editor from './components/editor/Editor';
import AlertBox from './components/alert/AlertBox';
import { Typewriter } from 'react-simple-typewriter'

const App = () => {
  const [isPc, setIsPc] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      // Check if screen width is greater than 768px (PC or larger devices)
      if (window.innerWidth <= 768) {
        setIsPc(false);
        setShowAlert(true); // Show the alert when it's not a PC
      } else {
        setIsPc(true);
      }
    };

    // Check screen size on initial load
    checkScreenSize();

    // Add event listener to handle resizing
    window.addEventListener('resize', checkScreenSize);

    // Cleanup the event listener
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const handleCloseAlert = () => {
    setShowAlert(false); // Close the alert box
  };

  return (
    <div className="App">
      {showAlert && <AlertBox message="Please load on a PC for better experience" onClose={handleCloseAlert} />}
      {isPc && (
        <>
          <h1 className="app-h1">
          <Typewriter
            words={['Welcome to Text2Readme']}
            cursor
            cursorBlinking
            cursorStyle='!'
            typeSpeed={70}
          />
          </h1>
          <Editor />
        </>
      )}
    </div>
  );
};

export default App;
