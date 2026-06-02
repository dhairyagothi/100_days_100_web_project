import { useState,useEffect } from "react";
import "./App.css";

export default function App() {
  const [darkMode,setDarkMode] = useState(()=>{
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  useEffect(()=>{
    localStorage.setItem(
      "theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return(
    <div className={`relative min-h-screen flex flex-col justify-center items-center gap-10 transition-colors duration-700 ${
    darkMode
    ? "bg-black text-white" 
    : "bg-white text-black" }`}>


      <button
        onClick={()=>setDarkMode(!darkMode)}
        className="z-10 border border-gray-400 p-2 rounded-2xl"
      >
        {darkMode? 
        <img src="/sun.svg" alt="" /> :
        <img src="/moon.svg" alt="" /> 
      }
      </button>

      <h1 className="z-10 font-bold text-5xl">Theme Toggler</h1>
      <p className="z-10 text-3xl">Click the button to toggle theme</p>

    </div>
  )
}