import React from 'react';
import '../styles/Home.css';
import Dashboard from "../components/Dashboard";
 

function Home() {
  return (
    <div className="container mt-5">
      <h2>Welcome to MuseMeter</h2>
      <p>Track and relive the art that moves you — books, movies, poems, and more.</p>
      <Dashboard />
    </div>
  );

}

export default Home;
