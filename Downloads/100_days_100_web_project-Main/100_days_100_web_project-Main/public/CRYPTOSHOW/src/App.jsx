import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Coin from './pages/Coin/Coin';
import News from './pages/news/Newses';
import Footer from './components/Footer/Footer';
import Converter from './pages/converter/Converter';

const App = () => {
  return (
    <div className='app'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/coin/:coinId' element={<Coin />} />
        <Route path='/news' element={<News />} />
        <Route path='/converter' element={<Converter />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
