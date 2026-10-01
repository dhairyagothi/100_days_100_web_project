import React from 'react';

export default function BackButton() {
  return (
    /* Back navigation link to the main projects page. */
    <a 
      href="../../../../index.html" 
      style={{
        /* Position the button in the top-left corner. */
        position: 'absolute',
        top: '20px',
        left: '20px',
        /* Basic visual styling for the button. */
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
      {/* Button label */}
      &larr; Back to Projects
    </a>
  );
}
