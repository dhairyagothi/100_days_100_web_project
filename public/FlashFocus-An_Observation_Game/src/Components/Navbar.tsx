import React from 'react';
import Logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const nav = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full bg-indigo-900/80 backdrop-blur-md border-b border-purple-500/20 shadow-lg shadow-purple-950/20">
      <div className="w-full h-16 flex items-center justify-start px-4 sm:px-6">
        
        {/* Scaled-down clickable logo wrapper */}
        <div 
          onClick={() => nav("/")} 
          className="flex items-center cursor-pointer active:scale-98 transition-transform h-full py-3.5"
        >
          <img 
            src={Logo} 
            alt="FlashFocus" 
            className="h-full w-auto object-contain" 
          />
        </div>

      </div>
    </header>
  );
};

export default Navbar;