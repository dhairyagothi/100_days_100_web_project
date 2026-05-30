import React from 'react';
import './alertbox.css';

const AlertBox = ({ message, onClose }) => {
  return (
    <div className="alert-overlay">
      <div className="alert-box">
        <h2 className="alert-title">Notice</h2>
        <p className="alert-message">{message}</p>
        <button className="alert-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AlertBox;
