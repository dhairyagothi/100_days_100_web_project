import React from "react";

const ConfirmDelete = ({ onClose, handleDeleteAllCaptions }) => {
  return (
    <div className="confirm-delete">
      <p className="settings-hint">
        This will permanently delete all saved captions. This action cannot be
        undone.
      </p>

      <div className="settings-actions">
        <button className="settings-clear-btn" onClick={onClose}>
          Cancel
        </button>

        <button
          className="settings-save-btn !bg-red-500 hover:!bg-red-600"
          onClick={handleDeleteAllCaptions}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ConfirmDelete;
