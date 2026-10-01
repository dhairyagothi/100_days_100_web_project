import React from 'react'

function ThemeToggle({ theme, setTheme }) {
    const themetoggle=()=>{
        setTheme(theme === "light" ? "dark" : "light");
    }
  return (
    <button className="btn" onClick={themetoggle}>
      {theme === "light" ? "🌙Dark Mode" : "☀️Light Mode"}
    </button>
  )
}

export default ThemeToggle;
