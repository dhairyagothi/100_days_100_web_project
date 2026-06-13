import React from 'react';

export default function BackButton() {
  return (
    <a 
      href="../../../../index.html" 
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        padding: '10px 15px',
        backgroundColor: '#fff',
        color: '#333',
        textDecoration: 'none',
        borderRadius: '5px',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        zIndex: 1000,
        fontFamily: 'sans-serif'
      }}
    >
      &larr; Back to Projects
    </a>
  );
}
