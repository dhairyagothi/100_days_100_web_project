import React from "react";

const Modal = ({ children, isOpen, onClose, title="Modal Title" }) => {
  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div
        className="settings-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className="settings-header">
          <h2 id="settings-title">{title}</h2>
          <button
            className="settings-close"
            onClick={onClose}
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <div className="settings-body">
          {React.cloneElement(children, {
            isOpen,
            onClose,
          })}
        </div>
      </div>
    </div>
  );
};

export default Modal;
