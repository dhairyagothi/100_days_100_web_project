import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Todolist from './components/Todolist';
import Settings from './components/Settings';

function App() {
  const DarkMode = (localStorage.getItem('DarkMode') || "true") === "true";
  const [ isDarkModeOn, setIsDarkModeOn ] = useState<boolean>(DarkMode);
  const toggleDarkMode = () => {
    setIsDarkModeOn(!isDarkModeOn);
    localStorage.setItem('DarkMode', (!isDarkModeOn).toString());
  }

  return (
    <div className={`min-h-screen w-full ${isDarkModeOn ? "dark bg-slate-950 text-slate-50" : "text-slate-950 bg-slate-50"}`}>
      <Header isDarkModeOn={isDarkModeOn} toggleDarkMode={toggleDarkMode} />
      <Todolist />
      <Settings />
    </div>
  )
}

export default App
