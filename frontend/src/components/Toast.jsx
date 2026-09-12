import React from 'react';

export default function Toast({ message, isVisible }) {
  return (
    <div className={`toast ${isVisible ? 'show' : ''}`} id="toast">
      <i className="fa-solid fa-circle-check toast-icon"></i>
      <span id="toastMsg">{message}</span>
    </div>
  );
}
