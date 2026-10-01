import './App.css';
import React, { useEffect, useState } from 'react';

import Header from './MyComponents/header';
import Footer from './MyComponents/footer';
import Product from './MyComponents/product';

function App() {

  // ✅ Theme persisted in localStorage
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <>
      <Header toggleTheme={toggleTheme} theme={theme} />
      <Product />
      <Footer />
    </>
  );
}

export default App;
