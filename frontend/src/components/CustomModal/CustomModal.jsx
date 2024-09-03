// components/CustomModal.js
import React from 'react';
import './CustomModal.css'; // Create a corresponding CSS file for styles

export const CustomModal = ({ show, onClose, onConfirm, message }) => {
  if (!show) return null;

  return (
    <div className="custom-modal">
      <div className="custom-modal-content">
        <p>{message}</p>
        <button className="modal-button confirm" onClick={onConfirm}>Yes</button>
        <button className="modal-button cancel" onClick={onClose}>No</button>
      </div>
    </div>
  );
};


