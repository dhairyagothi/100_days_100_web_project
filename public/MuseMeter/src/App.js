import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AddEntry from './pages/AddEntry';
import ViewEntries from './pages/ViewEntries';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
           <Route path="/" element={<Home />} />
          <Route path="/" element={<AddEntry />} />
          <Route path="/add" element={<AddEntry />} />
          <Route path="/view" element={<ViewEntries />} />
        </Routes>
      </div>
    </>
  );
}

export default App;


